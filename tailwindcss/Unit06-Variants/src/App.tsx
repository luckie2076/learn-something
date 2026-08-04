// 单元 6 演示：状态变体（hover / focus / group / peer）
export default function App() {
  return (
    <div className="min-h-screen space-y-8 bg-slate-50 p-8">
      {/* 自身状态：悬停变色 + 聚焦光环 */}
      <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-8 focus:ring-blue-300">
        悬停 / 聚焦看变化
      </button>

      {/* group：父级悬停影响子级 */}
      <div className="group rounded-lg bg-white p-4">
        <p className="text-slate-600 group-hover:text-red-500 hover:bg-gray-100">父级悬停时我变红</p>
      </div>

      {/* peer：前一个兄弟聚焦影响后续元素 */}
      <div className="space-y-2">
        <input className="peer rounded border border-slate-300 px-3 py-2" placeholder="点我聚焦" />
        <p className="text-slate-500 peer-focus:text-green-600">输入框聚焦时我变绿</p>
      </div>
    </div>
  )
}
