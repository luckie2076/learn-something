/**
 * Sidebar 侧边栏组件
 *
 * 核心 CSS 知识点：
 * - CSS Grid 构建双栏布局（sidebar + main）
 * - CSS Flexbox 构建侧边栏内部垂直布局
 * - CSS Transition 实现折叠/展开动画
 * - position: sticky 实现固定定位
 * - 响应式断点切换 (md:)
 * - CSS 变量实现宽度可配置
 */

import { createContext, useContext, useState } from "react"

const SidebarContext = createContext(null)

const NAV_ITEMS = [
  { icon: "🏠", label: "首页", active: true },
  { icon: "📊", label: "数据面板" },
  { icon: "📋", label: "任务列表" },
  { icon: "📁", label: "文件管理" },
  { icon: "👤", label: "用户中心" },
  { icon: "⚙️", label: "系统设置" },
]

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <SidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed((v) => !v) }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return useContext(SidebarContext)
}

export function Sidebar({ className }) {
  const { collapsed } = useSidebar()

  return (
    <aside
      className={[
        "flex flex-col bg-zinc-900 text-zinc-300 transition-all duration-300 ease-in-out overflow-hidden",
        collapsed ? "w-16" : "w-56",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Logo 区域 */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-zinc-800 shrink-0">
        <div className="w-7 h-7 rounded-md bg-blue-500 shrink-0 flex items-center justify-center text-xs font-bold text-white">
          L
        </div>
        <span
          className={[
            "font-semibold text-sm text-white whitespace-nowrap transition-opacity duration-200",
            collapsed ? "opacity-0 w-0" : "opacity-100",
          ].join(" ")}
        >
          Logo
        </span>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 py-3 space-y-1 px-2">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href="#"
            className={[
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap",
              item.active
                ? "bg-white/10 text-white"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200",
            ].join(" ")}
          >
            <span className="shrink-0 text-base">{item.icon}</span>
            <span
              className={[
                "transition-opacity duration-200",
                collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100",
              ].join(" ")}
            >
              {item.label}
            </span>
          </a>
        ))}
      </nav>

      {/* 底部用户信息 */}
      <div className="border-t border-zinc-800 px-4 py-3 shrink-0 flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-zinc-600 shrink-0 flex items-center justify-center text-xs text-white">
          U
        </div>
        <div
          className={[
            "transition-opacity duration-200",
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100",
          ].join(" ")}
        >
          <p className="text-xs font-medium text-zinc-200 whitespace-nowrap">用户名</p>
          <p className="text-xs text-zinc-500 whitespace-nowrap">admin@example.com</p>
        </div>
      </div>
    </aside>
  )
}

export function SidebarToggle() {
  const { toggle, collapsed } = useSidebar()
  return (
    <button
      onClick={toggle}
      className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
      aria-label={collapsed ? "展开侧边栏" : "折叠侧边栏"}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {collapsed ? (
          <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
        ) : (
          <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
        )}
      </svg>
    </button>
  )
}
