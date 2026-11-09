<template>
  <Layout>
    <template #layout-top>
      <div v-if="showWatermark" class="blog-watermark" aria-hidden="true" :style="{ backgroundImage: watermarkImage }"/>
    </template>

    <template #doc-before>
      <DraftAnnounce v-if="isDraft" :preview="previewDraft"/>
      <PageMetadata v-if="showMeta"/>
    </template>

    <template #doc-after>
      <CommentRule v-if="hasComment"/>
      <GiscusComment v-if="hasComment && isArticle && commentReady"/>
    </template>

    <template #doc-footer-before>
      <PageCopyRight v-if="hasComment"/>
      <PageShare v-if="hasComment"/>
      <BackToTop/>
    </template>
  </Layout>
</template>

<script setup>
import {useData, useRoute} from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import {computed, defineAsyncComponent, nextTick, onMounted, provide, ref, watch} from 'vue'
import BackToTop from './components/BackToTop.vue'
import CommentRule from './components/CommentRule.vue'
import DraftAnnounce from './components/DraftAnnounce.vue'
import PageCopyRight from './components/PageCopyright.vue'
import PageMetadata from './components/PageMetadata.vue'
import PageShare from './components/PageShare.vue'

const GiscusComment = defineAsyncComponent(() => import('./components/GiscusComment.vue'))

const {Layout} = DefaultTheme
const {frontmatter, isDark, site} = useData()
const route = useRoute()

// 文章页才显示水印；首页、栏目首页、草稿页关闭
const isArticle = computed(() => {
  const path = route.path
  return frontmatter.value.layout !== 'home' && path !== '/' && !/^\/[^/]+\/$/.test(path)
})

const showWatermark = computed(() => {
  const fm = frontmatter.value
  return isArticle.value && fm.watermark !== 'hidden' && fm.draft !== true
})

const showMeta = computed(() => showWatermark.value)

const isDraft = computed(() => frontmatter.value.draft === true)
const previewDraft = computed(() => frontmatter.value.draftPreview === true)
const hasComment = computed(() => frontmatter.value.comment !== false)
const commentReady = ref(false)

// 水印由图块平铺生成，浅色/暗色各一套透明度，避免依赖额外的包裹层
const watermarkImage = computed(() => {
    const title = site.value.title || 'yupaits notes'
    const color = isDark.value ? '#ffffff' : '#000000'
    const opacity = isDark.value ? 0.06 : 0.05
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="190"><text x="140" y="100" fill="${color}" fill-opacity="${opacity}" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle" transform="rotate(-22 140 100)">${title}</text></svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
})

// 深浅色切换：整体用颜色过渡完成。
// 之前用 View Transition 的整页快照 + 圆形裁剪，切换瞬间新快照会先完整绘制一帧，
// 从深色切浅色时就是那一下闪白；改成只过渡颜色属性后不存在快照中转帧。
let themeTimer = 0

provide('toggle-appearance', () => {
    const root = document.documentElement

    // 减少动效偏好下直接切换，不做过渡
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        isDark.value = !isDark.value
        return
    }

    root.classList.add('theme-transitioning')
    // 先强制一次样式计算，让过渡属性在当前主题的颜色上生效
    void root.offsetHeight
    isDark.value = !isDark.value

    window.clearTimeout(themeTimer)
    themeTimer = window.setTimeout(() => {
        root.classList.remove('theme-transitioning')
    }, 300)
})

// 五彩纸屑：仅首页每天首次访问、尊重减少动效偏好，可通过 localStorage 关闭
const initConfetti = async () => {
    if (frontmatter.value.layout !== 'home') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (localStorage.getItem('blog-confetti') === 'off') return
    const key = 'blog-confetti-date'
    const today = new Date().toISOString().slice(0, 10)
    if (localStorage.getItem(key) === today) return
    const {default: confetti} = await import('canvas-confetti')
    confetti({particleCount: 100, spread: 170, origin: {y: 0.6}})
    localStorage.setItem(key, today)
}

// 视频按需加载：构建期已把 src 移到 data-src，点击占位按钮后才请求
const initLazyVideos = () => {
    document.querySelectorAll('.vp-doc iframe[data-src]').forEach(iframe => {
        if (iframe.dataset.lazyBound) return
        iframe.dataset.lazyBound = 'true'
        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'video-play'
        button.textContent = '点击加载视频'
        button.addEventListener('click', () => {
            iframe.src = iframe.dataset.src
            button.remove()
        }, {once: true})
        iframe.parentElement?.appendChild(button)
    })
}

// Fancybox 脚本 defer 后按需重新绑定
const bindFancybox = () => {
    const Fancybox = window.Fancybox
    if (!Fancybox?.bind) return
    try {
        Fancybox.unbind('[data-fancybox]')
        Fancybox.bind('[data-fancybox]')
    } catch {
        // 脚本尚未就绪时由 load 事件重试
    }
}

const handleDoc = () => {
    const hidden = frontmatter.value.draft === true && frontmatter.value.draftPreview !== true
    document.querySelector('main .vp-doc')?.classList.toggle('draft-hidden', hidden)
    let meta = document.querySelector('meta[name="robots"]')
    if (hidden) {
        if (!meta) {
            meta = document.createElement('meta')
            meta.name = 'robots'
            meta.content = 'noindex, nofollow'
            document.head.appendChild(meta)
        }
    } else if (meta) {
        meta.remove()
    }
}

watch(() => route.path, async () => {
    await nextTick()
    handleDoc()
    initLazyVideos()
    bindFancybox()
})

// 评论区延后到首屏空闲再加载，避免阻塞文章渲染
onMounted(() => {
    initConfetti()
    handleDoc()
    initLazyVideos()
    window.addEventListener('load', bindFancybox, {once: true})
    const schedule = window.requestIdleCallback
        ? cb => window.requestIdleCallback(cb, {timeout: 2000})
        : cb => setTimeout(cb, 1200)
    schedule(() => {
        commentReady.value = true
    })
})

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
main .vp-doc.draft-hidden {
  display: none;
}

/* 深浅色切换：只过渡颜色相关属性（背景、文字、边框、图标描边），
   不碰 backdrop-filter / box-shadow / 尺寸，避免切换时整页重绘掉帧 */
html {
  background-color: var(--vp-c-bg);
}

html.theme-transitioning,
html.theme-transitioning *,
html.theme-transitioning *::before,
html.theme-transitioning *::after {
  transition-property: background-color, border-color, color, fill, stroke, outline-color !important;
  transition-duration: 240ms !important;
  transition-timing-function: ease !important;
  transition-delay: 0s !important;
}

@media (prefers-reduced-motion: reduce) {
  html.theme-transitioning,
  html.theme-transitioning *,
  html.theme-transitioning *::before,
  html.theme-transitioning *::after {
    transition-duration: 0s !important;
  }
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}
</style>
