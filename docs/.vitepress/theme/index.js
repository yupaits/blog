import {BProgress} from '@bprogress/core'
import {ElTimeline, ElTimelineItem} from 'element-plus'
import {useData, useRoute, useRouter} from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import {nextTick, onMounted, watch} from 'vue'
import MyLayout from './MyLayout.vue'
import LinkButton from './components/LinkButton.vue'
import LinkCard from './components/LinkCard.vue'
import LinkCardGroup from './components/LinkCardGroup.vue'
import Progress from './components/Progress.vue'
import BookDetail from './components/BookDetail.vue'

import '@bprogress/core/css'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-timeline.css'
import 'element-plus/theme-chalk/el-timeline-item.css'
import './style/var.css'

export default {
    extends: DefaultTheme,
    Layout: MyLayout,
    setup() {
        const {frontmatter} = useData()
        const route = useRoute()
        const router = useRouter()

        // 页面加载进度条
        router.onBeforePageLoad = () => {
            BProgress.start()
        }
        router.onAfterPageLoad = () => {
            BProgress.done()
        }

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

        watch(() => route.path, async () => {
            await nextTick()
            initLazyVideos()
            bindFancybox()
        })

        onMounted(() => {
            initConfetti()
            initLazyVideos()
            window.addEventListener('load', bindFancybox, {once: true})
        })
    },
    enhanceApp({app}) {
        app.component('LinkButton', LinkButton)
        app.component('LinkCard', LinkCard)
        app.component('LinkCardGroup', LinkCardGroup)
        app.component('Progress', Progress)
        app.component('BookDetail', BookDetail)
        app.component('Timeline', ElTimeline)
        app.component('TimelineItem', ElTimelineItem)
    }
}