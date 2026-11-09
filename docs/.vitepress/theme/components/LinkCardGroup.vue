<template>
  <div class="link-card-group">
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
/* 前缀 .link-card-group 用于压过文章页 h2 的全局样式 */
.link-card-group .card-group-title {
  position: relative;
  margin: 32px 0 14px;
  padding: 0 0 0 14px;
  border: 0;
  border-radius: 0;
  background-color: transparent;
  color: var(--vp-c-text-1);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -0.01em;
}

.link-card-group .card-group-title::before {
  content: "";
  position: absolute;
  top: 0.62em;
  left: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: var(--vp-c-brand-1);
}

.link-card-group .card-container {
  width: 100%;
  margin: 0 auto var(--blog-space-5, 20px);
  max-width: 1152px;
  container-type: inline-size;
}

.link-card-group .card-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: var(--blog-space-4, 16px);
  align-items: stretch;
}

.link-card-group .linkcard {
  min-width: 0;
}

.link-card-group .linkcard.block {
  grid-column: 1 / -1;
}

@container (max-width: 560px) {
  .link-card-group .card-group {
    /* minmax(0, 1fr) 防止长内容把单列撑宽，保证所有卡片与正文同宽 */
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
