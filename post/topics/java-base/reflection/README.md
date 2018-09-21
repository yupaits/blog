# 提供api方法取得类的结构

> 引用自[Java 反射](http://www.importnew.com/17616.html)

## 动态语言

动态语言，是指程序在运行时可以改变其结构：新的函数可以被引进，已有的函数可以被删除等在结构上的变化。比如众所周知的ECMAScript(JavaScript)便是一个动态语言。除此之外如Ruby、Python等也都属于动态语言，而C、C++等语言则不属于动态语言。(引自: 百度百科)

```Javascript
var execString = "alert(Math.floor(Math.random()*10));";
eval(execString);
```

## Class反射机制

- 指的是可以于运行时加载,探知和使用编译期间完全未知的类。

- 程序在运行状态中, 可以动态加载一个只有名称的类, 对于任意一个已经加载的类,都能够知道这个类的所有属性和方法; 对于任意一个对象,都能调用他的任意一个方法和属性。

- 加载完类之后, 在堆内存中会产生一个Class类型的对象(一个类只有一个Class对象), 这个对象包含了完整的类的结构信息,而且这个Class对象就像一面镜子,透过这个镜子看到类的结构,所以被称之为：反射。

    > Instances of the class Class represent classes and interfaces in a running Java application. An enum is a kind of class and an annotation is a kind of interface. Every array also belongs to a class that is reflected as a Class object that is shared by all arrays with the same element type and number of dimensions(维度). The primitive Java types (boolean, byte, char, short, int, long, float, anddouble), and the keyword void are also represented as Class objects.

- 每个类被加载进入内存之后,系统就会为该类生成一个对应的java.lang.Class对象,通过该Class对象就可以访问到JVM中的这个类。

### Class对象的获取

- 对象的getClass()方法;

- 类的.class(最安全/性能最好)属性;

- 运用Class.forName(String className)动态加载类,className需要是类的全限定名(最常用).

### 从Class中获取信息

Class类提供了大量的实例方法来获取该Class对象所对应的详细信息,Class类大致包含如下方法,其中每个方法都包含多个重载版本,因此我们只是做简单的介绍,详细请参考[JDK文档](http://docs.oracle.com/javase/8/docs/api/java/lang/Class.html)。

- 获取类的信息

|获取的内容|方法签名|
|---|---|
|构造器|	Constructor‹T› getConstructor(Class‹?›... parameterTypes)|
|包含的方法|	Method getMethod(String name, Class‹?›... parameterTypes)|
|包含的属性|	Field getField(String name)|
|包含的Annotation|	‹A extends Annotation› A getAnnotation(Class‹A› annotationClass)|
|内部类|	Class‹?›[] getDeclaredClasses()|
|外部类|	Class‹?› getDeclaringClass()|
|所实现的接口|	Class‹?›[] getInterfaces()|
|修饰符|	int getModifiers()|
|所在包|	Package getPackage()|
|类名|	String getName()|
|简称|	String getSimpleName()|

- 一些判断类本身信息的方法

|判断内容|方法签名|
|---|---|
|注解类型?|	boolean isAnnotation()|
|使用了该Annotation修饰?|	boolean isAnnotationPresent(Class‹? extends Annotation› annotationClass)|
|匿名类?|	boolean isAnonymousClass()|
|数组?|	boolean isArray()|
|枚举?|	boolean isEnum()|
|原始类型?|	boolean isPrimitive()|
|接口?|	boolean isInterface()|
|obj是否是该Class的实例|	boolean isInstance(Object obj)|

- 使用反射生成并操作对象

Method Constructor Field这些类都实现了java.lang.reflect.Member接口,程序可以通过Method对象来执行相应的方法,通过Constructor对象来调用对应的构造器创建实例,通过Filed对象直接访问和修改对象的成员变量值。

## 创建对象

通过反射来生成对象的方式有两种:

- 使用Class对象的newInstance()方法来创建该Class对象对应类的实例(这种方式要求该Class对象的对应类有默认构造器).

- 先使用Class对象获取指定的Constructor对象, 再调用Constructor对象的newInstance()方法来创建该Class对象对应类的实例(通过这种方式可以选择指定的构造器来创建实例).

## 访问成员变量

通过Class对象的的getField()方法可以获取该类所包含的全部或指定的成员变量Field,Filed提供了如下两组方法来读取和设置成员变量值.

- getXxx(Object obj): 获取obj对象的该成员变量的值, 此处的Xxx对应8中基本类型,如果该成员变量的类型是引用类型, 则取消get后面的Xxx;

- setXxx(Object obj, Xxx val): 将obj对象的该成员变量值设置成val值.此处的Xxx对应8种基本类型, 如果该成员类型是引用类型, 则取消set后面的Xxx;

::: tip 注意：
getDeclaredField方法可以获取所有的成员变量，包括private修饰的成员变量。
:::

```Java
public class Client {
 
    @Test
    public void client() throws NoSuchFieldException, IllegalAccessException {
        User user = new User();
        Field idFiled = User.class.getDeclaredField("id");
        setAccessible(idFiled);
        idFiled.setInt(user, 46);
 
        Field nameFiled = User.class.getDeclaredField("name");
        setAccessible(nameFiled);
        nameFiled.set(user, "feiqing");
 
        Field passwordField = User.class.getDeclaredField("password");
        setAccessible(passwordField);
        passwordField.set(user, "ICy5YqxZB1uWSwcVLSNLcA==");
 
        System.out.println(user);
    }
 
    private void setAccessible(AccessibleObject object) {
        object.setAccessible(true);
    }
}
```

## 使用反射获取泛型信息

为了通过反射操作泛型以迎合实际开发的需要, Java新增了java.lang.reflect.ParameterizedType java.lang.reflect.GenericArrayTypejava.lang.reflect.TypeVariable java.lang.reflect.WildcardType几种类型来代表不能归一到Class类型但是又和原始类型同样重要的类型.

|类型|含义|
|---|---|
|ParameterizedType|	一种参数化类型, 比如Collection‹String›|
|GenericArrayType|	一种元素类型是参数化类型或者类型变量的数组类型|
|TypeVariable|	各种类型变量的公共接口|
|WildcardType|	一种通配符类型表达式, 如? ? extends Number ? super Integer|

其中, 我们可以使用ParameterizedType来获取泛型信息.

```Java
public class Client {
 
    private Map<String, Object> objectMap;
 
    public void test(Map<String, User> map, String string) {
    }
 
    public Map<User, Bean> test() {
        return null;
    }
 
    /**
     * 测试属性类型
     *
     * @throws NoSuchFieldException
     */
    @Test
    public void testFieldType() throws NoSuchFieldException {
        Field field = Client.class.getDeclaredField("objectMap");
        Type gType = field.getGenericType();
        // 打印type与generic type的区别
        System.out.println(field.getType());
        System.out.println(gType);
        System.out.println("**************");
        if (gType instanceof ParameterizedType) {
            ParameterizedType pType = (ParameterizedType) gType;
            Type[] types = pType.getActualTypeArguments();
            for (Type type : types) {
                System.out.println(type.toString());
            }
        }
    }
 
    /**
     * 测试参数类型
     *
     * @throws NoSuchMethodException
     */
    @Test
    public void testParamType() throws NoSuchMethodException {
        Method testMethod = Client.class.getMethod("test", Map.class, String.class);
        Type[] parameterTypes = testMethod.getGenericParameterTypes();
        for (Type type : parameterTypes) {
            System.out.println("type -> " + type);
            if (type instanceof ParameterizedType) {
                Type[] actualTypes = ((ParameterizedType) type).getActualTypeArguments();
                for (Type actualType : actualTypes) {
                    System.out.println("\tactual type -> " + actualType);
                }
            }
        }
    }
 
    /**
     * 测试返回值类型
     *
     * @throws NoSuchMethodException
     */
    @Test
    public void testReturnType() throws NoSuchMethodException {
        Method testMethod = Client.class.getMethod("test");
        Type returnType = testMethod.getGenericReturnType();
        System.out.println("return type -> " + returnType);
 
        if (returnType instanceof ParameterizedType) {
            Type[] actualTypes = ((ParameterizedType) returnType).getActualTypeArguments();
            for (Type actualType : actualTypes) {
                System.out.println("\tactual type -> " + actualType);
            }
        }
    }
}
```

## 使用反射获取注解

> 详情参考博客[Java注解实践](http://blog.csdn.net/zjf280441589/article/details/50444343)。

## 反射在JVM中的实现

> 详情参考[Java反射在JVM的实现](http://www.importnew.com/21211.html)