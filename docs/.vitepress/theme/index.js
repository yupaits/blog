import busuanzi from 'busuanzi.pure.js'
import confetti from 'canvas-confetti'
import { ElTimeline, ElTimelineItem, ElWatermark } from 'element-plus'
import { NProgress } from 'nprogress-v2'
import giscusTalk from 'vitepress-plugin-comment-with-giscus'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { onMounted, watch } from 'vue'
import MyLayout from './MyLayout.vue'
import DraftAnnounce from './components/DraftAnnounce.vue'
import LinkCard from './components/LinkCard.vue'
import LinkCardGroup from './components/LinkCardGroup.vue'
import Progress from './components/Progress.vue'

import 'element-plus/dist/index.css'
import 'nprogress-v2/dist/index.css'
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

    onMounted(() => {
      initConfetti()
    })
  },
  enhanceApp({ app, router }) {
    app.component('DraftAnnounce', DraftAnnounce)
    app.component('LinkCard', LinkCard)
    app.component('LinkCardGroup', LinkCardGroup)
    app.component('Progress', Progress)
    app.component('Timeline', ElTimeline)
    app.component('TimelineItem', ElTimelineItem)
    app.component('Watermark', ElWatermark)
    router.onBeforeRouteChange = () => {
      NProgress.start()
    }
    router.onAfterRouteChanged = () => {
      busuanzi.fetch()
      NProgress.done()
    }
  }
}

