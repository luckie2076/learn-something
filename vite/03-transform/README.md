# 单元 03：transform（代码转换）

> 本单元目标：掌握最常用的 `transform` 钩子——对模块源码做转换，并用 hook filters 做精准过滤。

## 1. transform 是做什么的？

`transform(code, id)` 在**每个模块被加载后、被打包前**调用，让你修改它的源码。这是 Vite 插件里**最高频**的钩子：

- `@vitejs/plugin-react` 用它把 JSX/TS 编译成 JS；
- `unplugin` 系列用它做各种源码改写；
- 本单元我们写一个「玩具语言」编译器：把 `key=value` 文本变成 JS 对象。

返回值：

- `null` / `undefined`：表示「我不处理这个模块，交给别的插件」；
- `{ code, map }`：返回转换后的代码（以及可选的 sourcemap）。

## 2. hook filters：只处理关心的文件

Vite 8 / Rolldown 推荐把钩子写成 `{ filter, handler }`。`filter.id` 是正则，只有匹配的模块才会进入 `handler`，省去在 handler 里大量 `if` 判断，也减少了 JS/Rust 之间的通信开销：

```js
transform: {
  filter: { id: /\.toy$/ },
  handler(code, id) {
    // 这里拿到的一定是 .toy 文件
  },
},
```

> 兼容旧版（Vite < 6.3 / Rollup < 4.38）时，可退化为 `transform(code, id) { if (!/\.toy$/.test(id)) return null ... }`。本教学统一用最新的 filter 写法。

## 3. 本单元代码（`vite.config.js`）

我们用单元 02 的虚拟模块提供一段 `.toy` 文本，再用 `transform` 把它编译成 JS 对象：

```js
transform: {
  filter: { id: /\.toy$/ },
  handler(code, id) {
    if (!id.endsWith('.toy')) return null
    const obj = {}
    for (const line of code.split('\n')) {
      const [k, v] = line.split('=')
      if (k && v !== undefined) obj[k.trim()] = v.trim()
    }
    return { code: `export default ${JSON.stringify(obj)}`, map: null }
  },
},
```

`index.html` 里 `import data from 'virtual:data.toy'` 得到 `{ name: 'Vite', version: '8' }`。

## 4. 运行方式

```bash
pnpm install
pnpm dev      # 看控制台打印的编译结果
```

## 5. 与 Rollup 的关系

`transform` 是 Rollup 的标准钩子，写法完全一致；`filter` 是 Rolldown/Vite 8 的增强（Rollup 需在 handler 内手写正则回退）。因此本插件核心逻辑在纯 Rollup 下同样可用。

## 6. 小结

- `transform` 是「改源码」的主战场，返回 `{ code, map }` 或 `null`。
- 用 `filter.id` 正则精准过滤，是推荐写法。
- 下一步（单元 04）我们看 Vite 独有钩子：`configureServer` 与 `transformIndexHtml`。
