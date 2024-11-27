<template>
  <Layout>
    <template #doc-before>
      <DraftAnnounce :preview="isPreviewDraft()" :percent="frontmatter?.draftPercent" v-if="isDraft()" />
    </template>

    <template #doc-after>
      <ValineComment v-show="showComment()" />
    </template>
  </Layout>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DraftAnnounce from './DraftAnnounce.vue'
import ValineComment from './ValineComment.vue'
const { Layout } = DefaultTheme
const { frontmatter } = useData()
const route = useRoute()

const isDraft = () => {
  const isDraftStatus = frontmatter.value?.draft
  return typeof isDraftStatus === 'boolean' && isDraftStatus
}

const isPreviewDraft = () => {
  const previewDraft = frontmatter.value?.draftPreview
  return typeof previewDraft === 'boolean' && previewDraft
}

const handlePreviewDraft = () => {
  const mainDoc = document.querySelector('main')
  if (isDraft() && !isPreviewDraft()) {
    mainDoc?.remove()
  }
}

const showComment = () => {
  const enabledComment = frontmatter.value?.comment
  return (enabledComment === undefined || enabledComment) &&
    (!isDraft() || isPreviewDraft())
}

onMounted(() => {
  handlePreviewDraft()
})

watch(
  () => route.path,
  () => handlePreviewDraft()
)
</script>