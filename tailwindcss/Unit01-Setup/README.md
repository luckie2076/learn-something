# 单元 1 · 环境搭建与原理

## 学习目标

从零用 Vite 插件接入 Tailwind CSS v4，并理解它"为什么几乎零配置就能工作"。

## 你将看到

- `vite.config.ts` 中引入 `@tailwindcss/vite` 并加入 plugins
- `src/styles.css` 顶部只需一行 `@import "tailwindcss";`
- 一个带几个工具类的 `div`，样式立即生效

## 核心原理（为什么 / 机制）

- **全新引擎**：Tailwind v4 用 Rust 编写的新引擎，通过 Vite 插件在**构建时**扫描你的源码（`.tsx` / `.css` 等）里**实际出现**的类名，只生成被用到的 CSS。这就是 JIT（Just-In-Time）——产物极小，且**不再需要 `content` 配置**（v3 必须手动声明要扫描哪些文件）。
- **`@import "tailwindcss"` 做了什么**：它等价于 v3 的 `@tailwind base; @tailwind components; @tailwind utilities;`，但被封装成一条 CSS 导入，自动注入三层样式（基础重置 / 组件层 / 工具类层）。
- **没有 `tailwind.config.js` 也能跑**：v4 默认主题内置，配置改为用 CSS 的 `@theme` 声明（见单元 7）。只有需要 JS 插件或特殊定制时才写配置文件。

## 关键代码思路

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [react(), tailwindcss()] })
```

```css
/* src/styles.css */
@import "tailwindcss";
```

## 如何运行校验

在本单元目录下：

```bash
pnpm install   # 或根目录一次 pnpm install 即可
pnpm dev
```

打开页面应看到一个带内边距、背景色、圆角的盒子；修改任意类名，HMR 即时生效，证明扫描与生成是实时的。

## 常见误区

- 以为还要写 `content` 路径配置（v4 自动检测，无需）。
- 以为还要写 `@tailwind base/components/utilities`（v4 改用 `@import "tailwindcss"`）。
- 把 `@import "tailwindcss"` 放在其他自定义样式之后——它应位于 CSS 文件顶部，确保层序正确。
