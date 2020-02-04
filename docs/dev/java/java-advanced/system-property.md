# Java的System.getProperty()方法使用

> 引用自[java的System.getProperty()方法使用](https://blog.csdn.net/itomge/article/details/9098207)

## 获取环境变量

通过 `System.getProperty("propertyName")` 可以获得环境变量设置的值。

常见的Key值有：

|key值|说明|
|---|---|
|java.version|Java 运行时环境版本|
|java.vendor|Java 运行时环境供应商|
|java.vendor.url|Java 供应商的 URL|
|java.home|Java 安装目录|
|java.vm.specification.version|Java 虚拟机规范版本|
|java.vm.specification.vendor|Java 虚拟机规范供应商|
|java.vm.specification.name|Java 虚拟机规范名称|
|java.vm.version|Java 虚拟机实现版本|
|java.vm.vendor|Java 虚拟机实现供应商|
|java.vm.name|Java 虚拟机实现名称|
|java.specification.version|Java 运行时环境规范版本|
|java.specification.vendor|Java 运行时环境规范供应商|
|java.specification.name|Java 运行时环境规范名称|
|java.class.version|Java 类格式版本号|
|java.class.path|Java 类路径|
|java.library.path|加载库时搜索的路径列表|
|java.io.tmpdir|默认的临时文件路径|
|java.compiler|要使用的 JIT 编译器的名称|
|java.ext.dirs|一个或多个扩展目录的路径|
|os.name|操作系统的名称|
|os.arch|操作系统的架构|
|os.version|操作系统的版本|
|file.separator|文件分隔符（在 UNIX 系统中是“/”）|
|path.separator|路径分隔符（在 UNIX 系统中是“:”）|
|line.separator|行分隔符（在 UNIX 系统中是“/n”）|
|user.name|用户的账户名称|
|user.home|用户的主目录|
|user.dir|用户的当前工作目录|

示例：

```Java
public class SystemPropertyTest {

    public static void main(String[] args) {
        System.getProperties().list(System.out);
    }
}
```

运行结果：

```
-- listing properties --
java.runtime.name=Java(TM) SE Runtime Environment
sun.boot.library.path=D:\Java\jdk1.8.0_131\jre\bin
java.vm.version=25.131-b11
java.vm.vendor=Oracle Corporation
java.vendor.url=http://java.oracle.com/
path.separator=;
java.vm.name=Java HotSpot(TM) 64-Bit Server VM
file.encoding.pkg=sun.io
user.script=
user.country=CN
sun.java.launcher=SUN_STANDARD
sun.os.patch.level=
java.vm.specification.name=Java Virtual Machine Specification
user.dir=E:\***
java.runtime.version=1.8.0_131-b11
java.awt.graphicsenv=sun.awt.Win32GraphicsEnvironment
java.endorsed.dirs=D:\Java\jdk1.8.0_131\jre\lib\endorsed
os.arch=amd64
java.io.tmpdir=C:\Users\***\AppData\Local\Temp\
line.separator=

java.vm.specification.vendor=Oracle Corporation
user.variant=
os.name=Windows 10
sun.jnu.encoding=GBK
java.library.path=D:\Java\jdk1.8.0_131\bin;C:\WINDOWS\S...
java.specification.name=Java Platform API Specification
java.class.version=52.0
sun.management.compiler=HotSpot 64-Bit Tiered Compilers
os.version=10.0
user.home=C:\Users\***
user.timezone=
java.awt.printerjob=sun.awt.windows.WPrinterJob
file.encoding=UTF-8
java.specification.version=1.8
user.name=***
java.class.path=D:\Java\jdk1.8.0_131\jre\lib\charsets...
java.vm.specification.version=1.8
sun.arch.data.model=64
java.home=D:\Java\jdk1.8.0_131\jre
sun.java.command=advanced.SystemPropertyTest
java.specification.vendor=Oracle Corporation
user.language=zh
awt.toolkit=sun.awt.windows.WToolkit
java.vm.info=mixed mode
java.version=1.8.0_131
java.ext.dirs=D:\Java\jdk1.8.0_131\jre\lib\ext;C:\W...
sun.boot.class.path=D:\Java\jdk1.8.0_131\jre\lib\resource...
java.vendor=Oracle Corporation
file.separator=\
java.vendor.url.bug=http://bugreport.sun.com/bugreport/
sun.cpu.endian=little
sun.io.unicode.encoding=UnicodeLittle
sun.desktop=windows
sun.cpu.isalist=amd64

```

## Java命令行运行参数说明

### 查看参数列表

虚拟机参数分为基本和扩展两类，在命令行中输入 `java` 就可以得到基本参数列表，输入 `java -X`就可以得到扩展参数列表。

```bash
λ java
用法: java [-options] class [args...]
           (执行类)
   或  java [-options] -jar jarfile [args...]
           (执行 jar 文件)
其中选项包括:
    -d32          使用 32 位数据模型 (如果可用)
    -d64          使用 64 位数据模型 (如果可用)
    -server       选择 "server" VM
                  默认 VM 是 server.

    -cp <目录和 zip/jar 文件的类搜索路径>
    -classpath <目录和 zip/jar 文件的类搜索路径>
                  用 ; 分隔的目录, JAR 档案
                  和 ZIP 档案列表, 用于搜索类文件。
    -D<名称>=<值>
                  设置系统属性
    -verbose:[class|gc|jni]
                  启用详细输出
    -version      输出产品版本并退出
    -version:<值>
                  警告: 此功能已过时, 将在
                  未来发行版中删除。
                  需要指定的版本才能运行
    -showversion  输出产品版本并继续
    -jre-restrict-search | -no-jre-restrict-search
                  警告: 此功能已过时, 将在
                  未来发行版中删除。
                  在版本搜索中包括/排除用户专用 JRE
    -? -help      输出此帮助消息
    -X            输出非标准选项的帮助
    -ea[:<packagename>...|:<classname>]
    -enableassertions[:<packagename>...|:<classname>]
                  按指定的粒度启用断言
    -da[:<packagename>...|:<classname>]
    -disableassertions[:<packagename>...|:<classname>]
                  禁用具有指定粒度的断言
    -esa | -enablesystemassertions
                  启用系统断言
    -dsa | -disablesystemassertions
                  禁用系统断言
    -agentlib:<libname>[=<选项>]
                  加载本机代理库 <libname>, 例如 -agentlib:hprof
                  另请参阅 -agentlib:jdwp=help 和 -agentlib:hprof=help
    -agentpath:<pathname>[=<选项>]
                  按完整路径名加载本机代理库
    -javaagent:<jarpath>[=<选项>]
                  加载 Java 编程语言代理, 请参阅 java.lang.instrument
    -splash:<imagepath>
                  使用指定的图像显示启动屏幕
有关详细信息, 请参阅 http://www.oracle.com/technetwork/java/javase/documentation/index.html。
```

```bash
λ java -X
    -Xmixed           混合模式执行 (默认)
    -Xint             仅解释模式执行
    -Xbootclasspath:<用 ; 分隔的目录和 zip/jar 文件>
                      设置搜索路径以引导类和资源
    -Xbootclasspath/a:<用 ; 分隔的目录和 zip/jar 文件>
                      附加在引导类路径末尾
    -Xbootclasspath/p:<用 ; 分隔的目录和 zip/jar 文件>
                      置于引导类路径之前
    -Xdiag            显示附加诊断消息
    -Xnoclassgc       禁用类垃圾收集
    -Xincgc           启用增量垃圾收集
    -Xloggc:<file>    将 GC 状态记录在文件中 (带时间戳)
    -Xbatch           禁用后台编译
    -Xms<size>        设置初始 Java 堆大小
    -Xmx<size>        设置最大 Java 堆大小
    -Xss<size>        设置 Java 线程堆栈大小
    -Xprof            输出 cpu 配置文件数据
    -Xfuture          启用最严格的检查, 预期将来的默认值
    -Xrs              减少 Java/VM 对操作系统信号的使用 (请参阅文档)
    -Xcheck:jni       对 JNI 函数执行其他检查
    -Xshare:off       不尝试使用共享类数据
    -Xshare:auto      在可能的情况下使用共享类数据 (默认)
    -Xshare:on        要求使用共享类数据, 否则将失败。
    -XshowSettings    显示所有设置并继续
    -XshowSettings:all
                      显示所有设置并继续
    -XshowSettings:vm 显示所有与 vm 相关的设置并继续
    -XshowSettings:properties
                      显示所有属性设置并继续
    -XshowSettings:locale
                      显示所有与区域设置相关的设置并继续

-X 选项是非标准选项, 如有更改, 恕不另行通知。
```