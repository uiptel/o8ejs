import { concat, EMPTY, fromArray, Observable, of, throwError, timer } from './observable';

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

  it('two subscription same observer', ()  => {
    const o = new Observable(observer => {
      observer.next(true);
    });

    const next = jest.fn();
    const observer = { next };

    o.subscribe(observer);
    o.subscribe(observer);

    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenLastCalledWith(true);
  });

  it('two observer', ()  => {
    let i = 0;

    const o = new Observable(observer => {
      observer.next(i++);
    });

    const next1 = jest.fn();
    const next2 = jest.fn();

    o.subscribe({ next: next1 });
    o.subscribe({ next: next2 });

    expect(next1).toHaveBeenCalledTimes(1);
    expect(next1).toHaveBeenLastCalledWith(0);

    expect(next2).toHaveBeenCalledTimes(1);
    expect(next2).toHaveBeenLastCalledWith(1);
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

  it('of', () => {
    const observer = jest.fn();
    of(6, 'two', 4, 'seven').subscribe(observer);
    expect(observer).toHaveBeenCalledTimes(4);
    expect(observer).toHaveBeenLastCalledWith('seven');
  });

  it('timer once', done => {
    const spy = jest.fn();

    timer(550).subscribe({
      next: value => spy(value),
      complete: () => {
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      },
      error: err => done(err),
    });
  });

  it('timer interval', done => {
    const spy = jest.fn();
    const complete = jest.fn();
    const iterations = 3;

    const teardown = timer(0, 270).subscribe({
      next: value => {
        spy(value);
        if (value === iterations - 1) {
          teardown();
          expect(spy).toHaveBeenNthCalledWith(1, 0);
          expect(spy).toHaveBeenNthCalledWith(2, 1);
          expect(spy).toHaveBeenNthCalledWith(3, 2);
          done();
        }
      },
      complete,
      error: err => done(err),
    });

  });

  it('concat empty', () => {
    const observer = jest.fn();
    const complete = jest.fn();
    const error = jest.fn();

    concat().subscribe({
      next: observer,
      complete: complete,
      error: error,
    });

    expect(observer).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('concat simple', () => {
    const observer = jest.fn();
    const complete = jest.fn();

    concat(of(1,2), of(3,4)).subscribe({
      next: observer,
      complete: complete,
    });

    expect(observer).toHaveBeenNthCalledWith(1, 1);
    expect(observer).toHaveBeenNthCalledWith(2, 2);
    expect(observer).toHaveBeenNthCalledWith(3, 3);
    expect(observer).toHaveBeenNthCalledWith(4, 4);
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('concat with error', () => {
    const events = [];
    const observer = {
      next: value => events.push(value),
      error: error => events.push(`error: ${error}`),
      complete: () => events.push('complete'),
    };

    concat(of(1), throwError('oops'), of(2)).subscribe(observer);
    expect(events).toEqual([1, 'error: oops']);
  });

  it('concat with empty observable', () => {
    const events = [];

    concat(EMPTY, of(1), EMPTY).subscribe({
      next: value => events.push(value),
      error: error => events.push(`error: ${error}`),
      complete: () => events.push('complete'),
    });

    expect(events).toEqual([1, 'complete']);
  });

  it('concat with teardown', () => {
    const events = [];
    const source1 = new Observable(observer => {
      observer.next(1);
      observer.complete();
      return () => events.push('teardown1');
    });
    const source2 = new Observable(observer => {
      observer.next(2);
      observer.complete();
      return () => events.push('teardown2');
    });

    const teardown = concat(source1, source2).subscribe({
      next: value => events.push(value),
      error: error => events.push(`error: ${error}`),
      complete: () => events.push('complete'),
    });

    teardown();

    expect(events).toEqual([1, 2, 'complete', 'teardown2', 'teardown1']);

  });

  it('concat with timer', done => {
    const events = [];

    concat(of('start'), timer(250)).subscribe({
      next: value => events.push(value),
      complete: () => {
        events.push('complete');
        expect(events).toEqual(['start', 0, 'complete']);
        done();
      },
      error: error => done(error),
    });


  });

});
