# 阶段 4：官方生态（按需取用）

这一章体现"渐进式"：路由和状态管理**不是必须一开始就上**，而是应用变复杂后再引入。先理解它们解决什么痛点。

## 1. vue-router：单页应用的"页面切换"
传统多页靠后端返回不同 HTML；单页应用（SPA）只有一个 HTML，靠 JS 切换"视图"。路由就是管理"URL ↔ 视图组件"的映射。

```js
// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from './Home.vue'
import About from './About.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About }
  ]
})
```

在 `main.js` 里 `app.use(router)`，模板用 `<router-view />` 放当前页、`<router-link to="/about">` 做跳转。**为什么需要它**：没有路由，你就得自己手写 `if (url === ...) 显示哪个组件`，路由把这套规则标准化了。

## 2. pinia：状态管理
当多个**不相邻的组件**都要同一份数据（如登录用户、购物车），靠 props 一层层传会非常痛苦。Pinia 提供一个"全局仓库"，谁都能读、谁都能改。

```js
// src/store.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStore = defineStore('main', () => {
  const user = ref('匿名')
  const login = (name) => { user.value = name }
  return { user, login }
})
```

组件里：
```js
import { useStore } from './store.js'
const store = useStore()
store.login('小明')      // 任意组件都能改、都能读到
```

**为什么需要它**：它是"props/emit 层层传递太累"时的解药。注意——小而简单的应用不需要 Pinia，别为了用而用。

## 3. 原理小灶：`.vue` 单文件组件是怎么"变成三件套"的
你写的 `.vue` 文件，在构建时（Vite 通过 `@vitejs/plugin-vue`）被编译器拆成三块并各自处理：

- `<template>` → 编译成 **JS 渲染函数**（这就是"模板变成 JS"）
- `<script>` → 普通 **JS** 逻辑
- `<style>` → 提取后作为 **CSS** 注入页面（`<style>` 标签）

所以 `.vue` 只是"把三件套写在一个文件里"的语法糖，编译产物仍是你熟悉的三件套。再次印证：**Vue 没有脱离三件套，只是帮你把三者组织并编译到一起。**

## 下一步
进入 `stage-5-advanced`，学异步处理、做一个小项目，并完成"原理串讲"——把前面所有点连成一张"Vue 如何变成三件套"的全景图。
