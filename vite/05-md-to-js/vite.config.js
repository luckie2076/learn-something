import { defineConfig } from 'vite'
import mdToJs from './plugin-md-to-js.js'

// 接入我们自写的 markdown 插件
export default defineConfig({
  plugins: [mdToJs()],
})
