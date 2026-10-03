import type { WebSocketHandler } from "bun";
import { BufferCoalescer } from "./BufferCoalescer";
import { Buffer } from "buffer";
import { NTRIPConfig } from "../config";

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
};

export class NTRIPWebSocketHandler implements WebSocketHandler<string> {
    private connections = new WeakMap<object, ConnectionState>();

    constructor(
        private createClient: NtripClientFactory = defaultFactory,
        private config: Partial<NtripClientOptions> = {},
    ) { }

    open = (ws: Bun.ServerWebSocket<string>): void => {
        console.log("server ws: open");
        const coalescer = new BufferCoalescer((data) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(data.toBase64());
            }
        });
        this.connections.set(ws, { coalescer, ntripClient: null });
    }

    close = (
        ws: Bun.ServerWebSocket<string>,
        code: number,
        reason: string,
    ): void => {
        console.log("WebSocket closed");
        const state = this.connections.get(ws);
        this.connections.delete(ws);
        if (!state) return;

        state.coalescer.dispose();
        if (state.ntripClient) {
            console.log("Closing NTRIP client");
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
            console.warn("server ws: ignoring malformed message: " + raw);
            return;
        }

        const { lat, lon } = position ?? {};
        if (
            typeof lat !== "number" || typeof lon !== "number" ||
            !Number.isFinite(lat) || !Number.isFinite(lon) ||
            Math.abs(lat) > 90 || Math.abs(lon) > 180
        ) {
            console.warn("server ws: ignoring invalid position", position);
            return;
        }

        const xyz = llhToEcef(lat, lon);

        if (!state.ntripClient) {
            console.log("Retrieved initial position: lat: " + lat + ", lon: " + lon + ", xyz: " + xyz);

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
                if (data[0] === 0xd3) {
                    state.coalescer.add(Buffer.from(data));
                }
            });

            client.on("close", () => {
                console.log("ntrip: client close");
            });

            client.on("error", (err: unknown) => {
                console.log("ntrip: error: " + err);
            });

            client.run();
        } else {
            console.log("Updating NTRIP client position");
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
