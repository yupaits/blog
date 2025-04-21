import confetti from 'canvas-confetti'
import { ElTimeline, ElTimelineItem, ElWatermark } from 'element-plus'
import { useData, useRoute } from 'vitepress'
import giscusTalk from 'vitepress-plugin-comment-with-giscus'
import { BProgress } from '@bprogress/core'
import DefaultTheme from 'vitepress/theme'
import { onMounted, watch } from 'vue'
import MyLayout from './MyLayout.vue'
import LinkCard from './components/LinkCard.vue'
import LinkCardGroup from './components/LinkCardGroup.vue'
import Progress from './components/Progress.vue'

import 'element-plus/dist/index.css'
import '@bprogress/core/css'
import './style/index.css'
import './style/var.css'

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  setup() {
    const { frontmatter } = useData()
    const route = useRoute()

    // Giscus评论
    giscusTalk({
      repo: 'yupaits/giscus',
      repoId: 'R_kgDOOciJmA',
      category: 'General',
      categoryId: 'DIC_kwDOOciJmM4CpRt2',
      mapping: 'pathname',
      reactionsEnabled: '1',
      inputPosition: 'bottom',
      lang: 'zh-CN',
      loading: 'lazy'
    }, {
      frontmatter, route
    }, true)

    const initConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 170,
        origin: { y: 0.6 }
      })
    }

    // busuanzi统计
    const useBusuanzi = () => {
      const script = document.createElement('script')
      script.defer = true
      script.async = true
      script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
      document.head.appendChild(script)
    }

    onMounted(() => {
      initConfetti()
      useBusuanzi()
    })

    watch(
      () => route.path,
      () => {
        useBusuanzi()
      }
    )
  },
  async enhanceApp({ app, router }) {
    app.component('LinkCard', LinkCard)
    app.component('LinkCardGroup', LinkCardGroup)
    app.component('Progress', Progress)
    app.component('Timeline', ElTimeline)
    app.component('TimelineItem', ElTimelineItem)
    app.component('Watermark', ElWatermark)

    router.onBeforeRouteChange = () => {
      BProgress.start()
    }
    router.onAfterRouteChanged = () => {
      BProgress.done()
    }
  }
}

