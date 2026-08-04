# Tailwind 极简示例（独立 CLI）

演示 Tailwind 作为**独立的原子化框架**：用官方 CLI 直接生成 CSS，不依赖 PostCSS。

```bash
pnpm install && pnpm build
```

产物 `dist/output.css` 里会包含 `.flex` `.p-4` `.bg-blue-500` 等**只针对本例用到类**生成的一段 CSS——这就是 Tailwind「按需生成」的核心：你写原子类，它只产出你真正用到的样式，不会把整本样式表都打进来。

> 关于「HTML 为何不引 CSS」：`src/index.html` 在本例里只是 Tailwind 的**扫描来源**（用来探测类名），不是最终要在浏览器打开的页面。`pnpm build` 产出的是 `dist/output.css` 这一份「样式表」。想真正看到样式效果，要么手动在页面里 `<link rel="stylesheet" href="dist/output.css">`，要么交给阶段四的 Vite——它会在打包时自动把 CSS 接到 HTML 上。本示例刻意只演示「按需生成 CSS」这一半。

> 注：Tailwind 也能作为 PostCSS 插件接入（和 autoprefixer 同 pipeline），本示例特意用独立 CLI，是为了让「生成式 / 原子化」这件事单独、好理解。两种接法本质一样。
