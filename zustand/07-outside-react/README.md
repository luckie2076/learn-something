# 第七章 · 进阶技巧

> 运行方式：`pnpm install && pnpm dev`，打开终端给出的本地地址。

## 1. 在 React 组件外读写 Store

**Zustand 不依赖 React**：Store 就是普通的 JavaScript 对象，可以在任何地方使用。

```ts
// 组件外读取：getState()
const token = useAuthStore.getState().token

// 组件外写入：setState()
useAuthStore.setState({ token: null })

// 调用 action（action 就是 store 的方法）
useAuthStore.getState().logout()
```

**实际应用场景**：
- 在 axios 拦截器中读取 token
- 在 WebSocket 回调中更新状态
- 在定时器中执行过期检测
- 在 RN 的推送通知回调中操作状态

## 2. subscribe 监听状态变化

`subscribe` 让你在组件外监听状态变化——类似事件监听。

**基础用法**（监听整个 store）：
```ts
const unsub = useStore.subscribe((state, prevState) => {
  console.log("状态变化了", state)
})
// 取消监听
unsub()
```

**带 selector 的订阅**（需 `subscribeWithSelector` 中间件）：
```ts
import { subscribeWithSelector } from "zustand/middleware"

useStore.subscribe(
  (s) => s.count,      // selector
  (count) => {          // 只有 count 变化才触发
    console.log("count 变为", count)
  }
)
```

**典型场景**：
- 有新消息时弹系统通知
- 更新未读角标
- 自动保存草稿

## 3. 状态重置

**核心思路**：将初始状态提取为常量，reset 时直接展开。

```ts
const initialState = { count: 0, name: "" }

const useStore = create<Store>()((set) => ({
  ...initialState,
  reset: () => set({ ...initialState }),
}))
```

**为什么提取为常量**：避免在代码中重复写初始值——改了初始值而忘记改 reset 会出 bug。
