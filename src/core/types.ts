import { HLC } from './hlc';

/**
 * A unique identifier for a node/client in the distributed system.
 */
export type NodeId = string;

/**
 * A patch describes a change to a JSON-like object, similar to JSON Patch (RFC 6902).
 */
export interface Patch {
  op: 'add' | 'remove' | 'replace';
  path: string; // e.g., '/todos/0/completed'
  value?: any; // The value to add or replace with. Not used for 'remove'.
}

/**
 * Represents a single, atomic change to the state.
 * Operations are the source of truth and are persisted in a log.
 */
export interface Operation {
  /**
   * Hybrid Logical Clock timestamp for total ordering.
   */
  hlc: HLC;
  /**
   * The node that originated this operation.
   */
  origin: NodeId;
  /**
   * The specific patch to be applied to the state.
   */
  patch: Patch;
}

/**
 * A listener function that gets called with the new state on change.
 */
export type Listener<S> = (state: S) => void;

/**
 * A function to unsubscribe a listener.
 */
export type Unsubscribe = () => void;

/**
 * The middleware function signature.
 * It receives the current state and the patch being applied, and can return
 * a modified patch, or null to block the update.
 */
export type Middleware<S> = (state: Readonly<S>, patch: Patch) => Patch | null;

/**
 * The core API of a SyncState store.
 */
export interface Store<S> {
  /**
   * Returns the current state.
   */
  getState: () => S;

  /**
   * Dispatches a patch to be applied to the state.
   * The patch will be processed by middleware before being applied.
   */
  apply: (patch: Patch) => void;

  /**
   * Subscribes a listener function to state changes.
   * Returns an unsubscribe function.
   */
  subscribe: (listener: Listener<S>) => Unsubscribe;
}
