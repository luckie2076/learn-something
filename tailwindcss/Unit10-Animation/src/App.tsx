export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-50 p-8">
      <button className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
        悬停平滑变色
      </button>
      <span className="animate-pulse text-slate-500">加载中…</span>
      <div className="animate-wiggle text-2xl font-bold text-purple-600">摇一摇</div>
    </div>
  )
}
