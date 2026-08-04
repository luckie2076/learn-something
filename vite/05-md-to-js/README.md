# 单元 05：综合实战 · Markdown → JS 模块插件

> 本单元目标：把前四个单元的知识串起来，写一个**同时兼容 Vite 与 Rollup/Rolldown** 的实用插件——让项目可以直接 `import md from './x.md'`。

## 1. 成品插件长什么样？

核心在 `plugin-md-to-js.js`，它只用了三个 **Rollup 标准钩子**，因此不需要任何 Vite 特有能力即可在纯 Rollup 下工作：

| 钩子 | 职责 |
| --- | --- |
| `resolveId` | 认领 `.md` 文件，让后续钩子接管 |
| `load` | 用 `fs` 读取 `.md` 原始文本 |
| `transform` | 把 markdown 文本编译成 JS 模块 |

转换结果：每个 `.md` 变成一个 JS 模块，导出

```js
export const html = '<h1>标题</h1>...' // 编译后的 HTML
export const raw  = '# 原始 markdown 文本'
export default { html, raw }
```

`index.html` 中 `import md from './example.md'` 即可拿到 `md.html` 渲染到页面。

## 2. 为什么它"兼容 Rollup"？

关键设计：

- **只用标准钩子**：`resolveId` / `load` / `transform` 都是 Rollup 的，没有用到 `configureServer`、`transformIndexHtml` 等 Vite 独有钩子 → Rollup 能直接跑。
- **工厂函数导出**：`export default function mdToJs(options = {})`，符合 Rollup 插件惯例。
- **hook filters**：`filter: { id: /\.md/ }` 精准匹配，是 Vite 8 / Rolldown 推荐写法；旧版 Rollup 可在 handler 内用正则回退。
- **避开兼容陷阱**：没有用 `moduleParsed`，也没有把逻辑强耦合到输出钩子 → dev 与 build 都能正常工作。

> 命名约定：若插件只用标准钩子、可在纯 Rollup 使用，包名常用 `rollup-plugin-*` 并在 keywords 同时标注 `vite-plugin`；本教学文件直接放在单元内即可。

## 3. 在纯 Rollup 下如何使用（示意）

```js
// rollup.config.js
import mdToJs from './plugin-md-to-js.js'
export default {
  input: 'src/main.js',
  plugins: [mdToJs()],
  // ...
}
```

在 `src/main.js` 里 `import md from './doc.md'` 同样可用。

## 4. 关于"真正的 markdown 解析"

为保持「代码极简、仅用于演示」，本插件的 `mdToHtml` 只用了几行规则把 `# 标题` 变成 `<h1>`。真实项目可把 `mdToHtml` 替换成 `markdown-it` / `marked` 等库，插件其余结构完全不变。

## 5. 运行方式

```bash
pnpm install
pnpm dev      # 打开页面，看 example.md 被渲染出来
pnpm build    # 构建后 dist 中已内联编译后的 md 模块
```

## 6. 写在最后：Vite 插件 vs Rollup 插件

到这里你已经亲手写过：

- 最小插件（01）
- 虚拟模块 `resolveId`+`load`（02）
- 源码转换 `transform`+filters（03）
- Vite 独有钩子 `configureServer`/`transformIndexHtml`（04）
- 一个双环境兼容的实战插件（05）

一句话总结：**Vite 插件 = Rollup 插件接口 + Vite 扩展钩子**。写插件时，只要只用到标准钩子并注意兼容陷阱，就能一次编写、Vite/Rollup 双环境运行；当需要开发服务器或 HTML 能力时，再叠加 Vite 独有钩子即可。
