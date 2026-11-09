<template>
  <div class="home-sections">
    <HomeStats :stats="data.stats"/>
    <HomeCategories :categories="data.categories"/>
    <HomeFeatured :featured="data.featured"/>
    <div class="home-split">
      <HomeNow/>
      <HomeTimeline :years="data.years"/>
    </div>
  </div>
</template>

<script setup>
import {data} from '../../../data/home.data.mjs'
import HomeCategories from './HomeCategories.vue'
import HomeFeatured from './HomeFeatured.vue'
import HomeNow from './HomeNow.vue'
import HomeStats from './HomeStats.vue'
import HomeTimeline from './HomeTimeline.vue'
import './home.css'
</script>
