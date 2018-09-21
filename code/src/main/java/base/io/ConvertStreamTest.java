package base.io;

import java.io.*;

/**
 * @author yupaits
 * @date 2018/9/21
 */
public class ConvertStreamTest {

    private static final String FILENAME = "E:" + File.separator + "hello.txt";

    public static void main(String[] args) {
//        testWriter();
//        testReader();
    }

    private static void testWriter() {
        File file = new File(FILENAME);
        try {
            Writer writer = new OutputStreamWriter(new FileOutputStream(file));
            writer.write("Today is sunday.");
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void testReader() {
        File file = new File(FILENAME);
        try {
            Reader reader = new InputStreamReader(new FileInputStream(file));
            char[] chars = new char[100];
            int length = reader.read(chars);
            reader.close();
            System.out.println("读取长度：" + length);
            System.out.println("读取内容：" + new String(chars));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
