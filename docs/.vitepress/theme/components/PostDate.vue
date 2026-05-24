<template>
  <span :title="dayjs(date).tz(tz).format(dateFormat)">{{ dayjs(date).fromNow() }}</span>
</template>

<script setup>
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(relativeTime).extend(utc).extend(timezone).locale('zh-cn')

const tz = 'Asia/Shanghai'
const dateFormat = "YYYY/M/D HH:mm"
const { date } = defineProps(['date'])
</script>