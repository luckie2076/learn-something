# 阶段七：CI/CD 与部署

> 目标：让"提交代码"自动完成 检查 → 测试 → 构建 → 发布，减少人为失误。

## 1. 为什么需要 CI（持续集成）

**为什么**：靠人本地跑 lint/test 再提交，总会有人忘。CI 在**每次 push / PR 时**自动在干净环境里跑一遍，
不通过的代码不准合入，等于给仓库安了一道"自动门禁"。

```yaml
# .github/workflows/ci.yml（GitHub Actions 极简）
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm lint && pnpm test && pnpm build
```

## 2. 为什么要 CD（持续部署）

**为什么**：手动打包、scp 上传、改 Nginx 配置，既慢又容易出错。CD 让**通过 CI 的代码自动上线**，
发布变成"点一下"或"合入即发"，可重复、可回滚。

- **自动发布版本**：changesets / semantic-release 根据约定式提交自动算出版本号、生成 changelog、打 tag、发包。
- **容器化**：用 Docker 把"应用 + 运行环境"打包成镜像，告别"我本地能跑"。

```dockerfile
# Dockerfile（极简）
FROM nginx:alpine
COPY dist /usr/share/nginx/html
```

## 3. 部署形态
- 静态资源：放到 Nginx / CDN / 对象存储（前端大多场景）。
- 前后端分离：前端静态托管，接口走独立服务，通过反向代理或网关串起来。

## 动手建议
给阶段四的 Vite 项目加一个 GitHub Actions，push 时自动 `build` 并把 `dist` 部署到 GitHub Pages。

## 下一步
完成后进入 [阶段八：进阶架构与性能优化](../stage-08-advanced/README.md)。
