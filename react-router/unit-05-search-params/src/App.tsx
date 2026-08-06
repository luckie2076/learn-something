import { Routes, Route, useSearchParams } from "react-router"

// ===== 模拟数据 =====
const ALL_PRODUCTS = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `商品 ${String(i + 1).padStart(2, "0")}`,
  price: Math.floor(Math.random() * 500) + 10,
  category: i % 3 === 0 ? "电子" : i % 3 === 1 ? "服装" : "食品",
}))

// ===== 商品列表页 =====

function ProductListPage() {
  // useSearchParams 类似 useState，但状态存储在 URL 的查询字符串中
  const [searchParams, setSearchParams] = useSearchParams()

  // 从查询参数中读取当前页码和排序方式
  const page = Number(searchParams.get("page") || 1)
  const sort = searchParams.get("sort") || "default"

  // 排序逻辑
  const sorted = [...ALL_PRODUCTS].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price
    if (sort === "price-desc") return b.price - a.price
    return 0
  })

  // 分页逻辑
  const PAGE_SIZE = 5
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const pageData = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // 切换页码
  const goPage = (p: number) => {
    const next = new URLSearchParams(searchParams)
    next.set("page", String(p))
    setSearchParams(next)
  }

  // 切换排序
  const changeSort = (s: string) => {
    const next = new URLSearchParams(searchParams)
    next.set("sort", s)
    next.set("page", "1") // 排序时重置到第一页
    setSearchParams(next)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-800">商品列表</h2>

      {/* 排序按钮 */}
      <div className="flex gap-2">
        {[
          { value: "default", label: "默认排序" },
          { value: "price-asc", label: "价格 ↑" },
          { value: "price-desc", label: "价格 ↓" },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => changeSort(value)}
            className={`rounded px-3 py-1 text-sm transition-colors ${
              sort === value
                ? "bg-blue-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 商品列表 */}
      <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200">
        {pageData.map((p) => (
          <li key={p.id} className="flex items-center justify-between p-3">
            <div>
              <span className="font-medium">{p.name}</span>
              <span className="ml-2 text-xs text-zinc-400">[{p.category}]</span>
            </div>
            <span className="font-mono text-sm text-zinc-600">
              ¥{p.price}
            </span>
          </li>
        ))}
      </ul>

      {/* 分页 */}
      <div className="flex items-center justify-center gap-1">
        <button
          onClick={() => goPage(page - 1)}
          disabled={page <= 1}
          className="rounded px-2 py-1 text-sm text-zinc-500 hover:bg-zinc-100 disabled:opacity-30"
        >
          上一页
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => goPage(i + 1)}
            className={`rounded px-2 py-1 text-sm ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => goPage(page + 1)}
          disabled={page >= totalPages}
          className="rounded px-2 py-1 text-sm text-zinc-500 hover:bg-zinc-100 disabled:opacity-30"
        >
          下一页
        </button>
      </div>

      {/* 展示当前查询参数字符串 */}
      <p className="text-xs text-zinc-400">
        当前查询参数：{" "}
        <code className="rounded bg-zinc-100 px-1">
          ?{searchParams.toString()}
        </code>
      </p>
    </div>
  )
}

// ===== App 入口 =====

export default function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 bg-white p-8">
      <h1 className="text-3xl font-bold text-zinc-900">
        React Router 教学 · 单元 05
      </h1>
      <p className="text-zinc-500">
        查询参数 —— useSearchParams 与分页/排序
      </p>

      <Routes>
        <Route path="/" element={<ProductListPage />} />
      </Routes>

      <hr className="border-zinc-200" />
      <section className="space-y-2 text-sm text-zinc-500">
        <h3 className="font-semibold text-zinc-700">查询参数原理</h3>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            <code className="rounded bg-zinc-100 px-1">useSearchParams()</code>{" "}
            —— 类似 useState，但状态存储在 URL 查询字符串中（?key=value）
          </li>
          <li>
            返回 <code className="rounded bg-zinc-100 px-1">[searchParams, setSearchParams]</code>，
            与 useState 模式一致
          </li>
          <li>
            <code className="rounded bg-zinc-100 px-1">searchParams.get("key")</code>{" "}
            —— 读取单个参数
          </li>
          <li>
            <code className="rounded bg-zinc-100 px-1">searchParams.toString()</code>{" "}
            —— 获取完整查询字符串（不含 ?）
          </li>
          <li>
            核心价值：分页、排序、筛选等 UI 状态存储在 URL 中，刷新、分享、前进后退都不丢失
          </li>
        </ul>
      </section>
    </main>
  )
}
