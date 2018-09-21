package base.io;

import java.io.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * @author yupaits
 * @date 2018/9/21
 */
public class ZipStreamTest {

    private static final String FILENAME = "E:" + File.separator + "testzip";
    private static final String ZIP_FILENAME = "E:" + File.separator + "testzip.zip";

    public static void main(String[] args) {
//        testZipFile();
    }

    private static void testZipFile() {
        File file = new File(FILENAME);
        File zipFile = new File(ZIP_FILENAME);
        try {
            InputStream is = new FileInputStream(file);
            ZipOutputStream zipOs = new ZipOutputStream(new FileOutputStream(zipFile));
            zipOs.putNextEntry(new ZipEntry(file.getName()));
            zipOs.setComment("Test ZIP");
            int temp;
            while ((temp = is.read()) != -1) {
                zipOs.write(temp);
            }
            is.close();
            zipOs.close();
            System.out.println("原始文件大小：" + file.length());
            System.out.println("压缩文件大小：" + zipFile.length());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
