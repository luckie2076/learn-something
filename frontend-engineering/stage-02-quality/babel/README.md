# Babel：把新语法转译成旧写法

**为什么**：新语法（如可选链 `?.`、空值合并 `??`）老浏览器不认。Babel 把这些"新写法"**转译成老浏览器能跑的旧写法**，让你放心用现代语法，又不必放弃旧用户。

## 极简示例（`example.js`）
```js
const user = { name: 'Tom' };
const city = user?.address?.city ?? 'unknown';
console.log(city);
```
`?.` 和 `??` 很新，老浏览器不认识。

## 怎么跑（看转译结果）
```bash
pnpm install
pnpm build      # 用 @babel/cli 把 example.js 转译到 dist/example.js
cat dist/example.js
```
你会看到 `?.` / `??` 被展开成 `&&` / 三元等老式写法——这就是 Babel 的活。

> 注：现代构建工具（Vite / Webpack）内部已集成 Babel / esbuild，日常很少手动跑 Babel。这里单独拆出来，只为让你**看清"转译"这件事本身**。
