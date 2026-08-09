/**
 * Input 组件
 *
 * 核心 CSS 知识点：
 * - :focus / :focus-visible 伪类 → 聚焦态样式
 * - :disabled 伪类 → 禁用态样式
 * - Flexbox 插槽布局 (prefix icon + input + suffix icon)
 * - 原生 form 控件样式的 Tailwind 覆盖
 */

import { forwardRef } from "react"

function Input(
  { className = "", type = "text", disabled = false, prefix, suffix, ...props },
  ref,
) {
  const base =
    "flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 " +
    // focus 态
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 " +
    // disabled 态
    "disabled:cursor-not-allowed disabled:opacity-50"

  // 如果有 prefix 或 suffix，返回带 Flex 插槽的版本
  if (prefix || suffix) {
    return (
      <div className="relative flex items-center">
        {prefix && (
          <span className="pointer-events-none absolute left-3 flex items-center text-zinc-400">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={[
            "flex h-10 w-full rounded-md border border-zinc-300 bg-white text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            prefix ? "pl-9" : "px-3",
            suffix ? "pr-9" : "px-3",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 flex items-center text-zinc-400">
            {suffix}
          </span>
        )}
      </div>
    )
  }

  // 普通 Input（无 icon）
  return (
    <input
      ref={ref}
      type={type}
      disabled={disabled}
      className={[base, className].filter(Boolean).join(" ")}
      {...props}
    />
  )
}

export default forwardRef(Input)
