<template>
  <section :class="{ 'has-content': preview }" class="draft-announce-container">
    <div class="draft-box">
      <div class="draft-head">
        <svg class="draft-icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
          <circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" stroke-width="1.3"/>
          <path d="M8 7.2v4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          <circle cx="8" cy="4.7" r="0.85" fill="currentColor"/>
        </svg>
        <strong class="badge">草稿</strong>
        <strong v-if="preview" class="badge badge-preview">预览模式</strong>
      </div>
      <div v-if="preview" class="draft-tip">当前文章尚未完成，预览模式下可以提前查看文章内容。</div>
      <div v-else class="draft-tip">当前文章尚未完成，敬请期待...</div>
      <p v-if="frontmatter?.draftPercent" class="draft-progress">
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
/* 与 tip / warning 同族：浅底、1px 描边 + 左侧色条、8px 圆角 */
.draft-announce-container {
  margin: 0 0 24px;
}

.draft-box {
  padding: 14px 18px;
  border: 1px solid var(--vp-c-divider);
  border-left: 3px solid var(--vp-c-brand-2);
  border-radius: var(--blog-radius, 8px);
  background-color: var(--vp-c-bg-soft);
}

/* 预览模式下与正文之间用虚线收尾，提示内容未完结 */
.draft-announce-container.has-content {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px dashed var(--vp-c-divider);
}

.draft-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.draft-icon {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  color: var(--vp-c-brand-1);
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-2) 55%, var(--vp-c-divider));
  border-radius: var(--blog-radius-pill, 999px);
  background-color: transparent;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.3px;
}

.badge-preview {
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

/* 长文案在窄屏正常换行，不挤压图标与徽标 */
.draft-tip {
  margin-top: 10px;
  color: var(--vp-c-text-2);
  font-size: 13.5px;
  line-height: 1.7;
  overflow-wrap: anywhere;
}

.draft-progress {
  margin: 12px 0 0;
}

@media (max-width: 639px) {
  .draft-box {
    padding: 12px 14px;
  }

  .draft-tip {
    margin-top: 8px;
    font-size: 13px;
  }
}
</style>