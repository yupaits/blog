<template>
  <div class="home-sections">
    <HomeStats :stats="data.stats"/>
    <HomeCategories :categories="data.categories"/>
  </div>
</template>

<script setup>
import {data} from '../../../data/home.data.mjs'
import HomeCategories from './HomeCategories.vue'
import HomeStats from './HomeStats.vue'
import './home.css'
</script>
