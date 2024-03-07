<template>
  <div class="draft-announce-container" :class="{ 'has-content': preview }">
    <div class="draft-announce info custom-block">
      <p class="custom-block-title">
        <span class="draft-status VPBadge danger">草稿</span>
        <span class="VPBadge info" v-if="preview">预览模式</span>
      </p>
      <p class="draft-tip" v-if="preview">当前文章尚未完成，预览模式下可以提前查看文章内容。</p>
      <p class="draft-tip" v-else>当前文章尚未完成，敬请期待...</p>
      <p v-if="percent">
        <Progress label="编写进度" labelWidth="100px" :percent="percent" />
      </p>
    </div>
  </div>
</template>

<script setup>
import Progress from './Progress.vue'
const { preview, percent } = defineProps(['preview', 'percent'])
</script>

<style scoped>
.draft-announce-container {
  margin-bottom: 24px;
}

.draft-announce-container.has-content {
  border-bottom: 2px dashed var(--vp-c-text-3);
  padding-bottom: 24px;
}

.draft-status {
  font-size: 16px;
  margin-right: 8px;
}

.draft-tip {
  margin-left: 8px;
}
</style>