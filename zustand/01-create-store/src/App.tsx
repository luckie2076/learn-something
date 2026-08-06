import S01 from "./01-Counter"
import S02 from "./02-PrimitiveState"
import S03 from "./03-ObjectState"
import S04 from "./04-ActionsInStore"

const sections: [number, string, React.ComponentType][] = [
  [1, "第一个 Store：计数器", S01],
  [2, "原始值状态的读写", S02],
  [3, "对象状态的读写", S03],
  [4, "在 Store 里定义 Action", S04],
]

export default function App() {
  return (
    <div className="mx-auto max-w-2xl p-6 font-sans">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900">
        第一章 · 创建 Store
      </h1>
      <p className="mb-6 text-sm text-zinc-500">
        使用 <code className="rounded bg-zinc-100 px-1 text-xs">create()</code> 创建
        store，通过 <code className="rounded bg-zinc-100 px-1 text-xs">useStore()</code> 在组件中读写状态
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
