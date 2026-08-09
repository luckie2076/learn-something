# Unit 07 · DropdownMenu 下拉菜单

## 核心 CSS 知识点

### 1. 动态定位 — getBoundingClientRect() + fixed

Dropdown 的菜单位置不是固定的，它需要"弹出"在触发按钮的正下方。核心步骤：

```jsx
// 1. 获取按钮在视口中的位置
const btnRect = btnRef.current.getBoundingClientRect()

// 2. 计算菜单的坐标
const x = btnRect.left          // 左对齐
const y = btnRect.bottom + 4    // 按钮下方 4px

// 3. 用 fixed 定位到视口
menu.style.left = `${x}px`
menu.style.top = `${y}px`
```

`getBoundingClientRect()` 返回元素相对于**视口**（viewport）的位置，配合 `position: fixed` 实现精确对齐。

### 2. z-index 层叠上下文 — 菜单浮在最上层

```css
z-50 /* z-index: 50 */
```

`z-index` 控制元素的层叠顺序。Dropdown 菜单必须高于页面其他元素，避免被后续内容遮挡。

### 3. React Portal — 突破父容器限制

```jsx
import { createPortal } from "react-dom"

return createPortal(<menu />, document.body)
```

如果菜单渲染在触发按钮的 DOM 子树中，可能被父元素的 `overflow: hidden` / `z-index` 限制。Portal 将菜单挂载到 `<body>` 末尾，完全脱离父容器约束。

### 4. useLayoutEffect — 在浏览器绘制前计算位置

```jsx
useLayoutEffect(() => {
  // 在 DOM 变更后、浏览器绘制前同步执行
  const rect = btnRef.current.getBoundingClientRect()
  setPosition({ x: rect.left, y: rect.bottom + 4 })
}, [open])
```

| Hook | 执行时机 | 适用场景 |
|------|---------|---------|
| `useEffect` | 浏览器**绘制之后**异步执行 | 数据请求、事件监听 |
| `useLayoutEffect` | DOM 变更后、浏览器**绘制之前**同步执行 | 位置计算，避免闪烁 |

如果位置计算放在 `useEffect` 中，用户会先看到菜单在错误位置闪现一帧再跳到正确位置。`useLayoutEffect` 在绘制前完成计算，消除闪烁。

### 5. 点击外部关闭 — 事件委托模式

```jsx
useEffect(() => {
  const handler = (e) => {
    // 如果点击目标不在菜单或按钮内，关闭菜单
    if (!menuRef.current?.contains(e.target)) {
      onClose()
    }
  }
  document.addEventListener("mousedown", handler)
  return () => document.removeEventListener("mousedown", handler)
}, [open])
```

- `contains()`：检查一个节点是否是另一个节点的后代
- 使用 `mousedown` 而非 `click`：mousedown 先触发，可阻止 click 事件的后续副作用
- 监听器绑定在 `document` 而非菜单元素上：捕获全局的点击事件

### 6. align="end" — 右对齐适配

```jsx
if (align === "end") {
  x = btnRect.right - menuWidth  // 菜单右边缘对齐按钮右边缘
}
```

当按钮靠近屏幕右侧，左对齐会导致菜单溢出视口，右对齐可以将菜单向左偏移。

---

## 运行

```bash
pnpm install && pnpm dev
```
