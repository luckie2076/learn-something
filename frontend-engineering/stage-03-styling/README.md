# 阶段三：样式工程化（CSS 预处理与后处理）

> 目标：理解「为什么原生 CSS 不够用」，以及预处理（Sass）、后处理（PostCSS）、生成式 / 原子化（Tailwind）分别在解决什么。
> 本阶段**只用各自的官方 CLI** 把工具本身讲透；它们如何被构建工具统一编排，留到阶段四。

> 注：Sass 与 postcss-cli 都会把 `@parcel/watcher`（原生文件监听库，仅用于 `--watch`）作为可选依赖拉进来。pnpm 11 要求显式批准带构建脚本的依赖，本阶段各子目录在自己的 `pnpm-workspace.yaml` 里用 `allowBuilds` 批准了它——这是 pnpm 11 下的标准做法，无需为它改工具或钉版本。

## 1. 为什么需要样式工程化

原生 CSS 在大项目里有三个典型痛点：

- **全局作用域**：所有类名共享一个全局命名空间，组件一多就命名冲突、样式互相覆盖。
- **没有变量 / 嵌套 / 复用**：颜色、间距只能到处复制粘贴；选择器层级写起来冗长重复。
- **浏览器前缀繁琐**：为兼容不同内核，要手写 `-webkit-`、`-ms-` 等前缀，且易漏。

于是出现三类工具，注意它们的**时机 / 思路不同**：

- **预处理（Pre-processor）**：在「写代码」阶段用更高级的语法（变量、嵌套、mixin），**构建前**先编译成普通 CSS。代表：Sass / Less。
- **后处理（Post-processor）**：对「已经生成的 CSS」再做转换，典型是 autoprefixer 按 caniuse 数据自动加前缀。代表：PostCSS。
- **生成式 / 原子化（Utility-first）**：不直接写样式规则，而是在标记上组合原子类（`flex p-4 bg-blue-500`），由构建步骤**扫描标记、只生成你用到的类**的 CSS。代表：Tailwind。

一句话区分：**预处理让你写得更爽，后处理让产出更兼容，生成式让你换一种写样式的思路。**

## 2. 三个独立可运行的示例

本阶段拆成三个互不依赖的子目录，各自一键可跑：

| 目录 | 类别 | 演示 | 运行 |
|------|------|------|------|
| [`sass/`](./sass/) | 预处理 | 变量 / 嵌套 / mixin 编译成普通 CSS | `pnpm build` |
| [`postcss/`](./postcss/) | 后处理 | autoprefixer 给 CSS 自动加厂商前缀 | `pnpm build` |
| [`tailwind/`](./tailwind/) | 生成式 / 原子化 | 官方 CLI 按需生成原子类 CSS（不依赖 PostCSS） | `pnpm build` |

各自进目录 `pnpm install && pnpm build` 即可。先分别理解三个工具「单独在做什么」，阶段四再讲它们如何被构建工具串成一条 pipeline。

### 串联体验（可选）

真实工程里 PostCSS 吃的就是 Sass 的产物。先编译 Sass，再把它的输出喂给 PostCSS：

```bash
cd sass && pnpm build          # 产出 sass/dist/style.css
cd ../postcss
npx postcss ../sass/dist/style.css -o dist/style.from-sass.css
```

对比 `dist/style.from-sass.css` 与 `sass/dist/style.css`，会看到 autoprefixer 基于「已编译好的普通 CSS」补上了厂商前缀——这正是阶段四构建工具内部做的事，只是那时由 loader 自动编排，不用手动串。

## 3. Tailwind：生成式 / 原子化框架（与 Sass 不是一回事）

前面 Sass 是「预处理器」、PostCSS 是「后处理器」，Tailwind 是**第三类：原子化 CSS 框架**。新手最容易把它和 Sass 混为一谈，但两者解决的问题层次不同：

- **Sass** 让你「写 CSS 的语法更爽」——变量、嵌套、mixin，但样式规则最终还是要你亲手写；
- **Tailwind** 让你「直接在标记上组合原子类」（`flex p-4 bg-blue-500`），由构建步骤**扫描标记、只生成你真正用到的那些类**的 CSS（按需生成，不会把整本样式表打进来）。

本示例用 **Tailwind 官方 CLI 独立运行**（见 `tailwind/`），不挂在 PostCSS 上——这样「生成式 / 原子化」这件事单独、好理解。跑 `pnpm build` 后看 `dist/output.css`：里面只有本例 `src/index.html` 用到的 `.flex` `.p-4` `.bg-blue-500` 等类，没有多余内容。

> 注：Tailwind 也能作为 PostCSS 插件接入（和 autoprefixer 同一条 pipeline）。两种接法本质一样，本阶段为降低认知负担故意分开讲。

## 4. 作用域：CSS Modules（概念，集成留到阶段四）

预处理 / 后处理 / 生成式解决「写法」「兼容」「思路」，但没解决「类名冲突」。
CSS Modules 的思路：构建时把 `import styles from './x.module.css'` 的类名哈希化成全局唯一，从机制上根治冲突。
它本身也常被归为「构建期处理」，所以**具体集成放到阶段四**讲，这里只需记住它的目标。

## 5. 下一步

进入 [阶段四：构建与打包](../stage-04-build/README.md)，看 Vite / Webpack 如何把本阶段的 Sass / PostCSS / Tailwind 与阶段二的 Babel 统一编排、打包输出。
