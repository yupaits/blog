---
watermark: hidden
---

<script setup>
import {data} from './data/AI生产力.data.js'
</script>

可用于本地环境的大语言模型或AI相关应用。

| 名称                                                                                                         | 说明                                                                                                                                   | Windows | Linux | macOS | Docker |
|--------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|:-------:|:-----:|:-----:|:------:|
| <LinkButton :link="{href: 'https://hermes-agent.org/zh/', target: '_blank'}" value="Hermes Agent"/>          | 自托管 AI 智能体，记住你的项目、自动创建技能，支持 Telegram、Discord 等多平台。MIT 开源，零追踪，越用越聪明                            |   ✔    |  ✔   |  ✔   |        |
| <LinkButton :link="{href: 'https://openclaw.ai/', target: '_blank'}" value="OpenClaw"/>                      | 完全开源免费的私人 AI 助手，通过 WhatsApp、Telegram、微信等聊天应用控制，支持 DeepSeek、豆包等国产 AI 模型，提供详细中文文档和活跃社区 |   ✔    |  ✔   |  ✔   |        |
| <LinkButton :link="{href: 'https://www.deepseek.com/harness/', target: '_blank'}" value="DeepSeek Harness"/> | 模型、工具、技能、会话、沙箱、存储、循环、调度、UI 等所有 Agent 能力均由插件组合而成，可以自由替换和灵活重组                           |   ✔    |  ✔   |  ✔   |        |

<LinkCardGroup subfield external :data="data" />