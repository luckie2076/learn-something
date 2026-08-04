# 单元 6 · 状态变体（hover / focus / group / peer）

## 学习目标

用状态变体让样式随交互变化，理解 `group` / `peer` 的"状态共享"机制。

## 你将看到

- 按钮 `hover:` 变色、`focus:` 显示 `ring`
- 父元素 `group`，子元素 `group-hover:` 在父级悬停时变化
- 前一个输入框 `peer`，后续元素用 `peer-focus:` 受其聚焦状态影响

## 核心原理（为什么 / 机制）

- **变体前缀编译为真实 CSS 选择器**：`hover:bg-red-600` 最终变成 `.hover\:bg-red-600:hover { background-color: ... }`，完全是原生 CSS，无 JS 参与。
- **`group` —— 状态向下共享**：给父元素加 `group`，子元素用 `group-hover:*` 表示"当父级处于 hover 时我才变化"。编译为 `.group:hover .group-hover\:x { ... }`（后代选择器）。
- **`peer` —— 状态横向共享**：给"前一个兄弟"加 `peer`，后面的元素用 `peer-focus:*` 表示"当该兄弟处于 focus 时我变化"。编译为 `.peer:focus ~ .peer-focus\:x { ... }`（通用兄弟选择器 `~`）。
- 这套机制让"一个元素的状态影响其他元素"在纯 CSS 下成为可能，无需写事件处理逻辑。

## 关键代码思路

```tsx
<button className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300">
  悬停/聚焦看变化
</button>

<div className="group p-4">
  <p className="group-hover:text-red-500">父级悬停时我变红</p>
</div>

<input className="peer ..." />
<p className="peer-focus:text-green-600">输入框聚焦时我变绿</p>
```

## 如何运行校验

在本单元目录下 `pnpm install && pnpm dev`，悬停按钮变色、聚焦出现光环；悬停父容器子文本变红；聚焦输入框后续文本变绿。

## 常见误区

- 以为 `peer` 能影响前面的元素——`~` 只能选"后面的兄弟"，顺序不能反。
- 在 `group` 里忘记给父级加 `group`、或把 `group-hover` 用在非后代元素上。
