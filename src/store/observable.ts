import { Patch, Listener, Middleware, Unsubscribe } from '../core/types';

/**
 * Applies a patch to a state object immutably.
 * This is a simplified implementation and does not support the full JSON Patch spec.
 * Throws an error for invalid paths.
 */
function applyPatch<S>(state: S, patch: Patch): S {
  const newState = JSON.parse(JSON.stringify(state)); // Simple deep clone for immutability
  const pathParts = patch.path.substring(1).split('/'); // '/a/b' -> ['a', 'b']

  if (patch.path === '/') {
    if (patch.op === 'replace') {
      return patch.value;
    }
    throw new Error(`Invalid operation '${patch.op}' on root path`);
  }

  let current: any = newState;
  for (let i = 0; i < pathParts.length - 1; i++) {
    current = current?.[pathParts[i]];
    if (typeof current !== 'object' || current === null) {
      throw new Error(`Invalid path in patch: ${patch.path}`);
    }
  }

  const finalKey = pathParts[pathParts.length - 1];

  switch (patch.op) {
    case 'replace':
    case 'add':
      current[finalKey] = patch.value;
      break;
    case 'remove':
      delete current[finalKey];
      break;
    default:
      throw new Error(`Unsupported patch operation: ${(patch as any).op}`);
  }

  return newState;
}

/**
 * Creates a new observable store for managing state.
 * @param initialState The initial state of the store.
 * @param middleware An array of middleware functions to process patches.
 */
export function createStore<S>(
  initialState: S,
  middleware: Middleware<S>[] = []
) {
  let state: S = initialState;
  const listeners = new Set<Listener<S>>();

  const getState = () => state;

  const apply = (patch: Patch) => {
    let finalPatch: Patch | null = patch;

    for (const mw of middleware) {
      if (!finalPatch) break;
      finalPatch = mw(state, finalPatch);
    }

    if (!finalPatch) {
      return; // Middleware blocked the patch
    }

    try {
      const nextState = applyPatch(state, finalPatch);
      state = nextState;
      listeners.forEach((listener) => listener(state));
    } catch (e) {
      console.error('Failed to apply patch:', finalPatch, e);
    }
  };

  const subscribe = (listener: Listener<S>): Unsubscribe => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return { getState, apply, subscribe };
}
