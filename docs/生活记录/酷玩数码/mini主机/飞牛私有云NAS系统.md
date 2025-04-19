# 飞牛私有云NAS系统

飞牛私有云是一款国产NAS系统，拥有**正版免费**、**硬件兼容**、**性能超群**、**存储自由**、**智能影视**等特性。飞牛私有云基于最新Linux内核（Debian发行版）深度开发，兼容主流x86硬件，可自由组装NAS，灵活扩展外部存储。

![飞牛私有云](./飞牛私有云NAS系统/fnos.png)

飞牛私有云fnOS系统的使用教程在官方的[帮助中心](https://help.fnnas.com/)网站上可以轻松获取到，这里就不做过多陈述。

fnOS应用中心有大量针对NAS设备的软件应用，所有应用均可一键安装配置，小白都能轻松上手。除官方应用外，通过社区的力量，第三方应用也在不断地丰富和壮大。

笔者手中已经有了一台专业NAS设备，但由于CPU是arm架构，不支持虚拟机也无法畅玩Docker应用，而fnOS中的Docker和虚拟机功能，正好填补了这一空白。

以下内容简单介绍了个人飞牛NAS设备中使用的应用，一些Docker和虚拟机功能的使用场景。

## 应用中心

![fnOS应用中心](./飞牛私有云NAS系统/fnos-app.png)

|应用|介绍|
|---|---|
| **影视** | `官方` 飞牛官方出品。打造私人影院和完美海报墙，从未如此简单。 |
| **相册** | `官方` 飞牛官方出品，相册存储美好时光。 |
| **文件快照** | `官方` 快照将记录存储数据在某一时刻的状态并支持快速还原，从而降低因误删、病毒等意外而丢失数据的风险。 |
| **Lucky** | `社区` 支持IPv6/IPv4端口转发、反向代理、动态域名、语音助手网络唤醒、IPv4内网穿透、计划任务和自动证书等多项功能。 |
| **Sun-Panel** | `社区` 一个服务器、NAS导航面板、Homepage、浏览器首页。 |
| **EasyNVR** | `社区` EasyNVR不仅能汇聚和管理多个NVR，进行实时视频和录像视频的查看，还能够对NVR设备状态和工作状态进行实时的监测和预警，监测内容包括摄像机离线、录像缺失、画面遮挡、信号丢失等。 |

## Docker

fnOS的Docker整合了Docker Compose容器编排工具，可以通过编写`docker-compose.yml`文件实现容器编排。

![fnOS Docker环境](./飞牛私有云NAS系统/fnos-docker.png)

|容器|介绍|
|---|---|
| **mariadb** | mariadb数据库 |
| **dnsmasq** | 无公网域名或者无公网IP时，通过dnsmasq将域名解析到内网IP，实现在局域网内使用域名访问服务 |
| **gitea** | Git服务 代码托管 |
| **drone** | drone-ci 整合Gitea实现CI/CD |
| **minio** | minio对象存储，文件存储服务 |
| **redis** | Redis分布式缓存 |
| **casdoor** | Casdoor单点登录服务 |
| **jackett** | Jackett磁力种子搜索 |
| **drawio** | Drawio绘图应用 |
| **nacos-server** | Nacos配置中心 |
| **excalidraw** | Excalidraw手绘风格绘图应用 |
| **xxl-job-admin** | xxl-job定时任务平台 |
| **hbbs** | RustDesk ID服务 |
| **hbbr** | RustDesk 中继服务 |
| **memos** | Memos备忘录 |
| **howtocook** | How To Cook程序员做饭指南 |

`docker-compose.yml`内容如下：

> 注意：`192.168.2.3`是fnOS的本地IP地址，按需替换；使用`[]`标记的值需修改为实际值。

```yml
services:
  mariadb:
    image: mariadb:10
    container_name: mariadb
    network_mode: bridge
    ports:
      - 3306:3306
    environment:
      - MYSQL_ROOT_PASSWORD=[root用户密码]
    volumes:
      - /vol1/1000/docker/mariadb/data:/var/lib/mysql
    restart: always

  dnsmasq:
    image: dockurr/dnsmasq:latest
    container_name: dnsmasq
    network_mode: bridge
    environment:
      - DNS1=223.5.5.5
      - DNS2=119.29.29.29
    ports:
      - 53:53/udp
      - 53:53/tcp
    volumes:
      - /vol1/1000/docker/dnsmasq/dnsmasq.conf:/etc/dnsmasq.conf
    cap_add:
      - NET_ADMIN
    restart: always

  gitea:
    image: gitea/gitea:1.23
    container_name: gitea
    network_mode: bridge
    extra_hosts:
      - "casdoor.yupaits.com:192.168.2.3"
      - "drone.yupaits.com:192.168.2.3"
    ports:
      - 3000:3000
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - GITEA_database_DB_TYPE=mysql
      - GITEA_database_HOST=192.168.2.3:3306
      - GITEA_database_NAME=gitea
      - GITEA_database_USER=[数据库用户名]
      - GITEA_database_PASSWD=[数据库密码]
    volumes:
      - /vol1/1000/docker/gitea/data:/data
    depends_on:
      - dnsmasq
    restart: always

  drone:
    image: drone/drone:2
    container_name: drone
    network_mode: bridge
    extra_hosts:
      - "gitea.yupaits.com:192.168.2.3"
    environment:
      - DRONE_GITEA_SERVER=https://gitea.yupaits.com
      - DRONE_GITEA_CLIENT_ID=[Gitea中drone应用的客户端ID]
      - DRONE_GITEA_CLIENT_SECRET=[Gitea中drone应用的客户端密钥]
      - DRONE_RPC_SECRET=[drone应用通信密钥]
      - DRONE_SERVER_HOST=drone.yupaits.com
      - DRONE_SERVER_PROTO=https
      # 在drone中创建yupaits管理员用户
      - DRONE_USER_CREATE=username:yupaits,admin:true
    ports:
      - 1080:80
    volumes:
      - /vol1/1000/docker/drone:/data
    depends_on:
      - dnsmasq
    restart: always

  minio:
    image: minio/minio:latest
    container_name: minio
    command: server /data --console-address ':9001'
    network_mode: bridge
    extra_hosts:
      - "casdoor.yupaits.com:192.168.2.3"
    ports:
      - 9000:9000
      - 9001:9001
    environment:
      - MINIO_ROOT_USER=[root用户名]
      - MINIO_ROOT_PASSWORD=[root用户密码]
    volumes:
      - /vol1/1000/docker/minio/data:/data
    restart: always

  redis:
    image: redis/redis-stack:6.2.6-v19
    container_name: redis
    network_mode: bridge
    ports:
      - 6379:6379
      - 28001:8001
    volumes:
      - /vol1/1000/docker/redis-stack/data:/data
    restart: always

  casdoor:
    image: casbin/casdoor:latest
    container_name: casdoor
    network_mode: bridge
    ports:
      - 8800:8000
    environment:
      - driverName=mysql
      - dataSourceName=[数据库用户名]:[数据库密码]@tcp(192.168.2.3:3306)/
    volumes:
      - /vol1/1000/docker/casdoor/files:/files
    depends_on:
      - mariadb
    restart: always

  jackett:
    image: linuxserver/jackett:latest
    container_name: jackett
    network_mode: bridge
    ports:
      - 9117:9117
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai
    volumes:
      - /vol1/1000/docker/jackett/config:/config
    restart: always

  drawio:
    image: jgraph/drawio:latest
    container_name: drawio
    network_mode: bridge
    ports:
      - 8080:8080
    restart: always

  nacos-server:
    image: nacos/nacos-server:v2.4.3
    container_name: nacos-server
    network_mode: bridge
    ports:
      - 8848:8848
      - 9848:9848
    environment:
      - MODE=standalone
      - TZ=Asia/Shanghai
      - MYSQL_SERVICE_HOST=192.168.2.3
      - MYSQL_SERVICE_DB_NAME=nacos
      - MYSQL_SERVICE_USER=[数据库用户名]
      - MYSQL_SERVICE_PASSWORD=[数据库密码]
      - SPRING_DATASOURCE_PLATFORM=mysql
    depends_on:
      - mariadb
    restart: always

  excalidraw:
    image: excalidraw/excalidraw:latest
    container_name: excalidraw
    network_mode: bridge
    ports:
      - 5000:80
    restart: always

  xxl-job-admin:
    image: xuxueli/xxl-job-admin:2.4.1
    container_name: xxl-job-admin
    network_mode: bridge
    environment:
      - PARAMS=--spring.datasource.url=jdbc:mysql://192.168.2.3:3306/xxl_job?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai --spring.datasource.username=[数据库用户名] --spring.datasource.password=[数据库密码] --xxl.job.accessToken=[调度中心通讯Token]
    ports:
      - 3080:8080
    depends_on:
      - mariadb
    restart: always

  hbbs:
    image: rustdesk/rustdesk-server:latest
    container_name: hbbs
    command: hbbs
    network_mode: host
    volumes:
      - /vol1/1000/docker/rustdesk:/root
    depends_on: 
      - hbbr
    restart: always

  hbbr:
    image: rustdesk/rustdesk-server:latest
    container_name: hbbr
    command: hbbr
    network_mode: host
    volumes:
      - /vol1/1000/docker/rustdesk:/root
    restart: always

  memos:
    image: neosmemo/memos:stable
    container_name: memos
    network_mode: bridge
    extra_hosts:
      - "casdoor.yupaits.com:192.168.2.3"
    environment:
      - MEMOS_DRIVER=mysql
      - MEMOS_DSN=[数据库用户名]:[数据库密码]@tcp(192.168.2.3:3306)/memos
    ports:
      - 5230:5230
    volumes:
      - /vol1/1000/docker/memos/:/var/opt/memos
    depends_on:
      - mariadb
      - dnsmasq
    restart: always

  howtocook:
    image: ghcr.io/anduin2017/how-to-cook:latest
    container_name: howtocook
    network_mode: bridge
    ports:
      - 5500:5000
    restart: always
```

## 虚拟机

在虚拟机中安装了Alpine系统，并在Alpine系统中安装了Docker环境，实现了个人项目的自动构建和部署。提交并push代码到Gitea后可触发drone-runner构建项目Docker镜像，并使用构建好的镜像部署Docker容器。

![fnOS虚拟机](./飞牛私有云NAS系统/fnos-vm.png)

|容器|介绍|
|---|---|
| **dpanel** | Docker管理面板 |
| **drone-runner** | drone-ci 运行服务，用于执行构建部署任务 |
| **nginx** | 内网部署个人博客静态页面 |

![fnOS虚拟机Alpine系统Docker环境](./飞牛私有云NAS系统/fnos-alpine-docker.png)

Alpine系统中的`docker-compose.yml`内容如下：

```yml
services:
  dpanel:
    image: dpanel/dpanel:lite
    container_name: dpanel
    network_mode: bridge
    ports:
      - 8807:8080
    volumes:
      - /root/dpanel:/dpanel
      - /var/run/docker.sock:/var/run/docker.sock
    restart: always

  drone-runner:
    image: drone/drone-runner-docker:1
    container_name: drone-runner
    network_mode: bridge
    extra_hosts:
      - "drone.yupaits.com:192.168.2.3"
    environment:
      - DRONE_RPC_PROTO=https
      - DRONE_RPC_HOST=drone.yupaits.com
      - DRONE_RPC_SECRET=[drone应用通信密钥]
      - DRONE_RUNNER_CAPACITY=3
      - DRONE_RUNNER_NAME=drone-runner
    ports:
      - 3000:3000
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    restart: always

  nginx:
    image: nginx:latest
    container_name: nginx
    network_mode: bridge
    ports:
      - 80:80
    volumes:
      - /root/nginx/conf/conf.d:/etc/nginx/conf.d
      - /root/nginx/log:/var/log/nginx
      - /root/drone/yupaits-notes:/usr/share/nginx/html
    restart: always
```