import { fromArray, Observable, timer } from './observable';

describe('observable', () => {

  it('new Observable defined', () => {
    const o = new Observable();
    expect(o).toBeDefined();
  });

  it('empty flow', ()  => {
    const o = new Observable();
    const observer = jest.fn();
    const teardown = o.subscribe(observer);
    teardown();

    expect(observer).not.toHaveBeenCalled();
  });

  it('sync flow', ()  => {
    const o = new Observable(observer => {
      observer.next(false);
      observer.next(true);
    });
    const next = jest.fn();
    const observer = { next };
    const teardown = o.subscribe(observer);
    teardown();

    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenLastCalledWith(true);
  });

  it('sync flow with teardown', ()  => {
    const o = new Observable(observer => {
      observer.next(true);
      observer.next(false);

      return () => observer.complete();
    });

    const next = jest.fn();
    const complete = jest.fn();
    const teardown = o.subscribe({ next, complete });

    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenLastCalledWith(false);
    expect(complete).not.toHaveBeenCalled();

    teardown();
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('fromArray', ()  => {
    const observer = jest.fn();
    fromArray([1, 'two', 3, 4, 'five']).subscribe(observer);
    expect(observer).toHaveBeenCalledTimes(5);
    expect(observer).toHaveBeenLastCalledWith('five');
  });

  it('timer once', async () => new Promise((resolve, reject) => {
    const spy = jest.fn();

    timer(550).subscribe({
      next: value => spy(value),
      complete: () => {
        expect(spy).toHaveBeenCalledTimes(1);
        resolve();
      },
      error: () => reject(),
    });
  }));

  it('timer interval', async () => new Promise((resolve, reject) => {
    const spy = jest.fn();
    const iterations = 7;

    const teardown = timer(0, 150).subscribe({
      next: value => {
        spy(value);
        if (value === iterations - 1) {
          teardown();
        }
      },
      complete: () => {
        expect(spy).toHaveBeenCalledTimes(iterations);
        resolve();
      },
      error: () => reject(),
    });

  }));

});
