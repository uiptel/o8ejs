import { fromArray, timer } from '../observable';
import { map } from './map';
import { take } from './take.js';


describe('map', () => {

  it('sync: simple value multiplication', () => {
    const observer = jest.fn();
    const o = fromArray([1, 2, 3, 4, 7]).pipe(map(value => value * 2));

    o.subscribe(observer);
    expect(observer).toHaveBeenNthCalledWith(1, 2);
    expect(observer).toHaveBeenNthCalledWith(2, 4);
    expect(observer).toHaveBeenNthCalledWith(3, 6);
    expect(observer).toHaveBeenNthCalledWith(4, 8);
    expect(observer).toHaveBeenNthCalledWith(5, 14);
  });

  it('async', done => {
    const observer = jest.fn();
    const o = timer(120, 330).pipe(take(3), map(value => `value:${value}`));

    o.subscribe({
      next: observer,
      complete: () => {
        try {
          expect(observer).toHaveBeenNthCalledWith(1, 'value:0');
          expect(observer).toHaveBeenNthCalledWith(2, 'value:1');
          expect(observer).toHaveBeenNthCalledWith(3, 'value:2');
          expect(observer).toHaveBeenCalledTimes(3);
          done();
        } catch (error) {
          done(error);
        }
      },
    });
  });

});
