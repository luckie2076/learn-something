import { defineConfig } from '@playwright/test';

// 范本配置：指向一个「已经在运行的站点」。E2E 测的是已存在的应用，不自己造页面。
// 真正使用时，把 baseURL 改成你的 dev server 地址（如 http://localhost:5173）。
export default defineConfig({
  testDir: './specs',
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
});
