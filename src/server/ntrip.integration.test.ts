import { describe, test, expect } from "bun:test";
import { NTRIPWebSocketHandler } from "./ws";
import { NTRIPConfig } from "../config";
import { MockNtripCaster, rtcmFrame } from "./testing/mockNtripCaster";

const { NtripClient } = require("ntrip-client");

async function waitFor(cond: () => boolean, what: string, timeoutMs = 5000) {
    const start = Date.now();
    while (!cond()) {
        if (Date.now() - start > timeoutMs) {
            throw new Error(`timed out waiting for ${what}`);
        }
        await Bun.sleep(10);
    }
}

function fakeWs() {
    const sent: string[] = [];
    const ws = {
        data: "websocket",
        readyState: WebSocket.OPEN,
        send(data: string | ArrayBuffer) { sent.push(String(data)); return 1; },
        close() { (ws as { readyState: number }).readyState = WebSocket.CLOSED; },
    } as unknown as Bun.ServerWebSocket<string>;
    return { ws, sent };
}

const decodeSent = (sent: string[]) =>
    Buffer.concat(sent.map((s) => new Uint8Array(Buffer.from(s, "base64"))));

/** "5230.000000" (ddmm.mmmmmm) -> 52.5 */
function nmeaToDegrees(field: string): number {
    const v = Number(field);
    return Math.floor(v / 100) + (v % 100) / 60;
}

describe("NTRIP caster integration (mock SAPOS stream)", () => {
    test("handshakes with mountpoint and credentials, then streams RTCM to the websocket", async () => {
        const caster = await new MockNtripCaster().start();
        try {
            const handler = new NTRIPWebSocketHandler(undefined, {
                host: "127.0.0.1",
                port: caster.port,
                mountpoint: "TEST_MP",
            });
            const { ws, sent } = fakeWs();
            handler.open(ws);
            handler.message(ws, JSON.stringify({ lat: 52.5, lon: 10.2 }));

            await waitFor(() => caster.requests.length === 1, "caster request");
            const req = caster.requests[0]!;
            expect(req.mountpoint).toBe("TEST_MP");
            expect(req.credentials).toBe(`${NTRIPConfig.username}:${NTRIPConfig.password}`);
            expect(req.userAgent).toStartWith("NTRIP");

            const frame = rtcmFrame(Buffer.from([0x3e, 0xd0, 0x00, 0x63, 0x55]));
            caster.push(frame);

            await waitFor(() => sent.length > 0, "rtcm on websocket");
            // the "ICY 200 OK" header the client emits as data must not reach BLE
            expect(decodeSent(sent)).toEqual(frame);

            handler.close(ws, 1000, "done");
        } finally {
            await caster.close();
        }
    });

    test("coalesces back-to-back RTCM frames without loss or reordering", async () => {
        const caster = await new MockNtripCaster().start();
        try {
            const handler = new NTRIPWebSocketHandler(undefined, {
                host: "127.0.0.1",
                port: caster.port,
            });
            const { ws, sent } = fakeWs();
            handler.open(ws);
            handler.message(ws, JSON.stringify({ lat: 52.5, lon: 10.2 }));
            await waitFor(() => caster.requests.length === 1, "caster request");

            const frames = [
                rtcmFrame(Buffer.from([1, 2, 3])),
                rtcmFrame(Buffer.from([4, 5, 6, 7])),
                rtcmFrame(Buffer.from([8, 9])),
            ];
            const expected = Buffer.concat(frames);
            for (const f of frames) caster.push(f);

            await waitFor(() => decodeSent(sent).length >= expected.length, "all frames");
            expect(decodeSent(sent)).toEqual(expected);

            handler.close(ws, 1000, "done");
        } finally {
            await caster.close();
        }
    });

    test("reports position to the caster as periodic NMEA GGA, updated by new messages", async () => {
        const caster = await new MockNtripCaster().start();
        try {
            const handler = new NTRIPWebSocketHandler(undefined, {
                host: "127.0.0.1",
                port: caster.port,
                interval: 50,
            });
            const { ws } = fakeWs();
            handler.open(ws);
            handler.message(ws, JSON.stringify({ lat: 52.5, lon: 10.2 }));

            await waitFor(() => caster.gga.length > 0, "first GGA");
            const fields = caster.gga[0]!.split(",");
            expect(fields[0]).toBe("$GPGGA");
            expect(caster.gga[0]).toMatch(/\*[0-9A-Fa-f]{2}$/);
            expect(nmeaToDegrees(fields[2]!)).toBeCloseTo(52.5, 3);
            expect(fields[3]).toBe("N");
            expect(nmeaToDegrees(fields[4]!)).toBeCloseTo(10.2, 3);
            expect(fields[5]).toBe("E");

            // a new position updates the running client's GGA reports
            handler.message(ws, JSON.stringify({ lat: 53.0, lon: 11.0 }));
            const count = caster.gga.length;
            await waitFor(() => caster.gga.length > count, "updated GGA");
            const updated = caster.gga.at(-1)!.split(",");
            expect(nmeaToDegrees(updated[2]!)).toBeCloseTo(53.0, 3);
            expect(nmeaToDegrees(updated[4]!)).toBeCloseTo(11.0, 3);

            handler.close(ws, 1000, "done");
        } finally {
            await caster.close();
        }
    });

    test("surfaces a caster rejection as a client error", async () => {
        const caster = await new MockNtripCaster("HTTP/1.0 401 Unauthorized\r\n\r\n").start();
        const client = new NtripClient({
            host: "127.0.0.1",
            port: caster.port,
            mountpoint: "TEST_MP",
            username: "u",
            password: "p",
            xyz: [3829475, 689031, 5036864],
            interval: 0,
            reconnectInterval: 60_000, // keep the auto-reconnect out of the test
        });
        const errors: unknown[] = [];
        client.on("error", (err: unknown) => errors.push(err));

        try {
            client.run();
            await waitFor(() => errors.length > 0, "error event");
            expect(String(errors[0])).toContain("401");
        } finally {
            client.close();
            await caster.close();
        }
    });
});
