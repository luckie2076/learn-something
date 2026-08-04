# 单元 7 · 主题与设计令牌（@theme）

## 学习目标

用 v4 的 **CSS-first** 配置 `@theme` 自定义设计令牌，理解它与工具类的联动。

## 你将看到

- 在 `styles.css` 用 `@theme` 定义 `--color-brand`、`--font-display`
- 随后即可使用 `bg-brand`、`text-brand`、`font-display` 等自动生成的工具类

## 核心原理（为什么 / 机制）

- **v4 把"配置"搬进了 CSS**：在 `@theme` 块里声明 `--color-brand: #6d28d9;`，Tailwind 会：
  1. 自动生成 `bg-brand`、`text-brand`、`border-brand` 等成套工具类；
  2. 同时把它暴露为真正的 CSS 变量 `--color-brand`，供任意地方（包括自定义 CSS、运行时换肤）直接引用。
- **这是 v4 与 v3 最大的差别**：v3 用 JS 配置文件；v4 用原生 CSS 变量声明主题。好处是浏览器原生、可继承、可被覆盖，深浅模式与运行时主题切换都建立在这些变量之上。
- **命名约定决定工具类**：前缀决定用途——`--color-*` 生成颜色类，`--font-*` 生成字体类，`--spacing-*` 影响间距刻度等。

## 关键代码思路

```css
/* src/styles.css */
@import "tailwindcss";

@theme {
  --color-brand: #6d28d9;
  --font-display: "Inter", sans-serif;
}
```

```tsx
<h1 className="font-display text-brand">自定义品牌色与字体</h1>
```

## 如何运行校验

在本单元目录下 `pnpm install && pnpm dev`，页面上 `text-brand` 显示为自定义的紫色，`font-display` 应用了指定字体族。改 `@theme` 里的值，全站相关样式随之更新。

## 常见误区

- 仍按 v3 写 `tailwind.config.js` 的 `theme.extend`——v4 优先用 `@theme`，两者机制不同。
- 以为 `@theme` 只是"生成类"，其实它同时产出 CSS 变量，是主题系统的基石（单元 8 会用到）。
