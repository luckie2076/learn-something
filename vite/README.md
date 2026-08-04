# Learn Vite Plugin（Vite 插件学习项目）

一个以**教学为导向**的 Vite 插件学习项目，帮助你从零理解「Vite 插件是什么、和 Rollup 插件什么关系、怎么写出自己的第一个插件」。

## 项目目的

通过一组**循序渐进、互相隔离**的教学单元，带你掌握 Vite 插件开发的核心概念，并最终完成一个小型实战插件（Markdown → JS 模块）。

## 环境与约定

- 构建工具：**Vite 8**（底层打包器 Rolldown，API 与 Rollup 高度兼容）
- 语言/技术：`html` + `css` + `js`
- 包管理：**pnpm**
- 版本哲学：基于最新库与最新文档，安装或查阅前先确认最新版本
- 代码风格：极简、仅用于演示，避免引入非必要的复杂内容
- 语言：中文

## 单元导览

每个单元都是一个**完全独立**的目录（拥有自己的 `package.json` 与运行环境，互不影响），教学内容都放在各自单元的 `README.md` 里。

| 单元 | 主题 | 你将学到 |
| --- | --- | --- |
| `01-plugin-eco` | 认识插件生态 | Vite 插件与 Rollup 插件的关系、最小插件结构、生命周期钩子 |
| `02-virtual-module` | 虚拟模块 | 用 `resolveId` + `load` 凭空造一个「不存在于磁盘的模块」 |
| `03-transform` | transform 钩子 | 拦截并编译源码（玩具语言 → JS），理解 `transform` 的职责 |
| `04-server-html` | 开发服务器与 HTML | `configureServer` 中间件、`transformIndexHtml` 注入页面 |
| `05-md-to-js` | 实战：Markdown → JS 模块 | 综合运用标准钩子，写一个把 `.md` 编译成 JS 模块的插件 |

建议从 `01` 开始顺序学习，每个单元先读 `README.md`，再读 `vite.config.js` 与 `index.html`。

## 如何运行任意一个单元

进入对应单元目录，安装依赖后按需运行：

```bash
cd 01-plugin-eco
pnpm install
pnpm dev      # 开发模式，观察终端/页面输出
pnpm build    # 生产构建，对比钩子行为差异
```

> 各单元之间互不影响，可以放心地单独 `pnpm install` 与 `pnpm build`。

## 学习路径小结

Vite 插件本质上是 **Rollup/Rolldown 插件接口的「超集」**：大量 Rollup 插件可直接当 Vite 插件用，Vite 额外提供了 `config`、`configureServer`、`transformIndexHtml`、`handleHotUpdate` 等特有钩子。学完本项目的 5 个单元，你将具备编写基础 Vite 插件的能力。

## 目录结构

```
learn-vite/
├── 01-plugin-eco/        教学单元 01
├── 02-virtual-module/    教学单元 02
├── 03-transform/         教学单元 03
├── 04-server-html/       教学单元 04
├── 05-md-to-js/          教学单元 05（实战）
├── AGENTS.md             项目指引（AI 用）
└── README.md             本文件
```
