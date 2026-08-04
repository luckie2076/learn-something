import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dumpCompiled from '/Users/qiliu/workspace/test/dump-compiled.js'

// dumpCompiled：把「每个源文件编译后变成的 JS」按源码树平铺到 compiled/，
// 用的是 Vite 自己的产物（不是另写编译器），方便逐个对照。
export default defineConfig({
  plugins: [
    vue(),
    dumpCompiled()
  ]
})
