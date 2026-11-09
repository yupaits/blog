<template>
  <div class="share-box">
    <button type="button" class="share-btn" @click="share">
      <span aria-live="polite">{{ label }}</span>
    </button>
  </div>
</template>

<script setup>
import {useData} from 'vitepress'
import {ref} from 'vue'

const {page} = useData()
const label = ref('分享此页')
let timer

const setLabel = (text) => {
  label.value = text
  clearTimeout(timer)
  timer = setTimeout(() => {
    label.value = '分享此页'
  }, 2000)
}

const pageUrl = () => window.location.origin + window.location.pathname

const share = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        text: page.value?.title,
        url: pageUrl()
      })
      return
    } catch (error) {
      if (error?.name === 'AbortError') return
    }
  }
  try {
    await navigator.clipboard.writeText(pageUrl())
    setLabel('链接已复制')
  } catch {
    setLabel('请复制地址栏链接')
  }
}
</script>

<style>
.share-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--blog-space-5, 20px);
}

.share-btn {
  min-width: 104px;
  height: 32px;
  padding: 0 var(--blog-space-4, 16px);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--blog-radius-pill, 999px);
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
  transition: border-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    background-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    color var(--blog-duration-fast, 150ms) var(--blog-ease, ease);
}

.share-btn:hover {
  border-color: var(--vp-c-brand-2);
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
</style>
