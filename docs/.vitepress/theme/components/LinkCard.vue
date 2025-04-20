<template>
  <a class="linkcard no-icon" :href="option?.link" target="_blank">
    <img :ref="getImgRefName(group?.label, option?.text)"
      :style="{ height: option.imgHeight ?? group.imgHeight ?? '48px', minWidth: option.imgWidth ?? group.imgWidth ?? '48px' }" />
    <p class="description"><span class="title" v-if="option?.text">{{ option?.text }}<br></span><span class="subtitle" v-html="option?.description" v-if="option?.description"></span></p>
  </a>
</template>

<script setup>
import { onMounted, getCurrentInstance } from 'vue'
const { group, option } = defineProps(['group', 'option'])
const defaultIconUrl = '/icon/url.png'

const isValidImageUrl = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onerror = () => resolve(false)
    img.onload = () => resolve(true)
    img.src = url
  })
}

const correctIconUrl = async (item) => {
  if (item?.icon) {
    return item.icon
  }
  if (!item?.link) {
    return defaultIconUrl
  }
  const urlObj = new URL(item?.link)
  const iconLink = `${urlObj.protocol}//${urlObj.hostname}${urlObj.port ? ':' + urlObj.port : ''}/favicon.ico`
  const isValid = await isValidImageUrl(iconLink)
  return isValid ? iconLink : defaultIconUrl
}

const getImgRefName = (groupLabel, optionText) => {
  return `iconImg_${groupLabel}_${optionText}`
}

onMounted(() => {
  const instance = getCurrentInstance()
  correctIconUrl(option).then(iconUrl => {
    const iconImgEle = instance.refs[getImgRefName(group?.label, option?.text)]
    if (iconImgEle) {
      iconImgEle.src = iconUrl
    }
  })
})
</script>

<style scoped>
/* 卡片背景 */
.linkcard {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  transition: color 0.5s, background-color 0.5s;
  text-decoration: none;
}

/* 卡片鼠标悬停 */
.linkcard:hover {
  background-color: var(--vp-c-yellow-soft);
}

a::after.linkcard {
  content: none;
}

/* 描述链接文字 */
.linkcard .description {
  flex: 1;
  line-height: 25px;
  color: var(--vp-c-text-1);
  margin: 0 0 0 16px;
  transition: color 0.5s;
}

/* 描述链接标题 */
.linkcard .description .title {
  font-size: 15px;
  font-weight: bold;
}

/* 描述链接副标题 */
.linkcard .description .subtitle {
  font-size: 14px;
}

/* 图片 */
.linkcard img {
  object-fit: contain;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 4px;
}

.vp-doc a:not(.link-card) {
  padding: 16px;
}
</style>