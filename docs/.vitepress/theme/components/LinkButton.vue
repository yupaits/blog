<template>
  <a class="link-btn" :href="link?.href" :target="link?.target">{{ value }}</a>
</template>

<script setup>
const { value, link } = defineProps(['value', 'link'])
</script>

<style scoped>
a.link-btn {
  border: 1px solid var(--vp-c-border);
  border-radius: .25rem;
  background-color: var(--vp-c-bg);
  padding: 5px 10px;
  height: 16px;
  line-height: 16px;
  font-size: 12px;
  white-space: nowrap;
}

a.link-btn:hover {
  background-color: var(--vp-c-bg-soft);
}

/* 移除外链小箭头图标 */
a[target='_blank'].link-btn::after {
  width: 0;
  height: 0;
  margin: 0;
  mask-image: none;
}
</style>