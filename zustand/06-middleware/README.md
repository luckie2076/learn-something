# 第六章 · 中间件

> 运行方式：`pnpm install && pnpm dev`，打开终端给出的本地地址。

## 1. devtools：Redux DevTools 调试

**Redux DevTools 集成**：Zustand 原生支持 Redux DevTools 浏览器扩展。

```ts
import { devtools } from "zustand/middleware"

const useStore = create<Store>()(
  devtools(
    (set) => ({
      // ... 状态和方法
    }),
    { name: "My Store" }, // DevTools 中显示的名称
  ),
)
```

**action 命名**：`set` 的第三个参数可以给 action 命名，在 DevTools 中更清晰：

```ts
// DevTools 中会显示 "addTodo" 而不是 "(anonymous)"
set((s) => ({ ... }), false, "addTodo")
```

**为什么有用**：可以回溯每次状态变化、查看任意时刻的快照、甚至时间旅行调试——对于排查复杂的状态逻辑非常实用。

## 2. persist：状态持久化到 localStorage

**persist 中间件**自动将 store 状态同步到 localStorage，刷新页面后自动恢复。

```ts
import { persist } from "zustand/middleware"

const useStore = create<Store>()(
  persist(
    (set) => ({ /* ... */ }),
    { name: "my-storage-key" }, // localStorage 中的 key
  ),
)
```

**常用场景**：
- 用户偏好设置（主题、语言、字号）
- 未提交的表单草稿
- 购物车内容

**注意事项**：
- localStorage 只能存字符串，Zustand 自动做 JSON 序列化/反序列化
- 函数、Map、Set 等不可序列化的值不能持久化
- 敏感信息（密码、token）不应放入 localStorage
