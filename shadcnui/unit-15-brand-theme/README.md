# 单元 15 · 品牌主题定制

> 本单元是模块三的收尾：在「设计令牌」与「暗色模式」之上，演示如何**新增自己的语义色**
> （品牌色），并支持多品牌切换。这正是一个真实产品中「换肤 / 多租户品牌」的简化版。

## 现象

前面所有组件颜色来自 `--primary`、`--background` 等内置令牌。但真实产品常需要「品牌主色」
（logo 色、主按钮色、强调色），它和 `primary`（中性功能色）未必相同。我们想新增一种颜色，
让组件能写 `bg-brand`，并且能整体切换不同品牌——而不改任何组件。

## 原理：新增令牌的三步

1. **定义原始值**：在 `:root`（及需要的 `.dark`）里加 `--brand`、`--brand-foreground`。
2. **暴露给 Tailwind**：在 `@theme inline` 里加一行 `--color-brand: var(--brand)`、
   `--color-brand-foreground: var(--brand-foreground)`。Tailwind 随即生成
   `bg-brand` / `text-brand-foreground` 等工具类。
3. **在组件里使用**：给 Button 加一个 `brand` 变体，写 `bg-brand text-brand-foreground`。

### 多品牌切换：用属性选择器覆盖变量

要支持「蓝 / 绿 / 紫」多家品牌，本质是给同一组 `--brand` 提供多组取值，并按条件启用。
做法是在 `index.css` 里写属性选择器：

```css
:root[data-brand="blue"]   { --brand: oklch(0.55 0.22 264); ... }
:root[data-brand="green"]  { --brand: oklch(0.6 0.17 162);  ... }
:root[data-brand="violet"] { --brand: oklch(0.58 0.23 300); ... }
```

切换时只需 `document.documentElement.setAttribute("data-brand", "blue")`，对应规则命中，
所有 `bg-brand` 元素立即变色。**注意**：这些规则必须写在 `:root` 之后，才能用同等优先级覆盖默认
`--brand`（同特异性下，后定义的获胜）。

> 这与单元 14 的 `.dark` 是同一套机制：都是「用选择器切换一组 CSS 变量」。
> 暗色是 `.dark` 类，品牌是 `[data-brand]` 属性——原理完全一致，可组合使用。

### 为什么放在 `:root` 层而非组件层

令牌是全局的「单一事实来源」。如果写在某个组件作用域内，换肤要逐个组件改，违背令牌初衷。
全局变量 + 属性选择器，才能做到「一处定义、全站联动」。

## 代码：本单元演示

- `src/index.css`：新增 `--brand` 令牌 + `@theme inline` 暴露 + 三套 `[data-brand]` 取值。
- `src/components/ui/button.tsx`：新增 `brand` 变体（`bg-brand`）。
- `src/App.tsx`：点击切换 `data-brand`，标题图标与按钮主色同步变化。

## 为什么这样设计

- **可扩展**：加语义色只需「定义 + 暴露」两步，不碰组件实现。
- **可组合**：品牌（data-brand）、明暗（.dark）、圆角（--radius）彼此独立、互不干扰。
- **零运行时成本**：纯 CSS 变量切换，无需重渲染、无 JS 计算。
- **对齐官方**：shadcn/ui 官方的「Adding New Tokens」就是这套做法。

## 运行

```bash
cd unit-15-brand-theme
pnpm install
pnpm dev
```
