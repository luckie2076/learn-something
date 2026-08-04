// @vitest-environment happy-dom
// 上面这行告诉 Vitest：本文件在「DOM 环境」里跑（而不是默认的 node），
// 这样测试里才能用 document、fireEvent 等浏览器 API。组件测试必备。
import { describe, it, expect, afterEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/dom';
import { createCounter } from './counter.js';

// 每个用例后清掉挂载的 DOM，避免互相污染（等价于 Testing Library 的 cleanup）。
afterEach(() => {
  document.body.innerHTML = '';
});

// Testing Library 的核心哲学：像用户一样「按看到的内容查找」，而不是按内部实现。
// 例如用 getByText('+') 找按钮，而不是按 ref / 内部变量。
describe('createCounter', () => {
  it('初始显示传入的值', () => {
    document.body.appendChild(createCounter(5));
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('点击 + 数字加一', () => {
    document.body.appendChild(createCounter(0));
    fireEvent.click(screen.getByText('+'));
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('点击 - 数字减一', () => {
    document.body.appendChild(createCounter(0));
    fireEvent.click(screen.getByText('-'));
    expect(screen.getByText('-1')).toBeTruthy();
  });
});
