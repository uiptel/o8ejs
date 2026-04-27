import { Observable } from '../observable.js';


/**
 * Simple switchMap implementation using Observable class
 * @param {Function} project - Function that returns an observable for each value
 * @returns {Function} - Operator function that transforms source observable
 */
export const switchMap = project => source => new Observable(observer => {
  let innerSubscription = null;
  let outerCompleted = false;
  let innerCompleted = true;

  const outerSubscription = source.subscribe({
    next: value => {

      // Cancel previous inner observable
      if (innerSubscription && !innerCompleted) {
        innerSubscription();
      }

      try {
        // Create new inner observable and subscribe to
        innerCompleted = false;
        innerSubscription = project(value).subscribe({
          next: innerValue => observer.next(innerValue),
          error: err => observer.error(err),
          complete: () => {
            innerCompleted = true;
            // If outer completed and no active inner, complete the result
            if (outerCompleted) {
              observer.complete();
            }
          },
        });
      } catch (err) {
        observer.error(err);
      }
    },
    error: (err) => observer.error(err),
    complete: () => {
      outerCompleted = true;
      // Only complete if no active inner observable
      //console.log('switchMap::outer:complete innerCompleted => ', innerCompleted);
      if (innerCompleted) {
        observer.complete();
      }
    },
  });

  // Return teardown logic
  return () => {
    outerSubscription();
    if (innerSubscription) {
      innerSubscription();
    }
  };
});



