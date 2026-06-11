<template>
  <section :class="{ 'has-content': preview }" class="draft-announce-container">
    <div class="draft-box">
      <div>
        <strong class="badge">草稿</strong>
        <strong v-if="preview" class="badge badge-preview">预览模式</strong>
      </div>
      <div v-if="preview" class="draft-tip">当前文章尚未完成，预览模式下可以提前查看文章内容。</div>
      <div v-else class="draft-tip">当前文章尚未完成，敬请期待...</div>
      <p v-if="frontmatter?.draftPercent">
        <Progress :percent="frontmatter?.draftPercent" label="编写进度" labelWidth="100px"/>
      </p>
    </div>
  </section>
</template>

<script setup>
import {useData} from 'vitepress'
import Progress from './Progress.vue'

const {frontmatter} = useData()
const {preview} = defineProps(['preview'])
</script>

<style scoped>
.draft-announce-container {
  border-radius: 8px;
  margin-bottom: 1rem;
}

.draft-announce-container.has-content {
  border-bottom: 2px dashed var(--vp-c-divider);
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  padding-bottom: 1rem;
}

.draft-box {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px 16px 8px 16px;
  background-color: var(--vp-c-bg);
}

.draft-box:hover {
  box-shadow: 0 5px 10px 0 rgb(0 0 0 / 15%);
  transition: box-shadow 0.3s ease-in-out;
}

.badge {
  cursor: default;
  color: var(--vp-c-text-2);
  font-size: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background-color: var(--vp-c-brand-soft);
  padding: 2px 8px;
}

.badge-preview {
  margin-left: 8px;
  background-color: var(--vp-c-brand-soft);
}

.draft-tip {
  line-height: 36px;
  font-size: 14px;
}
</style>