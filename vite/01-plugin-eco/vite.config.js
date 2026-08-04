import { defineConfig } from 'vite'

// 一个最小的 Vite 插件：什么都不做，只打印生命周期钩子被调用的时机。
// 注意：Vite 插件就是「带 name 和若干钩子的对象」，返回一个工厂函数便于接收配置。
function logLifecyclePlugin() {
  return {
    name: 'log-lifecycle',

    // 解析 Vite 配置前调用，可返回部分配置与用户配置合并
    config() {
      console.log('[hook] config')
    },

    // 配置解析完成后调用，可拿到最终配置
    configResolved(resolved) {
      console.log('[hook] configResolved -> root =', resolved.root)
    },

    // 每次构建/请求模块前调用
    buildStart() {
      console.log('[hook] buildStart')
    },

    // 构建/关闭时调用
    buildEnd() {
      console.log('[hook] buildEnd')
    },
  }
}

export default defineConfig({
  plugins: [logLifecyclePlugin()],
})
