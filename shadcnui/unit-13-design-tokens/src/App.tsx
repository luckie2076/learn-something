import { useState } from "react"
import { PaletteIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// 几个不同的 primary 色板（oklch），用于演示「改一个令牌，全站联动」
const palettes = [
  { name: "中性灰（默认）", value: "oklch(0.205 0 0)" },
  { name: "品牌蓝", value: "oklch(0.55 0.22 264)" },
  { name: "品牌绿", value: "oklch(0.6 0.17 162)" },
  { name: "品牌紫", value: "oklch(0.58 0.23 300)" },
]

export default function App() {
  // 选中的 primary 颜色，写入 document 根元素的 --primary 变量
  const [primary, setPrimary] = useState(palettes[0].value)

  function applyPrimary(value: string) {
    setPrimary(value)
    // 关键演示：直接改 CSS 变量，所有用到 bg-primary 的组件立即换色
    document.documentElement.style.setProperty("--primary", value)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <PaletteIcon className="size-6" />
            单元 13 · 设计令牌原理
          </h1>
          <p className="text-muted-foreground">
            下面这些组件都用 <code>bg-primary</code> 等工具类。它们背后引用的是
            CSS 变量 <code>--primary</code>。点击不同色板，观察「改一处变量，全站联动」。
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>组件由令牌驱动</CardTitle>
            <CardDescription>
              这些按钮/卡片自身代码不变，颜色完全来自设计令牌。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>实时切换 primary 令牌</CardTitle>
            <CardDescription>
              点击后，上面所有组件的主色会同步变化。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {palettes.map((p) => (
              <Button
                key={p.name}
                variant={primary === p.value ? "default" : "outline"}
                onClick={() => applyPrimary(p.value)}
              >
                <span
                  className="size-3 rounded-full border"
                  style={{ background: p.value }}
                />
                {p.name}
              </Button>
            ))}
          </CardContent>
        </Card>

        <p className="text-muted-foreground text-sm">
          当前 <code>--primary</code>：<code>{primary}</code>
        </p>
      </div>
    </div>
  )
}
