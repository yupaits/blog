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
  container-type: inline-size;
}

.card-container .card-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 12px;
  align-items: stretch;
}

.linkcard.block {
  grid-column: 1 / -1;
}

@container (max-width: 560px) {
  .card-container .card-group {
    grid-template-columns: 1fr;
  }
}
</style>