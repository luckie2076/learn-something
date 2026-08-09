# Unit 03 · Badge 徽标

## 核心 CSS 知识点

### 1. inline-flex — 内联弹性容器

`display: inline-flex` 让 Badge 像行内文字一样排列，同时又拥有 flex 的居中能力：

| display 值 | 自身尺寸 | 子元素排列 |
|---|---|---|
| `block` | 占一整行 | — |
| `inline` | 内容撑开 | 只是行内，不能上下居中 |
| `inline-flex` ✅ | 内容撑开 | flex 能力：居中、等分、gap |

```jsx
<span className="inline-flex items-center gap-1.5">
  <Icon />
  文字
</span>
```

### 2. rounded-full — 胶囊形状

`border-radius: 9999px` 让元素两端完全圆角，形状像一颗胶囊，是 Badge（尤其是数字角标）的经典形态。

```jsx
<span className="inline-flex ... rounded-full px-2.5 py-0.5 text-xs">
  3
</span>
```

### 3. 颜色变体模式 — 对象映射

与 Button 相同的思路，将 variant 映射到颜色配置：

```jsx
const VARIANT_CLASSES = {
  default: "bg-zinc-100 text-zinc-800",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger:  "bg-red-100 text-red-800",
}
```

### 4. px-2.5 — 微调间距

Tailwind 的间距值中 `2.5` = 10px，介于 `2`（8px）和 `3`（12px）之间。当默认值不完全满足设计需求时，可以用 `.5` 小数值微调。

### 5. 绝对定位角标 — 浮在组件上方

```jsx
<div className="relative">
  <Button>消息</Button>
  <span className="absolute -top-2 -right-2 bg-red-500 text-white
                   text-xs rounded-full w-5 h-5
                   flex items-center justify-center
                   ring-2 ring-white">
    5
  </span>
</div>
```

关键点：
- **父元素** `relative`：创建定位上下文
- **角标** `absolute` + `-top-2 -right-2`：浮在右上角外侧
- `ring-2 ring-white`：白色外圈，让角标和按钮之间有视觉分隔

---

## 运行

```bash
pnpm install && pnpm dev
```
