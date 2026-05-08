# yutool-oss 文件存储

> v1.4.3 从yutool-casdoor拆分出yutool-oss文件存储模块，避免文件存储服务与OAuth认证服务耦合，为后续接入更多类型存储服务做准备。

v1.4.3版本基于`minio-cient`实现了S3对象存储的文件上传、下载、删除接口，具体使用方式如下文。

- maven依赖

    在项目的`pom.xml`文件添加如下依赖：

    ```xml
    <parent>
        <groupId>com.yupaits</groupId>
        <artifactId>yutool-parent</artifactId>
        <version>${yutool.version}</version>
        <relativePath/>
    </parent>

    <dependencies>
        <dependency>
            <groupId>com.yupaits</groupId>
            <artifactId>yutool-oss</artifactId>
        </dependency>
    </dependencies>
    ```

- 配置文件

    在项目的配置文件`application.yml`中添加以下配置：

    ```yml
    # MinIO存储服务配置
    minio:
      endpoint: <endpoint>
      accessKey: <accessKey>
      secretKey: <secretKey>
      regionId: <regionId>
      bucket: <bucket>
    ```

    **注意**： 带`<>`的配置值需要替换为实际内容。