import { EMPTY_FN, Observable } from './observable';


/**
 * A simple subject/observer pattern implementation. Observers can
 * subscribe and receive notifications when a specified event occurs.
 *
 * @export
 * @class Subject
 */
export class Subject extends Observable {
  /**
   * @type { Observer[] }
   * @private
   */
  _observers = [];

  /**
   * @type { number }
   * @private
   */
  _nextId = 0;

  constructor() {
    super();
  }

  /**
   * @param { ((value: any) => void) | Observer } observerOrNext
   * @returns { TeardownLogic }
   */
  subscribe(observerOrNext) {
    const observer = observerOrNext.next ? observerOrNext : { next: observerOrNext, error: EMPTY_FN, complete: EMPTY_FN };
    const id = this._nextId++;
    this._observers[id] = observer;
    return () => { delete this._observers[id]; };
  }

  /**
   * Notify observers and deliver a data payload
   *
   * @param { any } [payload] The data payload to deliver to subscribers
   */
  next(payload) {
    this._observers.forEach(observer => observer.next(payload));
  }

  /**
   * @param { any } [err]
   */
  error(err) {
    this._observers.forEach(observer => observer.error(err));
  }

  complete() {
    this._observers.forEach(observer => observer.complete());
  }
}
