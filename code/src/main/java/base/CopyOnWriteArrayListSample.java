package base;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Vector;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * @author yupaits
 * @date 2018/10/12
 */
public class CopyOnWriteArrayListSample {

    private static final int LIST_SIZE = 100;

    private static class T1 extends Thread {
        private List<Integer> list;

        public T1(List<Integer> list) {
            this.list = list;
        }

        @Override
        public void run() {
            for (Integer i : list) {
                System.out.println(i);
            }
        }
    }

    private static class T2 extends Thread {
        private List<Integer> list;

        public T2(List<Integer> list) {
            this.list = list;
        }

        @Override
        public void run() {
            Iterator<Integer> iterator = list.iterator();
            while (iterator.hasNext()) {
                Integer i = iterator.next();
                iterator.remove();
            }
        }
    }

    private static class T3 extends Thread {
        private List<Integer> list;

        public T3(List<Integer> list) {
            this.list = list;
        }

        @Override
        public void run() {
            for (Integer i : list) {
                list.remove(i);
            }
        }
    }

    public static void main(String[] args) {
        List<Integer> list1 = new ArrayList<>(LIST_SIZE);
        List<Integer> list2 = new Vector<>(LIST_SIZE);
        List<Integer> list3 = new CopyOnWriteArrayList<>();
        for (int i = 0; i < LIST_SIZE; i++) {
            list1.add(i);
            list2.add(i);
            list3.add(i);
        }

        T1 t11 = new T1(list1);
        T2 t12 = new T2(list1);
        t11.start();
        t12.start();

        T1 t21 = new T1(list2);
        T2 t22 = new T2(list2);
        t21.start();
        t22.start();

        T1 t31 = new T1(list3);
        T3 t32 = new T3(list3);
        t31.start();
        t32.start();
    }
}