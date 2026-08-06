# 单元 07 · 路由保护

## 运行

```bash
pnpm install
pnpm dev
```

分别测试未登录和登录后访问受保护页面的行为。

## 现象

### 场景 1：未登录访问受保护页面
- 点击"控制台 🔒"→ URL 自动变为 `/login`，控制台页面不渲染
- 说明 ProtectedRoute 守卫成功拦截了未登录请求
- 登录页显示 `重定向来源：/dashboard`（state 传递的 `from` 信息）

### 场景 2：登录后访问受保护页面
- 在 `/login` 点击"模拟登录"
- 点击"前往 /dashboard →"→ 成功进入控制台
- 控制台和管理后台都可以正常访问了
- 点击"退出登录"后再次访问控制台 → 又被重定向到登录页

## 原理

### ProtectedRoute 守卫组件

```tsx
function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation()

  if (!isLoggedIn) {
    // 未登录：重定向到登录页，并记住当前路径
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // 已登录：正常渲染子组件
  return <>{children}</>
}
```

在工作原理上，ProtectedRoute 就是一个**条件渲染组件**：
1. 检查认证状态
2. 未通过 → 渲染 `<Navigate>`（触发重定向）
3. 通过 → 渲染 `children`（业务页面）

### 如何应用到路由

```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

将需要保护的页面组件包裹在 `<ProtectedRoute>` 中即可。

### 登录后跳回原页面

```
1. 用户访问 /admin（未登录）
2. Navigate to="/login" state={{ from: "/admin" }}
3. 用户在 /login 页面登录
4. navigate("/admin")  // 跳回原始目标
```

`state.from` 这种模式让登录流程对用户无损 —— 不会丢失用户原本想去的地方。

## 为什么这样设计

1. **声明式守卫**：路由定义本身描述了权限要求，可读性强
2. **组件模式复用**：ProtectedRoute 可以包裹任何需要认证的页面，不需要在每个页面里写认证逻辑
3. **实际项目扩展**：可以进一步封装为 `<ProtectedRoute requiredRole="admin">` 等带角色检查的守卫
