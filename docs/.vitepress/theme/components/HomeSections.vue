<template>
  <div class="home-sections">
    <HomeStats :stats="data.stats"/>
  </div>
</template>

<script setup>
import {data} from '../../../data/home.data.mjs'
import HomeStats from './HomeStats.vue'
import './home.css'
</script>
