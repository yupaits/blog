export default {
  load() {
    return [
      {
        text: 'AI助手',
        items: [
          { text: 'DeepSeek', link: 'https://chat.deepseek.com/', icon: 'https://chat.deepseek.com/favicon.svg' },
          { text: '豆包（字节跳动）', link: 'https://www.doubao.com/chat/', icon: 'https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/doubao/web/logo-icon.png' },
          { text: '通义（阿里巴巴）', link: 'https://www.tongyi.com/', icon: 'https://img.alicdn.com/imgextra/i4/O1CN01EfJVFQ1uZPd7W4W6i_!!6000000006051-2-tps-112-112.png' },
          { text: '腾讯元宝', link: 'https://yuanbao.tencent.com/chat', icon: 'https://cdn-bot.hunyuan.tencent.com/logo-v2.png' },
          { text: 'Kimi', link: 'https://kimi.moonshot.cn/', icon: 'https://statics.moonshot.cn/kimi-web-seo/assets/favicon-OXkYivQY.ico' },
          { text: '文心一言（百度）', link: 'https://yiyan.baidu.com/', icon: 'https://nlp-eb.cdn.bcebos.com/logo/favicon.ico' },
        ]
      },
      {
        text: '专业领域',
        items: [
          { text: 'Trae（字节跳动）', description: '致力于成为真正的AI工程师', link: 'https://www.trae.com.cn/', icon: 'https://lf-cdn.trae.com.cn/obj/trae-com-cn/trae_website_prod_cn/favicon.ico' },
          { text: 'Effidit（腾讯）', description: '用AI技术提升写作者的写作效率和创作体验', link: 'https://effidit.qq.com/', icon: 'https://effidit.qq.com/favicon.png' },
          { text: 'ARC（腾讯）', description: '探索挑战智能媒体相关前沿技术', link: 'https://arc.tencent.com/zh/index', icon: 'https://arc.tencent.com/logo.ico' },
        ]
      },
      {
        text: '周边相关',
        items: [
          { text: 'Generative AI for Beginners', description: '面向初学者的生成式人工智能课程', link: 'https://microsoft.github.io/generative-ai-for-beginners/#/translations/cn/', icon: 'https://microsoft.github.io/generative-ai-for-beginners/images/favicon-32x32.png' },
          { text: 'Hugging Face', description: '机器学习社区模型、数据和应用协作平台', link: 'https://huggingface.co/', icon: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg' },
        ]
      }
    ]
  }
}