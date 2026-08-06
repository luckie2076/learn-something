import { useState } from "react"
import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router"
import type { FormEvent } from "react"

// ===== 页面组件 =====

function HomePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-800">首页</h2>
      <p className="text-zinc-600">公开页面，无需登录。</p>
    </div>
  )
}

/**
 * 登录页 —— 演示 useNavigate 编程式跳转
 *
 * 用户提交表单后，调用 navigate() 跳转到 dashboard，
 * 并通过 state 传递一条欢迎消息。
 */
function LoginPage() {
  const [username, setUsername] = useState("")
  const navigate = useNavigate()

  const handleLogin = (e: FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    // navigate(to, options)
    // - 第二个参数 { state } 可以在不改变 URL 的情况下向目标页面传递数据
    // - { replace: true } 会替换当前历史记录（不推荐用于登录，但演示其作用）
    navigate("/dashboard", {
      state: { from: "login", username: username.trim() },
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-800">登录</h2>
      <form onSubmit={handleLogin} className="space-y-3 max-w-sm">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="输入用户名"
          className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          登录（useNavigate 跳转）
        </button>
      </form>
    </div>
  )
}

/**
 * Dashboard 页 —— 演示 useLocation 获取 navigate 传递的 state
 *
 * 同时演示 Navigate 组件的重定向逻辑
 */
function DashboardPage() {
  const location = useLocation()
  const navigate = useNavigate()

  // location.state 是 navigate() 第二个参数传递的数据
  const state = location.state as { from: string; username: string } | null

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-800">控制台</h2>

      {state && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          欢迎，{state.username}！你来自 {state.from} 页。
          <br />
          <span className="text-xs text-green-500">
            这条消息通过 navigate 的 state 传递，不存在于 URL 中
          </span>
        </div>
      )}

      <p className="text-zinc-600">这是需要登录后才能访问的页面。</p>
      <button
        onClick={() => navigate("/")}
        className="rounded bg-zinc-200 px-3 py-1 text-sm hover:bg-zinc-300"
      >
        useNavigate 返回首页
      </button>
    </div>
  )
}

/**
 * RedirectToHome —— 演示 <Navigate> 组件重定向
 *
 * 访问 /old-dashboard 时自动重定向到 /dashboard
 */
function RedirectToHome() {
  return <Navigate to="/dashboard" replace />
}

// ===== App 入口 =====

export default function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 bg-white p-8">
      <h1 className="text-3xl font-bold text-zinc-900">
        React Router 教学 · 单元 06
      </h1>
      <p className="text-zinc-500">
        编程式导航 —— useNavigate、Navigate、useLocation
      </p>

      <nav className="flex gap-1 rounded-lg bg-zinc-100 p-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
            }`
          }
        >
          首页
        </NavLink>
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
            }`
          }
        >
          登录
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
            }`
          }
        >
          控制台
        </NavLink>
        <NavLink
          to="/old-dashboard"
          className={({ isActive }) =>
            `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
            }`
          }
        >
          旧控制台
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Navigate 组件：访问 /old-dashboard 自动跳转到 /dashboard */}
        <Route path="/old-dashboard" element={<RedirectToHome />} />
      </Routes>

      <hr className="border-zinc-200" />
      <section className="space-y-2 text-sm text-zinc-500">
        <h3 className="font-semibold text-zinc-700">
          useNavigate vs Navigate 对比
        </h3>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            <code className="rounded bg-zinc-100 px-1">useNavigate()</code>{" "}
            —— Hook，在事件处理/回调中调用。如登录成功后跳转
          </li>
          <li>
            <code className="rounded bg-zinc-100 px-1">&lt;Navigate to="/" /&gt;</code>{" "}
            —— 组件，在渲染阶段触发重定向。适合"这个路径不应该被直接访问"的场景
          </li>
          <li>
            <code className="rounded bg-zinc-100 px-1">navigate("/path", {"{"} state {"}"})</code>{" "}
            —— state 参数传递数据，不显示在 URL 中，刷新后丢失
          </li>
          <li>
            <code className="rounded bg-zinc-100 px-1">navigate(to, {"{"} replace: true {"}"})</code>{" "}
            —— 替换当前历史记录（用户点后退不会回到前一页）
          </li>
        </ul>
      </section>
    </main>
  )
}
