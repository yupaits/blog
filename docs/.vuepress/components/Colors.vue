<template>
  <div>
    <div class="mt-1 mb-1">
      官网：<a :href="colorOption.officialSite" target="_blank">{{colorOption.colorSystem}}</a>
    </div>
    <div class="colors-container">
      <div v-for="mainColor in colorOption.colors" :key="mainColor.label">
        <h4>{{mainColor.label}}</h4>
        <p>{{mainColor.emotion}}</p>
        <div v-for="(color, index) in mainColor.subColors" :key="color.label" 
          :style="{backgroundColor: color.color, color: fontColor(mainColor, index)}" class="color-item">
          <span>{{color.label}}</span>
          <span class="pull-right">{{color.color}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Colors',
  props: {
    colorOption: {
      type: Object,
      required: true
    }
  },
  methods: {
    fontColor(mainColor, index) {
      if (mainColor.darkIndex && Array.isArray(mainColor.darkIndex)) {
        return mainColor.darkIndex.includes(index) ? '#000' : '#fff';
      } else if (mainColor.lightIndex && Array.isArray(mainColor.lightIndex)) {
        return mainColor.lightIndex.includes(index) ? '#fff' : '#000';
      }
    }
  }
}
</script>

<style scoped>
.colors-container {
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 3rem 2rem;
}
@media screen and (max-width: 719px) {
  .colors-container {
    grid-template-columns: 1fr 1fr;
  }
}
@media screen and (min-width: 719px) {
  .colors-container {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
.color-item {
  padding: 8px 16px;
}
</style>