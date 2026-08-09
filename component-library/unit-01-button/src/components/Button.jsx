/**
 * Button 组件
 *
 * 每种 variant 都通过 TailwindCSS 原子类直接表达 CSS 效果。
 * 不引入 cva / tailwind-merge，变体映射完全手写，
 * 帮助你直观理解 :hover :active :disabled 等伪类的实际表现。
 */

// ---------- 变体 → TailwindCSS 类名映射 ----------

const variantClasses = {
  default:
    "bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-950 shadow-sm",
  destructive:
    "bg-red-600 text-white hover:bg-red-500 active:bg-red-700 shadow-sm",
  outline:
    "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 shadow-sm",
  secondary:
    "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300",
  ghost: "text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200",
  link: "text-zinc-900 underline-offset-4 hover:underline",
}

const sizeClasses = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-9 rounded-md px-3 text-xs",
  lg: "h-11 rounded-md px-8 text-base",
  icon: "h-10 w-10 text-sm",
}

export default function Button({
  children,
  variant = "default",
  size = "default",
  disabled = false,
  className = "",
  ...props
}) {
  // 拼接最终类名：基础 + 变体 + 尺寸 + 禁用态 + 用户自定义
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
  const disabledClass = "disabled:pointer-events-none disabled:opacity-50"

  const merged = [
    base,
    variantClasses[variant] || variantClasses.default,
    sizeClasses[size] || sizeClasses.default,
    disabledClass,
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <button className={merged} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
