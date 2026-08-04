// 单元 7 演示：@theme 令牌 → 自动生成 bg-brand / text-brand / font-display
export default function App() {
  return (
    <div className="min-h-screen space-y-4 bg-slate-50 p-8">
      <h1 className="font-display text-3xl font-bold text-brand">自定义品牌色与字体</h1>
      <button className="rounded-lg bg-brand px-4 py-2 text-white">品牌按钮</button>
    </div>
  )
}
