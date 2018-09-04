package base;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * @author yupaits
 * @date 2018/6/26
 */
public class ListSample {
    private static final int SIZE = 500000;

    private static void linkedListTimeTest(List<Integer> list) {
        System.out.println("LinkedList测试：");
        listLoop(list);
    }

    private static void arrayListTimeTest(List<Integer> list) {
        System.out.println("ArrayList测试：");
        listLoop(list);
    }

    private static void listLoop(List<Integer> list) {
        long startTime = System.currentTimeMillis();
        for (int i = 0; i < list.size(); i++) {
            list.get(i);
        }
        System.out.println("普通for循环耗时：" + (System.currentTimeMillis() - startTime) + "ms");
        startTime = System.currentTimeMillis();
        for (Integer i : list) {
        }
        System.out.println("forEach循环耗时：" + (System.currentTimeMillis() - startTime) + "ms");
        startTime = System.currentTimeMillis();
        list.forEach(integer -> {});
        System.out.println("lambda表达式forEach循环耗时：" + (System.currentTimeMillis() - startTime) + "ms");
    }

    public static void main(String[] args) {
        // List遍历效率对比
        List<Integer> arrayList = new ArrayList<>(SIZE);
        List<Integer> linkedList = new LinkedList<>();
        for (int i = 0; i < SIZE; i++) {
            arrayList.add(i);
            linkedList.add(i);
        }
        arrayListTimeTest(arrayList);
        linkedListTimeTest(linkedList);
    }
}
