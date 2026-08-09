# 第三章 · 元素与子元素

> 教学导向：每节先讲「为什么这样设计」，再展示最小可运行代码。
> 运行方式：`cd 03-elements-and-children && pnpm install && pnpm dev`。
>
> 上一章：[表达式与属性](../02-expressions/README.md) | 下一章：[条件与循环渲染](../04-condition-and-loop/README.md)

---

## 1. 父子元素嵌套

**是什么**：JSX 标签可无限嵌套，写在标签 A 之间的内容就是 A 的 children。

**为什么**：嵌套形成「UI 树」，让人一眼看清界面层级。React 内部用这棵「虚拟 DOM 树」高效更新真实 DOM。

## 2. children 概念

**是什么**：children 就是「夹在标签中间」的内容。可以是文本、JSX 元素、表达式甚至另一个组件。

**为什么**：这是 React 组件组合的核心机制。一个容器组件不需要知道它包裹了什么，只需渲染 `{children}`。

## 3. 多元素返回与 Fragment

**是什么**：当需要返回多个并列元素时，外层用 `<></>`（Fragment）包裹，渲染时不会产生多余的 DOM 节点。

**为什么**：有时多余的 `<div>` 会破坏 CSS 布局或语义结构（如 `<ul>` 下只能放 `<li>`）。Fragment 让你既满足「单根节点」规则，又不污染 DOM。
