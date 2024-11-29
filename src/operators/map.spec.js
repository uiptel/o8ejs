import { fromArray } from '../observable';
import { map } from './map';


describe('map', () => {

  it('simple value multiplication', () => {
    const observer = jest.fn();
    const o = fromArray([1, 2, 3, 4, 7]).pipe(map(value => value * 2));

    o.subscribe(observer);
    expect(observer).toHaveBeenNthCalledWith(1, 2);
    expect(observer).toHaveBeenNthCalledWith(2, 4);
    expect(observer).toHaveBeenNthCalledWith(3, 6);
    expect(observer).toHaveBeenNthCalledWith(4, 8);
    expect(observer).toHaveBeenNthCalledWith(5, 14);
  });

});
