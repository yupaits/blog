import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import vitepressBackToTop from 'vitepress-plugin-back-to-top'
import Valine from 'valine'
import MyLayout from './MyLayout.vue'

import 'vitepress-plugin-back-to-top/dist/style.css'
import './index.css'

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  setup() {
    const route = useRoute()

    // 初始化Valine
    const initValine = () => {
      let path = location.origin + location.pathname
      document.getElementsByClassName("leancloud-visitors")[0].id = path
      new Valine({
        el: '#vcomments',
        appId: '1bm9HBoZJKiYc9SaRKBlDfJy-gzGzoHsz',
        appKey: 'EIF8JdXxwwF5PoT8mgeeHzqH',
        path: path,
        visitor: true,
        lang: 'zh-CN',
        enableQQ: true,
        requiredFields: ['nick', 'mail'],
        placeholder: '在上面填写完昵称和邮箱之后，请在这里写下您的留言\n昵称填写为QQ号时会自动获取QQ头像',
      })
    }

    const remoteImport = (url) => {
      return new Promise((resolve) => {
        var head = document.getElementsByTagName('head')[0]
        var script = document.createElement('script')
        script.setAttribute('type', 'text/javascript')
        script.setAttribute('src', url)
        head.append(script)

        script.onload = () => resolve()
      })
    }

    // 图片缩放
    const initZoom = () => {
      mediumZoom('.main img', { background: 'rgba(0, 0, 0, 0.5)' })
    }

    onMounted(() => {
      initZoom()
      remoteImport('//unpkg.com/valine/dist/Valine.min.js').then(() => initValine())
    })

    watch(
      () => route.path,
      () => {
        initValine()
        nextTick(() => initZoom())
      }
    )
  },
  enhanceApp({ app }) {
    vitepressBackToTop({
      threshold: 300
    })
  }
}

