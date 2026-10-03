import { describe, test, expect } from "bun:test";
import { handleFetch, WEBSOCKET_PATH } from "./http";

function fakeServer(upgradeResult: boolean) {
    const calls: { req: Request; options?: { data?: unknown } }[] = [];
    const server = {
        upgrade(req: Request, options?: { data?: unknown }) {
            calls.push({ req, options });
            return upgradeResult;
        },
    };
    return { server, calls };
}

describe("handleFetch", () => {
    test("upgrades requests on the websocket path", () => {
        const { server, calls } = fakeServer(true);
        const res = handleFetch(new Request(`https://example.com${WEBSOCKET_PATH}`), server);

        expect(res).toBeUndefined();
        expect(calls).toHaveLength(1);
        expect(calls[0]!.options?.data).toBe("websocket");
    });

    test("returns 400 when the upgrade fails", () => {
        const { server } = fakeServer(false);
        const res = handleFetch(new Request(`https://example.com${WEBSOCKET_PATH}`), server);

        expect(res?.status).toBe(400);
    });

    test("returns 404 for any other path", () => {
        const { server, calls } = fakeServer(true);
        for (const path of ["/", "/upload", "/favicon.ico", "/ws/extra"]) {
            const res = handleFetch(new Request(`https://example.com${path}`), server);
            expect(res?.status).toBe(404);
        }
        expect(calls).toHaveLength(0);
    });
});
