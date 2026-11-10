<script setup>
defineProps({
    // 时间标签，显示在标题上方
    timestamp: {type: String, default: ''},
    // 节点颜色：primary / success / warning / danger / info
    type: {type: String, default: 'info'},
    // 节点尺寸：normal / large
    size: {type: String, default: 'normal'},
    // 空心节点，用页面底色填充
    hollow: {type: Boolean, default: false},
    // 兼容原有写法，当前时间标签始终在内容上方
    placement: {type: String, default: 'top'}
})
</script>

<template>
    <li class="timeline-item" :class="[`is-${type}`, `is-${size}`]">
        <span class="timeline-item__tail" aria-hidden="true"></span>
        <span class="timeline-item__node" :class="{'is-hollow': hollow}" aria-hidden="true"></span>
        <div class="timeline-item__wrapper">
            <div v-if="timestamp" class="timeline-item__timestamp">{{ timestamp }}</div>
            <div class="timeline-item__content">
                <slot/>
            </div>
        </div>
    </li>
</template>
