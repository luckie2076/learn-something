<script setup>
import { ref } from 'vue'

// 组件自己持有状态：每个 <Counter /> 实例都有一份独立的 count，互不干扰
const count = ref(0)
console.log('hello')
</script>

<template>
  <button @click="count++" :class="styles.btn">子组件计数：{{ count }}</button>
</template>

<style module="styles">
.btn {
  padding: 4px 12px;
  border-radius: 6px;
  background: #42b883;
  color: #fff;
  border: none;
  cursor: pointer;
}
</style>
