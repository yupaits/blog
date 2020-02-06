<template>
  <layout class="layout-bg">
    <div slot="page-top" class="theme-default-content">
      <div class="project-container">
        <div v-for="project in $projects" :key="project.name" class="card project-card">
          <div>
            <img :src="project.logo" :alt="project.name" height="48">
          </div>
          <div>
            <div>
              <a :href="project.link">{{project.name}}</a>
              <github-button :href="project.repo" data-icon="octicon-star" data-show-count="true" aria-label="Star yupaits/docs-manage on GitHub" class="pull-right">Star</github-button>
            </div>
            <div class="project-desc">{{project.description}}</div>
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
import GithubButton from 'vue-github-button'
export default {
  name: 'ProjectsLayout',
  components: {
    GithubButton
  }
}
</script>

<style scoped>
.project-container {
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
}
@media screen and (max-width: 719px) {
  .project-container {
    grid-template-columns: 1fr;
  }
}
@media screen and (min-width: 719px) {
  .project-container {
    grid-template-columns: 1fr 1fr;
  }
}
.project-card {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
.project-desc, .url-label {
  font-size: 13px;
}
.project-desc {
  margin-top: 8px;
}
</style>