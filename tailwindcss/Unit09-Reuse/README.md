# 单元 9 · 复用与组合（@apply / @layer / 组件化）

## 学习目标

掌握在保持 utility-first 优势的前提下，如何合理复用样式。

## 你将看到

- 用 `@apply` 把一组原子类"内联"进自定义类 `.btn`
- 对比"组件层复用"：在 React 中把带类的 JSX 抽成组件

## 核心原理（为什么 / 机制）

- **`@apply`**：在 CSS 里把若干工具类直接"应用"到某个选择器，构建时展开成对应声明。适合少量全局复用（如统一的按钮外观）。但**别滥用**——过度 `@apply` 会让你重新回到"自定义类 + 命名"的老路，丢掉 utility-first 的透明与可改优势。
- **`@layer`**：控制生成样式的层序（优先级）。Tailwind 有三层：`base`（基础重置）、`components`（组件类）、`utilities`（工具类，优先级最高）。把 `@apply` 出的类放进 `@layer components`，可保证它能被 `utilities` 层的工具类覆盖。
- **更推荐的复用：组件层复用**：在 React 中把"带类的 JSX"抽成组件（如 `<Button/>`）。这样原子类依然透明、可针对实例覆盖，是最符合 utility-first 哲学的复用方式。

## 关键代码思路

```css
@layer components {
  .btn {
    @apply px-4 py-2 rounded bg-blue-600 text-white;
  }
}
```

```tsx
// 组件层复用（推荐）
function Button({ className = '', children }) {
  return <button className={`px-4 py-2 rounded bg-blue-600 text-white ${className}`}>{children}</button>
}
```

## 如何运行校验

在本单元目录下 `pnpm install && pnpm dev`，`.btn` 与手写原子类渲染出的按钮外观一致；React 组件版可传 `className` 覆盖个别样式。

## 常见误区

- 一开始就用 `@apply` 把所有样式"封装"回自定义类——这等于放弃 Tailwind 的核心优势，应优先组件化。
- 自定义类写在 `@layer` 之外却期望被工具类覆盖——注意层序，`@apply` 的类默认在 `utilities` 之外，需用 `@layer components` 调整优先级。
