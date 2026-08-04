# 脚手架（Scaffolding CLI）

> 把团队的工程规范「产品化」：一条命令生成一个标准项目，避免十个项目十种配置。

## 1. 这个示例在演示什么

`index.js` 是一个**最小可运行的脚手架 CLI**，它做的事就是脚手架的本质：

1. 准备好一份**项目模板**（`template/` 目录）；
2. 把模板**复制到目标路径**；
3. 把模板里的占位符 `__PROJECT_NAME__` **替换**成实际项目名。

全程只用了 Node 内置模块（`node:fs` / `node:path` / `node:url`），**零第三方依赖**——所以本目录不需要 `pnpm install` 也能直接跑，也不需要 `allowBuilds` 批准任何原生二进制（对比阶段五 Vitest4/Vite8 示例里 Rolldown 那种预编译二进制）。

## 2. 怎么跑

```bash
cd scaffold/
node index.js /tmp/my-app      # 在 /tmp/my-app 生成项目骨架
# 生成的文件：
#   /tmp/my-app/package.json   （name 已替换成 my-app）
#   /tmp/my-app/src/index.js
#   /tmp/my-app/README.md
cat /tmp/my-app/package.json   # 验证 __PROJECT_NAME__ 已被替换
```

如果你把它当真 CLI 发布/链接（`package.json` 里已声明 `bin: create-my-app`），也可以 `pnpm link --global` 后全局调用 `create-my-app <目录>`——本示例聚焦核心逻辑，这一步省略。

## 3. 为什么需要脚手架（回到「为什么」）

每个新项目都要重复配 TS、ESLint、Vite、目录结构……这些步骤**和具体业务无关，却每次都要做**。脚手架把它们**一次性固化成模板**，价值在于：

- **规范统一**：所有人生成的项目结构/配置一致，降低协作成本；
- **降低门槛**：新人不用懂整套工程配置也能起项目；
- **可演进**：规范升级时改一处模板，全公司受益。

## 4. 真实脚手架长什么样（本示例没做的部分）

为了「极简跑通」，这里只实现了最核心的「拷贝 + 替换」。真实脚手架还常包含：

- **交互式提问**：用 `prompts` / `inquirer` 让用户选择「要不要 TS / 用哪个框架」，再决定拷哪份模板；
- **更复杂的模板引擎**：用 `ejs` / `handlebars` 做条件分支、循环，而不只是字符串替换；
- **现成方案**：`create-vite`（Vite 官方）、`plop`（按问答生成代码片段）、`hygen` 等，都是「脚手架思想」的成熟实现。

一句话：**脚手架 = 把「新建项目」这个重复动作，固化成一个可复用的命令。** 本示例让你看清它最底层的机制——其实就是一个带变量替换的文件拷贝器。
