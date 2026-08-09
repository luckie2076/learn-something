# 单元 06 · 编程式导航

上一单元：[查询参数](../unit-05-search-params/README.md) | 下一单元：[路由保护](../unit-07-route-guard/README.md)

## 运行

```bash
pnpm install
pnpm dev
```

分别在三个场景体验编程式导航和重定向。

## 现象

### 场景 1：useNavigate 跳转
- 访问 `/login`，输入用户名点击登录
- 自动跳转到 `/dashboard`，页面上显示欢迎消息（来自 `navigate` 的 `state` 参数）
- **注意**：URL 中是 `/dashboard`，欢迎消息不显示在 URL 中
- **刷新**页面 → 欢迎消息消失（state 数据丢失）

### 场景 2：Navigate 组件重定向
- 访问 `/old-dashboard`
- 自动跳转到 `/dashboard`（URL 变为 `/dashboard`）
- 点击浏览器**后退** → 回到 `/old-dashboard` 之前的那一页（因为用了 `replace`，`/old-dashboard` 不进入历史记录）

### 场景 3：useNavigate 返回
- 在 Dashboard 页点击 "useNavigate 返回首页" 按钮
- 调用 `navigate("/")` 跳回首页

## 原理

### useNavigate —— 函数式跳转

```tsx
const navigate = useNavigate()

// 基础跳转
navigate("/dashboard")

// 带 state 跳转
navigate("/dashboard", { state: { username: "张三" } })

// replace 模式（替换历史记录）
navigate("/welcome", { replace: true })

// 前进/后退
navigate(-1)   // 后退
navigate(1)    // 前进
```

`useNavigate` 返回一个函数，在任何需要跳转的地方调用它。最常见的场景：
- 表单提交成功后跳转
- 登录成功后跳转
- 按钮点击后跳转

### `<Navigate>` 组件 —— 声明式重定向

```tsx
<Route path="/old-dashboard" element={<Navigate to="/dashboard" replace />} />
```

在组件渲染时触发重定向。适合"这个 URL 不应该渲染任何内容，应该直接跳走"的场景。

### `state` 参数 —— 不污染 URL 的数据传递

| 传递方式 | URL 中可见 | 刷新后保留 | 适用场景 |
|----------|-----------|-----------|---------|
| 路径参数 `:id` | 是 | 是 | 资源标识 |
| 查询参数 `?key=value` | 是 | 是 | 筛选/分页 |
| state 参数 | 否 | 否 | 临时数据（表单结果等） |

### `useLocation` —— 读取当前路由信息

```tsx
const location = useLocation()
// location.pathname = "/dashboard"
// location.search   = "?page=1"
// location.state    = { username: "张三" }  (来自 navigate 传递的 state)
```

## 为什么这样设计

1. **useNavigate 与 Navigate 各司其职**：事件驱动用 Hook，条件判断用组件，覆盖了所有导航场景
2. **state 不走 URL**：适合敏感或临时数据（如表单提交的反馈消息），不暴露在地址栏
3. **replace 避免"垃圾"历史记录**：登录页、重定向中间页不应留在浏览器历史中
