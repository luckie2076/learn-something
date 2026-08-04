// Webpack 配置：经典「打包器」模型。
// 对照 Vite 看，这里没有「开箱即用」的自动编排，每一件事都要你显式写一条 rule / plugin。
// 但好处是：你能清楚看到「TS / Sass / 图片 / JSON 分别是被谁、怎么变成 JS 模块的」。
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // entry：依赖图的起点（对应 Vite 自动以 index.html 里的 <script> 为入口）
  entry: './src/main.ts',
  // output：产物写到哪
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    assetModuleFilename: 'assets/[name].[contenthash][ext]',
    clean: true, // 每次构建先清空 dist/
  },
  // resolve：Webpack 自己的「resolveId」——补全扩展名、配别名都在这
  resolve: { extensions: ['.ts', '.js'] },
  module: {
    // rules = loader 流水线。loader 干的事 ≈ Rollup 的 load + transform 合体：
    // 「读取某类文件的原始内容，并把它转成 JS 模块」。
    rules: [
      // TS → JS（loader 只转译、不打包；打包是 Webpack 核心的活）
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
      },
      // Sass 流水线，loader 从右往左执行：
      //   sass-loader（.scss → css）→ postcss-loader（autoprefixer 加前缀）
      //   → css-loader（处理 @import / CSS Modules）→ MiniCssExtractPlugin.loader（抽成独立 .css）
      // modules.auto:true 让 css-loader 自己判断：文件名带 .module. 的走 CSS Modules（类名哈希）、
      // 否则当全局样式——于是「全局 scss」和「.module.scss」用同一条 rule 即可，无需 oneOf 分流。
      // namedExport:false 保证 `import styles from` 能拿到整个类名映射（默认导入不为 undefined）。
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // 把 CSS 抽成独立 .css 文件（对应 Vite build 抽 CSS）
          { loader: 'css-loader', options: { modules: { auto: true, namedExport: false } } },
          'postcss-loader',
          'sass-loader',
        ],
      },
      // 图片：Webpack 5 内置的 asset 模块，无需额外 loader。
      // type:'asset' + dataUrlCondition：小于 4KB 内联成 data URL，否则抽成独立文件
      // —— 和 Vite 的 assetsInlineLimit 行为一致。
      {
        test: /\.png$/,
        type: 'asset',
        parser: { dataUrlCondition: { maxSize: 4096 } },
      },
      // JSON：Webpack 5 原生支持，连 loader 都不用写（和 import scss 共用同一套「非 JS → JS」机制）
    ],
  },
  // plugin：loader 管「单个文件怎么转」，plugin 管「打包全流程里更复杂的事」。
  // - HtmlWebpackPlugin：自动生成 index.html 并注入 bundle / link。
  // - MiniCssExtractPlugin：把 CSS 从 JS 里抽出来，产出独立的 .css 文件（loader 提取、plugin 产出）。
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({ filename: 'assets/[name].[contenthash].css' }),
  ],
  devServer: { port: 8080 },
};
