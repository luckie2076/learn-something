import { useState } from "react"
import { Routes, Route, NavLink, useRouteError, isRouteErrorResponse } from "react-router"

// ===== 错误展示组件（useRouteError） =====

/**
 * RouteErrorBoundary —— 路由级错误边界
 *
 * 当该路由对应的页面组件抛出错误时，
 * 该组件会被渲染（替代原页面），
 * 通过 useRouteError() 获取错误信息。
 */
function RouteErrorBoundary() {
  const error = useRouteError()

  // isRouteErrorResponse 判断是否为路由错误（如 404、请求失败等）
  if (isRouteErrorResponse(error)) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <div className="text-4xl font-bold text-red-400">
          {error.status}
        </div>
        <div className="mt-2 text-sm text-red-600">
          {error.status === 404
            ? "页面未找到"
            : error.statusText || "请求错误"}
        </div>
        <div className="mt-1 text-xs text-red-400">
          {error.data?.message || ""}
        </div>
        <NavLink
          to="/"
          className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          返回首页
        </NavLink>
      </div>
    )
  }

  // 非路由错误（组件内部 JavaScript 异常等）
  const message =
    error instanceof Error ? error.message : "发生了未知错误"

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6">
      <h3 className="text-lg font-bold text-red-600">组件错误</h3>
      <p className="mt-2 text-sm text-red-500">{message}</p>
      <NavLink
        to="/"
        className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
      >
        返回首页
      </NavLink>
    </div>
  )
}

// ===== 页面组件 =====

function HomePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-800">首页</h2>
      <p className="text-zinc-600">一切正常，没有错误！</p>
      <p className="text-sm text-zinc-400">
        试试导航栏中的不同链接，观察错误处理效果。
      </p>
    </div>
  )
}

/**
 * BuggyPage —— 故意抛错的页面（演示 errorElement）
 *
 * 点击按钮后组件抛出异常，触发 errorElement 渲染。
 */
function BuggyPage() {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
    throw new Error("演示错误：组件内部发生了异常！")
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-800">危险页面</h2>
      <p className="text-zinc-600">
        这个页面包含一个会引发错误的按钮：
      </p>
      <button
        onClick={() => setShouldThrow(true)}
        className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
      >
        点击触发异常
      </button>
      <p className="text-xs text-zinc-400">
        点击后将看到 errorElement 渲染的错误页面，而非白屏崩溃
      </p>
    </div>
  )
}

/**
 * NotFoundPage —— 404 通配路由页面
 *
 * path="*" 匹配所有未被其他 Route 匹配的路径。
 */
function NotFoundPage() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
      <div className="text-6xl font-bold text-amber-300">404</div>
      <h2 className="mt-4 text-lg font-semibold text-zinc-700">
        页面未找到
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        你访问的页面不存在。请检查 URL。
      </p>
      <NavLink
        to="/"
        className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
      >
        返回首页
      </NavLink>
    </div>
  )
}

// ===== 导航 =====

const navClass = ({ isActive }: { isActive: boolean }): string =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-blue-600 text-white"
      : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
  }`

// ===== App 入口 =====

export default function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 bg-white p-8">
      <h1 className="text-3xl font-bold text-zinc-900">
        React Router 教学 · 单元 08
      </h1>
      <p className="text-zinc-500">
        错误处理 —— 404、errorElement、useRouteError
      </p>

      <nav className="flex gap-1 rounded-lg bg-zinc-100 p-1">
        <NavLink to="/" end className={navClass}>
          首页
        </NavLink>
        <NavLink to="/buggy" className={navClass}>
          危险页面 ⚠️
        </NavLink>
        <NavLink to="/nothing-here" className={navClass}>
          不存在页面
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* errorElement：当该路由或其子路由渲染时发生错误，显示这个组件 */}
        <Route
          path="/buggy"
          element={<BuggyPage />}
          errorElement={<RouteErrorBoundary />}
        />
        {/* path="*" 匹配所有路径（必须放在最后） */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <hr className="border-zinc-200" />
      <section className="space-y-2 text-sm text-zinc-500">
        <h3 className="font-semibold text-zinc-700">错误处理原理</h3>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            <code className="rounded bg-zinc-100 px-1">path="*"</code>{" "}
            —— 通配路由，匹配所有未被其他 Route 匹配的路径。必须放在&lt;Routes&gt;的最末尾
          </li>
          <li>
            <code className="rounded bg-zinc-100 px-1">errorElement</code>{" "}
            —— Route 的属性，指定该路由出错时渲染的备用 UI
          </li>
          <li>
            <code className="rounded bg-zinc-100 px-1">useRouteError()</code>{" "}
            —— 在 errorElement 组件中获取错误详情
          </li>
          <li>
            <code className="rounded bg-zinc-100 px-1">isRouteErrorResponse()</code>{" "}
            —— 判断是否是路由层的错误（如 HTTP 404、500 等）
          </li>
          <li>
            错误边界向上冒泡：子路由的 errorElement 未设置时，会向上查找父路由的
          </li>
        </ul>
      </section>
    </main>
  )
}
