package base.io;

import java.io.*;

/**
 * @author yupaits
 * @date 2018/9/21
 */
public class ByteStreamTest {

    private static final String FILENAME = "E:" + File.separator + "hello.txt";

    public static void main(String[] args) {
//        testWriteFile();
//        testWriteFileWithByte();
//        testReadFile();
//        testReadFileUnknownSize();
    }

    private static void testWriteFile() {
        File file = new File(FILENAME);
        try {
            //默认覆盖原内容，不向文件中追加新内容
            OutputStream os = new FileOutputStream(file);
            String txt = "你好，世界！";
            byte[] bytes = txt.getBytes();
            os.write(bytes);
            os.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void testWriteFileWithByte() {
        File file = new File(FILENAME);
        try {
            //向文件中追加内容
            OutputStream os = new FileOutputStream(file, true);
            String txt = "你好，世界！";
            byte[] bytes = txt.getBytes();
            for (byte b : bytes) {
                os.write(b);
            }
            os.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void testReadFile() {
        File file = new File(FILENAME);
        try {
            InputStream is = new FileInputStream(file);
            byte[] bytes = new byte[1024];
            int length = is.read(bytes);
            is.close();
            System.out.println("读取长度：" + length);
            System.out.println("读取内容：" + new String(bytes));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void testReadFileUnknownSize() {
        File file = new File(FILENAME);
        try {
            InputStream is = new FileInputStream(file);
            //注意byte数组的初始大小，如果读取的数据大小超出时会报错
            byte[] bytes = new byte[1024];
            int count = 0;
            int temp;
            //只有当读到文件末尾的时候会返回-1
            while((temp = is.read()) != -1) {
                bytes[count++] = (byte) temp;
            }
            is.close();
            System.out.println(new String(bytes));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
