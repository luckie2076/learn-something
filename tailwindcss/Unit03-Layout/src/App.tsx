// 单元 3 演示：flex 居中 / grid 三等分 / 间距刻度
export default function App() {
  return (
    <div className="min-h-screen space-y-10 bg-slate-50 p-8">
      {/* flex：双轴居中 + 交叉轴对齐 */}
      <div className="flex h-32 items-center justify-center gap-4 rounded-lg bg-white">
        <div className="rounded bg-blue-600 px-4 py-2 text-white">A</div>
        <div className="rounded bg-blue-600 px-4 py-2 text-white">B</div>
        <div className="rounded bg-blue-600 px-4 py-2 text-white">C</div>
      </div>

      {/* grid：三等宽列 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-white p-6 text-center text-slate-700">1</div>
        <div className="rounded-lg bg-white p-6 text-center text-slate-700">2</div>
        <div className="rounded-lg bg-white p-6 text-center text-slate-700">3</div>
      </div>
    </div>
  )
}
