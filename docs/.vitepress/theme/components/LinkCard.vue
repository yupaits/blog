<template>
  <a :class="{ 'linkcard-subfield': group.subfield }"
     class="linkcard no-icon" draggable="false"
     :href="option?.link" :target="group.external ? '_blank' : undefined"
     :rel="group.external ? 'noopener noreferrer' : undefined"
     @pointerdown="onCardPointerDown" @click="onCardClick">
    <img :src="iconUrl" :alt="`${option?.text ?? '链接'} 图标`" width="48" height="48"
         loading="lazy" decoding="async" @error="onIconError" :style="imageStyle"/>
    <p class="description">
      <span v-if="option?.text" class="title-row">
        <strong class="title">{{ option?.text }}</strong>
        <svg v-if="group.external" class="external-mark" viewBox="0 0 16 16" width="14" height="14"
             aria-hidden="true" focusable="false">
          <path d="M9 2h5v5M14 2 7.5 8.5" fill="none" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M11.5 8.5V13a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1H6" fill="none"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <br>
      <span v-if="$slots.description" class="subtitle has-tooltip" tabindex="0"
            @mouseenter="showTip" @mouseleave="scheduleHide"
            @pointermove="onPointerMove"
            @focus="showCardTip" @blur="hideTip"
            @click.prevent.stop="togglePointerTip"
            @keydown.enter.prevent.stop="toggleCardTip"
            @keydown.space.prevent.stop="toggleCardTip">
        <slot name="description"></slot>
      </span>
      <span v-else class="subtitle">{{ option.description }}</span>
    </p>
    <span v-if="group.external" class="sr-only">（外部链接，将在新窗口打开）</span>
    <Teleport to="body">
      <div v-if="tipVisible && fullIntro" ref="tipEl" class="linkcard-tooltip"
           :class="{ 'is-follow': mode === 'pointer' }" role="tooltip" :style="tipStyle"
           @mouseenter="cancelHide" @mouseleave="scheduleHide">
        {{ fullIntro }}
      </div>
    </Teleport>
  </a>
</template>

<script setup>
import {computed, nextTick, onBeforeUnmount, ref} from 'vue';
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

// 大图（书籍封面）按真实比例缩放；小图标保持固定尺寸
const isCover = computed(() => {
  const height = parseFloat(option?.imgHeight ?? group.imgHeight)
  return Number.isFinite(height) && height > 64
})

const imageStyle = computed(() => {
  const height = option?.imgHeight ?? group.imgHeight
  const width = option?.imgWidth ?? group.imgWidth
  if (isCover.value) {
    // 固定封面框，object-fit: contain 等比缩放不裁切；不同简介长度/图片加载状态都不影响卡片高度
    return {
      height: height ?? '145px',
      width: width ?? '100px',
      objectFit: 'contain'
    }
  }
  return {
    height: height ?? '48px',
    minWidth: width ?? '48px',
    maxWidth: option?.imgMaxWidth ?? group.imgMaxWidth ?? '64px'
  }
})

// 完整简介：书籍卡片通过 description props 传入
const fullIntro = computed(() => {
  const description = option?.description
  return description && typeof description === 'object' ? description.props?.intro ?? '' : ''
})

// 文本拖选复制时不跳转：按下前已有选区，或本次拖拽产生了选区，都拦掉导航
let hadSelection = false

const hasTextSelection = () => {
  const selection = window.getSelection()
  return !!selection && selection.rangeCount > 0 && !selection.isCollapsed
      && String(selection).trim().length > 0
}

const onCardPointerDown = () => {
  hadSelection = hasTextSelection()
}

const onCardClick = (event) => {
  // 键盘 Enter 触发的 click detail 为 0，保持正常跳转
  if (event.detail === 0) return
  if (hadSelection || hasTextSelection()) {
    event.preventDefault()
    event.stopPropagation()
  }
  hadSelection = false
}

const TIP_WIDTH = 360
const TIP_GAP = 14
const TIP_EDGE = 8

const tipEl = ref(null)
const tipVisible = ref(false)
const tipStyle = ref({left: '-9999px', top: '0px'})

let hideTimer = null
let rafId = 0
let listening = false
let tipHeight = 0
let pointerX = 0
let pointerY = 0
let cardRect = null
let anchorEl = null
const mode = ref('pointer') // pointer：跟随鼠标 / card：键盘 focus、移动端点按时锚定卡片
let hSide = ''       // 当前横向展开方向，用于避免边缘反复翻转
let vSide = ''       // 当前纵向展开方向

const tipWidth = () => Math.min(TIP_WIDTH, window.innerWidth - TIP_EDGE * 2)
const clamp = (value, min, max) => Math.min(Math.max(value, min), Math.max(min, max))

const cancelHide = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const unbind = () => {
  if (!listening) return
  window.removeEventListener('scroll', onViewportChange)
  window.removeEventListener('resize', onViewportChange)
  listening = false
}

const hideTip = () => {
  cancelHide()
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
  tipVisible.value = false
  unbind()
}

const scheduleHide = () => {
  cancelHide()
  hideTimer = setTimeout(hideTip, 140)
}

const bind = () => {
  if (listening) return
  window.addEventListener('scroll', onViewportChange, {passive: true})
  window.addEventListener('resize', onViewportChange)
  listening = true
}

// 卡片锚定模式下滚动/改窗口时跟着卡片走；跟随鼠标模式下指针位置已失效，直接收起
const onViewportChange = () => {
  if (mode.value === 'card' && anchorEl) {
    cardRect = anchorEl.getBoundingClientRect()
    if (tipVisible.value) applyStyle()
  } else {
    hideTip()
  }
}

// 横向：默认在指针右侧，右侧不足且左侧放得下时翻到左侧
const pointerLeft = () => {
  const width = tipWidth()
  const right = pointerX + TIP_GAP
  const left = pointerX - TIP_GAP - width
  const fitsRight = right + width <= window.innerWidth - TIP_EDGE
  const fitsLeft = left >= TIP_EDGE
  if (hSide === 'right' && !fitsRight && fitsLeft) hSide = 'left'
  else if (hSide === 'left' && !fitsLeft && fitsRight) hSide = 'right'
  else if (!hSide) hSide = fitsRight || !fitsLeft ? 'right' : 'left'
  return clamp(hSide === 'right' ? right : left, TIP_EDGE, window.innerWidth - TIP_EDGE - width)
}

// 纵向：默认在指针下方，下方不足且上方放得下时翻到上方
const pointerTop = () => {
  const height = tipHeight || 180
  const bottom = pointerY + TIP_GAP
  const top = pointerY - TIP_GAP - height
  const fitsBottom = bottom + height <= window.innerHeight - TIP_EDGE
  const fitsTop = top >= TIP_EDGE
  if (vSide === 'bottom' && !fitsBottom && fitsTop) vSide = 'top'
  else if (vSide === 'top' && !fitsTop && fitsBottom) vSide = 'bottom'
  else if (!vSide) vSide = fitsBottom || !fitsTop ? 'bottom' : 'top'
  return clamp(vSide === 'bottom' ? bottom : top, TIP_EDGE, window.innerHeight - TIP_EDGE - height)
}

// 键盘 focus：贴着卡片下沿或上沿展开，不跟随鼠标
const cardLeft = () => clamp(cardRect.left, TIP_EDGE, window.innerWidth - TIP_EDGE - tipWidth())

const cardTop = () => {
  const height = tipHeight || 180
  const bottom = cardRect.bottom + TIP_GAP
  const top = cardRect.top - TIP_GAP - height
  const below = window.innerHeight - TIP_EDGE - bottom
  const above = cardRect.top - TIP_GAP - TIP_EDGE
  const y = below >= height ? bottom : above >= height ? top : above > below ? top : bottom
  return clamp(y, TIP_EDGE, window.innerHeight - TIP_EDGE - height)
}

const applyStyle = () => {
  if (!tipVisible.value) return
  if (tipEl.value) tipHeight = tipEl.value.offsetHeight
  const useCard = mode.value === 'card' && cardRect
  tipStyle.value = {
    left: `${useCard ? cardLeft() : pointerLeft()}px`,
    top: `${useCard ? cardTop() : pointerTop()}px`,
    width: `${tipWidth()}px`
  }
}

const scheduleUpdate = () => {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    applyStyle()
  })
}

// 先渲染到视口外量出真实高度，再定位，避免首次出现在错误位置
const open = async (nextMode, event) => {
  cancelHide()
  mode.value = nextMode
  hSide = ''
  vSide = ''
  tipHeight = 0
  const hasPoint = typeof event?.clientX === 'number' && (event.clientX !== 0 || event.clientY !== 0)
  if (mode.value === 'pointer' && !hasPoint) mode.value = 'card'
  if (mode.value === 'pointer') {
    pointerX = event.clientX
    pointerY = event.clientY
    anchorEl = null
  } else {
    const host = event?.currentTarget?.closest?.('.linkcard') ?? event?.currentTarget
    anchorEl = host ?? null
    cardRect = host?.getBoundingClientRect?.() ?? null
  }
  tipStyle.value = {left: '-9999px', top: '0px', width: `${tipWidth()}px`}
  tipVisible.value = true
  await nextTick()
  applyStyle()
  bind()
}

const showTip = (event) => {
  if (!fullIntro.value) return
  cancelHide()
  if (tipVisible.value) {
    if (mode.value === 'pointer' && typeof event?.clientX === 'number') {
      pointerX = event.clientX
      pointerY = event.clientY
      scheduleUpdate()
    }
    return
  }
  open('pointer', event)
}

// 只有键盘触发的 focus 才改为卡片锚定，鼠标点击造成的 focus 不抢位置
const showCardTip = (event) => {
  if (!fullIntro.value) return
  if (!event?.target?.matches?.(':focus-visible')) return
  cancelHide()
  open('card', event)
}

const onPointerMove = (event) => {
  if (event.pointerType === 'touch') return
  // 元素在静止的指针下被滚动出来时不会触发 mouseenter，pointermove 兜底打开
  if (!tipVisible.value) {
    open('pointer', event)
    return
  }
  if (mode.value !== 'pointer') return
  pointerX = event.clientX
  pointerY = event.clientY
  scheduleUpdate()
}

const togglePointerTip = (event) => {
  // 拖选文字后不要顺带弹出浮层，也不要跳转
  if (hasTextSelection()) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  if (tipVisible.value) {
    hideTip()
    return
  }
  // 触屏没有 hover，点按时锚定卡片，浮层可滚动且不挡点击
  const touch = event?.pointerType === 'touch' || !window.matchMedia('(hover: hover)').matches
  open(touch ? 'card' : 'pointer', event)
}

const toggleCardTip = (event) => {
  if (tipVisible.value) hideTip()
  else open('card', event)
}

onBeforeUnmount(hideTip)
</script>

<style scoped>
/* 卡片外壳：与首页卡片共用圆角、描边与阴影 token */
.linkcard {
  display: flex;
  align-items: flex-start;
  gap: var(--blog-space-3, 12px);
  position: relative;
  cursor: pointer;
  user-select: text;
  padding: var(--blog-space-4, 16px);
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--blog-radius-card, 12px);
  box-shadow: var(--blog-shadow-card, none);
  transition:
    transform var(--blog-duration, 250ms) var(--blog-ease, ease),
    border-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    background-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    box-shadow var(--blog-duration-fast, 150ms) var(--blog-ease, ease);
}

.linkcard:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--vp-c-brand-2) 55%, var(--vp-c-divider));
  background-color: var(--vp-c-bg-elv);
  box-shadow: 0 12px 28px -20px color-mix(in srgb, var(--vp-c-brand-1) 45%, transparent);
}

/* 正文 a:hover 会命中卡片外壳并给内部文字补下划线，这里用更高特异性只取消卡片的下划线，
   描边、阴影、位移等 hover 反馈保持不变 */
.linkcard.linkcard:hover {
  text-decoration: none;
}

.linkcard:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

/* 外链标识：放在标题行尾，仅 hover / focus 时淡入，不压住标题或封面 */
.linkcard .description .title-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.linkcard .external-mark {
  flex: 0 0 auto;
  align-self: center;
  width: 14px;
  height: 14px;
  color: var(--vp-c-text-3);
  opacity: 0;
  transform: translateX(-2px);
  transition:
    opacity var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    transform var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    color var(--blog-duration-fast, 150ms) var(--blog-ease, ease);
}

.linkcard:hover .external-mark,
.linkcard:focus-visible .external-mark,
.linkcard:focus-within .external-mark {
  opacity: 1;
  transform: none;
  color: var(--vp-c-text-2);
}

/* 视觉隐藏，仅供读屏知道这是外部跳转 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 文案区：标题单行截断，描述最多两行 */
.linkcard .description {
  flex: 1;
  min-width: 0;
  margin: 0;
  color: var(--vp-c-text-1);
}

.linkcard .description br {
  display: none;
}

.linkcard .description .title {
  display: block;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.linkcard .description .subtitle {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-top: 4px;
  color: var(--vp-c-text-3);
  font-size: 13px;
  line-height: 1.65;
}

/* 图标：等比缩放，不裁切图形 */
.linkcard img {
  flex: 0 0 auto;
  margin: 0;
  max-height: 64px;
  object-fit: contain;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--blog-radius, 8px);
  padding: 4px;
}

/* 兼容原有 subfield 用法 */
.linkcard.linkcard-subfield {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

/* 书籍封面等大图：容器跟随图片比例，去掉内衬，避免图下空白 */
.linkcard.block img {
  max-height: none;
  padding: 0;
  background-color: transparent;
}

.linkcard.block .description .subtitle {
  -webkit-line-clamp: 5;
  /* 固定 5 行高度，简介长短不一时卡片高度仍一致 */
  min-height: calc(5 * 1.65em);
  cursor: help;
}

.linkcard.block .description .subtitle:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

/* 完整简介浮层：Teleport 到 body，固定定位并按视口收口 */
.linkcard-tooltip {
  position: fixed;
  z-index: 100;
  max-height: 45vh;
  overflow: auto;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--blog-radius, 8px);
  background-color: var(--vp-c-bg-elv);
  box-shadow: var(--blog-shadow-card, 0 8px 24px rgba(0, 0, 0, 0.12));
  color: var(--vp-c-text-2);
  font-size: 12.5px;
  line-height: 1.7;
  text-align: left;
  white-space: normal;
  overscroll-behavior: contain;
}

/* 跟随鼠标时不吃指针事件，避免浮层截住指针让跟随中断 */
.linkcard-tooltip.is-follow {
  pointer-events: none;
}
</style>
