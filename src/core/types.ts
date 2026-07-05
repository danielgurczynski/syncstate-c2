/**
 * A Hybrid Logical Clock timestamp string.
 * Format: `YYYY-MM-DDTHH:MM:SS.SSSZ-<counter>-<nodeId>`
 * Example: `2023-10-27T10:00:00.000Z-0001-abcde`
 */
export type HlcTimestamp = string;

/**
 * Represents the type of a patch operation.
 * - `set`: Sets or replaces a value at a given path.
 * - `delete`: Removes a value at a given path.
 */
export type PatchOp = 'set' | 'delete';

/**
 * Describes a single atomic change to the state tree.
 * This is inspired by formats like JSON Patch, but simplified for performance.
 *
 * @template T The type of the value being set.
 */
export interface Patch<T = any> {
  /**
   * The operation to perform.
   */
  op: PatchOp;

  /**
   * An array of keys/indices specifying the location of the change.
   * Example: `['users', '123', 'name']` targets `state.users['123'].name`.
   */
  path: (string | number)[];

  /**
   * The new value to be set. Only present for the 'set' operation.
   */
  value?: T;
}

/**
 * A complete, globally-ordered unit of change in the system.
 * An Operation wraps one or more patches that occurred atomically.
 *
 * @template TState The overall state shape. Not directly used in patches,
 * but useful for typing stores and other higher-level constructs.
 */
export interface Operation<TState = Record<string, any>> {
  /**
   * A unique identifier for this operation. Typically a concatenation of
   * the client ID and a local sequence number.
   */
  id: string;

  /**
   * The Hybrid Logical Clock timestamp when the operation was created.
   * This is the primary sorting key for ensuring causality and convergence.
   */
  timestamp: HlcTimestamp;

  /**
   * The unique identifier of the client that generated this operation.
   */
  clientId: string;

  /**
   * An array of patches that constitute this operation.
   * Grouping patches allows for atomic updates to multiple parts of the state tree.
   */
  patches: Patch[];
}
