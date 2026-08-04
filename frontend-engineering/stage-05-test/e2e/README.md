# 端到端测试（E2E Testing）

> 本目录讲「测试金字塔」最顶层。配套是 **Playwright 配置 + 示例用例（讲解用）**，并非开箱即跑——E2E 要下载真实浏览器、还要有一个正在运行的站点当靶子，重量级，故只给范本。

## 1. 这一层在测什么

**E2E = 模拟真实用户在真实浏览器里的完整操作链路**：打开页面 → 输入账号 → 点登录 → 断言跳到了首页。它站在用户视角，验证「整条链路真的通了」，是离「上线后用户看到的东西」最近的一层。

工具：**Playwright** / **Cypress**。本示例用 Playwright。

## 2. 为什么它最「贵」

| 维度 | 单元测试 | 组件测试 | E2E |
|---|---|---|---|
| 速度 | 毫秒 | 百毫秒~秒 | 秒~分钟 |
| 稳定性 | 高 | 中 | 低（易 flaky：网络、动画、时序） |
| 覆盖 | 一个函数 | 一个组件 | 整条用户流程 |

所以经典「测试金字塔」：**E2E 最少、最珍贵**，只覆盖「核心、不能错」的少数流程（如登录、下单），其余交给又快又稳的单元 / 组件测试兜底。

## 3. 一个最小 Playwright 范本

`playwright.config.js`（指向一个已启动的站点）：

```js
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './specs',
  use: { baseURL: 'http://localhost:5173' }, // 你的 dev server 地址
});
```

`specs/login.spec.js`（用户视角的完整流程）：

```js
import { test, expect } from '@playwright/test';

test('登录后进入首页', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="user"]', 'alice');
  await page.fill('input[name="pass"]', 'secret');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/home');
  await expect(page.getByText('欢迎, alice')).toBeVisible();
});
```

## 4. 想真正跑起来

1. 装浏览器：`pnpm exec playwright install`（首次会下载 Chromium 等，体积大、需联网）。
2. 起一个被测站点（E2E 不自己造页面，它测「已存在的」应用）。
3. `pnpm exec playwright test`。

本仓库把它留作「配置范本 + 领域讲解」，因为真实 E2E 依赖你的业务页面，无法在通用教学示例里一键跑通——但这不妨碍你理解它的定位与写法。

回看 [`../component/`](../component/README.md)：组件测试是「单个组件」，E2E 是「整页串起来」。两者互补，不互相替代。
