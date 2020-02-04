# 搭建基于 Aria2 的下载机

> 参考：[树莓派3B+ 远程下载服务器（Aria2）](https://blog.csdn.net/kxwinxp/article/details/80288006)

## 安装 Aria2

使用以下命令安装 Aria2：

```bash
sudo apt install aria2
```

## 编辑 Aria2 配置文件

创建文件夹 `mkdir -p ~/.config/aria2`。

添加一个 Aria2 配置文件 `vim ~/.config/aria2/aria2.config`。

```toml
#后台运行
daemon=true
#用户名
#rpc-user=user
#密码
#rpc-passwd=passwd
#设置加密的密钥
rpc-secret=secret
#允许rpc
enable-rpc=true
#允许所有来源，web界面跨域权限需要设置
rpc-allow-origin-all=true
#是否启用https加密，启用之后要设置公钥、私钥的文件路径
#rpc-secure=true
#启用加密设置公钥
#rpc-certificate=/home/pi/.config/aria2/example.crt
#启用加密设置私钥
#rpc-private-key=/home/pi/.config/aria2/example.key
#允许外部访问，false的话只监听本地端口
rpc-listen-all=true
#RPC端口，仅当默认端口被占用时修改
#rpc-listen-port=6800
#最大同时下载数（任务数），建议值：3
max-concurrent-downloads=5
#断点续传
continue=true
#同服务器连接数
max-connection-per-server=5
#最小文件分片大小，下载线程数上限取决于能分出多少片，对于小文件重要
min-split-size=10M
#单文件最大线程数，建议值：5
split=10
#下载速度限制
max-overall-download-limit=0
#单文件下载速度限制
#max-download-limit=0
#上传速度限制
#max-overall-upload-limit=0
#单文件上传速度限制
max-download-limit=0
#断开速度过慢的连接
#lowest-speed-limit=0
#文件保存路径，默认为当前启动位置
dir=/home/pi/downloads
#文件预分配，能有效降低文件碎片，提高磁盘性能。缺点是预分配时间较长。所需时间：none < falloc ? truc << prealloc，falloc和trunc需要文件系统和内核支持
file-allocation=prealloc
#不进行证书验证
check-certificate=false
#保存下载会话
save-session=/home/pi/.config/aria2/aria2.session
input-file=/home/pi/.config/aria2/aria2.session
#断电续传
save-session-interval=60
bt-tracker=
```

设置好配置之后，还要创建该会话空白文件 `touch ~/.config/aria2/aria2.session`。

测试下 Aria2 是否启动成功 `aria2c --conf-path=/home/pi/.config/aria2/aria2.config`。用 `ps aux|grep aria2` 看是否有进程启动，若有说明启动成功了。

## 设置 Aria2 开机启动

Raspbian系统是使用 systemd 来管理服务的，所以我们需要创建并编辑 aria.service 文件：`sudo nano /lib/systemd/system/aria.service`，输入以下内容并保存：

```toml
[Unit]
Description=Aria2 Service
After=network.target

[Service]
User=pi
Type=forking
ExecStart=/usr/bin/aria2c --conf-path=/home/pi/.config/aria2/aria2.config

[Install]
WantedBy=multi-user.target
```

重新载入服务，并设置开机启动：

```bash
sudo systemctl daemon-reload
sudo systemctl enable aria
```

查看 Aria2 服务状态：

```bash
sudo systemctl status aria
```

启动、停止、重启 Aria2 服务：

```bash
sudo systemctl (start、stop、restart) aria
```

## 部署 AriaNg Web下载管理页面

### 服务端

安装 nginx：`sudo apt install nginx`。

在 [AriaNg下载页面](https://github.com/mayswind/AriaNg/releases) 下载最新的 `AraiNg-x.x.x-AllInOne.zip` 压缩包。将压缩包内的 `index.html` 解压到 `/var/www/html/aria-ng/` 目录下。

创建并编辑 nginx 配置文件 `/etc/nginx/sites-enabled/aria`，输入以下内容并保存：

```nginx
server {
    listen 80;
    server_name aria2.pi.com;

    location / {
        root /var/www/html/aria-ng;
        index index.html;
    }
}
```

使新增的 nginx 配置生效：`sudo nginx -s reload`。

设置 nginx 开机启动：`sudo systemctl enable nginx`。

### 客户端

修改客户端 `hosts` 文件以便使用 `aria2.pi.com` 域名访问AriaNg管理界面。

例如：`192.168.1.1	aria2.pi.com`

![AriaNg下载页面](/images/搭建基于Aria2的下载机/AriaNg下载页面.png)

首次浏览时需要进入 AriaNg设置 -> RPC，填写服务端配置信息，特别是 Aria2 RPC 地址和Aria2 RPC 密钥。正确填写之后即可连接使用树莓派上的 Aria2 服务。

![AriaNg-RPC设置](/images/搭建基于Aria2的下载机/AriaNg-RPC设置.png)

## 设置 trackers 提升下载速度

trackers 清单地址：[trackerslist](https://github.com/ngosang/trackerslist)，推荐使用 **tracker_best.txt**。

有两种设置 trackers 的方式：

1. 客户端进入 AriaNg -> Aria2 设置 -> BitTorrent 设置 -> BT 服务器地址（bt-tracker），填写 trackers 列表地址，多个地址以逗号 `,` 分隔。

    ![trackers设置](/images/搭建基于Aria2的下载机/trackers设置.png)

1. 服务端编辑 `~/.config/aria2/aria2.config` 配置文件中的 `bt-trakcer=udp://tracker.coppersurfer.tk:6969/announce,udp://tracker.opentrackr.org:1337/announce` 项，多个地址用逗号 `,` 分隔。