# 单元 8 · 深色模式

## 学习目标

用 `@custom-variant` 实现可手动切换的深色模式，理解 `dark:` 前缀的绑定机制。

## 你将看到

- 用 `dark:` 前缀为明暗两套样式分别设值
- 切换 `html` 上的 `.dark` 类，整页明暗随之变化

## 核心原理（为什么 / 机制）

- **v4 默认 `dark` 跟随系统**：`dark:` 前缀默认基于 `prefers-color-scheme` 媒体查询（即随操作系统切换）。
- **要"手动切换"，需重新绑定 `dark`**：在 `@theme` 之外声明
  ```css
  @custom-variant dark (&:where(.dark, .dark *));
  ```
  这把 `dark:` 的含义从"系统偏好"改为"祖先带 `.dark` 类时生效"。此后只要在 `<html>` 或某父元素上加 `.dark`，其内所有 `dark:*` 样式就会被激活。
- **编译产物**：`dark:bg-slate-800` 大致变成 `.dark .dark\:bg-slate-800:where(.dark,.dark *){ background:... }`，即依赖 `.dark` 类存在。
- 配合单元 7 的 `@theme` 变量，可实现整站主题切换与运行时换肤。

## 关键代码思路

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

```tsx
<div className="bg-white text-black dark:bg-slate-900 dark:text-white">
  明暗两套配色
</div>
```

```ts
// 切换：在 <html> 上 toggle 'dark' 类
document.documentElement.classList.toggle('dark')
```

## 如何运行校验

在本单元目录下 `pnpm install && pnpm dev`，页面提供一个开关，点击后在明暗配色间切换，验证 `dark:` 绑定到 `.dark` 类生效。

## 常见误区

- 想手动切换却没写 `@custom-variant`——默认 `dark:` 只跟系统，不会响应手动加的 `.dark` 类。
- 把 `.dark` 加在普通 `div` 却期望整页变——应确保加在最外层（通常是 `<html>`），否则其外部区域不受影响。
