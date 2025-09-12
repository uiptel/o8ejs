import { fromArray, timer } from '../observable';
import { filter } from './filter';
import { take } from './take.js';


describe('filter', () => {

  it('sync: simple value filter', () => {
    const observer = jest.fn();
    const o = fromArray([1, 2, 3, 4, 7]).pipe(filter(value => value % 2));

    o.subscribe(observer);
    expect(observer).toHaveBeenNthCalledWith(1, 1);
    expect(observer).toHaveBeenNthCalledWith(2, 3);
    expect(observer).toHaveBeenNthCalledWith(3, 7);
  });

  it('async', done => {
    const observer = jest.fn();
    const o = timer(170, 310).pipe(take(6), filter(value => value % 2));

    o.subscribe({
      next: observer,
      complete: () => {
        try {
          expect(observer).toHaveBeenNthCalledWith(1, 1);
          expect(observer).toHaveBeenNthCalledWith(2, 3);
          expect(observer).toHaveBeenNthCalledWith(3, 5);
          expect(observer).toHaveBeenCalledTimes(3);
          done();
        } catch (error) {
          done(error);
        }
      },
    });

  });

});
