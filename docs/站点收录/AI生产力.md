---
watermark: hidden
---

<script setup>
import {data} from './data/AI生产力.data.js'
</script>

可用于本地环境的大语言模型或AI相关应用。

| 名称                                                                                                | 说明                                                                                                                                   | Windows | Linux | macOS | Docker |
|-----------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|:-------:|:-----:|:-----:|:------:|
| <LinkButton :link="{href: 'https://hermes-agent.org/zh/', target: '_blank'}" value="Hermes Agent"/> | 自托管 AI 智能体，记住你的项目、自动创建技能，支持 Telegram、Discord 等多平台。MIT 开源，零追踪，越用越聪明                            |   ✔    |  ✔   |  ✔   |        |
| <LinkButton :link="{href: 'https://openclaw.ai/', target: '_blank'}" value="OpenClaw"/>             | 完全开源免费的私人 AI 助手，通过 WhatsApp、Telegram、微信等聊天应用控制，支持 DeepSeek、豆包等国产 AI 模型，提供详细中文文档和活跃社区 |   ✔    |  ✔   |  ✔   |        |
| <LinkButton :link="{href: 'https://lm-studio.cn/', target: '_blank'}" value="LM Studio"/>           | 使用本地大语言模型，例如gpt-oss，Qwen3.6，Gemma4，DeepSeek以及更多模型，并在您自己的硬件上本地运行                                     |   ✔    |  ✔   |  ✔   |        |
| <LinkButton :link="{href: 'https://localai.io/', target: '_blank'}" value="LocalAI"/>               | 文本、语音、视觉、图像、视频、3D 和智能体，全部集成在一个开放的运行时环境中                                                            |         |  ✔   |  ✔   |   ✔   |
| <LinkButton :link="{href: 'https://docs.openwebui.cn/', target: '_blank'}" value="Open WebUI"/>     | Open WebUI 是 AI 的家园，一个支持自托管的平台，它可扩展、功能丰富、用户友好，并且专为完全离线运行而构建                                |   ✔    |  ✔   |  ✔   |   ✔   |
| <LinkButton :link="{href: 'https://anythingllm.com/', target: '_blank'}" value="AnythingLLM"/>      | 一款完全在您电脑上运行的私人AI助手。无需账户，无需API密钥，无令牌限制                                                                  |   ✔    |  ✔   |  ✔   |   ✔   |
| <LinkButton :link="{href: 'https://www.librechat.ai/zh', target: '_blank'}" value="LibreChat"/>     | LibreChat 将你所有的 AI 对话汇聚到一个统一、可定制的界面中                                                                             |   ✔    |  ✔   |  ✔   |   ✔   |

<LinkCardGroup subfield external :data="data" />