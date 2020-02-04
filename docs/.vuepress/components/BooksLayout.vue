<template>
  <layout class="layout-bg">
    <div slot="page-top" class="theme-default-content">
      <div v-for="list in $books" :key="list.category">
        <h3>{{list.category}}</h3>
        <div class="book-container">
          <div v-for="book in list.books" :key="book.name" class="card book-card">
            <div>
              <img :src="book.cover" :alt="book.name" height="80">
            </div>
            <div>
              <a :href="book.link" target="_blank">{{book.name}}</a>
              <Badge :text="book.type" type="error" v-if="book.type"/>
              <div class="book-desc" v-html="book.description"></div>
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
  name: 'BooksLayout'
}
</script>

<style scoped>
.book-container {
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
}
@media screen and (max-width: 719px) {
  .book-container {
    grid-template-columns: 1fr;
  }
}
@media screen and (min-width: 719px) {
  .book-container {
    grid-template-columns: 1fr 1fr;
  }
}
.book-card {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
.book-desc {
  margin-top: 8px;
  font-size: 13px;
}
</style>