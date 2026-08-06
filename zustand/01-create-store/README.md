# 第一章 · 创建 Store

> 运行方式：`pnpm install && pnpm dev`，打开终端给出的本地地址。

## 1. 第一个 Store：计数器

**`create()` 是什么**：核心 API，创建一个 Zustand store，返回一个自定义 Hook。

**为什么返回 Hook**：Zustand 的设计哲学是"把 store 当成 Hook"——无需 Provider 包裹，直接在组件里调用 `useXxxStore()` 就能读写状态。这比 Redux 的 `<Provider>` + `connect` 简洁得多。

```ts
const useStore = create<StoreType>()((set) => ({
  count: 0,
  increase: () => set((s) => ({ count: s.count + 1 })),
}))
```

**`set` 是什么**：更新状态的唯一方式。支持两种写法：
- 直接传对象：`set({ count: 10 })`
- 传函数（推荐）：`set((state) => ({ count: state.count + 1 }))` —— 函数式写法总能拿到最新状态

## 2. 原始值状态的读写

Store 中的状态可以是任何 JS 值——原始值（string、number、boolean）、对象、数组都行。

**本质认识**：Zustand 的 store 就是一个 JavaScript 对象。`set` 做浅合并——你传 `{ name: "李四" }`，只更新 `name` 字段，其他字段保持不变。

## 3. 对象状态的读写

当状态是对象时，更新需要"不可变"地展开：

```ts
// 正确：展开旧对象，覆盖要改的字段
set((s) => ({ user: { ...s.user, age: 30 } }))

// 错误：直接 mutate（Zustand 默认不会深比较）
s.user.age = 30  // 这样做无效
```

**为什么需要不可变更新**：React 用引用比较（`===`）判断状态是否变化。直接修改对象属性不会改变引用，React 认为没变化就不重渲染。

## 4. 在 Store 里定义 Action

**Action 的概念**：在 Zustand 中，action 就是 store 里的普通方法。它和状态声明在同一处，没有 Redux 的"action creator + reducer"样板代码。

```ts
const useStore = create<StoreType>()((set) => ({
  todos: [],
  addTodo: (text) => set((s) => ({ todos: [...s.todos, ...] })),
  toggleTodo: (id) => set((s) => ({ todos: s.todos.map(...) })),
}))
```

**好处**：状态和方法定义在一起，结构清晰、无需在多个文件间跳转。也更符合"colocation"（就近组织）原则。
