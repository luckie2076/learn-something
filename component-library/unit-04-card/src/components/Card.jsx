/**
 * Card 组件 —— 复合组件模式
 *
 * 核心 CSS 知识点：
 * - 复合布局（Flex 垂直排列）
 * - padding / 间距系统
 * - header / content / footer 语义分区
 * - border-radius + box-shadow 塑造卡片质感
 *
 * 设计思路：
 * Card 不是一个单一的组件，而是 Card + CardHeader + CardContent + CardFooter 的组合。
 * 每个子组件都通过 className 传入，可灵活扩展，这也是 shadcn/ui 采用的「复合组件」模式。
 */

export function Card({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = "" }) {
  return (
    <div
      className={[
        "flex flex-col space-y-1.5 p-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3
      className={[
        "text-lg font-semibold leading-none tracking-tight",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = "" }) {
  return (
    <p
      className={[
        "text-sm text-zinc-500",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </p>
  )
}

export function CardContent({ children, className = "" }) {
  return (
    <div className={["p-6 pt-0", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = "" }) {
  return (
    <div
      className={[
        "flex items-center p-6 pt-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  )
}
