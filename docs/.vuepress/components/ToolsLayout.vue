<template>
  <layout class="layout-bg">
    <div slot="page-top" class="theme-default-content">
      <div>
        <h3>开发工具</h3>
        <div class="tool-container">
          <div v-for="tool in $tools.dev" :key="tool.name" class="card tool-card">
            <div>
              <img :src="tool.logo" :alt="tool.name" height="48">
              <div class="mt-1">{{tool.name}}</div>
            </div>
            <div class="tool-desc">{{tool.description}}</div>
            <div>
              <div class="text-right url-label">
                <a :href="tool.officialSite" target="_blank">官网</a>
              </div>
              <div v-for="download in tool.downloads" class="text-right url-label">
                <a :href="download.url" target="_blank">{{download.label}}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3>生产力工具</h3>
        <div class="tool-container">
          <div v-for="tool in $tools.efficiency" :key="tool.name" class="card tool-card">
            <div>
              <img :src="tool.logo" :alt="tool.name" height="48">
              <div class="mt-1">{{tool.name}}</div>
            </div>
            <div class="tool-desc">{{tool.description}}</div>
            <div>
              <div class="text-right url-label">
                <a :href="tool.officialSite" target="_blank">官网</a>
              </div>
              <div v-for="download in tool.downloads" class="text-right url-label">
                <a :href="download.url" target="_blank">{{download.label}}</a>
              </div>
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
  name: 'ToolsLayout'
}
</script>

<style scoped>
.tool-container {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
}
.tool-card {
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
}
.tool-desc, .url-label {
  margin-top: 8px;
  font-size: 13px;
}
</style>