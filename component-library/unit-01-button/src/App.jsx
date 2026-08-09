import Button from "./components/Button.jsx"

const variants = ["default", "destructive", "outline", "secondary", "ghost", "link"]
const sizes = ["default", "sm", "lg", "icon"]

// 演示用的图标 SVG（极简 inline svg，不引入图标库）
function HeartIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-semibold text-zinc-700">{title}</h2>
      {children}
    </section>
  )
}

export default function App() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">
        Unit 01 · Button 组件
      </h1>
      <p className="mb-10 text-zinc-500">
        所有变体均通过 TailwindCSS 原子类直接表达 CSS 效果，hover / active /
        disabled 伪类一目了然。
      </p>

      {/* ---- variant × size 矩阵 ---- */}
      <Section title="变体 × 尺寸">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium text-zinc-400">
                  variant \ size
                </th>
                {sizes.map((s) => (
                  <th key={s} className="text-center text-sm font-medium text-zinc-400">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr key={v}>
                  <td className="whitespace-nowrap py-1 text-sm text-zinc-500">
                    {v}
                  </td>
                  {sizes.map((s) => (
                    <td key={s} className="py-1 text-center">
                      <Button variant={v} size={s}>
                        {s === "icon" ? <HeartIcon /> : "Button"}
                      </Button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---- 禁用态 ---- */}
      <Section title="禁用态 (disabled)">
        <div className="flex flex-wrap gap-3">
          {["default", "destructive", "outline", "secondary", "ghost"].map(
            (v) => (
              <Button key={v} variant={v} disabled>
                {v}
              </Button>
            ),
          )}
        </div>
      </Section>

      {/* ---- 带图标 ---- */}
      <Section title="带图标的按钮">
        <div className="flex flex-wrap gap-3">
          <Button>
            <HeartIcon />
            Like
          </Button>
          <Button variant="secondary">
            Save
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </Section>

      {/* ---- focus-visible ---- */}
      <Section title="键盘聚焦 (按 Tab 键切换)">
        <p className="mb-3 text-sm text-zinc-400">
          按 Tab 键切换到下方按钮，观察 focus-visible ring 样式
        </p>
        <div className="flex flex-wrap gap-3">
          <Button>Button 1</Button>
          <Button variant="outline">Button 2</Button>
          <Button variant="secondary">Button 3</Button>
        </div>
      </Section>
    </main>
  )
}
