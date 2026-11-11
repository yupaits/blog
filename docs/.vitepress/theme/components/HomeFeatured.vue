<template>
  <section class="home-block">
    <h2 class="home-title">
      <span>精选文章 <small>精选共 {{ featured.length }} 篇 · 点击条目切换预览</small></span>
    </h2>
    <div class="featured-toolbar">
      <div class="featured-chips" role="group" aria-label="按栏目筛选精选文章">
        <button type="button" class="chip" :class="{active: !activeCategory}" @click="selectCategory('')">全部</button>
        <button v-for="cat in categories" :key="cat.name" type="button" class="chip"
                :class="{active: activeCategory === cat.name}"
                @click="selectCategory(cat.name)">
          {{ cat.name }}<span class="chip-count">{{ cat.count }}<span class="chip-unit">篇</span></span>
        </button>
      </div>
      <div class="featured-nav">
        <span class="home-muted nav-index" :title="indexHint">
          <template v-if="activeCategory">当前栏目 · </template>第 {{ current + 1 }} 篇 · 共 {{ flatList.length }} 篇
        </span>
        <button type="button" class="nav-btn" aria-label="上一篇" @click="step(-1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 6l-6 6 6 6"/>
          </svg>
        </button>
        <button type="button" class="nav-btn" aria-label="下一篇" @click="step(1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 6l6 6-6 6"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="featured-shell">
      <div ref="detailEl" class="featured-detail home-card" aria-live="polite">
        <div v-if="active" :key="active.url" class="detail-inner detail-enter">
          <div class="detail-meta">
            <span class="home-pill">{{ active.category }}</span>
            <span class="home-muted">{{ formatDate(active.date) }}</span>
          </div>
          <h3 class="detail-title">{{ active.title }}</h3>
          <div v-if="active.note" ref="noteBoxEl" class="detail-note-box">
            <p ref="noteEl" class="detail-note" :style="noteStyle">{{ active.note }}</p>
          </div>
          <a class="detail-link" :href="active.url">
            阅读全文
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </a>
        </div>
      </div>
      <div class="featured-list" aria-label="精选文章列表">
        <section v-for="group in renderGroups" :key="group.category" class="feature-group">
          <div class="feature-group-head">
            <span class="feature-group-name">{{ group.category }}</span>
            <span class="home-count">{{ group.posts.length }}<span class="home-count-unit">篇</span></span>
          </div>
          <ul class="feature-rows">
            <li v-for="entry in group.posts" :key="entry.post.url">
              <button :ref="el => setItemRef(el, entry.index)" type="button" class="featured-item"
                      :class="{active: active && entry.post.url === active.url}"
                      :aria-current="active && entry.post.url === active.url ? 'true' : undefined"
                      @click="current = entry.index"
                      @keydown.down.prevent="moveFocus(entry.index, 1)"
                      @keydown.right.prevent="moveFocus(entry.index, 1)"
                      @keydown.up.prevent="moveFocus(entry.index, -1)"
                      @keydown.left.prevent="moveFocus(entry.index, -1)">
                <span class="item-index">{{ String(entry.index + 1).padStart(2, '0') }}</span>
                <span class="item-body">
                  <strong class="item-title">{{ entry.post.title }}</strong>
                  <span class="item-sub home-muted">{{ entry.post.category }}</span>
                </span>
              </button>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup>
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'

const {featured} = defineProps(['featured'])

const activeCategory = ref('')
const current = ref(0)
const itemEls = ref([])

// 数据已按栏目分组输出；这里再按栏目聚合，既支持“全部”分组浏览，也支持单栏目筛选
const groups = computed(() => {
    const map = new Map()
    for (const post of featured) {
        if (!map.has(post.category)) map.set(post.category, [])
        map.get(post.category).push(post)
    }
    return [...map.entries()].map(([category, posts]) => ({category, posts}))
})

const list = computed(() => activeCategory.value
    ? groups.value.filter(group => group.category === activeCategory.value)
    : groups.value)

const flatList = computed(() => list.value.flatMap(group => group.posts))

// 分母始终是「当前筛选结果」的篇数，悬停时补一句总量说明，避免和全站精选数混淆
const indexHint = computed(() => activeCategory.value
    ? `当前栏目「${activeCategory.value}」共 ${flatList.value.length} 篇，精选文章共 ${featured.length} 篇`
    : `精选文章共 ${featured.length} 篇`)

// 渲染时把跨分组的全局序号一并算好，键盘上下切换和序号保持一致
const renderGroups = computed(() => {
    let index = 0
    return list.value.map(group => ({
        category: group.category,
        posts: group.posts.map(post => ({post, index: index++}))
    }))
})

const categories = computed(() => groups.value.map(group => ({
    name: group.category,
    count: group.posts.length
})))

const active = computed(() => flatList.value[Math.min(current.value, flatList.value.length - 1)])

// 标题按实际行数撑开、不参与收缩；简介外层只承接剩余高度，简介段落自身按整行截断，
// 这样段落高度恒为「行高 × 整数行」，不会在容器底部露出半行
const detailEl = ref(null)
const noteBoxEl = ref(null)
const noteEl = ref(null)
const noteLines = ref(2)
const noteFits = ref(true)
const noteStyle = computed(() => (noteFits.value
    ? {'-webkit-line-clamp': String(noteLines.value)}
    : {display: 'none'}))

let frame = 0
const measureNote = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
        const box = noteBoxEl.value
        const note = noteEl.value
        if (!box || !note) return
        const lineHeight = parseFloat(getComputedStyle(note).lineHeight)
        if (!lineHeight) return
        // 外层由 flex 分配到剩余高度，取其小数高度折算「能完整放下」的行数，
        // 向下取整后即使容器高度不是行高整数倍也只会留白，不会切字
        const lines = Math.floor((box.getBoundingClientRect().height + 0.5) / lineHeight)
        // 连一行都放不下时整段隐藏，避免露出半行
        noteFits.value = lines >= 1
        noteLines.value = Math.max(1, lines)
    })
}

watch(active, async () => {
    await nextTick()
    measureNote()
})

let observer
onMounted(() => {
    measureNote()
    observer = new ResizeObserver(measureNote)
    if (detailEl.value) observer.observe(detailEl.value)
    // 简介外层的高度随标题行数变化，也要跟着重新折算行数
    if (noteBoxEl.value) observer.observe(noteBoxEl.value)
})

onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    observer?.disconnect()
})

watch(list, () => {
    current.value = 0
    itemEls.value = []
})

const selectCategory = (name) => {
    activeCategory.value = activeCategory.value === name ? '' : name
}

const step = (delta) => {
    const length = flatList.value.length
    if (!length) return
    current.value = (current.value + delta + length) % length
}

const setItemRef = (el, index) => {
    if (el) itemEls.value[index] = el
}

const moveFocus = (index, delta) => {
    const length = flatList.value.length
    if (!length) return
    const next = (index + delta + length) % length
    current.value = next
    itemEls.value[next]?.focus()
}

const formatDate = (seconds) => {
    if (!seconds) return ''
    const date = new Date((seconds + 8 * 3600) * 1000)
    return `${date.getUTCFullYear()}.${String(date.getUTCMonth() + 1).padStart(2, '0')}.${String(date.getUTCDate()).padStart(2, '0')}`
}
</script>

<style scoped>
.featured-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--blog-space-3, 12px);
  margin-bottom: var(--blog-space-4, 16px);
}

.featured-chips {
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

.featured-nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: var(--blog-space-2, 8px);
}

.nav-index {
  min-width: 0;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: border-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    color var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    background-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease);
}

.nav-btn:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.nav-btn svg {
  width: 15px;
  height: 15px;
}

.featured-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: var(--blog-space-4, 16px);
  align-items: stretch;
  /* 整块定高：左右两栏由网格拉伸到同一高度，切换文章/栏目都不改变版面 */
  height: 352px;
}

.featured-detail {
  position: relative;
  display: flex;
  flex-direction: column;
  /* 高度交给网格拉伸，与右侧列表严格等高 */
  min-height: 0;
  height: 100%;
  padding: var(--blog-space-6, 24px);
  overflow: hidden;
  background:
    radial-gradient(120% 120% at 100% 0%, var(--vp-c-brand-soft), transparent 58%),
    var(--vp-c-bg-soft);
}

.featured-detail::after {
  content: "”";
  position: absolute;
  right: -18px;
  bottom: -34px;
  font-size: 130px;
  line-height: 1;
  color: var(--vp-c-brand-1);
  opacity: 0.08;
  pointer-events: none;
}

.detail-inner {
  display: flex;
  flex-direction: column;
  gap: var(--blog-space-3, 12px);
  flex: 1;
  min-height: 0;
}

.detail-meta {
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--blog-space-3, 12px);
}

/* 标题完整显示，允许自然换行；不参与 flex 收缩，避免固定高度下被压掉最后一行 */
.detail-title {
  flex: none;
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 0.2px;
  overflow-wrap: break-word;
  color: var(--vp-c-text-1);
}

/* 简介外层只承接标题之外的剩余高度，真正截断交给内部段落，外层不参与裁字 */
.detail-note-box {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

/* 简介段落高度自适应（受 clamp 限制），因此高度恒为行高的整数倍，末行完整且带省略号 */
.detail-note {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  margin: 0;
  overflow: hidden;
  font-size: 14px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}

.detail-link {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  margin-top: auto;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.6;
  color: var(--vp-c-brand-1);
}

.detail-link svg {
  width: 15px;
  height: 15px;
  transition: transform var(--blog-duration-fast, 150ms) var(--blog-ease, ease);
}

.detail-link:hover svg {
  transform: translateX(3px);
}

.featured-list {
  height: 100%;
  min-height: 0;
  /* 与左侧概览卡片同一套描边与圆角，列表项与边框之间留出内边距 */
  /* 顶部不留内边距：吸顶标题的底色直接贴到容器上边缘，滚动内容不会从上方缝隙穿出 */
  padding: 0 var(--blog-space-2, 8px) var(--blog-space-2, 8px);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--blog-radius-card, 12px);
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--vp-c-divider) transparent;
}

.featured-list::-webkit-scrollbar {
  width: 6px;
}

.featured-list::-webkit-scrollbar-thumb {
  border-radius: var(--blog-radius-pill, 999px);
  background-color: var(--vp-c-divider);
}

.feature-group + .feature-group {
  margin-top: var(--blog-space-1, 4px);
}

.feature-group-head {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--blog-space-2, 8px);
  min-height: 26px;
  margin: 0 0 2px;
  /* 顶部留白放在吸顶标题自身，底色随标题一起延伸，滚动时不会透出条目 */
  padding: var(--blog-space-2, 8px) var(--blog-space-3, 12px) 0;
  background-color: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 11px;
  font-weight: 600;
  line-height: 1.6;
  letter-spacing: 0.5px;
  color: var(--vp-c-text-3);
}

.feature-rows {
  margin: 0;
  padding: 0;
  list-style: none;
}

.featured-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: var(--blog-space-3, 12px);
  width: 100%;
  min-height: 48px;
  padding: 9px var(--blog-space-3, 12px);
  border: 1px solid transparent;
  border-radius: var(--blog-radius, 8px);
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    border-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease);
}

.featured-item:hover {
  background-color: var(--vp-c-bg-soft);
}

.featured-item.active {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
}

.featured-item:focus-visible {
  outline-offset: -2px;
}

.item-index {
  padding-top: 2px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.5;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-3);
}

.featured-item.active .item-index {
  color: var(--vp-c-brand-1);
}

.item-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.item-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.55;
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.featured-item.active .item-title {
  color: var(--vp-c-brand-1);
}

.item-sub {
  font-size: 12px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-enter {
  animation: detail-in var(--blog-duration, 250ms) var(--blog-ease, ease) both;
}

@keyframes detail-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 860px) {
  .featured-shell {
    grid-template-columns: 1fr;
    /* 窄屏改为上下堆叠，两栏各自定高，容器不再固定 */
    height: auto;
  }

  .featured-detail {
    /* 窄屏单独使用更紧凑的固定高度，避免桌面像素撑出空白 */
    height: 260px;
    min-height: 0;
    padding: var(--blog-space-5, 20px);
  }

  .featured-list {
    height: 320px;
  }
}

@media (max-width: 640px) {
  .featured-toolbar {
    align-items: flex-start;
  }

  /* 换行后翻页控件贴右，与桌面端位置保持一致 */
  .featured-nav {
    margin-left: auto;
  }

  .chip {
    height: 32px;
    padding: 0 13px;
  }

  .nav-btn {
    width: 34px;
    height: 34px;
  }

  .featured-detail {
    height: 220px;
    padding: var(--blog-space-4, 16px);
  }

  .featured-list {
    height: 300px;
  }

  .detail-title {
    font-size: 18px;
    line-height: 1.55;
  }

  .detail-note {
    font-size: 13px;
    line-height: 1.75;
  }

  .featured-item {
    min-height: 46px;
    padding: 10px var(--blog-space-2, 8px);
  }
}
</style>
