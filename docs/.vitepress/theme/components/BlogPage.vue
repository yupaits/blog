<template>
  <Layout>
    <template #doc-top>
      <div class="shade" :class="{'shade-active': isTransitioning}"></div>
    </template>

    <template #doc-before>
      <DraftAnnounce :preview="isPreviewDraft()" :percent="frontmatter?.draftPercent" v-if="isDraft()" />
    </template>

    <template #doc-after>
      <ValineComment v-show="showComment()" />
    </template>
  </Layout>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DraftAnnounce from './DraftAnnounce.vue'
import ValineComment from './ValineComment.vue'
const { Layout } = DefaultTheme
const { frontmatter } = useData()
const route = useRoute()
const isTransitioning = ref(false)

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

const transition = () => {
  isTransitioning.value = true
  setTimeout(() => {
    isTransitioning.value = false
  }, 300)
}

onMounted(() => {
  transition()
  handlePreviewDraft()
})

watch(
  () => route.path,
  () => {
    transition()
    handlePreviewDraft()
  }
)
</script>

<style>
.shade {
  position: fixed;
  width: 100%;
  height: 100vh;
  background-color: var(--vp-c-bg);
  z-index: 100;
  pointer-events: none;
  opacity: 0;
  transition: transform 0.3s ease-in-out;
}

.shade-active {
  opacity: 0;
  animation: shadeAnimation 0.3s ease-in-out;
}

@keyframes shadeAnimation {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(100vh);
  }
}
</style>