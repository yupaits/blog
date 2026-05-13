# yutool-state状态机组件

> v1.4.3版本使用虚拟线程替换传统线程池，移除线程池相关配置项

## 快速上手
### 1. Maven依赖
在项目的 `pom.xml` 中添加以下依赖：
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
        <artifactId>yutool-state</artifactId>
    </dependency>
</dependencies>
```

### 2. 使用状态机组件

编写一个继承`AbstractStateProcessor`的业务状态处理类，并组装一个`StateContext`状态机上下文对象，调用`AbstractStateProcessor`类的`action`方法即可。

## 设计思路

参考 [《通用可编排状态机引擎设计》](../../软件开发/软件架构/通用可编排状态机引擎设计.md) 进行实现。