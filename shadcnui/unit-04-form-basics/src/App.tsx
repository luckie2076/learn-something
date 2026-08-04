import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function App() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-8 bg-background p-10 text-foreground">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">表单基础</h1>
        <p className="text-sm text-muted-foreground">Input / Label / Textarea</p>
      </header>

      {/* 1) Label 与 Input 通过 htmlFor / id 关联（可访问性） */}
      <div className="grid gap-2">
        <Label htmlFor="name">姓名</Label>
        <Input id="name" placeholder="请输入姓名" defaultValue="张三" />
      </div>

      {/* 2) 带前置图标的输入框：图标用 lucide-react，绝对定位 */}
      <div className="grid gap-2">
        <Label htmlFor="search">搜索</Label>
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input id="search" placeholder="搜索…" className="pl-9" />
        </div>
      </div>

      {/* 3) Textarea */}
      <div className="grid gap-2">
        <Label htmlFor="bio">个人简介</Label>
        <Textarea id="bio" placeholder="写点什么…" />
      </div>

      {/* 4) 禁用态：Label 也会随之变灰（peer-disabled 联动） */}
      <div className="grid gap-2">
        <Label htmlFor="disabled">禁用态</Label>
        <Input id="disabled" disabled defaultValue="不可编辑" />
      </div>

      {/* 原生 button 即可；Button 组件是单元 03 的专题 */}
      <button className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-4 text-sm font-medium">
        保存
      </button>
    </main>
  )
}
