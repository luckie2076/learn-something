# Unit 03 · Badge 组件

## 核心 CSS 知识点

### 1. inline-block 布局模型

```css
inline-block
```

| display 值 | 是否独占一行 | 能否设宽高/padding | 典型用途 |
|-----------|------------|------------------|---------|
| `block` | 是 | 能 | div, section, p |
| `inline` | 否 | 不能 | span, a, strong |
| `inline-block` | 否 | 能 | badge, tag, button |

Badge 选择 `inline-block` 正是因为：需要在文本中同行显示（不像 block 会换行），又需要设置 padding/圆角/背景色（不像 inline 无法设置）。

### 2. 颜色变体方案

用 JS 对象做 variant → TailwindCSS 类名的一对一映射：

```js
const variantClasses = {
  default:     "bg-zinc-900 text-white",
  destructive: "bg-red-600 text-white",
  outline:     "border border-zinc-300 text-zinc-900",
}
```

选中后直接取 `variantClasses[variant]`，比 switch/case 更简洁，和 Button 组件的变体模式完全一致。

### 3. 绝对定位角标

通知数角标是 Badge 的一个经典变体：

```html
<div class="relative inline-block">
  <Icon />
  <span class="absolute -right-1.5 -top-1.5 ...">3</span>
</div>
```

- 父级 `relative` + `inline-block`：建立定位上下文，且尺寸由内容撑开
- 角标 `absolute`：脱离文档流，用负值定位到右上角
- `ring-2 ring-white`：白色圆环让角标和图标之间有视觉隔离

---

## 运行

```bash
pnpm install && pnpm dev
```
