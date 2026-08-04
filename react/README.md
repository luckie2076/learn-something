# React 19 渐进式学习 · 与官方教程一一对应

> 教学导向：概念 + 最小代码，重点讲「为什么」。
> 目录与 [React 官方「Learn」教程](https://zh-hans.react.dev/learn/describing-the-ui) 的 4 个大章节**一一对应**，每个大章节一个独立可运行的 Vite + React 19 项目。

## 项目结构

每个大章节放在独立的顶层目录，都是一个完整、可独立运行的 Vite + React 19 项目：

- 章节之间**代码互不引用、互不依赖**。
- 学习**渐进式**：概念上一个章节建立在上一个之上，但代码各自独立、可单独运行。
- 每个章节目录内有自己的 `README.md`（讲「为什么」）和 `src/`（每小节一个文件，由 `App.jsx` 聚合展示）。

为什么这样组织（而不是单一共享项目）：

1. **互不依赖**：每个章节只依赖自己目录内的文件，不会因为改了别的章节而报错。
2. **隔离且易回看**：复习或重跑任意章节，进入该目录 `pnpm install && pnpm dev` 即可。
3. **磁盘不翻倍**：pnpm 通过**全局存储 + 硬链接**复用依赖，不会真的复制多份 `node_modules`。

## 目录结构

```
learn-react/
├── README.md                  # 本文件：总说明 + 学习路线图
├── 01-describing-the-ui/      # 第一章 · 描述 UI（9 小节）
├── 02-adding-interactivity/   # 第二章 · 添加交互（7 小节）
├── 03-managing-state/         # 第三章 · 管理状态（7 小节）
└── 04-escape-hatches/         # 第四章 · 脱围机制（8 小节）
```

每个章节目录内部结构相同：

```
01-describing-the-ui/
├── package.json
├── vite.config.js
├── index.html
├── README.md          # 该章教学说明（讲为什么）
└── src/
    ├── main.jsx       # 固定入口：把 App 挂到 #root
    ├── App.jsx        # 聚合本章所有小节示例
    └── NN-*.jsx       # 每小节一个最小示例文件
```

## 如何运行某个章节

```
cd 01-describing-the-ui
pnpm install
pnpm dev
```

打开终端给出的本地地址即可。`main.jsx` 固定把 `App.jsx` 渲染到 `#root`，你只需关注 `src/` 里的小节示例文件。

## 命名约定

`<章节号>-<主题>/`，例如：

- `01-describing-the-ui` → 第一章 描述 UI
- `02-adding-interactivity` → 第二章 添加交互
- `03-managing-state` → 第三章 管理状态
- `04-escape-hatches` → 第四章 脱围机制

---

## 学习路线图

> 教学顺序严格对应官方教程的 4 个大章节。完成一节就勾掉对应方框。

### 第一章 · 描述 UI（Describing the UI）
- [ ] 1.1 你的第一个组件
- [ ] 1.2 组件的导入与导出
- [ ] 1.3 使用 JSX 书写标签语言
- [ ] 1.4 在 JSX 中通过大括号使用 JavaScript
- [ ] 1.5 将 Props 传递给组件
- [ ] 1.6 条件渲染
- [ ] 1.7 渲染列表
- [ ] 1.8 保持组件纯粹
- [ ] 1.9 将 UI 视为树

### 第二章 · 添加交互（Adding Interactivity）
- [ ] 2.1 响应事件
- [ ] 2.2 State: 组件的记忆
- [ ] 2.3 渲染和提交
- [ ] 2.4 state 如同一张快照
- [ ] 2.5 把一系列 state 更新加入队列
- [ ] 2.6 更新 state 中的对象
- [ ] 2.7 更新 state 中的数组

### 第三章 · 管理状态（Managing State）
- [ ] 3.1 用 State 响应输入
- [ ] 3.2 选择 State 结构
- [ ] 3.3 在组件间共享状态
- [ ] 3.4 对 State 进行保留和重置
- [ ] 3.5 迁移状态逻辑至 Reducer
- [ ] 3.6 使用 Context 深层传递参数
- [ ] 3.7 使用 Reducer 和 Context 拓展你的应用

### 第四章 · 脱围机制（Escape Hatches）
- [ ] 4.1 使用 ref 引用值
- [ ] 4.2 使用 ref 操作 DOM
- [ ] 4.3 使用 Effect 进行同步
- [ ] 4.4 你可能不需要 Effect
- [ ] 4.5 响应式 Effect 的生命周期
- [ ] 4.6 将事件从 Effect 中分开
- [ ] 4.7 移除 Effect 依赖
- [ ] 4.8 使用自定义 Hook 复用逻辑
