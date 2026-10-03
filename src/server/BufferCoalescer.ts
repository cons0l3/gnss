export type SendCallback = (data: Buffer) => void;

export type BufferCoalescerOptions = {
  /** Flush immediately once the pending batch reaches this many bytes. */
  maxSize?: number;
  /** Flush after this many milliseconds once the first buffer is queued. */
  maxWait?: number;
};

export class BufferCoalescer {
  private buffers: Buffer[] = [];
  private currentSize: number = 0;
  private timer: NodeJS.Timeout | null = null;
  private readonly maxSize: number;
  private readonly maxWait: number;

  constructor(private onFlush: SendCallback, options: BufferCoalescerOptions = {}) {
    this.maxSize = options.maxSize ?? 300;
    this.maxWait = options.maxWait ?? 100;
  }

  /**
   * Adds a buffer to the queue and determines if we should flush immediately
   */
  public add(data: Buffer): void {
    if (data.length === 0) return;

    // If a single buffer exceeds the limit, flush existing and then send new one
    if (data.length > this.maxSize) {
      this.flush();
      this.onFlush(data);
      return;
    }

    // Flush if adding this buffer would exceed the size limit
    if (this.currentSize + data.length > this.maxSize) {
      this.flush();
    }

    // Start the timer if this is the first item in a new batch
    if (this.buffers.length === 0) {
      this.timer = setTimeout(() => this.flush(), this.maxWait);
    }

    this.buffers.push(data);
    this.currentSize += data.length;

    // Optional: Immediate flush if we hit exactly the limit
    if (this.currentSize === this.maxSize) {
      this.flush();
    }
  }

  /**
   * Concatenates all queued buffers and sends them
   */
  public flush(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.buffers.length === 0) return;

    const combined = Buffer.concat(this.buffers);
    this.onFlush(combined);

    // Reset state
    this.buffers = [];
    this.currentSize = 0;
  }

  /**
   * Drops any queued data and stops the flush timer
   */
  public dispose(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.buffers = [];
    this.currentSize = 0;
  }
}
