<template>
  <div class="home-sections">
    <HomeStats :stats="data.stats" :categories="data.categories" :active-category="activeCategory"
               @filter="filterFromStats"/>
    <HomeFeatured :featured="data.featured"/>
    <HomeTimeline :years="data.years" :categories="data.categories" :active-category="activeCategory"
                  @clear="activeCategory = ''"/>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {data} from '../../../data/home.data.mjs'
import HomeFeatured from './HomeFeatured.vue'
import HomeStats from './HomeStats.vue'
import HomeTimeline from './HomeTimeline.vue'

const activeCategory = ref('')

// 概览里的栏目与时间轴联动：再次点击同一栏目即取消筛选
const filterFromStats = (name) => {
    activeCategory.value = activeCategory.value === name ? '' : name
    const target = document.getElementById('home-timeline')
    if (!target) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block: 'start'})
}
</script>
