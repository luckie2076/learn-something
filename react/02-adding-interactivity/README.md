# 第二章 · 添加交互（Adding Interactivity）

> 对应官方文档：[Adding Interactivity](https://react.dev/learn/adding-interactivity)
> 运行：`pnpm install && pnpm dev`。代码在 `src/App.jsx` 按小节聚合，每节一个文件。
>
> 上一章：[描述 UI](../01-describing-the-ui/README.md)&nbsp;&nbsp;|&nbsp;&nbsp;下一章：[管理状态](../03-managing-state/README.md)

---

## 1. 响应事件
**为什么用 `onClick` 而非 `onclick`**：JSX 属性就是 JS 标识符，按 JS 习惯用**小驼峰**。处理函数写在 JSX 外（或内联箭头函数），React 在事件发生时调用它。

```jsx
<button onClick={handleClick}>点我</button>
```

## 2. State: 组件的记忆
**为什么普通变量不行**：组件函数每次渲染都会重新执行，普通局部变量会重置。

**`useState` 做了什么**：`const [count, setCount] = useState(0)` 把“当前值”和“修改它的函数”一起交给你，而 React 在背后替你保存这个值，跨渲染保留。这就是组件区别于普通函数的“记忆”能力。

## 3. 渲染和提交
一次 UI 更新走三步：**触发 → 渲染 → 提交**。
- **触发**：事件或 `setState` 请求渲染；
- **渲染**：React 调用你的组件函数，算出新的 JSX；
- **提交**：React 才去改真实 DOM，屏幕更新。

**为什么重要**：你永远不直接操作 DOM，只描述“想要什么状态”，React 负责把差异应用到屏幕。这是声明式的核心。

## 4. state 如同一张快照
**核心认知**：调用 `setCount(x)` 不会立刻改变当前作用域里的 `count`，而是“请求”用新值重新渲染。同一个事件处理函数里，你读到的 `count` 始终是本次渲染的那张旧快照。

```jsx
function handleClick() {
  setCount(count + 1)
  console.log(count) // 还是旧值
}
```

**为什么这样设计**：保证渲染结果可预测——一次渲染里 state 恒定不变，组件逻辑才不会“读到一半变了”。

## 5. 把一系列 state 更新加入队列
连续 `setCount(count + 1)` 三次只 +1，因为三次都基于同一张旧快照。改用**更新函数**：

```jsx
setCount((c) => c + 1)  // 排队：每次基于上一次结果
```

React 会把它们排进队列依次计算，最终 +3。**规律**：下一次的值依赖上一次的值时，永远用更新函数。

## 6. 更新 state 中的对象
state 中的对象要**不可变**更新：`setPerson({ ...person, city: 'Shanghai' })`。

**为什么不能直接 `person.city = 'Shanghai'`**：React 用 `Object.is` 比较新旧 state 决定是否重渲染。直接改原对象，引用没变，React 认为“没变”就不更新。展开运算符 `{...person, ...}` 创建新对象，引用变了，React 才知道要更新。

## 7. 更新 state 中的数组
数组同样当只读：用 `[...arr, x]`、`filter`、`map` 等返回**新数组**的方式更新，不要 `push` / `splice` 原数组。原因同上——保持引用变化 + 不可变性，让 React 的更新与你的“纯函数”心智模型保持一致。
