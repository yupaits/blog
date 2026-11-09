<template>
  <div ref="mount" class="giscus-comment"/>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useData, useRoute} from 'vitepress'

const {isDark} = useData()
const route = useRoute()
const mount = ref(null)

const SCRIPT_SRC = 'https://giscus.app/client.js'
const themeFor = (dark) => (dark ? 'transparent_dark' : 'light')

// giscus 自带脚本会读取当前 pathname 作为 discussion term，
// 每次路由变化重建一次，保证切页后评论与当前文章一致
const load = () => {
    const el = mount.value
    if (!el) return
    el.innerHTML = ''
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.crossOrigin = 'anonymous'
    const attrs = {
        'data-repo': 'yupaits/giscus',
        'data-repo-id': 'R_kgDOOciJmA',
        'data-category': 'General',
        'data-category-id': 'DIC_kwDOOciJmM4CpRt2',
        'data-mapping': 'pathname',
        'data-strict': '1',
        'data-reactions-enabled': '1',
        'data-emit-metadata': '0',
        'data-input-position': 'bottom',
        'data-theme': themeFor(isDark.value),
        'data-lang': 'zh-CN',
        'data-loading': 'lazy'
    }
    Object.entries(attrs).forEach(([key, value]) => script.setAttribute(key, value))
    el.appendChild(script)
}

onMounted(load)

watch(() => route.path, load)

// 主题切换不重新加载 iframe，直接让 giscus 换配色
watch(isDark, (dark) => {
    mount.value
        ?.querySelector('iframe.giscus-frame')
        ?.contentWindow?.postMessage(
            {giscus: {setConfig: {theme: themeFor(dark)}}},
            'https://giscus.app'
        )
})

onBeforeUnmount(() => {
    if (mount.value) mount.value.innerHTML = ''
})
</script>

<style scoped>
.giscus-comment {
  margin-top: 40px;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 20px;
}
</style>
