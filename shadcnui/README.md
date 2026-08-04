# learn-shadcnui · shadcn/ui 教学仓库

一个以**教学为导向**的 shadcn/ui 学习仓库。所有内容基于最新稳定技术栈：
**Vite 8 · React 19 · TypeScript 7 · Tailwind CSS v4 · shadcn/ui 最新版**。

## 设计理念

- **完全隔离**：每个教学单元是独立的 Vite 工程（`unit-XX-*`），拥有自己的 `package.json`、入口与依赖，**互不引用、互不影响**。可单独 `pnpm install && pnpm dev` 运行，也可整体复制脱离本仓库使用。
- **最新且一致**：所有单元均以 `unit-01-project-init` 作为复制基准（基础脚手架见任意单元），依赖以精确版本号钉死在各自 `package.json` 中，保证版本一致、且单元间零耦合。
- **讲清「为什么」**：每个单元自带中文 `readme.md`，按「现象 → 原理 → 代码 → 为什么」讲解底层机制，而非堆砌代码。

## 模块地图（共 15 单元）

### 模块一 · 环境搭建与机制
| 单元 | 主题 |
| --- | --- |
| 01 | 从零初始化项目（Vite + React 19 + TS + Tailwind v4） |
| 02 | 安装 shadcn/ui 与理解其机制 |
| 03 | Button 与变体系统（cva / asChild） |

### 模块二 · 常用核心组件
| 单元 | 主题 |
| --- | --- |
| 04 | 表单基础 Input / Label / Textarea |
| 05 | Card 与复合组件模式 |
| 06 | Dialog 对话框与可访问性 |
| 07 | Dropdown Menu 下拉菜单 |
| 08 | Select 选择器与表单集成 |
| 09 | 表单校验 Form + react-hook-form + zod |
| 10 | 反馈组件 Sonner / Toast / Alert |
| 11 | 布局型组件 Tabs / Accordion |
| 12 | 数据展示 Table / Avatar / Badge |

### 模块三 · 主题与设计系统
| 单元 | 主题 |
| --- | --- |
| 13 | 设计令牌原理（CSS 变量 / HSL / :root 与 .dark） |
| 14 | 暗色模式切换与持久化 |
| 15 | 品牌主题定制 |

## 如何运行

每个单元是**完全独立**的 Vite 工程，拥有自己的 `package.json` 与依赖，互不共享、互不干扰，也**不依赖根目录**。

```bash
# 进入任意单元，独立安装并运行
cd unit-01-project-init
pnpm install
pnpm dev
```

每个单元也可单独复制出去使用：把 `unit-XX-*` 目录拷到任意位置，`pnpm install && pnpm dev` 即可，不依赖本仓库其他任何内容。
