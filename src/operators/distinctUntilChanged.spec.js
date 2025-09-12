import { fromArray, timer } from '../observable';
import { distinctUntilChanged } from './distinctUntilChanged';
import { take } from './take.js';
import { map } from './map.js';


describe('distinctUntilChanged', () => {

  it('sync: simple value', () => {
    const observer = jest.fn();
    const o = fromArray([0, 1, 3, 3, 4, 4, 4, 7]).pipe(distinctUntilChanged());

    o.subscribe(observer);
    expect(observer).toHaveBeenNthCalledWith(1, 0);
    expect(observer).toHaveBeenNthCalledWith(2, 1);
    expect(observer).toHaveBeenNthCalledWith(3, 3);
    expect(observer).toHaveBeenNthCalledWith(4, 4);
    expect(observer).toHaveBeenNthCalledWith(5, 7);
  });

  it('async: simple sequence', done => {
    const observer = jest.fn();
    const o = timer(220, 210).pipe(take(3),distinctUntilChanged());

    o.subscribe({
      next: observer,
      complete: () => {
        try {
          expect(observer).toHaveBeenNthCalledWith(1, 0);
          expect(observer).toHaveBeenNthCalledWith(2, 1);
          expect(observer).toHaveBeenNthCalledWith(3, 2);
          expect(observer).toHaveBeenCalledTimes(3);
          done();
        } catch (err) {
          done(err);
        }
      },
      error: err => done(err),
    });
  });

  it('async: repeated value sequence', done => {
    const observer = jest.fn();
    const o = timer(220, 110).pipe(
      take(6),
      map(v => v > 2 ? 'b' : 'a'),
      distinctUntilChanged()
    );

    o.subscribe({
      next: observer,
      complete: () => {
        try {
          expect(observer).toHaveBeenNthCalledWith(1, 'a');
          expect(observer).toHaveBeenNthCalledWith(2, 'b');
          expect(observer).toHaveBeenCalledTimes(2);
          done();
        } catch (err) {
          done(err);
        }
      },
      error: err => done(err),
    });
  });
});
