import { of, timer } from './src/observable.js';
import { map, switchMap, take } from './src/operators/index.js';


const o = of(3, 7).pipe(
  switchMap(
    val => {
      console.log('outer val =>', val);
      return timer(0, 350).pipe(take(3),map(timerVal => `timerVal: ${timerVal}; val: ${val}`));
    },
  )
);

o.subscribe({
  next: val => {  console.log(`val => ${val}`); },
  complete: () => { console.log('complete =>'); },
  error: err => { console.log('error =>', err); },
});
