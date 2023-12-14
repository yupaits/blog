# web控制台cockpit

## 安装cockpit
使用apt安装cockpit。
```bash
sudo apt install cockpit
```
安装完成后，配置nginx反向代理。<br />创建并编辑 nginx 配置文件`/etc/nginx/sites-enabled/cockpit`，输入以下内容并保存：
```nginx
server {
    listen 80;
    server_name cockpit.pi.com;

    location / {
        proxy_pass http://127.0.0.1:9090;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout 60;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
    }
}
```
使新增的 nginx 配置生效：`sudo nginx -s reload`。<br />编辑客户端的hosts文件，将`cockpit.pi.com`域名解析到树莓派的ip。<br />在浏览器访问`https://cockpit.pi.com:9090/`可进入cockpit的登录页面。<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/763022/1667709668371-260a3c91-a2e9-478d-b57d-5b9345594d0f.png#averageHue=%23555555&clientId=u059e8ea5-a1a0-4&from=paste&height=976&id=u89269c4a&originHeight=976&originWidth=1843&originalType=binary&ratio=1&rotation=0&showTitle=false&size=416900&status=done&style=none&taskId=u83dcf54c-f653-4fb0-b437-8060bc2cc4e&title=&width=1843)<br />输入可登录树莓派系统的账户密码后，进入管理界面。<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/763022/1667710876812-04b95a10-8fe5-464d-b647-a266a4a02cf7.png#averageHue=%23e0c695&clientId=u3e2392ce-9421-4&from=paste&height=976&id=u5c6a1972&originHeight=976&originWidth=1843&originalType=binary&ratio=1&rotation=0&showTitle=false&size=94465&status=done&style=none&taskId=u08d62b91-a414-4476-9556-e1449ce9c09&title=&width=1843)
## 启用网络模块
cockpit的网络模块依赖NetworkManager服务，如果没有安装，在首次进入页面时会提示启用NetworkManager。启用之后如果出现树莓派网络连接失败的情况，需要进行如下处理：<br />进入控制台输入`sudo raspi-config`，选择`Advanced Options`->`Network Config`->`NetworkManager`并确定，启用NetworkManager管理网络。<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/763022/1667712317469-2e94fedd-9a95-4d79-bda8-88250a2d96d0.png#averageHue=%237ab2e0&clientId=u3e2392ce-9421-4&from=paste&height=816&id=ufdd90579&originHeight=816&originWidth=1113&originalType=binary&ratio=1&rotation=0&showTitle=false&size=49187&status=done&style=none&taskId=u1b227016-b2ad-4912-be55-7897940d5fc&title=&width=1113)<br />如果使用WiFi连接网络，需要手动设置一次WiFi并连接，之后开机会自动连接WiFi网络。手动设置WiFi连接命令<br />如下：
```bash
nmcli device wifi connect <SSID|BSSID> password <password>
```
