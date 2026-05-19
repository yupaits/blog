---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
watermark: hidden

hero:
  name: "yupaits notes"
  text: "Just do & record"
  tagline: 但行心所向，回首自清风
  image: /home/hero.webp
  actions:
    - theme: brand
      text: 技术博客
      link: /技术博客/
    - theme: alt
      text: 软件开发
      link: /软件开发/
    - theme: alt
      text: 生活记录
      link: /生活记录/

features:
  - icon:
      src: /home/idea.png
    title: IDEA - 灵感
    details: 一念星河，点亮未知
  - icon: 
      src: /home/action.png
    title: ACTION - 行动
    details: 步履所至，山海可平
  - icon: 
      src: /home/accumulation.png
    title: ACCUMULATION - 积累
    details: 滴水穿石，时光成诗
---

<script setup>
import {useData} from 'vitepress'
const {theme} = useData()
</script>

<LinkCardGroup style="margin-top: 4rem" :data="[{
  text: '近期更新',
  items: (theme?.posts ?? []).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 12)
}]"/>
