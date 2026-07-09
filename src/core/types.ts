import { HLC } from './hlc';

/**
 * A unique identifier for a client node in the distributed system.
 */
export type NodeId = string;

/**
 * Represents a single change to the state tree.
 * It's a function that takes the previous state and returns the new state.
 */
export type Patch<T> = (prevState: T) => T;

/**
 * A complete, timestamped operation that can be sent over the wire.
 */
export interface Operation<T> {
  /** Hybrid Logical Clock timestamp */
  hlc: string;
  /** The patch function (will be serialized) */
  patch: Patch<T>; 
  /** The client node that created the operation */
  origin: NodeId;
}

/**
 * Defines the public API of a store, passed to middleware.
 */
export interface StoreApi<T> {
  getState: () => T;
  setState: (patch: Patch<T>) => void;
}

/**
 * Middleware allows intercepting and modifying state changes.
 */
export type Middleware<T> = (
  api: StoreApi<T>
) => (next: (patch: Patch<T>) => void) => (patch: Patch<T>) => void;
