// 单元 5 演示：mobile-first 断点叠加（默认 1 列 → md 2 列 → lg 3 列）
export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 text-center text-slate-700">1</div>
        <div className="rounded-lg bg-white p-6 text-center text-slate-700">2</div>
        <div className="rounded-lg bg-white p-6 text-center text-slate-700">3</div>
      </div>
    </div>
  )
}
