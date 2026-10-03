import { describe, test, expect } from "bun:test";
import { BufferCoalescer } from "./BufferCoalescer";

function collect(options?: { maxSize?: number; maxWait?: number }) {
    const flushed: Buffer[] = [];
    const coalescer = new BufferCoalescer((d) => flushed.push(d), options);
    return { coalescer, flushed };
}

describe("BufferCoalescer", () => {
    test("flushes queued buffers together after maxWait", async () => {
        const { coalescer, flushed } = collect({ maxWait: 10 });
        coalescer.add(Buffer.from("aa"));
        coalescer.add(Buffer.from("bb"));

        expect(flushed).toHaveLength(0);
        await Bun.sleep(30);

        expect(flushed).toHaveLength(1);
        expect(flushed[0]!.toString()).toBe("aabb");
    });

    test("flushes immediately when batch would exceed maxSize", () => {
        const { coalescer, flushed } = collect({ maxSize: 5, maxWait: 10_000 });
        coalescer.add(Buffer.from("abcd")); // 4 bytes pending
        coalescer.add(Buffer.from("ef"));   // 6 > 5 -> flush "abcd", keep "ef"

        expect(flushed).toHaveLength(1);
        expect(flushed[0]!.toString()).toBe("abcd");

        coalescer.flush();
        expect(flushed).toHaveLength(2);
        expect(flushed[1]!.toString()).toBe("ef");
    });

    test("flushes immediately when batch hits exactly maxSize", () => {
        const { coalescer, flushed } = collect({ maxSize: 4, maxWait: 10_000 });
        coalescer.add(Buffer.from("ab"));
        coalescer.add(Buffer.from("cd"));

        expect(flushed).toHaveLength(1);
        expect(flushed[0]!.toString()).toBe("abcd");
    });

    test("a buffer larger than maxSize is sent on its own after pending data", () => {
        const { coalescer, flushed } = collect({ maxSize: 4, maxWait: 10_000 });
        coalescer.add(Buffer.from("ab"));
        coalescer.add(Buffer.from("012345"));

        expect(flushed).toHaveLength(2);
        expect(flushed[0]!.toString()).toBe("ab");
        expect(flushed[1]!.toString()).toBe("012345");
    });

    test("preserves ordering across flushes", async () => {
        const { coalescer, flushed } = collect({ maxSize: 3, maxWait: 10 });
        for (const s of ["a", "b", "c", "d", "e", "f"]) {
            coalescer.add(Buffer.from(s));
        }
        await Bun.sleep(30);

        expect(flushed.map((b) => b.toString())).toEqual(["abc", "def"]);
    });

    test("manual flush concatenates and clears the queue", () => {
        const { coalescer, flushed } = collect({ maxWait: 10_000 });
        coalescer.add(Buffer.from("x"));
        coalescer.add(Buffer.from("y"));
        coalescer.flush();

        expect(flushed).toHaveLength(1);
        expect(flushed[0]!.toString()).toBe("xy");

        coalescer.flush();
        expect(flushed).toHaveLength(1);
    });

    test("empty buffers are ignored", async () => {
        const { coalescer, flushed } = collect({ maxWait: 10 });
        coalescer.add(Buffer.alloc(0));
        await Bun.sleep(30);
        expect(flushed).toHaveLength(0);
    });

    test("dispose drops queued data and cancels the timer", async () => {
        const { coalescer, flushed } = collect({ maxWait: 10 });
        coalescer.add(Buffer.from("never"));
        coalescer.dispose();
        await Bun.sleep(30);
        expect(flushed).toHaveLength(0);
    });
});
