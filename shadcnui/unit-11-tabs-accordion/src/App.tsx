import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function App() {
  return (
    <div className="mx-auto max-w-2xl space-y-10 p-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          单元 11 · 布局型组件：Tabs 与 Accordion
        </h1>
        <p className="text-muted-foreground text-sm">
          两者都是「在一块区域里切换不同内容」：Tabs 用标签横向切换；Accordion 用手风琴纵向展开。
        </p>
      </header>

      {/* ── Tabs：标签切换面板 ── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Tabs（标签切换）</h2>
        {/* defaultValue 控制初始选中的面板；每个 Trigger 的 value 对应一个 Content 的 value */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="analytics">分析</TabsTrigger>
            <TabsTrigger value="settings">设置</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>概览</CardTitle>
                <CardDescription>查看关键指标与近期活动。</CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                当前有 12 个进行中的项目，3 个待办任务。
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>分析</CardTitle>
                <CardDescription>追踪性能与用户参与度指标。</CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                页面访问量较上月上涨 25%。
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>设置</CardTitle>
                <CardDescription>管理账户偏好与选项。</CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                可配置通知、安全与主题。
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* ── Accordion：手风琴展开 ── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Accordion（手风琴）</h2>
        {/* type="single" 一次只能开一个；collapsible 允许全部关闭 */}
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>shadcn 的组件是怎么来的？</AccordionTrigger>
            <AccordionContent>
              用 CLI 把组件源码「复制」进你的项目，不是从 npm 安装一个黑盒库，所以你可以随意改。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>为什么需要 Radix？</AccordionTrigger>
            <AccordionContent>
              Radix 提供无障碍（键盘、焦点、ARIA）与交互逻辑，shadcn 只在其上套样式，省去自造轮子的成本。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Tabs 和 Accordion 该怎么选？</AccordionTrigger>
            <AccordionContent>
              内容少、需要并列对照用 Tabs；内容多、希望一次只聚焦一条用 Accordion。
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  )
}
