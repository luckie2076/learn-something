import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./components/Accordion.jsx"

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-semibold text-zinc-700">{title}</h2>
      {children}
    </section>
  )
}

const faqItems = [
  {
    value: "item-1",
    question: "什么是 React？",
    answer:
      "React 是一个用于构建用户界面的 JavaScript 库。它由 Facebook 开发并维护，采用组件化的方式构建 UI，通过虚拟 DOM 提升渲染性能。",
  },
  {
    value: "item-2",
    question: "什么是 TailwindCSS？",
    answer:
      "TailwindCSS 是一个原子化 CSS 框架。它提供了大量预设的工具类（如 flex、pt-4、text-center），让你直接在 HTML 中组合样式，而不需要写自定义 CSS。",
  },
  {
    value: "item-3",
    question: "为什么用 max-height 做折叠动画？",
    answer:
      "CSS transition 只能对数值属性做动画。height:auto 不是数值，所以无法从 height:0 过渡到 height:auto。替代方案是用 max-height，从 0 过渡到一个足够大的值（或动态计算 scrollHeight）。",
  },
  {
    value: "item-4",
    question: "Accordion 和 Tabs 有什么区别？",
    answer:
      "Tabs 是互斥的面板切换，同时只有一个面板可见。Accordion 是可展开/折叠的内容区域，可以同时展开多个（多选模式）或只有一个（单选模式）。",
  },
]

export default function App() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        Unit 06 · Accordion 组件
      </h1>
      <p className="mb-8 text-zinc-500">
        学习 max-height trick、CSS transition 动画、useRef 动态计算高度
      </p>

      {/* ---- 单选模式 ---- */}
      <Section title="单选模式（同一时间只展开一个）">
        <div className="rounded-lg border border-zinc-200 bg-white px-4">
          <Accordion type="single" defaultValue="item-1">
            {faqItems.map((item) => (
              <div key={item.value} data-accordion-item data-value={item.value}>
                <AccordionItem value={item.value}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* ---- 多选模式 ---- */}
      <Section title="多选模式（可以同时展开多个）">
        <div className="rounded-lg border border-zinc-200 bg-white px-4">
          <Accordion type="multiple" defaultValue={["item-1", "item-3"]}>
            {faqItems.map((item) => (
              <div key={item.value} data-accordion-item data-value={item.value}>
                <AccordionItem value={item.value}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* ---- 原理拆解 ---- */}
      <Section title="原理拆解">
        <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
          <p><strong>1. max-height trick</strong> — 折叠时 max-height:0，展开时设为 scrollHeight，配合 transition 产生动画</p>
          <p><strong>2. overflow:hidden</strong> — 将超出 max-height 的内容裁剪掉，实现「折叠」视觉效果</p>
          <p><strong>3. useRef + scrollHeight</strong> — 用 ref 获取 DOM，读取 scrollHeight 作为展开后的目标高度</p>
          <p><strong>4. useEffect 监听 openItems</strong> — 当展开/折叠状态变化时重新计算 maxHeight</p>
          <p><strong>5. 箭头旋转</strong> — 展开时箭头旋转 180°（通过 AccordionItem 的数据状态控制 CSS transform）</p>
        </div>
      </Section>
    </main>
  )
}
