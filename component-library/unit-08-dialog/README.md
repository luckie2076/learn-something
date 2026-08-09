# Unit 08 · Dialog 组件

## 核心 CSS 知识点

### 1. fixed 全屏定位

```css
fixed inset-0
```

等价于：

```css
position: fixed;
top: 0;
right: 0;
bottom: 0;
left: 0;
```

`fixed` 相对于视口定位，不随页面滚动移动——这是遮罩层的核心。

### 2. 遮罩层（Overlay）

```css
fixed inset-0 bg-black/50 z-50
```

- `bg-black/50` — 纯黑 + 50% 不透明度 = 半透明遮罩
- `z-50` — 确保遮罩在所有内容上方
- 点击遮罩层关闭 Dialog（通过 `onClick={() => setOpen(false)}`）

### 3. body scroll lock

```js
document.body.style.overflow = "hidden"  // 打开时
document.body.style.overflow = original  // 关闭时恢复
```

这是 Dialog 最关键的体验细节：打开弹窗后，背景页面应禁止滚动。

### 4. 出入动画

```css
/* 入场 */
opacity: 1; transform: scale(1);

/* 离场 */
opacity: 0; transform: scale(0.95);

/* 过渡 */
transition: all 0.2s;
```

`requestAnimationFrame` 技巧：

```js
// 先挂载 DOM（此时是离场状态）
// 下一帧再切换到入场状态，触发 CSS transition
useEffect(() => {
  if (open) {
    requestAnimationFrame(() => setVisible(true))
  }
}, [open])
```

这样浏览器能检测到属性变化并执行过渡动画。

### 5. z-index 双层结构

```
z-50 遮罩层 (bg-black/50)
z-50 内容层 (bg-white 白色弹窗)
```

两层用相同的 z-index 但内容层在 DOM 中排在后面（后来居上）。

### 6. ESC 键关闭

```js
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setOpen(false)
})
```

符合 WAI-ARIA 无障碍标准。

---

## 运行

```bash
pnpm install && pnpm dev
```
