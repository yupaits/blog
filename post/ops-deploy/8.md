---
sidebar: auto
---
# GitLab-CI环境搭建与SpringBoot项目CI配置总结

## GitLab-CI环境搭建

### 运行GitLab Runner容器

> 参考[Run GitLab Runner in a container - Docker image installation and configuration](https://docs.gitlab.com/runner/install/docker.html#docker-image-installation-and-configuration)

执行下述命令运行gitlab-runner容器。

```bash
docker run -d --name gitlab-runner --restart always \
  -v /srv/gitlab-runner/config:/etc/gitlab-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  gitlab/gitlab-runner:latest
```

### 注册GitLab Runner

> 参考[Registering Runners](https://docs.gitlab.com/runner/register/index.html#gnu-linux)

使用 `docker exec -it gitlab-runner /bin/bash` 命令进入 gitlab-runner 容器命令行环境。

执行 `gitlab-runner register` 命令开始注册一个 runner。

注册时只有输入共享Runner的注册令牌（token）才能注册为共享Runner。关于Runner executor的介绍可以查看 [Executors](https://docs.gitlab.com/runner/executors/README.html)。Runner executor选择Docker时会要求填写要使用的默认docker镜像。

## SpringBoot项目的CI配置

### 安全变量

GitLab CI/CD的安全变量有两种，群组安全变量和项目安全变量，群组安全变量可作用于当前群组下所有项目以及子群组项目，递归继承；项目安全变量只作用当前项目。

实际项目配置的群组变量有：CI_REGISTRY（本地Docker Registry的地址），项目变量有：CI_REGISTRY_IMAGE（项目构建的docker镜像名称）

### Dockerfile

```Dockerfile
FROM java:8-jre

ADD target/discovery-server-1.0.0.jar app.jar

RUN bash -c 'touch /app.jar'

EXPOSE 10030

ENTRYPOINT ["java", "-Djava.security.edg=file:/dev/./urandom", "-Duser.timezone=Asia/Shanghai", "-Xmx128m", "-Xms64m", "-jar", "/app.jar"]
```

### .gitlab-ci.yml

.gitlab-ci.yml文件可以使用的变量除了手动配置的安全变量外，默认还可以使用预定义变量（详情见[GitLab CI/CD Variables](https://docs.gitlab.com/ee/ci/variables/)）。

示例：

```Yaml
image: docker:latest

services:
  - name: docker:dind
    command: ["--insecure-registry=172.17.0.1:5000"]    # 将本地Docker Registry私服设置为insecure，避免registry默认需要https才能访问

stages:
  - package
  - build
  - deploy
  
maven-package:
  image: maven:3.5-jdk-8-alpine
  tags:
    - maven
  stage: package
  script:
    - mvn clean install -Dmaven.test.skip=true
  artifacts:
    paths:
      - target/*.jar    # 将maven构建成功的jar包作为构建产出导出，可在下一个stage的任务中使用

build-master:
  tags:
    - docker
  stage: build
  script:
    - docker build --pull -t "$CI_REGISTRY/$CI_REGISTRY_IMAGE" .
    - docker push "$CI_REGISTRY/$CI_REGISTRY_IMAGE"
  only:
    - master

build:
  tags:
    - docker
  stage: build
  script:
    - docker build --pull -t "$CI_REGISTRY/$CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG" .
    - docker push "$CI_REGISTRY/$CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG"
  except:
    - master
```

## Runner容器的配置

将maven构建runner容器使用的maven仓库使用数据卷方式进行共享，解决容器每次构建时都要重新下载依赖的问题。具体方法为使用 `docker exec -it gitlab-runner /bin/bash` 进入gitlab-runner容器，编辑 `/etc/gitlab-runner/config.toml` 文件，在maven构建runner下的volumes加上 `/root/.m2` 本地仓库的数据卷映射关系。

docker构建runner的privileged设置为true，以root用户身份进入容器进行构建任务，避免了由于权限不足无法访问/var/run/docker.sock的问题。

```conf
concurrent = 6
check_interval = 0

[[runners]]
  name = "public docker runner"
  url = "http://172.17.0.1:800/"
  token = "5223e807ba2c42b18e2aadeceb0e0b"
  executor = "docker"
  [runners.docker]
    registry_mirrors = ["https://ub9x5g6o.mirror.aliyuncs.com/"]
    extra_hosts = ["git.yupaits.com:172.17.0.1"]
    tls_verify = false
    image = "docker:latest"
    privileged = true
    disable_cache = false
    volumes = ["/cache"]
    shm_size = 0
  [runners.cache]

[[runners]]
  name = "public maven runner"
  url = "http://172.17.0.1:800/"
  token = "b97734914a435c7f3409bea71e122a"
  executor = "docker"
  [runners.docker]
    extra_hosts = ["git.yupaits.com:172.17.0.1"]
    tls_verify = false
    image = "maven:3.5-jdk-8-alpine"
    privileged = true
    disable_cache = false
    volumes = ["/cache", "/home/maven/.m2:/root/.m2"]
    pull_policy = "if-not-present"
    shm_size = 0
  [runners.cache]

[[runners]]
  name = "public node runner"
  url = "http://172.17.0.1:800/"
  token = "e0dea1b0cb42a8d2e1df94ee442b82"
  executor = "docker"
  [runners.docker]
    extra_hosts = ["git.yupaits.com:172.17.0.1"]
    tls_verify = false
    image = "node:8-alpine"
    privileged = true
    disable_cache = false
    volumes = ["/cache"]
    shm_size = 0
  [runners.cache]

[[runners]]
  name = "public ssh runner"
  url = "http://172.17.0.1:800/"
  token = "266dc28d04f012a5ead3987c1f004e"
  executor = "ssh"
  [runners.ssh]
    user = "yupaits"
    password = "1115"
    host = "172.17.0.1"
    port = "22"
    identity_file = "/root/.ssh/id_rsa"
  [runners.cache]
```