<template>
  <div class="share-box">
    <button type="button" class="share-btn" @click="share">
      <span>📤 {{ label }}</span>
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
  margin-bottom: 1rem;
}

.share-btn {
  min-width: 108px;
  padding: 4px 8px;
  border: 1px solid var(--vp-c-border);
  border-radius: 999px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
}

.share-btn:hover {
  box-shadow: 0 2px 4px 0 var(--vp-shadow-2);
  transition: box-shadow 0.25s ease-in-out;
}
</style>
