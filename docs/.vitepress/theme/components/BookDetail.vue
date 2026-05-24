<template>
  <span>
    <span class="badge">{{ author }}</span>
    <span class="badge badge-tag" v-if="tag">{{ tag }}</span>
    <br>
    <span v-html="intro"></span>
  </span>
</template>

<script setup>
const { author, tag, intro } = defineProps(['author', 'tag', 'intro'])
</script>

<style scoped>
.badge {
  cursor: default;
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background-color: var(--vp-c-brand-soft);
  padding: 0 6px;
}

.badge-tag {
  margin-left: 8px;
  background-color: var(--vp-badge-info-bg);
}
</style>