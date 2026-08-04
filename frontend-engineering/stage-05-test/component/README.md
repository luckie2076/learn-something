# 组件测试（Component Testing）

> 本目录把被测对象从「纯函数」升级到「渲染出来的 UI」。配套可运行示例见 `src/counter.test.js`。

## 1. 和单元测试的区别

| | 单元测试 | 组件测试 |
|---|---|---|
| 被测对象 | 函数 / 类 | 一个组件（渲染出的 DOM + 交互） |
| 依赖 | 无外部依赖 | 需要 DOM 环境（jsdom / happy-dom） |
| 关注 | 输入输出是否正确 | 用户操作 → 界面如何变化 |
| 速度 | 极快 | 较快，但仍比 E2E 快几个数量级 |

单元测试回答「这个函数算得对吗」，组件测试回答「用户点这个按钮，界面变了吗、变对了吗」。

## 2. 关键：DOM 环境

组件要跑起来，得有 `document`、`addEventListener` 这些浏览器 API。测试器在 node 下没有它们，所以需要一个「假浏览器」：

- **happy-dom** / **jsdom**：用 JS 模拟 DOM，快、轻量，适合单元测试级组件。
- 本示例用 `// @vitest-environment happy-dom` 让单个文件在 DOM 环境跑（也可用 `vitest.config.js` 全局指定）。

## 3. 关键：Testing Library 的哲学

它刻意**不让你按「内部实现」测**（比如直接读组件的内部 state 变量），而是让你**像用户一样按「看到的内容」找元素**：

- `screen.getByText('+')` —— 按用户看到的文字找按钮。
- `fireEvent.click(...)` —— 模拟一次真实点击。
- 然后断言界面上的文字 / 结构变了。

这样做的好处：你改了内部实现（比如把状态从 `count` 改名），只要用户看到的行为不变，测试就不需要改——**测试绑定的是行为，不是实现**，重构时更稳。

## 4. 动手跑

```bash
pnpm install
pnpm test
```

观察点：

- 3 条用例全绿：初始值、点击加、点击减都符合预期。
- 把 `counter.js` 里 `count += 1` 改成 `count += 2` 再跑，测试会立刻红——证明它在守着「行为」。
- 注意测试文件顶部的 `@vitest-environment happy-dom`：去掉它会在 node 环境跑，报 `document is not defined`。

真正项目里，组件测试常配合 React / Vue + `@testing-library/react`（`@testing-library/dom` 是它们的底层）。本示例刻意不引框架，让你看清「组件测试的本质 = 渲染 + 模拟用户操作 + 断言 DOM」。

上一层回 [`../unit/`](../unit/README.md)，下一层看 [`../e2e/`](../e2e/README.md)。
