import { serve } from "bun";
import frontend from "./frontend/index.html";
import { NTRIPWebSocketHandler } from "./server/ws";
import { uploadHandler } from "./server/uploadHandler";
import { handleFetch } from "./server/http";
import { logger } from "./server/logger";

const server = serve({
  routes: {
    "/": frontend,
    "/upload": uploadHandler
  },

  fetch: handleFetch,

  websocket: new NTRIPWebSocketHandler(),

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
  tls: {
    cert: Bun.file("cert.pem"),
    key: Bun.file("key.pem"),
  }
});

logger.info({ url: server.url.toString() }, "server started");
