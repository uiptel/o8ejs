import sayHello from './index.js';

describe('index', () => {

  it('hello world', () => {
    expect(sayHello('world')).toBe('Hello, world!');
  });

});
