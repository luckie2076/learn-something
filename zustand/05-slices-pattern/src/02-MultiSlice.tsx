// 多 Slice 组合：将多个 slice 合并成一个完整的 store
// 这是 Zustand 推荐的模块化方案——比 Redux 的 combineReducers 更直观
import { create } from "zustand"
import type { StateCreator } from "zustand"

// ============ Slice 1：用户 ============
interface UserSlice {
  user: { name: string; loggedIn: boolean }
  login: (name: string) => void
  logout: () => void
}

const createUserSlice: StateCreator<UserSlice> = (set) => ({
  user: { name: "", loggedIn: false },
  login: (name) => set({ user: { name, loggedIn: true } }),
  logout: () => set({ user: { name: "", loggedIn: false } }),
})

// ============ Slice 2：计数器 ============
interface CounterSlice {
  count: number
  increment: () => void
  decrement: () => void
}

const createCounterSlice: StateCreator<CounterSlice> = (set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: s.count - 1 })),
})

// ============ Slice 3：通知 ============
interface NotificationSlice {
  messages: string[]
  notify: (msg: string) => void
  clearNotifications: () => void
}

const createNotificationSlice: StateCreator<NotificationSlice> = (set) => ({
  messages: [],
  notify: (msg) =>
    set((s) => ({ messages: [...s.messages, msg] })),
  clearNotifications: () => set({ messages: [] }),
})

// ============ 组合所有 slice ============
type CombinedStore = UserSlice & CounterSlice & NotificationSlice

const useStore = create<CombinedStore>()((...args) => ({
  ...createUserSlice(...args),
  ...createCounterSlice(...args),
  ...createNotificationSlice(...args),
}))

// ============ 辅助组件 ============
function UserPanel() {
  const user = useStore((s) => s.user)
  const login = useStore((s) => s.login)
  const logout = useStore((s) => s.logout)
  const notify = useStore((s) => s.notify)

  const handleLogin = () => {
    login("张三")
    notify("用户已登录")
  }

  return (
    <div className="rounded bg-zinc-50 p-3">
      <p className="text-sm font-medium text-zinc-700">👤 用户面板</p>
      {user.loggedIn ? (
        <div className="mt-1 space-y-1 text-sm">
          <p>当前用户：{user.name}</p>
          <button
            onClick={logout}
            className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-600 hover:bg-red-200"
          >
            退出登录
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="mt-1 rounded bg-green-100 px-2 py-0.5 text-xs text-green-600 hover:bg-green-200"
        >
          模拟登录
        </button>
      )}
    </div>
  )
}

function CounterPanel() {
  const count = useStore((s) => s.count)
  const increment = useStore((s) => s.increment)
  const decrement = useStore((s) => s.decrement)

  return (
    <div className="rounded bg-zinc-50 p-3">
      <p className="text-sm font-medium text-zinc-700">🔢 计数器面板</p>
      <div className="mt-1 flex items-center gap-2">
        <button
          onClick={decrement}
          className="rounded bg-zinc-200 px-2 py-0.5 text-xs hover:bg-zinc-300"
        >
          -1
        </button>
        <span className="text-sm font-mono">{count}</span>
        <button
          onClick={increment}
          className="rounded bg-zinc-200 px-2 py-0.5 text-xs hover:bg-zinc-300"
        >
          +1
        </button>
      </div>
    </div>
  )
}

function NotificationPanel() {
  const messages = useStore((s) => s.messages)
  const clear = useStore((s) => s.clearNotifications)

  return (
    <div className="rounded bg-zinc-50 p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-700">🔔 通知面板</p>
        {messages.length > 0 && (
          <button
            onClick={clear}
            className="text-xs text-zinc-400 hover:text-zinc-600"
          >
            清空
          </button>
        )}
      </div>
      {messages.length === 0 ? (
        <p className="mt-1 text-xs text-zinc-400">暂无通知（试试登录操作）</p>
      ) : (
        <ul className="mt-1 space-y-1">
          {messages.map((m, i) => (
            <li key={i} className="text-xs text-zinc-600">
              {i + 1}. {m}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function MultiSlice() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-400 mb-1">
        三个独立的 Slice（用户、计数器、通知）被组合成一个 Store
      </p>
      <UserPanel />
      <CounterPanel />
      <NotificationPanel />
    </div>
  )
}
