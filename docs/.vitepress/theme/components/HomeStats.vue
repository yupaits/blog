<template>
  <section class="home-block">
    <h2 class="home-title">站点概览 <small>Just do &amp; record</small></h2>
    <div class="stat-grid">
      <div v-for="item in items" :key="item.label" class="stat-item home-card">
        <strong class="stat-value">{{ item.value }}</strong>
        <span class="stat-label">{{ item.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import {computed} from 'vue'

const {stats} = defineProps(['stats'])

const formatDate = (seconds) => {
    if (!seconds) return '—'
    const date = new Date((seconds + 8 * 3600) * 1000)
    return `${date.getUTCFullYear()}.${String(date.getUTCMonth() + 1).padStart(2, '0')}.${String(date.getUTCDate()).padStart(2, '0')}`
}

const items = computed(() => [
    {value: stats.posts, label: '篇文章'},
    {value: `${(stats.words / 10000).toFixed(1)} 万`, label: '累计字数'},
    {value: stats.years, label: '个写作年份'},
    {value: formatDate(stats.updated), label: '最近更新'}
])
</script>

<style scoped>
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--blog-space-3, 12px);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--blog-space-2, 8px);
  padding: 18px var(--blog-space-4, 16px);
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-brand-1);
}

.stat-label {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-value {
    font-size: 20px;
  }
}
</style>
