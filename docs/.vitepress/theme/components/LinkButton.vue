<template>
  <a :href="link?.href" :target="link?.target" class="link-btn">{{ value }}</a>
</template>

<script setup>
const {value, link} = defineProps(['value', 'link'])
</script>

<style scoped>
a.link-btn {
  border: 1px solid var(--vp-c-border);
  border-radius: var(--blog-radius-sm);
  background-color: var(--vp-c-bg);
  padding: 5px 10px;
  height: 16px;
  line-height: 16px;
  font-size: 12px;
  white-space: nowrap;
}

/* 正文 a:hover 会给按钮补下划线，这里提高一级特异性只取消按钮的文字下划线，
   底色 hover 反馈保持不变 */
a.link-btn.link-btn:hover {
  text-decoration: none;
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