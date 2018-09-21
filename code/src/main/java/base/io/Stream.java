package base.io;

import java.io.*;

/**
 * @author yupaits
 * @date 2018/9/21
 */
public class Stream {

    private static final String FILENAME = "E:" + File.separator + "hello.txt";

    public static void main(String[] args) {
//        testWriteFile();
//        testReadFile();
//        testReadFileUnknownSize();
    }

    private static void testWriteFile() {
        File file = new File(FILENAME);
        try {
            //如果是向文件追加内容，则改为 new FileWriter(file, true)
            Writer writer = new FileWriter(file);
            String txt = "Hello, World!";
            writer.write(txt);
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void testReadFile() {
        File file = new File(FILENAME);
        char[] chars = new char[100];
        try {
            Reader reader = new FileReader(file);
            int length = reader.read(chars);
            reader.close();
            System.out.println("读取长度：" + length);
            System.out.println("读取内容：" + new String(chars));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void testReadFileUnknownSize() {
        File file = new File(FILENAME);
        char[] chars = new char[100];
        try {
            Reader reader = new FileReader(file);
            int count = 0;
            int temp;
            while ((temp = reader.read()) != -1) {
                chars[count++] = (char) temp;
            }
            reader.close();
            System.out.println("读取内容：" + new String(chars));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
