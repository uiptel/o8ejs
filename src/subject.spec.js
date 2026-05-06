import { Subject } from './subject';
import { map } from './operators';
import { of } from './observable.js';

describe('subject', () => {

  it('simple subject emit', () => {
    const observer = jest.fn();
    const subject = new Subject();

    subject.pipe(map(value => value * value)).subscribe(observer);
    [1,5,7,12].forEach(value => subject.next(value));

    expect(observer).toHaveBeenCalledTimes(4);
    expect(observer).toHaveBeenNthCalledWith(1, 1);
    expect(observer).toHaveBeenNthCalledWith(2, 25);
    expect(observer).toHaveBeenNthCalledWith(3, 49);
    expect(observer).toHaveBeenNthCalledWith(4, 144);
  });

  it('observable multicast', () => {
    const observer1 = jest.fn();
    const observer2 = jest.fn();
    const subject = new Subject();
    const observable = subject.pipe(map(value => value * value));

    observable.subscribe(observer1);
    observable.subscribe(observer2);

    of(1,2,3).subscribe(value => subject.next(value));

    expect(observer1).toHaveBeenCalledTimes(3);
    expect(observer1).toHaveBeenNthCalledWith(1, 1);
    expect(observer1).toHaveBeenNthCalledWith(2, 4);
    expect(observer1).toHaveBeenNthCalledWith(3, 9);

    expect(observer2).toHaveBeenCalledTimes(3);
    expect(observer2).toHaveBeenNthCalledWith(1, 1);
    expect(observer2).toHaveBeenNthCalledWith(2, 4);
    expect(observer2).toHaveBeenNthCalledWith(3, 9);
  });
});
