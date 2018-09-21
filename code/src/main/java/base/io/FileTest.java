package base.io;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.Arrays;

/**
 * @author yupaits
 * @date 2018/9/21
 */
public class FileTest {

    private static final String FILENAME = "E:\\hello.txt";
    private static final String FILENAME_WITH_SEPARATOR = "E:" + File.separator + "world.txt";
    private static final String DIRECTORY_NAME = "E:" + File.separator + "hello" + File.separator + "world";
    private static final String ROOT_DIRECTORY = "E:" + File.separator;
    private static final String SUCCESS = "成功";
    private static final String FAIL = "失败";

    public static void main(String[] args) {
//        testCreateFile();
//        fileConstants();
//        testCreateFileWithSeparator();
//        testDeleteFile();
//        testCreateDirectory();
//        testList();
//        testListFiles();
//        testIsDirectory();
//        testListAllFiles();
//        testWriteFile();
    }

    private static void testCreateFile() {
        File file = new File(FILENAME);
        try {
            boolean createResult = file.createNewFile();
            System.out.println("创建文件" + FILENAME + (createResult ? SUCCESS : FAIL));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void fileConstants() {
        System.out.println(File.separator);
        System.out.println(File.pathSeparator);
    }

    private static void testCreateFileWithSeparator() {
        File file = new File(FILENAME_WITH_SEPARATOR);
        try {
            boolean createResult = file.createNewFile();
            System.out.println("创建文件" + FILENAME_WITH_SEPARATOR + (createResult ? SUCCESS : FAIL));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void testDeleteFile() {
        File file = new File(FILENAME_WITH_SEPARATOR);
        if (file.exists()) {
            boolean deleteResult = file.delete();
            System.out.println("删除文件" + FILENAME_WITH_SEPARATOR + (deleteResult ? SUCCESS : FAIL));
        } else {
            System.out.println("文件不存在");
        }
    }

    private static void testCreateDirectory() {
        File directory = new File(DIRECTORY_NAME);
        boolean result = directory.mkdirs();
        System.out.println("创建文件夹" + DIRECTORY_NAME + (result ? SUCCESS : FAIL));
    }

    private static void testList() {
        File rootDirectory = new File(ROOT_DIRECTORY);
        String[] files = rootDirectory.list();
        if (files != null) {
            Arrays.stream(files).forEach(System.out::println);
        }
    }

    private static void testListFiles() {
        File rootDirectory = new File(ROOT_DIRECTORY);
        File[] files = rootDirectory.listFiles();
        if (files != null) {
            Arrays.stream(files).forEach(System.out::println);
        }
    }

    private static void testIsDirectory() {
        File directory = new File(DIRECTORY_NAME);
        File file = new File(FILENAME);
        System.out.println(DIRECTORY_NAME + "是文件夹：" + directory.isDirectory());
        System.out.println(FILENAME + "是文件夹：" + file.isDirectory());
    }

    private static void testListAllFiles() {
        File rootDirectory = new File(ROOT_DIRECTORY);
        printFile(rootDirectory);
    }

    private static void printFile(File file) {
        if (file != null) {
            if (file.isDirectory()) {
                File[] subFiles = file.listFiles();
                if (subFiles != null) {
                    Arrays.stream(subFiles).forEach(FileTest::printFile);
                }
            } else {
                System.out.println(file);
            }
        }
    }

    private static void testWriteFile() {
        File file = new File(FILENAME);
        try {
            RandomAccessFile raf = new RandomAccessFile(file, "rw");
            raf.writeBytes("lfdasj;fdalsj");
            raf.writeInt(42342);
            raf.writeBoolean(false);
            raf.writeChar('A');
            raf.writeFloat(45.5f);
            raf.writeDouble(76876.34);
            raf.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
