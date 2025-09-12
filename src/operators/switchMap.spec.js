import { of, timer } from '../observable';
import { switchMap } from './switchMap';
import { take } from './take.js';
import { map } from './map.js';


describe('switchMap', () => {

  it('sync', () => {
    const observer = jest.fn();
    const o = of(2, 3).pipe(switchMap(val => of(val, val * val, val * val * val)));

    o.subscribe(observer);
    expect(observer).toHaveBeenNthCalledWith(1, 2);
    expect(observer).toHaveBeenNthCalledWith(2, 4);
    expect(observer).toHaveBeenNthCalledWith(3, 8);
    expect(observer).toHaveBeenNthCalledWith(4, 3);
    expect(observer).toHaveBeenNthCalledWith(5, 9);
    expect(observer).toHaveBeenNthCalledWith(6, 27);
  });

  it('async1', (done) => {
    const observer = jest.fn();
    const o = timer(470, 330).pipe(take(2), switchMap(val => of(val, val * val)));

    o.subscribe({
      next: observer,
      complete: () => {
        try {
          expect(observer).toHaveBeenNthCalledWith(1, 0);
          expect(observer).toHaveBeenNthCalledWith(2, 0);
          expect(observer).toHaveBeenNthCalledWith(3, 1);
          expect(observer).toHaveBeenNthCalledWith(4, 1);
          expect(observer).toHaveBeenCalledTimes(4);
          done();
        } catch (error) {
          done(error);
        }
      }
    });
  });

  it('async2', (done) => {
    const observer = jest.fn();
    const o = of(3, 7).pipe(
      switchMap(
        val => timer(0, 350).pipe(take(3),map(timerVal => `timerVal: ${timerVal}; val: ${val}`)),
      )
    );

    o.subscribe({
      next: observer,
      complete: () => {
        try {
          expect(observer).toHaveBeenNthCalledWith(1, 'timerVal: 0; val: 7');
          expect(observer).toHaveBeenNthCalledWith(2, 'timerVal: 1; val: 7');
          expect(observer).toHaveBeenNthCalledWith(3, 'timerVal: 2; val: 7');
          expect(observer).toHaveBeenCalledTimes(3);
          done();
        } catch (error) {
          done(error);
        }
      }
    });
  });

});
