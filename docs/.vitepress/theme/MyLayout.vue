<template>
  <div v-if="watermarkHidden()">
    <BlogPage/>
  </div>
  <watermark :font="font" :content="site.title" v-else>
    <BlogPage/>
  </watermark>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useData } from 'vitepress'
import BlogPage from './components/BlogPage.vue'
const { frontmatter, site, isDark } = useData()

const font = reactive({
  color: 'rgba(0, 0, 0, .08)'
})

const watermarkHidden = () => {
  const watermarkHidden = frontmatter.value?.watermark
  return watermarkHidden === 'hidden'
}

watch(
  isDark,
  () => {
    font.color = isDark.value
      ? 'rgba(255, 255, 255, .08)'
      : 'rgba(0, 0, 0, .08)'
  },
  {
    immediate: true,
  }
)
</script>