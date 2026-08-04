# 预处理：Sass

演示**预处理**——用更高级的语法（变量、嵌套、mixin）写样式，**构建前**先编译成普通 CSS。

本目录刻意只用 `sass` CLI，不碰构建工具，所以能在阶段四之前把「Sass 本身在做什么」讲透。

## 运行

```bash
pnpm install
pnpm build      # src/style.scss -> dist/style.css
```

打开 `dist/style.css`：变量被替换成具体值、嵌套被展开成 `.card .title`、mixin 被内联进来。

## 看什么

`src/style.scss` 里用了：

- **变量** `$primary` / `$radius`：统一管理设计令牌，改一处生效全局。
- **嵌套** `.card { .title {} }`：结构即层级，省掉重复写选择器。
- **mixin** `@mixin flex-center`：复用一段样式，类似 JS 里的函数。

其中故意放了 `transform` / `transition` 这种需要厂商前缀的属性——它们**不是 Sass 的职责**，留给后处理（见 `../postcss/`）按浏览器兼容性补前缀。
