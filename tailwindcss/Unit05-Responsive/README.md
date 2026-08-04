# 单元 5 · 响应式设计

## 学习目标

掌握 **mobile-first（移动优先）** 的断点系统，理解前缀的"叠加"而非"切换"逻辑。

## 你将看到

- 一个盒子：默认（手机）单列 → `md:` 变两列 → `lg:` 变三列
- 拖动浏览器宽度，列数随断点平滑变化

## 核心原理（为什么 / 机制）

- **断点前缀基于 `min-width` 媒体查询**：`sm`(640px) / `md`(768px) / `lg`(1024px) / `xl`(1280px) / `2xl`(1536px)。
- **mobile-first 的层叠逻辑**：没有前缀的样式是"移动端默认"；带前缀的样式是"在该宽度**及以上**才叠加/覆盖"。也就是说样式从窄到宽**逐层叠加**，而不是在不同宽度间切换。
  - 例：`grid-cols-1 md:grid-cols-2 lg:grid-cols-3` 表示：默认 1 列；≥768px 升为 2 列；≥1024px 升为 3 列。
- **编译后**大致是：`.md\:grid-cols-2 { @media (min-width:768px){ grid-template-columns: repeat(2,minmax(0,1fr)); } }`。

## 关键代码思路

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 卡片 × N */}
</div>
```

## 如何运行校验

在本单元目录下 `pnpm install && pnpm dev`，窄屏下为单列；逐步加宽窗口，在 768px、1024px 处分别变为两列、三列。

## 常见误区

- 以为 `md:` 只在"中等屏幕"生效——它其实是"≥768px 一直生效"，直到被更大断点覆盖。
- 反过来写（`lg:grid-cols-1 md:grid-cols-2`）会出问题：大屏的 `lg` 规则必须放在更后面的断点，否则被 `md` 覆盖（断点从小到大书写最稳妥）。
