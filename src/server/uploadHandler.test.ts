import { describe, test, expect } from "bun:test";
import type { SQL } from "bun";
import {
    handleUpload,
    uploadPoints,
    uploadLine,
    uploadPolygon,
    validatePayload,
    type UploadPayload,
} from "./uploadHandler";

type RecordedQuery = { text: string; values: unknown[] };

function createMockSql(opts: { failWith?: Error } = {}) {
    const queries: RecordedQuery[] = [];
    const record = (strings: TemplateStringsArray, values: unknown[]) => {
        queries.push({ text: strings.join("?"), values });
        return opts.failWith ? Promise.reject(opts.failWith) : Promise.resolve([]);
    };
    const sql = ((strings: TemplateStringsArray, ...values: unknown[]) =>
        record(strings, values)) as unknown as SQL;
    // Run transactions against the same recorder
    (sql as { begin: (fn: (tx: SQL) => Promise<unknown>) => Promise<unknown> }).begin =
        async (fn) => fn(sql);
    return { sql, queries };
}

function request(payload: unknown): Request {
    const body = typeof payload === "string" ? payload : JSON.stringify(payload);
    return new Request("https://example.com/upload", { method: "POST", body });
}

const pos = (latitude: number, longitude: number) => ({ latitude, longitude, altitude: 0 });

const basePayload = (overrides: Partial<UploadPayload> = {}): UploadPayload => ({
    name: "survey-1",
    type: "points",
    positions: [pos(52.5, 10.2)],
    ...overrides,
});

describe("handleUpload", () => {
    test("stores points and returns 201", async () => {
        const { sql, queries } = createMockSql();
        const res = await handleUpload(
            request(basePayload({ positions: [pos(52.5, 10.2), pos(53.0, 11.0)] })),
            sql,
        );

        expect(res.status).toBe(201);
        expect(queries).toHaveLength(2);
        for (const q of queries) {
            expect(q.text).toContain("INSERT INTO survey_points");
            expect(q.text).toContain("ST_GeomFromText");
        }
        expect(queries[0]!.values).toEqual(["survey-1", "POINT(10.2 52.5)"]);
        expect(queries[1]!.values).toEqual(["survey-1", "POINT(11 53)"]);
    });

    test("stores a line as a single LINESTRING", async () => {
        const { sql, queries } = createMockSql();
        const res = await handleUpload(
            request(basePayload({ type: "line", positions: [pos(52.5, 10.2), pos(53.0, 11.0)] })),
            sql,
        );

        expect(res.status).toBe(201);
        expect(queries).toHaveLength(1);
        expect(queries[0]!.text).toContain("INSERT INTO survey_lines");
        expect(queries[0]!.values[1]).toBe("LINESTRING(10.2 52.5, 11 53)");
    });

    test("stores a polygon with a closed ring", async () => {
        const { sql, queries } = createMockSql();
        const res = await handleUpload(
            request(
                basePayload({
                    type: "polygon",
                    positions: [pos(1, 2), pos(3, 4), pos(5, 6)],
                }),
            ),
            sql,
        );

        expect(res.status).toBe(201);
        expect(queries).toHaveLength(1);
        expect(queries[0]!.text).toContain("INSERT INTO survey_polygons");
        // first position repeated to close the ring, lon lat order
        expect(queries[0]!.values[1]).toBe("POLYGON((2 1, 4 3, 6 5, 2 1))");
    });

    test("rejects malformed JSON with 400", async () => {
        const { sql, queries } = createMockSql();
        const res = await handleUpload(request("{not json"), sql);
        expect(res.status).toBe(400);
        expect(queries).toHaveLength(0);
    });

    test("rejects missing or empty positions with 400", async () => {
        const { sql, queries } = createMockSql();
        for (const positions of [undefined, []]) {
            const res = await handleUpload(request({ name: "x", type: "points", positions }), sql);
            expect(res.status).toBe(400);
        }
        expect(queries).toHaveLength(0);
    });

    test("rejects unknown type with 400", async () => {
        const { sql, queries } = createMockSql();
        const res = await handleUpload(request(basePayload({ type: "circle" })), sql);
        expect(res.status).toBe(400);
        expect(queries).toHaveLength(0);
    });

    test("rejects out-of-range and non-finite coordinates with 400", async () => {
        const { sql, queries } = createMockSql();
        const bad = [
            pos(91, 0),
            pos(-91, 0),
            pos(0, 181),
            pos(0, -181),
            pos(NaN, 0),
            pos(0, Infinity),
            { latitude: "52", longitude: 10, altitude: 0 },
        ];
        for (const p of bad) {
            const res = await handleUpload(request(basePayload({ positions: [p as never] })), sql);
            expect(res.status).toBe(400);
        }
        expect(queries).toHaveLength(0);
    });

    test("a line requires at least 2 positions", async () => {
        const { sql, queries } = createMockSql();
        const res = await handleUpload(
            request(basePayload({ type: "line", positions: [pos(1, 1)] })),
            sql,
        );
        expect(res.status).toBe(400);
        expect(queries).toHaveLength(0);
    });

    test("a polygon requires at least 3 positions", async () => {
        const { sql, queries } = createMockSql();
        const res = await handleUpload(
            request(basePayload({ type: "polygon", positions: [pos(1, 1), pos(2, 2)] })),
            sql,
        );
        expect(res.status).toBe(400);
        expect(queries).toHaveLength(0);
    });

    test("returns 502 when the database fails", async () => {
        const { sql } = createMockSql({ failWith: new Error("connection lost") });
        const res = await handleUpload(request(basePayload({ type: "line", positions: [pos(1, 1), pos(2, 2)] })), sql);
        expect(res.status).toBe(502);
    });
});

describe("validatePayload", () => {
    test("accepts a valid payload", () => {
        expect(validatePayload(basePayload())).toBeNull();
    });

    test("rejects non-object payloads", () => {
        expect(validatePayload(null as never)).toBe("Invalid payload");
        expect(validatePayload("x" as never)).toBe("Invalid payload");
    });

    test("rejects a non-string name", () => {
        expect(validatePayload(basePayload({ name: 5 as never }))).toBe("Invalid name");
    });
});

describe("upload* functions", () => {
    test("uploadPoints inserts every position in a transaction", async () => {
        const { sql, queries } = createMockSql();
        let began = false;
        (sql as { begin: (fn: (tx: SQL) => Promise<unknown>) => Promise<unknown> }).begin =
            async (fn) => {
                began = true;
                return fn(sql);
            };

        await uploadPoints(basePayload({ positions: [pos(1, 1), pos(2, 2), pos(3, 3)] }), sql);

        expect(began).toBe(true);
        expect(queries).toHaveLength(3);
    });

    test("uploadLine writes lon lat order", async () => {
        const { sql, queries } = createMockSql();
        await uploadLine(basePayload({ type: "line", positions: [pos(52.5, 10.2)] }), sql);
        expect(queries[0]!.values[1]).toBe("LINESTRING(10.2 52.5)");
    });

    test("uploadPolygon writes lon lat order", async () => {
        const { sql, queries } = createMockSql();
        await uploadPolygon(basePayload({ type: "polygon", positions: [pos(1, 2)] }), sql);
        expect(queries[0]!.values[1]).toBe("POLYGON((2 1, 2 1))");
    });
});
