// Slice 模式：将 store 按"关注点"拆分成独立的模块
// 每个 slice 只关心一个领域（如用户、购物车），最后组合成完整的 store
import { create } from "zustand"

// ============ 定义 Slice 类型 ============
// 一个 slice 就是一个工厂函数：接收 set/get，返回状态和方法
interface BearSlice {
  bears: number
  addBear: () => void
  removeBear: () => void
}

// Slice 工厂函数（接收 set 和 get，返回该领域的状态和方法）
const createBearSlice = (
  set: (fn: (state: any) => any) => void,
): BearSlice => ({
  bears: 5,
  addBear: () => set((s) => ({ bears: s.bears + 1 })),
  removeBear: () => set((s) => ({ bears: Math.max(0, s.bears - 1) })),
})

// ============ 完整的 Store 类型 ============
// 组合所有 slice 类型
type StoreType = BearSlice

// ============ 创建 Store：直接展开 slice 工厂的返回值 ============
const useStore = create<StoreType>()((set) => ({
  ...createBearSlice(set),
}))

export default function SingleSlice() {
  const bears = useStore((s) => s.bears)
  const addBear = useStore((s) => s.addBear)
  const removeBear = useStore((s) => s.removeBear)

  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-600">
        🐻 进行了 {bears} 只熊
      </p>
      <div className="flex gap-2">
        <button
          onClick={addBear}
          className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
        >
          添加一只熊
        </button>
        <button
          onClick={removeBear}
          className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
        >
          移除一只熊
        </button>
      </div>
      <p className="text-xs text-zinc-400">
        Slice 的核心思想：每个领域的状态和方法封装在独立的工厂函数中，通过展开合并到 store
      </p>
    </div>
  )
}
