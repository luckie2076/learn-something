# 包管理：为什么不能手动下 jQuery 了

**为什么**：早期把第三方库手动放进项目，版本靠手记、别人拉代码缺文件就跑不起来、同一库出现多份拷贝/版本冲突。包管理器把"依赖什么、用哪个版本"写成一份可声明清单（`package.json`），任何人 `install` 一遍就能还原完全一致的环境——这是"可复现环境"，工程化第一块基石。

## 核心概念
- **dependencies vs devDependencies**：前者运行时必需（如框架/库），后者仅开发/构建期用（如打包器）。上线只装前者能减小体积。
- **semver（`^1.2.3`）**：`^` 允许向后兼容的小版本升级；锁文件才是精确版本。
- **pnpm-lock.yaml**：锁死依赖树具体版本，保证团队装到同一份。务必提交进 git。

## 极简示例：安装并使用一个第三方包（真实闭环）

很多人以为 `pnpm add lodash` 之后代码就"自动用上"了——其实不是。`pnpm add` 只做两件事：把包装进 `node_modules/`、在 `package.json` 写一行记录。**真正"用"它，必须自己在源码里 `import`**。

`src/index.js`：
```js
import _ from 'lodash';
console.log(_.chunk([1, 2, 3, 4, 5], 2)); // 用第三方包
```

## 怎么跑
```bash
pnpm install
pnpm start
```
看到 `[[1,2],[3,4],[5]]` 即证明第三方包真被用上了。

> 区分两类依赖：**dependencies**（运行时，源码 import，打进产物）vs **devDependencies**（开发期，靠 npm script 调用，不进产物）。
