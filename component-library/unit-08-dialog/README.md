# Unit 08 · Dialog 对话框

## 核心 CSS 知识点

### 1. 全屏遮罩 + 居中内容 — fixed + flex

```jsx
{/* 遮罩层 — 覆盖整个视口 */}
<div className="fixed inset-0 z-50 bg-black/50">
  {/* 内容区 — 遮罩内部居中 */}
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-xl p-6">
      对话框内容
    </div>
  </div>
</div>
```

- `fixed inset-0`：铺满整个视口（等价于 `top:0; right:0; bottom:0; left:0`）
- `flex items-center justify-center`：水平和垂直居中子元素
- `bg-black/50`：半透明黑色遮罩（`rgba(0,0,0,0.5)`）

### 2. 双阶段动画 — open + visible

Dialog 的入场动画需要"先挂载 DOM，再触发 CSS transition"。用两个布尔状态控制：

```jsx
const [mounted, setMounted] = useState(false)    // 控制 DOM 挂载
const [visible, setVisible] = useState(false)    // 控制 CSS 动画类名

// 打开时：立即挂载 → 下一帧触发动画
useEffect(() => {
  if (open) {
    setMounted(true)
    requestAnimationFrame(() => setVisible(true))
  } else {
    setVisible(false)
    setTimeout(() => setMounted(false), 300)  // 等动画播完再卸载
  }
}, [open])
```

**时序图**：
```
打开：  mounted=true  →  DOM挂载（opacity:0, scale:0.95）
        →  rAF后 visible=true  →  CSS类名切换（transition生效 → opacity:1, scale:1）

关闭：  visible=false →  CSS类名切换（transition生效 → opacity:0, scale:0.95）
        →  300ms后 mounted=false →  DOM卸载
```

`requestAnimationFrame` 确保浏览器在**下一帧**才触发 CSS 类名变化。如果和 `setMounted(true)` 在同一个同步任务中执行，浏览器会批量处理两个状态变更，CSS transition 不会生效。

### 3. 遮罩 + 内容各自独立的动画

```css
/* 遮罩：只做透明度过渡 */
.overlay { transition: opacity 300ms; }

/* 内容：opacity + scale 同时过渡（Material Design 风格） */
.content { transition: opacity 300ms, transform 300ms; }
.content.hidden { opacity: 0; transform: scale(0.95); }
```

遮罩和内容的动画属性不同，独立控制更细腻。

### 4. body scroll lock — 阻止背景滚动

```jsx
useEffect(() => {
  if (open) {
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"   // 锁定滚动
    return () => {
      document.body.style.overflow = original  // 恢复
    }
  }
}, [open])
```

设置 `body { overflow: hidden }` 后，背景页面无法滚动，用户的滚动操作只影响 Dialog 内部（如果内部也溢出的话）。

### 5. z-index 双层级

```
z-50  — Dialog 整体（遮罩 + 内容）
  ├── 遮罩 (z-index 继承 50)
  └── 内容 (z-index 继承 50)

页面其他元素  — z-0 ~ z-40
```

整个 Dialog 使用一个 `z-50` 包裹遮罩和内容，因为它们都在同一个层叠上下文中，内部不需要再次设置 z-index。

### 6. ESC 关闭 + 聚焦管理

```jsx
// ESC 键关闭
useEffect(() => {
  const handler = (e) => e.key === "Escape" && onClose()
  document.addEventListener("keydown", handler)
  return () => document.removeEventListener("keydown", handler)
}, [open])

// 打开时聚焦 Dialog，支持键盘导航
useEffect(() => {
  dialogRef.current?.focus()
}, [open])

// JSX 中
<div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true">
```

`tabIndex={-1}` 让不可聚焦的 `<div>` 能够接收 `focus()`，使键盘事件可以正确捕获。

---

## 运行

```bash
pnpm install && pnpm dev
```
