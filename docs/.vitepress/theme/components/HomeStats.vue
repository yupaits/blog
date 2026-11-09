<template>
  <section class="home-block">
    <h2 class="home-title">
      <span>站点概览</span>
      <small>Just do &amp; record · 点击栏目可筛选下方时间轴</small>
    </h2>
    <div class="overview">
      <div class="overview-stats home-card">
        <div v-for="item in items" :key="item.label" class="stat-item" :class="{'stat-item-date': item.isDate}">
          <span class="stat-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
                 stroke-linecap="round" stroke-linejoin="round">
              <path v-for="d in item.icon" :key="d" :d="d"/>
            </svg>
          </span>
          <span class="stat-label">{{ item.label }}</span>
          <strong class="stat-value">
            {{ item.value }}<span v-if="item.unit" class="stat-unit">{{ item.unit }}</span>
          </strong>
        </div>
      </div>
      <div class="overview-cats home-card">
        <div class="cats-head">
          <span class="cats-title">栏目分布</span>
          <span class="cats-hint">共 {{ totalPosts }} 篇</span>
        </div>
        <button v-for="cat in categories" :key="cat.name" type="button" class="cat-row"
                :class="{active: activeCategory === cat.name}"
                :aria-pressed="activeCategory === cat.name"
                :title="`筛选「${cat.name}」的文章`"
                @click="$emit('filter', cat.name)">
          <span class="cat-name">{{ cat.name }}</span>
          <span class="home-count">{{ cat.count }}<span class="home-count-unit">篇</span></span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import {computed} from 'vue'

const {stats, categories = [], activeCategory = ''} = defineProps(['stats', 'categories', 'activeCategory'])
defineEmits(['filter'])

const formatDate = (seconds) => {
    if (!seconds) return '—'
    const date = new Date((seconds + 8 * 3600) * 1000)
    return `${date.getUTCFullYear()}.${String(date.getUTCMonth() + 1).padStart(2, '0')}.${String(date.getUTCDate()).padStart(2, '0')}`
}

const totalPosts = computed(() => categories.reduce((sum, cat) => sum + cat.count, 0) || stats.posts)

const items = computed(() => [
    {
        value: stats.posts,
        unit: '篇',
        label: '文章总数',
        icon: ['M6 3h8l4 4v14H6z', 'M14 3v4h4', 'M9 12h6', 'M9 16h6']
    },
    {
        value: (stats.words / 10000).toFixed(1),
        unit: '万字',
        label: '累计字数',
        icon: ['M4 6h16', 'M4 12h10', 'M4 18h7', 'M17 13l3 3-4 4-3 1 1-3z']
    },
    {
        value: stats.years,
        unit: '年',
        label: '写作年份',
        icon: ['M4 6h16v14H4z', 'M8 3v4', 'M16 3v4', 'M4 10h16', 'M8 14h2', 'M14 14h2']
    },
    {
        value: formatDate(stats.updated),
        label: '最近更新',
        isDate: true,
        icon: ['M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16', 'M12 8v4l3 2']
    }
])
</script>

<style scoped>
.overview {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: var(--blog-space-4, 16px);
  align-items: stretch;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: 0;
}

/* 标签在上、数字在下：四项共享同一行基线与间距，数字不与图标抢位置 */
.stat-item {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-areas:
    "icon label"
    "value value";
  align-content: center;
  align-items: center;
  column-gap: 6px;
  row-gap: 6px;
  min-height: 92px;
  padding: var(--blog-space-4, 16px) var(--blog-space-4, 16px);
}

/* 图标退为线性小标，取消底色块，减少“边框 + 底色 + 图标底”的层层堆叠 */
.stat-icon {
  grid-area: icon;
  display: inline-flex;
  align-items: center;
  color: var(--vp-c-text-3);
}

.stat-icon svg {
  width: 15px;
  height: 15px;
}

/* 数字为主、单位退后，避免“万字/年”与数值抢视觉重量 */
.stat-value {
  grid-area: value;
  display: flex;
  align-items: baseline;
  gap: 3px;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.3px;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-1);
}

.stat-unit {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0;
  color: var(--vp-c-text-3);
}

/* 日期不是计数，字号收一档，避免与三个数字争夺注意力 */
.stat-item-date .stat-value {
  font-size: 19px;
  letter-spacing: 0.2px;
}

.stat-label {
  grid-area: label;
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: 0.4px;
  color: var(--vp-c-text-3);
}

/* 细分隔线代替四张卡片：竖线分列，横线分行，线本身不与内容争抢 */
.stat-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: var(--blog-space-4, 16px);
  bottom: var(--blog-space-4, 16px);
  width: 1px;
  background-color: var(--vp-c-divider);
}

.stat-item:nth-child(odd)::before {
  display: none;
}

.stat-item:nth-child(n+3)::after {
  content: "";
  position: absolute;
  top: 0;
  left: var(--blog-space-4, 16px);
  right: var(--blog-space-4, 16px);
  height: 1px;
  background-color: var(--vp-c-divider);
}

.overview-cats {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--blog-space-4, 16px) var(--blog-space-3, 12px) var(--blog-space-3, 12px);
}

.cats-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--blog-space-2, 8px);
  margin-bottom: var(--blog-space-2, 8px);
  padding: 0 var(--blog-space-2, 8px);
}

.cats-title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--vp-c-text-1);
}

.cats-hint {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

/* 栏目用“名称 + 数量徽标”的离散计数表达，同一数字列右对齐便于横向比较 */
.cat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--blog-space-3, 12px);
  width: 100%;
  min-height: 38px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: var(--blog-radius, 8px);
  background: transparent;
  font-size: 13px;
  line-height: 1.5;
  text-align: left;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: background-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    border-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    color var(--blog-duration-fast, 150ms) var(--blog-ease, ease);
}

.cat-row:hover {
  background-color: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
}

.cat-row.active {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.cat-row:focus-visible {
  outline-offset: 1px;
}

.cat-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cat-row:hover .home-count {
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.cat-row.active .home-count {
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
}

.cat-row.active .home-count-unit {
  opacity: 0.8;
}

@media (max-width: 860px) {
  .overview {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .overview-stats {
    padding: 0;
  }

  /* 窄屏去掉图标列，保留“标签在上、数字在下”的同一顺序 */
  .stat-item {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "label"
      "value";
    row-gap: 4px;
    min-height: 76px;
    padding: var(--blog-space-3, 12px);
  }

  .stat-icon {
    display: none;
  }

  .stat-value {
    font-size: 22px;
  }

  .stat-item-date .stat-value {
    font-size: 16px;
  }

  .stat-item::before {
    top: var(--blog-space-3, 12px);
    bottom: var(--blog-space-3, 12px);
  }

  .stat-item:nth-child(n+3)::after {
    left: var(--blog-space-3, 12px);
    right: var(--blog-space-3, 12px);
  }

  .overview-cats {
    padding: var(--blog-space-3, 12px) var(--blog-space-3, 12px) var(--blog-space-2, 8px);
  }

  .cat-row {
    min-height: 40px;
    padding: 0 var(--blog-space-2, 8px);
  }
}
</style>
