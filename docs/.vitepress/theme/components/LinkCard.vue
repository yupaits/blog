<template>
  <div :class="{ 'linkcard-subfield': group.subfield }" class="linkcard no-icon" @click="navigatePage(option?.link)">
    <img :ref="getImgRefName(group?.label, option?.text)" :style="{
      height: option.imgHeight ?? group.imgHeight ?? '48px',
      minWidth: option.imgWidth ?? group.imgWidth ?? '48px',
      maxWidth: option.imgMaxWidth ?? group.imgMaxWidth ?? '64px'
    }"/>
    <p class="description">
      <strong v-if="option?.text" class="title">{{ option?.text }}</strong>
      <br>
      <span v-if="$slots.description" class="subtitle">
        <slot name="description"></slot>
      </span>
      <span v-else class="subtitle" v-html="option.description"/>
    </p>
  </div>
</template>

<script setup>
import {useRouter} from 'vitepress';
import {getCurrentInstance, onMounted} from 'vue';

const {group, option} = defineProps(['group', 'option'])
const router = useRouter()
const defaultIconUrl = '/icon/url.png'

const navigatePage = (link) => {
  if (group.external) {
    window.open(link, '_blank')
  } else {
    router.go(link)
  }
}

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
  cursor: pointer;
  padding: 16px;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  transition: color 0.5s, background-color 0.5s;
}

.linkcard.linkcard-subfield {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

/* 卡片鼠标悬停 */
.linkcard:hover {
  background-color: var(--vp-c-yellow-soft);
}

/* 描述链接文字 */
.linkcard .description {
  flex: 1;
  line-height: 25px;
  color: var(--vp-c-text-1);
  margin: 0;
  transition: color 0.5s;
}

/* 描述链接标题 */
.linkcard .description .title {
  font-size: 15px;
}

/* 描述链接副标题 */
.linkcard .description .subtitle {
  font-size: 14px;
  line-height: 1.65;
}

/* 图片 */
.linkcard img {
  float: left;
  margin-right: 16px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 4px;
}
</style>