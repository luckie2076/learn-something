# 单元 10 · 过渡与动画

## 学习目标

用 `transition` / `animate` 实现平滑交互，并学会在 v4 中自定义动画。

## 你将看到

- `transition` 让按钮 hover 变色平滑过渡（而非瞬间跳变）
- `animate-pulse` 等预置动画循环播放
- 自定义 `@keyframes` + `@theme --animate-*` 生成专属动画类

## 核心原理（为什么 / 机制）

- **`transition-*` 映射到原生过渡属性**：`transition-colors` → `transition-property: color, background-color...`；配合 `duration-150` / `ease-out` 控制时长与缓动。默认 `duration-150` 即可获得顺滑反馈。
- **`animate-*` 预置常用动画**：如 `pulse`、`spin`、`bounce`，底层是 `@keyframes`。
- **v4 自定义动画**：在 `@theme` 声明 `--animate-wiggle: wiggle 1s ease-in-out infinite;`，并写对应的 `@keyframes wiggle { ... }`，即可使用 `animate-wiggle`。主题变量再次发挥作用（见单元 7）。
- **性能要点**：动画尽量作用于 `transform` 与 `opacity`——这两个属性可由 GPU 合成，不触发重排/重绘，流畅且省电；避免动画 `width`/`top` 等会触发布局的属性。

## 关键代码思路

```css
@theme {
  --animate-wiggle: wiggle 1s ease-in-out infinite;
}
@keyframes wiggle {
  0%,100% { transform: rotate(-3deg); }
  50%     { transform: rotate(3deg); }
}
```

```tsx
<button className="bg-blue-600 text-white px-4 py-2 rounded transition-colors hover:bg-blue-700">
  平滑变色
</button>
<span className="animate-pulse">加载中…</span>
<div className="animate-wiggle">摇一摇</div>
```

## 如何运行校验

在本单元目录下 `pnpm install && pnpm dev`，hover 按钮颜色平滑过渡；"加载中"循环闪烁；自定义元素持续摇摆。

## 常见误区

- 只写 `hover:bg-x` 却没加 `transition-*`，结果是"瞬间跳变"而非过渡——过渡需要显式声明。
- 对 `width`/`margin` 等做循环动画导致卡顿——优先 `transform`/`opacity`。
