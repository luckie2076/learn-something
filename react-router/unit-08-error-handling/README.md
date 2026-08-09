# 单元 08 · 错误处理

上一单元：[路由保护](../unit-07-route-guard/README.md)

## 运行

```bash
pnpm install
pnpm dev
```

测试三种错误场景。

## 现象

### 场景 1：404 页面未找到
- 访问 `/nothing-here`（或任意不存在的路径如 `/xyz`）
- 显示友好的 404 页面，而非空白页或浏览器默认错误
- 点击"返回首页"回到正常页面
- **注意**：`path="*"` 必须放在 `<Routes>` 的**最后一个** Route

### 场景 2：组件运行时错误
- 访问 `/buggy`，点击"点击触发异常"按钮
- 组件抛出 `new Error(...)`，页面**不会白屏崩溃**
- 自动渲染 `errorElement={<RouteErrorBoundary />}` 中定义的内容
- 显示错误消息并提示返回首页

### 场景 3：错误向上冒泡
- 如果子路由未设置 `errorElement`，错误会冒泡到父路由的 `errorElement`
- 这允许在布局层面统一处理所有子页面的错误

## 原理

### path="*" 通配路由

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  {/* 必须放最后！匹配所有未命中上面规则的路径 */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

`path="*"` 是一个通配符，匹配**任意路径**。但它优先级最低，只有前面所有 Route 都不匹配时才生效。因此它**必须**放在 `<Routes>` 的最后一个。

### errorElement —— 路由级错误边界

```tsx
<Route
  path="/buggy"
  element={<BuggyPage />}
  errorElement={<RouteErrorBoundary />}
/>
```

`errorElement` 是 React Router 提供的**路由级错误边界**。当 `element` 组件渲染过程中抛出异常时，React Router 会：
1. 捕获该异常
2. 用 `errorElement` 组件**替换** `element` 组件
3. `errorElement` 中可通过 `useRouteError()` 获取异常信息

这与 React 的 Error Boundary 概念类似，但**集成在路由层面**，更加声明式。

### useRouteError —— 读取错误信息

```tsx
function RouteErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    // 路由层错误：404、500 等
    return <div>{error.status} - {error.statusText}</div>
  }

  // 组件内部 JS 错误
  return <div>{(error as Error).message}</div>
}
```

`useRouteError()` 返回的错误对象有两种类型：
1. **路由错误**（RouteErrorResponse）—— 如数据加载失败、不存在的数据返回 404 等
2. **组件错误**（Error）—— 组件内部 `throw new Error(...)`

用 `isRouteErrorResponse(error)` 区分两者。

## 为什么这样设计

1. **优秀用户体验**：404 和运行时错误不应该让用户看到白屏或技术栈信息，应该有友好的降级 UI
2. **声明式错误处理**：`errorElement` 在路由定义时声明，不需要在每个组件中写 try-catch
3. **向上冒泡**：子路由错误自动冒泡到父路由的 `errorElement`，适合布局级别的统一错误页面
