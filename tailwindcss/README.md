# Learn Tailwind CSS

一个**教学导向**的 Tailwind CSS v4 学习项目：每个单元是仓库根目录下**独立、完整的可运行项目**，可单独打开校验，单元之间代码零耦合、互不影响。讲解不只"怎么做"，更讲"为什么"与"底层机制"，代码保持极简。

## 技术环境（每个单元自带）

- **构建工具**：Vite（最新）
- **框架**：React 19 + TypeScript
- **样式**：Tailwind CSS v4（CSS-first 配置，无需 `tailwind.config.js`）
- **包管理**：pnpm（每个单元各自独立安装、独立运行）

## 教学理念

1. **教学导向**：每个单元把"概念演示"与"原理讲解"放在一起，先看到效果，再理解机制。
2. **单元独立**：每个单元是根目录下的一个独立子项目（`Unit01-Setup/` … `Unit10-Animation/`），自带 `package.json` / `vite.config.ts` / `tsconfig.json` / `src/`，可被单独 `cd` 进去运行，互不干扰。
3. **极简代码**：每个单元只写说明概念所必需的最小演示，无共享导航/壳层。
4. **面向最新**：基于 Tailwind CSS v4 的最新文档与用法，避免过时内容。

## 单元导航

| # | 单元目录 | 主题 | 关键概念 |
|---|----------|------|----------|
| 1 | [Unit01-Setup](Unit01-Setup/README.md) | 从零接入 Tailwind v4 | Vite 插件、JIT 扫描、`@import` |
| 2 | [Unit02-UtilityFirst](Unit02-UtilityFirst/README.md) | utility-first 理念 | 原子类 vs 手写 CSS |
| 3 | [Unit03-Layout](Unit03-Layout/README.md) | flex / grid / spacing | 4px 间距刻度、gap |
| 4 | [Unit04-Typography](Unit04-Typography/README.md) | 字体、颜色、圆角、阴影 | 设计令牌、调色板档位 |
| 5 | [Unit05-Responsive](Unit05-Responsive/README.md) | mobile-first 断点 | `sm:`/`md:`/`lg:` 叠加逻辑 |
| 6 | [Unit06-Variants](Unit06-Variants/README.md) | hover / focus / group / peer | 变体编译为真实选择器 |
| 7 | [Unit07-Theme](Unit07-Theme/README.md) | `@theme` 自定义令牌 | CSS 变量联动工具类 |
| 8 | [Unit08-DarkMode](Unit08-DarkMode/README.md) | 明暗切换 | `@custom-variant dark` |
| 9 | [Unit09-Reuse](Unit09-Reuse/README.md) | `@apply` / `@layer` / 组件化 | 何时复用、何时保持原子 |
| 10 | [Unit10-Animation](Unit10-Animation/README.md) | transition / animate / keyframes | GPU 友好的动画 |

## 运行方式

每个单元是**完全独立的项目**，自带全部依赖，**没有共享的 workspace、根 `node_modules` 或根 `package.json`**。进入某个单元目录独立安装即可：

```bash
cd Unit01-Setup
pnpm install     # 仅安装当前单元的依赖
pnpm dev         # 启动该单元的本地预览
```

打开本地地址即可看到该单元的演示。每个单元都可独立 `pnpm build` 校验类型与产物，互不影响。

## 项目结构

```
learn-tailwindcss/
├─ README.md                  # 本文件（顶层说明）
├─ Unit01-Setup/              # 单元 1：完整可运行项目（独立依赖）
│  ├─ package.json
│  ├─ vite.config.ts          # 接入 @tailwindcss/vite
│  ├─ tsconfig.json
│  ├─ index.html
│  ├─ README.md               # 该单元讲解
│  └─ src/
│     ├─ main.tsx             # 入口：渲染 App + import './styles.css'
│     ├─ App.tsx              # 该单元的极简演示
│     ├─ styles.css           # @import "tailwindcss"（+ 单元特有的 @theme 等）
│     ├─ CodeBlock.tsx        # 该单元自带的代码展示组件
│     └─ vite-env.d.ts
├─ Unit02-UtilityFirst/       # 单元 2 ……（结构同上）
├─ ...（至 Unit10-Animation）
```

> 每个单元目录下的 `README.md` 讲解该单元的目标、演示要点、核心原理与校验方式；`src/App.tsx` 为对应的极简可运行演示。单元之间不共享代码，改一个单元不会影响其他单元。
