/**
 * Tabs 组件
 *
 * 核心 CSS 知识点：
 * - Flex 水平布局（TabsList 内部 tab 排列）
 * - React state 驱动 active 样式切换
 * - CSS transition 实现指示器滑动动画
 * - 条件渲染（只渲染 active 的 Tab 内容）
 */

import { createContext, useContext, useState } from "react"

// ---------- Context：在 Tabs 树中共享当前 active tab ----------
const TabsContext = createContext(null)

export function Tabs({ defaultValue, children, className = "" }) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

// ---------- TabsList：tab 按钮的容器（Flex 水平布局） ----------
export function TabsList({ children, className = "" }) {
  return (
    <div
      role="tablist"
      className={[
        "inline-flex h-10 items-center justify-center rounded-md bg-zinc-100 p-1 text-zinc-500",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  )
}

// ---------- TabsTrigger：单个 tab 按钮 ----------
export function TabsTrigger({ value, children, className = "" }) {
  const { activeTab, setActiveTab } = useContext(TabsContext)
  const isActive = activeTab === value

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={[
        // 基础样式
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium",
        // 过渡动画
        "transition-all",
        // active 态：深色文字 + 白色背景 + 微阴影
        isActive
          ? "bg-white text-zinc-900 shadow-sm"
          : "text-zinc-500 hover:text-zinc-700",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  )
}

// ---------- TabsContent：tab 面板内容（条件渲染） ----------
export function TabsContent({ value, children, className = "" }) {
  const { activeTab } = useContext(TabsContext)

  if (activeTab !== value) return null

  return (
    <div
      role="tabpanel"
      className={[
        "mt-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  )
}
