import Badge from "./components/Badge.jsx"

const variants = ["default", "secondary", "destructive", "outline"]

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-semibold text-zinc-700">{title}</h2>
      {children}
    </section>
  )
}

export default function App() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        Unit 03 · Badge 组件
      </h1>
      <p className="mb-8 text-zinc-500">
        学习颜色变体方案和 inline-block 布局模型
      </p>

      {/* ---- 变体展示 ---- */}
      <Section title="颜色变体">
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <Badge key={v} variant={v}>
              {v}
            </Badge>
          ))}
        </div>
      </Section>

      {/* ---- 与文本混排 ---- */}
      <Section title="inline-block：与文本同行混排">
        <p className="text-sm leading-7 text-zinc-600">
          这是一段文字，这里有一个
          <Badge variant="secondary">标签</Badge>
          它和文字在同一行内。你可以看到它不会导致换行，
          这就是 <code className="rounded bg-zinc-100 px-1 text-xs">inline-block</code> 的特性。
          相比 <code className="rounded bg-zinc-100 px-1 text-xs">block</code>（独占一行），
          相比 <code className="rounded bg-zinc-100 px-1 text-xs">inline</code>（不能设宽高/padding），
          <Badge variant="outline">inline-block</Badge>
          兼具两者的优点。
        </p>
      </Section>

      {/* ---- 状态标签场景 ---- */}
      <Section title="典型场景：状态标签">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="default">已完成</Badge>
          <Badge variant="secondary">进行中</Badge>
          <Badge variant="destructive">已失败</Badge>
          <Badge variant="outline">草稿</Badge>
        </div>
      </Section>

      {/* ---- 通知数角标 ---- */}
      <Section title="典型场景：通知数角标">
        <div className="flex items-center gap-4">
          <div className="relative inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-zinc-600">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
              3
            </span>
          </div>
          <span className="text-sm text-zinc-400">（绝对定位角标，纯 CSS 实现）</span>
        </div>
      </Section>
    </main>
  )
}
