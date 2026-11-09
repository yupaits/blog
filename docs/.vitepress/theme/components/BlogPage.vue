<template>
  <Layout>
    <template #doc-before>
      <DraftAnnounce v-if="isDraft" :preview="previewDraft"/>
      <PageMetadata v-if="showMeta"/>
    </template>

    <template #doc-after>
      <CommentRule v-if="hasComment"/>
      <GiscusComment v-if="hasComment && isArticle && commentReady"/>
    </template>

    <template #doc-footer-before>
      <PageCopyRight v-if="hasComment"/>
      <PageShare v-if="hasComment"/>
      <BackToTop/>
    </template>
  </Layout>
</template>

<script setup>
import {useData, useRoute} from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import {computed, defineAsyncComponent, nextTick, onMounted, ref, watch} from 'vue'
import BackToTop from './BackToTop.vue'

const GiscusComment = defineAsyncComponent(() => import('./GiscusComment.vue'))
const commentReady = ref(false)
import CommentRule from './CommentRule.vue'
import DraftAnnounce from './DraftAnnounce.vue'
import PageCopyRight from './PageCopyright.vue'
import PageMetadata from './PageMetadata.vue'
import PageShare from './PageShare.vue'

const {hasMeta} = defineProps(['hasMeta'])
const {Layout} = DefaultTheme
const {frontmatter} = useData()
const route = useRoute()

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

const isArticle = computed(() => {
  const path = route.path
  return frontmatter.value.layout !== 'home' && path !== '/' && !/^\/[^/]+\/$/.test(path)
})

const handleDoc = async () => {
  await nextTick()
  const hidden = frontmatter.value.draft === true && frontmatter.value.draftPreview !== true
  document.querySelector('main .vp-doc')?.classList.toggle('draft-hidden', hidden)
  let meta = document.querySelector('meta[name="robots"]')
  if (hidden) {
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'robots'
      meta.content = 'noindex, nofollow'
      document.head.appendChild(meta)
    }
  } else if (meta) {
    meta.remove()
  }
}

// 评论区延后到首屏空闲再加载，避免阻塞文章渲染
onMounted(() => {
  handleDoc()
  const schedule = window.requestIdleCallback
    ? cb => window.requestIdleCallback(cb, {timeout: 2000})
    : cb => setTimeout(cb, 1200)
  schedule(() => {
    commentReady.value = true
  })
})

watch(
    () => route.path,
    () => {
      handleDoc()
    }
)
</script>

<style>
main .vp-doc.draft-hidden {
  display: none;
}
</style>
