/**
 * Badge 组件
 *
 * 核心 CSS 知识点：
 * - inline-block 布局模型（行内元素但可以设置宽高）
 * - 颜色变体方案（用 JS 对象映射 variant → TailwindCSS 类名）
 *
 * 为什么用 inline-block？
 * Badge 通常和文本放在同一行中，用 inline-block 不会换行但可以设置 padding/圆角。
 */

const variantClasses = {
  default: "bg-zinc-900 text-white hover:bg-zinc-800",
  secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
  destructive: "bg-red-600 text-white hover:bg-red-500",
  outline: "border border-zinc-300 text-zinc-900",
}

export default function Badge({
  children,
  variant = "default",
  className = "",
}) {
  const base =
    "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors"

  const merged = [base, variantClasses[variant] || variantClasses.default, className]
    .filter(Boolean)
    .join(" ")

  return <span className={merged}>{children}</span>
}
