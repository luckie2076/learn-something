# learn-js

JS 渐进式学习练习。每个文件聚焦一个主题，代码刻意保持极简，**重点在注释里讲清「为什么这样做」**，而不是罗列语法用法。

> 学习顺序建议按文件编号从 0 到 14 依次看。它们是一个由「世界观 → 数据 → 组织 → 交互 → 异步」的递进关系。

## 文件导览

| 文件 | 主题 | 核心「为什么」 |
| ---- | ---- | ------------ |
| [`00-env.html`](00-env.html) | 环境与运行 | 为什么 `<script>` 有内联/外部两种？为什么推荐外部文件（关注点分离）。`console.log` 是什么——它是你「看」程序的眼睛。脚本位置为什么影响能否拿到元素。 |
| [`01-values.html`](01-values.html) | 值与类型 ★ | 为什么 JS 是动态弱类型？原始类型（number/string/boolean/null/undefined…）。为什么 `1 + "1" === "11"`（隐式转换陷阱）。`typeof null` 的著名坑。 |
| [`02-variables.html`](02-variables.html) | 变量声明 | 为什么现在用 `let`/`const` 而非 `var`（块级作用域、暂时性死区）。为什么「默认用 `const`」能提升可预测性。 |
| [`03-operators.html`](03-operators.html) | 运算与比较 | 为什么 `===` 比 `==` 安全（不偷偷转换类型）。逻辑运算「短路」为什么能优雅给默认值、避免报错。 |
| [`04-control-flow.html`](04-control-flow.html) | 控制流 | `if`/三元、`for`/`while`/`for...of`。为什么需要循环——把「重复」抽象成一条规则。 |
| [`05-functions.html`](05-functions.html) | 函数 ★核心 | 为什么需要函数（复用 + 抽象）？声明 vs 表达式。为什么 JS 函数是「一等公民」（能当值传）。箭头函数 `this` 与普通函数的差异。 |
| [`06-scope-closure.html`](06-scope-closure.html) | 作用域与闭包 ★难点 | 为什么有作用域（变量的可见边界=安全）。词法作用域：看写在哪里而非调在哪里。闭包为什么能实现「私有数据」。 |
| [`07-arrays-objects.html`](07-arrays-objects.html) | 数组与对象 ★ | 为什么需要复合类型。对象=聚合相关数据的键值对；数组=有序集合。为什么用 `map`/`filter`/`reduce` 而非手写 `for`（表达意图、不变性）。 |
| [`08-dom.html`](08-dom.html) | DOM 操作 | 为什么 JS 能「动」网页——DOM 是 HTML 的编程接口。`querySelector` 选元素，改内容/样式。与 HTML 语义化、CSS 选择器的呼应。 |
| [`09-events.html`](09-events.html) | 事件 | 为什么用 `addEventListener` 而非内联 `onclick`（结构行为分离）。事件冒泡与「委托」为什么高效（一个监听管所有子元素）。 |
| [`10-async.html`](10-async.html) | 异步与 Promise ★难点 | 为什么单线程也能并发（事件循环）。回调地狱的痛点。Promise 为什么出现。`async/await` 为什么读起来像同步。 |
| [`11-modules.html`](11-modules.html) | 导入 JS 的方式对比（配 [`11-classic.js`](11-classic.js)、[`11-math.js`](11-math.js)） | 经典 `<script src>`（全局、污染）vs 模块 `type="module"`+`import`（私有、隔离、需服务器）vs 动态 `import()`（按需、运行时）。模块必须用本地服务器打开。 |

### 可选进阶（按需补充）

- `12-localStorage.html` — 本地持久化：为什么变量刷新就没了，`localStorage` 如何跨刷新保存（只能存字符串，对象需 `JSON.stringify`）。
- `13-fetch.html` — 网络请求：`fetch` 返回 Promise，配合 `async/await` 取 JSON 数据。
- `14-class.html` — 面向对象语法糖：`class` 作为「模板」批量造对象；`this` 与 `extends` 继承。注意 JS 的 class 仍是原型继承的语法糖。

## 一条贯穿始终的主线

JS 的难点不在于「有多少语法」，而在于三条主线，掌握它们后其余都是「锦上添花」：

1. **值与类型** —— 你操作的「原料」到底是什么，为什么弱类型既灵活又危险（隐式转换）；
2. **作用域与执行流** —— 变量在哪里可见、代码谁先谁后执行（含闭包这一关键机制）；
3. **异步与事件循环** —— JS 单线程却能「同时」做事，这是它最难也最关键的认知。

> 与 HTML/CSS 的呼应：HTML 给「结构（语义）」、CSS 给「表现（样式）」、JS 给「行为（交互）」。本组练习在 **08 DOM** 一节让三者合流——JS 通过 DOM 这棵树去读/改 HTML，并借 CSS 选择器语法来定位元素。这也是为什么建议先学完 `learn-html` 与 `learn-css` 再来这里。
