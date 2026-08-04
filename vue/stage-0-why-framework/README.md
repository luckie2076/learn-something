# 阶段 0：为什么需要框架

## 先说结论
框架**不是替代**前端三件套（HTML/CSS/JS），而是在它们之上加了一层"帮你管理数据与界面关系"的机制。你写的仍然是 HTML（模板）、CSS（样式）、JS（逻辑），只是写法变了、有人替你干活了。

## 原生 JS 的痛点
做一个计数器，原生写法：

```js
// 原生做法：手动找 DOM、手动改内容
let count = 0
const btn = document.querySelector('#btn')
const text = document.querySelector('#text')
btn.addEventListener('click', () => {
  count++                    // 1. 改数据
  text.textContent = count  // 2. 手动把数据同步到界面（最烦的一步）
})
```

**问题在哪**：每次数据变化，你都得记得"手动把数据写到 DOM 上"。界面一复杂（几十个状态互相影响），你大量代码都在做"数据 → DOM"的搬运，容易漏、容易错、难维护。

## Vue 的解法：声明式 + 响应式
```vue
<!-- Vue 做法：你只描述"界面长什么样"，数据变了界面自动变 -->
<script setup>
import { ref } from 'vue'
const count = ref(0)        // 把它变成"响应式"数据
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

**为什么更好**：你不再写 `text.textContent = count` 这种"命令式"步骤，而是声明"`{{ count }}` 这里显示 count 的值"。谁来负责同步？Vue 的**响应式系统**——这正是阶段 1 要讲的原理。

## 三个贯穿全程的核心思想
1. **声明式渲染**：描述结果，不写步骤。
2. **响应式**：数据变 → 视图自动变。
3. **组件化**：界面拆成可复用小块（阶段 2）。

> 记住：后面所有 Vue 概念，都是这三个思想的延伸。先理解"为什么需要它们"，API 就只是顺手的工具。

## 下一步
进入 `stage-1-core`，你会真正创建项目、写出第一个响应式例子，并看到响应式背后的 `Proxy` 原理。
