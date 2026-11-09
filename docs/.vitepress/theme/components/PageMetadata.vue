<template>
  <section class="page-meta" aria-label="文章信息">
    <a v-if="category" class="page-meta-category" :href="categoryLink">{{ category }}</a>
    <span v-if="updated" class="page-meta-item">
      更新于 <time :datetime="updated">{{ updated }}</time>
    </span>
    <span v-if="wordcount" class="page-meta-item">{{ wordcount }} 字</span>
    <span v-if="readTime" class="page-meta-item">阅读 {{ readTime }} 分钟</span>
  </section>
</template>

<script setup>
import {computed, nextTick, onMounted, ref, watch} from 'vue'
import {useData, useRoute} from 'vitepress'
import dayjs from 'dayjs'

const {page} = useData()
const route = useRoute()
const wordcount = ref(0)
const readTime = ref(0)

const decode = (value) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

// 栏目取路径第一段，例如 /技术博客/xxx → 技术博客
const category = computed(() => {
  const segment = route.path.split('/').filter(Boolean)[0]
  return segment ? decode(segment) : ''
})
const categoryLink = computed(() => `/${encodeURIComponent(category.value)}/`)

const updated = computed(() => {
  const timestamp = page.value.lastUpdated
  return timestamp ? dayjs(timestamp).format('YYYY-MM-DD') : ''
})

const pattern = /[a-zA-Z0-9_\u0392-\u03c9\u00c0-\u00ff\u0600-\u06ff\u0400-\u04ff]+|[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g

const calcWords = (content) => {
  let words = 0
  const matches = content?.match(pattern)
  if (matches) {
    for (let i = 0; i < matches.length; i++) {
      const m = matches[i]
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
  if (!container) return
  const clone = container.cloneNode(true)
  clone.querySelectorAll('pre, code, .vp-code-group, .line-numbers-wrapper').forEach(el => el.remove())
  const content = clone.textContent
  let wordCount = calcWords(content)
  wordcount.value = formatWordCount(wordCount)
  let imageCount = container.querySelectorAll('img')?.length ?? 0
  const wordTime = calcWordTime(wordCount)
  const imageTime = calcImageTime(imageCount)
  readTime.value = Math.ceil((wordTime + imageTime) / 60)
}

onMounted(() => {
  analyse()
})

watch(
    () => route.path,
    async () => {
      await nextTick()
      analyse()
    }
)
</script>

<style>
.page-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 10px;
  margin: 0 0 14px;
  font-size: 12.5px;
  line-height: 1.6;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-3);
}

.page-meta-category {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: var(--blog-radius-pill, 999px);
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2px;
  text-decoration: none;
  transition: background-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    color var(--blog-duration-fast, 150ms) var(--blog-ease, ease);
}

.page-meta-category:hover {
  background-color: var(--vp-c-brand-1);
  color: #fff;
}

.page-meta-item {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.page-meta-item + .page-meta-item::before {
  content: "";
  width: 3px;
  height: 3px;
  margin-right: 6px;
  border-radius: 50%;
  background-color: currentColor;
  opacity: 0.45;
}

.page-meta time {
  margin-left: 2px;
}

@media (max-width: 639px) {
  .page-meta {
    font-size: 12px;
    gap: 6px 8px;
    margin-bottom: 12px;
  }
}
</style>
