import fs from 'node:fs'
import path from 'node:path'

// 一个兼容 Vite / Rollup / Rolldown 的「Markdown → JS 模块」插件。
//
// 设计原则（保证双环境可用）：
//   - 只使用 Rollup 标准钩子：resolveId / load / transform，不依赖任何 Vite 独有钩子。
//   - 出口是工厂函数，可接收选项。
//   - 用 hook filters 精准匹配 .md 文件，避免无谓处理。
//   - 不依赖 moduleParsed、不耦合输出钩子（这些都是 dev 环境不调用的）。
//
// 转换结果：每个 .md 文件变成一个 JS 模块，导出一个对象：
//   export const html  = '<h1>标题</h1>...'   // 极简 HTML（这里用转义文本演示，不引第三方 md 库）
//   export const raw   = '# 原始 markdown 文本'
//   export default { html, raw }
//
// 说明：为了"代码极简、仅用于演示"，我们不做真正的 markdown 解析，
// 而是用一段最朴素的规则把 '# 标题' 变成 <h1>。真实项目可接 markdown-it / marked。

function mdToHtml(md) {
  return md
    .split('\n')
    .map((line) => {
      const m = line.match(/^(#{1,6})\s+(.*)$/)
      if (m) {
        const level = m[1].length
        return `<h${level}>${m[2]}</h${level}>`
      }
      if (line.trim() === '') return ''
      return `<p>${line}</p>`
    })
    .join('\n')
}

export default function mdToJs(options = {}) {
  // include：额外需要处理的虚拟/特殊 id 前缀（本演示用不到，保留扩展性）
  const virtualPrefix = '\0md:'

  return {
    name: 'md-to-js',

    // resolveId：把 .md 文件标记为"交给本插件处理"
    // 这里直接返回原 id（带 \0 前缀也行，简单起见用原路径即可，
    // 因为 load 阶段用 fs 读取真实文件，不需要虚拟前缀）。
    // 注意：Rolldown/Vite 8 中 resolveId 的 filter.id 必须是正则。
    resolveId: {
      filter: { id: /\.md($|\?)/ },
      handler(id) {
        // 返回自身 id，让后续 load/transform 接管（等价于"认领"该模块）
        return id
      },
    },

    // load：读取 .md 文件原始内容
    load: {
      filter: { id: /\.md($|\?)/ },
      handler(id) {
        const cleanId = id.split('?')[0]
        const file = cleanId.startsWith(virtualPrefix)
          ? cleanId.slice(virtualPrefix.length)
          : cleanId
        if (!fs.existsSync(file)) return null
        const raw = fs.readFileSync(file, 'utf-8')
        // 先返回一个临时标记，真正的转换在 transform 做（演示流水线分离）
        return `export const __raw__ = ${JSON.stringify(raw)}`
      },
    },

    // transform：把原始 markdown 文本编译成最终 JS 模块
    transform: {
      filter: { id: /\.md($|\?)/ },
      handler(code, id) {
        const m = code.match(/export const __raw__ = (.*)/s)
        if (!m) return null
        const raw = JSON.parse(m[1])
        const html = mdToHtml(raw)
        const js = [
          `export const html = ${JSON.stringify(html)}`,
          `export const raw = ${JSON.stringify(raw)}`,
          `export default { html, raw }`,
        ].join('\n')
        return { code: js, map: null }
      },
    },
  }
}
