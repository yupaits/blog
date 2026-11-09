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
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: var(--blog-space-3, 12px);
}

.featured-card {
  display: flex;
  flex-direction: column;
  gap: var(--blog-space-2, 8px);
  padding: var(--blog-space-4, 16px);
  transition: transform var(--blog-duration, 250ms) ease, border-color var(--blog-duration, 250ms) ease;
}

.featured-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-2);
}

.featured-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--blog-space-2, 8px);
}

.featured-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
}

.featured-note {
  margin: 0;
  line-height: 1.6;
}
</style>
