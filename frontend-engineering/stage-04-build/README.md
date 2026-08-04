# 阶段四：构建与打包工具

> 目标：理解「为什么浏览器不能直接用我们写的源码」，以及现代构建工具如何把前几阶段学的工具**串成一条流水线**。
> 本阶段**主体教学内容放在每个工具的子目录里**（与各工具自带 README 一致，见阶段三模式）。本文件只做「概览 + 索引」。

## 1. 为什么需要构建工具

你写的通常是几十个 ESM 模块 + TS + Sass + 新语法。浏览器直接加载会面临：

- 上百个 HTTP 请求（模块分散），加载慢；
- 看不懂 TS / 新语法；
- 没有压缩、没有 tree-shaking，体积大。

构建工具做三件核心事：**打包（bundle）→ 转译（transpile）→ 优化（压缩 / 摇树）**，产出一份浏览器能高效运行的静态文件。

## 2. 两种心智模型（概念对比）

**Webpack —— 经典全能型（概念）**
把项目看成一张**依赖图**，从一个入口出发，顺着 `import` 把所有模块收拢，吐出 bundle。四个核心概念：

- **entry**：从哪开始打包。
- **loader**：让 Webpack 能处理非 JS 文件（如 `css-loader`、`babel-loader`）。Webpack 默认只懂 JS。
- **plugin**：在打包各阶段插手干更复杂的活（如 `HtmlWebpackPlugin` 自动生成 HTML）。
- **output**：产出到哪。

**Vite —— 现代开发体验型（本阶段已落地）**
开发态不打包、直接用浏览器原生 ESM（秒开），生产态才用 Rolldown 打包。详见 [`vite/`](./vite/)。

**Webpack —— 经典全能型（本阶段已落地）**
四件套 `entry / loader / plugin / output` 显式编排，loader 把各类资源转成 JS 模块、plugin 管打包全流程。可运行示例见 [`webpack/`](./webpack/)。

> 两者不是「选边」关系：Webpack 胜在生态成熟、配置精细（且概念通用，学一次受益多）；Vite 胜在开发体验。**把 [`vite/`](./vite/) 和 [`webpack/`](./webpack/) 并排看**，能清楚体会「同一个需求，两种构建哲学」。

## 3. 本阶段包含哪些构建工具

| 目录 | 工具 | 版本 | 教学点 |
|------|------|------|--------|
| [`vite/`](./vite/) | Vite | 8.x | dev 用浏览器 ESM、prod 用 Rolldown；自动编排 TS / Sass / PostCSS / CSS Modules |
| [`webpack/`](./webpack/) | Webpack | 5.x | 经典打包器：entry/loader/plugin/output 四件套；loader 把 TS/Sass/图片/JSON 转成 JS 模块，plugin 生成 HTML |

> 后续要学其他构建工具（Webpack / Rollup / esbuild…）时，在 `stage-04-build/` 下新建对应子目录、各自带 README，再在本表补一行即可——**阶段级 README 只做索引，不写具体教程**，避免随工具增多而膨胀。

## 4. 必懂的优化概念

- **Tree-shaking**：基于 ESM 静态分析，把没被用到的导出丢掉。所以要写 ESM、别写带副作用的 CJS。
- **代码分割 / 懒加载**：`import()` 动态导入，把不常用的代码拆成单独 chunk，首屏更快。
- **多环境配置**：`import.meta.env.MODE`，用 `.env` 区分 dev / prod 的接口地址。

## 5. 下一步

进入 [阶段五：自动化测试](../stage-05-test/README.md)，看如何为这条流水线加上质量护城河。
