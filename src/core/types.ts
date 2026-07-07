/**
 * A Hybrid Logical Clock timestamp.
 * Format: [wall_time, counter, node_id]
 */
export type HLC = [number, number, string];

/**
 * Represents a single, atomic change to the state.
 */
export interface Operation {
  /** Unique ID for the operation, typically an HLC timestamp string. */
  id: string;
  /** The type of patch, e.g., 'set', 'delete', 'list-insert'. */
  op: string;
  /** The path to the value being changed. */
  path: string;
  /** The new value for the operation. */
  value?: any;
}

/**
 * A function that is called when the state changes.
 */
export type StateListener = () => void;

/**
 * An observable store that holds state and allows subscriptions to changes.
 */
export interface ObservableStore<T> {
  /**
   * Returns the current state.
   */
  getState: () => T;

  /**
   * Updates the state with a partial new state.
   * Can accept an object or a function that returns an object.
   */
  setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => void;

  /**
   * Subscribes a listener function to be called on every state change.
   * @param listener The function to call on change.
   * @returns An unsubscribe function.
   */
  subscribe: (listener: StateListener) => () => void;
}
