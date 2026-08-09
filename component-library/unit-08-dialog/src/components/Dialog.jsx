/**
 * Dialog 组件
 *
 * 核心 CSS 知识点：
 * - fixed 定位 + inset-0 实现全屏遮罩
 * - z-index 层级管理（遮罩层和内容层）
 * - body overflow:hidden（打开时禁止背景滚动）
 * - opacity + scale + transition 出入动画
 * - createPortal 渲染到 body
 *
 * 这是所有组件中最复杂的一个，涉及最多的 CSS 技巧。
 */

import { createContext, useContext, useState, useEffect } from "react"
import { createPortal } from "react-dom"

const DialogContext = createContext(null)

// ---------- Dialog：容器（管理 open/close 状态） ----------
export function Dialog({ children, open: controlledOpen, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false)

  // 支持受控（外部传 open）和非受控（内部管理）
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = (val) => {
    if (onOpenChange) onOpenChange(val)
    if (controlledOpen === undefined) setInternalOpen(val)
  }

  return (
    <DialogContext.Provider value={{ open: isOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

// ---------- DialogTrigger：触发按钮 ----------
export function DialogTrigger({ children, className = "" }) {
  const { setOpen } = useContext(DialogContext)

  return (
    <button
      onClick={() => setOpen(true)}
      className={[
        "inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  )
}

// ---------- DialogContent：弹窗主体（Portal + 遮罩 + 动画） ----------
export function DialogContent({ children, className = "" }) {
  const { open, setOpen } = useContext(DialogContext)
  const [visible, setVisible] = useState(false) // 控制动画

  // 打开时：先挂载 DOM → 下一帧触发动画
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
    }
  }, [open])

  // body scroll lock：打开时禁止背景滚动
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [open])

  // ESC 键关闭
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, setOpen])

  if (!open && !visible) return null

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* ---- 遮罩层 ---- */}
      <div
        onClick={() => setOpen(false)}
        className={[
          "fixed inset-0 bg-black/50",
          // 动画：淡入/淡出
          "transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      {/* ---- 内容层 ---- */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={[
            "relative w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-lg",
            // 动画：缩放 + 淡入
            "transition-all duration-200",
            visible
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* 关闭按钮 */}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-sm text-zinc-400 opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}

// ---------- DialogHeader：标题区域 ----------
export function DialogHeader({ children, className = "" }) {
  return (
    <div
      className={[
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  )
}

// ---------- DialogTitle：标题文字 ----------
export function DialogTitle({ children, className = "" }) {
  return (
    <h2
      className={[
        "text-lg font-semibold leading-none tracking-tight",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </h2>
  )
}

// ---------- DialogDescription：描述文字 ----------
export function DialogDescription({ children, className = "" }) {
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

// ---------- DialogFooter：底部按钮区 ----------
export function DialogFooter({ children, className = "" }) {
  return (
    <div
      className={[
        "mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  )
}
