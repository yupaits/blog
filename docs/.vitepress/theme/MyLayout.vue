<template>
  <Layout>
    <template #doc-after>
      <ValineComment v-show="page.frontmatter?.comment === undefined || page.frontmatter?.comment" />
    </template>
  </Layout>
</template>

<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ValineComment from './components/ValineComment.vue'
const { Layout } = DefaultTheme
const { page } = useData()
</script>