import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function App() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-10 bg-background p-10 text-foreground">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">Dialog 对话框与可访问性</h1>
        <p className="text-muted-foreground">
          点击按钮打开对话框，体验 Radix 提供的无障碍行为
        </p>
      </header>

      <section className="space-y-4">
        <Dialog>
          {/* Trigger / Close 都是 Radix 原语，支持 asChild —— 直接套 Button */}
          <DialogTrigger asChild>
            <Button variant="outline">打开对话框</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>确认删除</DialogTitle>
              <DialogDescription>
                此操作不可撤销，将永久删除该条目及其所有关联数据。
              </DialogDescription>
            </DialogHeader>

            <p className="text-sm text-muted-foreground">
              这是对话框正文区，可以放任意内容。
            </p>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">取消</Button>
              </DialogClose>
              <Button variant="destructive">确认删除</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>按 Tab 键：焦点被「困」在对话框内，不会跑到背景</li>
          <li>按 Esc 键：对话框自动关闭</li>
          <li>点击半透明遮罩：对话框关闭</li>
          <li>打开时：背景页面不可滚动（滚动锁定）</li>
          <li>关闭后：焦点自动回到触发它的按钮</li>
        </ul>
      </section>
    </main>
  )
}
