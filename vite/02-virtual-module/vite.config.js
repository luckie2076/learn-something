import { defineConfig } from 'vite'

// 虚拟模块插件：当代码里 import 'virtual:hello' 时，
// 并不去文件系统找文件，而是由插件在内存里"凭空"提供一个模块。
function virtualHelloPlugin() {
  const virtualModuleId = 'virtual:hello'
  const resolvedId = '\0' + virtualModuleId // \0 前缀是虚拟模块约定，避免与真实文件冲突

  return {
    name: 'virtual-hello',

    // resolveId：把 import 的 id 解析成内部 id
    // 注意：Rolldown/Vite 8 中 resolveId 的 filter.id 必须是正则（import 说明符不是已解析路径）
    resolveId: {
      filter: { id: /^virtual:hello$/ },
      handler(id) {
        if (id === virtualModuleId) return resolvedId
      },
    },

    // load：根据内部 id 提供模块内容
    // Rolldown 传给 load 的 id 是 '\0virtual:hello'（含 \0 前缀），
    // 用"包含 virtual:hello"的正则即可稳定命中，避免 \0 转义问题。
    load: {
      filter: { id: /virtual:hello/ },
      handler(id) {
        if (id.includes('virtual:hello')) {
          return `export const msg = "你好，我是一个虚拟模块"`
        }
      },
    },
  }
}

export default defineConfig({
  plugins: [virtualHelloPlugin()],
})
