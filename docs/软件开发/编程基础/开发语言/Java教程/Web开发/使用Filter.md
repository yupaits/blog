# 使用Filter

在一个比较复杂的Web应用程序中，通常都有很多URL映射，对应的，也会有多个Servlet来处理URL。

我们考察这样一个论坛应用程序：
```java

            ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
               /             ┌──────────────┐
            │ ┌─────────────>│ IndexServlet │ │
              │              └──────────────┘
            │ │/signin       ┌──────────────┐ │
              ├─────────────>│SignInServlet │
            │ │              └──────────────┘ │
              │/signout      ┌──────────────┐
┌───────┐   │ ├─────────────>│SignOutServlet│ │
│Browser├─────┤              └──────────────┘
└───────┘   │ │/user/profile ┌──────────────┐ │
              ├─────────────>│ProfileServlet│
            │ │              └──────────────┘ │
              │/user/post    ┌──────────────┐
            │ ├─────────────>│ PostServlet  │ │
              │              └──────────────┘
            │ │/user/reply   ┌──────────────┐ │
              └─────────────>│ ReplyServlet │
            │                └──────────────┘ │
             ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
```
各个Servlet设计功能如下：

- IndexServlet：浏览帖子；
- SignInServlet：登录；
- SignOutServlet：登出；
- ProfileServlet：修改用户资料；
- PostServlet：发帖；
- ReplyServlet：回复。

其中，ProfileServlet、PostServlet和ReplyServlet都需要用户登录后才能操作，否则，应当直接跳转到登录页面。

我们可以直接把判断登录的逻辑写到这3个Servlet中，但是，同样的逻辑重复3次没有必要，并且，如果后续继续加Servlet并且也需要验证登录时，还需要继续重复这个检查逻辑。

为了把一些公用逻辑从各个Servlet中抽离出来，JavaEE的Servlet规范还提供了一种Filter组件，即过滤器，它的作用是，在HTTP请求到达Servlet之前，可以被一个或多个Filter预处理，类似打印日志、登录检查等逻辑，完全可以放到Filter中。

例如，我们编写一个最简单的EncodingFilter，它强制把输入和输出的编码设置为UTF-8：
```java
@WebFilter(urlPatterns = "/*")
public class EncodingFilter implements Filter {
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        System.out.println("EncodingFilter:doFilter");
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        chain.doFilter(request, response);
    }
}
```
编写Filter时，必须实现`Filter`接口，在`doFilter()`方法内部，要继续处理请求，必须调用`chain.doFilter()`。最后，用`@WebFilter`注解标注该Filter需要过滤的URL。这里的`/*`表示所有路径。

添加了Filter之后，整个请求的处理架构如下：
```java

            ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
                                   /             ┌──────────────┐
            │                     ┌─────────────>│ IndexServlet │ │
                                  │              └──────────────┘
            │                     │/signin       ┌──────────────┐ │
                                  ├─────────────>│SignInServlet │
            │                     │              └──────────────┘ │
                                  │/signout      ┌──────────────┐
┌───────┐   │   ┌──────────────┐  ├─────────────>│SignOutServlet│ │
│Browser│──────>│EncodingFilter├──┤              └──────────────┘
└───────┘   │   └──────────────┘  │/user/profile ┌──────────────┐ │
                                  ├─────────────>│ProfileServlet│
            │                     │              └──────────────┘ │
                                  │/user/post    ┌──────────────┐
            │                     ├─────────────>│ PostServlet  │ │
                                  │              └──────────────┘
            │                     │/user/reply   ┌──────────────┐ │
                                  └─────────────>│ ReplyServlet │
            │                                    └──────────────┘ │
             ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
```
还可以继续添加其他Filter，例如LogFilter：
```java
@WebFilter("/*")
public class LogFilter implements Filter {
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        System.out.println("LogFilter: process " + ((HttpServletRequest) request).getRequestURI());
        chain.doFilter(request, response);
    }
}
```
多个Filter会组成一个链，每个请求都被链上的Filter依次处理：
```java

                                        ┌────────┐
                                     ┌─>│ServletA│
                                     │  └────────┘
    ┌──────────────┐    ┌─────────┐  │  ┌────────┐
───>│EncodingFilter│───>│LogFilter│──┼─>│ServletB│
    └──────────────┘    └─────────┘  │  └────────┘
                                     │  ┌────────┐
                                     └─>│ServletC│
                                        └────────┘
```
有些细心的童鞋会问，有多个Filter的时候，Filter的顺序如何指定？多个Filter按不同顺序处理会造成处理结果不同吗？

答案是Filter的顺序确实对处理的结果有影响。但遗憾的是，Servlet规范并没有对`@WebFilter`注解标注的Filter规定顺序。如果一定要给每个Filter指定顺序，就必须在`web.xml`文件中对这些Filter再配置一遍。

注意到上述两个Filter的过滤路径都是`/*`，即它们会对所有请求进行过滤。也可以编写只对特定路径进行过滤的Filter，例如`AuthFilter`：
```java
@WebFilter("/user/*")
public class AuthFilter implements Filter {
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        System.out.println("AuthFilter: check authentication");
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;
        if (req.getSession().getAttribute("user") == null) {
            // 未登录，自动跳转到登录页:
            System.out.println("AuthFilter: not signin!");
            resp.sendRedirect("/signin");
        } else {
            // 已登录，继续处理:
            chain.doFilter(request, response);
        }
    }
}
```
注意到`AuthFilter`只过滤以`/user/`开头的路径，因此：

- 如果一个请求路径类似`/user/profile`，那么它会被上述3个Filter依次处理；
- 如果一个请求路径类似`/test`，那么它会被上述2个Filter依次处理（不会被AuthFilter处理）。

再注意观察`AuthFilter`，当用户没有登录时，在`AuthFilter`内部，直接调用`resp.sendRedirect()`发送重定向，且没有调用`chain.doFilter()`，因此，当用户没有登录时，请求到达`AuthFilter`后，不再继续处理，即后续的Filter和任何Servlet都没有机会处理该请求了。

可见，Filter可以有针对性地拦截或者放行HTTP请求。

如果一个Filter在当前请求中生效，但什么都没有做：
```java
@WebFilter("/*")
public class MyFilter implements Filter {
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        // TODO
    }
}
```
那么，用户将看到一个空白页，因为请求没有继续处理，默认响应是200+空白输出。

 如果Filter要使请求继续被处理，就一定要调用chain.doFilter()！

如果我们使用上一节介绍的MVC模式，即一个统一的`DispatcherServlet`入口，加上多个Controller，这种模式下Filter仍然是正常工作的。例如，一个处理`/user/*`的Filter实际上作用于那些处理`/user/`开头的Controller方法之前。

### 小结

Filter是一种对HTTP请求进行预处理的组件，它可以构成一个处理链，使得公共处理代码能集中到一起；

Filter适用于日志、登录检查、全局设置等；

设计合理的URL映射可以让Filter链更清晰。

## 修改请求

Filter可以对请求进行预处理，因此，我们可以把很多公共预处理逻辑放到Filter中完成。

考察这样一种需求：我们在Web应用中经常需要处理用户上传文件，例如，一个UploadServlet可以简单地编写如下：
```java
@WebServlet(urlPatterns = "/upload/file")
public class UploadServlet extends HttpServlet {
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // 读取Request Body:
        InputStream input = req.getInputStream();
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        for (;;) {
            int len = input.read(buffer);
            if (len == -1) {
                break;
            }
            output.write(buffer, 0, len);
        }
        // TODO: 写入文件:
        // 显示上传结果:
        String uploadedText = output.toString(StandardCharsets.UTF_8);
        PrintWriter pw = resp.getWriter();
        pw.write("<h1>Uploaded:</h1>");
        pw.write("<pre><code>");
        pw.write(uploadedText);
        pw.write("</code></pre>");
        pw.flush();
    }
}
```
但是要保证文件上传的完整性怎么办？在[哈希算法](https://www.liaoxuefeng.com/wiki/1252599548343744/1304227729113121)一节中，我们知道，如果在上传文件的同时，把文件的哈希也传过来，服务器端做一个验证，就可以确保用户上传的文件一定是完整的。

这个验证逻辑非常适合写在`ValidateUploadFilter`中，因为它可以复用。

我们先写一个简单的版本，快速实现`ValidateUploadFilter`的逻辑：
```java
@WebFilter("/upload/*")
public class ValidateUploadFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;
        // 获取客户端传入的签名方法和签名:
        String digest = req.getHeader("Signature-Method");
        String signature = req.getHeader("Signature");
        if (digest == null || digest.isEmpty() || signature == null || signature.isEmpty()) {
            sendErrorPage(resp, "Missing signature.");
            return;
        }
        // 读取Request的Body并验证签名:
        MessageDigest md = getMessageDigest(digest);
        InputStream input = new DigestInputStream(request.getInputStream(), md);
        byte[] buffer = new byte[1024];
        for (;;) {
            int len = input.read(buffer);
            if (len == -1) {
                break;
            }
        }
        String actual = toHexString(md.digest());
        if (!signature.equals(actual)) {
            sendErrorPage(resp, "Invalid signature.");
            return;
        }
        // 验证成功后继续处理:
        chain.doFilter(request, response);
    }

    // 将byte[]转换为hex string:
    private String toHexString(byte[] digest) {
        StringBuilder sb = new StringBuilder();
        for (byte b : digest) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    // 根据名称创建MessageDigest:
    private MessageDigest getMessageDigest(String name) throws ServletException {
        try {
            return MessageDigest.getInstance(name);
        } catch (NoSuchAlgorithmException e) {
            throw new ServletException(e);
        }
    }

    // 发送一个错误响应:
    private void sendErrorPage(HttpServletResponse resp, String errorMessage) throws IOException {
        resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        PrintWriter pw = resp.getWriter();
        pw.write("<html><body><h1>");
        pw.write(errorMessage);
        pw.write("</h1></body></html>");
        pw.flush();
    }
}
```
这个`ValidateUploadFilter`的逻辑似乎没有问题，我们可以用curl命令测试：
```bash
$ curl http://localhost:8080/upload/file -v -d 'test-data' \
  -H 'Signature-Method: SHA-1' \
  -H 'Signature: 7115e9890f5b5cc6914bdfa3b7c011db1cdafedb' \
  -H 'Content-Type: application/octet-stream'
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 8080 (#0)
> POST /upload/file HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.64.1
> Accept: */*
> Signature-Method: SHA-1
> Signature: 7115e9890f5b5cc6914bdfa3b7c011db1cdafedb
> Content-Type: application/octet-stream
> Content-Length: 9
> 
* upload completely sent off: 9 out of 9 bytes
< HTTP/1.1 200 
< Transfer-Encoding: chunked
< Date: Thu, 30 Jan 2020 13:56:39 GMT
< 
* Connection #0 to host localhost left intact
<h1>Uploaded:</h1><pre><code></code></pre>
* Closing connection 0
```
`ValidateUploadFilter`对签名进行验证的逻辑是没有问题的，但是，细心的童鞋注意到，`UploadServlet`并未读取到任何数据！

这里的原因是对`HttpServletRequest`进行读取时，只能读取一次。如果Filter调用`getInputStream()`读取了一次数据，后续Servlet处理时，再次读取，将无法读到任何数据。怎么办？

这个时候，我们需要一个“伪造”的`HttpServletRequest`，具体做法是使用[代理模式](https://www.liaoxuefeng.com/wiki/1252599548343744/1281319432618017)，对`getInputStream()`和`getReader()`返回一个新的流：
```java
class ReReadableHttpServletRequest extends HttpServletRequestWrapper {
    private byte[] body;
    private boolean open = false;

    public ReReadableHttpServletRequest(HttpServletRequest request, byte[] body) {
        super(request);
        this.body = body;
    }

    // 返回InputStream:
    public ServletInputStream getInputStream() throws IOException {
        if (open) {
            throw new IllegalStateException("Cannot re-open input stream!");
        }
        open = true;
        return new ServletInputStream() {
            private int offset = 0;

            public boolean isFinished() {
                return offset >= body.length;
            }

            public boolean isReady() {
                return true;
            }

            public void setReadListener(ReadListener listener) {
            }

            public int read() throws IOException {
                if (offset >= body.length) {
                    return -1;
                }
                int n = body[offset] & 0xff;
                offset++;
                return n;
            }
        };
    }

    // 返回Reader:
    public BufferedReader getReader() throws IOException {
        if (open) {
            throw new IllegalStateException("Cannot re-open reader!");
        }
        open = true;
        return new BufferedReader(new InputStreamReader(new ByteArrayInputStream(body), "UTF-8"));
    }
}
```
注意观察`ReReadableHttpServletRequest`的构造方法，它保存了`ValidateUploadFilter`读取的`byte[]`内容，并在调用`getInputStream()`时通过`byte[]`构造了一个新的`ServletInputStream`。

然后，我们在`ValidateUploadFilter`中，把`doFilter()`调用时传给下一个处理者的`HttpServletRequest`替换为我们自己“伪造”的`ReReadableHttpServletRequest`：
```java
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {
    ...
    chain.doFilter(new ReReadableHttpServletRequest(req, output.toByteArray()), response);
}
```
再注意到我们编写`ReReadableHttpServletRequest`时，是从`HttpServletRequestWrapper`继承，而不是直接实现`HttpServletRequest`接口。这是因为，Servlet的每个新版本都会对接口增加一些新方法，从`HttpServletRequestWrapper`继承可以确保新方法被正确地覆写了，因为`HttpServletRequestWrapper`是由Servlet的jar包提供的，目的就是为了让我们方便地实现对`HttpServletRequest`接口的代理。

我们总结一下对`HttpServletRequest`接口进行代理的步骤：

1. 从`HttpServletRequestWrapper`继承一个`XxxHttpServletRequest`，需要传入原始的`HttpServletRequest`实例；
2. 覆写某些方法，使得新的`XxxHttpServletRequest`实例看上去“改变”了原始的`HttpServletRequest`实例；
3. 在`doFilter()`中传入新的`XxxHttpServletRequest`实例。

虽然整个Filter的代码比较复杂，但它的好处在于：这个Filter在整个处理链中实现了灵活的“可插拔”特性，即是否启用对Web应用程序的其他组件（Filter、Servlet）完全没有影响。

### 小结

借助`HttpServletRequestWrapper`，我们可以在Filter中实现对原始`HttpServletRequest`的修改。

## 修改响应

既然我们能通过Filter修改`HttpServletRequest`，自然也能修改`HttpServletResponse`，因为这两者都是接口。

我们来看一下在什么情况下我们需要修改`HttpServletResponse`。

假设我们编写了一个Servlet，但由于业务逻辑比较复杂，处理该请求需要耗费很长的时间：
```java
@WebServlet(urlPatterns = "/slow/hello")
public class HelloServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html");
        // 模拟耗时1秒:
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
        }
        PrintWriter pw = resp.getWriter();
        pw.write("<h1>Hello, world!</h1>");
        pw.flush();
    }
}
```
好消息是每次返回的响应内容是固定的，因此，如果我们能使用缓存将结果缓存起来，就可以大大提高Web应用程序的运行效率。

缓存逻辑最好不要在Servlet内部实现，因为我们希望能复用缓存逻辑，所以，编写一个`CacheFilter`最合适：
```java
@WebFilter("/slow/*")
public class CacheFilter implements Filter {
    // Path到byte[]的缓存:
    private Map<String, byte[]> cache = new ConcurrentHashMap<>();

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;
        // 获取Path:
        String url = req.getRequestURI();
        // 获取缓存内容:
        byte[] data = this.cache.get(url);
        resp.setHeader("X-Cache-Hit", data == null ? "No" : "Yes");
        if (data == null) {
            // 缓存未找到,构造一个伪造的Response:
            CachedHttpServletResponse wrapper = new CachedHttpServletResponse(resp);
            // 让下游组件写入数据到伪造的Response:
            chain.doFilter(request, wrapper);
            // 从伪造的Response中读取写入的内容并放入缓存:
            data = wrapper.getContent();
            cache.put(url, data);
        }
        // 写入到原始的Response:
        ServletOutputStream output = resp.getOutputStream();
        output.write(data);
        output.flush();
    }
}
```
实现缓存的关键在于，调用`doFilter()`时，我们不能传入原始的`HttpServletResponse`，因为这样就会写入Socket，我们也就无法获取下游组件写入的内容。如果我们传入的是“伪造”的`HttpServletResponse`，让下游组件写入到我们预设的`ByteArrayOutputStream`，我们就“截获”了下游组件写入的内容，于是，就可以把内容缓存起来，再通过原始的`HttpServletResponse`实例写入到网络。

这个`CachedHttpServletResponse`实现如下：
```java
class CachedHttpServletResponse extends HttpServletResponseWrapper {
    private boolean open = false;
    private ByteArrayOutputStream output = new ByteArrayOutputStream();

    public CachedHttpServletResponse(HttpServletResponse response) {
        super(response);
    }

    // 获取Writer:
    public PrintWriter getWriter() throws IOException {
        if (open) {
            throw new IllegalStateException("Cannot re-open writer!");
        }
        open = true;
        return new PrintWriter(output, false, StandardCharsets.UTF_8);
    }

    // 获取OutputStream:
    public ServletOutputStream getOutputStream() throws IOException {
        if (open) {
            throw new IllegalStateException("Cannot re-open output stream!");
        }
        open = true;
        return new ServletOutputStream() {
            public boolean isReady() {
                return true;
            }

            public void setWriteListener(WriteListener listener) {
            }

            // 实际写入ByteArrayOutputStream:
            public void write(int b) throws IOException {
                output.write(b);
            }
        };
    }

    // 返回写入的byte[]:
    public byte[] getContent() {
        return output.toByteArray();
    }
}
```
可见，如果我们想要修改响应，就可以通过`HttpServletResponseWrapper`构造一个“伪造”的`HttpServletResponse`，这样就能拦截到写入的数据。

修改响应时，最后不要忘记把数据写入原始的`HttpServletResponse`实例。

这个`CacheFilter`同样是一个“可插拔”组件，它是否启用不影响Web应用程序的其他组件（Filter、Servlet）。

### 小结

借助`HttpServletResponseWrapper`，我们可以在Filter中实现对原始`HttpServletResponse`的修改。
