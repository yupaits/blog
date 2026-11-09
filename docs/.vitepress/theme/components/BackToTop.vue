<template>
  <Transition name="back-top">
    <div v-show="showBackTop" class="back-top">
      <svg class="progress-ring" viewBox="0 0 56 56" shape-rendering="geometricPrecision" aria-hidden="true">
        <circle class="progress-ring-track" cx="28" cy="28" r="26"/>
        <circle class="progress-ring-circle" cx="28" cy="28" r="26"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="circumference * (1 - scrollProgress)"/>
      </svg>
      <button type="button" class="back-top-button" aria-label="返回顶部" @click="scrollToTop()">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'

const showBackTop = ref(false)
const scrollProgress = ref(0)
const radius = 26
const circumference = computed(() => 2 * Math.PI * radius)
const SHOW_AFTER = 200
let frame = 0

function scrollToTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({top: 0, behavior: reduce ? 'auto' : 'smooth'})
}

const updateScrollProgress = () => {
  const totalScroll = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = totalScroll > 0 ? Math.min(window.scrollY / totalScroll, 1) : 0
  showBackTop.value = window.scrollY > SHOW_AFTER
}

// passive 监听 + rAF 合并，避免滚动时反复触发布局计算
const onScroll = () => {
  if (frame) return
  frame = requestAnimationFrame(() => {
    updateScrollProgress()
    frame = 0
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, {passive: true})
  updateScrollProgress()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  if (frame) cancelAnimationFrame(frame)
})
</script>

<style scoped>
.back-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 30;
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
}

/* 进度环：viewBox 与显示尺寸 1:1，圆心/半径/stroke 均为整数，边缘不产生半像素毛刺 */
.progress-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  pointer-events: none;
  shape-rendering: geometricPrecision;
}

.progress-ring-track {
  fill: none;
  stroke: var(--vp-c-divider);
  stroke-width: 2;
}

.progress-ring-circle {
  fill: none;
  stroke: var(--vp-c-brand-1);
  stroke-width: 2;
  stroke-linecap: round;
  transition: stroke-dashoffset var(--blog-duration-fast, 150ms) linear;
}

.back-top-button {
  position: relative;
  cursor: pointer;
  width: 42px;
  height: 42px;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  background-color: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
  box-shadow: var(--blog-shadow-card, 0 6px 20px -12px rgba(0, 0, 0, 0.28));
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    color var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    background-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    border-color var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    box-shadow var(--blog-duration-fast, 150ms) var(--blog-ease, ease),
    transform var(--blog-duration-fast, 150ms) var(--blog-ease, ease);
}

.back-top-button:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-2);
  background-color: var(--vp-c-brand-soft);
  transform: translateY(-1px);
}

.back-top-button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.icon {
  width: 18px;
  height: 18px;
}

/* 出现/隐藏过渡 */
.back-top-enter-active,
.back-top-leave-active {
  transition:
    opacity var(--blog-duration, 250ms) var(--blog-ease, ease),
    transform var(--blog-duration, 250ms) var(--blog-ease, ease);
}

.back-top-enter-from,
.back-top-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.92);
}

@media (max-width: 640px) {
  .back-top {
    right: 16px;
    bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    width: 52px;
    height: 52px;
  }

  .back-top-button {
    width: 40px;
    height: 40px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-top-enter-active,
  .back-top-leave-active,
  .progress-ring-circle,
  .back-top-button {
    transition: none;
  }
}
</style>
