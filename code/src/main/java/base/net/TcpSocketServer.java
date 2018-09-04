package base.net;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * @author yupaits
 * @date 2018/7/3
 */
public class TcpSocketServer {
    private int port  = 1122;
    private ServerSocket serverSocket;

    public TcpSocketServer() throws IOException {
        serverSocket = new ServerSocket(port, 3);
        System.out.println("服务端已启动!");
    }

    private void service() {
        while (true) {
            try (Socket socket = serverSocket.accept()) {
                System.out.println("建立新的连接，客户端：" + socket.getInetAddress().getHostAddress() + ":" + socket.getPort());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void main(String[] args) throws IOException, InterruptedException {
        TcpSocketServer server = new TcpSocketServer();
        Thread.sleep(20000);
        server.service();
    }
}
