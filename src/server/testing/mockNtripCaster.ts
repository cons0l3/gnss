import net from "node:net";

const { crc24 } = require("ntrip-decoder/lib/crc24") as {
    crc24: (data: Buffer) => number;
};

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
    const crc = crc24(body);
    return Buffer.concat([body, Buffer.from([(crc >> 16) & 0xff, (crc >> 8) & 0xff, crc & 0xff])]);
}

/**
 * A minimal NTRIP caster standing in for the SAPOS service in tests.
 *
 * - Parses the client's `GET /mountpoint HTTP/1.1` request (mountpoint,
 *   Basic-auth credentials, headers).
 * - Replies with `reply` (default "ICY 200 OK").
 * - `push()` writes raw bytes (e.g. `rtcmFrame(...)`) to every client.
 * - Everything the client sends after the handshake is captured as NMEA
 *   lines in `gga` (the client's periodic position reports).
 */
export class MockNtripCaster {
    readonly requests: CasterRequest[] = [];
    readonly gga: string[] = [];
    port = 0;

    private server = net.createServer((socket) => this.handleConnection(socket));
    private sockets = new Set<net.Socket>();

    constructor(private reply = "ICY 200 OK\r\n") { }

    start(): Promise<this> {
        return new Promise((resolve, reject) => {
            this.server.once("error", reject);
            this.server.listen(0, "127.0.0.1", () => {
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

        socket.on("data", (chunk) => {
            const data = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string);
            buf = Buffer.concat([buf, data]);

            if (!handshaken) {
                const end = buf.indexOf("\r\n\r\n");
                if (end < 0) return;
                this.requests.push(parseRequest(buf.slice(0, end).toString()));
                buf = buf.slice(end + 4);
                socket.write(this.reply);
                handshaken = true;
            }

            // after the handshake the client only sends NMEA GGA lines
            let eol: number;
            while ((eol = buf.indexOf("\r\n")) >= 0) {
                const line = buf.slice(0, eol).toString();
                if (line.length > 0) this.gga.push(line);
                buf = buf.slice(eol + 2);
            }
        });

        const drop = () => this.sockets.delete(socket);
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
