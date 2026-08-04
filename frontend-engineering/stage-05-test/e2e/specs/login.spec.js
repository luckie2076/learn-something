import { test, expect } from '@playwright/test';

// 范本用例：用户视角的完整登录流程。需先有对应页面与 dev server 才能跑。
// 运行：pnpm exec playwright install && pnpm test（详见本目录 README.md）。
test('登录后进入首页', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="user"]', 'alice');
  await page.fill('input[name="pass"]', 'secret');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/home');
  await expect(page.getByText('欢迎, alice')).toBeVisible();
});
