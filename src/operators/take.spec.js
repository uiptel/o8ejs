import { fromArray, timer } from '../observable';
import { take } from './take.js';

describe('take', () => {

  it('sync', () => {
    const observer = jest.fn();
    const o = fromArray([2, 13, 4, 7]).pipe(take(2));

    o.subscribe(observer);
    expect(observer).toHaveBeenNthCalledWith(1, 2);
    expect(observer).toHaveBeenNthCalledWith(2, 13);
    expect(observer).toHaveBeenCalledTimes(2);
  });

  it('async', (done) => {
    const observer = jest.fn();
    const o = timer(470, 330).pipe(take(3));

    o.subscribe({
      next: observer,
      complete: () => {
        try {
          expect(observer).toHaveBeenNthCalledWith(1, 0);
          expect(observer).toHaveBeenNthCalledWith(2, 1);
          expect(observer).toHaveBeenNthCalledWith(3, 2);
          expect(observer).toHaveBeenCalledTimes(3);
          done();
        } catch (error) {
          done(error);
        }
      }
    });
  });
});
