import S01 from "./01-AsyncAction"
import S02 from "./02-LoadingError"
import S03 from "./03-OptimisticUpdate"

const sections: [number, string, React.ComponentType][] = [
  [1, "在 Action 中发起异步请求", S01],
  [2, "loading 与 error 状态管理", S02],
  [3, "乐观更新模式", S03],
]

export default function App() {
  return (
    <div className="mx-auto max-w-2xl p-6 font-sans">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900">
        第四章 · 异步操作
      </h1>
      <p className="mb-6 text-sm text-zinc-500">
        在 Store 的 Action 中使用 async/await 处理异步逻辑，管理 loading / error 状态，以及乐观更新策略
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
