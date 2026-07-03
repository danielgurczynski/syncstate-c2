/**
 * A string representation of a Hybrid Logical Clock timestamp.
 * Format: `ISO_TIMESTAMP-COUNTER-NODE_ID`
 * It is lexicographically sortable.
 */
export type HlcTimestamp = string;

/**
 * Hybrid Logical Clock implementation for generating monotonic, distributed-friendly timestamps.
 * Ensures that event ordering is consistent across all clients, even with clock skew.
 * Based on the HLC paper by Kulkarni, et al.
 */
export class HLC {
  private count: number = 0;
  private lastTime: number = 0;
  public readonly nodeId: string;

  constructor(nodeId: string) {
    if (!nodeId) throw new Error('HLC node ID cannot be empty');
    this.nodeId = nodeId;
  }

  /**
   * Generates a new HLC timestamp based on the current wall time.
   * @param wallTime The current wall time (e.g., Date.now()). For testing purposes.
   *
   */
  public now(wallTime: number = Date.now()): HlcTimestamp {
    const wallTimeMs = Math.floor(wallTime);

    if (wallTimeMs > this.lastTime) {
      this.lastTime = wallTimeMs;
      this.count = 0;
    } else {
      // Time stayed the same or went backwards, increment counter
      this.count++;
    }

    const time = new Date(this.lastTime).toISOString();
    const counter = this.count.toString(16).padStart(4, '0');

    return `${time}-${counter}-${this.nodeId}`;
  }
}
