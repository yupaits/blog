import DefaultTheme from 'vitepress/theme'
import vitepressBackToTop from 'vitepress-plugin-back-to-top'
import 'vitepress-plugin-back-to-top/dist/style.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    vitepressBackToTop({
      threshold: 300
    })
  }
}

