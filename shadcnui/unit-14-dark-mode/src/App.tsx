import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function App() {
  const { theme, setTheme } = useTheme()

  // 关键细节：next-themes 在浏览器端才确定最终主题。
  // 服务端/首帧渲染时 theme 为 undefined，直接读会闪烁或拿到错误值。
  // 用 mounted 标记「客户端已挂载」，挂载前不展示主题相关 UI。
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">单元 14 · 暗色模式</h1>
          <p className="text-muted-foreground">
            点击下面按钮切换 light / dark / system。切换的是 <code>&lt;html&gt;</code> 上的
            <code>.dark</code> 类——所有组件代码不用改，颜色来自设计令牌。
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>主题切换</CardTitle>
            <CardDescription>
              刷新页面后选择会被记住（next-themes 持久化到 localStorage）。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              variant={mounted && theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
            >
              <SunIcon className="size-4" />
              Light
            </Button>
            <Button
              variant={mounted && theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
            >
              <MoonIcon className="size-4" />
              Dark
            </Button>
            <Button
              variant={mounted && theme === "system" ? "default" : "outline"}
              onClick={() => setTheme("system")}
            >
              <MonitorIcon className="size-4" />
              System
            </Button>
          </CardContent>
        </Card>

        <p className="text-muted-foreground text-sm">
          当前主题：
          <code>{mounted ? theme : "（首帧未知，等待挂载）"}</code>
        </p>
      </div>
    </div>
  )
}
