import { Observable } from '../observable';


/**
 * Returns a result {@link Observable} that emits all values pushed by the source observable if they
 * are distinct in comparison to the last value the result observable emitted.
 *
 * When provided without parameters or with the first parameter (`{@link distinctUntilChanged#comparator comparator}`),
 * it behaves like this:
 *
 * 1. It will always emit the first value from the source.
 * 2. For all subsequent values pushed by the source, they will be compared to the previously emitted values
 *    using the provided `comparator` or an `===` equality check.
 * 3. If the value pushed by the source is determined to be unequal by this check, that value is emitted and
 *    becomes the new "previously emitted value" internally.
 *
 * When the second parameter (`{@link distinctUntilChanged#keySelector keySelector}`) is provided, the behavior
 * changes:
 *
 * 1. It will always emit the first value from the source.
 * 2. The `keySelector` will be run against all values, including the first value.
 * 3. For all values after the first, the selected key will be compared against the key selected from
 *    the previously emitted value using the `comparator`.
 * 4. If the keys are determined to be unequal by this check, the value (not the key), is emitted
 *    and the selected key from that value is saved for future comparisons against other keys.
 *
 *
 * @template K,T
 * @param { (previous: K, current: K) => boolean } [comparator]
 * A function used to compare the previous and current keys for
 * equality. Defaults to a `===` check.
 *
 * @param { (value: T) => K } [keySelector]
 * Used to select a key value to be passed to the `comparator`.
 *
 * @returns { MonoTypeOperatorFunction }
 * A function that returns an Observable that emits items from the
 * source Observable with distinct values.
 */
export function distinctUntilChanged(comparator = defaultCompare, keySelector = identity) {

  return source => new Observable(destination => {
    let previousKey;
    let first = true;

    return source.subscribe({
      next: value => {
        const currentKey = keySelector(value);

        if (first || !comparator(previousKey, currentKey)) {
          first = false;
          previousKey = currentKey;

          // Emit the value!
          destination.next(value);
        }
      },
    });
  });
}

/**
 * @template T
 * @param { T } a
 * @param { T } b
 * @returns { boolean }
 */
function defaultCompare(a, b) {
  return a === b;
}

/**
 * @template T
 * @param { T } x
 * @returns { T }
 */
function identity(x) {
  return x;
}
