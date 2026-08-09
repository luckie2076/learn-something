import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./components/Dialog.jsx"

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-semibold text-zinc-700">{title}</h2>
      {children}
    </section>
  )
}

function Button({ children, variant = "default", onClick }) {
  const classes = {
    default:
      "inline-flex items-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800",
    outline:
      "inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100",
    destructive:
      "inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500",
  }
  return (
    <button onClick={onClick} className={classes[variant] || classes.default}>
      {children}
    </button>
  )
}

export default function App() {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        Unit 08 · Dialog 组件
      </h1>
      <p className="mb-8 text-zinc-500">
        学习 fixed 定位、遮罩层、body scroll lock、出入动画
      </p>

      {/* 页面内容（足够长以产生滚动） */}
      <p className="mb-8 text-sm text-zinc-400">
        下方有大量内容用于演示 body scroll lock 效果。
        打开 Dialog 时，尝试滚动页面——你会发现背景页面无法滚动。
      </p>

      <div className="mb-8 space-y-2 rounded-lg border border-zinc-200 p-4 text-sm text-zinc-400">
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i}>第 {i + 1} 行：这是用来撑开页面高度的演示文本。</p>
        ))}
      </div>

      {/* ---- 确认型 Dialog ---- */}
      <Section title="确认型 Dialog">
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogTrigger onClick={() => setConfirmOpen(true)}>
            删除项目
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认删除</DialogTitle>
              <DialogDescription>
                此操作不可撤销。这将永久删除该项目及其所有数据。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                取消
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  alert("已删除")
                  setConfirmOpen(false)
                }}
              >
                确认删除
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      {/* ---- 表单型 Dialog ---- */}
      <Section title="表单型 Dialog">
        <Dialog>
          <DialogTrigger>编辑资料</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑个人资料</DialogTitle>
              <DialogDescription>
                修改你的个人信息。修改后点击保存。
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">用户名</label>
                <input
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                  defaultValue="张三"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">邮箱</label>
                <input
                  type="email"
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                  defaultValue="zhangsan@example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">取消</Button>
              <Button onClick={() => alert("已保存")}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      {/* ---- 原理拆解 ---- */}
      <Section title="原理拆解（6 个关键点）">
        <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
          <p><strong>1. fixed inset-0</strong> — 遮罩层和内容层都占满整个视口，不随滚动移动</p>
          <p><strong>2. z-index: 50</strong> — 确保 Dialog 浮在页面最上层</p>
          <p><strong>3. bg-black/50</strong> — 半透明黑色遮罩，视觉上让背景变暗，突出弹窗内容</p>
          <p><strong>4. body overflow:hidden</strong> — 打开 Dialog 时禁止背景页面滚动（核心体验细节）</p>
          <p><strong>5. opacity + scale 过渡</strong> — scale-95→scale-100 + opacity-0→opacity-100 实现「弹出」动画</p>
          <p><strong>6. ESC 键关闭</strong> — 监听 keydown 事件，Escape 时关闭，符合无障碍标准</p>
        </div>
      </Section>

      {/* ---- 动画细节 ---- */}
      <Section title="出入动画详解">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="py-2 text-left font-medium">阶段</th>
                <th className="py-2 text-left font-medium">遮罩层</th>
                <th className="py-2 text-left font-medium">内容层</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-100">
                <td className="py-2">入场前</td>
                <td className="py-2 font-mono text-xs">opacity: 0</td>
                <td className="py-2 font-mono text-xs">opacity: 0; transform: scale(0.95)</td>
              </tr>
              <tr className="border-b border-zinc-100">
                <td className="py-2">入场后</td>
                <td className="py-2 font-mono text-xs">opacity: 1</td>
                <td className="py-2 font-mono text-xs">opacity: 1; transform: scale(1)</td>
              </tr>
              <tr>
                <td className="py-2">过渡</td>
                <td className="py-2 font-mono text-xs" colSpan={2}>
                  transition-all duration-200
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mt-3 text-zinc-400">
            scale(0.95) 让弹窗从 95% 缩放到 100%，产生轻微的「弹出」效果，
            比单纯的 fade 更有层次感。
          </p>
        </div>
      </Section>
    </main>
  )
}
