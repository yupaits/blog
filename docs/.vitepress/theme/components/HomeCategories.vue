<template>
  <section class="home-block">
    <h2 class="home-title">按栏目浏览 <small>共 {{ total }} 篇文章</small></h2>
    <div class="category-grid">
      <a v-for="item in categories" :key="item.name" class="category-card home-card home-link" :href="item.url">
        <img :src="item.icon" :alt="`${item.name} 图标`" width="40" height="40" loading="lazy" decoding="async"/>
        <div class="category-body">
          <div class="category-head">
            <strong>{{ item.name }}</strong>
            <span class="home-pill">{{ item.count }} 篇</span>
          </div>
          <p class="home-muted">{{ item.desc }}</p>
        </div>
      </a>
    </div>
  </section>
</template>

<script setup>
import {computed} from 'vue'

const {categories} = defineProps(['categories'])
const total = computed(() => categories.reduce((sum, item) => sum + item.count, 0))
</script>

<style scoped>
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 210px), 1fr));
  gap: var(--blog-space-3, 12px);
}

.category-card {
  display: flex;
  align-items: flex-start;
  gap: var(--blog-space-3, 12px);
  padding: var(--blog-space-4, 16px);
  transition: transform var(--blog-duration, 250ms) ease, border-color var(--blog-duration, 250ms) ease;
}

.category-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-2);
}

.category-card img {
  flex: none;
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.category-body {
  min-width: 0;
}

.category-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--blog-space-2, 8px);
  margin-bottom: 6px;
}

.category-head strong {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
}

.category-card p {
  margin: 0;
  line-height: 1.5;
}
</style>
