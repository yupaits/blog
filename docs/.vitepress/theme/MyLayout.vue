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

// 启用深色/浅色主题切换动画
const enableTransitions = () =>
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches

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
