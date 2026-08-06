import { Routes, Route, NavLink, Outlet } from "react-router"

// ===== 布局组件（嵌套路由的"壳"） =====

/**
 * DashboardLayout —— 后台管理布局
 *
 * 包含侧边栏 + 内容区。
 * <Outlet /> 是子路由的"插槽"：子路由匹配的组件会渲染在这里。
 */
function DashboardLayout() {
  return (
    <div className="flex rounded-lg border border-zinc-200">
      {/* 侧边栏 */}
      <aside className="w-48 shrink-0 border-r border-zinc-200 bg-zinc-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-zinc-500">管理后台</h3>
        <nav className="flex flex-col gap-1">
          <NavLink
            to="/dashboard"
            end
            className={navClass}
          >
            概览
          </NavLink>
          <NavLink to="/dashboard/users" className={navClass}>
            用户管理
          </NavLink>
          <NavLink to="/dashboard/settings" className={navClass}>
            系统设置
          </NavLink>
        </nav>
      </aside>

      {/* 内容区 — Outlet 是子路由的渲染出口 */}
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  )
}

const navClass = ({ isActive }: { isActive: boolean }): string =>
  `rounded px-2 py-1 text-sm transition-colors ${
    isActive
      ? "bg-blue-100 text-blue-700 font-medium"
      : "text-zinc-600 hover:bg-zinc-100"
  }`

// ===== 子页面组件 =====

function DashboardHome() {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold text-zinc-800">仪表盘概览</h3>
      <p className="text-zinc-600">
        欢迎来到管理后台。这是 Dashboard 的默认子页面（index route）。
      </p>
      <div className="grid grid-cols-3 gap-3">
        {["总用户", "活跃用户", "今日新增"].map((label) => (
          <div
            key={label}
            className="rounded-lg bg-blue-50 p-3 text-center"
          >
            <div className="text-2xl font-bold text-blue-600">
              {Math.floor(Math.random() * 1000)}
            </div>
            <div className="text-xs text-zinc-500">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function UserManagement() {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold text-zinc-800">用户管理</h3>
      <p className="text-zinc-600">管理平台用户的子页面。</p>
    </div>
  )
}

function Settings() {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold text-zinc-800">系统设置</h3>
      <p className="text-zinc-600">系统配置与偏好设置的子页面。</p>
    </div>
  )
}

// ===== App 入口 =====

export default function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 bg-white p-8">
      <h1 className="text-3xl font-bold text-zinc-900">
        React Router 教学 · 单元 04
      </h1>
      <p className="text-zinc-500">嵌套路由 —— Outlet 与布局复用</p>

      {/* 
        嵌套路由结构：
        /dashboard            → DashboardLayout > DashboardHome (index route)
        /dashboard/users      → DashboardLayout > UserManagement
        /dashboard/settings   → DashboardLayout > Settings

        DashboardLayout 中的 <Outlet /> 负责渲染子路由组件
      */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* index route：访问 /dashboard 时的默认子路由 */}
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>

      <hr className="border-zinc-200" />
      <section className="space-y-2 text-sm text-zinc-500">
        <h3 className="font-semibold text-zinc-700">嵌套路由原理</h3>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            <code className="rounded bg-zinc-100 px-1">Outlet</code>{" "}
            —— 子路由的"占位符"。父组件用它来声明"子内容放这里"
          </li>
          <li>
            <code className="rounded bg-zinc-100 px-1">index</code> route
            —— 没有 path 的子路由，作为父路由的默认页面
          </li>
          <li>
            子路由 <code className="rounded bg-zinc-100 px-1">path</code> 相对于
            父路由 —— <code className="rounded bg-zinc-100 px-1">"users"</code>{" "}
            实际匹配 <code className="rounded bg-zinc-100 px-1">/dashboard/users</code>
          </li>
          <li>
            布局与内容分离 —— 布局组件只写一次，子路由自动复用
          </li>
        </ul>
      </section>
    </main>
  )
}

// ===== 首页 =====
function HomePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-800">首页</h2>
      <NavLink
        to="/dashboard"
        className="inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        进入管理后台 →
      </NavLink>
    </div>
  )
}
