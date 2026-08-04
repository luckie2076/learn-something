# TypeScript：把错误提前到编译时

**为什么**：JS 是动态弱类型，错误往往要等到**运行时**才爆出来（用户那边才看到白屏）。
TS 把类型检查提前到**写代码 / 编译时**，并在编辑器里实时提示。大型项目里，类型即文档，重构时编译器会替你找出所有遗漏的调用点。

## 极简配置（见 `tsconfig.json`）
```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true,      // 严格模式，倒逼你处理 null/undefined
    "noEmit": true       // 只检查类型，真实产出交给 Vite/Webpack
  }
}
```

## 极简示例（`src/sum.ts`）
```ts
function sum(a: number, b: number): number {
  return a + b;
}
console.log(sum(1, 2));
```
把 `a` 传成字符串，编辑器与 `tsc` 会立刻报错——这就是"提前到编译时"。

## 怎么跑
```bash
pnpm install
pnpm typecheck      # 等价于 npx tsc --noEmit
```
正常无输出即类型通过；故意把参数改成非 `number` 再看报错，体会"编译期拦错"。
