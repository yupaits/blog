package base;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * @author yupaits
 * @date 2018/10/12
 */
public class LinkedHashMapSample {

    private static final int CAPACITY = 16;
    private static final float FACTOR = 0.75f;

    private static void testLinkedHashMap() {
        Map<String, String> map = new LinkedHashMap<>(CAPACITY, FACTOR, true);
        map.put("111", "111");
        map.put("222", "222");
        map.put("333", "333");
        map.put("444", "444");
        printMap(map);

        map.get("111");
        printMap(map);

        map.put("222", "2222");
        printMap(map);
    }

    private static void printMap(Map<String, String> map) {
        map.forEach((key, value) -> {
            System.out.print(key + "=" + value + "\t");
        });
        System.out.println();
    }

    public static void main(String[] args) {
        testLinkedHashMap();
    }
}
