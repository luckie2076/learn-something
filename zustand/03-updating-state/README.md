# 第三章 · 状态更新进阶

> 运行方式：`pnpm install && pnpm dev`，打开终端给出的本地地址。

## 1. set() 直接赋值 vs 函数式更新

**两种写法**：

```ts
// 方式一：直接传对象
set({ count: 100 })

// 方式二：函数式更新（推荐，依赖当前状态时必用）
set((state) => ({ count: state.count + 1 }))
```

**什么时候用函数式更新**：当新值依赖当前状态时。比如计数器、累加器，或者连续多次调用 set。

**关键区别**：直接传对象是「覆盖式」更新——`set({ count: 100 })` 直接从 0 → 100，不管之前是什么。函数式更新基于当前值计算，所以连续 `set((s) => ({ count: s.count + 1 }))` 三次会 +3。

## 2. 嵌套对象/数组的不可变更新

当 state 有多层嵌套（对象里套对象、数组里套对象），更新时需要逐层展开：

```ts
// 更新 post.author.name（3 层嵌套）
set((s) => ({
  post: {
    ...s.post,
    author: { ...s.post.author, name: "新名字" }
  }
}))
```

**展开语法的困局**：嵌套越深，`...` 展开写得越长，可读性越差。这就是 immer 存在的理由。

## 3. immer middleware 简化更新

**immer 做了什么**：让你在 set 里直接"修改" draft 对象，immer 自动追踪修改并生成不可变的新对象。

```ts
import { immer } from "zustand/middleware/immer"

const useStore = create<Store>()(
  immer((set) => ({
    // 直接在 set 里修改
    updateName: (name) => set((state) => {
      state.post.author.name = name  // 不需要展开！
    })
  }))
)
```

**对比**：用 immer 前要 6 行展开，用 immer 后 1 行赋值。对于深层嵌套的数据结构，immer 大幅提升开发体验。
