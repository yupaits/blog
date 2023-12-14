# 极空间Docker使用攻略

## 使用步骤
### 启用极空间Docker服务
![image.png](https://cdn.nlark.com/yuque/0/2023/png/763022/1698113876336-9829cfdf-5229-4098-83cc-47f120eca07f.png#averageHue=%23848473&clientId=ud386e83c-ca8b-4&from=paste&height=979&id=ub4b4812f&originHeight=979&originWidth=1440&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1123516&status=done&style=none&taskId=uc5411d78-bfce-4574-8a72-e274113d053&title=&width=1440)
### Docker容器管理
![image.png](https://cdn.nlark.com/yuque/0/2023/png/763022/1698113933370-45603a9f-adea-4d39-b339-0f1b9f8419a7.png#averageHue=%2324321f&clientId=ud386e83c-ca8b-4&from=paste&height=979&id=u26aad75b&originHeight=979&originWidth=1440&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1506885&status=done&style=none&taskId=uda253249-85d8-4006-a1ee-d724047e3bb&title=&width=1440)<br />可以对现有容器进行启动、停止、暂停等基本操作。
### Docker镜像管理
![image.png](https://cdn.nlark.com/yuque/0/2023/png/763022/1698113962905-1eccac3a-be68-4a45-9a16-ec17cab6a359.png#averageHue=%231f281b&clientId=ud386e83c-ca8b-4&from=paste&height=979&id=u9121b6c5&originHeight=979&originWidth=1440&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1489849&status=done&style=none&taskId=u0bdfd0d9-06cf-48a3-aae1-8db105f3d07&title=&width=1440)<br />可以配置多个镜像仓库，按需使用。一般来说Docker Hub的镜像是最全的，但是国内无法正常访问网页导致不能查看镜像的具体信息，也可以选择国内的镜像源加速镜像下载速度。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/763022/1698113984103-4a30ecfe-9253-4ee4-9cd7-382ac84ac183.png#averageHue=%23333821&clientId=ud386e83c-ca8b-4&from=paste&height=979&id=u48ef235c&originHeight=979&originWidth=1440&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1416678&status=done&style=none&taskId=u08f74d9f-e419-4137-80ce-a3eada76eb0&title=&width=1440)
### 添加容器
选择已经下载好的镜像，使用“添加到容器”功能，在完成容器的配置之后，即可创建一个新的容器。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/763022/1698114335483-01cbf266-e7f6-4e5c-a506-388118b0bedc.png#averageHue=%23373b25&clientId=ud386e83c-ca8b-4&from=paste&height=979&id=u2b7143fb&originHeight=979&originWidth=1440&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1414534&status=done&style=none&taskId=u66a10004-1331-4b5c-a539-c2ddcac1aa0&title=&width=1440)
## 注意事项
### 无法上传镜像至Docker Hub，导致无法从Docker Hub镜像源拉取镜像部署容器
此时可以通过以下步骤上传并部署本地镜像：

1. 在自己的开发机上使用`docker build`命令构建本地Docker镜像
2. 使用`docker save`将构建好的本地镜像打包成镜像文件
3. 上传镜像文件到极空间
4. 进入极空间Docker管理工具的镜像管理界面-本地镜像
5. 选择“导入镜像-从极空间导入”
6. 选择上传好的镜像文件导入Docker镜像
7. 导入完成之后，选择Docker镜像并添加到容器即可

也可以将镜像上传至其他Docker镜像平台，然后在极空间的镜像仓库配置该镜像源拉取镜像进行部署。
