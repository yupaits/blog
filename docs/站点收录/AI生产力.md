---
watermark: hidden
---

<script setup>
import {data} from './data/AI生产力.data.js'
</script>

可用于本地环境的大语言模型或AI相关应用。

| 名称                                                                                          | 说明                                                                                                               | Windows | Linux | macOS | Docker |
|-----------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|:-------:|:-----:|:-----:|:------:|
| <LinkButton :link="{href: 'https://ollama.com/', target: '_blank'}" value="Ollama"/>          | 本地环境启动运行大语言模型                                                                                         |    ✔    |   ✔   |   ✔   |   ✔    |
| <LinkButton :link="{href: 'https://chatboxai.app/zh', target: '_blank'}" value="Chatbox"/>    | Chatbox AI是一款AI客户端应用和智能助手，支持众多先进的AI模型和API，可在Windows、MacOS、Android、iOS、Linux和网页版上使用 |    ✔    |   ✔   |   ✔   |        |
| <LinkButton :link="{href: 'https://www.amuse-ai.com/', target: '_blank'}" value="Amuse"/>     | 使用最新的Stable Diffusion模型进行AI图片创作，适用于**Windows PC**，针对**AMD**硬件进行了优化                        |    ✔    |       |       |        |
| <LinkButton :link="{href: 'https://openwebui.com/', target: '_blank'}" value="Open WebUI"/>   | Open WebUI是一个可扩展的、自托管的AI界面，可适应您的工作流程，同时完全离线运行                                        |    ✔    |   ✔   |   ✔   |   ✔    |
| <LinkButton :link="{href: 'https://lobehub.com/', target: '_blank'}" value="Lobe Chat"/>      | 现代化设计的开源ChatGPT/LLMs聊天应用与开发框架，支持语音合成、多模态、可扩展的（function call）插件系统                 |         |       |       |   ✔    |
| <LinkButton :link="{href: 'https://openai.justsong.cn/', target: '_blank'}" value="One API"/> | One API是一个LLM API接口管理和分发系统，可以帮助您更好地管理和使用各大厂商的LLM API                                 |         |       |       |   ✔    |

<LinkCardGroup :data="data" />