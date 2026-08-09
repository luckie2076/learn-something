import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./components/Card.jsx"

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-semibold text-zinc-700">{title}</h2>
      {children}
    </section>
  )
}

// 模拟按钮（避免跨 unit 引入）
function Button({ children }) {
  return (
    <button className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
      {children}
    </button>
  )
}

function GhostButton({ children }) {
  return (
    <button className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100">
      {children}
    </button>
  )
}

export default function App() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        Unit 04 · Card 组件
      </h1>
      <p className="mb-8 text-zinc-500">
        复合组件模式：Card + CardHeader + CardContent + CardFooter
      </p>

      {/* ---- 完整卡片 ---- */}
      <Section title="完整卡片（header + content + footer）">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>创建项目</CardTitle>
            <CardDescription>
              填写以下信息来创建你的新项目。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <label className="mb-1 block text-sm font-medium">项目名称</label>
              <input
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                placeholder="输入项目名称"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">描述</label>
              <textarea
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                rows={3}
                placeholder="项目描述（可选）"
              />
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <GhostButton>取消</GhostButton>
            <Button>创建</Button>
          </CardFooter>
        </Card>
      </Section>

      {/* ---- 简洁卡片 ---- */}
      <Section title="简洁卡片（仅 header + content）">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>通知</CardTitle>
            <CardDescription>你收到了 3 条新消息。</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li className="rounded-md bg-zinc-50 p-2">🎉 你的项目已创建成功</li>
              <li className="rounded-md bg-zinc-50 p-2">📩 新的评论提醒</li>
              <li className="rounded-md bg-zinc-50 p-2">💡 系统维护通知</li>
            </ul>
          </CardContent>
        </Card>
      </Section>

      {/* ---- 卡片网格 ---- */}
      <Section title="卡片网格布局">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "React", desc: "用于构建用户界面的 JavaScript 库" },
            { title: "Vite", desc: "下一代前端构建工具" },
            { title: "TailwindCSS", desc: "原子化 CSS 框架" },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </CardHeader>
              <CardFooter>
                <GhostButton>了解更多</GhostButton>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  )
}
