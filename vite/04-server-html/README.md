# 单元 04：configureServer + transformIndexHtml

> 本单元目标：学习两个 **Vite 独有、Rollup 没有** 的钩子，它们专门增强开发体验与 HTML 处理。

## 1. configureServer：扩展开发服务器

`configureServer(server)` 让你访问 Vite 的 dev server，往它的中间件栈里插入自定义逻辑（比如 mock 接口）。

```js
configureServer(server) {
  server.middlewares.use((req, res, next) => {
    if (req.url === '/api/hello') {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ msg: '来自开发服务器的接口' }))
      return
    }
    next() // 不是我们的路由，交给 Vite 继续处理
  })
}
```

- 在 `configureServer` 里**同步** `use` 的中间件，会排在 Vite 自带中间件**之前**。
- 若返回一个函数，则该函数内部 `use` 的中间件排在 Vite 自带中间件**之后**（适合改写响应）。

> ⚠️ 这个钩子只在 `vite`（dev）时调用，`vite build` 不走开发服务器。预览服务器请用 `configurePreviewServer`。

## 2. transformIndexHtml：改写入口 HTML

`index.html` 是 Vite 的入口，但普通 Rollup 不处理 HTML。Vite 用 `transformIndexHtml` 钩子让你注入标签或改写内容：

```js
transformIndexHtml: {
  order: 'pre', // 'pre' | 'post' | undefined，控制相对于其他 HTML 插件的顺序
  handler(html, ctx) {
    // ctx.server 存在 => dev；ctx.bundle 存在 => build
    return {
      html,
      tags: [
        { tag: 'div', attrs: { id: 'banner' }, children: '由插件注入', injectTo: 'body-prepend' },
      ],
    }
  },
}
```

返回值三种形式：

- 字符串：直接替换整个 HTML；
- `HtmlTagDescriptor[]`：只描述要注入的标签；
- `{ html, tags }`：两者结合（本单元用的这种）。

## 3. 本单元代码（`vite.config.js`）

见文件：既用 `configureServer` 提供了 `/api/hello` 接口，又用 `transformIndexHtml` 在页面注入了横幅。`index.html` 里点按钮即可请求该接口。

## 4. 运行方式

```bash
pnpm install
pnpm dev      # 打开页面：顶部有横幅，点按钮调 /api/hello
```

构建后查看 `dist/index.html` 也能看到被注入的横幅标签：

```bash
pnpm build && cat dist/index.html
```

## 5. 为什么这两个钩子 "Vite 独有"？

Rollup 只关心 JS 模块的打包，没有「开发服务器」也没有「HTML 入口」概念。因此这两个钩子 Rollup 会直接忽略——**这正是 Vite 对 Rollup 接口的扩展之处**。如果一个插件只依赖这两个钩子，它就**无法在纯 Rollup 项目里工作**，应命名为 `vite-plugin-*` 并说明原因。

## 6. 小结

- `configureServer` 扩展 dev server（mock、重定向等）。
- `transformIndexHtml` 注入/改写 HTML 入口。
- 下一单元（05）我们综合前面所有知识，写一个兼容 Rollup 的 Markdown→JS 插件。
