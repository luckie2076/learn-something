// set() 的两种写法：直接传对象 vs 函数式更新
// 理解两者的区别，才能写出正确的状态更新逻辑
import { create } from "zustand"

interface CounterStore {
  count: number
  // 直接传对象
  setToHundred: () => void
  // 函数式更新（推荐）
  incrementBy2: () => void
  // 连续调用时的差异演示
  incrementThreeTimes: () => void
}

const useCounterStore = create<CounterStore>()((set) => ({
  count: 0,
  // 直接传对象：set({ count: 100 }) —— 完全覆盖
  setToHundred: () => set({ count: 100 }),
  // 函数式更新：set((s) => ({ count: s.count + 2 })) —— 基于当前值计算
  incrementBy2: () => set((s) => ({ count: s.count + 2 })),
  // 演示连续调用：三次都 +1，结果应该是 +1（而非 +3）
  incrementThreeTimes: () => {
    // ❌ 如果写成 set({ count: count + 1 }) 三次，只 +1
    // ✅ 函数式更新每次都能拿到最新值
    set((s) => ({ count: s.count + 1 }))
    set((s) => ({ count: s.count + 1 }))
    set((s) => ({ count: s.count + 1 }))
  },
}))

export default function SetVariants() {
  const count = useCounterStore((s) => s.count)
  const setToHundred = useCounterStore((s) => s.setToHundred)
  const incrementBy2 = useCounterStore((s) => s.incrementBy2)
  const incrementThreeTimes = useCounterStore((s) => s.incrementThreeTimes)

  return (
    <div className="space-y-3">
      <p className="text-lg">
        当前值：<span className="font-mono font-bold text-2xl text-blue-600">{count}</span>
      </p>
      <div className="flex gap-2">
        <button
          onClick={setToHundred}
          className="rounded bg-zinc-500 px-3 py-1 text-sm text-white hover:bg-zinc-600"
        >
          设为 100（直接赋值）
        </button>
        <button
          onClick={incrementBy2}
          className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
        >
          +2（函数式更新）
        </button>
        <button
          onClick={incrementThreeTimes}
          className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
        >
          连续 +1 × 3
        </button>
      </div>
      <p className="text-xs text-zinc-400">
        提示：函数式更新适合依赖当前状态的场景，如计数器、累加器等
      </p>
    </div>
  )
}
