import type { WebSocketHandler } from "bun";
import { BufferCoalescer } from "./BufferCoalescer";
import { Buffer } from "buffer";
import { NTRIPConfig } from "../config";
import { logger } from "./logger";

const wsLog = logger.child({ module: "ws" });
const ntripLog = logger.child({ module: "ntrip" });

export interface NtripClientLike {
    run(): void;
    close(): void;
    setXYZ(xyz: number[]): void;
    on(event: "data", cb: (data: Uint8Array) => void): unknown;
    on(event: "close", cb: () => void): unknown;
    on(event: "error", cb: (err: unknown) => void): unknown;
}

export type NtripClientOptions = {
    host: string;
    port: number;
    mountpoint: string;
    username: string;
    password: string;
    xyz: number[];
    interval: number;
    timeout?: number;
    reconnectInterval?: number;
};

export type NtripClientFactory = (options: NtripClientOptions) => NtripClientLike;

const { NtripClient } = require("ntrip-client") as {
    NtripClient: new (options: NtripClientOptions) => NtripClientLike;
};

const defaultFactory: NtripClientFactory = (options) => new NtripClient(options);

type ConnectionState = {
    coalescer: BufferCoalescer;
    ntripClient: NtripClientLike | null;
    streamReady: boolean;
};

export class NTRIPWebSocketHandler implements WebSocketHandler<string> {
    private connections = new WeakMap<object, ConnectionState>();

    constructor(
        private createClient: NtripClientFactory = defaultFactory,
        private config: Partial<NtripClientOptions> = {},
    ) { }

    open = (ws: Bun.ServerWebSocket<string>): void => {
        wsLog.info({ client: ws.remoteAddress }, "client connected");
        const coalescer = new BufferCoalescer((data) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(data.toBase64());
            }
        });
        this.connections.set(ws, { coalescer, ntripClient: null, streamReady: false });
    }

    close = (
        ws: Bun.ServerWebSocket<string>,
        code: number,
        reason: string,
    ): void => {
        const state = this.connections.get(ws);
        this.connections.delete(ws);
        if (!state) return;

        wsLog.info({ client: ws.remoteAddress, code, reason }, "client disconnected");
        state.coalescer.dispose();
        if (state.ntripClient) {
            ntripLog.info("closing caster connection");
            state.ntripClient.close();
        }
    }

    message = (
        ws: Bun.ServerWebSocket<string>,
        message: string | Buffer,
    ): void => {
        const state = this.connections.get(ws);
        if (!state) return;

        const raw = typeof message === "string" ? message : Buffer.from(message).toString();

        let position: { lat?: unknown; lon?: unknown };
        try {
            position = JSON.parse(raw);
        } catch {
            wsLog.warn({ raw: raw.slice(0, 200) }, "ignoring malformed message");
            return;
        }

        const { lat, lon } = position ?? {};
        if (
            typeof lat !== "number" || typeof lon !== "number" ||
            !Number.isFinite(lat) || !Number.isFinite(lon) ||
            Math.abs(lat) > 90 || Math.abs(lon) > 180
        ) {
            wsLog.warn({ position }, "ignoring invalid position");
            return;
        }

        const xyz = llhToEcef(lat, lon);

        if (!state.ntripClient) {
            ntripLog.info({ lat, lon }, "received initial position, connecting to caster");

            state.ntripClient = this.createClient({
                interval: 2000,
                ...NTRIPConfig,
                ...this.config,
                xyz,
            });

            const client = state.ntripClient;

            client.on("data", (data: Uint8Array) => {
                // the client also emits the caster's "ICY 200 OK" header as
                // data; only forward real RTCM frames (0xd3 preamble) to BLE
                if (data[0] !== 0xd3) return;

                if (!state.streamReady) {
                    state.streamReady = true;
                    ntripLog.info("correction stream established");
                }
                state.coalescer.add(Buffer.from(data));
            });

            client.on("close", () => {
                ntripLog.info("caster connection closed");
            });

            client.on("error", (err: unknown) => {
                ntripLog.error({ err }, "caster connection error");
            });

            client.run();
        } else {
            ntripLog.info({ lat, lon }, "updating caster position");
            state.ntripClient.setXYZ(xyz);
        }
    }
}

export function llhToEcef(latDeg: number, lonDeg: number, heightMeters = 0): number[] {
    // WGS-84 ellipsoid constants
    const a = 6378137.0; // semi-major axis
    const e2 = 6.69437999014e-3; // first eccentricity squared

    // Convert degrees to radians
    const lat = latDeg * Math.PI / 180;
    const lon = lonDeg * Math.PI / 180;

    // Prime vertical radius of curvature
    const N = a / Math.sqrt(1 - e2 * Math.sin(lat) ** 2);

    const X = (N + heightMeters) * Math.cos(lat) * Math.cos(lon);
    const Y = (N + heightMeters) * Math.cos(lat) * Math.sin(lon);
    const Z = (N * (1 - e2) + heightMeters) * Math.sin(lat);

    return [X, Y, Z];
}
