# Unit 11 · SplitPane 可分割面板

## 核心 CSS 知识点

### 1. CSS Flexbox — 百分比分栏

使用 `flex-basis` 按百分比分配面板宽度/高度：

```css
.pane-1 { flex-basis: 30%; }
.pane-2 { flex-basis: 70%; }
```

通过 JS 动态计算并设置 `flex-basis`，实现拖拽调整大小。

### 2. 鼠标事件实现拖拽

拖拽交互的三件套：

| 事件 | 作用 |
|------|------|
| `mousedown` | 在分隔条上按下鼠标，标记拖拽开始 |
| `mousemove` | 在 document 上移动，实时计算新比例 |
| `mouseup` | 在 document 上松开，标记拖拽结束 |

**为什么 mousemove/mouseup 绑在 document 上？**
因为鼠标可能拖出元素边界，绑在 document 上确保能捕获所有移动和松开事件。

```jsx
const handleMouseDown = () => {
  dragging.current = true
}
useEffect(() => {
  const onMove = (e) => {
    if (!dragging.current) return
    // 计算新比例...
  }
  const onUp = () => { dragging.current = false }
  document.addEventListener("mousemove", onMove)
  document.addEventListener("mouseup", onUp)
  return () => { /* 清理 */ }
}, [])
```

### 3. 拖拽时的 UX 优化

```css
/* 拖拽中禁止选中文本 */
body {
  user-select: none;
}
/* 拖拽中统一光标样式 */
body {
  cursor: col-resize; /* 或 row-resize */
}
```

### 4. cursor 样式

- `cursor: col-resize` — 表示可左右调整宽度
- `cursor: row-resize` — 表示可上下调整高度
- `cursor: ew-resize` / `cursor: ns-resize` — 替代写法

### 5. 嵌套 SplitPane

SplitPane 可以相互嵌套，实现类似 VS Code 的布局：

```
┌──────────┬───────────────────┐
│          │   CodeViewer      │
│ FileTree ├───────────────────┤
│          │   Terminal        │
└──────────┴───────────────────┘
```

外层 `horizontal` SplitPane 控制文件树/代码区的宽度比例，内层 `vertical` SplitPane 控制代码区/终端的高度比例。

## 运行

```bash
pnpm install && pnpm dev
```
