# Simple Observable Library

A lightweight, zero-dependency JavaScript implementation of the Observable pattern.
Designed for clarity and minimal overhead, it provides core reactive primitives,
synchronous/asynchronous stream creation, and essential composition utilities using 
modern ES Modules.

## Features
-  **Zero Dependencies**: Pure vanilla JavaScript (~2KB minified)
-  **ESM Native**: Built with standard `import`/`export` syntax
-  **Core API**: `Observable` class with `.subscribe()` and `.pipe()`
-  **`switchMap` Operator**: Maps to inner streams with automatic cancellation of previous subscriptions
-  **Creation Utilities**: `of`, `fromArray`, `timer`, `EMPTY`, `throwError`, `concat`
-  **Explicit Teardown**: Predictable resource cleanup for timers, intervals, and nested streams

## Usage
Since this library is distributed as plain JavaScript modules, simply include the files in your project 
and import them directly:

```javascript
import { Observable, of, timer, concat } from './observable.js';
import { switchMap } from './switchMap.js';
```

## Quick Start
```javascript
import { of, timer, concat } from './observable.js';
import { switchMap } from './switchMap.js';

// 1. Basic synchronous emission
of('Hello', 'World').subscribe({
  next: val => console.log(val),
  complete: () => console.log('Stream complete!')
});
// Output: Hello, World, Stream complete!

// 2. Asynchronous timer with switchMap
const clicks$ = of('click1', 'click2', 'click3');
const task$ = clicks$.pipe(
  switchMap(id => {
    console.log(`Starting: ${id}`);
    return timer(100); // Emits 0 after 100ms
  })
);
task$.subscribe(console.log);
```

## API Reference

### Core: `Observable`
The foundation class representing a push-based data stream.
```javascript
import { Observable } from './observable.js';

const observable = new Observable(subscribeFn);
```
| Method | Description |
|---|---|
| `constructor(subscribeFn)` | Accepts a function that receives an `Observer` and may return a **teardown function**. |
| `.subscribe(observerOrNext)` | Subscribes to the stream. Accepts an `{ next, error, complete }` object or a simple `next` callback. Returns a teardown function. |
| `.pipe(...operators)` | Chains functional operators sequentially. Each operator must follow the `(source) => Observable` signature. |

### Creation Functions
| Export | Signature | Description |
|---|---|---|
| `of` | `of(...values)` | Synchronously emits each argument, then completes. |
| `fromArray` | `fromArray(array)` | Synchronously emits each item in an array, then completes. |
| `timer` | `timer(delay, interval?)` | Emits `0` after `delay` ms. If `interval` is provided, emits incrementing numbers repeatedly until unsubscribed. |
| `EMPTY` | `Observable` | Immediately calls `observer.complete()`. |
| `throwError` | `throwError(error)` | Immediately calls `observer.error(error)`. |
| `concat` | `concat(...observables)` | Subscribes to each observable in sequence. Waits for completion before subscribing to the next. |

### Operators
| Export | Signature | Description |
|---|---|---|
| `switchMap` | `switchMap(project)` | Maps each source value to a new Observable via `project(value)`. **Automatically unsubscribes** from the previous inner Observable when a new source value arrives. Propagates `next`, `error`, and `complete` from the active inner stream. |

## Teardown & Resource Cleanup
Every `.subscribe()` call returns a cleanup function. Invoking it releases resources and prevents memory leaks:
```javascript
import { timer } from './observable.js';

const unsubscribe = timer(0, 200).subscribe(console.log);

// Stop the interval after 1.5 seconds
setTimeout(() => {
  unsubscribe(); // Clears internal setTimeout & stops emissions
}, 1500);
```
- **`timer`**: Clears pending `setTimeout`/`setInterval` IDs.
- **`concat`**: Aggregates teardown functions for all sequentially subscribed observables and executes them on disposal.
- **`switchMap`**: Automatically tears down the previous inner subscription before starting a new one. The final teardown function cleans up both the outer and any active inner subscriptions.

## Implementation Notes
- **Error Handling**: Synchronous errors thrown inside `subscribeFn` or `switchMap`'s `project` function are caught via `try/catch` and forwarded to `observer.error()`.
- **Completion Logic**: `switchMap` delays final completion until both the outer stream finishes **and** any active inner stream completes.
- **Observer Normalization**: `.subscribe()` automatically normalizes inputs, allowing you to pass either a full `Observer` object or a simple `next` callback function.
- **Compatibility**: Requires an environment that supports ES Modules (Node.js with `.mjs`/`"type": "module"`, or modern browsers).

## License
MIT
