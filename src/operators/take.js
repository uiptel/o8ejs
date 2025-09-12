import { EMPTY, Observable } from '../observable.js';


/**
 * Emits only the first `count` values emitted by the source Observable.
 * Then completes.
 *
 * @param { number } count The maximum number of `next` values to emit.
 * @returns { OperatorFunction }
 * @return A function that returns an Observable that emits only the first
 * `count` values emitted by the source Observable, or all of the values from
 * the source if the source emits fewer than `count` values.
 */
export const take = count => count <= 0 ? () => EMPTY : source => new Observable(destination => {
  let taken = 0;
  let completed = false;

  const subscription = source.subscribe({
    next: value => {
      if (++taken < count) {
        destination.next(value);
      } else if (!completed) {
        destination.next(value);
        destination.complete();
        completed = true;
        try {
          if (typeof subscription === 'function') {
            subscription();
          }
        } catch (e) {}
      }
    },
    complete: () => {
      if (!completed) {
        destination.complete();
      }
    },
    error: err => destination.error(err),
  });

  if (completed) {
    subscription();
  }

  return subscription;
});
