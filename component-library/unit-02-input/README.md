# Unit 02 · Input 组件

## 核心 CSS 知识点

### 1. :focus 伪类

TailwindCSS 通过 `focus-visible:` 前缀实现聚焦态：

```css
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
```

等价于：
```css
input:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px white, 0 0 0 4px #a1a1aa;
}
```

`focus-visible` 与 `focus` 的区别：
- `:focus` — 任何聚焦方式都触发（包括鼠标点击）
- `:focus-visible` — 仅在键盘导航时显示（更符合无障碍设计）

### 2. :disabled 伪类

```css
disabled:cursor-not-allowed disabled:opacity-50
```

### 3. Flex 插槽布局

Input 的 prefix / suffix icon 通过 **绝对定位** 实现：

```jsx
<div className="relative flex items-center">
  {/* prefix icon 绝对定位在左侧 */}
  <span className="pointer-events-none absolute left-3 ...">🔍</span>
  {/* input 左边加 padding 给 icon 腾位置 */}
  <input className="pl-9 ..." />
</div>
```

关键 CSS 技巧：
- 外层 `relative` — 建立定位上下文
- icon 用 `absolute` — 脱离文档流覆盖在 input 上方
- `pointer-events-none` — icon 不拦截点击，点击穿透到 input
- input 用 `pl-9` / `pr-9` — 预留 icon 的空间，防止文字被遮挡

### 4. React forwardRef

Input 使用 `forwardRef` 将 ref 转发给原生 `<input>`，便于父组件获取焦点或取值：

```js
const Input = forwardRef(({ ... }, ref) => <input ref={ref} ... />)
```

---

## 运行

```bash
pnpm install && pnpm dev
```
