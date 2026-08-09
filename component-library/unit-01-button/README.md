# Unit 01 · Button 组件

## 核心 CSS 知识点

### 1. 伪类交互状态

TailwindCSS 通过前缀实现 CSS 伪类，天然暴露底层原理：

| 伪类 | Tailwind 写法 | 效果 |
|------|-------------|------|
| `:hover` | `hover:bg-zinc-800` | 鼠标悬停时背景变深 |
| `:active` | `active:bg-zinc-950` | 按下时背景更深 |
| `:disabled` | `disabled:opacity-50` | 禁用时降低不透明度 |
| `:focus-visible` | `focus-visible:ring-2` | 键盘聚焦时出现 ring |

### 2. 变体模式（Variant Pattern）

不使用 `class-variance-authority`，而是用 **JS 对象映射** `variant → TailwindCSS 类名`：

```js
const variantClasses = {
  default:  "bg-zinc-900 text-white hover:bg-zinc-800",
  outline:  "border border-zinc-300 bg-white hover:bg-zinc-100",
  // ...
}
```

### 3. 尺寸系统

同样用对象映射不同尺寸的 padding / height / font-size：

```js
const sizeClasses = {
  sm:  "h-9 rounded-md px-3 text-xs",
  lg:  "h-11 rounded-md px-8 text-base",
}
```

### 4. 类名合并策略

基础类名在变体之前、用户传入的 `className` 在最末位，这样用户可以通过 CSS 优先级覆盖默认样式：

```js
const merged = [base, variantClasses[v], sizeClasses[s], disabledClass, className].join(" ")
```

---

## 运行

```bash
pnpm install && pnpm dev
```
