import {BProgress} from '@bprogress/core'
import {useRouter} from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'
import LinkButton from './components/LinkButton.vue'
import LinkCard from './components/LinkCard.vue'
import LinkCardGroup from './components/LinkCardGroup.vue'
import Progress from './components/Progress.vue'
import BookDetail from './components/BookDetail.vue'
import Timeline from './components/Timeline.vue'
import TimelineItem from './components/TimelineItem.vue'

import '@bprogress/core/css'
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
        app.component('Timeline', Timeline)
        app.component('TimelineItem', TimelineItem)
    }
}