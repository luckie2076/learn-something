# JSX 语法入门

> 学习 React 的前置知识 —— 从零掌握 JSX 语法。
>
> 本科目从「纯 JSX 语法」角度出发，刻意不引入组件化、状态管理等 React 高级概念，
> 聚焦四条主线：标签书写、表达式嵌入、元素嵌套、条件和循环。

## 学习路径

| 章节 | 目录 | 内容 |
|------|------|------|
| 1 | [01-jsx-syntax](./01-jsx-syntax/) | JSX 是什么？标签规则、自闭合、Fragment |
| 2 | [02-expressions](./02-expressions/) | `{}` 嵌入表达式、动态属性、style 对象、className |
| 3 | [03-elements-and-children](./03-elements-and-children/) | 元素嵌套、children 概念、多元素返回与 Fragment 实践 |
| 4 | [04-condition-and-loop](./04-condition-and-loop/) | 三元表达式、&& 短路、map 列表渲染与 key |

每个章节都包含：
- **README.md**：先讲「为什么这样设计」，再展示关键代码片段
- **独立可运行项目**：Vite + React 19，零配置热更新

## 运行方式

```bash
# 1. 在科目根目录安装所有依赖（一次安装，全部单元可用）
cd jsx-basics
pnpm install

# 2. 进入任意单元，独立运行
cd 01-jsx-syntax
pnpm dev
```

## 与 React 科目的关系

建议学习顺序：**JSX 语法 → React 描述 UI → 交互 → 状态管理**。

本科目结束后的知识点都能在 `react/01-describing-the-ui` 中直接使用，
帮助你更顺利地过渡到 React 组件化开发。
