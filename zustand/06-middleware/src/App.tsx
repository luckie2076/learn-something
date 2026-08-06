import S01 from "./01-Devtools"
import S02 from "./02-Persist"

const sections: [number, string, React.ComponentType][] = [
  [1, "devtools：Redux DevTools 调试", S01],
  [2, "persist：状态持久化到 localStorage", S02],
]

export default function App() {
  return (
    <div className="mx-auto max-w-2xl p-6 font-sans">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900">
        第六章 · 中间件
      </h1>
      <p className="mb-6 text-sm text-zinc-500">
        devtools 中间件可追踪状态变化，persist 中间件将状态持久化到 localStorage
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
