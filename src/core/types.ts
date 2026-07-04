import type { HLCTimestamp } from './hlc';

/**
 * A unique identifier for a client or peer in the sync system.
 * Typically a UUID or a short, randomly generated string.
 */
export type ActorId = string;

/**
 * A unique identifier for a specific operation.
 * Often combines an HLC timestamp and an actor ID.
 */
export type OperationId = string;

/**
 * Represents a single atomic change to the state tree.
 * Inspired by JSON Patch (RFC 6902), but simplified for this use case.
 */
export interface Patch {
  /** The type of patch operation. */
  op: 'add' | 'remove' | 'replace';
  /** The path to the property to be modified in the JSON state. */
  path: (string | number)[];
  /** The value to be used in 'add' or 'replace' operations. */
  value?: any;
}

/**
 * An Operation is the fundamental unit of change in the system.
 * It is a collection of patches that are applied atomically.
 * Operations are ordered using Hybrid Logical Clocks (HLCs).
 */
export interface Operation {
  /** A unique identifier for the operation. */
  id: OperationId;
  /** The timestamp of when the operation was created, according to the client's HLC. */
  timestamp: HLCTimestamp;
  /** The ID of the actor (client) that generated this operation. */
  actor: ActorId;
  /** The array of patches that make up this atomic change. */
  patches: Patch[];
}

/**
 * Represents the entire state of a synchronized document or store.
 * For now, this is a flexible JSON-like object.
 */
export type DocumentState = Record<string, any>;
