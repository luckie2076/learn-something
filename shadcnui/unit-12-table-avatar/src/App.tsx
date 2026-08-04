import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ComponentProps } from "react"

// 演示数据
const invoices = [
  { invoice: "INV001", status: "Paid", method: "信用卡", amount: "¥250.00" },
  { invoice: "INV002", status: "Pending", method: "PayPal", amount: "¥150.00" },
  { invoice: "INV003", status: "Unpaid", method: "银行转账", amount: "¥350.00" },
  { invoice: "INV004", status: "Paid", method: "信用卡", amount: "¥450.00" },
  { invoice: "INV005", status: "Paid", method: "PayPal", amount: "¥550.00" },
] as const

// 状态 -> Badge 变体：把「数据值」映射到「视觉语义」
const statusVariant: Record<
  (typeof invoices)[number]["status"],
  ComponentProps<typeof Badge>["variant"]
> = {
  Paid: "default",
  Pending: "secondary",
  Unpaid: "destructive",
}

export default function App() {
  return (
    <div className="mx-auto max-w-2xl space-y-10 p-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          单元 12 · 数据展示：Table / Avatar / Badge
        </h1>
        <p className="text-muted-foreground text-sm">
          三个「展示型」原子组件：Table 排布结构化数据，Badge 用颜色标注状态，Avatar 用图片/首字母代表用户。
        </p>
      </header>

      {/* ── Table：结构化数据 + 状态用 Badge 标注 ── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Table（表格）</h2>
        <Table>
          <TableCaption>最近的发票列表。</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">发票号</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>支付方式</TableHead>
              <TableHead className="text-right">金额</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.invoice}>
                <TableCell className="font-medium">{inv.invoice}</TableCell>
                <TableCell>
                  {/* 用 Badge 把状态值翻译成视觉语义 */}
                  <Badge variant={statusVariant[inv.status]}>{inv.status}</Badge>
                </TableCell>
                <TableCell>{inv.method}</TableCell>
                <TableCell className="text-right">{inv.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>合计</TableCell>
              <TableCell className="text-right">¥1,750.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </section>

      {/* ── Avatar：图片优先，加载失败/无图时回退到首字母 ── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Avatar（头像）</h2>
        <div className="flex items-center gap-4">
          <Avatar>
            {/* 图片存在时显示图片；图片加载失败则显示 Fallback */}
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <Avatar>
            {/* 故意用一个无效地址，演示 Fallback 兜底 */}
            <AvatarImage src="https://example.com/not-exist.png" alt="无效" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>

          <Avatar className="size-10">
            <AvatarFallback className="bg-primary text-primary-foreground">刘</AvatarFallback>
          </Avatar>
        </div>
      </section>
    </div>
  )
}
