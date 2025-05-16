<template>
  <Layout>
    <template #doc-before>
      <DraftAnnounce v-if="isDraft" :preview="previewDraft" />
      <PageMetadata v-if="showMeta" />
    </template>

    <template #doc-after>
      <CommentRule v-if="hasComment" />
    </template>

    <template #doc-footer-before>
      <PageCopyRight v-if="hasComment" />
      <PageShare v-if="hasComment" />
      <BackToTop />
    </template>

    <template #layout-bottom>
      <Visitor v-if="isHome" />
    </template>
  </Layout>
</template>

<script setup>
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { computed, onMounted, watch } from 'vue'
import BackToTop from './BackToTop.vue'
import Visitor from './Visitor.vue'
import CommentRule from './CommentRule.vue'
import DraftAnnounce from './DraftAnnounce.vue'
import PageCopyRight from './PageCopyright.vue'
import PageMetadata from './PageMetadata.vue'
import PageShare from './PageShare.vue'
const { hasMeta } = defineProps(['hasMeta'])
const { Layout } = DefaultTheme
const { frontmatter } = useData()
const route = useRoute()

const isHome = computed(() => {
  return !!(frontmatter.value.isHome ?? frontmatter.value.layout === 'home')
})

const showMeta = computed(() => {
  return hasMeta && (frontmatter.value.draft !== true || frontmatter.value.draftPreview === true)
})

const isDraft = computed(() => {
  return frontmatter.value.draft === true
})

const previewDraft = computed(() => {
  return frontmatter.value.draftPreview === true
})

const hasComment = computed(() => {
  return frontmatter.value.comment !== false
})

const handleDoc = () => {
  const hideDoc = frontmatter.value.draft === true && frontmatter.value.draftPreview !== true
  document.querySelector('main .vp-doc')?.setAttribute('style', hideDoc ? 'display: none' : undefined)
}

onMounted(() => {
  handleDoc()
})

watch(
  () => route.path,
  () => {
    handleDoc()
  }
)
</script>