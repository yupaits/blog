# 发布jar包到Maven中央仓库

> 引用自[发布jar包到maven中央仓库](https://monkeywie.github.io/2018/07/23/publish-jar-to-maven/)

在 maven 中引入第三方 jar 包是非常简单的，只需使用 groupId + artifactId + version 就能从 Maven 仓库中下载对应的 jar 包。<br />例如：引入 guava 的 jar 包
```xml
<dependency>
    <gruopId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>25.0-jre</version>
</dependency>
```
本文就介绍如何将自己的 jar 包发布到 Maven 中央仓库。
## 创建issue
首先需要在 [https://issues.sonatype.org/secure/Dashboard.jspa](https://issues.sonatype.org/secure/Dashboard.jspa) 注册一个账号，创建一个新项目的 issue 并提交。<br />![创建issue.png](./发布jar包到Maven中央仓库/1658767626337-07d27bf2-b1ad-409a-af36-00624fb5c0f3.png)

- Project 选择 Community Support，Issue type 选择 New Project。
- 注意 Group Id，如果有对应域名的话则使用域名对应的 Group Id（例如 netty 项目的域名是 netty.io，则 Group Id 为 io.netty），没有自己的域名最好就填 com.github.xxx，因为在 issue 里审核员会询问你是否拥有 Group Id 对应的域名并且要求你进行技术验证，没有的话审核会不通过，而托管在 github 上的话就可以直接使用 github 的域名来完成审核。
## issue审核
创建成功后等 1-2 个小时左右就会有工作人员评论 issue，问你是否持有域名。<br />![issue审核.png](./发布jar包到Maven中央仓库/1658767622405-96969f16-e430-467c-84cd-0abf2fca5f70.png)<br />如果是用com.github.xxx的 Group Id，就回复要使用com.github.xxx作为你的域名，否则有域名就回复有就好,接着等待工作人员确认(我等了一天)，确认成功之后 issue 的状态就会变成RESOLVED，这个时候就有资格上传 jar 包到 maven 仓库了。
## gpg管理密钥
在上传 jar 包之前，先要使用 gpg 工具生成 RSA 密钥对，并把公钥上传到公共密钥服务器，这样在发布 jar 包时能校验用户的身份。

1.  下载 gpg 工具，[下载地址](https://www.gnupg.org/download/index.html)，下载对应操作系统的版本然后进行安装。 
2.  验证安装和上传生成的公钥 
   -  验证 gpg 是否安装成功 
```
gpg --version
```

   -  生成 RSA 密钥对 
```
gpgp --gen-key
```
接着需要填写名字和邮箱等等基本信息，这些都不是重点，最主要的是有个 `Passphase` 的选项在填完之后记下来，到时候发布 jar 包的时候要用到。 

   -  查看生成的密钥，并上传至密钥服务器<br />需要上传到服务器的就是 pub 里的公钥串 `DA4832CAE9C6100EBD5CB4D1AF21758121E778AE` 
```
gpg --list-keys
```
 上传公钥至密钥服务器，国内可以用这个服务器 `hkp://keyserver.ubuntu.com:11371`。 <br />上传完成后验证是否成功 <br />验证成功  
## maven配置

1.  修改项目中的pom.xml文件，添加部署相关配置，以下是个人项目 `project-commons` 的 pom.xml 示例： 
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.yupaits</groupId>
    <artifactId>project-commons</artifactId>
    <version>${revision}</version>
    <packaging>pom</packaging>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.5.RELEASE</version>
        <relativePath/>
    </parent>

    <name>project-commons</name>
    <description>项目通用commons</description>

    <url>https://github.com/yupaits/project-commons</url>
    <scm>
        <url>https://github.com/yupaits/project-commons.git</url>
    </scm>
    <licenses>
        <license>
            <name>MIT License</name>
            <url>https://github.com/yupaits/project-commons/blob/master/LICENSE</url>
        </license>
    </licenses>
    <developers>
        <developer>
            <id>yupaits</id>
            <url>https://github.com/yupaits</url>
            <email>ts495606653@hotmail.com</email>
        </developer>
    </developers>

    <properties>
        <revision>1.0.12</revision>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>
    </properties>

    <modules>
        <module>commons-parent</module>
        <module>commons-annotation</module>
        <module>commons-extension</module>
        <module>commons-jpa</module>
        <module>commons-mybatis</module>
    </modules>

    <distributionManagement>
        <repository>
            <id>releases</id>
            <url>https://oss.sonatype.org/service/local/staging/deploy/maven2</url>
        </repository>
        <snapshotRepository>
            <id>snapshots</id>
            <url>https://oss.sonatype.org/content/repositories/snapshots</url>
        </snapshotRepository>
    </distributionManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.0</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-source-plugin</artifactId>
                <version>3.0.1</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>jar-no-fork</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-javadoc-plugin</artifactId>
                <version>3.1.0</version>
                <configuration>
                    <additionalOptions>
                        <additionalOption>-Xdoclint:none</additionalOption>
                    </additionalOptions>
                </configuration>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>jar</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-gpg-plugin</artifactId>
                <version>1.6</version>
                <executions>
                    <execution>
                        <id>sign-artifacts</id>
                        <phase>verify</phase>
                        <goals>
                            <goal>sign</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>flatten-maven-plugin</artifactId>
                <inherited>true</inherited>
                <executions>
                    <execution>
                        <id>flatten</id>
                        <phase>process-resources</phase>
                        <goals>
                            <goal>flatten</goal>
                        </goals>
                        <configuration>
                            <updatePomFile>true</updatePomFile>
                            <flattenMode>bom</flattenMode>
                            <pomElements>
                                <parent>remove</parent>
                                <distributionManagement>remove</distributionManagement>
                                <repositories>remove</repositories>
                                <dependencyManagement>resolve</dependencyManagement>
                                <properties>interpolate</properties>
                            </pomElements>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

2.  把之前创建 issue 时注册的账号配置到 maven 的配置文件里，找到 maven 的 setting.xml文件，在 `<servers>` 标签里添加。 
```xml
<server>
    <id>releases</id>
    <username></username>
    <password></password>
</server>
<server>
    <id>snapshots</id>
    <username></username>
    <password></password>
</server>
```
## 部署jar包

1.  使用下面的命令行将项目打包构建并上传至maven仓库。 
```
mvn clean deploy -Dgpg.passphrase=YourPassphrase
```

2.  使用创建 issue 时的账号登录到 https://oss.sonatype.org/，然后看图操作。<br />![](https://monkeywie.github.io/2018/07/23/publish-jar-to-maven/1532339455164.png#id=FF0On&originHeight=647&originWidth=1916&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
3.  Close 完了系统会验证 jar 包，点击刷新可以看到最新的进度，当全部验证通过的时候，状态会变成 `closed`，然后再选中文件 `Release` 就发布完成了。然后等个几个小时就可以在中央仓库搜索到自己发布的 jar 包了。<br />![](https://monkeywie.github.io/2018/07/23/publish-jar-to-maven/1532339866124.png#id=Ybp11&originHeight=812&originWidth=1721&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=) 
