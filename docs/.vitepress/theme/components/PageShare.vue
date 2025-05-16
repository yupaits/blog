<template>
  <div class="share-box">
    <a class="share-btn" @click="nativeShare()">📤分享页面</a>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
const { page } = useData()

const nativeShare = async () => {
  // 检测浏览器是否支持原生分享API
  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        text: page.value?.title,
        url: window.location.origin + window.location.pathname
      })
    } catch (err) {
      console.log('用户取消了分享')
    }
  }
}
</script>

<style>
.share-box {
  display: flex;
  justify-content: end;
  align-items: center;
  margin-bottom: 1rem;
}

.share-btn {
  padding: 4px 8px;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  text-decoration: none;
}

.share-btn:hover {
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 15%);
  transition: box-shadow 0.3s ease-in-out;
}
</style>