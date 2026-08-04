# 阶段 5：进阶与原理串讲

## 1. 异步 / 网络请求
Vue 里发请求就是普通 `fetch`，关键点在于"请求期间显示 loading、拿到后赋给响应式数据"：

```vue
<script setup>
import { ref, onMounted } from 'vue'
const list = ref([])
const loading = ref(true)

onMounted(async () => {
  const res = await fetch('https://api.example.com/items')
  list.value = await res.json()
  loading.value = false
})
</script>

<template>
  <p v-if="loading">加载中…</p>
  <li v-for="item in list" :key="item.id">{{ item.name }}</li>
</template>
```

**为什么放这里讲**：异步本身和 Vue 无关（就是 JS），重点是"把结果写进 `ref`，视图就自动更新"——又把球传回响应式系统。

## 2. 小项目建议
挑一个练手，巩固全栈思维：待办清单（增删改 + 过滤）、或博客列表（路由 + 请求）。目标不是功能多，而是把"组件 + 响应式 + 路由/状态"串起来。

## 3. 原理小灶：虚拟 DOM 与 Diff
Vue 不会在每次数据变化时，粗暴地 `innerHTML` 重写整个页面（那样慢且会丢焦点）。它维护一个 **JS 对象描述的"虚拟 DOM"树**：

1. 数据变了 → 生成一棵"新虚拟 DOM 树"；
2. 和"旧树"做对比（**Diff**），算出最小差异；
3. 只把这些差异用**原生 DOM API** 应用到真实页面。

**为什么**：真实 DOM 操作昂贵，Diff 把"几十次 DOM 操作"压缩成"几次精准更新"。

## 4. 原理串讲：Vue 如何"变成"前端三件套（全景图）
把前面所有原理连成一条线：

```
.vue 文件
  │
  ├─ 编译时（@vitejs/plugin-vue / Vue 编译器）
  │     <template> ──► 渲染函数(JS)
  │     <script>   ──► 逻辑(JS)
  │     <style>    ──► 注入的 CSS
  │
  ├─ 运行时（Vue runtime，纯 JS）
  │     响应式系统(Proxy) 收集依赖 → 数据变 → 触发渲染
  │     → 生成新虚拟 DOM → Diff → 调用原生 DOM API 更新真实页面
  │
  └─ 最终产物：真实 HTML 节点 + 普通 CSS + 普通 JS
```

**终极回答你最初的问题**：Vue 从来没脱离三件套。它在**构建时**把模板编译成 JS、把样式编译成 CSS；在**运行时**用原生 JS 的 `Proxy` 等能力管理状态，再用原生 DOM API 驱动真实页面。框架 = "编译 + 运行时"的一层封装，底层始终是你在阶段 0 已经掌握的三件套。

## 学习路径回顾
- 阶段 0：为什么需要框架（动机）
- 阶段 1：响应式 + 模板（核心，含 Proxy 原理）
- 阶段 2：组件化（props/emit/slot）
- 阶段 3：组合式 API（script setup / 组合函数）
- 阶段 4：生态（router / pinia / SFC 编译原理）
- 阶段 5：进阶 + 虚拟 DOM + 原理串讲（全景收口）

到这里，你既会用 Vue，也懂它为什么能工作。建议从阶段 1 的骨架动手跑一遍，再逐章把示例改成自己的小实验。
