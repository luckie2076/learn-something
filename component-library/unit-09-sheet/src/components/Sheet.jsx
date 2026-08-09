/**
 * Sheet 侧滑面板组件
 *
 * 核心 CSS 知识点：
 * - CSS Transform (translateX/translateY) 实现滑入滑出动画
 * - CSS Transition 控制动画时长与缓动
 * - position: fixed + inset 全屏覆盖
 * - aria-* 无障碍属性
 * - useRef + createPortal 挂载到 body
 * - overflow: hidden 锁定背景滚动
 */

import { createPortal } from "react-dom"
import { useEffect, useRef } from "react"

const SIDE_CLASSES = {
  left: {
    outer: "inset-y-0 left-0 w-80",
    transform: "-translate-x-full",
    openTransform: "translate-x-0",
  },
  right: {
    outer: "inset-y-0 right-0 w-80",
    transform: "translate-x-full",
    openTransform: "translate-x-0",
  },
  top: {
    outer: "inset-x-0 top-0 h-64",
    transform: "-translate-y-full",
    openTransform: "translate-y-0",
  },
  bottom: {
    outer: "inset-x-0 bottom-0 h-64",
    transform: "translate-y-full",
    openTransform: "translate-y-0",
  },
}

export default function Sheet({ open, onClose, side = "right", children, className }) {
  const panelRef = useRef(null)
  const wasOpen = useRef(open)

  // 打开时锁定 body 滚动
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [open])

  // ESC 关闭
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  // 聚焦面板用于键盘导航
  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.focus()
    }
  }, [open])

  const sideCfg = SIDE_CLASSES[side]

  if (!open && !wasOpen.current) return null

  return createPortal(
    <div
      className={`fixed inset-0 z-50 ${!open && "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* 遮罩层 */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* 面板 */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="侧滑面板"
        tabIndex={-1}
        className={[
          `absolute bg-white shadow-2xl transition-transform duration-300 ease-in-out ${sideCfg.outer}`,
          open ? sideCfg.openTransform : sideCfg.transform,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
          aria-label="关闭面板"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {children}
      </div>
    </div>,
    document.body,
  )
}
