# 单元 01 · 从零初始化项目

> 本单元目标：不带任何脚手架预设，手动搭出一个 **Vite + React 19 + TypeScript + Tailwind CSS v4** 的最小工程，并理解每一项配置「为什么存在」。

---

## 现象

运行 `pnpm dev` 后，浏览器打开一个页面：标题、灰底卡片、阴影都正常显示。说明 React 已渲染、Tailwind 工具类已生效。但工程里**没有任何 `tailwind.config.js`、`postcss.config.js`**，也没有手写 CSS 规则。

---

## 原理

### 1. 为什么选 Vite
Vite 用原生 ES 模块做开发服务器（按需编译，冷启动极快），生产构建用 Rollup。相比 Webpack，它没有「打包所有模块再启动」的等待，非常适合教学场景里的快速验证。

### 2. React 19 + TypeScript
React 19 默认支持 `react-jsx` 自动运行时，写组件不再需要 `import React`。TypeScript 开启 `strict` 与 `verbatimModuleSyntax`，能在编译期挡住大量低级错误，也是现代 React 项目的共识配置。

### 3. Tailwind CSS v4 的「CSS-first」
这是本单元最关键的变化。**v4 不再需要 `tailwind.config.js` 和 PostCSS 配置**：

- 只要在主 CSS 里写一行 `@import "tailwindcss";`，Tailwind 就接管了样式生成。
- 通过官方的 `@tailwindcss/vite` 插件，Vite 在构建时自动扫描 `className` 并生成对应 CSS（零运行时、按需产出）。

旧版 v3 需要在 `tailwind.config.js` 里配置 `content`、`theme`，再用 PostCSS 串联——v4 把这些收敛进了 CSS 与插件，更简洁。

### 4. 路径别名 `@`
`vite.config.ts` 里把 `@` 指向 `./src`，`tsconfig.json` 的 `paths` 做同样的映射。这样组件里可以写 `import { cn } from "@/lib/utils"` 而不用 `../../../lib/utils`。**两套映射必须同时存在**：Vite 负责运行时的真实路径解析，TS 负责类型检查时的路径解析。

---

## 代码

关键文件（已在本单元目录中，可逐个打开对照）：

- `vite.config.ts` — 接入 `react()` 与 `tailwindcss()` 插件，并声明 `@` 别名
- `tsconfig.json` — 严格 TS + `@/*` 路径映射
- `index.html` — Vite 入口，`<div id="root">` + `main.tsx`
- `src/main.tsx` — `createRoot` 挂载 React 19 应用
- `src/index.css` — 仅一行 `@import "tailwindcss";`
- `src/App.tsx` — 演示页面，纯 Tailwind 工具类

每个单元的 `package.json` 都把依赖钉死为**精确版本号**（如 `"react": "19.2.8"`），因此单元之间不共享任何 `node_modules`；复制出去也能独立运行，满足「完全互相隔离」。所有单元均以 `unit-01-project-init` 作为复制基准（基础脚手架见任意单元），版本天然一致。

---

## 为什么这样设计（教学要点）

1. **隔离**：本单元也是后续所有单元的复制基准（新单元直接由此复制）。每个单元都是独立可运行的 Vite 工程，复制出去也能跑，满足「完全互相隔离」。
2. **最少配置**：只保留「能让页面跑起来并验证 Tailwind」的最小文件，避免一上来就堆砌无关内容。
3. **先懂前置**：shadcn/ui 本质是「基于 Tailwind + Radix 的代码片段集合」，所以必须先确认 Tailwind v4 与路径别名这套底座是通的，下一单元才能真正讲清 shadcn 的「复制而非安装」机制。

---

> 下一单元（02）将在此基础上接入 shadcn/ui CLI，并解释它的设计哲学与 `components.json` 配置。
