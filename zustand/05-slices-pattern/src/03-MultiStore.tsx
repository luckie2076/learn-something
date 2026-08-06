// 多 Store 协作：创建多个独立的 store，它们可以相互读取和调用
// 与 Slice 模式不同：每个 store 完全独立，可单独使用，也可组合
import { create } from "zustand"

// ============ Store 1：购物车（独立 store） ============
interface CartItem {
  id: number
  name: string
  price: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  clear: () => void
}

const useCartStore = create<CartStore>()((set) => ({
  items: [],
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
}))

// ============ Store 2：收银台（独立 store） ============
// 可以读取 useCartStore 的数据来计算总价
interface RegisterStore {
  isCheckingOut: boolean
  checkout: () => void
  cancelCheckout: () => void
  total: () => number // 从购物车 store 计算总价
}

const useRegisterStore = create<RegisterStore>()((set) => ({
  isCheckingOut: false,
  checkout: () => set({ isCheckingOut: true }),
  cancelCheckout: () => set({ isCheckingOut: false }),
  total: () => {
    // 跨 store 读取：直接调用 useCartStore.getState()
    const items = useCartStore.getState().items
    return items.reduce((sum, i) => sum + i.price, 0)
  },
}))

// ============ 组件 ============

const PRODUCTS: CartItem[] = [
  { id: 1, name: "React 实战", price: 59 },
  { id: 2, name: "TypeScript 精讲", price: 49 },
  { id: 3, name: "Zustand 指南", price: 39 },
]

function CartPanel() {
  const items = useCartStore((s) => s.items)
  const addItem = useCartStore((s) => s.addItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const clear = useCartStore((s) => s.clear)

  return (
    <div className="rounded bg-zinc-50 p-3">
      <p className="text-sm font-medium text-zinc-700">🛒 购物车 ({items.length})</p>
      <div className="mt-2 flex gap-1">
        {PRODUCTS.map((p) => (
          <button
            key={p.id}
            onClick={() => addItem(p)}
            className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100"
          >
            +{p.name[0]}
          </button>
        ))}
      </div>
      {items.length > 0 && (
        <div className="mt-2 space-y-1">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-xs">
              <span>{item.name}</span>
              <span className="text-zinc-500">
                ¥{item.price}
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-2 text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            </div>
          ))}
          <button
            onClick={clear}
            className="mt-1 text-xs text-zinc-400 hover:text-zinc-600"
          >
            清空购物车
          </button>
        </div>
      )}
    </div>
  )
}

function RegisterPanel() {
  const items = useCartStore((s) => s.items)
  const isCheckingOut = useRegisterStore((s) => s.isCheckingOut)
  const checkout = useRegisterStore((s) => s.checkout)
  const cancelCheckout = useRegisterStore((s) => s.cancelCheckout)
  const total = useRegisterStore((s) => s.total)
  const clear = useCartStore((s) => s.clear)

  const handleCheckout = () => {
    checkout()
    setTimeout(() => {
      cancelCheckout()
      clear()
      alert("结算完成！")
    }, 2000)
  }

  return (
    <div className="rounded bg-zinc-50 p-3">
      <p className="text-sm font-medium text-zinc-700">💳 收银台</p>
      {items.length === 0 ? (
        <p className="mt-1 text-xs text-zinc-400">购物车为空，请先添加商品</p>
      ) : isCheckingOut ? (
        <p className="mt-1 text-xs text-green-600 animate-pulse">正在结算...</p>
      ) : (
        <div className="mt-1 space-y-2">
          <p className="text-sm font-mono font-bold">
            总计：¥{total()}
          </p>
          <button
            onClick={handleCheckout}
            className="rounded bg-green-500 px-3 py-1 text-xs text-white hover:bg-green-600"
          >
            去结算
          </button>
        </div>
      )}
    </div>
  )
}

export default function MultiStore() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-400">
        两个独立 Store（购物车、收银台）通过 <code className="rounded bg-zinc-100 px-1">getState()</code> 相互读取
      </p>
      <CartPanel />
      <RegisterPanel />
    </div>
  )
}
