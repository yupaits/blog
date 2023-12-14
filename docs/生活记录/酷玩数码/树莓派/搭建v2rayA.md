# 搭建v2rayA

v2rayA是V2Ray的一个Web客户端。通过在v2rayA页面设置代理服务配置，可以实现科学上网。
## 安装
v2rayA依赖于v2ray-core，所以需要先安装v2ray，浏览[fhs-install-v2ray页面](https://github.com/v2fly/fhs-install-v2ray)可知安装脚本为：
```bash
// 安装可执行文件和 .dat 数据文件
# bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)
```
如果无法访问github，则需要先将`install-release.sh`脚本下载并导入至树莓派，手动进行安装：
```bash
sudo chmod +x install-release.sh
sudo bash install-release.sh
```
v2rayA的代码仓库地址是：[https://github.com/v2rayA/v2rayA](https://github.com/v2rayA/v2rayA)，从项目文档里可以找到[安装步骤](https://v2raya.org/docs/prologue/installation/debian/#%E6%96%B9%E6%B3%95%E4%B8%80%E9%80%9A%E8%BF%87%E8%BD%AF%E4%BB%B6%E6%BA%90%E5%AE%89%E8%A3%85)，安装完成后还需要[设置为开机启动](https://v2raya.org/docs/prologue/installation/debian/#%E5%90%AF%E5%8A%A8-v2raya--%E8%AE%BE%E7%BD%AE-v2raya-%E8%87%AA%E5%8A%A8%E5%90%AF%E5%8A%A8)。
## 配置
### Nginx转发
安装nginx。<br />创建并编辑 nginx 配置文件`/etc/nginx/sites-enabled/v2rayA`，输入以下内容并保存：
```nginx
server {
    listen 80;
    server_name v2rayA.pi.com;

    location / {
        proxy_pass http://127.0.0.1:2017;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Upgrade websocket;
        proxy_set_header Connection upgrade;
        proxy_connect_timeout 60;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
    }
}
```
使新增的 nginx 配置生效：`sudo nginx -s reload`。<br />设置 nginx 开机启动：`sudo systemctl enable nginx`。
### 节点配置
点击创建或者导入节点配置，支持多种协议。<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/763022/1667388175619-d161f292-f8a0-4046-8dd5-c056953aee70.png#averageHue=%235f5f5f&clientId=u37823e81-afe5-4&from=paste&height=901&id=u4b0d3ccb&originHeight=901&originWidth=1729&originalType=binary&ratio=1&rotation=0&showTitle=false&size=44656&status=done&style=none&taskId=u7e9f2684-7839-42ad-9741-526332960d0&title=&width=1729)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/763022/1667388160959-4ce5ceb2-07c3-4a0c-a133-6e0773999d32.png#averageHue=%233a3a3a&clientId=u37823e81-afe5-4&from=paste&height=722&id=u5c5c06a8&originHeight=722&originWidth=1736&originalType=binary&ratio=1&rotation=0&showTitle=false&size=32114&status=done&style=none&taskId=u0becd9dd-0993-4f80-9eff-d5808e92513&title=&width=1736)
### 启用节点
完成配置后，点击`PING`和`HTTP`对节点进行测速。点击左上角`就绪`按钮启动代理服务。代理服务正常启动后，即可访问Google或者GitHub等网站。<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/763022/1667388251739-f17e1ab8-7b8d-422b-8c82-bfb133f1f4f0.png#averageHue=%23fcf5f3&clientId=u37823e81-afe5-4&from=paste&height=421&id=u6e71e2ab&originHeight=421&originWidth=1722&originalType=binary&ratio=1&rotation=0&showTitle=false&size=33090&status=done&style=none&taskId=ud36f5e38-6ef3-42e6-a10f-1f7346417f3&title=&width=1722)
## 常见问题

1. 在进入v2rayA页面时，如果显示“检测到 geosite.dat, geoip.dat 文件或 v2ray-core 可能未正确安装，请检查”，说明v2rayA与v2ray版本不适配，此时需要将v2ray降级到v4.45.2版本。降级命令如下：
```bash
cd ~/app/v2ray
sudo bash install-release.sh --version v4.45.2
```
参考：

   - [https://github.com/v2rayA/v2rayA/issues/510](https://github.com/v2rayA/v2rayA/issues/510)
   - [https://github.com/v2fly/fhs-install-v2ray/issues/243](https://github.com/v2fly/fhs-install-v2ray/issues/243)
