# 阶段 2：组件化

## 为什么需要组件
界面一大，如果全写在一个 `<template>` 里，就会变成几百行的"意大利面条"：改一处怕影响别处、想复用一段 UI 得复制粘贴。**组件**就是把这个大界面拆成一个个"自包含的小块"——它有自己的结构（template）、样式（style）、逻辑（script），可以被反复使用、独立维护。

> 一句话：**组件 = 可复用的 UI 单元 + 它自己的数据逻辑。**

## 1. 定义一个组件
组件就是一个 `.vue` 文件。在阶段 1 骨架里新建 `src/Child.vue`：

```vue
<!-- src/Child.vue -->
<script setup>
// defineProps：声明"父组件能传给我什么"
const props = defineProps(['title'])
// defineEmits：声明"我能向父组件发出什么事件"
const emit = defineEmits(['change'])
</script>

<template>
  <h2>{{ title }}</h2>
  <button @click="emit('change', '新标题')">改标题</button>
</template>
```

## 2. 父子通信：props 向下，emit 向上
```vue
<!-- src/App.vue -->
<script setup>
import { ref } from 'vue'
import Child from './Child.vue'
const name = ref('Vue 入门')
</script>

<template>
  <!-- :title 传数据给子组件（父→子） -->
  <!-- @change 监听子组件发出的事件（子→父） -->
  <Child :title="name" @change="name = $event" />
</template>
```

**为什么这样设计**：Vue 的数据流是"单向"的——父通过 props 把数据给子，子不能直接改 props（避免来源混乱），而是用 emit 通知父"我想改"，由父来决定。这样数据流向清晰、好调试。

## 3. 插槽 slot：让组件内容可定制
有时候你想要"结构复用、内容可变"，比如一个卡片，边框一样、里面东西不同：

```vue
<!-- Card.vue -->
<template>
  <div class="card">
    <slot />                <!-- 父组件写在标签里的内容，会填到这里 -->
  </div>
</template>

<!-- 使用 -->
<Card> 这里是任意内容 </Card>
```

## 原理小灶：组件编译后是什么
你写的 `<Child />` 在编译后，本质是一个**返回渲染函数的对象/函数**。`<Child />` 出现几次，就调用几次它的渲染函数来生成对应的 DOM 片段。**"复用"在编译后，就是多次执行同一个函数**——它还是落在原生 JS 函数调用 + 原生 DOM 生成上。

## 下一步
进入 `stage-3-composition-api`，学习现代 Vue 推荐的组合式写法，以及怎么把可复用逻辑抽成"组合函数"。
