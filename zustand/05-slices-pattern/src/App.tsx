import S01 from "./01-SingleSlice"
import S02 from "./02-MultiSlice"
import S03 from "./03-MultiStore"

const sections: [number, string, React.ComponentType][] = [
  [1, "单个 Slice 的定义与使用", S01],
  [2, "多个 Slice 组合成完整 Store", S02],
  [3, "多个独立 Store 协作", S03],
]

export default function App() {
  return (
    <div className="mx-auto max-w-2xl p-6 font-sans">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900">
        第五章 · Store 拆分模式
      </h1>
      <p className="mb-6 text-sm text-zinc-500">
        Slice 模式将大型 Store 按关注点拆分，以及多个独立 Store 之间如何协作
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
