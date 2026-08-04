# 阶段 1：Vue 核心 —— 响应式 + 模板

本目录是一个**最小可运行骨架**，已配好最新 Vite 8 + Vue 3.5（具体版本见 `package.json`）。运行方式：

```bash
cd stage-1-core
npm install      # 或 pnpm install
npm run dev      # 启动后打开终端里的本地地址
```

> 前置要求：Vite 8 需要 Node ≥ 20.19 或 ≥ 22.12，先 `node -v` 确认版本。安装通常无需额外审批（默认依赖 `rolldown`/`lightningcss` 均为预编译二进制）；若用 pnpm 11 遇到"构建脚本未审批"提示，按提示允许相关原生依赖的构建即可（这是包管理器的安全机制，不是代码错误）。

目录里关键文件：`index.html`（入口）、`src/main.js`（创建应用）、`src/App.vue`（第一个组件）。你可以直接改 `App.vue` 看效果。

## 1. 创建应用（三行核心）
```js
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).mount('#app')   // 把 App 组件挂到页面 #app 上
```

`mount('#app')` 就是把 Vue 生成的 DOM 塞进 `index.html` 里那个 `<div id="app">`。**这里就是 Vue 与 HTML 的连接点**——Vue 最终产出的还是真实 DOM 节点。

## 2. 模板语法速览
模板本质就是"带特殊标记的 HTML"，Vue 编译它成 JS：

```vue
<template>
  {{ msg }}                 <!-- 插值：显示变量 -->
  <button @click="count++">+</button>   <!-- v-on 缩写 @：事件 -->
  <img :src="url" />        <!-- v-bind 缩写 :：动态属性 -->
  <p v-if="show">可见</p>   <!-- 条件渲染 -->
  <li v-for="i in 3" :key="i">{{ i }}</li>  <!-- 列表渲染 -->
  <input v-model="msg" />   <!-- 双向绑定：输入即改数据 -->
</template>
```

**为什么用这些指令**：因为直接写原生 `onclick=` 或手动 `innerHTML` 又要回到"命令式搬运"的老路；指令让"数据↔视图"的关系声明在模板里，由 Vue 接管同步。

## 3. 响应式：`ref` / `reactive`
```vue
<script setup>
import { ref, reactive } from 'vue'

const count = ref(0)          // 基本类型用 ref，访问要 .value
const state = reactive({ n: 1 }) // 对象用 reactive，直接 state.n
</script>
```

**为什么需要它们**：普通对象 `let x = 0; x++` 改了，没有任何机制知道"该去更新界面"。`ref`/`reactive` 给数据套了一层"可被追踪"的外壳，Vue 才能在你改数据时自动刷新视图。

## 4. 原理小灶：响应式背后就是 `Proxy`（看 Vue 怎么"变成三件套"）
Vue3 用 JS 原生 `Proxy` 拦截数据的读写，实现"数据变了就通知视图"：

```js
// 一个极简响应式演示（不是 Vue 源码，但原理一致）
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(key)                 // 读取时：记录"谁在用这个数据"
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      Reflect.set(target, key, value, receiver)
      trigger(key)               // 写入时：通知所有用到它的地方更新
      return true
    }
  })
}
```

这就是关键：**Vue 没有发明新语言，它用原生 JS 的 `Proxy` + 观察者模式，做到了"数据→视图"的自动同步，最终还是调用原生 DOM API 去改页面**。所以"Vue 怎么变成三件套"——它底层就是三件套，只是帮你想到了你不想手写的那部分。

## 附录：看编译产物，理解 Vue 的实现

想知道 Vue 到底怎么工作，最好的办法是**看它把每个源文件编译成了什么**。本项目用一个走真实 Vite 编译管线的小插件（不是另写编译器，比任何手写的 `compile.js` 都权威）：

- **`compiled/`**：由 `dump-compiled` 小插件生成，**镜像 `src/` 源码树，每个源文件一个编译后的 `.js`**——你最想要的"每源文件一个产物"。

### 三层目录的关系

| 目录 | 角色 | 谁生成 |
|---|---|---|
| `src/` | 源码（你手写的那层：.vue / .css / .js） | 你 |
| `compiled/` | **中间产物**：`src/` 里每个文件编译成的 JS，按源码树一一对应 | `npm run dev` / `npm run build`（dump-compiled 插件） |
| `dist/` | 最终打包结果：可直接部署的 bundle | `npm run build`（Vite） |

### 怎么看"每个文件被编译成了什么 JS"

**看 `compiled/` 目录（最直接）**

```bash
npm install      # 装依赖
npm run dev      # 或 npm run build
```

跑完之后，项目里会出现 `compiled/`，它和 `src/` 结构一一对应，每个源文件都变成了一个 `.compiled.js`：

```
src/                        compiled/
├── App.vue        →        ├── App.vue.compiled.js      （组件对象：setup() + render()）
├── main.js        →        ├── main.js.compiled.js       （原样复制）
├── style.css      →        ├── style.css.compiled.js     （dev 下：注入 <style> 的 JS 模块）
└── style.module.css →       └── style.module.css.compiled.js（CSS 模块 → JS 对象）
```

这是 Vite 运行时**真正拿到的代码**：
- **`.vue` 编译成组件对象**：`<script setup>` 变成 `setup()`、`<template>` 变成 `render()`。
- **`.module.css` 编译成 JS 对象**：`{ card: '_card_xxx_1' }`——这就是"CSS 也变成了 JS"最直观的例子。
- **`.css` 在 dev 下编译成注入 `<style>` 的 JS 模块**（`import { updateStyle } from '/@vite/client'` …）；在 build 下则被抽成独立的 `.css` 文件，所以 `compiled/` 里不会有它的 `.js`。

> 在线也能看编译结果：打开官方 **Vue SFC Playground（play.vuejs.org）** 粘贴代码即可。注意：VS Code 官方插件 **Vue - Official** 只提供语法高亮/类型检查等语言服务，**不**提供"查看编译产物"的面板。

从 `compiled/App.vue.compiled.js` 里，你能直接验证 Vue 的几个核心实现：

- **模板不是 HTML，而是一堆 `createElementVNode` 调用**（虚拟 DOM 的来源）。
- **`<script setup>` 编译成一个 `setup()` 函数**，你声明的变量被 `return` 出去，模板才能通过 `$setup` 访问。
- **响应式接入点**：`ref` 让数据可被 `Proxy` 追踪；`count++` 触发 `set` → 通知系统重跑 `render`。
- **`patch flag`（如 `1 /* TEXT */`、`512 /* NEED_PATCH */`）**：编译时打在节点上的标记，让更新时跳过不必要的 diff，这就是虚拟 DOM 性能优化的落点。
- **`v-model` 编译成 `_withDirectives(... [_vModelText, $setup.msg])`**："双向绑定"本质是"读 + 写"两段逻辑被包成一条指令。
- **CSS 也变成 JS**：`style.module.css` 变成 `{ card: '_card_xxx_1' }`；dev 下 `style.css` 变成注入 `<style>` 的 JS 模块。

一句话：你写的 `.vue` 运行时不存在，它早已被编译成"一个返回虚拟 DOM 的 `render()` 函数 + 一个 `setup()` 函数"，在响应式数据变化时自动重跑。看懂它，Vue 就从黑盒变成了你能推演的普通 JS。

## 下一步
进入 `stage-2-components`，学习把界面拆成组件，以及父子之间怎么通信。
