import { HLCTimestamp } from './hlc';

/**
 * A Patch represents a single, atomic change to the state tree.
 * This format is inspired by JSON Patch (RFC 6902), but simplified.
 */
export interface Patch {
  op: 'add' | 'replace' | 'remove';
  path: (string | number)[];
  value?: any;
}

/**
 * An Operation bundles one or more patches into a single transactional unit.
 * It includes metadata about when and where the change originated.
 */
export interface Operation {
  /**
   * The Hybrid Logical Clock timestamp. This is the primary mechanism for
   * ordering operations across all clients in a distributed environment.
   * It ensures causality and provides a total ordering of events.
   */
  hlcTime: HLCTimestamp;

  /**
   * The ID of the client that created the operation.
   * This should correspond to the `nodeId` in the HLCTimestamp.
   */
  author: string;

  /**
   * An array of patch objects describing the state mutation.
   */
  patches: Patch[];
}
