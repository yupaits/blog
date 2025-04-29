<template>
  <section class="meta-info">
    <span class="meta-item">📆更新于 <span>{{ dayjs(page.lastUpdated).format('YYYY-MM-DD') }}</span></span>
    <span class="meta-item">✍字数总计：<span>{{ wordcount }}</span></span>
    <span class="meta-item">⌛阅读时长：<span>{{ readTime }}</span> 分钟</span>
    <span class="meta-item">📖阅读量：<span id="vercount_value_page_pv">◯</span></span>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import dayjs from 'dayjs'
const { page } = useData()
const route = useRoute()
const wordcount = ref(0)
const readTime = ref(0)

const pattern = /[a-zA-Z0-9_\u0392-\u03C9\u00C0-\u00FF\u0600-\u06FF\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF\u3040-\u309F\uAC00-\uD7AF]+/g

const calcWords = (content) => {
  let words = 0
  const matches = content?.match(pattern)
  if (matches) {
    for (let i = 0; i < matches.length; i++) {
      const m = matches[i];
      if (m.charCodeAt(0) >= 19968) {
        words += m.length
      } else {
        words += 1
      }
    }
  }
  return words
}

const formatWordCount = (count) => {
  if (count >= 1000) {
    return Math.round((count / 1000) * 10) / 10 + 'k'
  }
  return count
}

// 计算原理参考：https://www.cnblogs.com/tnnyang/p/9140219.html
const calcWordTime = (count) => {
  return (count / 275) * 60
}

const calcImageTime = (count) => {
  if (count <= 10) {
    return count * 13 + (count * (count - 1)) / 2
  }
  return 175 + (count - 10) * 3
}

const analyse = () => {
  const container = document.querySelector('.vp-doc')
  const content = container?.textContent
  let wordCount = calcWords(content)
  wordcount.value = formatWordCount(wordCount)
  let imageCount = container?.querySelectorAll('img')?.length ?? 0
  const wordTime = calcWordTime(wordCount)
  const imageTime = calcImageTime(imageCount)
  readTime.value = Math.ceil((wordTime + imageTime) / 60)
}

onMounted(() => {
  analyse()
})

watch(
  () => route.path,
  () => {
    analyse()
  }
)
</script>

<style>
.meta-info {
  color: var(--vp-c-text-2);
  font-size: 14px;
  margin-bottom: 1rem;
}

.meta-item {
  display: inline-block;
  white-space: nowrap;
  margin-right: 1rem;
}
</style>