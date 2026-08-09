# 第一章 · JSX 基本语法

> 教学导向：每节先讲「为什么这样设计」，再展示最小可运行代码。
> 运行方式：`cd 01-jsx-syntax && pnpm install && pnpm dev`。
>
> 下一章：[表达式与属性](../02-expressions/README.md)

---

## 1. JSX 是什么？

**是什么**：JSX 是 JavaScript 的语法扩展，让你在 JS 里写看起来像 HTML 的标签。

**为什么**：它不是字符串也不是模板语言，编译后就是 `React.createElement(type, props, children)`，本质是纯 JS 调用。这意味着你可以在标签中无缝使用 JS 的全部能力。

## 2. 标签规则

**是什么**：JSX 比 HTML 更严格：
- 所有标签必须闭合（包括 `<br />`、`<img />` 等）
- return 只能返回**单个根节点**

**为什么**：JSX 编译后是 `React.createElement(...)` 调用，JavaScript 函数只能返回一个值，所以 JSX 表达式也只能有一个根。

## 3. Fragment 片段

**是什么**：`<></>` 空标签，用来包裹多个元素而不产生多余的 DOM 节点。

**为什么**：有时你不想要多余的 `<div>` 包裹（会打乱 CSS 布局或语义结构），Fragment 让多个元素在逻辑上是一组，渲染时却「隐身」。
