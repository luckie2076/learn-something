# 第四章 · 异步操作

> 运行方式：`pnpm install && pnpm dev`，打开终端给出的本地地址。

## 1. 在 Action 中发起异步请求

**异步 action 的本质**：action 就是 store 里的普通方法，可以是 async 函数。在异步完成后调用 `set` 更新状态即可。

```ts
const useStore = create<Store>()((set) => ({
  data: [],
  fetchData: async () => {
    const res = await fetch("/api/data")
    const data = await res.json()
    set({ data })  // 异步完成后更新状态
  },
}))
```

**不用 middleware**：Zustand 不需要像 Redux 那样用 redux-thunk 或 redux-saga 等中间件来支持异步。`set` 在任何地方、任何时刻都可以调用。

## 2. loading 与 error 状态管理

**三态模式**（loading / error / data）是异步操作的标准处理方式：

```ts
interface Store {
  data: Data[]
  loading: boolean
  error: string | null
  fetchData: () => Promise<void>
}
```

**为什么把 loading/error 放 store 里**：
- 多个组件可能都需要知道"正在加载"或"出错了"
- 放在 store 里，任何组件都能读取和展示，不需要逐层传递

## 3. 乐观更新模式

**什么是乐观更新**：在 API 请求发出之前，先假设它成功并更新 UI。如果 API 失败，再回滚。

**为什么需要**：网络有延迟，乐观更新让用户感觉操作"秒响应"——这是提升体验的关键模式。

**回滚策略**：用 `get()` 保存操作前的状态快照，失败时还原。

```ts
toggle: async (id) => {
  const previous = get().data  // 保存快照
  set({ data: optimisticData }) // 乐观更新
  try {
    await apiCall()
  } catch {
    set({ data: previous })  // 回滚
  }
}
```

> 注意：乐观更新适合失败概率较低的场景（如点赞、标记已读）。对于支付等关键操作，应该展示 loading 并等待确认。
