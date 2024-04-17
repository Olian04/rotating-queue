type Read<T> = (
  | [T, true]
  | [null, false]
);

/**
 * Queue is a fixed size rotating queue with a backpressure mechanic.
 *
 * Internal queue buffer:
 *
 * ```text
 *       Read            Write
 *        ⏷                ⏷
 * ⎧    ░┊████████████████┊     ⎫
 * ⎨    ░┊████████████████┊     ⎬
 * ⎩    ░┊████████████████┊     ⎭
 *
 * ┊ = Index in queue
 * █ = Item in queue
 * ░ = Write protected buffer zone, ensures that the write header never catches up to the read header
 * ```
 *
 * Reads are done from the first space between the read header and write header.
 * Writes are done to the first space between the write header and read header.
 * Both read and write header will loop around to the start of the buffer when
 * their index exceeds the maximum index of the internal queue buffer.
 * Reads will fail when the read header and the write header points to the same index.
 * Writes will fail when the write header points to the index immediately before the read header.
 * When a Read fails, a promise will be returned that will resolve on the next Write.
 * When a Write fails, a promise will be returned that will resolve on the next Read.
 */
export class Queue<T> {
  private array: T[];
  private backpressureWaitQueue: (() => void)[] = [];
  private consumeNext?: (item: T) => void;
  private readHead: number = 0;
  private writeHead: number = 0;
  constructor(capacity: number) {
    if (capacity <= 0 || capacity % 1 !== 0) {
      throw new Error('Queue capacity must be a positive integer');
    }
    const actualSize = capacity + 1; // Allows for one empty value between the read and write heads
    this.array = new Array<T>(actualSize).fill(null as T);
  }

  private getIncrementedHead(current: number): number {
    return (current + 1) % this.array.length;
  }

  private incrementReadHead(): void {
    this.readHead = this.getIncrementedHead(this.readHead);
  }

  private incrementWriteHead(): void {
    this.writeHead = this.getIncrementedHead(this.writeHead);
  }

  private processBackpressure(): void {
    const fn = this.backpressureWaitQueue.shift();
    if (!fn) {
      return;
    }
    // Using setImmediate since it will enqueue a macrotask instead of a microtask, this is done to avoid deadlock with microtask queue
    setImmediate(fn);
  }

  private readSync(): Read<T> {
    if (this.isEmpty()) {
      return [null, false];
    }
    const item = this.array[this.readHead];
    this.array[this.readHead] = null as T;
    this.incrementReadHead();
    this.processBackpressure();
    return [item, true];
  }

  private isEmpty(): boolean {
    return this.readHead === this.writeHead;
  }

  private isFull(): boolean {
    const newWriteHead = this.getIncrementedHead(this.writeHead);
    return newWriteHead === this.readHead;
  }

  /**
   * @returns The total number of items the queue can hold before backpressure kicks in.
   */
  public capacity(): number {
    return this.array.length - 1;
  }

  /**
   * @returns The number of items currently in the queue.
   */
  public size(): number {
    // "I should have written down how I arrived at this equation" - Oliver
    return (this.array.length + this.writeHead - this.readHead) % this.array.length;
  }

  /**
   * @returns A positive float indicating the throughput of the queue. An empty queue will have a pressure of 0, while a queue at capacity will have a pressure of 1. A queue with backpressure will have a pressure above 1.
   */
  public pressure(): number {
    const capacity = this.capacity();
    const size = this.size();
    const backpressure = this.backpressureWaitQueue.length;
    return (size + backpressure) / capacity;
  }

  /**
   * @returns Promise that will return an item from the queue. While this promise is pending, calling Queue#read again will throw 'Unexpected multiple read'.
   */
  public async read(): Promise<T> {
    if (this.consumeNext) {
      // eslint-disable-next-line no-restricted-syntax
      throw new Error('Unexpected multiple read');
    }
    const [item, ok] = this.readSync();
    if (ok) {
      return item;
    }
    return new Promise<T>(resolve => {
      this.consumeNext = item => {
        this.consumeNext = undefined;
        resolve(item);
      };
    });
  }

  /**
   * @param item - Item to add to the queue
   * @returns Promise that should be awaited in order to support backpressure
   */
  public async write(item: T): Promise<void> {
    if (this.consumeNext) {
      this.consumeNext(item);
      return;
    }
    if (this.isFull()) {
      await new Promise<void>(resolve => {
        this.backpressureWaitQueue.push(() => resolve());
      });
    }
    this.array[this.writeHead] = item;
    this.incrementWriteHead();
  }
}
