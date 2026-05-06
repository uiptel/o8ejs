import { concat, of, timer } from './src/observable.js';
import { switchMap } from './src/operators/switchMap.js';

// 1. Basic emission
of('Hello', 'World').subscribe({
  next: val => console.log(val),
  complete: () => console.log('Stream complete!')
});

// 2. Timer with switchMap (cancels previous inner streams)
const rapidClicks$ = of('click1', 'click2', 'click3');
const asyncTask$ = rapidClicks$.pipe(
  switchMap(id => {
    console.log(`Starting: ${id}`);
    return timer(3000); // Emits 0 after 3000 ms, then completes
  })
);

asyncTask$.subscribe(console.log);

