# 第二章 · 选择器与性能

> 运行方式：`pnpm install && pnpm dev`，打开终端给出的本地地址。

## 1. 基础 Selector 用法

**什么是 selector**：传给 `useStore()` 的一个函数，从整个 store 里选取需要的部分。

```ts
// 不传 selector → 订阅整个 store（任何字段变化都重渲染）
const store = useStore()

// 传 selector → 只订阅选取的字段（精确控制）
const count = useStore((s) => s.count)
```

**为什么重要**：selector 决定了一个组件"关心"哪些状态。精确订阅 = 最小化重渲染 = 性能好。

**selector 里可以做计算**：求和、筛选、拼接——这些"派生数据"直接在读取时算，store 保持精简，不用维护冗余字段。

## 2. Selector 内做派生数据

**派生数据的理念**：能从原始数据算出来的，就不存。selector 让这种"按需计算"非常自然。

```ts
// store 里只存 items，不存 totalPrice
const totalPrice = useStore((s) =>
  s.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
)
```

**好处**：单一数据源 → 零维护成本。如果 store 里同时维护 `items` 和 `totalPrice`，每次改 `items` 都要记得更新 `totalPrice`——容易出错。

## 3. useShallow 避免不必要渲染

**问题场景**：selector 返回一个新对象，每次调用都会创建新引用。Zustand 默认用 `Object.is` 比较，新引用 ≠ 旧引用 → 重渲染。

```ts
// ❌ 每次返回新对象，即使字段值没变也会重渲染
const { name, age } = useStore((s) => ({ name: s.name, age: s.age }))

// ✅ useShallow 做浅比较：逐字段对比值，值没变就不渲染
import { useShallow } from "zustand/shallow"
const { name, age } = useStore(useShallow((s) => ({ name: s.name, age: s.age })))
```

**什么时候需要 useShallow**：selector 返回对象、数组等引用类型时。如果 selector 返回原始值（string、number），不需要。

## 4. 渲染次数可视化对比

通过计数器直观对比三种订阅方式：

| 方式 | 行为 |
|------|------|
| `useStore()` | 订阅整个 store，任何字段变化都重渲染 |
| `useStore((s) => s.count)` | 只订阅 count，text 变化不渲染 |
| `useStore(useShallow(...))` | 返回对象时做浅比较，值没变就不渲染 |

**核心原则**：用什么就订阅什么——不要多拿。
