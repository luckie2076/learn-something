// 注意：阶段三里我们要手动 `npx postcss` 去跑这份配置；到了构建工具里，Vite 会自动读取它、
// 把 autoprefixer 接进流水线——这正是「阶段三的产物被构建工具收编」的体现。
// 这里用 ESM（和本项目的 "type": "module" 一致）；阶段三用的是 CJS，两种格式 Vite 都能读。
import autoprefixer from 'autoprefixer';

export default {
  plugins: [autoprefixer],
};
