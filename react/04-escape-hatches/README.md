# 第四章 · 脱围机制（Escape Hatches）

> 运行：`pnpm install && pnpm dev`。代码在 `src/App.jsx` 按小节聚合，每节一个文件。
> 这一章叫 “Escape Hatches”（脱围机制）：React 的声明式模型覆盖 90% 场景，
> 但总有些事（碰 DOM、连外部系统）必须“逃”出去做。这些 API 是逃生舱，不是日常首选。

---

## 1. 使用 ref 引用值
`useRef` 返回一个 `{ current }` 容器，跨渲染保留，**但改它不触发重渲染**（与 state 的本质区别）。

**为什么需要**：有些值不该引发 UI 重画——定时器 ID、上一次的输入、滚动位置。用 state 会白白重渲染，用 ref 就安静地存着。

## 2. 使用 ref 操作 DOM
偶尔必须直接碰 DOM（聚焦、滚动、测量尺寸）。把 `ref` 挂到 JSX 上，React 会把它指向真实节点：

```jsx
const inputRef = useRef(null)
<input ref={inputRef} />
inputRef.current.focus()
```

**原则**：能声明式解决就别用 ref 命令式操作，ref 只用于 React 够不着的场景。

## 3. 使用 Effect 进行同步
`useEffect(fn, deps)` 在「渲染之后」运行，用来让组件与外部系统同步（浏览器 API、网络、订阅）。`deps` 列出“哪些值变了就要重新同步”，返回的清理函数用于断开。

```jsx
useEffect(() => {
  document.title = `点击了 ${count} 次`
}, [count])
```

## 4. 你可能不需要 Effect
**最重要的一节**：Effect 是脱围机制，别滥用。以下情况**不需要** Effect：
- 根据 props/state 算派生值 → 直接在渲染时计算（见示例）；
- 处理用户事件 → 写在事件处理函数里。

只有“渲染后要与外部系统同步”才用 Effect。少写 Effect，bug 自然少。

## 5. 响应式 Effect 的生命周期
它**不同于**组件的挂载/卸载：Effect 按需「开始同步 / 停止同步」。依赖变化 → 先跑清理函数停掉旧的 → 再跑函数开始新的。理解这点，才能正确声明依赖、避免无限循环。

## 6. 将事件从 Effect 中分开
`useEffectEvent`（React 19）把“非响应式”代码从 Effect 剥离。Effect 只因 `roomId` 变化而重同步；在事件里读 `theme` 不会触发重连。让 Effect 的依赖更精准、行为更可预测。

```jsx
const onConnected = useEffectEvent(() => theme)
useEffect(() => { connect(roomId, onConnected()) }, [roomId])
```

## 7. 移除 Effect 依赖
**正确做法**是重构代码，而不是粗暴改依赖数组去骗 React。常见手法：把「渲染时新建的对象/函数」搬进 Effect 内部创建，依赖就消失了（见示例）。否则会出现“每次渲染都重跑”甚至无限循环。

## 8. 使用自定义 Hook 复用逻辑
把“带状态的逻辑”封装成以 `use` 开头的函数，多个组件即可复用，不必各自写一遍 Effect。

```jsx
function useWindowWidth() { /* useState + useEffect 监听 resize */ }
```

**为什么**：自定义 Hook 是 React 复用状态逻辑的唯一正统方式（不是组件、不是类）。
