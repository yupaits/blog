<template>
  <div>
    <div v-for="group in data">
      <h2 v-if="group.text" :id="group.text" class="card-group-title">{{ group.text }}</h2>
      <div class="card-container">
        <div class="card-group">
          <template v-for="item in group.items">
            <LinkCard :class="{ 'block': isBlock() }" :group="linkGroup(group)" :option="item">
              <template v-if="item?.description?.name" v-slot:description>
                <component :is="item?.description?.name" v-bind="item.description?.props"/>
              </template>
            </LinkCard>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LinkCard from './LinkCard.vue';

const {
  data,
  block,
  imgHeight,
  imgWidth,
  imgMaxWidth,
  subfield,
  external
} = defineProps(['data', 'block', 'imgHeight', 'imgWidth', 'imgMaxWidth', 'subfield', 'external'])

const isBlock = () => block === '' || (typeof block === 'boolean' && block)
const isSubfield = () => subfield === '' || (typeof subfield === 'boolean' && subfield)
const isExternal = () => external === '' || (typeof external === 'boolean' && external)

const linkGroup = (groupItem) => {
  return {
    label: groupItem.text,
    type: groupItem.type,
    imgWidth: groupItem.imgWidth ?? imgWidth,
    imgHeight: groupItem.imgHeight ?? imgHeight,
    imgMaxWidth: groupItem.imgMaxWidth ?? imgMaxWidth,
    subfield: isSubfield(),
    external: isExternal()
  }
}
</script>

<style scoped>
.card-group-title {
  margin: 0px;
  font-size: 16px;
  color: var(--vp-c-brand-1);
  border-top: 0px;
  border-left: 4px solid var(--vp-c-brand-1);
  border-radius: 6px;
  padding-left: 8px;
  padding-top: 0px;
  line-height: 40px;
  background-color: var(--vp-c-bg-elv);
}

.card-container {
  margin: 16px auto;
  max-width: 1152px;
}

.card-container .card-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.linkcard.block {
  width: 100%;
}

@media screen and (min-width: 768px) {
  .linkcard:not(.block) {
    width: calc(100% / 3 - 8px);
  }
}

@media screen and (min-width: 540px) and (max-width: 768px) {
  .linkcard:not(.block) {
    width: calc(100% / 2 - 6px);
  }
}

@media screen and (max-width: 540px) {
  .linkcard:not(.block) {
    width: 100%;
  }
}
</style>