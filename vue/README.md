# Vue 3 渐进式学习

一个**渐进式、教学导向**的 Vue 3 自学路线。假设你已掌握前端三件套（HTML/CSS/JS）和前端工程化（npm / 构建工具 / Vite）。

## 如何使用

- 每一阶段是一个独立目录，包含讲解 + 极简代码示例。
- **先理解"为什么"，再记 API**：每个概念都会解释它解决了什么痛点，而不是只列出用法。
- 代码尽量短小，聚焦当前概念。

## 阶段路线图

| 阶段 | 目录 | 内容 | 顺带讲的原理 |
|------|------|------|-------------|
| 0 | [stage-0-why-framework](./stage-0-why-framework/README.md) | 为什么需要框架（原生 JS vs Vue） | 声明式 / 响应式 / 组件化 |
| 1 | [stage-1-core](./stage-1-core/README.md) | 响应式 + 模板语法（含可运行骨架） | Proxy 响应式原理 |
| 2 | [stage-2-components](./stage-2-components/README.md) | 组件、props / emit / slot | 组件编译后是什么 |
| 3 | [stage-3-composition-api](./stage-3-composition-api/README.md) | `<script setup>`、生命周期、组合函数 | 为什么从选项式走到组合式 |
| 4 | [stage-4-ecosystem](./stage-4-ecosystem/README.md) | vue-router、pinia、SFC | `.vue` 如何被编译成三件套 |
| 5 | [stage-5-advanced](./stage-5-advanced/README.md) | 异步、小项目、虚拟 DOM/Diff | 全景观串讲 |

## 快速开始

```bash
cd stage-1-core
pnpm install
pnpm dev
```

> 前置要求：Node ≥ 20.19 或 ≥ 22.12，先 `node -v` 确认。

## 一句话读懂 Vue

Vue 没有脱离三件套：构建时把模板编译成 JS、把样式编译成 CSS；运行时用原生 JS 的 `Proxy` 管理状态，再用原生 DOM API 驱动真实页面。框架 = "编译 + 运行时"的一层封装，底层始终是你已掌握的三件套。

建议顺序：0 → 1（动手跑通）→ 2 → 3 → 4 → 5。
