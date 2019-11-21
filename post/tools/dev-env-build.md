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

  mysql:
    image: mysql:5.7
    container_name: mysql
    ports:
      - 3306:3306
    environment:
      MYSQL_ROOT_PASSWORD: sql123
    volumes:
      - ~/docker/mysql/data:/var/lib/mysql
      - ~/docker/mysql/conf:/etc/mysql/conf.d
    restart: always

  gitlab:
    image: gitlab/gitlab-ce
    container_name: gitlab
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://localhost:8000'
    volumes:
      - ~/docker/gitlab/conf:/etc/gitlab
      - ~/docker/gitlab/logs:/var/log/gitlab
      - ~/docker/gitlab/data:/var/opt/gitlab
    ports:
      - '22:22'
      - '8000:80'
    restart: always
  
  gitlab-runner:
    image: gitlab/gitlab-runner
    container_name: gitlab-runner
    volumes:
      - ~/docker/gitlab-runner/conf:/etc/gitlab-runner
      - /var/run/docker.sock:/var/run/docker.sock
    restart: always

  openldap:
    image: osixia/openldap:1.3.0
    container_name: openldap
    # 以下环境变量仅用于新的LDAP服务器
    environment:
      # 组织名称
      LDAP_ORGANISATION: 'Example Inc.'
      # LDAP域
      LDAP_DOMAIN: example.com
      # LDAP基本DN。为空，默认取LDAP_DOMAIN的值
      LDAP_BASE_DN: 
      # LDAP管理员密码。默认是 admin
      LDAP_ADMIN_PASSWORD: password
      # LDAP配置密码。默认是 config
      LDAP_CONFIG_PASSWORD: config
    # 使用现有的LDAP数据库
    volumes:
      - ~/docker/slapd/database:/var/lib/ldap
      - ~/docker/slapd/config:/etc/ldap/slapd.d
    ports:
      - '389:389'
      - '636:636'
    restart: always

  openldap-backup:
    image: osixia/openldap-backup:1.3.0
    container_name: openldap-backup
    environment:
      # OPENLDAP配置备份cron表达式，默认是 '0 4 * * *'，每天凌晨4点
      LDAP_BACKUP_CONFIG_CRON_EXP: '0 5 * * *'
      # OPENLDAP数据备份cron表达式，默认是 '0 4 * * *'
      LDAP_BACKUP_DATA_CRON_EXP: '0 5 * * *'
      # OPENLDAP备份保存天数，默认15天
      LDAP_BACKUP_TTL: 15
    volumes:
      - ~/docker/openldap/backup:/data/backup
    restart: always
  
  phpLDAPadmin:
    image: osixia/phpldapadmin:0.9.0
    container_name: phpLDAPadmin
    environment:
      PHPLDAPADMIN_LDAP_HOSTS: ldap-host
    links:
      - openldap: ldap-host
    restart: always

  postgres:
    image: postgres:10
    container_name: postgres
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
      POSTGRES_DB: sonar
    ports:
      - 5432:5432
    restart: always

  sonarqube:
    image: sonarqube
    container_name: sonarqube
    environment:
      sonar.jdbc.username: admin
      sonar.jdbc.password: password
    volumes:
      - ~/docker/sonarqube/conf:/opt/sonarqube/conf
      - ~/docker/sonarqube/extensions:/opt/sonarqube/extensions
      - ~/docker/sonarqube/logs:/opt/sonarqube/logs
      - ~/docker/sonarqube/data:/opt/sonarqube/data
    ports:
      - '9900:9000'
    restart: always
```

未完待续……