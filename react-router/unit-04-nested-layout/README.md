# 单元 04 · 嵌套路由

## 运行

```bash
pnpm install
pnpm dev
```

点击"进入管理后台"，观察侧边栏 + 内容区的变化。

## 现象

- 访问 `/dashboard` → 左侧边栏不变，右侧渲染"仪表盘概览"（index route）
- 点击"用户管理"→ URL 变为 `/dashboard/users`，左侧边栏**保持不变**，右侧切换为"用户管理"
- 点击"系统设置"→ 侧边栏仍然不变，内容区再切换
- **布局（侧边栏）写一次，所有子页面复用** —— 这是嵌套路由最大的价值

## 原理

### 路由嵌套结构

```
/dashboard                  → DashboardLayout + <DashboardHome />（index）
  └── /dashboard/users      → DashboardLayout + <UserManagement />
  └── /dashboard/settings   → DashboardLayout + <Settings />
```

对应的代码结构：

```tsx
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<DashboardHome />} />
  <Route path="users" element={<UserManagement />} />
  <Route path="settings" element={<Settings />} />
</Route>
```

### `<Outlet />` —— 子路由插槽

```tsx
function DashboardLayout() {
  return (
    <div>
      <Sidebar />     {/* 固定布局 */}
      <Outlet />       {/* 子路由内容动态替换这里 */}
    </div>
  )
}
```

`<Outlet />` 像一个"孔"，React Router 会把匹配到的子路由组件渲染在这个位置。父布局组件不需要知道子路由是什么，做到了布局与内容的完全解耦。

### Index Route —— 默认子路由

```tsx
<Route index element={<DashboardHome />} />
```

`index` route 没有 `path`，当 URL **精确匹配**父路由路径时（如 `/dashboard`），渲染该组件。它本质上等价于 `path=""`。

### 子路径是相对的

```tsx
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route path="users" element={<UserManagement />} />
</Route>
```

子路由的 `path` 不需要写完整路径，相对父路由即可。React Router 会自动拼接为 `/dashboard/users`。

## 为什么这样设计

1. **布局复用**：侧边栏、顶栏、面包屑等共享 UI 不需要在每个页面重复写
2. **关注点分离**：布局组件只关心布局，页面组件只关心内容
3. **渐进式渲染**：切换子路由时，父布局组件**不会重新挂载**（保持状态），只有 Outlet 的内容更新
