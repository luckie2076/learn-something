<script setup>
import { ref } from 'vue'
import styles from './style.module.css'
import Counter from './Counter.vue'

const msg = ref('Hello Vue')
const count = ref(0)
</script>

<template>
  <div :class="styles.card">
    <h1>{{ msg }}</h1>
    <p>count: {{ count }}</p>
    <button @click="count++">+1</button>
    <input v-model="msg" placeholder="改改看" />
    <Counter />
  </div>
</template>
