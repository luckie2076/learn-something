import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

export default function App() {
  const [showStatusBar, setShowStatusBar] = useState(true)
  const [position, setPosition] = useState("bottom")

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-10 bg-background p-10 text-foreground">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">Dropdown Menu 下拉菜单</h1>
        <p className="text-muted-foreground">
          基于 Radix Menu 原语：键盘导航、定位、Portal、状态项都开箱即用
        </p>
      </header>

      {/* 1) 基础菜单：Label / Group / Separator / 禁用项 / 快捷键提示 */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">基础菜单</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">打开菜单</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>我的账户</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                个人资料
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>账单</DropdownMenuItem>
              <DropdownMenuItem>设置</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>GitHub</DropdownMenuItem>
            <DropdownMenuItem>支持</DropdownMenuItem>
            <DropdownMenuItem disabled>API（不可用）</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      {/* 2) 带状态项的菜单：CheckboxItem / RadioItem 通过 ItemIndicator 显示选中标记 */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          带状态项的菜单（Checkbox / Radio）
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">视图选项</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuCheckboxItem
              checked={showStatusBar}
              onCheckedChange={setShowStatusBar}
            >
              显示状态栏
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>对齐方式</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
              <DropdownMenuRadioItem value="top">顶部</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">底部</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right">右侧</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <p className="text-sm text-muted-foreground">
          当前：状态栏 {showStatusBar ? "开" : "关"} · 对齐 {position}
        </p>
      </section>
    </main>
  )
}
