import { Patch, Middleware, StoreApi } from '../core/types';

type Listener<T> = (state: T) => void;

export class ObservableStore<T> {
  private state: T;
  private listeners: Set<Listener<T>> = new Set();
  private readonly dispatch: (patch: Patch<T>) => void;

  constructor(initialState: T, middlewares: Middleware<T>[] = []) {
    this.state = initialState;

    const api: StoreApi<T> = {
      getState: this.getState.bind(this),
      setState: this.setState.bind(this),
    };

    // The final step in the middleware chain: apply the patch and notify listeners.
    const baseDispatch = (patch: Patch<T>): void => {
      this.state = patch(this.state);
      this.listeners.forEach(listener => listener(this.state));
    };

    // Chain all middlewares, starting from the base dispatch.
    this.dispatch = middlewares
      .map(mw => mw(api))
      .reduceRight((next, mw) => mw(next), baseDispatch);
  }

  public getState(): T {
    return this.state;
  }

  public setState(patch: Patch<T>): void {
    // Use the potentially wrapped dispatch function.
    this.dispatch(patch);
  }

  public subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    // Return an unsubscribe function.
    return () => {
      this.listeners.delete(listener);
    };
  }
}
