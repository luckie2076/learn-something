# 单元 2 · 原子类思维

## 学习目标

理解 Tailwind 的 **utility-first（工具类优先）** 理念，以及它相对于传统手写 CSS 的取舍。

## 你将看到

- 页面上两个外观完全一致的蓝色按钮：一个用一排原子类拼出，另一个用 `src/styles.css` 里的一个手写类 `.btn` 实现
- 等价的手写 CSS 见下方「关键代码思路」（教学内容都集中在这里，组件代码只做演示）

## 核心原理（为什么 / 机制）

- **原子类 = 单一职责的最小样式单元**：`.flex` 就是 `display:flex`，`.p-4` 就是 `padding:1rem`。把样式拆到最细，再用组合拼出 UI。
- **Tailwind 不是框架，而是"按需生成的原子类库"**：最终产物仍是普通 CSS，只是类名由构建工具按需产出。
- **为什么好用**：
  - 样式"就近"写在标签上，无需在 HTML 与 CSS 文件间来回跳转；
  - 没有"起名焦虑"（不用纠结 `.card-title` 还是 `.post-header`）；
  - 没有样式冲突——所有类都是 utility，不互相层叠覆盖。
- **代价（要心里有数）**：HTML 看起来更长、初学不直观；过度使用会牺牲可读性，此时应回到"组件层复用"（见单元 9）。

## 关键代码思路

```tsx
// 原子类写法
<button className="px-4 py-2 rounded bg-blue-600 text-white">按钮</button>

/* 等价的手写 CSS
.btn { padding: 0.5rem 1rem; border-radius: 0.25rem;
       background: #2563eb; color: #fff; }
*/
```

## 如何运行校验

在本单元目录下 `pnpm install && pnpm dev`，页面上两种写法渲染出的按钮外观一致，直观对比"组合"与"自定义类"的差异。

## 常见误区

- 认为 Tailwind 会污染全局——其实它生成的都是带语义前缀的普通类，作用域靠组合而非嵌套。
- 一上来就 `@apply` 把原子类塞回自定义类（见单元 9），反而丢掉了 utility-first 的优势。
