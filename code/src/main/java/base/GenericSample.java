package base;

import java.util.ArrayList;
import java.util.List;

/**
 * @author yupaits
 * @date 2018/7/3
 */
public class GenericSample {

    private static void genericTest() {
        List list = new ArrayList();
        list.add("aaa");
        list.add(100);
        for (int i = 0; i < list.size(); i++) {
            String item = (String) list.get(i);
            System.out.println(item);
        }
    }

    private static void genericClassTest() {
        List<String> stringList = new ArrayList<>();
        stringList.add("aaa");
        stringList.add("bbb");
        List<Integer> integerList = new ArrayList<>();
        integerList.add(111);
        integerList.add(222);
        Class stringClass = stringList.getClass();
        Class integerClass = integerList.getClass();
        if (stringClass.equals(integerClass)) {
            System.out.println("类型相同，类型为：" + stringClass.getName());
        }
    }

    public static void main(String[] args) {
//        genericTest();
        genericClassTest();
    }
}
