# 单元 3 · 布局基础（flex / grid / spacing）

## 学习目标

用 `flex` 与 `grid` 完成常见布局，并理解 Tailwind 的**间距刻度**设计。

## 你将看到

- 一个用 `flex` 居中、垂直对齐的容器
- 一个 `grid` 三等分列的卡片区
- 多种 `gap` / `p` / `px` 间距对比

## 核心原理（为什么 / 机制）

- **统一的 4px 间距刻度**：Tailwind 把间距建立在 `0.25rem`（4px）的基准上。类名里的数字 = 4px 的倍数：
  - `p-1` = `0.25rem` (4px)，`p-4` = `1rem` (16px)，`p-16` = `4rem` (64px)。
  - 这让全站间距"成体系"，不会出现随手写的 `13px` 这种破坏一致性的数值。
- **flex / grid 工具直接映射原生 CSS**：`justify-center` → `justify-content:center`，`items-center` → `align-items:center`，无需自己写 class。
- **`gap-*` 通用**：同一组 `gap` 工具同时作用于 flex 子项和 grid 子项，比 `margin` 拼间距更干净（不产生外边距塌陷问题）。

## 关键代码思路

```tsx
<div className="flex items-center justify-center gap-4">
  <div className="p-4">A</div><div className="p-4">B</div>
</div>

<div className="grid grid-cols-3 gap-4">
  <div className="p-4">1</div><div className="p-4">2</div><div className="p-4">3</div>
</div>
```

## 如何运行校验

在本单元目录下 `pnpm install && pnpm dev`，盒子在交叉轴上居中对齐；网格呈现三等宽列，列间距一致。调节 `gap` / `p` 数值可直观看到 4px 刻度的规律。

## 常见误区

- 用 `margin` 手动补间距——优先用 `gap` 与 `p`/`m` 工具，保持刻度统一。
- 记不住刻度：记住"数字 × 4px"，`p-4` 即 16px 即可举一反三。
