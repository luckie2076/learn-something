# Vite 8 示例：把阶段二 / 三的工具串成一条流水线

> 本目录是一个**可独立运行**的最小示例，演示现代构建工具如何把前面阶段「单独学」的工具自动编排成一条流水线。
> **先用 `pnpm install && pnpm build` 跑一遍**，再看下面的「编排表」会非常直观。

## 1. Vite 是什么，为什么快

Vite 是「现代开发体验型」构建工具，分两种运行态：

- **开发态（`pnpm dev`）**：**不打包**。直接用浏览器原生 ESM，按浏览器请求按需编译单个文件，所以启动秒开。
- **生产态（`pnpm build`）**：才用 **Rolldown** 打包（保证线上性能、做 tree-shaking）。

对比记忆：开发态 Vite（不打包，靠浏览器 ESM）vs 经典 Webpack（先打包再起服务，慢）；生产态两者都打包，Vite 用 Rolldown、Webpack 自带。

## 2. 本示例用到的文件（各自对应一个阶段）

| 文件 | 扮演的角色 | 来自哪个阶段 |
|------|-----------|--------------|
| `src/main.ts` | TS 源码入口，引入下面两份样式 | 阶段二（TypeScript） |
| `src/style.scss` | 全局样式：Sass 变量 + 嵌套 | 阶段三（Sass 预处理） |
| `src/style.module.scss` | CSS Modules 化的 Sass（类名构建时哈希化） | 阶段三（Sass + 作用域） |
| `src/logo.png` | 一张 1×1 透明图，演示 `import` 图片拿到的是「URL」 | 本阶段（import 非 JS 资源） |
| `src/data.json` | 一份小 JSON，演示 `import` JSON 拿到的是「解析后的对象」 | 本阶段（import 非 JS 资源） |
| `postcss.config.js` | 配置 autoprefixer | 阶段三（PostCSS 后处理） |
| `vite.config.js` | 极简配置（只需声明输出目录 + Sass 现代编译器） | 本阶段 |

## 3. 核心：编排表（前几阶段学的，在 Vite 里被谁收编）

这是本示例的重心——看前面「单独学」的工具，如何在构建工具里被**自动连起来**：

| 前几阶段学的 | 在 Vite 里由谁处理 | 怎么接进来（你写了多少配置？） |
|--------------|--------------------|-------------------------------|
| 阶段二 TypeScript | `Oxc` 转译（开发态极快） | **零配置**，Vite 内置 |
| 阶段三 Sass 预处理 | Vite 调用 `sass` 编译 `.scss` | 装了 `sass` 即可，**零配置** |
| 阶段三 PostCSS / autoprefixer | Vite **自动读取** `postcss.config.js` | 和阶段三**同一份逻辑**，只是从「手动 `npx postcss`」变成「打包时自动跑」 |
| 阶段三 CSS Modules | 文件名约定 `*.module.scss` 自动开启 | 约定优于配置，**零配置** |
| 本阶段 import 图片 | Vite 的 **asset 插件**把 `./logo.png` 编译成 `export default "URL"` | 约定优于配置，**零配置** |
| 本阶段 import JSON | Vite 的 **JSON 插件**把 `./data.json` 编译成 `export default {...}` | 约定优于配置，**零配置** |

> 注意：后两行的「图片 / JSON」和上面的 Sass 是**同一套机制**——都是某个插件在 `transform` 钩子里把非 JS 文件变成「合法 JS 模块」，区别只在返回什么：`scss` 返回「注入 `<style>` 的代码」、`png` 返回「URL 字符串」、`json` 返回「解析后的对象」。`import` 任意资源≠JS 原生，全是构建工具的插件在兜底。

一句话：**阶段三说「后处理 / 作用域会被构建工具收编」，这里就是收编现场**——你之前手动串 Sass→PostCSS、手写哈希，现在 Vite 在打包时一条龙做完，你没写一行 glue 代码。

## 4. 原生依赖这道闸（呼应阶段三）

Vite 8 底层是 **Rolldown**（Rust 打包器，原生二进制预编译分发、无构建脚本，无需批准）；直接依赖的 `sass` 会顺带拉 `@parcel/watcher`（仅 `--watch` 用，需批准）。

pnpm 11 要求显式批准带构建脚本的依赖，本示例在 `pnpm-workspace.yaml` 里用 `allowBuilds` 批准了它：

```yaml
allowBuilds:
  '@parcel/watcher': true   # 被直接依赖的 sass 拉入，仅 --watch 用；状态检查会拦所有 pnpm run，照样得批
```

注意 Vite 8 底层的 Rolldown 是**预编译分发**的 Rust 二进制、没有需要批准的构建脚本，所以**不再需要批准 esbuild**（esbuild 现在只是 Vite 8 未启用的可选 peer）。本示例之所以还要 `allowBuilds`，纯粹是因为直接装了 `sass`、而 `sass` 会拉 `@parcel/watcher`。这既对照了阶段三「用不到就绕开」，又和阶段五 unit 示例「Vite 8 不再需要 allowBuilds」的结论一致——差别只在于 stage-05 没装 sass。

## 5. 动手跑

```bash
pnpm install
pnpm build     # 产出 dist/：一份 HTML + 一份 CSS + 一份 JS
pnpm dev       # 开发服务器（浏览器原生 ESM，秒开）
```

**观察点（验证流水线真的串起来了）**：打开 `dist/assets/*.css`，你会看到：

- `style.module.scss` 里的 `.card` 被编译成了 `._card_xxxxxxxx_` 这样的**哈希类名**（CSS Modules 生效，根治命名冲突）；
- 同一段里的 `user-select` / `transform` 被补上了 `-webkit-` / `-moz-` 前缀（autoprefixer 确实行过）。

这正是阶段三的「Sass 编译 + 后处理加前缀 + 作用域哈希」，被 Vite 一次性做完。

再验证「import 非 JS 资源」那条：`logo.png` 只有 67 字节，远小于 Vite 默认的 4KB 内联阈值，所以构建后它被**内联成了 base64 的 data URL** 而非独立文件。打开 `dist/assets/*.js`，搜 `data:image/png;base64`，你能看到 `logoUrl` 实际就是一个 `data:` 字符串；而 `data.json` 的内容被**直接摊平**成了 JS 对象字面量（试试搜 `greeting`）。这俩现象共同印证：

- `import logoUrl from './logo.png'` 拿到的不是图片本身，而是「构建后它的地址」（小图内联、大图抽成 `/assets/logo-xxxx.png`）；
- `import info from './data.json'` 拿到的是普通对象，`info.stage` 直接读字段——和 import SCSS 共用同一套插件机制。

「小资源内联、大资源抽文件」的阈值由 `build.assetsInlineLimit`（默认 4096 字节）控制，是个顺手就能讲透的知识点。

## 6. 关于 Vite 8（本示例版本）

- 示例锁定 `vite@^8.0.0`（当前实测 `8.1.5`）。
- **Node 要求**：`^20.19.0 || >=22.12.0`（已丢弃 Node 18，升级前确认本机 Node 版本）。
- `vite.config.js` 里 `css.preprocessorOptions.scss.api: 'modern-compiler'` 这一行在 Vite 8 **必须保留**：Vite 7 起已彻底移除 Sass 的 legacy JS API，只有 modern 编译器能用；不写会报错或告警。
- 升级自旧大版本（5→8）时，本示例的极简配置基本无需改动，印证「构建工具配置向后兼容」是常态。

## 7. 下一步

回到 [阶段四总览](../README.md)，或进入 [阶段五：自动化测试](../stage-05-test/README.md) 为这条流水线加质量护城河。
