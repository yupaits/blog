package base.net;

import java.io.*;
import java.net.Socket;

/**
 * @author yupaits
 * @date 2018/7/5
 */
public class TcpMultiThreadSocketClient {

    public static void main(String[] args) {
        Socket socket = null;
        OutputStream outputStream = null;
        PrintWriter writer = null;
        InputStream inputStream = null;
        BufferedReader bufferedReader = null;
        try {
            socket = new Socket("localhost", 11222);
            // 获取输出流，向服务端发送信息
            outputStream = socket.getOutputStream();
            writer = new PrintWriter(outputStream);
            writer.write("用户名：IsMe");
            writer.flush();
            socket.shutdownOutput();
            // 获取输入流，读取服务端的响应信息
            inputStream = socket.getInputStream();
            bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
            String message;
            while ((message = bufferedReader.readLine()) != null) {
                System.out.println("服务端 -> 客户端：" + message);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (bufferedReader != null) {
                    bufferedReader.close();
                }
                if (inputStream != null) {
                    inputStream.close();
                }
                if (writer != null) {
                    writer.close();
                }
                if (outputStream != null) {
                    outputStream.close();
                }
                if (socket != null) {
                    socket.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
