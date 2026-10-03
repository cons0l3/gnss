import { SQL } from "bun";
import { PostgresConnectionString } from "../config";

export type UploadPayload = {
    name: string,
    type: string,
    positions: {
        latitude: number,
        longitude: number,
        altitude: number
    }[]
}

// Created lazily so importing this module doesn't require a live database
// (and so tests can inject their own connection).
let psql: SQL | null = null;
function getDb(): SQL {
    psql ??= new SQL(PostgresConnectionString);
    return psql;
}

function isValidPosition(pos: unknown): boolean {
    if (typeof pos !== "object" || pos === null) return false;
    const { latitude, longitude } = pos as { latitude?: unknown; longitude?: unknown };
    return (
        typeof latitude === "number" && Number.isFinite(latitude) && Math.abs(latitude) <= 90 &&
        typeof longitude === "number" && Number.isFinite(longitude) && Math.abs(longitude) <= 180
    );
}

export function validatePayload(payload: UploadPayload): string | null {
    if (payload === null || typeof payload !== "object") {
        return "Invalid payload";
    }

    if (payload.name !== undefined && payload.name !== null && typeof payload.name !== "string") {
        return "Invalid name";
    }

    const positions = payload.positions;
    if (!Array.isArray(positions) || positions.length === 0) {
        return "No positions provided";
    }

    if (!positions.every(isValidPosition)) {
        return "Invalid position coordinates";
    }

    switch (payload.type) {
        case "points":
            break;
        case "line":
            if (positions.length < 2) return "A line requires at least 2 positions";
            break;
        case "polygon":
            if (positions.length < 3) return "A polygon requires at least 3 positions";
            break;
        default:
            return "Invalid data type";
    }

    return null;
}

// Route handler: Bun passes (req, server) to route handlers, so the
// connection-injectable variant lives in handleUpload for testability.
export function uploadHandler(req: Request): Promise<Response> {
    return handleUpload(req, getDb());
}

export async function handleUpload(req: Request, conn: SQL): Promise<Response> {
    let payload: UploadPayload;
    try {
        payload = await req.json();
    } catch {
        return new Response("Invalid JSON body", { status: 400 });
    }

    const validationError = validatePayload(payload);
    if (validationError) {
        return new Response(validationError, { status: 400 });
    }

    try {
        switch (payload.type) {
            case "points":
                await uploadPoints(payload, conn);
                break;
            case "line":
                await uploadLine(payload, conn);
                break;
            case "polygon":
                await uploadPolygon(payload, conn);
                break;
        }
    } catch (err) {
        console.error("Failed to store upload:", err);
        return new Response("Failed to store upload", { status: 502 });
    }

    return new Response("OK", { status: 201 });
}

export async function uploadPolygon(payload: UploadPayload, conn: SQL) {
    // Repeat the position list to create a WKT polygon string
    const firstPosition = payload.positions[0]!;
    const polygonString = [...payload.positions, firstPosition].map(pos => `${pos.longitude} ${pos.latitude}`).join(", ");
    const geomString = `POLYGON((${polygonString}))`;

    await conn`INSERT INTO survey_polygons (name, geom) VALUES (${payload.name}, ST_GeomFromText(${geomString}, 4258));`
}

export async function uploadPoints(payload: UploadPayload, conn: SQL) {
    await conn.begin(async (tx) => {
        for (const pos of payload.positions) {
            const geomString = `POINT(${pos.longitude} ${pos.latitude})`;
            await tx`INSERT INTO survey_points (name, geom) VALUES (${payload.name}, ST_GeomFromText(${geomString}, 4258));`
        }
    });
}

export async function uploadLine(payload: UploadPayload, conn: SQL) {
    const lineString = payload.positions.map(pos => `${pos.longitude} ${pos.latitude}`).join(", ");
    const geomString = `LINESTRING(${lineString})`;

    await conn`INSERT INTO survey_lines (name, geom) VALUES (${payload.name}, ST_GeomFromText(${geomString}, 4258));`
}
