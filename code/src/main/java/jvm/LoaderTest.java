package jvm;

/**
 * @author yupaits
 * @date 2018/9/29
 */
public class LoaderTest {

    public static void main(String[] args) throws ClassNotFoundException {
        ClassLoader loader = ClassLoaderTest.class.getClassLoader();
        System.out.println(loader);
        //使用ClassLoader.loadClass()来加载类，不会执行初始化块
        loader.loadClass("jvm.Test2");
        //使用Class.forName()来加载类，默认会执行初始化块
        //Class.forName("jvm.Test2");
        //使用Class.forName()来加载类，并指定ClassLoader，初始化时不执行静态块
        //Class.forName("jvm.Test2", false, loader);
    }
}
