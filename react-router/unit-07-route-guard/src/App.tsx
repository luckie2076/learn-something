import { useState } from "react"
import { Routes, Route, NavLink, Navigate, useLocation } from "react-router"
import type { ReactNode } from "react"

// ===== 模拟认证状态（实际项目中应使用 Context 或状态管理库） =====

/**
 * 一个简单的全局状态模拟：当前用户是否登录。
 * 实际项目应该用 React Context（如 AuthContext）来跨组件共享认证状态。
 */
let globalIsLoggedIn = false
let globalUsername = ""

// ===== 路由守卫组件 =====

/**
 * ProtectedRoute —— 路由守卫模式
 *
 * 核心逻辑：
 * - 如果已登录 → 渲染 children（受保护的内容）
 * - 如果未登录 → 重定向到 /login，并通过 state 记住"从哪来的"
 */
function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation()

  if (!globalIsLoggedIn) {
    // 重定向到登录页，state 记住发起请求的页面路径
    // 这样登录成功后可以用 navigate(state.from) 跳回来
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}

// ===== 页面组件 =====

function HomePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-800">首页</h2>
      <p className="text-zinc-600">公开页面，无需登录即可访问。</p>
      <p className="text-sm text-zinc-400">
        当前状态：{globalIsLoggedIn ? `已登录（${globalUsername}）` : "未登录"}
      </p>
    </div>
  )
}

function LoginPage() {
  const location = useLocation()
  const from = (location.state as { from?: string })?.from || "/dashboard"

  const handleLogin = () => {
    globalIsLoggedIn = true
    globalUsername = "用户A"
    // 触发重新渲染 —— 实际项目中用 Context / useState 管理状态
    window.dispatchEvent(new Event("auth-change"))
  }

  const handleLogout = () => {
    globalIsLoggedIn = false
    globalUsername = ""
    window.dispatchEvent(new Event("auth-change"))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-800">登录页</h2>
      <p className="text-sm text-zinc-500">
        重定向来源：<code className="rounded bg-zinc-100 px-1">{from}</code>
      </p>
      {globalIsLoggedIn ? (
        <div className="space-y-3">
          <p className="text-green-600">
            已登录为 {globalUsername}
          </p>
          <button
            onClick={handleLogout}
            className="rounded bg-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-200"
          >
            退出登录
          </button>
          <NavLink
            to={from}
            className="block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 text-center"
          >
            前往 {from} →
          </NavLink>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          模拟登录
        </button>
      )}
    </div>
  )
}

function DashboardPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-800">控制台</h2>
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
        这是受保护页面。只有登录用户才能看到。
      </div>
    </div>
  )
}

function AdminPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-800">管理后台</h2>
      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 text-sm text-purple-700">
        更高权限的受保护页面。
      </div>
    </div>
  )
}

// ===== App 入口 =====

export default function App() {
  // 用 useState 驱动重新渲染（监听 auth-change 自定义事件）
  const [, forceUpdate] = useState(0)

  // 监听认证状态变化
  window.addEventListener("auth-change", () =>
    forceUpdate((n) => n + 1),
    { once: true },
  )

  const navClass = ({ isActive }: { isActive: boolean }): string =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
    }`

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 bg-white p-8">
      <h1 className="text-3xl font-bold text-zinc-900">
        React Router 教学 · 单元 07
      </h1>
      <p className="text-zinc-500">
        路由保护 —— ProtectedRoute 守卫模式
      </p>

      <nav className="flex gap-1 rounded-lg bg-zinc-100 p-1">
        <NavLink to="/" end className={navClass}>
          首页
        </NavLink>
        <NavLink to="/dashboard" className={navClass}>
          控制台 🔒
        </NavLink>
        <NavLink to="/admin" className={navClass}>
          管理后台 🔒
        </NavLink>
        <NavLink to="/login" className={navClass}>
          登录
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* 受保护路由：用 ProtectedRoute 包裹 */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <hr className="border-zinc-200" />
      <section className="space-y-2 text-sm text-zinc-500">
        <h3 className="font-semibold text-zinc-700">路由守卫原理</h3>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            未登录时访问 /dashboard → ProtectedRoute 检测到未登录 →{" "}
            <code className="rounded bg-zinc-100 px-1">&lt;Navigate to="/login" /&gt;</code>
          </li>
          <li>
            登录成功后 → 可以正常访问 /dashboard 和 /admin 等受保护页面
          </li>
          <li>
            <code className="rounded bg-zinc-100 px-1">state.from</code>{" "}
            记住原始路径，登录后可跳回（实际项目常用此模式）
          </li>
        </ul>
      </section>
    </main>
  )
}
