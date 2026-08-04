import * as React from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

// shadcn 对 Sonner 的封装非常简单：只是把 <Toaster> 包一层，
// 通过 CSS 变量把 toast 的外观接到我们自己的设计令牌（popover / border）上。
// 官方版还会用 next-themes 的 useTheme() 来同步暗色模式；本单元先固定为 light，
// 暗色主题的接入会在模块三（unit-14）单独讲解，避免引入跨单元依赖。
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
