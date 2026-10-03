import pino from "pino";

const env = process.env.NODE_ENV ?? "development";
const isTest = env === "test";

// Pretty console output in development, JSON in production (for log
// collectors), silent under `bun test`. Override with LOG_LEVEL.
export const logger = pino({
    level: process.env.LOG_LEVEL || (isTest ? "silent" : "info"),
    transport:
        env === "production" || isTest
            ? undefined
            : {
                target: "pino-pretty",
                options: {
                    colorize: true,
                    translateTime: "HH:MM:ss",
                    ignore: "pid,hostname,module",
                    messageFormat: "{if module}[{module}]{end} {msg}",
                },
            },
});
