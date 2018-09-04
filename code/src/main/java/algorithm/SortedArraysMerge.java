package algorithm;

import java.util.Arrays;
import java.util.Comparator;
import java.util.PriorityQueue;
import java.util.Queue;

/**
 * 合并多个有序数组为一个有序数组
 * @author yupaits
 * @date 2018/6/28
 */
public class SortedArraysMerge {

    private static final int[][] SORTED_ARRAYS = {{1, 3, 8}, {2, 6, 7, 10}, {3, 5, 9, 12, 15}, {4, 6, 9}, {3, 8}};

    private static int[] mergeSortedArrays(int[][] arrays) {
        long startTime = System.currentTimeMillis();
        if (arrays == null) {
            return new int[0];
        }
        int totalSize = 0;
        // 由小到大排序
        Queue<Element> queue = new PriorityQueue<>(arrays.length, elementComparator);
        // 初始化，每行第一个元素加入PriorityQueue，顺便统计元素总数
        for (int i = 0; i < arrays.length; i++) {
            if (arrays[i].length > 0) {
                Element element = new Element(i, 0, arrays[i][0]);
                queue.add(element);
                totalSize += arrays[i].length;
            }
        }
        int[] result = new int[totalSize];
        int index = 0;
        while (!queue.isEmpty()) {
            Element element = queue.poll();
            if (element != null) {
                result[index++] = element.val;
                // 当前结点被PriorityQueue抛出之后，当前行的第二个结点加入PriorityQueue
                if (element.col + 1 < arrays[element.row].length) {
                    element.col += 1;
                    element.val = arrays[element.row][element.col];
                    queue.add(element);
                }
            }
        }
        System.out.println("合并耗时：" + (System.currentTimeMillis() - startTime) + "ms");
        return result;
    }

    private static Comparator<Element> elementComparator = Comparator.comparingInt(o -> o.val);

    public static void main(String[] args) {
        System.out.println("多个有序数组：");
        Arrays.stream(SORTED_ARRAYS).forEachOrdered(array -> {
            System.out.println(Arrays.toString(array));
        });
        System.out.println("\n合并之后的有序数组:");
        System.out.println(Arrays.toString(mergeSortedArrays(SORTED_ARRAYS)));
    }

    static class Element {
        private int row;
        private int col;
        private int val;

        public Element(int row, int col, int val) {
            this.row = row;
            this.col = col;
            this.val = val;
        }
    }
}
