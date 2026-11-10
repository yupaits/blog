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

// 深浅色切换：只过渡页面底色 + 内容整体淡入，不再给每个元素挂颜色过渡。
// 之前 html.theme-transitioning * 会让上万个元素同时跑 background-color / color / border-color
// 插值（实测每次切换 1.1 万条过渡），主线程逐帧重绘整页文字导致卡顿；1px 边框与分割线各自
// 插值还会在底色变浅/变深途中出现明暗不一致的"闪"。现在文字与线条在切换瞬间一次性落定，
// 只让页面底色和导航/侧栏几处承载层做底色过渡，再用内容淡入盖住硬跳，全程十来条过渡。
let themeTimer = 0

provide('toggle-appearance', () => {
    const root = document.documentElement

    // 减少动效偏好下直接切换，不做过渡
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        isDark.value = !isDark.value
        return
    }

    // 内容从 55% 淡入，底色做颜色过渡
    root.classList.add('theme-transitioning')
    // 只刷新样式计算（不触发整页布局），让过渡规则与旧主题底色先确定下来，
    // 否则同一帧内新增过渡规则再改主题，浏览器不会生成过渡
    void getComputedStyle(root).backgroundColor
    isDark.value = !isDark.value

    window.clearTimeout(themeTimer)
    themeTimer = window.setTimeout(() => {
        root.classList.remove('theme-transitioning')
    }, 320)
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

// Fancybox 按需加载：只有当前页出现正文大图（data-fancybox）时才拉取 CDN 资源
let fancyboxTask = null
const loadFancybox = () => {
    if (window.Fancybox?.bind) return Promise.resolve(window.Fancybox)
    if (fancyboxTask) return fancyboxTask
    fancyboxTask = new Promise((resolve, reject) => {
        if (!document.querySelector('link[data-fancybox-css]')) {
            const css = document.createElement('link')
            css.rel = 'stylesheet'
            css.href = 'https://cdnjs.cloudflare.com/ajax/libs/fancyapps-ui/4.0.31/fancybox.min.css'
            css.dataset.fancyboxCss = ''
            document.head.appendChild(css)
        }
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fancyapps-ui/4.0.31/fancybox.umd.js'
        script.async = true
        script.onload = () => window.Fancybox?.bind
            ? resolve(window.Fancybox)
            : reject(new Error('Fancybox 未就绪'))
        script.onerror = () => reject(new Error('Fancybox 加载失败'))
        document.head.appendChild(script)
    }).catch(() => {
        // 网络异常时允许下次路由切换重试，正文图片不受影响
        fancyboxTask = null
        return null
    })
    return fancyboxTask
}

const bindFancybox = async () => {
    if (!document.querySelector('.vp-doc [data-fancybox]')) return
    const Fancybox = await loadFancybox()
    if (!Fancybox?.bind) return
    try {
        Fancybox.unbind('[data-fancybox]')
        Fancybox.bind('[data-fancybox]')
    } catch {
        // 绑定失败时保持原生 img 行为
    }
}

// 首屏空闲后再加载，避免与 LCP 抢带宽；路由切换后重新绑定新页面的图片
const scheduleBindFancybox = () => {
    const run = () => bindFancybox()
    if (window.requestIdleCallback) {
        window.requestIdleCallback(run, {timeout: 2500})
    } else {
        setTimeout(run, 800)
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
    scheduleBindFancybox()
})

// 评论区延后到首屏空闲再加载，避免阻塞文章渲染
onMounted(() => {
    initConfetti()
    handleDoc()
    initLazyVideos()
    scheduleBindFancybox()
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

/* 深浅色切换：只让少数大面积底色做过渡，文字与线条瞬时落定后再靠整体淡入遮住，
   避免上万条逐元素插值造成的掉帧，也避免 1px 线条各自插值产生的明暗闪动 */
html {
  background-color: var(--vp-c-bg);
}

html.theme-transitioning,
html.theme-transitioning body,
html.theme-transitioning .VPNavBar,
html.theme-transitioning .VPSidebar,
html.theme-transitioning .VPLocalNav,
html.theme-transitioning .VPContent,
html.theme-transitioning .VPDoc,
html.theme-transitioning .VPFooter {
  transition: background-color 240ms ease !important;
}

@keyframes theme-content-fade {
  from {
    opacity: 0.55;
  }
  to {
    opacity: 1;
  }
}

html.theme-transitioning #app {
  animation: theme-content-fade 240ms ease both;
}

@media (prefers-reduced-motion: reduce) {
  html.theme-transitioning,
  html.theme-transitioning body,
  html.theme-transitioning .VPNavBar,
  html.theme-transitioning .VPSidebar,
  html.theme-transitioning .VPLocalNav,
  html.theme-transitioning .VPContent,
  html.theme-transitioning .VPDoc,
  html.theme-transitioning .VPFooter {
    transition-duration: 0s !important;
  }

  html.theme-transitioning #app {
    animation: none !important;
  }
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}
</style>
