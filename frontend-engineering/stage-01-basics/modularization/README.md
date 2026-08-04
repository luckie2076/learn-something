# 模块化：为什么不再把所有 JS 写在一个文件

**为什么**：所有 JS 堆在一个文件，变量全在全局，多人协作立刻互相覆盖、无法测试。模块化让每个文件**只暴露需要的部分**，内部实现藏起来，职责清晰、可单独测试。

JS 历史上两套规范：
- **CommonJS（CJS）**：`require()` / `module.exports`，Node 早期标准，同步加载，适合服务端。
- **ES Modules（ESM）**：`import` / `export`，语言官方标准（ES2015+），浏览器原生、静态可分析（利于 tree-shaking）。

**现在学哪个**：优先 ESM。它是标准、浏览器原生、构建工具也围绕它优化。本示例全用 ESM。

## 极简示例
`src/math.js`（只导出需要的接口）：
```js
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
```
`src/index.js`（导入并使用）：
```js
import { add, subtract } from './math.js';
console.log(add(1, 2), subtract(5, 3));
```

## 怎么跑
```bash
pnpm install
pnpm start
```

## 关键理解点
- `package.json` 里 `"type": "module"` 表示本项目用 ESM；否则 Node 默认按 CJS 解析 `.js`。
- `import './math.js'` 的**相对路径必须带扩展名 `.js`**（Node 的 ESM 要求）。
- 模块是"静态"的：导入关系在写出代码时就确定，而非运行时——这正是构建工具能做 tree-shaking 的前提。
