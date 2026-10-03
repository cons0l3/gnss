export const WEBSOCKET_PATH = "/ws";

type UpgradeableServer = {
    upgrade(req: Request, options?: { data?: unknown }): boolean;
};

export function handleFetch(req: Request, server: UpgradeableServer): Response | undefined {
    const url = new URL(req.url);

    if (url.pathname !== WEBSOCKET_PATH) {
        return new Response("Not Found", { status: 404 });
    }

    // upgrade the request to a WebSocket
    if (server.upgrade(req, { data: "websocket" })) {
        return undefined; // do not return a Response
    }

    return new Response("WebSocket upgrade failed", { status: 400 });
}
