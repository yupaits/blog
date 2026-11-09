<template>
  <section id="home-timeline" class="home-block">
    <h2 class="home-title">
      <span>写作时间轴 <small>按内容更新聚合 · 共 {{ allTotal }} 篇</small></span>
      <button type="button" class="toggle-all" @click="toggleAll">
        {{ allExpanded ? '全部收起' : '全部展开' }}
      </button>
    </h2>
    <div class="timeline-toolbar">
      <label class="timeline-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5"/>
          <path d="M16 16l4 4"/>
        </svg>
        <input v-model="keyword" type="search" placeholder="搜索文章标题" aria-label="搜索文章标题"/>
        <button v-if="keyword" type="button" class="search-clear" aria-label="清空搜索" @click="keyword = ''">×</button>
      </label>
      <div class="year-chips" role="group" aria-label="按年份筛选">
        <button type="button" class="chip" :class="{active: !yearFilter}" @click="yearFilter = ''">全部</button>
        <button v-for="group in years" :key="group.year" type="button" class="chip"
                :class="{active: yearFilter === String(group.year)}"
                :aria-label="`${group.year} 年，${group.posts.length} 篇文章`"
                @click="yearFilter = yearFilter === String(group.year) ? '' : String(group.year)">
          <span class="chip-year">{{ group.year }}</span>
          <span class="chip-count">{{ group.posts.length }}<span class="chip-unit">篇</span></span>
        </button>
      </div>
    </div>
    <div v-if="activeCategory" class="timeline-filter">
      <span>正在查看栏目 <strong>{{ activeCategory }}</strong> 的文章</span>
      <button type="button" @click="$emit('clear')">清除筛选</button>
    </div>
    <p class="timeline-summary home-muted">
      <template v-if="isFiltering">
        筛选出 {{ total }} 篇
        <template v-if="total !== allTotal"> / 共 {{ allTotal }} 篇</template>
      </template>
      <template v-else>按年份聚合，最近更新的排在前面</template>
    </p>
    <div v-if="displayYears.length" class="timeline">
      <div v-for="group in displayYears" :key="group.year" class="year-group home-card">
        <button type="button" class="year-head" :aria-expanded="expanded.has(group.year)" @click="toggle(group.year)">
          <svg class="year-chevron" :class="{open: expanded.has(group.year)}" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 6l6 6-6 6"/>
          </svg>
          <span class="year-label">{{ group.year }}</span>
          <span class="home-count year-count">{{ group.posts.length }}<span class="home-count-unit">篇</span></span>
        </button>
        <div v-show="expanded.has(group.year)" class="year-body">
          <ul class="post-list">
            <li v-for="post in group.posts" :key="post[1]" class="post-row">
              <span class="post-date">{{ formatDay(post[2]) }}</span>
              <a class="home-link post-title" :href="post[1]" :title="titleOf(post)">
                <span v-for="(part, index) in highlight(titleOf(post))" :key="index"
                      :class="{'post-hit': part.hit}">{{ part.text }}</span>
              </a>
              <span v-if="categoryName(post[3])" class="post-cat">{{ categoryName(post[3]) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <p v-else class="timeline-empty">没有匹配的文章，试试换个关键词或清除筛选条件。</p>
  </section>
</template>

<script setup>
import {computed, ref, watch} from 'vue'

const props = defineProps({
    years: {type: Array, required: true},
    categories: {type: Array, default: () => []},
    activeCategory: {type: String, default: ''}
})
defineEmits(['clear'])

const keyword = ref('')
const yearFilter = ref('')
const expanded = ref(new Set(props.years.slice(0, 2).map(group => group.year)))

const categoryName = (index) => props.categories[index]?.name ?? ''

const titleOf = (post) => post[0] || decodeURIComponent(post[1]).split('/').filter(Boolean).pop()

const query = computed(() => keyword.value.trim().toLowerCase())

const filteredYears = computed(() => {
    const q = query.value
    return props.years
        .map(group => ({
            year: group.year,
            posts: group.posts.filter(post => {
                if (props.activeCategory && categoryName(post[3]) !== props.activeCategory) return false
                return !q || titleOf(post).toLowerCase().includes(q)
            })
        }))
        .filter(group => group.posts.length)
})

const displayYears = computed(() => yearFilter.value
    ? filteredYears.value.filter(group => String(group.year) === yearFilter.value)
    : filteredYears.value)

const allTotal = computed(() => props.years.reduce((sum, group) => sum + group.posts.length, 0))
const total = computed(() => displayYears.value.reduce((sum, group) => sum + group.posts.length, 0))
const isFiltering = computed(() => Boolean(query.value) || Boolean(props.activeCategory) || Boolean(yearFilter.value))
const allExpanded = computed(() => displayYears.value.length > 0
    && displayYears.value.every(group => expanded.value.has(group.year)))

// 搜索或筛选后自动展开命中的年份，避免结果被折叠隐藏
watch([query, () => props.activeCategory, yearFilter], () => {
    const next = new Set(expanded.value)
    displayYears.value.forEach(group => next.add(group.year))
    expanded.value = next
})

const toggle = (year) => {
    const next = new Set(expanded.value)
    if (next.has(year)) next.delete(year)
    else next.add(year)
    expanded.value = next
}

const toggleAll = () => {
    if (allExpanded.value) {
        expanded.value = new Set()
        return
    }
    expanded.value = new Set(displayYears.value.map(group => group.year))
}

const highlight = (title) => {
    const q = keyword.value.trim()
    if (!q) return [{text: title}]
    const lowerTitle = title.toLowerCase()
    const lowerQuery = q.toLowerCase()
    const parts = []
    let index = 0
    while (index < title.length) {
        const hit = lowerTitle.indexOf(lowerQuery, index)
        if (hit < 0) break
        if (hit > index) parts.push({text: title.slice(index, hit)})
        parts.push({text: title.slice(hit, hit + q.length), hit: true})
        index = hit + q.length
    }
    if (!parts.length) return [{text: title}]
    if (index < title.length) parts.push({text: title.slice(index)})
    return parts
}

const formatDay = (seconds) => {
    const date = new Date((seconds + 8 * 3600) * 1000)
    return `${date.getUTCMonth() + 1}/${String(date.getUTCDate()).padStart(2, '0')}`
}
</script>

<style scoped>
.toggle-all {
  min-height: 28px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--blog-radius-pill, 999px);
  background-color: var(--vp-c-bg-soft);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: border-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    color var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    background-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease);
}

.toggle-all:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.timeline-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--blog-space-3, 12px);
  margin-bottom: var(--blog-space-3, 12px);
}

.timeline-search {
  display: flex;
  align-items: center;
  gap: var(--blog-space-2, 8px);
  flex: 0 1 240px;
  height: 34px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--blog-radius-pill, 999px);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  transition: border-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease);
}

.timeline-search:focus-within {
  border-color: var(--vp-c-brand-1);
}

.timeline-search svg {
  flex: none;
  width: 15px;
  height: 15px;
}

.timeline-search input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}

.timeline-search input::placeholder {
  color: var(--vp-c-text-3);
}

.timeline-search input::-webkit-search-cancel-button {
  display: none;
}

.search-clear {
  flex: none;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background-color: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
  transition: color var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    background-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease);
}

.search-clear:hover {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.year-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--blog-space-2, 8px);
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--blog-radius-pill, 999px);
  background-color: var(--vp-c-bg-soft);
  font-size: 12px;
  line-height: 1;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: border-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    background-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    color var(--blog-duration-fast, 150ms) var(--blog-ease, ease);
}

.chip:hover {
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-brand-1);
}

.chip.active {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.chip-count {
  display: inline-flex;
  align-items: baseline;
  gap: 1px;
  margin-left: 1px;
  padding-left: 7px;
  border-left: 1px solid var(--vp-c-divider);
  font-size: 11px;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-3);
}

.chip-unit {
  font-size: 10px;
  opacity: 0.75;
}

.chip:hover .chip-count,
.chip.active .chip-count {
  border-left-color: currentColor;
  color: currentColor;
}

.timeline-filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--blog-space-2, 8px);
  margin-bottom: var(--blog-space-3, 12px);
  padding: 10px 14px;
  border-left: 3px solid var(--vp-c-brand-1);
  border-radius: var(--blog-radius, 8px);
  background-color: var(--vp-c-brand-soft);
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.timeline-filter strong {
  color: var(--vp-c-brand-1);
}

.timeline-filter button {
  border: none;
  background: transparent;
  font-size: 12px;
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  cursor: pointer;
}

.timeline-summary {
  margin: 0 0 var(--blog-space-3, 12px);
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: var(--blog-space-3, 12px);
}

.year-group {
  padding: 0 var(--blog-space-5, 20px);
}

.year-head {
  display: flex;
  align-items: center;
  gap: var(--blog-space-3, 12px);
  width: 100%;
  min-height: 48px;
  padding: 13px 0;
  border: none;
  background: transparent;
  font: inherit;
  text-align: left;
  color: inherit;
  cursor: pointer;
  user-select: none;
}

.year-head:focus-visible {
  outline-offset: -2px;
}

.year-chevron {
  flex: none;
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-3);
  transition: transform var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    color var(--blog-duration-fast, 150ms) var(--blog-ease, ease);
}

.year-chevron.open {
  transform: rotate(90deg);
  color: var(--vp-c-brand-1);
}

.year-head:hover .year-chevron,
.year-head:hover .year-label {
  color: var(--vp-c-brand-2);
}

.year-label {
  min-width: 48px;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--vp-c-brand-1);
  font-variant-numeric: tabular-nums;
  transition: color var(--blog-duration-fast, 150ms) var(--blog-ease, ease);
}

.year-count {
  margin-left: auto;
}

.year-head:hover .home-count {
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.year-body {
  padding-bottom: var(--blog-space-3, 12px);
}

.post-list {
  max-height: 300px;
  margin: 0;
  padding: 2px 0 0;
  list-style: none;
  overflow-y: auto;
  /* 只保留纵向滚动：负边距/长文本都不能把卡片撑出横向滚动条 */
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--vp-c-divider) transparent;
}

.post-row {
  display: flex;
  align-items: baseline;
  gap: var(--blog-space-3, 12px);
  min-height: 34px;
  margin: 0;
  padding: 6px var(--blog-space-2, 8px);
  border-radius: var(--blog-radius, 8px);
  font-size: 14px;
  transition: background-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease);
}

.post-row:hover {
  background-color: var(--vp-c-bg-elv);
}

.post-date {
  flex: none;
  width: 42px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
  transition: color var(--blog-duration-fast, 150ms) var(--blog-ease, ease);
}

.post-row:hover .post-date {
  color: var(--vp-c-text-2);
}

/* 长标题允许折行，避免固定单行在窄屏下撑出横向溢出 */
.post-title {
  flex: 1 1 auto;
  min-width: 0;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.post-hit {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.post-cat {
  flex: none;
  max-width: 30%;
  margin-left: auto;
  padding: 0 8px;
  border-radius: var(--blog-radius-pill, 999px);
  background-color: var(--vp-c-bg-elv);
  font-size: 11px;
  line-height: 20px;
  color: var(--vp-c-text-3);
  overflow-wrap: anywhere;
  transition: color var(--blog-duration-fast, 150ms) var(--blog-ease, ease);
}

.post-row:hover .post-cat,
.post-row:focus-within .post-cat {
  color: var(--vp-c-text-2);
}

.timeline-empty {
  margin: 0;
  padding: var(--blog-space-6, 24px);
  border: 1px dashed var(--vp-c-divider);
  border-radius: var(--blog-radius-card, 12px);
  background-color: var(--vp-c-bg-soft);
  text-align: center;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .timeline-toolbar {
    align-items: stretch;
  }

  .timeline-search {
    flex-basis: 100%;
    height: 38px;
  }

  .search-clear {
    width: 24px;
    height: 24px;
  }

  .chip {
    height: 32px;
    padding: 0 13px;
  }

  .toggle-all {
    min-height: 32px;
  }

  .year-group {
    padding: 0 var(--blog-space-4, 16px);
  }

  .year-head {
    min-height: 48px;
    padding: 12px 0;
  }

  .post-list {
    max-height: 280px;
  }

  .post-row {
    min-height: 40px;
    padding: 8px var(--blog-space-2, 8px);
    font-size: 13px;
  }

  .post-date {
    width: 40px;
  }

  .post-cat {
    display: none;
  }
}
</style>
