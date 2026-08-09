# TypeScript

TypeScript 语法与类型系统学习示例。

## 核心概念

TypeScript 是 JavaScript 的超集，在 JS 基础上添加了**静态类型系统**：

- **类型注解**：`: string`、`: number`、`: boolean` 等标记变量的预期类型
- **接口与类型别名**：定义复杂数据结构的形状
- **泛型**：编写可复用的类型安全代码
- **类型推断**：TS 自动推导类型，减少显式标注

## 文件说明

| 文件 | 说明 |
|------|------|
| `main.ts` | TypeScript 语法示例源码 |
| `main.js` | 编译后的 JS 产物 |
| `package.json` | 项目配置 |

## 运行方式

```bash
pnpm install
npx tsc main.ts && node main.js
```

或使用 `ts-node` 直接运行：

```bash
npx ts-node main.ts
```
