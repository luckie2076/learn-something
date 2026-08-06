# 单元 05 · 查询参数

## 运行

```bash
pnpm install
pnpm dev
```

切换排序方式、翻页，观察 URL 查询字符串的变化。

## 现象

- 点击"价格 ↑"→ URL 变为 `/?sort=price-asc&page=1`，列表重新排序
- 点击第 3 页 → URL 变为 `/?sort=price-asc&page=3`，列表切换到第 3 页
- **刷新浏览器** → 排序和页码保持不变！因为状态在 URL 中
- **复制 URL 发给别人** → 对方打开看到相同的排序和页码

## 原理

### URL 查询字符串

```
https://example.com/products?page=3&sort=price-asc
                              ────────────────────
                                  查询参数（search params）
```

查询参数是 URL 中 `?` 后面的 key=value 对，多个参数用 `&` 连接。它不影响路由匹配（`/products` 加了 `?page=3` 仍然匹配 `/products` 路由）。

### `useSearchParams` vs `useState`

| | useState | useSearchParams |
|---|---|---|
| 存储位置 | React 内存 | URL 查询字符串 |
| 刷新后 | 丢失 | 保留 |
| 分享 URL | 不包含状态 | 包含状态 |
| 浏览器前进/后退 | 需手动处理 | 自动同步 |

### 为什么用 `URLSearchParams` 对象？

```tsx
const next = new URLSearchParams(searchParams)  // 复制当前参数
next.set("page", "3")                           // 修改/新增
next.delete("sort")                             // 删除
setSearchParams(next)                           // 写回 URL
```

直接操作 `URLSearchParams` 对象比操作字符串更安全，避免手动拼接 `&` 和 `=`。

### 与路径参数的区别

| | 路径参数 `:id` | 查询参数 `?page=1` |
|---|---|---|
| 用法 | `/users/:id` | `/users?page=1` |
| 获取 | `useParams()` | `useSearchParams().get("page")` |
| 语义 | 资源的标识（哪个用户） | 资源的过滤/排序/分页 |
| 可选性 | 路由匹配必需 | 总是可选的 |

## 为什么这样设计

1. **URL 是真相来源**：分页、筛选等 UI 状态放在 URL 中，天然支持分享、书签、前进后退
2. **声明式 API**：`setSearchParams` 自动更新 URL 并触发重渲染，不需要手动 `pushState`
3. **参数总是字符串**：与路径参数一样，需要数字时自行转换
