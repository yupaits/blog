<template>
  <div class="home-sections">
    <HomeStats :stats="data.stats"/>
    <HomeFeatured :featured="data.featured"/>
    <HomeTimeline :years="data.years"/>
  </div>
</template>

<script setup>
import {data} from '../../../data/home.data.mjs'
import HomeFeatured from './HomeFeatured.vue'
import HomeStats from './HomeStats.vue'
import HomeTimeline from './HomeTimeline.vue'
import './home.css'
</script>
