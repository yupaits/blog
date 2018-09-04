package advanced;

/**
 * @author yupaits
 * @date 2018/6/28
 */
public class TryCatchFinallySample {

    private static int testFinallyReturn() {
        int i = 1;
        try {
            return i;
        } catch (Exception e) {
            return i;
        } finally {
            return 2;
        }
    }

    private static Page testReferenceReturn() {
        Page page = new Page(1, 10);
        try {
            // 返回的过程：先给返回值赋值，然后调用finally代码块，最后才是返回到try中的return语句
            return page;
        } catch (Exception e) {
            return page;
        } finally {
            // 修改引用类型变量指向对象的值
            page.setCurrent(2);
            page.setSize(20);
        }
    }

    private static Page testReferenceNewReturn() {
        Page page = new Page(1, 10);
        try {
            // return的返回值暂存区存的是引用类型
            return page;
        } catch (Exception e) {
            return page;
        } finally {
            // 使用new之后page指向了新的Page对象，并未改变暂存区的引用类型变量的指向，引用类型变量的定义类似于指针
            page = new Page(2, 20);
        }
    }

    private static int testCatchReturn() {
        int i = 1;
        try {
            throw new RuntimeException("oh no!");
        } catch (Exception e) {
            return i;
        } finally {
            return 2;
        }
    }

    private static int testValueReturn() {
        int i = 1;
        try {
            return i;
        } catch (Exception e) {
            return i;
        } finally {
            // 值传递，在finally里修改返回值也不会改变实际的返回值
            i = 2;
        }
    }


    static class Page {
        private int current;
        private int size;

        public Page(int current, int size) {
            this.current = current;
            this.size = size;
        }

        public int getCurrent() {
            return current;
        }

        public void setCurrent(int current) {
            this.current = current;
        }

        public int getSize() {
            return size;
        }

        public void setSize(int size) {
            this.size = size;
        }

        @Override
        public String toString() {
            return "Page{" +
                    "current=" + current +
                    ", size=" + size +
                    '}';
        }
    }

    /**
     * 测试结论：finally中存在控制转移语句（return、break、continue）时会优先于try、catch中的控制转移语句。
     * 原因是finally块中的代码会插入到try或者catch的return语句之前。
     */
    public static void main(String[] args) {
        System.out.println("值传递时的原返回值：1，引用传递时的原返回值：Page{current=1, size=10}");
        System.out.println("测试finally中包含return语句：" + testFinallyReturn());
        System.out.println("值传递时，finally修改返回值：" + testValueReturn());
        System.out.println("引用传递时，finally修改返回值：" + testReferenceReturn());
        System.out.println("引用传递时，finally返回new的引用对象：" + testReferenceNewReturn());
        System.out.println("测试catch块进行return：" + testCatchReturn());
    }
}
