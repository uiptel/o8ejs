import { Observable } from '../observable.js';

/**
 * Applies a given `project` function to each value emitted by the source
 * Observable, and emits the resulting values as an Observable.
 *
 * Like [Array.prototype.map()]
 * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
 * it passes each source value through a transformation function to get
 * corresponding output values.
 *
 * Similar to the well known `Array.prototype.map` function, this operator
 * applies a projection to each value and emits that projection in the output
 * Observable.
 *
 * @template N,M
 * @param { (value: N, index: number) => M } project
 * The function to apply to each `value` emitted by the source
 * Observable. The `index` parameter is the number `i` for the i-th emission
 * that has happened since the subscription, starting from the number `0`.
 * @returns { OperatorFunction<N,M> }
 * A function that returns an Observable that emits the values from the
 * source Observable transformed by the given `project` function.
 */
export const map = project => source => new Observable(destination => {
  // The index of the value from the source. Used with projection.
  let index = 0;

  return source.subscribe({
    next: value => {
      destination.next(project(value, index++));
    },
    complete: () => destination.complete(),
    error: err => destination.error(err),
  });
});
