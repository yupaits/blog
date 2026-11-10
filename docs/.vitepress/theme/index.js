import {BProgress} from '@bprogress/core'
import {ElTimeline, ElTimelineItem} from 'element-plus'
import {useRouter} from 'vitepress'
import DefaultTheme from 'vitepress/theme'
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
import './style/index.css'

export default {
    extends: DefaultTheme,
    Layout: MyLayout,
    setup() {
        const router = useRouter()

        // 页面加载进度条
        router.onBeforePageLoad = () => {
            BProgress.start()
        }
        router.onAfterPageLoad = () => {
            BProgress.done()
        }
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