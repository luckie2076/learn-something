# 单元 02：虚拟模块（resolveId + load）

> 本单元目标：理解 Vite 是如何把一个「不存在于磁盘上的模块」凭空提供给 import 的。

## 1. 什么是虚拟模块？

有时候我们希望 `import x from 'something'` 中的 `something` **不是真实的文件**，而是插件在构建时动态生成的内容（比如把配置、常量、远程数据注入代码）。这个 `something` 就是「虚拟模块」。

经典例子：`import 'virtual:react'`、`import 'vite/preload-helper'` 都是 Vite 内部的虚拟模块。

## 2. 两个核心钩子

| 钩子 | 职责 |
| --- | --- |
| `resolveId(id)` | 当遇到 `import 'xxx'`，决定这个 `xxx` 最终解析成什么内部 id |
| `load(id)` | 拿到内部 id 后，返回该模块的源码字符串（或 `{ code, map }`） |

配合使用的约定：

- **`\0` 前缀**：虚拟模块的内部 id 通常以 `\0` 开头（如 `'\0virtual:hello'`），告诉打包器「这不是磁盘文件，不要去读盘」。Vite 在开发模式下会自动编码这个前缀，避免被当作路径处理。
- **hook filters**：`resolveId` / `load` 写成 `{ filter: { id }, handler }` 形式，只对匹配的 id 触发，更高效，也是 Vite 8 / Rolldown 推荐写法。

> ⚠️ **Rolldown（Vite 8 底层）的重要限制**：`resolveId` 钩子的 `filter.id` **必须是正则**，不能是字符串——因为此时 `id` 还是「import 说明符」而非已解析路径。另外，`load` 收到的 `id` 带 `\0` 前缀，用「包含匹配」的正则（如 `/virtual:hello/`）比精确匹配 `\0` 更稳。

## 3. 本单元代码（`vite.config.js`）

```js
function virtualHelloPlugin() {
  const virtualModuleId = 'virtual:hello'
  const resolvedId = '\0' + virtualModuleId

  return {
    name: 'virtual-hello',
    resolveId: {
      filter: { id: virtualModuleId },
      handler(id) {
        if (id === virtualModuleId) return resolvedId
      },
    },
    load: {
      filter: { id: resolvedId },
      handler(id) {
        if (id === resolvedId) return `export const msg = "你好，我是一个虚拟模块"`
      },
    },
  }
}
```

`index.html` 里 `import { msg } from 'virtual:hello'` 就会被这个插件接管，控制台打印出 `你好，我是一个虚拟模块`。

## 4. 运行方式

```bash
pnpm install
pnpm dev      # 打开页面，按 F12 看控制台
```

## 5. 与 Rollup 的关系

这套 `resolveId` + `load` + `\0` 前缀的写法是 **Rollup/Rolldown 的标准约定**，所以虚拟模块插件天然兼容 Rollup，不需要任何 Vite 特有钩子就能在纯 Rollup 项目里工作。

## 6. 小结

- `resolveId` 决定「模块叫什么」，`load` 决定「模块内容是什么」。
- `\0` 前缀是虚拟模块的通用约定。
- 下一步（单元 03）我们用 `transform` 钩子对**真实文件**做源码转换。
