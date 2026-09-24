---
watermark: hidden
---

<script setup>
import {data} from './data/AI生产力.data.js'
</script>

可用于本地环境的大语言模型或AI相关应用。

| 名称                                                                                                         | 说明                                                                                                                                   | Windows | Linux | macOS | Docker |
|--------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|:-------:|:-----:|:-----:|:------:|
| <LinkButton :link="{href: 'https://www.deepseek.com/harness/', target: '_blank'}" value="DeepSeek Harness"/> | 模型、工具、技能、会话、沙箱、存储、循环、调度、UI 等所有 Agent 能力均由插件组合而成，可以自由替换和灵活重组                           |   ✔    |  ✔   |  ✔   |        |

<LinkCardGroup subfield external :data="data" />