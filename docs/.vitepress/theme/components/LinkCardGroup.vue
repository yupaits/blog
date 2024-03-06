<template>
  <div>
    <div v-for="group in data">
      <h3>{{ group.text }}</h3>
      <div class="card-container">
        <div class="card-group">
          <a :href="item.link" target="_blank" v-for="item in group.items" :class="item.type ?? group.type ?? 'info'"
            class="no-icon custom-block">
            <img :ref="getImgRefName(group.text, item.text)" referrer="no-referrer|origin|unsafe-url"
              :style="{ background: item.iconBackground }" class="link-img no-zoom VPImage">
            <p class="title">{{ item.text }}</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance } from 'vue'
const { data } = defineProps(['data'])
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
  const urlObj = new URL(item.link)
  const iconLink = `${urlObj.protocol}//${urlObj.hostname}${urlObj.port ? ':' + urlObj.port : ''}/favicon.ico`
  const isValid = await isValidImageUrl(iconLink)
  return isValid ? iconLink : defaultIconUrl
}

const getImgRefName = (groupCate, siteName) => {
  return `iconImg_${groupCate}_${siteName}`
}

onMounted(() => {
  const instance = getCurrentInstance()
  data.forEach(group => {
    if (Array.isArray(group.items)) {
      group.items.forEach(item => {
        correctIconUrl(item).then(iconUrl => {
          const iconImgEle = instance.refs[getImgRefName(group.text, item.text)][0]
          if (iconImgEle) {
            iconImgEle.src = iconUrl
          }
        })
      })
    }
  })
})
</script>

<style scoped>
.card-container {
  margin: 16px auto;
  max-width: 1152px;
}

.card-container .card-group {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.card-container a {
  text-decoration: none;
}

.card-container a::after {
  content: none;
}

.card-container .card-group .custom-block {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  margin: 0;
  width: calc(100% / 3 - 6px);
  max-width: 300px;
}

.card-container .card-group .title {
  font-size: 14px;
}

.link-img {
  height: 36px;
  width: 36px;
  background: #fff;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 4px
}
</style>