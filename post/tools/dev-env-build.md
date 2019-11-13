---
sidebar: auto
---
# 开发环境搭建

## 工具说明

|名称|简介|使用说明|
|---|---|---|
|OpenLDAP|开源的LDAP协议实现。|[OpenLDAP](https://github.com/osixia/docker-openldap)|
|GitLab|Git仓库管理工具|[GitLab使用手册](https://blog.yupaits.com/in-action/gitlab-manual.html)|
|GitLab-CI|GitLab默认集成的持续集成工具|[GitLab-CI Runner](https://docs.gitlab.com/runner/)|
|SonarQube|代码质量管理平台|[SonarQube](https://docs.sonarqube.org/latest/)|
|Nexus|Maven仓库管理器|[Sonatype Help](https://help.sonatype.com/docs)|
|Portainer|Docker可视化管理工具|[Portainer安装](https://www.portainer.io/installation/)|
|Harbor|企业级Docker仓库|[Harbor](https://github.com/goharbor/harbor/blob/master/docs/user_guide.md)|
|jumpserver|开源堡垒机，符合4A的专业运维审计系统。|[jumpserver](https://docs.jumpserver.org/zh/docs/dockerinstall.html#)|

## 使用 docker-compose 部署

以上工具的 `docker-compose.yml` 文件内容如下：

```yaml
version: '3.1'

services:
  portainer: 
    image: portainer/portainer
    container_name: portainer
    ports:
        - 9000:9000
    volumes:
        - /var/run/docker.sock:/var/run/docker.sock
        - ~/docker/portainer/data:/data
    restart: always
```

未完待续……