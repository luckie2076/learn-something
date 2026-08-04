import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function App() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-10 bg-background p-10 text-foreground">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">Card 复合组件</h1>
        <p className="text-muted-foreground">
          一个 Card 由多个独立子组件拼成，每个子组件只负责自己那一小块
        </p>
      </header>

      {/* 1) 标准组合：Header(Title+Description) → Content → Footer */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">标准卡片</h2>
        <Card>
          <CardHeader>
            <CardTitle>项目已保存</CardTitle>
            <CardDescription>你的更改已经成功写入数据库。</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              这是卡片正文区（CardContent），可以放任意内容：文本、列表、表单……
            </p>
          </CardContent>
          <CardFooter className="gap-2">
            <span className="text-sm text-muted-foreground">共 3 处修改</span>
          </CardFooter>
        </Card>
      </section>

      {/* 2) CardAction：放在头部的右上角（需要卡片内存在它，头部才变两列） */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          CardAction（头部右上角动作）
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>月度报告</CardTitle>
            <CardDescription>2026 年 7 月</CardDescription>
            {/* CardAction 不传 props，仅作为「锚点」让 CardHeader 切换两列布局 */}
            <CardAction>
              <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium">
                已生成
              </span>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm">把动作（按钮 / 徽章）放到标题同一行的右侧。</p>
          </CardContent>
        </Card>
      </section>

      {/* 3) 自由组合：只用你需要的零件，不想要 Header/Footer 就省略 */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          极简用法（只取 Card + CardContent）
        </h2>
        <Card>
          <CardContent>没有头部也没有底部，仅一个正文块。</CardContent>
        </Card>
      </section>
    </main>
  )
}
