/**
 * A Hybrid Logical Clock (HLC) timestamp.
 * Combines physical time with a logical counter to ensure a total ordering of events
 * in a distributed system, even with clock skew.
 */
export interface HLCTimestamp {
  /** The physical time component, from `Date.now()`. */
  time: number;
  /** A logical counter to differentiate events within the same millisecond. */
  counter: number;
  /** The unique identifier of the node that generated the timestamp. */
  nodeId: string;
}

/**
 * Implements a Hybrid Logical Clock.
 * This class manages the state of the clock for a single node and provides methods
 * to generate and update timestamps to ensure causal ordering.
 */
export class HLC {
  private lastTime: number;
  private counter: number;

  constructor(public readonly nodeId: string, initialTime: number = Date.now()) {
    this.lastTime = initialTime;
    this.counter = 0;
  }

  /**
   * Generates a new, unique HLC timestamp for a local event.
   * @param wallTime The current physical time, usually `Date.now()`.
   */
  public now(wallTime: number = Date.now()): HLCTimestamp {
    const physicalTime = wallTime;

    if (physicalTime > this.lastTime) {
      this.lastTime = physicalTime;
      this.counter = 0;
    } else {
      this.counter++;
    }

    return {
      time: this.lastTime,
      counter: this.counter,
      nodeId: this.nodeId,
    };
  }

  /**
   * Updates the local clock based on a received remote timestamp.
   * This must be called when an event is received from another node.
   * @param remote The HLC timestamp from the remote event.
   * @param wallTime The current physical time, usually `Date.now()`.
   */
  public receive(remote: HLCTimestamp, wallTime: number = Date.now()): void {
    const localTimeBefore = this.lastTime;

    this.lastTime = Math.max(localTimeBefore, remote.time, wallTime);

    if (this.lastTime === localTimeBefore && this.lastTime === remote.time) {
      this.counter = Math.max(this.counter, remote.counter) + 1;
    } else if (this.lastTime === localTimeBefore) {
      this.counter++;
    } else if (this.lastTime === remote.time) {
      this.counter = remote.counter + 1;
    } else { // this.lastTime must be wallTime
      this.counter = 0;
    }
  }

  /**
   * Compares two HLC timestamps to determine their causal order.
   * Returns > 0 if a > b, < 0 if a < b, 0 if a === b.
   * Tie-breaks using nodeId if time and counter are identical.
   */
  public static compare(a: HLCTimestamp, b: HLCTimestamp): number {
    if (a.time !== b.time) return a.time - b.time;
    if (a.counter !== b.counter) return a.counter - b.counter;
    if (a.nodeId > b.nodeId) return 1;
    if (a.nodeId < b.nodeId) return -1;
    return 0;
  }
}
