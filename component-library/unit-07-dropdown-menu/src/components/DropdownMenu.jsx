/**
 * Dropdown Menu 组件
 *
 * 核心 CSS 知识点：
 * - 绝对定位 (absolute positioning)
 * - z-index 层叠上下文
 * - CSS transform + opacity + transition 展开动画
 * - createPortal 渲染到 body（避开 overflow:hidden 等裁剪）
 * - click outside 检测（关闭菜单）
 */

import { createContext, useContext, useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

const DropdownContext = createContext(null);

// ---------- DropdownMenu：容器 ----------
export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

// ---------- DropdownMenuTrigger：触发按钮 ----------
export function DropdownMenuTrigger({ children, className = "" }) {
  const { setOpen, triggerRef } = useContext(DropdownContext);

  return (
    <button
      ref={triggerRef}
      onClick={() => setOpen((prev) => !prev)}
      className={[
        "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}

// ---------- DropdownMenuContent：菜单面板（Portal 到 body） ----------
export function DropdownMenuContent({
  children,
  className = "",
  align = "start",
}) {
  const { open, setOpen, triggerRef } = useContext(DropdownContext);
  const contentRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // click outside 检测：点击菜单外部和触发按钮外部时关闭
  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      // 如果点击的是触发按钮本身，不处理（由 trigger 的 onClick toggle）
      if (triggerRef.current?.contains(e.target)) return;
      // 点击菜单内容内部也不关闭
      if (contentRef.current?.contains(e.target)) return;
      setOpen(false);
    };

    // 用 mousedown 而非 click，因为 click 可能在事件冒泡结束前就触发
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, setOpen, triggerRef]);

  // 计算菜单位置：放在触发按钮下方
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = contentRef.current?.offsetHeight || 0;
    const viewportHeight = window.innerHeight;

    // 默认放在按钮下方
    let top = rect.bottom + 4;
    // 如果下方空间不够，翻转到上方
    if (top + menuHeight > viewportHeight) {
      top = rect.top - menuHeight - 4;
    }

    setPosition({
      top,
      left: align === "end" ? rect.right - 160 : rect.left, // 假设菜单宽约 160px
    });
  }, [open, align, triggerRef]);

  if (!open) return null;

  return createPortal(
    <div
      ref={contentRef}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        zIndex: 50,
      }}
      className={[
        "min-w-[8rem] overflow-hidden rounded-md border border-zinc-200 bg-white p-1 text-zinc-900 shadow-md",
        // 展开动画
        "animate-in",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>,
    document.body,
  );
}

// ---------- DropdownMenuItem：菜单项 ----------
export function DropdownMenuItem({ children, className = "", onClick }) {
  const { setOpen } = useContext(DropdownContext);

  return (
    <button
      onClick={(e) => {
        onClick?.(e);
        setOpen(false); // 点击菜单项后关闭
      }}
      className={[
        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-zinc-100 focus:bg-zinc-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}

// ---------- DropdownMenuSeparator：分隔线 ----------
export function DropdownMenuSeparator({ className = "" }) {
  return (
    <div
      className={["my-1 h-px bg-zinc-200", className].filter(Boolean).join(" ")}
    />
  );
}

// ---------- DropdownMenuLabel：标签（不可点击） ----------
export function DropdownMenuLabel({ children, className = "" }) {
  return (
    <div
      className={["px-2 py-1.5 text-sm font-semibold text-zinc-900", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
