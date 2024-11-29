import { Observable } from '../observable';

/**
 * @template T
 * @param { (value: T, index: number) => boolean } predicate
 * A function that evaluates each value emitted by the source Observable.
 * If it returns `true`, the value is emitted, if `false` the value is not passed to the output
 * Observable. The `index` parameter is the number `i` for the i-th source emission that has happened
 * since the subscription, starting from the number `0`.
 *
 * @param { any } [thisArg]
 * An optional argument to determine the value of `this` in the `predicate` function.
 *
 * @returns { MonoTypeOperatorFunction<T> }
 * A function that returns an Observable that emits items from the
 * source Observable that satisfy the specified `predicate`.
 */
export function filter(predicate, thisArg) {

  return source => new Observable(destination => {
    let index = 0;

    return source.subscribe({
      next: value => {
        predicate.call(thisArg, value, index++) && destination.next(value);
      },
    });
  });
}