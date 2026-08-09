# 单元 01 · 路由基础

下一单元：[导航组件](../unit-02-link-navigation/README.md)

## 运行

```bash
pnpm install
pnpm dev
```

在浏览器中点击导航链接，观察 URL 变化和页面切换。

## 现象

打开页面后，你会看到：
- URL 为 `/`，渲染首页内容
- 点击"关于"，URL 变为 `/about`，渲染关于页内容 —— **页面没有刷新，但内容变了**
- 点击"联系"，URL 变为 `/contact`，渲染联系页内容

这就是 SPA（单页应用）路由的核心体验：URL 变化但不发起完整的 HTTP 请求，而是用 JS 局部替换页面内容。

## 原理

### 三层结构

```
BrowserRouter（容器，监听 URL 变化）
  └── Routes（匹配器，根据当前 URL 选择 Route）
       ├── Route path="/"       → <HomePage />
       ├── Route path="/about"  → <AboutPage />
       └── Route path="/contact" → <ContactPage />
```

### BrowserRouter

- 使用浏览器的 [History API](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)（`pushState` / `popState`）
- 监听 `popstate` 事件（浏览器前进/后退按钮）
- 向下传递当前 URL 信息（通过 React Context）

### Routes + Route

- `<Routes>` 遍历所有子 `<Route>`，找到第一个 `path` 与当前 URL 匹配的
- 只渲染**第一个匹配项**，不会渲染多个
- 如果没有匹配，什么都不渲染（后续单元会讲 404 处理）

### 为什么 URL 变了但页面没刷新？

传统的 `<a href="/about">` 会触发浏览器向服务端发起 GET 请求。React Router 的 `<Link>` 组件内部调用 `history.pushState()`，只改变地址栏 URL，不发起 HTTP 请求。然后 BrowserRouter 检测到 URL 变化，通知 Routes 重新匹配并渲染对应组件。

## 关键代码

```tsx
// main.tsx —— 用 BrowserRouter 包裹整个应用
<BrowserRouter>
  <App />
</BrowserRouter>

// App.tsx —— 用 Routes + Route 定义路由映射
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/contact" element={<ContactPage />} />
</Routes>
```

## 为什么这样设计

1. **路径映射到组件**是最自然的路由心智模型 —— URL 路径直接对应用户界面
2. `path` 字符串不带前导 `/` 也可以（相对路径），但加上 `/` 是更明确的写法
3. 页面组件定义在同一个文件仅为演示方便，实际项目应拆分到 `src/pages/` 目录
