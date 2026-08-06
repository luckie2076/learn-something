// Store 中管理对象状态
// Zustand 中任何值都可以是状态：对象、数组、Map、Set 等
import { create } from "zustand"

// 定义一个用户资料对象
interface UserProfile {
  name: string
  age: number
  role: "开发者" | "设计师" | "产品经理"
}

interface UserStore {
  user: UserProfile
  // 更新整个对象
  setUser: (user: UserProfile) => void
  // 更新单个字段（函数式更新，基于当前状态）
  updateAge: (age: number) => void
  // 切换角色
  toggleRole: () => void
}

const useUserStore = create<UserStore>()((set) => ({
  user: { name: "张三", age: 28, role: "开发者" },
  // 直接替换整个对象
  setUser: (user) => set({ user }),
  // 函数式更新：访问当前 state，返回新对象（不可变更新）
  updateAge: (age) => set((state) => ({ user: { ...state.user, age } })),
  toggleRole: () =>
    set((state) => ({
      user: {
        ...state.user,
        role: state.user.role === "开发者" ? "设计师" : "开发者",
      },
    })),
}))

export default function ObjectState() {
  const user = useUserStore((s) => s.user)
  const updateAge = useUserStore((s) => s.updateAge)
  const toggleRole = useUserStore((s) => s.toggleRole)

  return (
    <div className="space-y-3">
      <div className="rounded bg-zinc-50 p-3 space-y-1 text-sm">
        <p><span className="text-zinc-500">姓名：</span>{user.name}</p>
        <p><span className="text-zinc-500">年龄：</span>{user.age}</p>
        <p><span className="text-zinc-500">角色：</span>{user.role}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => updateAge(user.age + 1)}
          className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 transition-colors"
        >
          年龄 +1
        </button>
        <button
          onClick={toggleRole}
          className="rounded bg-purple-500 px-3 py-1 text-sm text-white hover:bg-purple-600 transition-colors"
        >
          切换角色
        </button>
      </div>
    </div>
  )
}
