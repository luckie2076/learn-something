import { Routes, Route, NavLink, useParams } from "react-router"

// ===== 模拟数据 =====
const users = [
  { id: "1", name: "张三", role: "前端工程师", bio: "专注 React 生态" },
  { id: "2", name: "李四", role: "后端工程师", bio: "擅长 Go 和 Rust" },
  { id: "3", name: "王五", role: "全栈工程师", bio: "从数据库到 UI 全覆盖" },
]

// ===== 页面组件 =====

/** 用户列表页 —— 展示所有用户，每个用户名可点击跳转到详情 */
function UserListPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-800">用户列表</h2>
      <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200">
        {users.map((u) => (
          <li key={u.id} className="p-3 hover:bg-zinc-50">
            <NavLink
              to={`/users/${u.id}`}
              className="font-medium text-blue-600 hover:underline"
            >
              {u.name}
            </NavLink>
            <span className="ml-2 text-sm text-zinc-500">— {u.role}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * 用户详情页 —— URL 中的 :id 通过 useParams() 获取
 *
 * 例如访问 /users/1 → useParams() 返回 { id: "1" }
 */
function UserDetailPage() {
  // useParams 返回当前 URL 中所有动态参数组成的对象
  const { id } = useParams<{ id: string }>()

  // 根据 id 查找对应用户
  const user = users.find((u) => u.id === id)

  if (!user) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
        未找到用户（id: {id}）
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-800">{user.name}</h2>
      <div className="rounded-lg border border-zinc-200 p-4 space-y-2">
        <p>
          <span className="text-sm text-zinc-500">角色：</span>
          <span className="font-medium">{user.role}</span>
        </p>
        <p>
          <span className="text-sm text-zinc-500">简介：</span>
          <span>{user.bio}</span>
        </p>
        <p>
          <span className="text-sm text-zinc-500">路径参数 id：</span>
          <code className="rounded bg-zinc-100 px-1 text-sm">{id}</code>
        </p>
      </div>
      <NavLink to="/" className="text-sm text-blue-600 hover:underline">
        ← 返回列表
      </NavLink>
    </div>
  )
}

// ===== 导航 =====

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
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
        React Router 教学 · 单元 03
      </h1>
      <p className="text-zinc-500">动态路由 —— useParams 与 URL 参数</p>

      <nav className="flex gap-1 rounded-lg bg-zinc-100 p-1">
        <NavLink to="/" className={navLinkClass} end>
          用户列表
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<UserListPage />} />
        {/* :id 是动态段，匹配 /users/1、/users/2、/users/3 等 */}
        <Route path="/users/:id" element={<UserDetailPage />} />
      </Routes>

      {/* 原理说明 */}
      <hr className="border-zinc-200" />
      <section className="space-y-2 text-sm text-zinc-500">
        <h3 className="font-semibold text-zinc-700">动态路由原理</h3>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            <code className="rounded bg-zinc-100 px-1">path="/users/:id"</code>{" "}
            —— <code className="rounded bg-zinc-100 px-1">:id</code> 是一个动态段，
            URL 中该位置的值会被捕获为参数
          </li>
          <li>
            <code className="rounded bg-zinc-100 px-1">useParams()</code>{" "}
            —— 在组件中获取当前路由的动态参数，返回对象如{" "}
            <code className="rounded bg-zinc-100 px-1">{`{ id: "1" }`}</code>
          </li>
          <li>
            支持多参数：
            <code className="rounded bg-zinc-100 px-1">
              /users/:userId/posts/:postId
            </code>
          </li>
        </ul>
      </section>
    </main>
  )
}
