# Unit 07 · Dropdown Menu 组件

## 核心 CSS 知识点

### 1. 绝对定位（Fixed Positioning）

菜单面板使用 `position: fixed` + `getBoundingClientRect()` 动态计算位置：

```js
const rect = triggerRef.current.getBoundingClientRect()
// rect.top / rect.left — 触发按钮相对于视口的坐标
// rect.bottom / rect.right — 触发按钮的底边/右边

// 菜单放在按钮下方 4px 处
position = {
  top: rect.bottom + 4,
  left: rect.left,
}
```

为什么用 `fixed` 而不是 `absolute`？
- `absolute` 相对于最近的 `position: relative` 祖先定位
- `fixed` 相对于视口定位，不受任何祖先影响（配合 Portal 使用更可靠）

### 2. z-index 层叠上下文

```css
z-index: 50
```

菜单需要在页面所有内容上方显示。TailwindCSS 的 `z-50` 对应 `z-index: 50`，足以覆盖绝大多数场景。

### 3. createPortal

```js
import { createPortal } from "react-dom"

return createPortal(
  <div>菜单内容</div>,
  document.body  // 渲染目标：body 末尾
)
```

解决的问题：
- 父容器 `overflow: hidden` 会裁剪超出范围的子元素
- 父容器 `z-index` 会创建新的层叠上下文，限制子元素层级
- 将菜单渲染到 `document.body` 可以完全避开这些限制

### 4. click outside 检测

```js
useEffect(() => {
  const handler = (e) => {
    if (triggerRef.current?.contains(e.target)) return  // 点击触发按钮
    if (contentRef.current?.contains(e.target)) return   // 点击菜单内部
    setOpen(false)  // 都不是 → 关闭菜单
  }
  document.addEventListener("mousedown", handler)
  return () => document.removeEventListener("mousedown", handler)
}, [open])
```

为什么用 `mousedown` 而不是 `click`？
- `mousedown` 先于 `click` 触发，可以更早地关闭菜单

### 5. 翻转逻辑

```js
if (rect.bottom + menuHeight > window.innerHeight) {
  // 下方空间不够，翻转到上方
  top = rect.top - menuHeight - 4
}
```

---

## 运行

```bash
pnpm install && pnpm dev
```
