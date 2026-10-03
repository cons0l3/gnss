import { logger } from "./logger";

export const WEBSOCKET_PATH = "/ws";

const log = logger.child({ module: "http" });

type UpgradeableServer = {
    upgrade(req: Request, options?: { data?: unknown }): boolean;
    requestIP?(req: Request): { address: string } | null;
};

export function handleFetch(req: Request, server: UpgradeableServer): Response | undefined {
    const url = new URL(req.url);

    if (url.pathname !== WEBSOCKET_PATH) {
        log.debug({ path: url.pathname }, "no route matched");
        return new Response("Not Found", { status: 404 });
    }

    // upgrade the request to a WebSocket
    if (server.upgrade(req, { data: "websocket" })) {
        log.info({ client: server.requestIP?.(req)?.address }, "websocket upgrade");
        return undefined; // do not return a Response
    }

    log.warn("websocket upgrade failed");
    return new Response("WebSocket upgrade failed", { status: 400 });
}
