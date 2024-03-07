<template>
  <div>
    <div v-for="group in data">
      <p class="card-group-title" v-if="group.text">{{ group.text }}</p>
      <div class="card-container">
        <div class="card-group">
          <template v-for="item in group.items">
            <LinkCard :group="linkGroup(group)" :option="item" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LinkCard from './LinkCard.vue'
const { data } = defineProps(['data'])

const linkGroup = (groupItem) => {
  return {
    label: groupItem.text,
    type: groupItem.type,
    imgWidth: groupItem.imgWidth,
    imgHeight: groupItem.imgHeight
  }
}
</script>

<style scoped>
.card-group-title {
  font-size: 16px;
  color: var(--vp-c-brand-1);
}

.card-group-title:before {
  content: '◤';
  color: var(--vp-c-brand-1);
  margin-right: 8px;
}

.card-container {
  margin: 16px auto;
  max-width: 1152px;
}

.card-container .card-group {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

@media screen and (min-width: 768px) {
  .link-card {
    width: calc(100% / 3 - 6px);
  }
}

@media screen and (min-width: 540px) and (max-width: 768px) {
  .link-card {
    width: calc(100% / 2 - 5px);
  }
}

@media screen and (max-width: 540px) {
  .link-card {
    width: 100%;
  }
}
</style>