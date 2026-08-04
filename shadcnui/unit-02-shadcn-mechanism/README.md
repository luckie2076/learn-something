# 单元 02 · shadcn/ui 的运行机制

> 前置：单元 01 已搭好 Vite + React 19 + TS + Tailwind v4 的最小工程。本单元在此之上，接入 shadcn/ui，并解释它**到底是什么、为什么这么设计**。

## 现象：一句命令，项目里多了一个文件

在终端执行：

```bash
npx shadcn@latest init     # 初始化：生成 components.json、lib/utils.ts，写入设计令牌
npx shadcn@latest add button   # 添加一个组件
```

之后，你的项目里会出现 `src/components/ui/button.tsx`。**它不是 `node_modules` 里的依赖包，而是真实落在你项目目录中的源码文件。**

试着打开它、改它、删它——你拥有它。这就是 shadcn/ui 与 Ant Design、MUI 这类「组件库」最根本的区别。

## 原理：shadcn/ui 不是「库」，是「代码复制器」

### 1. 它为什么选择「复制代码」而不是「发布 npm 包」？

传统组件库把你锁死在它的 API 与更新节奏上：想改一个内边距？得等官方发版或用笨拙的覆盖样式。
shadcn/ui 反其道而行——它把组件源码直接放进**你的**项目。于是：

- **完全可控**：组件就是你的代码，想怎么改就怎么改，没有黑箱。
- **没有版本枷锁**：不存在「升级 shadcn 导致样式崩了」，因为代码已在你手里。
- **可访问性内置**：底层建立在 [Radix UI](https://www.radix-ui.com/) 原语上（键盘导航、焦点管理、ARIA 都已处理好），你拿到的是「半成品的高级组件」。

代价是：你要负责这些代码（但本就是你想改才用它）。

### 2. `components.json` 是 CLI 的「地图」

CLI 需要知道：组件往哪写？用什么风格？`@/components` 这种别名指向哪？这些都在 `components.json`（本单元根目录）里声明：

```json
{
  "style": "new-york",        // 视觉风格，本教学采用 new-york（基于 cva 变体系统）
  "rsc": false,               // 是否用于 React Server Components（Vite SPA 用 false）
  "tsx": true,                // 生成 .tsx 而非 .jsx
  "tailwind": {
    "config": "",             // ★ Tailwind v4 是 CSS-first，没有 JS 配置文件，故留空
    "css": "src/index.css",   // 设计令牌写在哪个 CSS 文件
    "baseColor": "neutral",   // 基础色板（决定令牌的初始色值）
    "cssVariables": true,     // 用 CSS 变量承载颜色（实现主题/暗色切换的前提）
    "prefix": ""
  },
  "aliases": {                // CLI 用它把 @/components、@/lib/utils 等解析到正确路径
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"     // 组件里用到的图标来自 lucide-react
}
```

> 注意：`aliases` 与 `tsconfig.json` 的 `paths` 要对应（本单元都已配好 `@/*`）。CLI 靠它生成正确的 import 路径。

### 3. 三个库如何协作（每个组件背后的「三件套」）

以 `src/components/ui/button.tsx` 为例，它同时用到了：

| 库 | 角色 | 在本组件里做什么 |
| --- | --- | --- |
| **Radix UI**（`@radix-ui/react-slot`） | 无障碍原语 | `asChild` 让你用 `<Button asChild><a/></Button>` 把样式套到 `<a>` 上，保留链接语义 |
| **cva**（`class-variance-authority`） | 变体管理 | 把 `variant`/`size` 映射成一组 Tailwind 类，避免写一堆 `if/else` 拼接字符串 |
| **cn**（`clsx` + `tailwind-merge`） | 类名合并 | 合并你传入的 `className` 与组件默认类，且自动解决冲突（如 `p-2` 与 `p-4`） |

三者分工：**Radix 管「行为/语义」、cva 管「变体/外观组合」、cn 管「类名最终怎么拼」**。

## 代码：本单元新增了什么

1. **`components.json`** — 上面已拆解。
2. **`src/lib/utils.ts`** — `cn()` 工具：

   ```ts
   import { clsx, type ClassValue } from "clsx"
   import { twMerge } from "tailwind-merge"
   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs))
   }
   ```

   `clsx` 负责「条件类名」（`cn("a", cond && "b")`），`tailwind-merge` 负责「冲突消解」（`cn("p-2", "p-4")` 结果只有 `p-4`）。组件里所有类名合并都走它。
3. **`src/index.css`** — 设计令牌（颜色用 **OKLCH** 颜色空间，亮/暗两套），并用 `@theme inline` 把变量暴露成 Tailwind 工具类（`bg-background` 等），用 `@custom-variant dark` 让 `.dark` 类触发暗色。
4. **`src/components/ui/button.tsx`** — 被「复制」进来的 Button 源码（详见下方逐行说明与单元 03）。

## 为什么是这些细节（关键机制）

- **为什么 Tailwind v4 的 `config` 留空？** v4 改为 CSS-first：配置写在 CSS 里（`@import "tailwindcss"` + `@theme`），不再需要 `tailwind.config.js`。shadcn 据此把令牌放进 `index.css`。
- **为什么颜色用 CSS 变量 + OKLCH？** 组件只引用语义名（`bg-primary`、`text-muted-foreground`），不直接写死色值。换主题/切暗色 = 改 `:root` / `.dark` 里的变量，组件代码一行都不用动。OKLCH 是更现代的感知均匀色彩空间，过渡更自然。
- **为什么 `asChild` 重要？** 它让「样式」与「元素/组件」解耦：同一个按钮外观，可以套在 `<button>`、`<a>`、`<Link>` 上，无需为每种场景重写样式。这是 shadcn 组件可组合性的基石。

## 下一步

单元 03 将**逐行解剖** `button.tsx`：cva 的 `variants` / `defaultVariants` 是怎么工作的，`buttonVariants()` 为什么能当函数直接调用，以及 `asChild` + Radix Slot 的组合模式细节。

> 拓展：`new-york` 是经典、基于 cva 的风格，最适合讲解变体机制；shadcn 也有更新的 `base-nova` 风格（写法更原子化），可在官方文档了解，本教学统一以 new-york 为例。
