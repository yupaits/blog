<template>
  <layout class="layout-bg">
    <div slot="page-top" class="theme-default-content">
      <div v-for="siteCate in $sites">
        <h3>{{siteCate.category}}</h3>
        <div class="site-container">
          <div v-for="site in siteCate.sites" :key="site.name" class="card">
            <div>
              <a :href="site.link" target="_blank">{{site.name}}</a>
              <Badge :text="site.tag" type="error" v-if="site.tag"/>
              <img :src="site.versionImage" :alt="site.name" class="ml-1" v-if="site.versionImage">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="page-bottom">
      <div class="text-center">MIT License | © 2017-present yupaits</div>
    </div>
  </layout>
</template>

<script>
export default {
  name: 'SitesLayout'
}
</script>

<style scoped>
.site-container {
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
}
@media screen and (max-width: 719px) {
  .site-container {
    grid-template-columns: 1fr;
  }
}
@media screen and (min-width: 719px) {
  .site-container {
    grid-template-columns: 1fr 1fr;
  }
}
</style>