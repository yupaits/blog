<template>
  <div class="draft-announce-container" :class="{ 'has-content': preview }">
    <div class="draft-box">
      <div>
        <span class="badge">草稿</span>
        <span class="badge badge-preview" v-if="preview">预览模式</span>
      </div>
      <div class="draft-tip" v-if="preview">当前文章尚未完成，预览模式下可以提前查看文章内容。</div>
      <div class="draft-tip" v-else>当前文章尚未完成，敬请期待...</div>
      <p v-if="frontmatter?.draftPercent">
        <Progress label="编写进度" labelWidth="100px" :percent="frontmatter?.draftPercent" />
      </p>
    </div>
  </div>
</template>

<script setup>
import Progress from './Progress.vue'
import { onMounted, ref } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()
const preview = ref(false)

const isPreviewDraft = () => {
  const previewDraft = frontmatter.value?.draftPreview
  return typeof previewDraft === 'boolean' && previewDraft
}

onMounted(() => {
  preview.value = isPreviewDraft()
})
</script>

<style scoped>
.draft-announce-container {
  border-radius: 8px;
  margin-bottom: 2rem;
}

.draft-announce-container.has-content {
  border-bottom: 2px dashed var(--vp-c-text-3);
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
  font-weight: bold;
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