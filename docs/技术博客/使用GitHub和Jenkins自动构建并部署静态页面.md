# 使用GitHub和Jenkins自动构建并部署静态页面

随着DevOps的日趋成熟，CI/CD的概念已经慢慢为广大开发运维人员所熟知和认同，本文记录了GitHub结合Jenkins自动构建和部署静态页面的方法，并从中窥见CI/CD之一二，同时也是做一个备忘记录。
## 创建任务
创建任务时选择**构建一个自由风格的软件项目**。<br />![jenkins创建任务.png](https://cdn.nlark.com/yuque/0/2022/png/763022/1658766648756-75540d2d-6785-43b3-8841-f0c794075975.png#clientId=u830075be-5e81-4&from=drop&id=ucf4277b5&originHeight=296&originWidth=981&originalType=binary&ratio=1&rotation=0&showTitle=false&size=36463&status=done&style=none&taskId=ua3e03c38-4e4f-4b9b-bf37-4ffcf6bfd40&title=)
## 配置Jenkins任务
### General
![任务配置-General.png](https://cdn.nlark.com/yuque/0/2022/png/763022/1658766653491-8237245a-4971-49d7-9211-376c359d38f0.png#clientId=u830075be-5e81-4&from=drop&id=u7247b4e2&originHeight=767&originWidth=951&originalType=binary&ratio=1&rotation=0&showTitle=false&size=49302&status=done&style=none&taskId=u7aa52e36-6abe-4693-b0c6-7ec48858a50&title=)
### 源码管理
![任务配置-源码管理.png](https://cdn.nlark.com/yuque/0/2022/png/763022/1658766658696-fa24d47a-25d5-4eee-8413-31d4f08b13e2.png#clientId=u830075be-5e81-4&from=drop&id=ua3833113&originHeight=548&originWidth=965&originalType=binary&ratio=1&rotation=0&showTitle=false&size=31904&status=done&style=none&taskId=ubb9feed9-25e0-47cd-ae94-44ace879149&title=)<br />填写源码的git地址，用于下载源码到jenkins的工作空间，以便后续进行构建操作。
### 构建触发器
![任务配置-构建触发器.png](https://cdn.nlark.com/yuque/0/2022/png/763022/1658766664421-f6ac4b62-8416-4800-b373-89cc4f06a7cf.png#clientId=u830075be-5e81-4&from=drop&id=ub5e9cf85&originHeight=293&originWidth=966&originalType=binary&ratio=1&rotation=0&showTitle=false&size=28057&status=done&style=none&taskId=uccd6c38a-3c68-401e-bb86-e29be0c6400&title=)<br />[进入GitHub的相应项目中配置webhook](https://github.com/YupaiTS/yupaits-work/settings/hooks)，webhook的`Payload URL`填写格式为`http://jenkins所在的domain或者ip:port/github-webhook/`。完成配置后，github接收特定的事件之后会触发请求该url。jenkins接收到请求之后会触发任务执行构建。
### 构建环境
![任务配置-构建环境.png](https://cdn.nlark.com/yuque/0/2022/png/763022/1658766668839-c6fcab0b-3a7b-407d-b04a-9bdb13c27b3b.png#clientId=u830075be-5e81-4&from=drop&id=u25f6e058&originHeight=371&originWidth=958&originalType=binary&ratio=1&rotation=0&showTitle=false&size=26784&status=done&style=none&taskId=u00564b2e-f4e7-4789-9180-2ff42d58dc8&title=)<br />在`Console Output`中加入时间戳，将`nodejs` 和 `npm`命令加入PATH，方便进行全局执行。
### 构建
![任务配置-构建.png](https://cdn.nlark.com/yuque/0/2022/png/763022/1658766672991-354e36f0-e4da-4659-bc8b-dc9b114ef337.png#clientId=u830075be-5e81-4&from=drop&id=ubec290f8&originHeight=601&originWidth=959&originalType=binary&ratio=1&rotation=0&showTitle=false&size=24294&status=done&style=none&taskId=u589a6d1b-6796-408f-a312-a6b236754b2&title=)<br />首先执行`npm install`安装依赖包，再执行`npm run build`进行构建。<br />**YupaitsWork.sh**脚本用于将构建生成的页面覆盖掉nginx的静态页面，实现自动更新nginx主页的效果，其内容如下：
```bash
#!/bin/bash
rm -rf /var/www/html/**
cp -rf /var/lib/jenkins/workspace/YupaitsWork/dist/** /var/www/html
```
需要注意的是，默认的jenkins用户是没有`/var/www/html`目录的操作操作权限的，需要使用`chown -R jenkins:jenkins /var/www/html`更改该目录的所有者为jenkins用户。
### 构建后操作
![任务配置-构建后操作.png](https://cdn.nlark.com/yuque/0/2022/png/763022/1658766679130-e25aee49-4fc4-4f91-8b57-15706b664050.png#clientId=u830075be-5e81-4&from=drop&id=u25d2844b&originHeight=261&originWidth=965&originalType=binary&ratio=1&rotation=0&showTitle=false&size=13714&status=done&style=none&taskId=u59c5c684-179e-495a-aa2b-a192c87793c&title=)<br />将构建后的`dist`文件夹内容进行归档。
## 执行任务
完成任务的创建和配置之后，进入任务页面点击**立即构建**即可完成nginx主页的构建和覆盖部署。当然也可以通过push代码实现自动构建和部署。
