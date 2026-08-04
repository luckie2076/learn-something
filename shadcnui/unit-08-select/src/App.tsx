import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function App() {
  // ① 受控：value 由 React state 掌握，选完可立即在别处使用
  const [theme, setTheme] = useState("system")

  return (
    <main className="min-h-screen flex flex-col items-center gap-12 py-16 px-4">
      <header className="text-center space-y-2">
        <h1 className="text-2xl font-bold">单元 08 · Select 选择器</h1>
        <p className="text-muted-foreground text-sm max-w-md">
          原生 &lt;select&gt; 难样式化、移动端会唤起系统选择器；Select 用 Radix 重做了一个
          可完全自定义、键盘可操作、自带定位的下拉。
        </p>
      </header>

      {/* ① 受控用法 */}
      <section className="w-full max-w-xs space-y-3">
        <p className="text-xs text-muted-foreground">① 受控（value 来自 state）</p>
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">浅色</SelectItem>
            <SelectItem value="dark">深色</SelectItem>
            <SelectItem value="system">跟随系统</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm">
          已选 theme：
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{theme}</code>
        </p>
      </section>

      {/* ② 分组 */}
      <section className="w-full max-w-xs space-y-3">
        <p className="text-xs text-muted-foreground">
          ② 分组（Group / Label / Separator）
        </p>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择一项" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>水果</SelectLabel>
              <SelectItem value="apple">苹果</SelectItem>
              <SelectItem value="banana">香蕉</SelectItem>
              <SelectItem value="blueberry">蓝莓</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>蔬菜</SelectLabel>
              <SelectItem value="carrot">胡萝卜</SelectItem>
              <SelectItem value="broccoli">西兰花</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>

      {/* ③ 非受控 + 禁用项 */}
      <section className="w-full max-w-xs space-y-3">
        <p className="text-xs text-muted-foreground">③ 非受控 + 禁用项</p>
        <Select defaultValue="beijing">
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beijing">北京</SelectItem>
            <SelectItem value="shanghai">上海</SelectItem>
            <SelectItem value="xizang" disabled>
              西藏（暂不可选）
            </SelectItem>
          </SelectContent>
        </Select>
      </section>
    </main>
  )
}
