<template>
  <a :class="{ 'linkcard-subfield': group.subfield }" class="linkcard no-icon"
     :href="option?.link" :target="group.external ? '_blank' : undefined"
     :rel="group.external ? 'noopener noreferrer' : undefined">
    <img :src="iconUrl" :alt="`${option?.text ?? '链接'} 图标`" width="48" height="48"
         loading="lazy" decoding="async" @error="onIconError" :style="{
      height: option.imgHeight ?? group.imgHeight ?? '48px',
      minWidth: option.imgWidth ?? group.imgWidth ?? '48px',
      maxWidth: option.imgMaxWidth ?? group.imgMaxWidth ?? '64px'
    }"/>
    <p class="description">
      <strong v-if="option?.text" class="title">{{ option?.text }}</strong>
      <br>
      <span v-if="option?.date" class="subtitle">
        <PostDate :date="option.date"/>
      </span>
      <span v-else-if="$slots.description" class="subtitle">
        <slot name="description"></slot>
      </span>
      <span v-else class="subtitle" v-html="option.description"/>
    </p>
  </a>
</template>

<script setup>
import {computed, ref} from 'vue';
import {getSiteIcon} from '../utils/siteIcons.mjs'

const {group, option} = defineProps(['group', 'option'])
const defaultIconUrl = '/icon/url.png'
const fallback = ref(false)

// 服务端直接输出图标地址：不再依赖 mounted 后异步探测或本地 ref 名称
const iconUrl = computed(() => fallback.value
    ? defaultIconUrl
    : option?.icon || getSiteIcon(option?.link))
const onIconError = () => {
    fallback.value = true
}
</script>

<style scoped>
/* 卡片背景 */
.linkcard {
  display: block;
  position: relative;
  cursor: pointer;
  padding: 16px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid transparent;
  border-radius: 8px;
  transition: transform 0.25s ease, border-color 0.25s ease, background-color 0.25s ease;
}

/* 箭头占位：hover 才显现，不产生布局跳动 */
.linkcard::after {
  content: '↗';
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 14px;
  color: var(--vp-c-brand-1);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.linkcard.linkcard-subfield {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

/* 卡片鼠标悬停 */
.linkcard:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-2);
}

.linkcard:hover::after {
  opacity: 1;
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