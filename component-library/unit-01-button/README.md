# Unit 01 · Button 按钮

## 核心 CSS 知识点

### 1. CSS 伪类 — 交互状态

`hover`、`focus`、`disabled` 是按钮最常见的交互态。Tailwind 使用前缀修饰符：

| 修饰符 | 对应伪类 | 说明 |
|--------|----------|------|
| `hover:` | `:hover` | 鼠标悬停 |
| `focus-visible:` | `:focus-visible` | **键盘**聚焦时（Tab 键），鼠标点击不触发 |
| `disabled:` | `:disabled` | 原生 disabled 属性时 |
| `active:` | `:active` | 鼠标按下未松开 |

```css
/* Tailwind 编译后等价于 */
.btn:hover        { background-color: #374151; }
.btn:focus-visible { outline: 2px solid #3b82f6; }
.btn:disabled     { opacity: 0.5; pointer-events: none; }
```

### 2. variant / size — 样式变体模式

通过 props 驱动样式，将 variant 映射到不同的 CSS 类：

```jsx
const VARIANT_CLASSES = {
  default: "bg-zinc-900 text-white hover:bg-zinc-700",
  outline: "border border-zinc-200 bg-white hover:bg-zinc-50",
  ghost:   "hover:bg-zinc-100",
  danger:  "bg-red-600 text-white hover:bg-red-700",
}
```

使用时 `VARIANT_CLASSES[variant]` 即可动态切换。

### 3. className 合并 — 允许外部扩展样式

```jsx
<button className={["base-class", VARIANT_CLASSES[variant], className]
  .filter(Boolean)    // 过滤掉 undefined / 空字符串
  .join(" ")}         // 用空格拼接
>
```

`.filter(Boolean)` 是关键的防御性技巧——如果 `className` 未传，其值为 `undefined`，不处理会在 class 中出现字面量 `"undefined"`。

### 4. disabled + pointer-events-none — 真正的禁用

```html
<button disabled class="opacity-50 disabled:pointer-events-none">禁用</button>
```

- `opacity-50`：视觉上变灰
- `disabled` 属性：阻止默认交互（如表单提交）
- `disabled:pointer-events-none`：阻止所有点击事件穿透

### 5. ring-offset — 焦点环偏移

```css
ring-2 ring-blue-500 ring-offset-2 ring-offset-white
```

正常 outline 紧贴元素边缘，`ring-offset` 在 ring 和元素之间插入 2px 的透明间隙，视觉效果像一个"悬浮的蓝色框"。

### 6. transition-colors — 只过渡颜色属性

```css
transition-colors  /* 等价于 transition-property: color, background-color, border-color */
```

相比 `transition-all`，只对颜色变化做动画，避免对 transform / layout 属性产生不必要的过渡，性能更好。

---

## 运行

```bash
pnpm install && pnpm dev
```
