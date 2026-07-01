/**
 * Represents a Hybrid Logical Clock timestamp, which combines physical time
 * with a counter to ensure a total ordering of events across distributed systems.
 */
export interface HLCTimestamp {
  /**
   * The physical time component, typically from `Date.now()`.
   */
  time: number;

  /**
   * A counter to distinguish events that occur at the same physical time.
   * This is incremented for each event within the same millisecond.
   */
  counter: number;

  /**
   * The ID of the client that generated the timestamp.
   */
  clientId: string;
}

/**
 * Describes a single, atomic mutation to the state tree.
 * The format is inspired by Immer patches for simplicity.
 *
 * @template T The type of the value being changed.
 */
export interface Patch<T = any> {
  /**
   * The operation to perform.
   * 'set': Set or add a value at the given path.
   * 'del': Delete the value at the given path.
   */
  op: 'set' | 'del';

  /**
   * A path to the location in the state tree to modify.
   * e.g., ['todos', '1', 'completed']
   */
  path: (string | number)[];

  /**
   * The value to apply. Required for 'set' operations.
   */
  value?: T;
}

/**
 * Represents a complete, timestamped operation that can be broadcast
 * to other clients and persisted to storage. It bundles a patch with
 * metadata required for synchronization and conflict resolution.
 *
 * @template T The type of the value in the patch.
 */
export interface Operation<T = any> {
  /**
   * The unique, ordered identifier for this operation, using a Hybrid Logical Clock.
   */
  timestamp: HLCTimestamp;

  /**
   * The patch describing the state change.
   */
  patch: Patch<T>;
}
