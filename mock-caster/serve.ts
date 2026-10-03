import { MockNtripCaster } from "./caster";

const port = Number(process.env.NTRIP_PORT || 2101);
const intervalMs = Number(process.env.RTCM_INTERVAL_MS || 1000);

// RTCM message type 4073 sits in the proprietary/experimental range
// (4001-4095). GNSS receivers discard message types they don't know, so
// these frames exercise the whole pipeline (caster -> app -> websocket ->
// BLE -> receiver) while applying zero actual correction.
const DUMMY_RTCM_PAYLOAD = Buffer.from([
    0xfe, 0x90, // message number 4073 in the first 12 bits
    0, 0, 0, 0, 0, 0,
]);

const log = (msg: string) => console.log(`${new Date().toISOString()} ${msg}`);

const caster = new MockNtripCaster({
    stream: { intervalMs, payload: DUMMY_RTCM_PAYLOAD },
    onRequest: (req) => {
        const user = req.credentials?.split(":")[0] ?? "<none>";
        log(`client request: GET /${req.mountpoint} (user: ${user}, agent: ${req.userAgent ?? "-"})`);
    },
    onNmea: (line) => log(`position report: ${line}`),
});

await caster.start(port);
log(`mock NTRIP caster listening on :${port}, streaming dummy RTCM every ${intervalMs}ms`);

process.on("SIGTERM", () => {
    log("shutting down");
    caster.close().finally(() => process.exit(0));
});
