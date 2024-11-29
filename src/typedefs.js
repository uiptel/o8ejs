
/**
 * @typedef { () => void } TeardownLogic
 */

/**
 * @template T
 * @typedef { (observer?: Observer<T>) => TeardownLogic } SubscribeFn
 */

/**
 * @template T
 * @typedef Observer
 * @property { (value?: T) => void }    next
 * @property { (error?: any) => void }  [error]
 * @property { () => void }             [complete]
 */

/**
 * @template N,M
 * @typedef { (value: N) => M } UnaryFunction
 */

/**
 * @template N,M
 * @typedef { UnaryFunction<Observable<N>, Observable<M>> } OperatorFunction
 */

/**
 * @template N
 * @typedef { UnaryFunction<Observable<N>, Observable<N>> } MonoTypeOperatorFunction
 */

export {};
