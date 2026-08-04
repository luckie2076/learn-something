# ESLint + Prettier：统一"对不对"与"丑不丑"

**为什么**：
- **ESLint** 管"对不对 / 有没有隐患"（如未使用变量、用了 `var`）；
- **Prettier** 管"丑不丑"（换行、引号、分号），纯格式，不争论。
两者分工明确，避免"该管风格的去管逻辑"的冲突。

## 极简配置
`.eslintrc.json`：
```json
{
  "root": true,
  "env": { "browser": true },
  "parserOptions": { "ecmaVersion": 2022 },
  "extends": ["eslint:recommended", "prettier"],
  "rules": { "no-var": "error" }
}
```
`.prettierrc`：
```json
{ "singleQuote": true }
```
> `eslint-config-prettier` 必须加在 extends 末尾，作用是**关掉 ESLint 里和 Prettier 冲突的格式规则**，否则两者会为"该不该加换行"吵起来。

## 极简示例（`src/sample.js`）
```js
var unused = 1;     // ESLint 报错：用了 var + 变量未使用
const x = 2
console.log(x)
```

## 怎么跑
```bash
pnpm install
pnpm lint          # ESLint 检查（应报错，演示"拦下问题"）
pnpm format        # Prettier 自动格式化
```
跑 `pnpm lint` 会看到 `var` 和未使用变量被拦下——这就是"对不对"由机器把关。

> 下一步可加 Husky + lint-staged，让这些检查在每次 `git commit` 前自动跑（属于工程化协作层，本阶段不展开）。
