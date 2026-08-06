// 异步状态管理：loading / error / data 三态模式
// 这是异步操作的标准模式——让 UI 根据状态展示不同内容
import { create } from "zustand"

interface User {
  id: number
  name: string
  email: string
}

interface UserStore {
  users: User[]
  loading: boolean
  error: string | null
  fetchUsers: () => Promise<void>
  clearError: () => void
}

// 模拟用户数据
const MOCK_USERS: User[] = [
  { id: 1, name: "张三", email: "zhangsan@example.com" },
  { id: 2, name: "李四", email: "lisi@example.com" },
  { id: 3, name: "王五", email: "wangwu@example.com" },
]

const useUserStore = create<UserStore>()((set) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    // 开始请求：设置 loading，清空 error
    set({ loading: true, error: null })
    try {
      // 模拟 1 秒的网络延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // 30% 概率模拟失败
      if (Math.random() < 0.3) {
        throw new Error("网络请求失败，请重试")
      }
      set({ users: MOCK_USERS, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "未知错误",
        loading: false,
      })
    }
  },
  clearError: () => set({ error: null }),
}))

export default function LoadingError() {
  const users = useUserStore((s) => s.users)
  const loading = useUserStore((s) => s.loading)
  const error = useUserStore((s) => s.error)
  const fetchUsers = useUserStore((s) => s.fetchUsers)
  const clearError = useUserStore((s) => s.clearError)

  return (
    <div className="space-y-3">
      <button
        onClick={fetchUsers}
        disabled={loading}
        className={`rounded px-4 py-2 text-sm text-white transition-colors ${
          loading
            ? "cursor-not-allowed bg-zinc-300"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "加载中..." : "获取用户列表"}
      </button>

      {/* 三态 UI 模式 */}
      {loading && (
        <div className="flex items-center gap-2 rounded bg-blue-50 p-3 text-sm text-blue-600">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
          正在加载用户数据...
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded bg-red-50 p-3 text-sm text-red-600">
          <span>❌ {error}</span>
          <button
            onClick={clearError}
            className="text-xs text-red-400 hover:text-red-600"
          >
            关闭
          </button>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="flex items-center gap-3 rounded bg-zinc-50 px-3 py-2 text-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                {user.name[0]}
              </span>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-zinc-400">{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && users.length === 0 && (
        <p className="text-sm text-zinc-400">点击按钮加载用户数据</p>
      )}
    </div>
  )
}
