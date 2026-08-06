// Selector（选择器）让你从 store 中精确选取需要的数据
// 这既减少了不必要的重渲染，也让你可以组合出派生数据
import { create } from "zustand"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (name: string, price: number) => void
  increaseQuantity: (id: number) => void
}

const useCartStore = create<CartStore>()((set) => ({
  items: [
    { id: 1, name: "React 实战", price: 59, quantity: 1 },
    { id: 2, name: "TypeScript 精讲", price: 49, quantity: 2 },
  ],
  addItem: (name, price) =>
    set((s) => ({
      items: [...s.items, { id: Date.now(), name, price, quantity: 1 }],
    })),
  increaseQuantity: (id) =>
    set((s) => ({
      items: s.items.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    })),
}))

export default function BasicSelector() {
  // ✅ 使用 selector 精确选取需要的数据
  const totalItems = useCartStore((s) => s.items.length)
  // ✅ selector 可以做计算——直接算出总价，而不需要额外的 useMemo
  const totalPrice = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  )
  const items = useCartStore((s) => s.items)

  return (
    <div className="space-y-3">
      <ul className="divide-y divide-zinc-100 text-sm">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-1">
            <span>{item.name}</span>
            <span className="text-zinc-500">
              ¥{item.price} × {item.quantity}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex gap-6 text-sm font-medium">
        <span>共 {totalItems} 件</span>
        <span className="text-blue-600">合计 ¥{totalPrice}</span>
      </div>
    </div>
  )
}
