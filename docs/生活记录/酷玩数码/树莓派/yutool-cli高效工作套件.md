# yutool-cli高效工作套件

## 部署应用
将构建好的`yutool-cli-v2.1.0.jar`、sqlite数据库文件`yutool-cli.db`和启动脚本`start.sh`拷贝到`~/app/yutool-cli/`目录下。

执行`start.sh`脚本启动应用：
```bash
sudo bash start.sh
```
创建并编辑 nginx 配置文件`/etc/nginx/sites-enabled/yutool-cli`，输入以下内容并保存：
```nginx
server {
    listen 80;
    server_name yutool-cli.pi.com;

    location / {
        proxy_pass http://127.0.0.1:11000;
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
使新增的 nginx 配置生效：`sudo nginx -s reload`。

编辑客户端的hosts文件，将`yutool-cli.pi.com`域名解析到树莓派的ip。

在浏览器访问`http://yutool-cli.pi.com/`可进入yutool-cli的朱页面。
## 开机自启
编辑`sudo nano /etc/systemd/system/yutool-cli.service`并写入以下内容：
```nginx
[Unit]
Description=yutool-cli
After=network-online.target

[Service]
Type=simple
ExecStart=sudo bash /home/pi/app/yutool-cli/start.sh

[Install]
WantedBy=default.target
```
启用yutool-cli开机启动：
```nginx
#启用开机启动
sudo systemctl enable yutool-cli

#启动、停止、重启、状态
sudo service yutool-cli start|stop|restart|status
```
