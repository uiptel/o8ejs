import { timer } from './src/observable.js';
import { map, switchMap, take } from './src/operators/index.js';


const o = timer(0, 520).pipe(
  take(9),
  switchMap(
    val => timer(0, 350).pipe(
      take(2),
      map(innerTimer => `val: ${val}; innerTimer: ${innerTimer};`)
    )
  )
);

o.subscribe({
  next: val => {  console.log(`val => ${val}`); },
  complete: () => { console.log('complete =>'); },
  error: err => { console.log('error =>', err); },
});
