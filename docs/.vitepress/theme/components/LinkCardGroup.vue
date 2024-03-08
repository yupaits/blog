<template>
  <div>
    <div v-for="group in data">
      <p class="card-group-title" v-if="group.text">{{ group.text }}</p>
      <div class="card-container">
        <div class="card-group">
          <template v-for="item in group.items">
            <LinkCard :group="linkGroup(group)" :option="item" :class="{ 'block': isBlock() }" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LinkCard from './LinkCard.vue'
const { data, block, imgHeight, imgWidth } = defineProps(['data', 'block', 'imgHeight', 'imgWidth'])

const isBlock = () => {
  return block === '' || (typeof block === 'boolean' && block)
}

const linkGroup = (groupItem) => {
  return {
    label: groupItem.text,
    type: groupItem.type,
    imgWidth: groupItem.imgWidth ?? imgWidth,
    imgHeight: groupItem.imgHeight ?? imgHeight
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

.link-card.block {
  width: 100%;
}

@media screen and (min-width: 768px) {
  .link-card:not(.block) {
    width: calc(100% / 3 - 6px);
  }
}

@media screen and (min-width: 540px) and (max-width: 768px) {
  .link-card:not(.block) {
    width: calc(100% / 2 - 5px);
  }
}

@media screen and (max-width: 540px) {
  .link-card:not(.block) {
    width: 100%;
  }
}
</style>