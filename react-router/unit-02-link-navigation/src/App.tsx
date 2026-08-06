import { Routes, Route, Link, NavLink } from "react-router"

// ========== 页面组件 ==========

function HomePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-800">首页</h2>
      <p className="text-zinc-600">
        欢迎来到 React Router 导航教学。试试上方的导航栏！
      </p>
    </div>
  )
}

function AboutPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-800">关于我们</h2>
      <p className="text-zinc-600">这是关于页面。注意导航栏中"关于"的高亮状态。</p>
    </div>
  )
}

function ContactPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-800">联系我们</h2>
      <p className="text-zinc-600">这是联系页面。</p>
    </div>
  )
}

// ========== 导航栏组件（使用 NavLink） ==========

const navLinkClass = ({
  isActive,
}: {
  isActive: boolean
}): string =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-blue-600 text-white" // 当前激活：蓝底白字
      : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900" // 非激活：灰色
  }`

function NavBar() {
  return (
    <nav className="flex gap-1 rounded-lg bg-zinc-100 p-1">
      {/* NavLink 是 Link 的增强版，可以感知当前路由是否激活 */}
      <NavLink to="/" className={navLinkClass} end>
        首页
      </NavLink>
      <NavLink to="/about" className={navLinkClass}>
        关于
      </NavLink>
      <NavLink to="/contact" className={navLinkClass}>
        联系
      </NavLink>
    </nav>
  )
}

// ========== App 入口 ==========

export default function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 bg-white p-8">
      <h1 className="text-3xl font-bold text-zinc-900">
        React Router 教学 · 单元 02
      </h1>
      <p className="text-zinc-500">导航组件 —— Link 与 NavLink</p>

      {/* 导航栏 */}
      <NavBar />

      {/* 路由出口 */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>

      {/* 对比区：Link vs NavLink */}
      <hr className="border-zinc-200" />
      <section className="space-y-2 text-sm text-zinc-500">
        <h3 className="font-semibold text-zinc-700">Link vs NavLink 对比</h3>

        {/* Link 用法演示 */}
        <p>
          用 <code className="rounded bg-zinc-100 px-1">Link</code> 导航：
          <Link to="/" className="ml-1 text-blue-600 underline">
            回首页（Link）
          </Link>
        </p>

        <ul className="ml-4 list-disc space-y-1">
          <li>
            <code className="rounded bg-zinc-100 px-1">Link</code>{" "}
            —— 纯导航，不知道自己是否"当前激活"。等价于增强版的{" "}
            <code className="rounded bg-zinc-100 px-1">&lt;a&gt;</code>
          </li>
          <li>
            <code className="rounded bg-zinc-100 px-1">NavLink</code>{" "}
            —— 自动感知激活状态，<code className="rounded bg-zinc-100 px-1">className</code>{" "}
            接收 <code className="rounded bg-zinc-100 px-1">{`{ isActive }`}</code> 对象
          </li>
          <li>
            <code className="rounded bg-zinc-100 px-1">end</code> prop
            —— 精确匹配。不加 end 时 <code className="rounded bg-zinc-100 px-1">/</code>{" "}
            会匹配所有以 "/" 开头的路径
          </li>
        </ul>
      </section>
    </main>
  )
}
