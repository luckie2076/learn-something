// 单元 4 演示：排版 / 颜色档位 / 圆角与阴影
export default function App() {
  return (
    <div className="min-h-screen space-y-8 bg-slate-50 p-8 text-slate-800">
      {/* 排版：字号与字重 */}
      <h1 className="text-3xl font-bold">排版：字号与字重</h1>
      <p className="text-base text-slate-500">正文文字，搭配次要颜色。</p>

      {/* 颜色档位 */}
      <div className="space-y-2">
        <p className="text-red-500">text-red-500（主色档）</p>
        <p className="text-red-100">text-red-100（最浅档，作背景浅色）</p>
      </div>

      {/* 圆角 + 阴影（层次） */}
      <button className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow">
        主按钮
      </button>
    </div>
  )
}
