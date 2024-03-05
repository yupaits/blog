# 使用Gitee+Jenkins+Docker完成前后端分离项目的CI_CD

## Gitee Webhook配置
![Webhook配置.png](./使用Gitee+Jenkins+Docker完成前后端分离项目的CI_CD/1658766771074-042a8790-ae3d-4737-8d32-09c6430d19e0.png)

URL的格式为 `http://[username]:[password或者jenkins的api_token]@www.yupaits.com:8080/generic-webhook-trigger/invoke` 。

webhook请求提交的数据参考[码云平台帮助文档](http://git.mydoc.io/?t=154711)。
## Jenkins插件安装、环境配置
### 必需插件
Jenkins需要安装以下插件：

- Generic Webhook Trigger Plugin
- Git Plugin
- NodeJS Plugin
### 全局环境
Jenkins需要配置以下全局工具：

- JDK
- Git
- Maven
- NodeJS
## Jenkins任务配置
### General
![任务配置-General.png](./使用Gitee+Jenkins+Docker完成前后端分离项目的CI_CD/1658766779977-a331662d-d29c-42e7-a114-ffb911aba40a.png)
### 源码管理
![任务配置-源码管理.png](./使用Gitee+Jenkins+Docker完成前后端分离项目的CI_CD/1658766783430-a42b5410-fd92-4a2a-898b-caa476b7683b.png)

填写Gitee代码仓库地址，选择需要构建的分支。
### 构建触发器
![任务配置-构建触发器.png](./使用Gitee+Jenkins+Docker完成前后端分离项目的CI_CD/1658766787535-1d82c907-dc7c-4b80-93e8-57a402d7de8a.png)

![任务配置-构建触发器1.png](./使用Gitee+Jenkins+Docker完成前后端分离项目的CI_CD/1658766792448-e63d6672-b934-4c70-bf2b-3b576210bdb7.png)

配置触发器参数和触发过滤条件。这里选择了分支名称和项目名称作为构建时的过滤条件。`Expression`里的`$`是webhook请求中的请求体JSON数据对象，而`Variable`中的ref则是Jenkins触发器的变量名，在`Optional filter`中可以通过`$ref`来引用该变量。
### 构建环境
![任务配置-构建环境.png](./使用Gitee+Jenkins+Docker完成前后端分离项目的CI_CD/1658766796523-d5ac633a-4acd-4946-9106-54d9c7487c87.png)

由于`Todo-Tomato`项目里有基于`vue-loader`的前端SPA，所以构建时需要`nodejs`和`npm`环境。
### 构建
![任务配置-构建.png](./使用Gitee+Jenkins+Docker完成前后端分离项目的CI_CD/1658766799876-93fdad83-32a9-4928-8ee5-1a8feabdbb53.png)

构建分三步：构建前执行脚本；maven构建；构建后执行脚本。

- 构建前脚本：停止相关docker容器；安装npm依赖；npm构建；dist文件夹移入后台Spring Boot项目的resources/public资源文件目录下。
```bash
#!/bin/bash
docker stop todo-tomato
cd /var/lib/jenkins/workspace/TodoTomato/todo-tomato-web
npm install
npm run build
mkdir -p ../todo-tomato-server/src/main/resources/public
rm -rf ../todo-tomato-server/src/main/resources/public/**
cp -rf dist/** ../todo-tomato-server/src/main/resources/public
```

- 构建后脚本：将构建生成的Jar包和DockerFile移入目标文件夹；停止相关docker容器并删除相关docker镜像；构建docker镜像；运行基于docker镜像的容器。
```bash
#!/bin/bash
mkdir -p /var/lib/jenkins/workspace/TodoTomato/todo-tomato-server/target/docker
cd /var/lib/jenkins/workspace/TodoTomato/todo-tomato-server/target
cp -f todo-tomato-server-*.jar docker
cp -f ../src/main/docker/DockerFile docker
cd docker
docker stop todo-tomato
docker rm todo-tomato
docker rmi yupaits/todo-tomato:latest
docker build -f DockerFile -t yupaits/todo-tomato:latest .
docker run -d -p 6060:6060 --restart always --name todo-tomato -v /root/todo-tomato/logs:/root/logs yupaits/todo-tomato:latest
```
### 构建后操作
![任务配置-构建后操作.png](./使用Gitee+Jenkins+Docker完成前后端分离项目的CI_CD/1658766807612-bb7ff2eb-42ad-422b-9547-e5e250cc3520.png)

构建完成后，将生成的Jar包和DockerFile进行归档。
