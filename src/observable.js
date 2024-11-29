
import './typedefs.js';

export const EMPTY_FN = () => {};

/**
 * @template T
 */
export class Observable {

  /**
   * @private
   * @optional
   * @type { (o?: Observer<T>) => TeardownLogic }
   */
  _subscribe;

  /**
   * @param { SubscribeFn<T> } [subscribe]
   * The function that is called when the Observable is
   * initially subscribed to. This function is given a Observer, to which new values
   * can be `next`ed, or an `error` method can be called to raise an error, or
   * `complete` can be called to notify of a successful completion.
   */
  constructor(subscribe) {
    this._subscribe = subscribe ?? EMPTY_FN;
  }

  /**
   * @param { ((value: T) => void) | Observer<T> } observerOrNext
   * Either an {@link Observer} with some or all callback methods,
   * or the `next` handler that is called for each value emitted from the subscribed Observable.
   * @returns { TeardownLogic }
   */
  subscribe(observerOrNext = EMPTY_FN) {
    const observer = {
      next: observerOrNext.next ?? observerOrNext,
      error: observerOrNext.error ?? EMPTY_FN,
      complete: observerOrNext.complete ?? EMPTY_FN
    };
    return this._trySubscribe(observer);
  }

  /**
   * Used to stitch together functional operators into a chain.
   *
   * @template N,M
   * @param { OperatorFunction<N,M> } operations
   * @returns { Observable }
   * The Observable result of all the operators having been called
   * in the order they were passed in.
   */
  pipe(...operations) {
    return operations.reduce((prev, fn) => fn(prev), this);
  }

  /**
   * @param   { Observer } observer
   * @returns { TeardownLogic }
   */
  _trySubscribe(observer) {
    try {
      return this._subscribe(observer) ?? EMPTY_FN;
    } catch (err) {
      observer.error(err);
    }
  }
}

/**
 * Synchronously emits the values of an array like and completes.
 * @template T
 * @param { T[] } array
 * The array to emit values from
 * @returns { Observable<T> }
 */
export function fromArray(array) {
  return new Observable(observer => {
    subscribeToArray(array, observer);
  });
}

/**
 * Subscribes to an ArrayLike with a subscriber
 * @template T
 * @param { T[] } array
 * @param { Observer } observer
 * @returns { void }
 */
export function subscribeToArray(array, observer) {
  array.forEach(item => observer.next(item));
  observer.complete();
}

/**
 * Create timer observable
 * @param { number } delay
 * @param { number } [interval]
 * @returns { Observable<void> }
 */
export function timer(delay, interval) {
  return new Observable(observer => {
    let count = 0, id;

    const callback = () => {
      if (interval) {
        id = setTimeout(callback, interval);
        observer.next(count);
      } else {
        observer.next(count);
        observer.complete();
      }
      count++;
    };

    id = setTimeout(callback, delay);
    return () => {
      clearTimeout(id);
      if (interval) {
        observer.complete();
      }
    };
  });
}
