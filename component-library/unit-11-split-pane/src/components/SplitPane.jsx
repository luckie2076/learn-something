/**
 * SplitPane 可分割面板组件
 *
 * 核心 CSS 知识点：
 * - CSS Flexbox 构建等分/不等分双栏布局
 * - useRef 获取 DOM 元素引用
 * - 鼠标事件（mousedown / mousemove / mouseup）实现拖拽
 * - cursor 样式指示可拖拽区域
 * - user-select: none 防止拖拽时选中文本
 * - CSS calc() / flex-basis 动态计算尺寸
 */

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * 可拖拽的分割条
 */
function Divider({ onMouseDown, direction }) {
  return (
    <div
      className={[
        "shrink-0 bg-zinc-200 hover:bg-blue-400 transition-colors duration-150",
        "after:content-[''] after:block after:bg-zinc-400 after:rounded-full after:absolute",
        direction === "horizontal"
          ? "w-1.5 h-full cursor-col-resize after:w-1 after:h-8 after:top-1/2 after:-translate-y-1/2 after:-left-0.5"
          : "h-1.5 w-full cursor-row-resize after:h-1 after:w-8 after:left-1/2 after:-translate-x-1/2 after:-top-0.5",
      ].join(" ")}
      style={{ position: "relative" }}
      onMouseDown={onMouseDown}
      role="separator"
      aria-orientation={direction}
      tabIndex={0}
    />
  )
}

/**
 * SplitPane 复合组件
 *
 * direction: "horizontal" → 左右分栏（拖拽调节宽度）
 * direction: "vertical"   → 上下分栏（拖拽调节高度）
 */
export default function SplitPane({
  direction = "horizontal",
  initialRatio = 50,
  minRatio = 20,
  maxRatio = 80,
  children,
  className,
}) {
  const containerRef = useRef(null)
  const [ratio, setRatio] = useState(initialRatio)
  const dragging = useRef(false)

  const isHorizontal = direction === "horizontal"

  const getPosition = useCallback(
    (e) => (isHorizontal ? e.clientX : e.clientY),
    [isHorizontal],
  )
  const getSize = useCallback(
    (el) => (isHorizontal ? el.clientWidth : el.clientHeight),
    [isHorizontal],
  )

  const handleMouseDown = useCallback(() => {
    dragging.current = true
    document.body.style.userSelect = "none"
    document.body.style.cursor = isHorizontal ? "col-resize" : "row-resize"
  }, [isHorizontal])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging.current || !containerRef.current) return
      const containerSize = getSize(containerRef.current)
      const pos = getPosition(e)
      const rect = containerRef.current.getBoundingClientRect()
      const offset = isHorizontal ? pos - rect.left : pos - rect.top
      const newRatio = Math.max(minRatio, Math.min(maxRatio, (offset / containerSize) * 100))
      setRatio(Math.round(newRatio))
    }

    const handleMouseUp = () => {
      dragging.current = false
      document.body.style.userSelect = ""
      document.body.style.cursor = ""
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [getPosition, getSize, isHorizontal, minRatio, maxRatio])

  const childrenArr = Array.isArray(children) ? children : [children]
  const [firstChild, secondChild] = childrenArr

  const containerClass = isHorizontal
    ? "flex flex-row"
    : "flex flex-col"

  const firstStyle = {
    [isHorizontal ? "flexBasis" : "flexBasis"]: `${ratio}%`,
    overflow: "auto",
  }
  const secondStyle = {
    [isHorizontal ? "flexBasis" : "flexBasis"]: `${100 - ratio}%`,
    overflow: "auto",
  }

  return (
    <div
      ref={containerRef}
      className={[containerClass, "h-full w-full", className].filter(Boolean).join(" ")}
    >
      <div style={firstStyle}>{firstChild}</div>
      <Divider onMouseDown={handleMouseDown} direction={direction} />
      <div style={secondStyle}>{secondChild}</div>
    </div>
  )
}
