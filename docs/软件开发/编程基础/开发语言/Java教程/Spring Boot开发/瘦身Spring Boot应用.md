# 瘦身Spring Boot应用

在上一节中，我们使用Spring Boot提供的`spring-boot-maven-plugin`打包Spring Boot应用，可以直接获得一个完整的可运行的jar包，把它上传到服务器上再运行就极其方便。
但是这种方式也不是没有缺点。最大的缺点就是包太大了，动不动几十MB，在网速不给力的情况下，上传服务器非常耗时。并且，其中我们引用到的Tomcat、Spring和其他第三方组件，只要版本号不变，这些jar就相当于每次都重复打进去，再重复上传了一遍。
真正经常改动的代码其实是我们自己编写的代码。如果只打包我们自己编写的代码，通常jar包也就几百KB。但是，运行的时候，classpath中没有依赖的jar包，肯定会报错。
所以问题来了：如何只打包我们自己编写的代码，同时又自动把依赖包下载到某处，并自动引入到classpath中。解决方案就是使用`spring-boot-thin-launcher`。
## 使用spring-boot-thin-launcher
我们先演示如何使用spring-boot-thin-launcher，再详细讨论它的工作原理。
首先复制一份上一节的Maven项目，并重命名为`springboot-thin-jar`：
```java
<project ...>
    ...
    <groupId>com.itranswarp.learnjava</groupId>
    <artifactId>springboot-thin-jar</artifactId>
    <version>1.0-SNAPSHOT</version>
    ...
```
然后，修改`<build>`-`<plugins>`-`<plugin>`，给原来的`spring-boot-maven-plugin`增加一个`<dependency>`如下：
```java
<project ...>
    ...
    <build>
        <finalName>awesome-app</finalName>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <dependencies>
                    <dependency>
                        <groupId>org.springframework.boot.experimental</groupId>
                        <artifactId>spring-boot-thin-layout</artifactId>
                        <version>1.0.27.RELEASE</version>
                    </dependency>
                </dependencies>
            </plugin>
        </plugins>
    </build>
</project>
```
不需要任何其他改动了，我们直接按正常的流程打包，执行`mvn clean package`，观察`target`目录最终生成的可执行`awesome-app.jar`，只有79KB左右。
直接运行`java -jar awesome-app.jar`，效果和上一节完全一样。显然，79KB的jar肯定无法放下Tomcat和Spring这样的大块头。那么，运行时这个`awesome-app.jar`又是怎么找到它自己依赖的jar包呢？
实际上`spring-boot-thin-launcher`这个插件改变了`spring-boot-maven-plugin`的默认行为。它输出的jar包只包含我们自己代码编译后的class，一个很小的`ThinJarWrapper`，以及解析`pom.xml`后得到的所有依赖jar的列表。
运行的时候，入口实际上是`ThinJarWrapper`，它会先在指定目录搜索看看依赖的jar包是否都存在，如果不存在，先从Maven中央仓库下载到本地，然后，再执行我们自己编写的`main()`入口方法。这种方式有点类似很多在线安装程序：用户下载后得到的是一个很小的exe安装程序，执行安装程序时，会首先在线下载所需的若干巨大的文件，再进行真正的安装。
这个`spring-boot-thin-launcher`在启动时搜索的默认目录是用户主目录的`.m2`，我们也可以指定下载目录，例如，将下载目录指定为当前目录：
```bash
$ java -Dthin.root=. -jar awesome-app.jar
```
上述命令通过环境变量`thin.root`传入当前目录，执行后发现当前目录下自动生成了一个`repository`目录，这和Maven的默认下载目录`~/.m2/repository`的结构是完全一样的，只是它仅包含`awesome-app.jar`所需的运行期依赖项。
 注意：只有首次运行时会自动下载依赖项，再次运行时由于无需下载，所以启动速度会大大加快。如果删除了repository目录，再次运行时就会再次触发下载。
## 预热
把79KB大小的`awesome-app.jar`直接扔到服务器执行，上传过程就非常快。但是，第一次在服务器上运行`awesome-app.jar`时，仍需要从Maven中央仓库下载大量的jar包，所以，`spring-boot-thin-launcher`还提供了一个`dryrun`选项，专门用来下载依赖项而不执行实际代码：
```bash
java -Dthin.dryrun=true -Dthin.root=. -jar awesome-app.jar
```
执行上述代码会在当前目录创建`repository`目录，并下载所有依赖项，但并不会运行我们编写的`main()`方法。此过程称之为“预热”（warm up）。
如果服务器由于安全限制不允许从外网下载文件，那么可以在本地预热，然后把`awesome-app.jar`和`repository`目录上传到服务器。只要依赖项没有变化，后续改动只需要上传`awesome-app.jar`即可。
## 小结
利用`spring-boot-thin-launcher`可以给Spring Boot应用瘦身。其原理是记录app依赖的jar包，在首次运行时先下载依赖项并缓存到本地。
