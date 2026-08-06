// 问题：当 selector 返回一个对象时，每次渲染都会创建新对象引用
// Zustand 默认用 Object.is 做严格相等比较——新对象 ≠ 旧对象 → 触发重渲染
// useShallow 做浅比较（比较对象各字段值），值没变就不触发渲染
import React from "react"
import { create } from "zustand"
import { useShallow } from "zustand/shallow"

interface UserStore {
  name: string
  age: number
  role: string
  updateAge: (age: number) => void
  updateRole: (role: string) => void
}

const useUserStore = create<UserStore>()((set) => ({
  name: "张三",
  age: 28,
  role: "开发者",
  updateAge: (age) => set({ age }),
  updateRole: (role) => set({ role }),
}))

// 辅助组件：用 useShallow 读取 name 和 age
function UserInfo() {
  // ✅ useShallow：即使每次返回新对象引用，只要 name 和 age 没变就不重渲染
  const { name, age } = useUserStore(
    useShallow((s) => ({ name: s.name, age: s.age })),
  )
  // 用 useRef 追踪渲染次数（仅用于教学演示）
  const renderCount = React.useRef(0)
  renderCount.current++

  return (
    <div className="rounded bg-zinc-50 p-2 text-sm">
      <p>姓名：{name} | 年龄：{age}</p>
      <p className="mt-1 text-xs text-zinc-400">
        此组件渲染次数：{renderCount.current}
        <span className="ml-2 text-green-600">
          （只订阅了 name 和 age，更新 role 不会触发我）
        </span>
      </p>
    </div>
  )
}

// 辅助组件：用 useShallow 读取 name 和 role
function UserRole() {
  const { name, role } = useUserStore(
    useShallow((s) => ({ name: s.name, role: s.role })),
  )
  const renderCount = React.useRef(0)
  renderCount.current++

  return (
    <div className="rounded bg-zinc-50 p-2 text-sm">
      <p>姓名：{name} | 角色：{role}</p>
      <p className="mt-1 text-xs text-zinc-400">
        此组件渲染次数：{renderCount.current}
        <span className="ml-2 text-purple-600">
          （只订阅了 name 和 role，更新 age 不会触发我）
        </span>
      </p>
    </div>
  )
}

export default function UseShallow() {
  const updateAge = useUserStore((s) => s.updateAge)
  const updateRole = useUserStore((s) => s.updateRole)

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={() => updateAge(30)}
          className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
        >
          修改年龄 → 30
        </button>
        <button
          onClick={() => updateRole("设计师")}
          className="rounded bg-purple-500 px-3 py-1 text-sm text-white hover:bg-purple-600"
        >
          修改角色 → 设计师
        </button>
      </div>
      <UserInfo />
      <UserRole />
    </div>
  )
}
