<template>
  <div class="home-sections">
    <HomeStats :stats="data.stats"/>
    <HomeCategories :categories="data.categories"/>
    <HomeNow/>
    <HomeFeatured :featured="data.featured"/>
  </div>
</template>

<script setup>
import {data} from '../../../data/home.data.mjs'
import HomeCategories from './HomeCategories.vue'
import HomeFeatured from './HomeFeatured.vue'
import HomeNow from './HomeNow.vue'
import HomeStats from './HomeStats.vue'
import './home.css'
</script>
