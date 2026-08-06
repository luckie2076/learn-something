import { Routes, Route, Link } from "react-router"

// 页面组件 —— 每个 Route 的 element 所指向的目标
function HomePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-800">首页</h2>
      <p className="text-zinc-600">
        这是首页内容。当前 URL 为 <code className="rounded bg-zinc-100 px-1 text-sm">/</code>
      </p>
    </div>
  )
}

function AboutPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-800">关于</h2>
      <p className="text-zinc-600">
        这是关于页面。当前 URL 为{" "}
        <code className="rounded bg-zinc-100 px-1 text-sm">/about</code>
      </p>
    </div>
  )
}

function ContactPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-800">联系</h2>
      <p className="text-zinc-600">
        这是联系页面。当前 URL 为{" "}
        <code className="rounded bg-zinc-100 px-1 text-sm">/contact</code>
      </p>
    </div>
  )
}

export default function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 bg-white p-8">
      <h1 className="text-3xl font-bold text-zinc-900">
        React Router 教学 · 单元 01
      </h1>
      <p className="text-zinc-500">
        路由基础 —— BrowserRouter + Routes + Route
      </p>

      {/* 简单的导航（后续单元会用 Link/NavLink 替代） */}
      <nav className="flex gap-4 rounded-lg bg-zinc-100 p-3">
        <Link to="/" className="text-blue-600 underline">
          首页
        </Link>
        <Link to="/about" className="text-blue-600 underline">
          关于
        </Link>
        <Link to="/contact" className="text-blue-600 underline">
          联系
        </Link>
      </nav>

      {/* Routes 是路由匹配的容器，Route 定义 path 与组件的映射 */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </main>
  )
}
