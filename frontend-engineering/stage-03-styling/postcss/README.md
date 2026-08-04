# 后处理：PostCSS + autoprefixer

演示**后处理**——对「已经生成的 CSS」再做转换，典型是 autoprefixer 按 caniuse 数据自动加厂商前缀。

本目录用官方 **`postcss` CLI**（postcss-cli）跑标准流程，不自己写脚本；autoprefixer 作为插件在 `postcss.config.js` 里声明。

> 注意：postcss-cli v11 只自动加载 `postcss.config.js`（或 `.cjs`），不会加载 `.json` 配置。这个 `.js` 配置也正是阶段四 Vite 读取的格式，保持统一。

## 运行

```bash
pnpm install
pnpm build      # src/style.css -> dist/style.prefixed.css（autoprefixer 加前缀）
```

对比 `src/style.css` 和 `dist/style.prefixed.css`，看 `display:flex` / `transform` / `user-select` 多了哪些 `-webkit-` / `-ms-` 前缀。

## 看什么

- 目标浏览器由 `package.json` 的 `browserslist` 决定；autoprefixer 通过 `postcss.config.js` 接入。
- 这里输入的是一份普通 CSS（模拟 Sass 编译出来的产物），说明后处理和「CSS 是怎么来的」无关，只管「产出后要兼容」。

> 真实工程里，PostCSS 吃的一般就是 Sass 的产物（同一个 pipeline 串起来），具体怎么被构建工具编排，留到阶段四。
