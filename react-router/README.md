# React Router 教学课程

基于 React Router v8 的完整教学系列，涵盖从路由基础到高级模式的所有核心知识。

## 技术栈

- React 19 + TypeScript
- React Router v8.3
- Vite + Tailwind CSS
- 每个教学单元独立可运行

## 设计原则

1. **渐进式学习** —— 从概念到实践，每个单元专注一个主题
2. **完全隔离** —— 每个单元是独立的 Vite 项目，互不依赖
3. **极简代码** —— 只保留教学必需的代码，零冗余
4. **中文教学** —— 所有注释和文档使用中文

## 课程大纲

| 单元 | 主题 | 核心 API | 你将学会 |
|------|------|----------|----------|
| [01](./unit-01-project-init/) | 路由基础 | `BrowserRouter` `Routes` `Route` `Link` | SPA 中 URL 与组件的映射机制 |
| [02](./unit-02-link-navigation/) | 导航组件 | `NavLink` `end` | 导航高亮的声明式实现 |
| [03](./unit-03-dynamic-params/) | 动态路由 | `useParams` `:id` | 同一组件渲染不同资源（URL 即状态） |
| [04](./unit-04-nested-layout/) | 嵌套路由 | `Outlet` `index` route | 布局复用、子路由共享父级 UI |
| [05](./unit-05-search-params/) | 查询参数 | `useSearchParams` `URLSearchParams` | URL 中管理分页、排序、筛选状态 |
| [06](./unit-06-programmatic-nav/) | 编程式导航 | `useNavigate` `<Navigate>` `useLocation` `state` | 事件驱动跳转、重定向、状态传递 |
| [07](./unit-07-route-guard/) | 路由保护 | `ProtectedRoute` 守卫模式 | 认证鉴权、未登录拦截、登录后回跳 |
| [08](./unit-08-error-handling/) | 错误处理 | `path="*"` `errorElement` `useRouteError` | 404 页面与运行时错误的友好降级 |

## 快速开始

```bash
# 进入任意单元目录
cd unit-01-project-init

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

每个单元启动后访问终端提示的本地地址（通常是 `http://localhost:5173`）。

## 核心原理

React Router 基于 **History API + React Context** 构建了三层架构：

```
BrowserRouter（监听层）
  └─ pushState / popstate 监听 URL 变化
  └─ 通过 Context 下发 location + navigate
     │
Routes（匹配层）
  └─ 读取 Context 中的 location
  └─ 遍历子 Route，matchPath 匹配
  └─ 渲染第一个匹配的 element
     │
Route / Link / NavLink（渲染层 & 导航层）
  └─ Route：路径 → 组件的映射声明
  └─ Link：拦截 <a> 点击，调用 navigate 无刷新跳转
  └─ NavLink：继承 Link，额外感知 isActive 状态
```

其中 Context 充当"数据中心"，**写**（Link 调用 navigate）和**读**（Routes 读取 location）完全解耦。

## 学习路径建议

1. **Unit 01-02** —— 先理解路由基本概念和导航组件
2. **Unit 03-05** —— 掌握路由参数、布局和查询参数的用法
3. **Unit 06** —— 学习命令式导航，理解声明式 vs 编程式
4. **Unit 07-08** —— 进阶：路由安全和错误处理
