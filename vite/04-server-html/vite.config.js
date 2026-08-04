import { defineConfig } from 'vite'

// 本单元演示 Vite 独有、Rollup 没有的两个钩子：
// 1) configureServer：给开发服务器加自定义中间件
// 2) transformIndexHtml：在构建/开发时改写 index.html

function devApiPlugin() {
  return {
    name: 'dev-api-and-html',

    // configureServer：操作 dev server 的 middleware，扩展接口
    configureServer(server) {
      // 在 Vite 自带中间件之前插入
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/hello') {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ msg: '来自开发服务器的接口', time: Date.now() }))
          return
        }
        next()
      })
    },

    // transformIndexHtml：注入标签 / 改写 HTML
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        // 在 <body> 开头注入一个提示标签
        return {
          html,
          tags: [
            {
              tag: 'div',
              attrs: { id: 'plugin-banner', style: 'color:#367;padding:8px' },
              children: `由插件注入（环境：${ctx.server ? 'dev' : 'build'}）`,
              injectTo: 'body-prepend',
            },
          ],
        }
      },
    },
  }
}

export default defineConfig({
  plugins: [devApiPlugin()],
})
