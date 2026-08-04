import { defineConfig } from 'vite'

// transform 钩子：对每个模块的源码做转换。
// 本例把 .toy 后缀（自定义语言）的「文件」在内存里编译成 JS。
// 为了演示纯粹，我们用虚拟模块提供 .toy 内容，再让 transform 处理它。
function toyLangPlugin() {
  const virtualId = 'virtual:data.toy'
  const resolvedId = '\0' + virtualId

  return {
    name: 'toy-lang',
    enforce: 'post',
    
    resolveId: {
      filter: { id: /^virtual:data\.toy$/ },
      handler(id) {
        if (id === virtualId) return resolvedId
      },
    },

    load: {
      filter: { id: /virtual:data\.toy/ },
      handler(id) {
        if (id.includes('virtual:data.toy')) {
          // 一段"玩具语言"：每行 key=value，编译成 JS 对象
          return `export const msg = "你好，我是一个虚拟模块"`
        }
      },
    },

    // transform：只处理 .toy 后缀（含虚拟模块的内部 id 也以 .toy 结尾）
    transform: {
      // filter: { id: /\.toy$/ },
      handler(code, id) {
        // if (!id.endsWith('.toy')) return null
        // const obj = {}
        // for (const line of code.split('\n')) {
        //   const [k, v] = line.split('=')
        //   if (k && v !== undefined) obj[k.trim()] = v.trim()
        // }
        // const js = `export default ${JSON.stringify(obj)}`
        // return { code: js, map: null }
        console.log('transform id: ',  id)
        return { code, map: null }
      },
    },
  }
}

export default defineConfig({
  plugins: [toyLangPlugin()],
})
