import net from "node:net";

/**
 * Bitwise CRC-24Q (poly 0x1864CFB, init 0, no reflection/final xor) as used
 * by RTCM3. Implemented here so the mock caster has zero npm dependencies
 * and can run standalone in its own container.
 */
export function crc24q(data: Uint8Array): number {
    let crc = 0;
    for (const byte of data) {
        crc ^= byte << 16;
        for (let i = 0; i < 8; i++) {
            crc <<= 1;
            if (crc & 0x1000000) crc ^= 0x1864cfb;
            crc &= 0xffffff;
        }
    }
    return crc;
}

export type CasterRequest = {
    mountpoint: string;
    authorization: string | null;
    /** decoded "username:password" from the Basic auth header */
    credentials: string | null;
    userAgent: string | null;
    headers: Record<string, string>;
};

/**
 * Builds a valid RTCM3 frame: 0xd3 preamble + 10-bit length + payload + CRC-24Q.
 * The ntrip-client decoder drops frames that fail the CRC check, so tests have
 * to push real frames, not arbitrary bytes.
 */
export function rtcmFrame(payload: Buffer): Buffer<ArrayBuffer> {
    const header = Buffer.from([0xd3, (payload.length >> 8) & 0x03, payload.length & 0xff]);
    const body = Buffer.concat([header, payload]);
    const crc = crc24q(body);
    return Buffer.concat([body, Buffer.from([(crc >> 16) & 0xff, (crc >> 8) & 0xff, crc & 0xff])]);
}

export type MockNtripCasterOptions = {
    /** handshake reply, default "ICY 200 OK\r\n" */
    reply?: string;
    /** periodically push rtcmFrame(payload) to every connected client */
    stream?: { intervalMs: number; payload: Buffer };
    onRequest?: (req: CasterRequest) => void;
    onNmea?: (line: string) => void;
};

/**
 * A minimal NTRIP caster standing in for the SAPOS service.
 *
 * - Parses the client's `GET /mountpoint HTTP/1.1` request (mountpoint,
 *   Basic-auth credentials, headers) and accepts any credentials.
 * - Replies with `reply` (default "ICY 200 OK").
 * - Optionally streams RTCM frames at a fixed interval to every client.
 * - `push()` writes raw bytes (e.g. `rtcmFrame(...)`) to every client.
 * - Everything the client sends after the handshake is captured as NMEA
 *   lines in `gga` (the client's periodic position reports).
 */
export class MockNtripCaster {
    readonly requests: CasterRequest[] = [];
    readonly gga: string[] = [];
    port = 0;

    private options: MockNtripCasterOptions;
    private server = net.createServer((socket) => this.handleConnection(socket));
    private sockets = new Set<net.Socket>();

    constructor(options: MockNtripCasterOptions | string = {}) {
        this.options = typeof options === "string" ? { reply: options } : options;
    }

    start(port = 0): Promise<this> {
        return new Promise((resolve, reject) => {
            this.server.once("error", reject);
            this.server.listen(port, "0.0.0.0", () => {
                const addr = this.server.address();
                this.port = typeof addr === "object" && addr ? addr.port : 0;
                resolve(this);
            });
        });
    }

    push(data: Buffer): void {
        for (const socket of this.sockets) socket.write(data);
    }

    async close(): Promise<void> {
        for (const socket of this.sockets) socket.destroy();
        this.sockets.clear();
        await new Promise<void>((resolve) => this.server.close(() => resolve()));
    }

    private handleConnection(socket: net.Socket): void {
        this.sockets.add(socket);
        let buf: Buffer = Buffer.alloc(0);
        let handshaken = false;
        let streamTimer: NodeJS.Timeout | null = null;

        socket.on("data", (chunk) => {
            const data = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string);
            buf = Buffer.concat([buf, data]);

            if (!handshaken) {
                const end = buf.indexOf("\r\n\r\n");
                if (end < 0) return;
                const req = parseRequest(buf.slice(0, end).toString());
                this.requests.push(req);
                this.options.onRequest?.(req);
                buf = buf.slice(end + 4);
                socket.write(this.options.reply ?? "ICY 200 OK\r\n");
                handshaken = true;

                const stream = this.options.stream;
                if (stream) {
                    streamTimer = setInterval(() => {
                        socket.write(rtcmFrame(stream.payload));
                    }, stream.intervalMs);
                }
            }

            // after the handshake the client only sends NMEA GGA lines
            let eol: number;
            while ((eol = buf.indexOf("\r\n")) >= 0) {
                const line = buf.slice(0, eol).toString();
                if (line.length > 0) {
                    this.gga.push(line);
                    this.options.onNmea?.(line);
                }
                buf = buf.slice(eol + 2);
            }
        });

        const drop = () => {
            if (streamTimer) clearInterval(streamTimer);
            this.sockets.delete(socket);
        };
        socket.on("close", drop);
        socket.on("error", drop);
    }
}

function parseRequest(header: string): CasterRequest {
    const [requestLine, ...headerLines] = header.split("\r\n");
    const mountpoint = requestLine!.split(" ")[1]?.replace(/^\//, "") ?? "";

    const headers: Record<string, string> = {};
    for (const line of headerLines) {
        const sep = line.indexOf(":");
        if (sep > 0) headers[line.slice(0, sep).trim().toLowerCase()] = line.slice(sep + 1).trim();
    }

    const authorization = headers["authorization"] ?? null;
    const credentials = authorization?.startsWith("Basic ")
        ? Buffer.from(authorization.slice(6), "base64").toString()
        : null;

    return {
        mountpoint,
        authorization,
        credentials,
        userAgent: headers["user-agent"] ?? null,
        headers,
    };
}
