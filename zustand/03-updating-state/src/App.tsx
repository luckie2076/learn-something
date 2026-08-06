import S01 from "./01-SetVariants"
import S02 from "./02-NestedUpdate"
import S03 from "./03-ImmerMiddleware"

const sections: [number, string, React.ComponentType][] = [
  [1, "set() 直接赋值 vs 函数式更新", S01],
  [2, "嵌套对象/数组的不可变更新", S02],
  [3, "immer middleware 简化更新", S03],
]

export default function App() {
  return (
    <div className="mx-auto max-w-2xl p-6 font-sans">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900">
        第三章 · 状态更新进阶
      </h1>
      <p className="mb-6 text-sm text-zinc-500">
        <code className="rounded bg-zinc-100 px-1 text-xs">set()</code> 的多种调用方式、嵌套不可变更新、以及 immer 中间件如何让更新变得简单
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
