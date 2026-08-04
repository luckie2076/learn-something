# 阶段 3：组合式 API

## 两种写法：选项式 vs 组合式
Vue 早期用"选项式 API"，把代码按 `data`、`methods`、`mounted` 等"选项类型"分类。问题是：一个功能的代码（比如"计数器"）会被拆散到不同选项里，功能一多就难读。

**组合式 API** 让你按"功能"来组织代码——同一个功能的变量和函数写在一起，清晰、且更容易跨组件复用。这也是现在官方推荐的写法（阶段 1 的 `<script setup>` 就是组合式）。

## 1. `<script setup>` + 生命周期
```vue
<script setup>
import { ref, onMounted } from 'vue'

const count = ref(0)
onMounted(() => {        // 组件挂载到页面后执行
  console.log('挂载完成，count =', count.value)
})
</script>
```

常用生命周期：`onMounted`（挂载后）、`onUpdated`（更新后）、`onUnmounted`（销毁前，常用来清理定时器/监听）。**为什么需要它**：有些操作（如发请求、开定时器）必须在 DOM 就绪后做，生命周期钩子就是 Vue 给你的"时机通知"。

## 2. 组合函数 composables：逻辑复用
假设多个组件都要"计数器"逻辑，把它抽成一个函数（约定以 `use` 开头）：

```js
// src/useCounter.js
import { ref } from 'vue'
export function useCounter() {
  const count = ref(0)
  const inc = () => count.value++
  return { count, inc }   // 返回响应式状态 + 操作
}
```

组件里直接用，互不干扰：
```vue
<script setup>
import { useCounter } from './useCounter.js'
const { count, inc } = useCounter()
</script>
<template>
  <button @click="inc">count: {{ count }}</button>
</template>
```

**为什么这是大进步**：选项式里复用逻辑要靠 `mixin`，容易命名冲突、来源不清；组合函数就是普通 JS 函数，复用干净、可读、可测。

## 3. 再回看响应式
本阶段所有状态（`ref`）的机制，仍是阶段 1 讲的 `Proxy`：函数里创建的 `ref`，被组件模板"读取"时就完成了依赖收集，修改时自动触发更新。

## 下一步
进入 `stage-4-ecosystem`，学习单页应用必备的路由（vue-router）和状态管理（pinia），以及 `.vue` 文件到底是怎么被编译的。
