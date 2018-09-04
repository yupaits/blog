package base.net;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

/**
 * @author yupaits
 * @date 2018/7/5
 */
public class UdpSocketServer {

    public static void main(String[] args) throws IOException {
        DatagramSocket socket = new DatagramSocket(2233);
        byte[] receiveData = new byte[1024];
        DatagramPacket receivePacket = new DatagramPacket(receiveData, receiveData.length);
        System.out.println("服务端已启用，等待客户端发送数据");
        // 接收客户端发送的数据
        socket.receive(receivePacket);
        String info = new String(receiveData, 0, receivePacket.getLength());
        System.out.println("客户端 -> 服务端：" + info);
        // 向客户端响应数据
        InetAddress address = receivePacket.getAddress();
        int port = receivePacket.getPort();
        byte[] sendData = "欢迎您！".getBytes();
        DatagramPacket sendPacket = new DatagramPacket(sendData, sendData.length, address, port);
        socket.send(sendPacket);
        socket.close();
    }
}
