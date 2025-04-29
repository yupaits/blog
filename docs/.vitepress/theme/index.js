import { BProgress } from '@bprogress/core'
import confetti from 'canvas-confetti'
import { ElTimeline, ElTimelineItem } from 'element-plus'
import { useData, useRoute, useRouter } from 'vitepress'
import giscusTalk from 'vitepress-plugin-comment-with-giscus'
import DefaultTheme from 'vitepress/theme'
import { onMounted, watch } from 'vue'
import MyLayout from './MyLayout.vue'
import LinkButton from './components/LinkButton.vue'
import LinkCard from './components/LinkCard.vue'
import LinkCardGroup from './components/LinkCardGroup.vue'
import Progress from './components/Progress.vue'

import '@bprogress/core/css'
import 'element-plus/dist/index.css'
import './style/var.css'

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  setup() {
    const { frontmatter } = useData()
    const route = useRoute()
    const router = useRouter()

    // 页面加载进度条
    router.onBeforePageLoad = () => {
      BProgress.start()
    }
    router.onAfterPageLoad = () => {
      BProgress.done()
    }

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

    // 五彩纸屑动画
    const initConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 170,
        origin: { y: 0.6 }
      })
    }

    // 访客统计
    const useVisitor = () => {
      const script = document.createElement('script')
      script.defer = true
      script.async = true
      script.src = 'https://events.vercount.one/js'
      document.head.appendChild(script)
    }

    onMounted(() => {
      initConfetti()
      useVisitor()
    })

    watch(
      () => route.path,
      () => {
        useVisitor()
      }
    )
  },
  enhanceApp({ app }) {
    app.component('LinkButton', LinkButton)
    app.component('LinkCard', LinkCard)
    app.component('LinkCardGroup', LinkCardGroup)
    app.component('Progress', Progress)
    app.component('Timeline', ElTimeline)
    app.component('TimelineItem', ElTimelineItem)
  }
}

