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

//监听copy事件，向剪切板内容添加版权信息
const copyright = `------\n著作权归 yupaits notes(yupaits.com) 所有\n采用CC BY-NC-SA 4.0许可协议\n原文链接: `
document.addEventListener('copy', event => {
  const clipboardData = event?.clipboardData || window?.clipboardData
  if (!clipboardData) {
    return
  }
  const text = window?.getSelection()?.toString()
  if (text) {
    event.preventDefault()
    clipboardData.setData('text/plain', `${text}\n${copyright}${decodeURI(window.location.href)}`)
  }
})
</script>