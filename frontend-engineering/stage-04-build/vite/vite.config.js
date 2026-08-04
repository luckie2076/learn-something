// Vite 配置：极简骨架（ESM，对应 package.json 的 "type": "module"）。
// 我们几乎不用写什么——Vite 自动做了三件关键的事（见 README 的「编排表」）：
//   1) 用 Oxc 转译 TS / 新语法；
//   2) 遇到 .scss 自动调用 sass 编译；
//   3) 自动读取本目录的 postcss.config.js，跑 autoprefixer。
// CSS Modules 则靠文件名约定（*.module.scss）自动开启，无需额外配置。
import { defineConfig } from 'vite';

export default defineConfig({
  build: { outDir: 'dist' },
  // 用 Sass 的现代编译器 API，避免 "legacy-js-api" 弃用警告。
  css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } },
});
