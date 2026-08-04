# 阶段一：工程化基石 —— 包管理与模块化

> 目标：搞清楚"为什么前端不再是双击一个 html 就能跑"，并跑通第一批可运行示例。

本阶段拆成两个**互不依赖**的独立子目录，每个都能单独学习、单独运行：

| 子目录 | 解决什么问题 | 核心内容 |
|--------|--------------|----------|
| [package-management/](./package-management) | 为什么需要包管理器、依赖怎么管 | npm/pnpm、dependencies vs devDependencies、semver、lock |
| [modularization/](./modularization) | 为什么需要模块化、ESM 怎么用 | ESM vs CJS、import / export |

## 学习顺序建议
先 `modularization/`（最基础：把代码拆成模块），再 `package-management/`（引入第三方包）。
理解后回看：二者共同支撑起"可复现、可协作"的工程化地基。

## 下一步
进入 [阶段二：代码质量与开发规范](../stage-02-quality/README.md)。
