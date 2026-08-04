import { toast } from "sonner"
import { AlertCircleIcon, TerminalIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"

export default function App() {
  return (
    <div className="mx-auto max-w-2xl space-y-10 p-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          单元 10 · 反馈：Toast（Sonner）与 Alert
        </h1>
        <p className="text-muted-foreground text-sm">
          两种「非阻塞反馈」：Toast 主动弹出来一下就走；Alert 常驻在页面里提示状态。
        </p>
      </header>

      {/* ── Toast：由 Sonner 接管，命令式触发 ── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Toast（Sonner）</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() =>
              toast("已保存草稿", {
                description: "系统会在 30 天后自动清理未发布的草稿。",
                action: {
                  label: "撤销",
                  onClick: () => toast("已撤销保存"),
                },
              })
            }
          >
            普通 Toast
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              toast.success("发布成功", {
                description: "文章已对所有读者可见。",
              })
            }
          >
            成功 Toast
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              toast.error("发布失败", {
                description: "网络异常，请稍后重试。",
              })
            }
          >
            错误 Toast
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              const id = toast.loading("正在上传…")
              setTimeout(() => toast.success("上传完成", { id }), 1500)
            }}
          >
            带加载态
          </Button>
        </div>
      </section>

      {/* ── Alert：常驻提示，需要放在组件树里 ── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Alert（常驻提示）</h2>

        <Alert>
          <TerminalIcon />
          <AlertTitle>提示</AlertTitle>
          <AlertDescription>
            这些是 shadcn 提供的「复合组件」演示，代码都复制在本单元内。
          </AlertDescription>
        </Alert>

        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>无法连接服务器</AlertTitle>
          <AlertDescription>
            请检查你的网络设置，或稍后重试。所有未保存的更改都会保留在本地。
          </AlertDescription>
        </Alert>
      </section>

      {/* Toaster 必须渲染在组件树中，Sonner 才能把 toast 挂到页面上 */}
      <Toaster />
    </div>
  )
}
