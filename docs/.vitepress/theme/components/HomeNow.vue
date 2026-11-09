<template>
  <section class="home-block">
    <h2 class="home-title">正在做 <small>更新于 {{ now.updated }}</small></h2>
    <div class="now-card home-card">
      <p class="now-intro">{{ now.intro }}</p>
      <ul class="now-list">
        <li v-for="item in now.items" :key="item.label" class="now-item">
          <span class="home-pill">{{ item.label }}</span>
          <a v-if="item.link" class="home-link now-text" :href="item.link">{{ item.text }}</a>
          <span v-else class="now-text">{{ item.text }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import now from '../../../data/now.json'
</script>

<style scoped>
.now-card {
  padding: var(--blog-space-4, 16px);
}

.now-intro {
  margin: 0 0 var(--blog-space-4, 16px);
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.now-list {
  display: flex;
  flex-direction: column;
  gap: var(--blog-space-3, 12px);
  margin: 0;
  padding: 0;
  list-style: none;
}

.now-item {
  display: flex;
  align-items: center;
  gap: var(--blog-space-3, 12px);
}

.now-text {
  min-width: 0;
  font-size: 14px;
  line-height: 1.5;
}
</style>
