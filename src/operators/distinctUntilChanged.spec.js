import { fromArray } from '../observable';
import { distinctUntilChanged } from './distinctUntilChanged';


describe('distinctUntilChanged', () => {

  it('simple value multiplication', () => {
    const observer = jest.fn();
    const o = fromArray([0, 1, 3, 3, 4, 4, 4, 7]).pipe(distinctUntilChanged());

    o.subscribe(observer);
    expect(observer).toHaveBeenNthCalledWith(1, 0);
    expect(observer).toHaveBeenNthCalledWith(2, 1);
    expect(observer).toHaveBeenNthCalledWith(3, 3);
    expect(observer).toHaveBeenNthCalledWith(4, 4);
    expect(observer).toHaveBeenNthCalledWith(5, 7);
  });
});
