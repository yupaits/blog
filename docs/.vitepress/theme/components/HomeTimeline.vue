<template>
  <section class="home-block">
    <h2 class="home-title">写作时间轴 <small>按内容更新聚合 · 共 {{ total }} 篇</small></h2>
    <div class="timeline">
      <details v-for="(group, index) in years" :key="group.year" :open="index < 2" class="year-group home-card">
        <summary class="year-head">
          <span class="year-label">{{ group.year }}</span>
          <span class="year-bar"><span class="year-bar-fill" :style="{width: percent(group)}"/></span>
          <span class="home-muted year-count">{{ group.posts.length }} 篇</span>
        </summary>
        <ul class="post-list">
          <li v-for="post in group.posts.slice(0, 8)" :key="post[1]" class="post-row">
            <span class="post-date">{{ formatDay(post[2]) }}</span>
            <a class="home-link post-title" :href="post[1]">{{ titleOf(post) }}</a>
          </li>
        </ul>
        <details v-if="group.posts.length > 8" class="more">
          <summary class="more-toggle home-muted">展开该年其余 {{ group.posts.length - 8 }} 篇</summary>
          <ul class="post-list">
            <li v-for="post in group.posts.slice(8)" :key="post[1]" class="post-row">
              <span class="post-date">{{ formatDay(post[2]) }}</span>
              <a class="home-link post-title" :href="post[1]">{{ titleOf(post) }}</a>
            </li>
          </ul>
        </details>
      </details>
    </div>
  </section>
</template>

<script setup>
const {years} = defineProps(['years'])

const total = years.reduce((sum, group) => sum + group.posts.length, 0)
const max = Math.max(...years.map(group => group.posts.length), 1)
const percent = (group) => `${Math.max(8, Math.round(group.posts.length / max * 100))}%`

// 数据层在标题与路径末段相同时省略了标题，这里补回
const titleOf = (post) => post[0] || decodeURIComponent(post[1]).split('/').filter(Boolean).pop()

const formatDay = (seconds) => {
    const date = new Date((seconds + 8 * 3600) * 1000)
    return `${date.getUTCMonth() + 1}/${String(date.getUTCDate()).padStart(2, '0')}`
}
</script>

<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
  gap: var(--blog-space-2, 8px);
}

.year-group {
  padding: 0 var(--blog-space-4, 16px);
}

.year-head {
  display: flex;
  align-items: center;
  gap: var(--blog-space-3, 12px);
  padding: 12px 0;
  cursor: pointer;
  list-style: none;
}

.year-head::-webkit-details-marker {
  display: none;
}

.year-label {
  min-width: 48px;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  font-variant-numeric: tabular-nums;
}

.year-bar {
  flex: 1;
  height: 6px;
  overflow: hidden;
  border-radius: var(--blog-radius-pill, 999px);
  background-color: var(--vp-c-bg-elv);
}

.year-bar-fill {
  display: block;
  height: 100%;
  border-radius: var(--blog-radius-pill, 999px);
  background-color: var(--vp-c-brand-1);
}

.year-count {
  white-space: nowrap;
}

.post-list {
  margin: 0 0 12px;
  padding: 0;
  list-style: none;
}

.post-row {
  display: flex;
  align-items: baseline;
  gap: var(--blog-space-3, 12px);
  padding: 4px 0;
  font-size: 14px;
}

.post-date {
  flex: none;
  width: 44px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
}

.post-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.more {
  margin-bottom: 12px;
}

.more-toggle {
  cursor: pointer;
  padding: 4px 0;
}
</style>
