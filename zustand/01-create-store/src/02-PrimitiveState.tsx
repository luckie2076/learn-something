// Store 中的状态不限于对象——原始值（string、number、boolean）也完全可以
import { create } from "zustand"

// 用 Store 管理表单输入值
// 注意：每个字段是独立的原始值，Zustand 的 set 会做浅合并
interface FormStore {
  name: string
  email: string
  setName: (name: string) => void
  setEmail: (email: string) => void
  reset: () => void
}

const useFormStore = create<FormStore>()((set) => ({
  name: "",
  email: "",
  // 通过 set 直接设置新值
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  // 重置为初始值
  reset: () => set({ name: "", email: "" }),
}))

export default function PrimitiveState() {
  // 使用 selector 精确读取需要的字段
  const name = useFormStore((s) => s.name)
  const email = useFormStore((s) => s.email)
  const setName = useFormStore((s) => s.setName)
  const setEmail = useFormStore((s) => s.setEmail)
  const reset = useFormStore((s) => s.reset)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="w-16 text-sm text-zinc-600">姓名：</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm focus:border-blue-400 focus:outline-none"
          placeholder="输入姓名"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="w-16 text-sm text-zinc-600">邮箱：</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm focus:border-blue-400 focus:outline-none"
          placeholder="输入邮箱"
        />
      </div>
      <p className="text-sm text-zinc-500">
        当前：{name || "（空）"} &lt;{email || "（空）"}&gt;
      </p>
      <button
        onClick={reset}
        className="rounded bg-zinc-200 px-3 py-1 text-sm hover:bg-zinc-300 transition-colors"
      >
        重置
      </button>
    </div>
  )
}
