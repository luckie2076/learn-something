// 测试文件：和被测文件放一起、文件名以 .test.js 结尾，Vitest 会自动发现它。
// 一个 test() 就是一条「断言」：写下你预期的行为，Vitest 跑一遍告诉你对不对。
import { describe, it, expect } from 'vitest';
import { add, subtract, calculateDiscount } from './math.js';

// describe 只是把相关的测试分组，方便阅读，不影响运行。
describe('add', () => {
  it('1 + 2 = 3', () => {
    expect(add(1, 2)).toBe(3);
  });
  it('支持负数', () => {
    expect(add(-1, 1)).toBe(0);
  });
});

describe('subtract', () => {
  it('5 - 3 = 2', () => {
    expect(subtract(5, 3)).toBe(2);
  });
});

describe('calculateDiscount', () => {
  it('打 8 折：100 元减 20', () => {
    expect(calculateDiscount(100, 0.2)).toBe(80);
  });

  // 测「异常路径」：好的测试不只测正常情况，也测边界与报错。
  it('价格为负时抛错', () => {
    expect(() => calculateDiscount(-1, 0.2)).toThrow('price must be >= 0');
  });

  it('折扣比例越界时抛错', () => {
    expect(() => calculateDiscount(100, 1.5)).toThrow();
  });
});
