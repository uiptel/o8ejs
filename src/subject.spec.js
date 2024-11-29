import { Subject } from './subject';
import { map } from './operators';

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
});
