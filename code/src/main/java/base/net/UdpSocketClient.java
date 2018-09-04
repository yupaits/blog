package base.net;

import java.io.IOException;
import java.net.*;

/**
 * @author yupaits
 * @date 2018/7/5
 */
public class UdpSocketClient {

    public static void main(String[] args) throws IOException {
        // 向服务端发送数据
        InetAddress address = InetAddress.getByName("localhost");
        int port = 2233;
        byte[] sendData = "用户名：IsMe".getBytes();
        DatagramPacket sendPacket = new DatagramPacket(sendData, sendData.length, address, port);
        DatagramSocket socket = new DatagramSocket();
        socket.send(sendPacket);
        // 接收服务端响应的数据
        byte[] receiveData = new byte[1024];
        DatagramPacket receivePacket = new DatagramPacket(receiveData, receiveData.length);
        socket.receive(receivePacket);
        String info = new String(receiveData, 0, receivePacket.getLength());
        System.out.println("服务端 -> 客户端：" + info);
        socket.close();
    }
}
