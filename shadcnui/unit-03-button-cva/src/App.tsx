import { Button } from "@/components/ui/button"

export default function App() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-10 bg-background p-10 text-foreground">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">cva 变体系统</h1>
        <p className="text-muted-foreground">
          同一个 Button，靠 <code>variant</code> / <code>size</code> 组合出不同外观
        </p>
      </header>

      {/* 1) variant：语义类型 */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">variant（语义）</h2>
        <div className="flex flex-wrap gap-3">
          <Button>default</Button>
          <Button variant="secondary">secondary</Button>
          <Button variant="outline">outline</Button>
          <Button variant="destructive">destructive</Button>
          <Button variant="ghost">ghost</Button>
          <Button variant="link">link</Button>
        </div>
      </section>

      {/* 2) size */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">size</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">sm</Button>
          <Button size="default">default</Button>
          <Button size="lg">lg</Button>
          <Button size="icon">★</Button>
        </div>
      </section>

      {/* 3) 自定义 className 覆盖：cn 用 tailwind-merge 消解冲突 */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          自定义 className 覆盖（tailwind-merge 消解冲突）
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button className="rounded-full">圆角按钮</Button>
          <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
            覆盖背景
          </Button>
        </div>
      </section>

      {/* 4) asChild：把按钮样式套到 <a>，保留链接语义 */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          asChild：样式套到 &lt;a&gt;（仍是真正的链接）
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer">
              访问 shadcn/ui 官网
            </a>
          </Button>
        </div>
      </section>
    </main>
  )
}
