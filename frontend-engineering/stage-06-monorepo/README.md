# 阶段六：脚手架 / 组件库 / Monorepo

> 目标：从「写业务项目」升级到「造可复用的工程资产」。

本阶段讲三件相关但不同的事，各自独立成目录、内部带领域知识 README：

| 主题 | 目录 | 状态 | 一句话 |
|---|---|---|---|
| 脚手架（CLI） | [`scaffold/`](./scaffold/README.md) | ✅ 可运行示例 | 把团队规范产品化，一条命令生成标准项目 |
| Monorepo | （讲解） | 📖 | 多包同仓，共享依赖、原子提交、一处改动联动所有包 |
| 组件库 | （讲解） | 📖 | 把 UI 抽成可复用、按需加载、带文档的包 |

---

## 脚手架（概念速览）

每个新项目都要重复配 TS、ESLint、Vite、目录结构……脚手架把这些**一次性固化成模板**，
一条命令生成标准项目，避免「十个项目十种配置」的混乱。本质是**把团队的工程规范产品化**。

```bash
# 设想：一行生成标准项目
pnpm create my-cli my-app
```

具体可运行示例与代码讲解见 [`scaffold/`](./scaffold/README.md)。

## Monorepo（概念速览）

当公司有「组件库 + 多个业务项目 + 工具包」时，各自独立仓库会导致：
版本不同步、改一个底层包要跨仓库发版、复用困难。

Monorepo 把**多个相关包放在同一个仓库**统一管理，共享依赖、原子提交、一处改动联动所有包。
- **pnpm workspace**：用 `pnpm-workspace.yaml` 声明哪些目录是子包，依赖自动提升、省磁盘。
- **Turborepo**：给任务（build / test / lint）做**缓存与并行编排**，只重跑受影响的部分。

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
```

动手建议：用 pnpm workspace 建两个包 `utils` 和 `app`，让 `app` 直接依赖本地 `utils`（`"utils": "workspace:*"`），
体验「改 utils 实时反映到 app」的 Monorepo 协作。

## 组件库（概念速览）
- 用 Rollup / Vite 库模式打包，输出 ESM + CJS + 类型声明。
- **按需加载**：让用户 `import { Button } from 'my-ui'` 时只打包用到的组件（tree-shaking 友好）。
- 文档站：Storybook（交互式组件预览）或 dumi（文档即代码）。
