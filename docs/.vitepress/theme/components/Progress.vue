<template>
  <div :style="{ width: `${width ?? '100%'}` }" class="progress-container">
    <div v-if="label" :style="{ width: `${labelWidth ?? '120px'}` }" class="progress-label">{{ label }}</div>
    <div class="progress-bar">
      <div :style="{ width: `${percent}%` }" class="progress-value"></div>
    </div>
    <div v-if="percent" class="percentage-label">
      <span v-if="percent >= 100">✔</span>
      <span v-else style="font-style: italic;">{{ percent }}%</span>
    </div>
  </div>
</template>

<script setup>
const {label, width, labelWidth, percent} = defineProps(['label', 'width', 'labelWidth', 'percent'])
</script>

<style scoped>
.progress-container {
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 36px;
}

.progress-label {
  text-align: right;
  font-size: 13px;
  color: var(--vp-c-text-1);
}

.percentage-label {
  min-width: 48px;
  text-align: right;
  font-size: 12px;
  color: var(--vp-c-text-1);
}

.progress-bar {
  width: 100%;
  max-width: 100%;
  height: 8px;
  background-color: var(--vp-c-gray-soft);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.progress-value {
  height: 100%;
  background-image: linear-gradient(to right, var(--vp-c-brand-3), var(--vp-c-brand-1));
  border-radius: inherit;
  position: absolute;
}
</style>