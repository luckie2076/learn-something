import S01 from "./01-BasicSelector"
import S02 from "./02-DerivedData"
import S03 from "./03-UseShallow"
import S04 from "./04-PerfDemo"

const sections: [number, string, React.ComponentType][] = [
  [1, "基础 Selector 用法", S01],
  [2, "Selector 内做派生数据", S02],
  [3, "useShallow 避免不必要渲染", S03],
  [4, "渲染次数可视化对比", S04],
]

export default function App() {
  return (
    <div className="mx-auto max-w-2xl p-6 font-sans">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900">
        第二章 · 选择器与性能
      </h1>
      <p className="mb-6 text-sm text-zinc-500">
        Selector 让你精确订阅 store 中的特定数据，配合 <code className="rounded bg-zinc-100 px-1 text-xs">useShallow</code> 实现最小化重渲染
      </p>
      {sections.map(([n, title, Comp]) => (
        <section key={n} className="mb-6 rounded-lg border border-zinc-200 p-4">
          <h2 className="mb-3 text-lg font-semibold text-zinc-700">
            {n}. {title}
          </h2>
          <Comp />
        </section>
      ))}
    </div>
  )
}
