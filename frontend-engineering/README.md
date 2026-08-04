# 前端工程化 · 渐进式学习仓库

> 教学导向：本仓库每一阶段都优先解释 **为什么**，再给 **怎么做**；示例代码尽量极简，跑通即可，不堆功能。

## 这是什么

在掌握 HTML + CSS + JS 之后，"前端工程化"是一套让代码**可协作、可维护、可上线**的方法与工具链。
它不是某个框架，而是一组围绕"开发 → 规范 → 构建 → 测试 → 发布"的实践活动。

## 学习路线（7 个阶段）

| 阶段 | 主题 | 目录 | 状态 |
|------|------|------|------|
| 1 | 工程化基石：包管理 & 模块化 | [`stage-01-basics/`](./stage-01-basics/README.md) | ✅ 可运行示例 |
| 2 | 代码质量与开发规范（JS 处理） | [`stage-02-quality/`](./stage-02-quality/README.md) | 📖 讲解 + 配置示例 |
| 3 | 样式工程化（CSS 预处理/后处理） | [`stage-03-styling/`](./stage-03-styling/README.md) | ✅ 可运行示例 |
| 4 | 构建与打包工具（结合 JS+CSS） | [`stage-04-build/`](./stage-04-build/README.md) | ✅ 可运行示例 |
| 5 | 自动化测试 | [`stage-05-test/`](./stage-05-test/README.md) | ✅ 可运行示例 |
| 6 | 脚手架 / 组件库 / Monorepo | [`stage-06-monorepo/`](./stage-06-monorepo/README.md) | ✅ 脚手架可运行 + 📖 讲解 |
| 7 | CI/CD 与部署 | [`stage-07-cicd/`](./stage-07-cicd/README.md) | 📖 讲解 |
| 8 | 进阶架构（微前端 / 性能工程） | [`stage-08-advanced/`](./stage-08-advanced/README.md) | 📖 讲解 |

> 标注 ✅ 的目录包含可直接 `pnpm install` 后运行的代码（多为 `pnpm start` 或 `pnpm test`）；📖 为讲解为主，含关键配置文件片段。

## 建议的学习方式

1. 按顺序走，不要跳。阶段 1~4 是地基。
2. **每一个示例都动手跑一遍**，改一改观察结果，比读十遍有用。
3. 遇到"为什么"没讲清的地方，优先去查官方文档再回来。

## 环境准备

- Node.js ≥ 20（推荐 20.19+ / 22.12+；Vite 8 已弃用 Node 18）
- 包管理器：本仓库统一用 **pnpm**（更快、更省磁盘、依赖隔离更严格）
  ```bash
  npm install -g pnpm
  ```

下一步：进入 `stage-01-basics/` 从"为什么需要包管理"开始。
