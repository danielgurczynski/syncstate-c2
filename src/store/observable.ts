import type { ObservableStore, StateListener } from '../core/types';

/**
 * Creates a new observable store instance.
 * This is the reactive core that holds application state.
 * @param initialState The initial state for the store.
 * @returns An instance of an ObservableStore.
 */
export function createObservableStore<T extends object>(
  initialState: T
): ObservableStore<T> {
  let state: T = initialState;
  const listeners: Set<StateListener> = new Set();

  const getState = (): T => state;

  const setState = (
    partial: Partial<T> | ((state: T) => Partial<T>)
  ): void => {
    const nextPartial =
      typeof partial === 'function' ? partial(state) : partial;

    if (nextPartial) {
      state = { ...state, ...nextPartial };
      // Notify all listeners about the state change.
      listeners.forEach((listener) => listener());
    }
  };

  const subscribe = (listener: StateListener): (() => void) => {
    listeners.add(listener);
    // Return an unsubscribe function to allow cleanup.
    return () => {
      listeners.delete(listener);
    };
  };

  return { getState, setState, subscribe };
}
