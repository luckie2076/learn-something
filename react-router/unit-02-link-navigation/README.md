# 单元 02 · 导航组件

## 运行

```bash
pnpm install
pnpm dev
```

点击导航栏观察激活高亮效果。

## 现象

- 导航栏使用 **NavLink** 切换页面，当前激活的链接会**高亮**（蓝底白字），其余为灰色
- 首页 `end` 属性保证高亮只精确匹配 `/`，不会在 `/about` 时也亮
- 页面切换**不刷新**，URL 变化但无 HTTP 请求

## 原理

### Link —— 增强版 `<a>` 标签

```tsx
import { Link } from "react-router"

<Link to="/about">关于</Link>
```

`<Link>` 本质上渲染为 `<a>` 标签，但内部拦截了点击事件的默认行为（`preventDefault`），
改用 `history.pushState()` 修改 URL，从而实现**无刷新跳转**。

| | `<a href="/about">` | `<Link to="/about">` |
|---|---|---|
| 点击行为 | 发起 HTTP GET 请求 | 调用 pushState() |
| 页面 | 全部刷新 | 仅局部重新渲染 |
| SEO | 友好 | 需额外处理 |

### NavLink —— 感知激活状态的 Link

```tsx
<NavLink
  to="/about"
  className={({ isActive }) => isActive ? "active" : ""}
>
  关于
</NavLink>
```

`className` 接收一个**函数**（而非字符串），函数参数 `{ isActive, isPending, isTransitioning }`：
- `isActive`：当前 URL 匹配该链接的 `to` 时返回 `true`
- `isPending`：数据加载中时返回 `true`（数据模式才有）
- `isTransitioning`：过渡动画期间返回 `true`

### `end` 属性 —— 精确匹配

不加 `end` 时，`<NavLink to="/">` 在 `/about`、`/contact` 时也会 `isActive: true`（因为所有路径都以 `/` 开头）。加上 `end` 后只在精确匹配 `/` 时才激活。

```tsx
// 无 end：/about 也激活
<NavLink to="/">首页</NavLink>

// 有 end：只在 / 激活
<NavLink to="/" end>首页</NavLink>
```

## 为什么这样设计

1. **NavLink 的 className 回调**是函数式声明式编程的体现 —— UI 由状态自动派生，不用手动监听 URL 变化
2. **end 属性**解决了一个常见的 UI bug：根路径导航项在子页面也保持高亮
3. **Link 而非 `<a>`** 是 SPA 路由的基石：拦截浏览器默认跳转，用 JS 控制导航
