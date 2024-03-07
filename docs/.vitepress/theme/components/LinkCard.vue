<template>
  <a :href="option?.link" target="_blank" :class="option?.type ?? group?.type ?? 'info'"
    class="link-card no-icon custom-block" :title="option?.description">
    <img :ref="getImgRefName(group?.label, option?.text)" referrer="no-referrer|origin|unsafe-url"
      :style="{ background: option?.iconBackground, height: option.imgHeight ?? group.imgHeight ?? '48px', width: option.imgWidth ?? group.imgWidth ?? '48px' }"
      class="link-img no-zoom VPImage">
    <div>
      <div class="link-card-title">{{ option?.text }}</div>
      <div class="link-card-description">{{ option?.description }}</div>
    </div>
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
.link-card {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  margin: 0;
}

a.link-card {
  text-decoration: none;
}

a::after.link-card {
  content: none;
}

.link-img {
  background: #fff;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 4px
}

.link-card-title {
  color: var(--vp-c-text-1);
}

.link-card-description {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>