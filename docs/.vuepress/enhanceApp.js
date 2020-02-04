import sites from './data/sites'
import tools from './data/tools'
import projects from './data/projects'
import books from './data/books'
import profile from './data/profile'

export default ({
    Vue, // VuePress 正在使用的 Vue 构造函数
    options, // 附加到根实例的一些选项
    router, // 当前应用的路由实例
    siteData // 站点元数据
}) => {
    // ...做一些其他的应用级别的优化
    Vue.prototype.$sites = sites
    Vue.prototype.$tools = tools
    Vue.prototype.$projects = projects
    Vue.prototype.$books = books
    Vue.prototype.$profile = profile

    router.beforeEach((to, from, next) => {
        // 对每个页面点击添加百度统计
        if (typeof _hmt != 'undefined') {
            _hmt.push(['_trackPageview', to.fullPath])
        }
        next()
    })
}