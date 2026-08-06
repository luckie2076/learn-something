# 第五章 · Store 拆分模式

> 运行方式：`pnpm install && pnpm dev`，打开终端给出的本地地址。

## 1. 单个 Slice 的定义与使用

**Slice 是什么**：一个工厂函数，接收 `set` 和 `get`，返回某个领域的状态和方法。

```ts
const createBearSlice = (set) => ({
  bears: 0,
  addBear: () => set((s) => ({ bears: s.bears + 1 })),
})

const useStore = create((set) => ({
  ...createBearSlice(set),  // 展开到 store 中
}))
```

**为什么要拆分**：把所有状态写在一个 `create` 里，随着功能增多会变得臃肿。Slice 模式让每个领域独立维护，merge 到一起使用。

## 2. 多个 Slice 组合成完整 Store

**组合多个 slice**：每个 slice 是独立的工厂函数，通过对象展开合并为一个完整的 store。

```ts
const useStore = create<CombinedStore>()((...args) => ({
  ...createUserSlice(...args),
  ...createCartSlice(...args),
  ...createUISlice(...args),
}))
```

**关键认识**：
- 每个 slice 只关心自己的领域——遵循单一职责原则
- 类型定义来自所有 slice 的交叉类型（`&`）
- 任何一个 slice 的 set 都会触发所有订阅相关字段的组件更新

## 3. 多个独立 Store 协作

**与 Slice 模式的区别**：
- **Slice 模式**：多个模块合并成一个 store，组件使用同一个 Hook
- **多 Store 模式**：创建多个完全独立的 store（多个 `create()` 调用），每个有自己的 Hook

**跨 Store 读取**：使用 `getState()` 直接读取另一个 store 的状态（不触发订阅）：

```ts
// store B 中读取 store A 的状态
const total = useStoreA.getState().items.reduce(...)
```

**什么时候用多 Store**：
- 不同领域耦合度很低（如购物车 vs 用户设置）
- 某个 store 需要在 React 组件外使用
- 希望避免不必要的跨模块渲染
