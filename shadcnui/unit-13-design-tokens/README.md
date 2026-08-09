# 单元 13 · 设计令牌原理（Design Tokens）

[上一单元：Table / Avatar / Badge](../unit-12-table-avatar/README.md) | [下一单元：暗色模式](../unit-14-dark-mode/README.md)

> 本单元回答一个问题：**shadcn/ui 的组件为什么不需要写死颜色，改一处就能全站换肤？**
> 答案就是「设计令牌（design tokens）」——用 CSS 变量把颜色、圆角等设计决策集中管理。

## 现象

在前面的单元里，你写的组件代码长这样：

```tsx
<Button>Primary</Button>          // 实际是 bg-primary text-primary-foreground
<Card>...</Card>                  // 实际是 bg-card text-card-foreground
```

没有任何一个组件写死 `oklch(0.205 0 0)` 这种具体颜色。但页面确实渲染出了颜色，而且
切换暗色模式时这些颜色会自动变化。颜色「从哪来」？

## 原理：三层映射

shadcn/ui（Tailwind v4 版）的颜色不是直接写在组件里，而是经过**三层间接映射**：

```
组件类  bg-primary
   │  （Tailwind 工具类）
   ▼
@theme inline  --color-primary: var(--primary)
   │  （把变量暴露给 Tailwind 生成工具类）
   ▼
:root / .dark  --primary: oklch(...)   ← 真正的值在这里
```

1. **`--primary`（原始值）**：写在 `src/index.css` 的 `:root` 与 `.dark` 里，是真正的颜色值
   （最新版用 `oklch()` 色彩空间，比旧版的 `hsl()` 有更大色域、更好的明暗过渡）。
2. **`@theme inline`**：Tailwind v4 的机制，把 `--primary` 桥接成 `--color-primary`，
   从而生成 `bg-primary` / `text-primary-foreground` 等工具类。`inline` 表示工具类直接
   引用变量、不复制值，所以运行期改 `--primary` 会即时生效。
3. **组件类**：Button 等组件只引用 `bg-primary`，不直接碰具体颜色。

> 为什么不用 `hsl(var(--primary))` 旧写法？旧版必须把值包进 `hsl()`，且要在 `@layer base`
> 里定义，无法在 JS 里同时用同一套值。新版直接存 `oklch(...)` 原值 + `@theme inline`，
> 既简洁又能被 Tailwind 与 JS 共用。

### 暗色模式为什么也是令牌？

`.dark` 选择器里重定义了同一批变量（`--background`、`--primary`…）。当 `<html>` 加上
`.dark` 类时，这些变量被覆盖，所有 `bg-primary` 等工具类随之变暗——**组件代码一行没动**。

### 圆角也是令牌

`--radius` 是基准值，`@theme inline` 里派生出 `--radius-sm/md/lg/xl`（`calc` 计算）。
改 `--radius` 就能整体调圆角大小。

## 代码：本单元演示

- `src/index.css`：令牌定义 + `@theme inline` 映射（重点，含逐行注释）。
- `src/components/ui/button.tsx`、`card.tsx`：组件只引用 `bg-primary` / `bg-card` 等令牌类。
- `src/App.tsx`：点击不同色板，调用 `document.documentElement.style.setProperty("--primary", ...)`
  实时改令牌，**全站按钮/卡片主色同步变化**——这就是「单一事实来源」的直观证明。

## 为什么这样设计

- **一致性**：全站颜色来自同一批变量，不会出现「这里蓝一点、那里蓝一点」。
- **可换肤**：改 `:root` 里的几个值即可整体换主题，无需改组件。
- **暗色零成本**：明暗只是同一批变量的两组取值。
- **可扩展**：要新增一个语义色（如 `warning`），只需在 `:root`/`.dark` 加 `--warning`，
  再在 `@theme inline` 加一行 `--color-warning: var(--warning)`，就能用 `bg-warning`。

## 运行

```bash
cd unit-13-design-tokens
pnpm install
pnpm dev
```
