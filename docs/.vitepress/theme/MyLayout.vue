<template>
  <BlogPage v-if="hideWm" :hasMeta="false"/>
  <el-watermark v-else :content="site.title" :font="font" :gap="[160, 120]">
    <BlogPage :hasMeta="true"/>
  </el-watermark>
</template>

<script setup>
import {ElWatermark} from 'element-plus'
import {useData, useRoute} from 'vitepress'
import {computed, nextTick, provide, reactive, watch} from 'vue'
import BlogPage from './components/BlogPage.vue'

const {frontmatter, site, isDark} = useData()
const route = useRoute()

const font = reactive({
  color: 'rgba(0, 0, 0, .08)',
  fontSize: 13
})

// 水印仅在文章页展示：首页、栏目页、草稿页默认关闭
const hideWm = computed(() => {
  const fm = frontmatter.value
  const path = route.path
  const isIndex = path === '/' || /^\/[^/]+\/$/.test(path)
  return fm.watermark === 'hidden' || fm.layout === 'home' || isIndex || fm.draft === true
})

// 启用深色/浅色主题切换动画
const enableTransitions = () =>
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches

// 深色/浅色主题切换动画
provide('toggle-appearance', async ({x, y}) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`
  ]

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
      {clipPath: isDark.value ? clipPath.reverse() : clipPath},
      {
        duration: 300,
        easing: 'ease-in',
        fill: 'forwards',
        pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
      }
  )
})

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
const copyright = `------\n著作权归 yupaits notes(yupaits.top) 所有\n采用CC BY-NC-SA 4.0许可协议\n原文链接: `
if (!import.meta.env.SSR) {
  document.addEventListener('copy', event => {
    const clipboardData = event?.clipboardData || window?.clipboardData
    if (!clipboardData) {
      return
    }
    const selection = window?.getSelection()
    const text = selection?.toString()
    if (!text || text.length < 100) {
      return
    }
    const anchor = selection?.anchorNode
    const element = anchor?.nodeType === 3 ? anchor.parentElement : anchor
    if (element?.closest('pre, code, .vp-code-group')) {
      return
    }
    event.preventDefault()
    clipboardData.setData('text/plain', `${text}\n${copyright}${decodeURI(window.location.origin + window.location.pathname)}`)
  })
}
</script>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}
</style>