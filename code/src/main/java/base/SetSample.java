package base;

import java.util.*;

/**
 * @author yupaits
 * @date 2018/6/28
 */
public class SetSample {
    private static List<String> stringList = Arrays.asList("222", "111", "111", null);

    private static void testHashSet() {
        System.out.println("\nHashSet测试：");
        Set<String> strings = new HashSet<>(new ArrayList<>(stringList));
        System.out.println(strings.add(null));
        System.out.println(Arrays.toString(strings.toArray()));
    }

    private static void testLinkedHashSet() {
        System.out.println("\nLinkedHashSet测试：");
        Set<String> strings = new LinkedHashSet<>(new ArrayList<>(stringList));
        System.out.println(strings.add("000"));
        System.out.println(Arrays.toString(strings.toArray()));
    }

    private static void testEnumSet() {
        System.out.println("\nEnumSet测试：");
        Set<Color> signals = EnumSet.of(Color.YELLOW, Color.RED);
        System.out.println(Arrays.toString(signals.toArray()));
    }

    enum Color {
        RED, GREEN, YELLOW;
    }

    public static void main(String[] args) {
        System.out.println("原始集合：" + Arrays.toString(stringList.toArray()));
        testHashSet();
        testLinkedHashSet();
        testEnumSet();
    }
}
