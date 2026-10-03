import { describe, test, expect } from "bun:test";
import {
    NTRIPWebSocketHandler,
    llhToEcef,
    type NtripClientLike,
    type NtripClientOptions,
} from "./ws";

class FakeNtripClient implements NtripClientLike {
    handlers = new Map<string, ((...args: any[]) => void)[]>();
    ran = false;
    closed = false;
    xyzUpdates: number[][] = [];

    constructor(public options: NtripClientOptions) { }

    run() { this.ran = true; }
    close() { this.closed = true; }
    setXYZ(xyz: number[]) { this.xyzUpdates.push(xyz); }
    on(event: string, cb: (...args: any[]) => void) {
        this.handlers.set(event, [...(this.handlers.get(event) ?? []), cb]);
    }
    emit(event: string, ...args: any[]) {
        for (const cb of this.handlers.get(event) ?? []) cb(...args);
    }
}

function createHarness() {
    const clients: FakeNtripClient[] = [];
    const handler = new NTRIPWebSocketHandler((options) => {
        const client = new FakeNtripClient(options);
        clients.push(client);
        return client;
    });

    const connect = () => {
        const sent: string[] = [];
        const ws = {
            data: "websocket",
            readyState: WebSocket.OPEN,
            send(data: string | ArrayBuffer) { sent.push(String(data)); return 1; },
            close() { (ws as { readyState: number }).readyState = WebSocket.CLOSED; },
        } as unknown as Bun.ServerWebSocket<string>;
        handler.open(ws);
        return { ws, sent };
    };

    return { handler, clients, connect };
}

const validPosition = JSON.stringify({ lat: 52.5, lon: 10.2 });

describe("llhToEcef", () => {
    test("maps the equator/prime-meridian origin to (a, 0, 0)", () => {
        const [x, y, z] = llhToEcef(0, 0);
        expect(x).toBeCloseTo(6378137, 6);
        expect(y).toBeCloseTo(0, 6);
        expect(z).toBeCloseTo(0, 6);
    });

    test("rotates longitude around the Z axis", () => {
        const [x, y, z] = llhToEcef(0, 90);
        expect(x).toBeCloseTo(0, 6);
        expect(y).toBeCloseTo(6378137, 6);
        expect(z).toBeCloseTo(0, 6);
    });

    test("maps the north pole to the ellipsoid Z axis", () => {
        const [x, y, z] = llhToEcef(90, 0);
        const polarRadius = 6378137 * Math.sqrt(1 - 6.69437999014e-3);
        expect(x).toBeCloseTo(0, 4);
        expect(y).toBeCloseTo(0, 4);
        expect(z).toBeCloseTo(polarRadius, 4);
    });

    test("adds height along the surface normal", () => {
        const [x] = llhToEcef(0, 0, 100);
        expect(x).toBeCloseTo(6378237, 6);
    });
});

describe("NTRIPWebSocketHandler", () => {
    test("creates an NTRIP client with ECEF xyz on the first valid position", () => {
        const { handler, clients, connect } = createHarness();
        const { ws } = connect();

        handler.message(ws, validPosition);

        expect(clients).toHaveLength(1);
        const client = clients[0]!;
        expect(client.ran).toBe(true);
        expect(client.options.interval).toBe(2000);
        expect(client.options.xyz).toHaveLength(3);
        expect(client.options.xyz).toEqual(llhToEcef(52.5, 10.2));
    });

    test("updates an existing client via setXYZ instead of reconnecting", () => {
        const { handler, clients, connect } = createHarness();
        const { ws } = connect();

        handler.message(ws, validPosition);
        handler.message(ws, JSON.stringify({ lat: 53, lon: 11 }));

        expect(clients).toHaveLength(1);
        expect(clients[0]!.xyzUpdates).toEqual([llhToEcef(53, 11)]);
    });

    test("accepts binary messages", () => {
        const { handler, clients, connect } = createHarness();
        const { ws } = connect();

        handler.message(ws, Buffer.from(validPosition));
        expect(clients).toHaveLength(1);
    });

    test("ignores malformed JSON without creating a client", () => {
        const { handler, clients, connect } = createHarness();
        const { ws } = connect();

        expect(() => handler.message(ws, "not json")).not.toThrow();
        expect(() => handler.message(ws, "42")).not.toThrow();
        expect(() => handler.message(ws, "[1,2]")).not.toThrow();
        expect(clients).toHaveLength(0);
    });

    test("ignores out-of-range coordinates", () => {
        const { handler, clients, connect } = createHarness();
        const { ws } = connect();

        for (const p of [{ lat: 91, lon: 0 }, { lat: 0, lon: 181 }, { lat: "x", lon: 0 }, {}]) {
            handler.message(ws, JSON.stringify(p));
        }
        expect(clients).toHaveLength(0);
    });

    test("forwards NTRIP data to its own websocket as base64", () => {
        const { handler, clients, connect } = createHarness();
        const a = connect();
        const b = connect();

        handler.message(a.ws, validPosition);
        handler.message(b.ws, validPosition);
        expect(clients).toHaveLength(2);

        // >300 bytes flushes through the coalescer immediately
        const chunk = Buffer.concat([Buffer.from([0xd3]), Buffer.alloc(399, 0x61)]);
        clients[0]!.emit("data", chunk);

        expect(a.sent).toEqual([chunk.toString("base64")]);
        expect(b.sent).toHaveLength(0);
    });

    test("drops non-RTCM data like the caster's ICY header", () => {
        const { handler, clients, connect } = createHarness();
        const { ws, sent } = connect();

        handler.message(ws, validPosition);
        clients[0]!.emit("data", Buffer.from("ICY 200 OK"));

        expect(sent).toHaveLength(0);
    });

    test("closing one connection only tears down its own client", () => {
        const { handler, clients, connect } = createHarness();
        const a = connect();
        const b = connect();

        handler.message(a.ws, validPosition);
        handler.message(b.ws, validPosition);

        handler.close(a.ws, 1000, "bye");

        expect(clients[0]!.closed).toBe(true);
        expect(clients[1]!.closed).toBe(false);

        // client b still streams to ws b
        const chunk = Buffer.concat([Buffer.from([0xd3]), Buffer.alloc(399, 0x62)]);
        clients[1]!.emit("data", chunk);
        expect(b.sent).toEqual([chunk.toString("base64")]);
        expect(a.sent).toHaveLength(0);
    });

    test("does not send to a websocket that is no longer open", () => {
        const { handler, clients, connect } = createHarness();
        const { ws, sent } = connect();

        handler.message(ws, validPosition);
        (ws as { readyState: number }).readyState = WebSocket.CLOSED;
        clients[0]!.emit("data", Buffer.concat([Buffer.from([0xd3]), Buffer.alloc(399, 0x61)]));

        expect(sent).toHaveLength(0);
    });

    test("ignores messages from a websocket that was never opened", () => {
        const { handler, clients } = createHarness();
        const ws = { send: () => 1 } as unknown as Bun.ServerWebSocket<string>;

        expect(() => handler.message(ws, validPosition)).not.toThrow();
        expect(clients).toHaveLength(0);
    });
});
