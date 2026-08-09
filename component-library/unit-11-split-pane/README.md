# Unit 11 · SplitPane 可分割面板

## 核心 CSS 知识点

### 1. CSS Flex 百分比分栏

使用 `flex-basis` 按百分比动态分配面板大小：

```jsx
<div className="flex h-full">
  <div style={{ flexBasis: "30%" }}>左侧面板</div>
  <div className="shrink-0 w-1.5 bg-zinc-200 cursor-col-resize" /> {/* 分隔条 */}
  <div style={{ flexBasis: "70%" }}>右侧面板</div>
</div>
```

- `flex-basis`：面板的基础尺寸（百分比）
- `flex-grow: 0`（默认）：不自动扩展
- `flex-shrink: 1`（默认）：空间不足时可收缩

**关键技术**：分隔条必须是 `shrink-0`（`flex-shrink: 0`），否则被两边的面板挤压成 0 宽度。

### 2. 鼠标事件三件套 — mousedown / mousemove / mouseup

拖拽分隔条调整大小的核心交互：

| 事件 | 绑定位置 | 作用 |
|------|----------|------|
| `mousedown` | **分隔条**上 | 标记拖拽开始 |
| `mousemove` | **document** 上 | 实时计算新比例 |
| `mouseup` | **document** 上 | 标记拖拽结束 |

```jsx
const handleMouseDown = () => {
  dragging.current = true
  document.body.style.userSelect = "none"   // 禁止文本选中
  document.body.style.cursor = "col-resize"  // 统一光标
}

useEffect(() => {
  const handleMouseMove = (e) => {
    if (!dragging.current) return
    const ratio = (e.clientX - offset) / containerWidth * 100
    setRatio(Math.max(20, Math.min(80, ratio))) // 限制在 [20%, 80%]
  }
  const handleMouseUp = () => {
    dragging.current = false
    document.body.style.userSelect = ""
    document.body.style.cursor = ""
  }
  document.addEventListener("mousemove", handleMouseMove)
  document.addEventListener("mouseup", handleMouseUp)
  return () => { /* 清理 */ }
}, [])
```

**为什么 mousemove/mouseup 绑定在 document 上？**
鼠标拖动时可能超出分隔条的边界，绑定在 document 上可以捕获全屏范围的移动和松开事件。

### 3. getBoundingClientRect() — 精确位置计算

```jsx
const rect = containerRef.current.getBoundingClientRect()
const offset = e.clientX - rect.left          // 鼠标距离容器左边缘的距离
const ratio = (offset / rect.width) * 100      // 换算为百分比
```

`getBoundingClientRect()` 返回元素**相对视口**的坐标和尺寸，配合 `e.clientX`（鼠标在视口中的 X 坐标）计算相对偏移。

### 4. useRef 存储拖拽状态 — 避免不必要的重渲染

```jsx
const dragging = useRef(false)  // ← 不用 useState！
```

拖拽中 `mousemove` 每 16ms 触发一次（60fps），如果用 `setState`，每次都会触发组件重渲染，导致性能问题。`useRef` 的 `.current` 变更不触发重渲染，是高频鼠标事件的正确选择。

同理，`ratio` 使用 `useState`（需要重渲染更新面板宽度），`dragging` 使用 `useRef`（仅内部标记，不需要重渲染）。

### 5. cursor 样式 — 可拖拽提示

```css
cursor: col-resize  /*  ↔  左右调整 */
cursor: row-resize  /*  ↕  上下调整 */
```

分隔条 hover 时显示对应的光标样式，提示用户可以拖拽。

### 6. 全局 UX 优化

```jsx
// 拖拽中：禁止文本选中
document.body.style.userSelect = "none"
// 拖拽中：统一光标（防止拖到面板上时光标变回默认）
document.body.style.cursor = "col-resize"
```

这两个设置直接修改 `<body>` 的 inline style，覆盖页面中所有元素，确保拖拽体验丝滑。

### 7. 嵌套 SplitPane — 构建复杂布局

```jsx
<SplitPane direction="horizontal" initialRatio={30}>
  <FileTree />
  <SplitPane direction="vertical" initialRatio={60}>
    <CodeViewer />
    <Terminal />
  </SplitPane>
</SplitPane>
```

得到 VS Code 式的三面板布局：

```
┌──────────┬───────────────────┐
│          │                   │
│ FileTree │    CodeViewer     │
│          ├───────────────────┤
│ (30%)    │    Terminal       │
│          │                   │
└──────────┴───────────────────┘
           (70%)
```

---

## 运行

```bash
pnpm install && pnpm dev
```
