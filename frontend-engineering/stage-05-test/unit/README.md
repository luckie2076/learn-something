# 单元测试（Unit Testing）

> 本目录是「测试金字塔」最底层、也最该写最多的那一层。配套可运行示例见 `src/math.test.js`。

## 1. 这一层在测什么

**单元测试 = 测一个函数 / 一个类的最小单元**，不依赖数据库、网络、UI。它有两个特征：

- **快**：纯内存计算，毫秒级，能放进每次存盘的热循环。
- **稳**：不碰外部，不会因为「网络抖了一下」而随机失败（这种情况叫 flaky test，最坑人）。

## 2. 该测什么、不测什么

- **该测**：有逻辑分支、容易写错、容易随需求变化的代码。比如折扣计算、表单校验、状态机。
- **不测**：纯转发、纯 getter、第三方库内部——这些没有「你的逻辑」，测了也是凑覆盖率。

一句话：**测「决策」，不测「管道」**。覆盖率数字高 ≠ 质量高，重点在覆盖「容易错的地方」。

## 3. 工具：Vitest 速览

- Vitest 是 Vite 生态的测试器，**配置几乎为零**（复用 Vite 的解析、TS、路径别名）。
- 核心 API 三件套：
  - `describe(title, fn)`：把一组相关测试分组（仅组织用）。
  - `it(title, fn)` / `test(title, fn)`：一条测试用例。
  - `expect(actual).toBe(expected)`：断言；还有 `.toEqual`、`.toThrow`、`.toBeTruthy` 等。
- 红 → 绿循环：先写一个会失败的测试（红），再写/改实现让它通过（绿）——这保证「测试真的在测东西」，而不是永远绿的无用断言。

## 4. 动手跑

```bash
pnpm install
pnpm test          # 一次性跑完（CI 用）
pnpm test:watch    # 存盘即重跑（开发用）
```

观察点：

- 终端显示 `6 passed`，每条 case 名都列出来。
- 故意把 `math.js` 里 `1 - rate` 改成 `rate` 再跑，会看到红色失败与具体挂掉的断言——这就是「测试替你守门」。
- 本目录同样是独立 pnpm 工作区。注意 `pnpm-workspace.yaml` **没有** `allowBuilds` 配置——因为本示例用的是 **Vitest 4（底层 Vite 8）**，而 Vite 8 用 Rust 写的 **Rolldown** 替代了旧版的 esbuild，且 Rolldown 的原生二进制是**预编译分发**的、没有需要 pnpm 批准的构建脚本。这正好和阶段三/四「原生依赖这道闸」形成对照：esbuild 时代那行 `allowBuilds` 在 Vite 8 下已不再需要。

下一层看 [`../component/`](../component/README.md)：当被测对象从「函数」变成「渲染出来的 UI」时，测试该怎么写。
