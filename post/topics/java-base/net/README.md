# TCP编程

> 引用自[JAVA 通过 Socket 实现 TCP 编程](https://blog.csdn.net/qq_23473123/article/details/51461894)

## TCP简介

TCP（Transmission Control Protocol传输控制协议）是一种面向 **连接的、可靠的、基于字节流** 的传输层通信协议，由IETF的RFC 793定义。在简化的计算机网络OSI模型中，它完成第四层 **传输层** 所指定的功能，用户数据报协议（UDP）是同一层内另一个重要的传输协议。在因特网协议族（Internet protocol suite）中，TCP层是位于IP层之上、应用层之下的中间层。不同主机的应用层之间经常需要可靠的、像管道一样的连接，但是IP层不提供这样的流机制，而是提供不可靠的包交换。

应用层向TCP层发送用于网间传输的、用8位字节表示的数据流，然后TCP把数据流分成适当长度的报文段（通常受该计算机连接的网络的数据链路层的最大传输单元（MTU）的限制）。之后TCP把结果包传给IP层，由它来通过网络将包传送给接收端实体的TCP层。TCP为了保证不发生丢包，就给每个包一个序号，同时序号也保证了传送到接收端实体的包的按序接收。然后接收端实体对已成功收到的包发回一个相应的确认（ACK）；如果发送端实体在合理的往返时延（RTT）内未收到确认，那么对应的数据包就被假设为已丢失，将会被进行重传。TCP用一个校验和函数来检验数据是否有错误；在发送和接收时都要计算校验和。

## Java Socket简介

socket通常也称作"套接字"，用于描述IP地址和端口，是一个通信链的句柄。应用程序通常 **通过"套接字"向网络发出请求或者应答网络请求**。

Socket和ServerSocket类库位于`java.net`包中。**ServerSocket用于服务器端，Socket是建立网络连接时使用的**。在连接成功时，应用程序两端都会产生一个Socket实例，操作这个实例，完成所需的会话。对于一个网络连接来说，套接字是平等的，并没有差别，不因为在服务器端或在客户端而产生不同级别。不管是Socket还是ServerSocket，它们的工作都是通过 **SocketImpl类机器子类完成的**。

- 简单示例：

**服务端**

```Java
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
```

**客户端**

```Java
public class TcpSocketClient {

    public static void main(String[] args) throws IOException, InterruptedException {
        final int length = 100;
        String host = "localhost";
        int port = 1122;
        Socket[] sockets = new Socket[length];
        for (int i = 0; i < length; i++) {
            sockets[i] = new Socket(host, port);
            System.out.println("第" + (i + 1) + "次连接成功");
        }
        Thread.sleep(3000);
        for (int i = 0; i < length; i++) {
            sockets[i].close();
        }
    }
}
```

结果：

```
服务端已启动!
建立新的连接，客户端：127.0.0.1:65463
建立新的连接，客户端：127.0.0.1:65464
建立新的连接，客户端：127.0.0.1:65465
```

```
第1次连接成功
第2次连接成功
第3次连接成功
Exception in thread "main" java.net.ConnectException: Connection refused: connect
```

- 多线程示例：

**服务端**

```Java
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
```

**客户端**

```Java
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
```

结果：

```
服务端启动，等待客户端连接
客户端的数量：1
当前客户端IP：127.0.0.1
客户端 -> 服务端：用户名：IsMe
客户端的数量：2
当前客户端IP：127.0.0.1
客户端 -> 服务端：用户名：IsMe
客户端的数量：3
当前客户端IP：127.0.0.1
客户端 -> 服务端：用户名：IsMe
```

```
服务端 -> 客户端：欢迎您！
```