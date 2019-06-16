# flatten-maven-plugin插件配置说明

> 引用自：[使用flatten-maven-plugin对发布的POM进行精简](https://my.oschina.net/liyuj/blog/874929)

使用maven开发的模块化应用，可以发布出去供他人使用，比如各种开源库，使用时，要么是继承，要么是以依赖的形式引入。但我们看各种库的pom.xml文件，通常都比较简单，一般只有一些必要的依赖信息，作为开发者，通常认为使用者也就需要这些信息。但是真正开发时，对应模块的pom可能比较复杂，可能要使用各种插件，引用各种依赖，组件间有继承关系，甚至根据不同的参数走不同的分支，即使用profile机制等，maven默认在部署时，会保留对应模块中的pom的所有信息，不会做改动。这样就给模块的发布带来了一定的麻烦，如果直接发布这样的pom.xml，是可能给使用者造成干扰的，出了问题又很难进行定位。

解决这个问题有很多的做法，比如构建两个工程，一个用于开发，一个用于版本发布，两个工程的pom是不同的，这样看上去也更符合软件开发的常规流程，另外，也可以考虑禁用maven默认的deloy过程，然后直接调用 `deploy:deploy-file` 单独部署某个文件。总之，不管怎样，办法肯定是有的。

而本文的目的，是想介绍一种新的方式，来优雅地解决这个问题，也许实际开发中并不需要这样做。

具体做法是，使用社区专门针对这个问题开发的插件，即Maven Flatten Plugin，这个插件使用起来非常简单，如下：

```xml
<plugins>
  <plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>flatten-maven-plugin</artifactId>
    <version>1.0.0</version>
    <configuration>
    </configuration>
    <executions>
      <execution>
        <id>flatten</id>
        <phase>process-resources</phase>
        <goals>
          <goal>flatten</goal>
        </goals>
      </execution>
    </executions>
  </plugin>
</plugins>
```

这个插件的作用是，生成一个压缩版的pom.xml文件，然后在install和deploy阶段使用压缩后的pom.xml文件，替换原来的pom.xml文件，具体压缩策略如下：

- 和构建有关的元素会被删除；
- 和开发有关的元素默认会被删除；
- 只包含构件的使用者必须的一些信息；
- 变量会被解析；
- 上级关系会被解析，然后被压缩删除；
- 构建时实际使用的profile会被评估，视情况处理；
- 由JDK或者OS驱动的profile会被保留，需要时可以动态地控制依赖。

在默认的压缩逻辑下，插件如何处理各种元素，可以看这里。 下面会重点介绍如何通过各种参数来控制压缩的过程：

|属性名|类型|描述|
|---|---|---|
|embedBuildProfileDependencies|Boolean|由OS或者JDK的不同而触发的profile，可能根据环境的不同而产生不同的依赖，但是由属性等触发的profile，就不确定了，如果属性设置为true，profile中的依赖会直接写入生成的pom中，如果设置为false，所有的profile信息都会保留,默认是false。|
|flattenMode|FlattenMode|插件预定义了若干种压缩模式，下面会详述。|
|flattenedPomFilename|String|生成的压缩后的`pom.xml`文件的文件名，默认为`.flattened-pom.xml`。|
|outputDirectory|File|生成的压缩后的`pom.xml`文件的存放位置，默认为`${project.basedir}`。|
|pomElements|FlattenDescriptor|该元素定义了如何处理额外的元素，如果可能，尽量使用`flattenMode`，这个元素仅仅用于进一步提高灵活性，它可以控制具体的某个元素是保留还是删除，比如要指定删除repositories，可以这样：`<pomElements><repositories>flatten</repositories></pomElements>`。|
|updatePomFile|Boolean|插件默认只会处理packaging属性为非pom的，如果要处理packaging为pom的，可将本属性值设置为true。|

插件预定义了若干种模式，可以满足若干种常见的场景，这些模式定义在org.codehaus.mojo.flatten.FlattenMode枚举中，具体可以看代码，本文简单描述如下：

|模式|描述|
|---|---|
|minimum|不推荐使用，会展开`pluginRepositories`。|
|bom|会保留`dependencyManagement`，展开`properties`。|
|oss|推荐开源项目使用，会展开`ciManagement`、`contributors`、`distributionManagement`、`inceptionYear`、`issueManagement`、`mailingLists`、`organization`、`prerequisites`|
|ossrh|会展开`name`、`description`、`url`、`scm`、`developers`|
|defaults|会展开`repositories`|
|clean|删除全部可选元素|

具体可以看[FlattenMode的javadoc](https://www.mojohaus.org/flatten-maven-plugin/apidocs/index.html)。

|pomElement处理方式|描述|
|---|---|
|expand|Take the element from the effective POM.|
|flatten|Flatten the element.|
|interpolate|Take the element from the interpolated POM (original POM with variables interpolated).|
|keep|Take the element untouched from the original POM.|
|remove|Remove the element entirely so it will not be present in flattened POM.|
|resolve|Take the element from the resolved POM.|