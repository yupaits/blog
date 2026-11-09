<template>
  <section class="home-block">
    <h2 class="home-title">精选文章 <small>从旧文里挑出来的几篇</small></h2>
    <div class="featured-grid">
      <a v-for="post in featured" :key="post.url" class="featured-card home-card home-link" :href="post.url">
        <div class="featured-meta">
          <span class="home-pill">{{ post.category }}</span>
          <span class="home-muted">{{ formatDate(post.date) }}</span>
        </div>
        <strong class="featured-title">{{ post.title }}</strong>
        <p v-if="post.note" class="featured-note home-muted">{{ post.note }}</p>
      </a>
    </div>
  </section>
</template>

<script setup>
const {featured} = defineProps(['featured'])

const formatDate = (seconds) => {
    if (!seconds) return ''
    const date = new Date((seconds + 8 * 3600) * 1000)
    return `${date.getUTCFullYear()}.${String(date.getUTCMonth() + 1).padStart(2, '0')}.${String(date.getUTCDate()).padStart(2, '0')}`
}
</script>

<style scoped>
.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: var(--blog-space-4, 16px);
}

.featured-card {
  display: flex;
  flex-direction: column;
  gap: var(--blog-space-2, 8px);
  padding: var(--blog-space-5, 20px);
  transition: transform var(--blog-duration, 250ms) ease, border-color var(--blog-duration, 250ms) ease, box-shadow var(--blog-duration, 250ms) ease;
}

.featured-card:hover {
  transform: translateY(-3px);
  border-color: var(--vp-c-brand-2);
  box-shadow: 0 8px 24px var(--vp-shadow-1);
}

.featured-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--blog-space-2, 8px);
}

.featured-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  transition: color var(--blog-duration-fast, 150ms) ease;
}

.featured-card:hover .featured-title {
  color: var(--vp-c-brand-1);
}

.featured-note {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.featured-card:hover .featured-note {
  color: var(--vp-c-text-1);
}
</style>
