# 单元 01：认识插件生态

> 本单元目标：搞清楚「Vite 插件」和「Rollup 插件」到底是什么关系，并写出你的第一个最小插件。

## 1. Vite 插件兼容 Rollup 插件吗？

**结论：Vite 插件就是 Rollup 插件接口的「超集」。** 在最新版 Vite 8 中，底层打包器是 Rolldown（API 与 Rollup 高度兼容），Vite 在 Rollup 插件接口之上扩展了一些 Vite 特有的钩子。

这意味着：

- 大量 Rollup 插件**可以直接当 Vite 插件用**，例如 `@rollup/plugin-alias`、`@rollup/plugin-json`。
- Vite 额外提供了 Rollup 没有的钩子：`config`、`configResolved`、`configureServer`、`configurePreviewServer`、`transformIndexHtml`、`handleHotUpdate`。

### 需要规避的「兼容陷阱」

| 情况 | 说明 |
| --- | --- |
| `moduleParsed` 钩子 | 开发服务器出于性能**不会调用**它，只在构建期有效 |
| 输出生成钩子（`generateBundle` 等） | 除 `closeBundle` 外，开发期**不调用** |
| 打包钩子与输出钩子强耦合 | 开发阶段没有输出阶段，强耦合会失效 |

### 双环境兼容写法要点

- 导出**工厂函数**（返回插件对象），便于接收选项。
- 用 `apply: 'build' | 'serve'` 控制只在某环境生效。
- 用 `enforce: 'pre' | 'post'` 控制插件执行顺序。
- 用 **hook filters**（`{ filter, handler }`）做路径过滤，减少不必要的处理。

## 2. 一个插件的最简结构

Vite 插件本质是一个对象，必须包含 `name`，再挂若干钩子（hook）：

```js
function myPlugin() {
  return {
    name: 'my-plugin',        // 必填，警告/错误里会显示
    transform(code, id) {     // 可选，转换源码
      return { code, map: null }
    },
  }
}
```

## 3. 本单元的演示代码

`vite.config.js` 里写了一个 `logLifecyclePlugin`，它只做一件事：在关键钩子被调用时打印日志，帮助你直观感受「钩子是什么时候跑的」。

钩子调用顺序（开发 `vite`）大致为：
`config` → `configResolved` → `configureServer`（单元04才讲）→ `buildStart` → ... → `buildEnd`

构建 `vite build` 还会多出输出相关钩子。

## 4. 运行方式

```bash
pnpm install
pnpm dev        # 开发模式，看终端打印
pnpm build      # 构建模式，对比钩子顺序
```

## 5. 小结

- Vite 插件 ≈ Rollup 插件 + Vite 扩展钩子。
- 写一次插件，通常能同时跑在开发服务器和生产构建两种环境。
- 下一步（单元 02）我们用 `resolveId` + `load` 理解「虚拟模块」这个核心概念。
