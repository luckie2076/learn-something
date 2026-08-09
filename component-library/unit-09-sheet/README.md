# Unit 09 · Sheet 侧滑面板

## 核心 CSS 知识点

### 1. CSS Transform — 元素位移

`transform: translateX()` 和 `translateY()` 可以将元素沿 X/Y 轴平移。正值为右/下，负值为左/上。

```css
/* 隐藏在屏幕右侧外 */
.sheet-hidden-right {
  transform: translateX(100%);
}
/* 隐藏在屏幕左侧外 */
.sheet-hidden-left {
  transform: translateX(-100%);
}
/* 滑入到正常位置 */
.sheet-open {
  transform: translateX(0);
}
```

### 2. CSS Transition — 平滑动画

通过 `transition` 属性，让 transform 的变化产生平滑的过渡动画。

```css
.sheet-panel {
  transition: transform 300ms ease-in-out;
}
```

关键参数：
- `transform`：对 transform 变化做过渡
- `300ms`：动画时长
- `ease-in-out`：缓动函数（慢→快→慢）

### 3. React Portal — 脱离父容器渲染

`createPortal(children, document.body)` 将元素渲染到 body 下，避免被父容器的 `overflow: hidden` 或 `z-index` 限制。

```jsx
import { createPortal } from "react-dom"

return createPortal(
  <div className="fixed inset-0 z-50">
    {/* 遮罩 + 面板 */}
  </div>,
  document.body,
)
```

### 4. 遮罩层交互模式

```jsx
{/* 半透明遮罩，点击关闭 */}
<div
  className="absolute inset-0 bg-black/50"
  onClick={onClose}
/>
```

### 5. 键盘可访问性

- `role="dialog"` + `aria-modal="true"`：告知屏幕阅读器这是一个模态对话框
- 监听 ESC 键关闭
- 打开时自动聚焦面板

## 运行

```bash
pnpm install && pnpm dev
```
