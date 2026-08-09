# 单元 03 · 动态路由

上一单元：[导航组件](../unit-02-link-navigation/README.md) | 下一单元：[嵌套路由](../unit-04-nested-layout/README.md)

## 运行

```bash
pnpm install
pnpm dev
```

点击用户列表中的用户名，跳转到详情页，观察 URL 变化。

## 现象

- 用户列表页 URL 为 `/`
- 点击"张三"→ URL 变为 `/users/1`，路由在详情页显示张三的信息
- 点击"李四"→ URL 变为 `/users/2`，同一个 `UserDetailPage` 组件渲染不同的内容
- **同一个组件，不同的 URL 参数，渲染不同的数据** —— 这就是动态路由的核心价值

## 原理

### 动态段 `:id`

```tsx
<Route path="/users/:id" element={<UserDetailPage />} />
```

以 `:` 开头的路径片段是"动态段"。React Router 在匹配时：
1. 从当前 URL 中提取 `/users/` 之后的值
2. 将这个值存入 params 对象，key 为 `id`

| URL | 匹配结果 |
|-----|----------|
| `/users/1` | `params.id = "1"` ✅ |
| `/users/2` | `params.id = "2"` ✅ |
| `/users/abc` | `params.id = "abc"` ✅ |
| `/users` | 不匹配 ❌（缺少动态段） |

### `useParams` Hook

```tsx
import { useParams } from "react-router"

const { id } = useParams<{ id: string }>()
// id 的类型为 string | undefined
```

`useParams` 读取当前路由匹配产生的 params 对象。注意：
- 所有参数值都是 **string** 类型（URL 中只有字符串）
- 如果组件不在匹配的路由组件树中，返回 `undefined`
- 使用 TypeScript 泛型可以标注期望的参数类型

### 多参数场景

```tsx
<Route path="/users/:userId/posts/:postId" element={<PostDetail />} />
// useParams() → { userId: "1", postId: "42" }
```

## 为什么这样设计

1. **同一组件、不同数据**：不需要为每个用户写一个路由，一套组件处理所有同类页面
2. **URL 即状态**：用户详情页的 id 直接体现在 URL 中，刷新、分享、收藏都不会丢失状态
3. **字符串类型的参数**：因为 URL 本质是字符串，需要数字时需要自行转换 `Number(id)`
