import { Button } from "@/components/ui/button"

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8 text-center text-foreground">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">shadcn/ui 机制演示</h1>
        <p className="text-muted-foreground">
          这个 Button 是源码文件，不是 npm 依赖——它在你的项目里。
        </p>
      </div>

      {/* 同一组件，不同 variant */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button>Default</Button>
        <Button variant="secondary" className="bg-red-500">111 让我二中</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>



      {/* 同一组件，不同 size */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">★</Button>
      </div>
    </main>
  )
}
