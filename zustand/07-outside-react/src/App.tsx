import S01 from "./01-OutsideReact"
import S02 from "./02-Subscribe"
import S03 from "./03-ResetState"

const sections: [number, string, React.ComponentType][] = [
  [1, "在 React 组件外读写 Store", S01],
  [2, "subscribe 监听状态变化", S02],
  [3, "状态重置", S03],
]

export default function App() {
  return (
    <div className="mx-auto max-w-2xl p-6 font-sans">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900">
        第七章 · 进阶技巧
      </h1>
      <p className="mb-6 text-sm text-zinc-500">
        Store 不依赖 React——在组件外读写状态、监听变化，以及如何实现状态重置
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
