# Unit 09 · Sheet 侧滑面板

## 核心 CSS 知识点

### 1. CSS Transform translate — 隐藏在屏幕外

Sheet 从屏幕边缘滑入滑出，核心是利用 `translateX()` / `translateY()` 将面板"藏"在视口外：

```css
/* 隐藏在右侧屏幕外 */
.panel-hidden-right  { transform: translateX(100%); }
/* 隐藏在左侧屏幕外 */
.panel-hidden-left   { transform: translateX(-100%); }
/* 隐藏在底部屏幕外 */
.panel-hidden-bottom { transform: translateY(100%); }
/* 正常位置 */
.panel-open { transform: translateX(0); }
```

`translateX(100%)` 表示沿 X 轴偏移自身宽度的 100%，即完全移到屏幕右边缘之外。

### 2. 四方向配置 — 策略映射模式

```jsx
const SIDE_CLASSES = {
  right:  { outer: "inset-y-0 right-0 w-80", transform: "translateX(100%)",  open: "translateX(0)" },
  left:   { outer: "inset-y-0 left-0 w-80",  transform: "translateX(-100%)", open: "translateX(0)" },
  top:    { outer: "inset-x-0 top-0 h-64",   transform: "translateY(-100%)", open: "translateY(0)" },
  bottom: { outer: "inset-x-0 bottom-0 h-64", transform: "translateY(100%)",  open: "translateY(0)" },
}
```

使用配置对象而非 if/else 分支，新增方向只需添加一行配置。

### 3. CSS Transition — 滑入滑出动画

```css
transition: transform 300ms ease-in-out;
```

只对 `transform` 做过渡（非 `transition-all`），避免 opacity、shadow 等属性产生不必要的动画计算。

`ease-in-out` 的缓动曲线（慢 → 快 → 慢）让滑入滑出更自然。

### 4. React Portal — 脱离父容器限制

```jsx
return createPortal(
  <div className="fixed inset-0 z-50">
    {/* 遮罩 + 面板 */}
  </div>,
  document.body
)
```

与 DropdownMenu、Dialog 相同的模式：将 Sheet 挂载到 body 下，避免被父容器的 overflow/z-index 限制。

### 5. 遮罩 + 外部点击关闭 + ESC

```jsx
{/* 半透明遮罩，点击关闭 */}
<div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} />

{/* ESC 键关闭 */}
useEffect(() => {
  const handler = (e) => e.key === "Escape" && onClose()
  document.addEventListener("keydown", handler)
  return () => document.removeEventListener("keydown", handler)
}, [open])
```

### 6. 离场动画保持 DOM — wasOpen ref 技巧

```jsx
const wasOpen = useRef(open)
// 关闭时也让 DOM 多停留一帧，播放完离场动画再真正卸载
if (!open && !wasOpen.current) return null
```

与 Dialog 的双状态（open + visible）思路相同——面板需要在"隐藏到屏幕外"的动画播放期间保持 DOM 存在。

### 7. pointer-events-none — 关闭中禁用交互

```jsx
<div className={`fixed inset-0 z-50 ${!open && "pointer-events-none"}`}>
```

关闭动画播放时，遮罩和面板仍然占据屏幕空间（`fixed inset-0`），需要 `pointer-events-none` 让鼠标事件穿透到底层页面。

### 8. 键盘可访问性

```jsx
<div
  role="dialog"
  aria-modal="true"
  aria-hidden={!open}
  tabIndex={-1}
  ref={panelRef}
>
```

- `aria-modal="true"`：屏幕阅读器忽略面板以外的内容
- `aria-hidden={!open}`：关闭时标记为对辅助技术不可见
- `tabIndex={-1}` + `focus()`：打开时自动聚焦面板，使键盘事件能被捕获

---

## 运行

```bash
pnpm install && pnpm dev
```
