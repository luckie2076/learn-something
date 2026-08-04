import { useState } from "react"
import { SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

// 三套品牌主题，对应 index.css 里的 [data-brand="..."] 规则
const brands = [
  { id: "blue", name: "科技蓝", color: "oklch(0.55 0.22 264)" },
  { id: "green", name: "自然绿", color: "oklch(0.6 0.17 162)" },
  { id: "violet", name: "梦幻紫", color: "oklch(0.58 0.23 300)" },
] as const

export default function App() {
  const [brand, setBrand] = useState<(typeof brands)[number]["id"]>("blue")

  function applyBrand(id: string) {
    setBrand(id as typeof brand)
    // 关键：把 data-brand 写到 <html>，触发 index.css 中对应规则的 --brand 覆盖
    document.documentElement.setAttribute("data-brand", id)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <SparklesIcon className="size-6 text-brand" />
            单元 15 · 品牌主题定制
          </h1>
          <p className="text-muted-foreground">
            品牌色是新增的语义令牌 <code>--brand</code>。切换下面品牌，所有
            <code>bg-brand</code> 元素（标题图标、按钮）同步变色——组件代码不变。
          </p>
        </header>

        <div className="flex flex-wrap gap-3">
          {brands.map((b) => (
            <Button
              key={b.id}
              variant={brand === b.id ? "brand" : "outline"}
              onClick={() => applyBrand(b.id)}
            >
              <span
                className="size-3 rounded-full border"
                style={{ background: b.color }}
              />
              {b.name}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          <Button variant="brand" size="lg">
            <SparklesIcon className="size-4" />
            主行动按钮（brand 变体）
          </Button>
          <p className="text-muted-foreground text-sm">
            <code>data-brand</code> 当前值：<code>{brand}</code>
          </p>
        </div>
      </div>
    </div>
  )
}
