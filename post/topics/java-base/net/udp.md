# UDP编程

> 引用自[JAVA Socket 实现 UDP 编程](https://blog.csdn.net/qq_23473123/article/details/51464272)

## UDP简介

UDP是User Datagram Protocal的简称，中文名是用户数据报协议，是OSI（Open System Interconnection，开方式系统互联）参考模型中一种**无连接**的传输层协议，提供面向事务的**简单不可靠**信息传送服务，IETF RFC 768是UDP的正式规范。UDP在IP报文的协议号是17。

UDP有 **不提供数据包分组、组装** 和 **不能对数据博爱进行排序** 的缺点，也就是说，当报文发送之后，**是无法得知其是否安全完整到达的**。UDP用来支持那些需要在计算机之间传输数据的网络应用。包括网络视频会议系统在内的众多C/S模式的网络应用都需要使用UDP协议。UDP协议从问世至今已经被使用了很多年，虽然其最初的光彩已经被一些类似协议所掩盖，但是即使在今天UDP仍然不失为一种非常实用和可行的网络传输层协议。

与所熟知的TCP（传输控制协议）一样，UDP直接位于IP（网际协议）的顶层。根据OSI参考模型，UDP和TCP都属于传输层协议。**UDP协议的主要作用是将网络数据流量压缩成数据包的形式**。一个典型的数据包就是一个二进制数据的传输单位。每一个数据包的前8个字节用来包含头信息，剩余字节则用来包含具体的传输数据。

## UDP和TCP的优缺点

||TCP|UDP|
|---|---|---|
|优点|**可靠、稳定**：<br>TCP的可靠体现在TCP在传递数据之前，会有三次握手来建立连接，而且在数据传递时，有确认、窗口、重传、拥塞控制机制，在数据传完后，还会断开连接用来节约系统资源。|**快、比TCP稍安全**：<br>UDP没有TCP的握手、确认、窗口、重传、拥塞控制等机制，UDP是一个无状态的传输协议，所以它在传递数据时非常快。没有TCP的这些机制，UDP较TCP被攻击者利用的漏洞就要少一些。但UDP也是无法避免攻击的，比如UDP Flood攻击。|
|缺点|**慢、效率低、占用系统资源高、易被攻击**：<br>TCP在传递数据之前，要先建连接，这会消耗时间，而且在数据传递时，确认机制、重传机制、拥塞机制等都会消耗大量的实践，而且要在每台设备上维护所有的传输连接，事实上，每个连接都会占用系统的CPU、内存等硬件资源。而且，因为TCP有确认机制、三次握手机制，这些也导致TCP容易被人利用，实现DOS、DDOS、CC等攻击。|**不可靠、不稳定**：<br>因为UDP没有TCP那些保证可靠性的机制，在数据传递时，如果网络质量不好，很容易就会丢包。|

- 什么时候应该实用TCP？

    当对网络通讯质量有要求的时候，比如：整个数据要准确无误地传递给对方，这往往用于一些要求可靠的应用，比如HTTP、HTTPS、FTP等传输文件的协议，POP、SMTP等邮件传输的协议。

    日常生活中，常见的使用TCP协议的应用有：浏览器，用的HTTP；FlashFXP，用的FTP；Outlook，用的POP、SMTP；Putty，用的Telnet、SSH；QQ文件传输。

- 什么时候应该使用UDP？

    当对网络通讯质量要求不高，要求网络通讯速度能尽量快，这时就可以使用UDP。

    日常生活中，常见使用UDP协议的应用有：QQ语音、QQ视频、TFTP等。

- 简单示例：

**服务端**

```Java
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
```

**客户端**

```Java
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
```

结果：

```
服务端已启用，等待客户端发送数据
客户端 -> 服务端：用户名：IsMe
```

```
服务端 -> 客户端：欢迎您！
```