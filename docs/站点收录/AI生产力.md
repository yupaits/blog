---
watermark: hidden
---

<script setup>
import {data} from './data/AI生产力.data.js'
</script>

可用于本地环境的大语言模型或AI相关应用。

| 名称                                                                                          | 说明                                                                                                                             | Windows | Linux | macOS | Docker |
|-----------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|:-------:|:-----:|:-----:|:------:|
| <LinkButton :link="{href: 'https://openclaw.ai/', target: '_blank'}" value="OpenClaw"/>       | 完全开源免费的私人 AI 助手，通过 WhatsApp、Telegram、微信等聊天应用控制，支持 DeepSeek、豆包等国产 AI 模型，提供详细中文文档和活跃社区 |    ✔    |   ✔   |   ✔   |        |
| <LinkButton :link="{href: 'https://ollama.com/', target: '_blank'}" value="Ollama"/>          | 本地环境启动运行大语言模型                                                                                                       |    ✔    |   ✔   |   ✔   |   ✔    |
| <LinkButton :link="{href: 'https://chatboxai.app/zh', target: '_blank'}" value="Chatbox"/>    | Chatbox AI是一款AI客户端应用和智能助手，支持众多先进的AI模型和API，可在Windows、MacOS、Android、iOS、Linux和网页版上使用               |    ✔    |   ✔   |   ✔   |        |
| <LinkButton :link="{href: 'https://openwebui.com/', target: '_blank'}" value="Open WebUI"/>   | Open WebUI是一个可扩展的、自托管的AI界面，可适应您的工作流程，同时完全离线运行                                                      |    ✔    |   ✔   |   ✔   |   ✔    |
| <LinkButton :link="{href: 'https://lobehub.com/', target: '_blank'}" value="Lobe Chat"/>      | 现代化设计的开源ChatGPT/LLMs聊天应用与开发框架，支持语音合成、多模态、可扩展的（function call）插件系统                               |         |       |       |   ✔    |

<LinkCardGroup :data="data" />