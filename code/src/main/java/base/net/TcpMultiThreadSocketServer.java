package base.net;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * @author yupaits
 * @date 2018/7/3
 */
public class TcpMultiThreadSocketServer {

    static class ServerThread extends Thread {
        private Socket socket;

        public ServerThread(Socket socket) {
            this.socket = socket;
        }

        @Override
        public void run() {
            InputStream inputStream = null;
            InputStreamReader inputStreamReader = null;
            BufferedReader bufferedReader = null;
            OutputStream outputStream = null;
            PrintWriter writer = null;
            try {
                inputStream = socket.getInputStream();
                inputStreamReader = new InputStreamReader(inputStream);
                bufferedReader = new BufferedReader(inputStreamReader);
                String message;
                // 循环读取客户端的信息
                while ((message = bufferedReader.readLine()) != null) {
                    System.out.println("客户端 -> 服务端：" + message);
                }
                socket.shutdownInput();
                // 获取输出流，响应客户端的请求
                outputStream = socket.getOutputStream();
                writer = new PrintWriter(outputStream);
                writer.write("欢迎您！");
                // 调用flush()方法将缓冲输出
                writer.flush();
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                try {
                    if (writer != null) {
                        writer.close();
                    }
                    if (outputStream != null) {
                        outputStream.close();
                    }
                    if (bufferedReader != null) {
                        bufferedReader.close();
                    }
                    if (inputStreamReader != null) {
                        inputStreamReader.close();
                    }
                    if (inputStream != null) {
                        inputStream.close();
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

    public static void main(String[] args) {
        try {
            ServerSocket serverSocket = new ServerSocket(11222);
            Socket socket = null;
            int count = 0;
            System.out.println("服务端启动，等待客户端连接");
            while (true) {
                socket = serverSocket.accept();
                ServerThread serverThread = new ServerThread(socket);
                serverThread.start();
                count++;
                System.out.println("客户端的数量：" + count);
                System.out.println("当前客户端IP：" + socket.getInetAddress().getHostAddress());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
