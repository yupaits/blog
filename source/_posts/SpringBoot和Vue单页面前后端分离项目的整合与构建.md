---
title: SpringBoot和Vue单页面前后端分离项目的整合与构建
date: 2020-02-04 19:21:28
category: Java
tags:
  - Java
  - Spring Boot
  - Vue.js
  - Maven
---

日常开发前后端分离应用时，通常会使用到Spring Boot开发后台服务，Vue.js开发前端SPA，而在部署时通常将后台服务和前端应用分开部署，使用nginx反向代理或者后台配置cors解决前后端的跨域问题。这样的方式在部署环节时稍显繁琐，本文介绍一种在构建环节直接将前端SPA直接打包进后台服务的jar包，只用部署jar包即可访问前端页面的方法。

<!--more-->

以[ultimate-spider](https://gitee.com/yupaits/ultimate-spider)为例说明该方法是如何实现将SPA打进后台服务jar包的。

**ultimate-spider**是采用IDEA的project + modules的方式进行开发的，该项目有两个module：spider-server，后台服务；spider-web，前端SPA。以下是相关的pom.xml文件的内容。

- ultimate-spider的pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.yupaits.us</groupId>
    <artifactId>ultimate-spider</artifactId>
    <version>1.1.0</version>
    <packaging>pom</packaging>

    <name>ultimate-spider</name>
    <description>Ultimate Spider Application</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.5.10.RELEASE</version>
        <relativePath/>
    </parent>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>
    </properties>

    <modules>
        <module>spider-web</module>
        <module>spider-server</module>
    </modules>
</project>
```

- spider-server的pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>ultimate-spider</artifactId>
        <groupId>com.yupaits.us</groupId>
        <version>1.1.0</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>spider-server</artifactId>
    <packaging>jar</packaging>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <exclusions>
                <exclusion>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-starter-tomcat</artifactId>
                </exclusion>
                <exclusion>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-starter-logging</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
            <exclusions>
                <exclusion>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-starter-logging</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-undertow</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-log4j2</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-core</artifactId>
            <version>4.2.3.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-amqp</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-mongodb</artifactId>
        </dependency>

        <dependency>
            <groupId>us.codecraft</groupId>
            <artifactId>webmagic-core</artifactId>
            <version>0.7.3</version>
            <exclusions>
                <exclusion>
                    <groupId>org.slf4j</groupId>
                    <artifactId>slf4j-log4j12</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <dependency>
            <groupId>us.codecraft</groupId>
            <artifactId>webmagic-extension</artifactId>
            <version>0.7.3</version>
        </dependency>

        <dependency>
            <groupId>org.quartz-scheduler</groupId>
            <artifactId>quartz</artifactId>
            <version>2.3.0</version>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.dataformat</groupId>
            <artifactId>jackson-dataformat-yaml</artifactId>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>1.1.1</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>com.google.guava</groupId>
            <artifactId>guava</artifactId>
            <version>22.0</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.35</version>
        </dependency>
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
            <version>3.6</version>
        </dependency>
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-collections4</artifactId>
            <version>4.1</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-resources-plugin</artifactId>
                <executions>
                    <execution>
                        <id>copy frontend content</id>
                        <phase>generate-resources</phase>
                        <goals>
                            <goal>copy-resources</goal>
                        </goals>
                        <configuration>
                            <outputDirectory>src/main/resources/public</outputDirectory>
                            <overwrite>true</overwrite>
                            <resources>
                                <resource>
                                    <directory>${project.parent.basedir}/spider-web/target/dist</directory>
                                    <includes>
                                        <include>static/</include>
                                        <include>index.html</include>
                                    </includes>
                                </resource>
                            </resources>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

- spider-web的pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>ultimate-spider</artifactId>
        <groupId>com.yupaits.us</groupId>
        <version>1.1.0</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>spider-web</artifactId>

    <properties>
        <frontend-maven-plugin.version>1.6</frontend-maven-plugin.version>
    </properties>

    <build>
        <plugins>
            <plugin>
                <groupId>com.github.eirslett</groupId>
                <artifactId>frontend-maven-plugin</artifactId>
                <version>${frontend-maven-plugin.version}</version>
                <executions>
                    <execution>
                        <id>install node and npm</id>
                        <goals>
                            <goal>install-node-and-npm</goal>
                        </goals>
                        <configuration>
                            <nodeVersion>v8.1.3</nodeVersion>
                            <npmVersion>5.7.1</npmVersion>
                        </configuration>
                    </execution>
                    <execution>
                        <id>npm set registry</id>
                        <goals>
                            <goal>npm</goal>
                        </goals>
                        <configuration>
                            <arguments>config set registry https://registry.npm.taobao.org</arguments>
                        </configuration>
                    </execution>
                    <execution>
                        <id>npm set non-strict ssl</id>
                        <goals>
                            <goal>npm</goal>
                        </goals>
                        <configuration>
                            <arguments>config set strict-ssl false</arguments>
                        </configuration>
                    </execution>
                    <execution>
                        <id>npm install</id>
                        <goals>
                            <goal>npm</goal>
                        </goals>
                        <phase>generate-resources</phase>
                        <configuration>
                            <arguments>install</arguments>
                        </configuration>
                    </execution>
                    <execution>
                        <id>npm run build</id>
                        <goals>
                            <goal>npm</goal>
                        </goals>
                        <configuration>
                            <arguments>run build</arguments>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>

```

该方法的大致流程如下：

1）在ultimate-spider下执行`mvn clean install`；

2）spider-web使用`frontend-maven-plugin`插件进行构建并生成`target/dist`目录；

3）spider-server使用`spring-boot-maven-plugin`插件构建基于Spring Boot的可执行jar文件；

4）spider-server使用`maven-resources-plugin`插件将spider-web下的`target/dist`复制到`resources/public`，`resources/public`作为资源文件会被打进Spring Boot的可执行jar文件中；

5）执行基于Spring Boot的可执行jar之后，访问`/`会默认跳转到`public`目录下的`index.html`。


该方法的核心就在于基于maven构建的配置文件pom.xml，这里对pom.xml里的几个关键配置项进行说明。

1. spider-web采用了maven的前端应用构建插件`frontend-maven-plugin`实现了基于npm的SPA项目的构建，这里是该插件的[GitHub地址](https://github.com/eirslett/frontend-maven-plugin)。

1. ultimate-spider中`<modules>`标签中必须是前端SPA模块spider-web在前，后台服务模块spider-server在后。

1. 在执行`npm run build`构建之前必须执行`npm install`下载依赖项。

1. `maven-resources-plugin`注意配置`<overwirte>true</overwirte>`，构建时覆盖掉之前的构建结果。