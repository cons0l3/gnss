import { serve } from "bun";
import frontend from "./frontend/index.html";
import { NTRIPWebSocketHandler } from "./server/ws";
import { uploadHandler } from "./server/uploadHandler";
import { handleFetch } from "./server/http";

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

console.log(`🚀 Server running at ${server.url}`);
