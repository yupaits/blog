<template>
  <span class="giscus-anchor" hidden/>
</template>

<script setup>
import {useData, useRoute} from 'vitepress'
import giscusTalk from 'vitepress-plugin-comment-with-giscus'

const {frontmatter} = useData()
const route = useRoute()

// 仅在文章页按需加载：本组件由 MyLayout 异步引入
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
}, {frontmatter, route}, true)
</script>
