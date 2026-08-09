/**
 * Accordion 组件
 *
 * 核心 CSS 知识点：
 * - max-height trick：用 max-height + overflow:hidden 实现折叠/展开动画
 * - CSS transition：max-height 属性过渡
 * - useRef 获取 DOM 元素真实高度
 *
 * 为什么用 max-height 而不是 height:auto？
 * CSS transition 无法从 height: 0 → height: auto 做动画，
 * 因为 auto 不是数值。所以需要用 max-height 模拟。
 */

import { createContext, useContext, useState, useRef, useEffect } from "react"

const AccordionContext = createContext(null)

// ---------- Accordion：容器，管理当前展开的 item ----------
export function Accordion({
  type = "single", // "single" | "multiple"
  defaultValue,
  children,
  className = "",
}) {
  const [openItems, setOpenItems] = useState(
    defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : [],
  )

  const toggle = (value) => {
    if (type === "single") {
      // 单选模式：如果已打开就关闭，否则只打开当前
      setOpenItems(openItems.includes(value) ? [] : [value])
    } else {
      // 多选模式：toggle
      setOpenItems((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      )
    }
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  )
}

// ---------- AccordionItem：单个折叠项 ----------
export function AccordionItem({ value, children, className = "" }) {
  return (
    <div
      className={["border-b border-zinc-200", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  )
}

// ---------- AccordionTrigger：点击触发展开/折叠 ----------
export function AccordionTrigger({ children, className = "" }) {
  const { openItems, toggle } = useContext(AccordionContext)

  // 从父 AccordionItem 的 props 中无法直接获取 value，
  // 这里用 children 中的 value 来判断。实际使用中，value 由 AccordionItem 传入。
  // 简化方案：在 AccordionItem 上通过 data-value 传递
  return (
    <button
      onClick={(e) => {
        const item = e.currentTarget.closest("[data-accordion-item]")
        if (item) {
          toggle(item.dataset.value)
        }
      }}
      className={[
        "flex w-full items-center justify-between py-4 text-sm font-medium transition-all hover:underline",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
      {/* 箭头图标，旋转动画 */}
      <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200" />
    </button>
  )
}

function ChevronDown({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

// ---------- AccordionContent：折叠内容区 ----------
export function AccordionContent({ children, className = "" }) {
  const ref = useRef(null)
  const [maxHeight, setMaxHeight] = useState("0px")
  const { openItems } = useContext(AccordionContext)

  useEffect(() => {
    // 获取所在 AccordionItem 的 value
    const item = ref.current?.closest("[data-accordion-item]")
    const value = item?.dataset.value

    if (openItems.includes(value)) {
      // 展开：设为内容的真实高度
      if (ref.current) {
        setMaxHeight(ref.current.scrollHeight + "px")
      }
    } else {
      // 折叠：设回 0
      setMaxHeight("0px")
    }
  }, [openItems])

  return (
    <div
      ref={ref}
      className={["overflow-hidden transition-[max-height] duration-300 ease-in-out", className]
        .filter(Boolean)
        .join(" ")}
      style={{ maxHeight }}
    >
      <div className="pb-4 pt-0 text-sm text-zinc-600">{children}</div>
    </div>
  )
}
