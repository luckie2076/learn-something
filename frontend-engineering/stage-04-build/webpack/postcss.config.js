// 和阶段三、Vite 同一份逻辑：PostCSS 读取它、跑 autoprefixer。
// 这里用 CJS（本目录 package.json 未设 "type": "module"，webpack.config.js 也是 CJS）。
module.exports = { plugins: [require('autoprefixer')] };
