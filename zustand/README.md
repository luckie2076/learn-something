# Zustand 5 渐进式学习 · 从入门到进阶

> 教学导向：概念 + 最小代码，重点讲「为什么」。
> Zustand 是一个轻量级、高性能的 React 状态管理库，API 极简、零样板代码。

## 项目结构

每个教学单元放在独立的顶层目录，都是一个完整、可独立运行的 Vite + React 19 + TypeScript + Tailwind CSS 项目：

- 单元之间**代码互不引用、互不依赖**。
- 学习**渐进式**：概念上一个单元建立在上一个之上，但代码各自独立、可单独运行。
- 每个单元目录内有自己的 `README.md`（讲「为什么」）和 `src/`（每小节一个文件，由 `App.tsx` 聚合展示）。

为什么这样组织：

1. **互不依赖**：每个单元只依赖自己目录内的文件，不会因为改了别的单元而报错。
2. **隔离且易回看**：复习或重跑任意单元，进入该目录 `pnpm install && pnpm dev` 即可。
3. **磁盘不翻倍**：pnpm 通过全局存储 + 硬链接复用依赖，不会真的复制多份 `node_modules`。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Zustand | ^5.0 | 状态管理 |
| React | ^19.2 | UI 框架 |
| TypeScript | ~5.8 | 类型系统 |
| Tailwind CSS | ^4.3 | 原子化样式 |
| Vite | ^8.1 | 构建工具 |

## 目录结构

```
zustand/
├── README.md                   # 本文件：总说明 + 学习路线图
├── 01-create-store/            # 创建 Store
├── 02-selector-pattern/        # 选择器与性能
├── 03-updating-state/          # 状态更新进阶
├── 04-async-actions/           # 异步操作
├── 05-slices-pattern/          # Store 拆分模式
├── 06-middleware/              # 中间件
└── 07-outside-react/           # 进阶技巧
```

每个单元目录内部结构相同：

```
01-create-store/
├── package.json
├── vite.config.ts
├── index.html
├── README.md          # 该单元教学说明（讲为什么）
└── src/
    ├── main.tsx       # 固定入口：把 App 挂到 #root
    ├── App.tsx        # 聚合本单元所有小节示例
    ├── index.css      # Tailwind CSS 导入
    └── NN-*.tsx       # 每小节一个最小示例文件
```

## 如何运行某个单元

```
cd 01-create-store
pnpm install
pnpm dev
```

打开终端给出的本地地址即可。

---

## 学习路线图

> 建议按顺序学习。完成一个单元就勾掉对应方框。

### 01 · 创建 Store
- [ ] 1.1 第一个 Store：计数器
- [ ] 1.2 原始值状态的读写
- [ ] 1.3 对象状态的读写
- [ ] 1.4 在 Store 里定义 Action

### 02 · 选择器与性能
- [ ] 2.1 基础 Selector 用法
- [ ] 2.2 Selector 内做派生数据
- [ ] 2.3 useShallow 避免不必要渲染
- [ ] 2.4 渲染次数可视化对比

### 03 · 状态更新进阶
- [ ] 3.1 set() 直接赋值 vs 函数式更新
- [ ] 3.2 嵌套对象/数组的不可变更新
- [ ] 3.3 immer middleware 简化更新

### 04 · 异步操作
- [ ] 4.1 在 Action 中发起异步请求
- [ ] 4.2 loading 与 error 状态管理
- [ ] 4.3 乐观更新模式

### 05 · Store 拆分模式
- [ ] 5.1 单个 Slice 的定义与使用
- [ ] 5.2 多个 Slice 组合成完整 Store
- [ ] 5.3 多个独立 Store 协作

### 06 · 中间件
- [ ] 6.1 devtools：Redux DevTools 调试
- [ ] 6.2 persist：状态持久化到 localStorage

### 07 · 进阶技巧
- [ ] 7.1 在 React 组件外读写 Store
- [ ] 7.2 subscribe 监听状态变化
- [ ] 7.3 状态重置
