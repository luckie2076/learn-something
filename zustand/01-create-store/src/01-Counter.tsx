// 最简单的 Zustand Store 示例：计数器
// create() 创建一个 store，返回一个 Hook
import { create } from "zustand"

// 定义 Store 的类型（TypeScript 类型推导会用到）
interface CounterStore {
  count: number
  increase: () => void
  decrease: () => void
}

// create 接受一个函数，函数返回 store 的初始状态和方法
// 函数签名：create<StoreType>()((set) => ({ ... }))
const useCounterStore = create<CounterStore>()((set) => ({
  count: 0,
  // set 用于更新状态。与 React 的 setState 类似，传入一个对象来合并更新
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
}))

export default function Counter() {
  // 使用 Hook 读取状态。注意：传入 selector 可以避免不必要的重新渲染
  const count = useCounterStore((s) => s.count)
  const increase = useCounterStore((s) => s.increase)
  const decrease = useCounterStore((s) => s.decrease)

  return (
    <div className="space-y-2">
      <p className="text-lg">
        当前计数：<span className="font-mono font-bold text-2xl text-blue-600">{count}</span>
      </p>
      <div className="flex gap-2">
        <button
          onClick={decrease}
          className="rounded bg-red-500 px-4 py-1 text-white hover:bg-red-600 transition-colors"
        >
          -1
        </button>
        <button
          onClick={increase}
          className="rounded bg-green-500 px-4 py-1 text-white hover:bg-green-600 transition-colors"
        >
          +1
        </button>
      </div>
    </div>
  )
}
