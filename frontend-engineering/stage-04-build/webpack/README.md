# Webpack 5 示例：经典「打包器」如何把前几阶段的工具串成流水线

> 本目录是一个**可独立运行**的最小示例，和同级的 [`../vite/`](../vite/) 对照：同一个需求（TS + Sass + PostCSS + CSS Modules + import 图片/JSON），Vite 靠「开箱即用的自动编排」，**Webpack 靠「你显式写下的 entry / loader / plugin / output 四件套」**。
> 建议先跑通再读下面的表：`pnpm install && pnpm build`。

## 1. Webpack 是什么：四件套模型

Webpack 把项目看成一张**依赖图**，从 `entry` 出发顺着 `import` 把所有模块收拢，吐出 `output`。四个核心概念：

| 概念 | 干什么 | 在本示例的体现 |
|------|--------|---------------|
| **entry** | 依赖图从哪开始 | `./src/main.ts` |
| **loader** | 让 Webpack 能处理**非 JS 文件**（TS / Sass / png…）。Webpack 默认只懂 JS | `ts-loader` / `sass-loader` / `css-loader` / `style-loader` |
| **plugin** | 在打包各阶段插手干更复杂的活 | `HtmlWebpackPlugin` 自动生成 HTML 并注入 bundle |
| **output** | 产物写到哪 | `dist/bundle.[contenthash].js` |

记忆法：**loader 管「单个文件怎么转」，plugin 管「全流程里额外的事」**。

## 2. 本示例用到的文件

| 文件 | 角色 | 对应阶段 |
|------|------|----------|
| `src/main.ts` | TS 入口，import 样式 / 图片 / JSON | 阶段二（TS） |
| `src/style.scss` | 全局 Sass（变量 + 嵌套） | 阶段三（Sass） |
| `src/style.module.scss` | CSS Modules 化的 Sass | 阶段三（Sass + 作用域） |
| `src/logo.png` | 演示 `import` 图片拿到 URL | 本阶段（loader 处理资源） |
| `src/data.json` | 演示 `import` JSON 拿到对象 | 本阶段（原生支持） |
| `src/index.html` | `HtmlWebpackPlugin` 的模板 | plugin 产出 |
| `postcss.config.js` | 配 autoprefixer | 阶段三（PostCSS） |
| `webpack.config.js` | 四件套都在这里 | 本阶段 |

## 3. 核心：编排表（前几阶段学的，在 Webpack 里被谁收编）

| 前几阶段学的 | 在 Webpack 里由谁处理 | 你要写多少配置 |
|--------------|----------------------|---------------|
| 阶段二 TypeScript | `ts-loader` 转译 | 一条 rule（这里用 `transpileOnly` 跳过类型检查、求快，和 Vite 的 Oxc 同思路） |
| 阶段三 Sass 预处理 | `sass-loader` 调 `sass` 编译 `.scss` | 一条 rule |
| 阶段三 PostCSS / autoprefixer | `postcss-loader` 读 `postcss.config.js` | 一条 rule（和阶段三同一份逻辑） |
| 阶段三 CSS Modules | `css-loader` 的 `modules: true`（靠文件名 `*.module.scss` 区分） | 在 rule 里开选项 |
| 本阶段 import 图片 | Webpack 5 内置 `asset` 模块 | 一条 rule（`type: 'asset'`） |
| 本阶段 import JSON | Webpack 5 **原生支持**，无需 loader | **零配置** |
| 生成 HTML | `HtmlWebpackPlugin` | 一个 plugin |

一句话：**和 Vite 一样，阶段三你手动串的 Sass→PostCSS、手写哈希，这里被 Webpack 在打包时一条龙做完——区别只是每一步都要你亲手在 `webpack.config.js` 写一条 rule/plugin。**

## 4. 和前面讲过的 Rollup 钩子对照（重点）

Rollup 风格的三钩子：`resolveId`（import 字符串 → 唯一 id）→ `load`（id → 原始内容）→ `transform`（内容 → JS 模块），在 Vite 8 里由 Rolldown 实现（Rolldown 兼容 Rollup 插件 API）。Webpack 是**另一套概念，但职责一一对应**：

| Rollup 钩子 | Webpack 里的对应物 | 说明 |
|-------------|-------------------|------|
| `resolveId(source)` | `resolve`（extensions / alias） | 「这个 import 指哪个文件」 |
| `load(id)` + `transform` | **loader**（load+transform 合体） | 「读取文件内容并转成 JS 模块」 |
| plugin 钩子 | Webpack 的 **plugin**（tapable 钩子） | 「打包全流程里插手干更复杂的活」 |

所以之前那个结论在这里同样成立：

> **loader 负责「把任意资源变成 JS 模块」，Webpack 核心（bundler）负责「把这些 JS 模块打包成产物」。** 转译非 JS 是 loader 的活，打包是 Webpack 的活——别把转换器的工作记到打包器头上。

loader 链的执行顺序值得记住：**数组从右往左执行**（函数组合）。本示例 Sass 的 rule：

```js
use: [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { modules: { namedExport: false } } }, 'postcss-loader', 'sass-loader']
// 实际执行：sass-loader(.scss→css) → postcss-loader(加前缀) → css-loader(作用域/导入) → MiniCssExtractPlugin.loader(把 CSS 抽成独立文件)
```

## 5. 动手跑

```bash
pnpm install
pnpm build     # 产出 dist/：一份 HTML + 一份 JS + 一份独立 CSS（MiniCssExtractPlugin 抽离）
pnpm dev       # 开发服务器（webpack-dev-server，内存打包、热更新）
```

**观察点（验证流水线串起来了）**：打开 `dist/` 的 `bundle.*.js`，你会看到：

- `style.module.scss` 里的 `.card` 被编译成了**哈希类名**（css-loader 默认形如 `.Gmh8YNg94l1RMiB81kVJ`，和 Vite 的 `._card_xxxx_` 格式不同，但「哈希化、全局唯一、根治命名冲突」原理一致）；`styles.card` 映射到的就是它；想和 Vite 长得一样可配 `css-loader` 的 `modules.localIdentName`；
- 同一段里的 `user-select` / `transform` 被补上了 `-webkit-` / `-moz-` 前缀（autoprefixer 确实行过）；
- `data.json` 被**直接摊平**成 JS 对象字面量（搜 `greeting`）；
- `logo.png` 只有 67 字节 < 4KB，被 `asset` 模块**内联成 `data:image/png;base64,...`**（搜 `data:image/png`）。
- 构建产物里多出一份 `assets/main.[hash].css`，并且 `index.html` 用 `<link rel="stylesheet">` 引入它（和 Vite build 一致）。**「把 CSS 从 JS 里抽出来、产出独立文件」是 `MiniCssExtractPlugin` 这个 plugin 干的**——loader 只负责「转」（sass→css），plugin 负责「产出」，分工清晰。

⚠️ **实战踩坑（CSS Modules 的默认导出）**：css-loader 处理 `*.module.scss` 时，较新版本默认**只给具名导出、不给默认导出**。若你写 `import styles from './style.module.scss'`（默认导入），`styles` 会是 `undefined`，运行到 `styles.card` 直接抛 `TypeError`、脚本中断、`#app` 空白——页面就「不正常」了。本示例用 `modules: { namedExport: false }` **强制默认导出整个类名映射对象**，默认导入才能拿到 `styles.card`。这是一个极常见、且报错信息不直观的 Webpack 陷阱，值得记住。

这正是阶段三的「Sass 编译 + 后处理加前缀 + 作用域哈希」被 Webpack 一次性做完，外加「图片内联、JSON 摊平」——和 Vite 那套机制**一字不差地共用同一原理**，只是触发方式从「约定优于配置」变成了「你写 rule」。

## 6. Webpack vs Vite：一个关键差异

| 维度 | Vite | Webpack |
|------|------|---------|
| 开发态 | **不打包**，浏览器原生 ESM，秒开 | **也打包**（dev-server 在内存里打一份），启动相对慢 |
| 生产态 | Rolldown 打包 | Webpack 自身打包 |
| 配置量 | 极少（约定优于配置） | 较多（四件套都要写） |
| 心智模型 | 「插件自动编排」 | 「entry/loader/plugin/output 显式编排」 |

> 本示例**直接用 `MiniCssExtractPlugin` 把 CSS 抽成独立文件**（对应 Vite build 抽 `.css`），所以 `dist/` 下有 `assets/main.[hash].css` 并被 HTML 的 `<link>` 引入。注意：**loader 只负责「转」（sass→css），真正「把 CSS 从 JS 里抽出来、产出独立文件」是 `MiniCssExtractPlugin` 这个 plugin 干的**——这正是「loader 管转、plugin 管产出」分工的体现。若你只是想最快看到效果，也可以把 loader 换回 `style-loader`（把 CSS 注入进 JS、不产独立文件），但生产环境几乎都用抽离方案。

## 7. 关于版本

- 示例锁定 `webpack@^5`、`webpack-cli@^6`、`webpack-dev-server@^5`。
- `ts-loader` 开了 `transpileOnly: true`：**只转译、不类型检查**，构建更快也更能容忍类型小错；想要严格类型检查就去掉这个选项（但会慢，且需保证零类型错误才能过 build）。
- `sass` 会顺带拉 `@parcel/watcher`，已在 `pnpm-workspace.yaml` 的 `allowBuilds` 里批准（pnpm 11 要求显式批准带构建脚本的原生依赖）。

## 8. 下一步

回到 [阶段四总览](../README.md)，或进入 [阶段五：自动化测试](../stage-05-test/README.md)。把本示例和 [`../vite/`](../vite/) 并排看，能很清楚体会「同一个需求，两种构建哲学」。
