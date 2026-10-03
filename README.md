# GNSS RTK Survey Tool

A web-based RTK (Real-Time Kinematic) GNSS surveying application. It connects a
hardware GNSS receiver to a browser-based UI over Bluetooth Low Energy, feeds
RTCM correction data from an NTRIP caster back to the receiver to achieve
centimeter-level positioning, and stores surveyed geometries (points, lines,
polygons) in a PostGIS database.

## How it works

```mermaid
flowchart LR
    NTRIP["NTRIP caster\nSAPOS NI"]
    BROWSER["Browser\nWeb Bluetooth"]
    UI["React UI"]
    SERVER["Bun server\nWebSocket + upload API"]
    ESP32["ESP32\nGPS RTK Stick"]
    GNSS["GNSS receiver\nNMEA out / RTCM in"]
    DB["PostGIS\nsurvey_* tables"]

    NTRIP -->|RTCM corrections (uplink)| SERVER
    SERVER -->|RTCM bytes / base64| BROWSER
    BROWSER -->|BLE NUS write| ESP32
    ESP32 -->|UART 115200| GNSS
    GNSS -->|NMEA $GNGGA| ESP32
    ESP32 -->|BLE notify| BROWSER
    BROWSER -->|parse / display / stage| UI
    UI -->|position + staging| SERVER
    SERVER -->|WKT inserts| DB

    BROWSER <-->|WebSocket| SERVER
    GNSS <-->|RTCM input| ESP32
```

### Correction data path (downlink)

1. The browser obtains the first `$GNGGA` fix from the receiver and sends
   `{lat, lon}` over a WebSocket to the Bun server.
2. The server converts the position to ECEF (WGS-84) and connects to an NTRIP
   caster via `ntrip-client` (configured in `src/config.ts` — currently SAPOS
   Niedersachsen, VRS mountpoint).
3. Incoming RTCM bytes are coalesced (`BufferCoalescer`, ≤300 bytes / ≤100 ms),
   base64-encoded, and pushed to the browser over the WebSocket.
4. The browser decodes them and writes them to the BLE RX characteristic.
5. The ESP32 forwards the raw bytes to the GNSS receiver's UART — the receiver
   then reaches `RTK Fixed` / `RTK Float` fix quality.

### Position data path (uplink)

1. The GNSS receiver streams NMEA over UART to the ESP32.
2. The ESP32 buffers sentences, keeps only `$GNGGA`, verifies the NMEA XOR
   checksum, and notifies the browser via the BLE TX characteristic.
3. The frontend parses GGA into lat/lon, altitude, fix quality, satellite count
   and HDOP, and displays it.

### Survey upload

Staged positions are collected in the UI (persisted in `localStorage`), named,
typed (`points` | `line` | `polygon`), and POSTed to `/upload`. The server
converts them to WKT and inserts them into PostGIS tables (`survey_points`,
`survey_lines`, `survey_polygons`, SRID **4258** / ETRS89).

## Repository layout

```
├── src/
│   ├── index.ts                  # Bun server entry: routes, WS upgrade, TLS, HMR
│   ├── config.ts                 # NTRIP caster + Postgres connection config
│   ├── server/
│   │   ├── ws.ts                 # WebSocket handler: NTRIP client → RTCM → browser
│   │   ├── BufferCoalescer.ts    # Batches small RTCM chunks before sending
│   │   └── uploadHandler.ts      # POST /upload → PostGIS inserts (WKT, SRID 4258)
│   └── frontend/
│       ├── App.tsx               # Main UI: status bar, position, staging, upload
│       └── lib/
│           ├── ble/              # Web Bluetooth (NUS) + NMEA GGA parsing (jotai atoms)
│           ├── ws/               # WebSocket client: position up, RTCM down
│           ├── main/             # Position display/staging/manual entry/GIS upload
│           ├── status/           # BLE / WS / RTCM / GPS status indicators
│           ├── button/           # BLE connect button
│           ├── layout/           # Position / row formatting components
│           └── models/           # Shared types
├── esp32/
│   ├── src/ble_bridge_gnss.cpp   # ESP32 firmware: GNSS UART ↔ BLE NUS bridge
│   └── platformio.ini            # PlatformIO config (denky32 / generic ESP32)
├── docs/
│   ├── create_tables.sql         # PostGIS schema (auto-loaded by devcontainer)
│   └── PROJECT_DOCUMENTATION.md
├── .devcontainer/                # App + PostGIS dev environment (docker-compose)
└── cert.pem / key.pem            # Self-signed TLS cert (required for Web Bluetooth)
```

## Components

### ESP32 firmware (`esp32/`)

Arduino/PlatformIO firmware for a generic ESP32. Acts as a BLE peripheral
advertising as **"GPS RTK Stick"** using the Nordic UART Service (NUS).

- **GNSS → BLE:** reads UART2 (`GPIO 27` RX / `GPIO 25` TX @ 115200), filters
  `$GNGGA` sentences, verifies checksums, notifies the client.
- **BLE → GNSS:** raw pass-through — anything written to the RX characteristic
  (RTCM, config commands) goes straight to the receiver.
- MTU up to 512 bytes; auto-restarts advertising on disconnect.

### Bun server (`src/`)

- Serves the React SPA at `/` with HMR in development.
- Upgrades requests to WebSocket and runs `NTRIPWebSocketHandler`: on the first
  position message it opens one NTRIP connection and streams corrections back.
- `POST /upload` writes geometries to Postgres via `bun:sql`.
- TLS is enabled via `cert.pem`/`key.pem` — Web Bluetooth requires a secure
  context, so the app is served over HTTPS even locally.

### React frontend (`src/frontend/`)

React 19 + Mantine + Jotai. Connects to the ESP32 via Web Bluetooth, shows live
position/fix quality (GPS, DGPS, RTK Float, RTK Fixed), lets the user stage the
current or a manual position, shows haversine distance to the staged point, and
uploads named point/line/polygon features to PostGIS.

### Database

PostGIS 16 (via devcontainer docker-compose). Schema lives in
`docs/create_tables.sql` — three `survey_*` tables with `geometry(*, 4258)`
columns, timestamps, names and a `tags` jsonb column.

## Getting started

### Dev container (recommended)

The `.devcontainer` setup provides Bun plus a PostGIS database with the schema
auto-initialized and ports `3000`/`5432` forwarded. Open the repo in VS Code →
"Reopen in Container", then:

```bash
bun install
bun dev
```

### Bare metal

Requires [Bun](https://bun.com) and a Postgres+PostGIS instance:

```bash
bun install
# point the app at Postgres via env vars or POSTGRES_URL
# (PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE)
psql "$POSTGRES_URL" -f docs/create_tables.sql
bun dev     # dev server with HMR
bun build   # production bundle → dist/
bun start   # production server
```

### Configuration

- **NTRIP credentials:** edit `src/config.ts` — the committed
  `username`/`password` are placeholders; you need a valid SAPOS (or other
  caster) account and mountpoint.
- **TLS:** replace `cert.pem`/`key.pem` with your own cert if the browser
  rejects the self-signed one (you'll need to accept the warning once).
- **ESP32 firmware:** see `esp32/README.md` — build/flash with PlatformIO.

### Usage

1. Start the server, open the HTTPS URL, accept the certificate warning.
2. Click **Connect BLE** and pair with *GPS RTK Stick*.
3. Once a GGA fix arrives, the app sends the position to the server, which
   starts the NTRIP stream — watch the fix quality progress to **RTK Fixed**.
4. Use **Stage Position** (or Manual Position) to capture points, then
   **Append Staged Position**, pick a geometry type/name, and **Upload**.
