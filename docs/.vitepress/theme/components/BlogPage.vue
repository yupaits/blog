<template>
  <Layout>
    <template #doc-before>
      <DraftAnnounce v-if="isDraft()" />
    </template>

    <template #doc-after>
      <CommentRule v-if="showComment()" />
    </template>

    <template #doc-footer-before>
      <PageCopyRight v-if="showComment()" />
      <BackToTop />
    </template>

    <template #aside-outline-before>
      <PageMetadata v-if="showMeta" />
    </template>

    <template #layout-bottom>
      <Busuanzi v-if="isHome()" />
    </template>
  </Layout>
</template>

<script setup>
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { onMounted, watch } from 'vue'
import BackToTop from './BackToTop.vue'
import Busuanzi from './Busuanzi.vue'
import CommentRule from './CommentRule.vue'
import DraftAnnounce from './DraftAnnounce.vue'
import PageCopyRight from './PageCopyright.vue'
import PageMetadata from './PageMetadata.vue'
const { showMeta } = defineProps(['showMeta'])
const { Layout } = DefaultTheme
const { frontmatter } = useData()
const route = useRoute()

const isHome = () => {
  return frontmatter.value?.layout === 'home'
}

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
  return enabledComment === undefined || enabledComment
}

onMounted(() => {
  handlePreviewDraft()
})

watch(
  () => route.path,
  () => {
    handlePreviewDraft()
  }
)
</script>