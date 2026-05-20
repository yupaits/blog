<template>
  <span>
    <span class="author">{{ author }}</span>
    <br>
    <span>{{ intro }}</span>
  </span>
</template>

<script setup>
import { defineProps } from 'vue'
const { author, intro } = defineProps(['author', 'intro'])
</script>

<style scoped>
.author {
  cursor: default;
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background-color: var(--vp-c-brand-soft);
  padding: 0 6px;
}
</style>