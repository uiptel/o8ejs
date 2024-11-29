import { fromArray } from '../observable';
import { filter } from './filter';


describe('filter', () => {

  it('simple value filter', () => {
    const observer = jest.fn();
    const o = fromArray([1, 2, 3, 4, 7]).pipe(filter(value => value % 2));

    o.subscribe(observer);
    expect(observer).toHaveBeenNthCalledWith(1, 1);
    expect(observer).toHaveBeenNthCalledWith(2, 3);
    expect(observer).toHaveBeenNthCalledWith(3, 7);
  });

});
