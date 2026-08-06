// 在 React 组件外读写 State：getState() 和 setState()
// Zustand store 不依赖 React——你可以在任何地方（非组件、WebSocket、定时器）读写状态
import { useState, useEffect } from "react"
import { create } from "zustand"

// 注意：Store 定义在组件外部
interface AuthStore {
  token: string | null
  expiresAt: number | null
  isLoggedIn: () => boolean
  login: (token: string, expiresInSeconds: number) => void
  logout: () => void
}

const useAuthStore = create<AuthStore>()((set, get) => ({
  token: null,
  expiresAt: null,
  // get() 在 store 内部使用，读取最新状态
  isLoggedIn: () => {
    const { token, expiresAt } = get()
    if (!token || !expiresAt) return false
    return Date.now() < expiresAt
  },
  login: (token, expiresInSeconds) =>
    set({
      token,
      expiresAt: Date.now() + expiresInSeconds * 1000,
    }),
  logout: () => set({ token: null, expiresAt: null }),
}))

// ~~~ 关键：组件外的工具函数，直接通过 store 的 API 操作 ~~~
// 模拟定时器的 token 过期检测（完全在组件外运行）
function startTokenExpiryMonitor() {
  // ✅ getState()：组件外读取状态
  const checkExpiry = () => {
    const { token, expiresAt } = useAuthStore.getState()
    if (token && expiresAt && Date.now() > expiresAt) {
      console.log("【组件外】Token 已过期，自动退出登录")
      // ✅ setState()：组件外修改状态
      useAuthStore.setState({ token: null, expiresAt: null })
    }
  }
  return setInterval(checkExpiry, 2000)
}

// 启动定时器（注意：这在模块加载时执行，仅演示用途）
if (typeof window !== "undefined") {
  startTokenExpiryMonitor()
}

export default function OutsideReact() {
  const token = useAuthStore((s) => s.token)
  const expiresAt = useAuthStore((s) => s.expiresAt)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)

  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      if (expiresAt) {
        setTimeLeft(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)))
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [expiresAt])

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-400">
        Store 在组件外定义和操作——<code className="rounded bg-zinc-100 px-1">getState()</code> 读取，
        <code className="rounded bg-zinc-100 px-1">setState()</code> 写入。定时器在组件外检测 token 是否过期。
      </p>

      {token ? (
        <div className="rounded bg-green-50 p-3 space-y-2">
          <p className="text-sm text-green-700">✅ 已登录</p>
          <p className="text-xs text-green-600 font-mono">
            Token: {token.slice(0, 20)}...
          </p>
          <p className="text-xs text-green-600">
            {timeLeft > 0
              ? `剩余 ${timeLeft} 秒`
              : "已过期（定时器即将触发自动登出）"}
          </p>
          <button
            onClick={logout}
            className="rounded bg-red-100 px-3 py-1 text-xs text-red-600 hover:bg-red-200"
          >
            手动退出
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => login("fake-jwt-token-abc123", 10)}
            className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
          >
            模拟登录（10 秒有效）
          </button>
          <p className="mt-1 text-xs text-zinc-400">
            登录后 10 秒自动过期，由模块级定时器（组件外）检测并登出
          </p>
        </div>
      )}
    </div>
  )
}
