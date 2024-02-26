# 搭建GitLab私有代码托管

引用自：[GitLab官方安装教程](https://about.gitlab.com/installation/#centos-7)，[快速安装 GitLab 并汉化](http://www.jianshu.com/p/7a0d6917e009)
## CentOS 7安装 GitLab

1.  安装并配置必要的依赖关系<br />如果您安装了**Postfix**用于发送电子邮件，请在安装过程中选择“Internet站点”。你也可以使用**SendMail**或配置自定义 SMTP 服务器，并将其设置为 SMTP 服务器。<br />在 CentOS 上，下述命令将在系统防火墙中打开 HTTP 和 SSH 访问。 
```bash
sudo yum install curl policycoreutils openssh-server openssh-clients -y
sudo systemctl enable sshd
sudo systemctl start sshd
sudo yum install postfix
sudo systemctl enable postfix
sudo systemctl start postfix
sudo firewall-cmd --permanent --add-service=http
sudo systemctl reload firewalld
```

2.  添加 GitLab 包服务器并安装 
```bash
curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.rpm.sh | sudo bash
sudo yum install gitlab-ce -y
```
如果您不想使用管道脚本安装存储库，则可以查看[所有脚本](https://packages.gitlab.com/gitlab/gitlab-ce/install)，并[手动选择并下载软件包](https://packages.gitlab.com/gitlab/gitlab-ce)，并使用以下命令进行安装。  

3.  配置并启动 GitLab 
```bash
sudo gitlab-ctl reconfigure
```

4.  浏览到主机名并登录<br />在您第一次访问时，您将被重定向到密码重置屏幕，以提供初始管理员帐户的密码。设置完密码之后您将被重定向回登录屏幕。<br />默认帐户的用户名是**root**。提供您之前创建的密码并登录。登录后，您可以更改用户名。 
## 修改 host

1.  在 GitLab 中添加访问的 host，修改 `/etc/gitlab/gitlab.rb` 的 `external_url` 
```bash
external_url 'http://git.[hostname].com[:port]'
```
可以设置端口，默认为80端口。 

2.  `vim /etc/hosts`，在 CentOS 中添加host映射 
```bash
127.0.0.1 git.[hostname].com
```

3.  每次修改 `/etc/gitlab/gitlab.rb` 之后，都要运行以下命令，让配置生效 
```bash
sudo gitlab-ctl reconfigure
```

4.  配置访问机器的 host，如 `192.168.1.100 git.[hostname].com`。最后，在浏览器中打开网址 `http://git.[hostname].com` 进行登录访问。 
## 汉化
> 汉化教程参考[https://gitlab.com/xhang/gitlab](https://gitlab.com/xhang/gitlab)

1.  确认当前安装版本 
```bash
cat /opt/gitlab/embedded/service/gitlab-rails/VERSION
```
如果当前安装的版本是 `8.5.7`，中文补丁需要打 `8.5版本`，以此类推。 

2.  克隆 GitLab 源码仓库 
```bash
# 克隆 GitLab.com 仓库
git clone https://gitlab.com/larryli/gitlab.git
＃或 Gitcafe.com 镜像，速度更快
git clone https://gitcafe.com/larryli/gitlab.git
```

3.  运行汉化补丁 
```bash
# 8.5 版本的汉化补丁（8-5-stable是英文稳定版，8-5-zh是中文版，两个 diff 结果便是汉化补丁）
sudo git diff origin/8-5-stable..8-5-zh > /tmp/8.5.diff
# 停止 gitlab
sudo gitlab-ctl stop
# 应用汉化补丁
cd /opt/gitlab/embedded/service/gitlab-rails
git apply /tmp/8.5.diff  
# 启动gitlab
sudo gitlab-ctl start
```
 <br />完成汉化之后可以看到中文版的 GitLab。<br />![image.png](./搭建GitLab私有代码托管/1658805956654-049e9d06-528f-426b-9d6e-0b0bbb3a7cbf.png)
## 备份
生产环境下，备份是必需的。需要备份的文件有：配置文件和数据文件。

-  备份配置文件<br />配置文件包含密码等敏感信息，不要和数据文件放在一起。 
```bash
sh -c 'umask 0077; tar -cf $(data "+etc-gitlab-%s.tar") -C /etc/gitlab'
```

-  备份数据文件<br />默认数据备份目录是 `/var/opt/gitlab/backups`，手动创建备份文件： 
```bash
# Omnibus 方式安装使用以下命令备份
sudo gitlab-rake gitlab:backup:create
```
日常备份，添加 **crontab**，运行 `crontab -e` <br />如要修改备份周期和目录，在/etc/gitlab/gitlab.rb中修改以下两个选项  
## 恢复
恢复之前，确保备份文件所安装 GitLab 和当前要恢复的 GitLab 版本一致。

- 恢复配置文件
```bash
sudo mv /etc/gitlab /etc/gitlab.$(date +%s)
# 将下面配置备份文件的时间戳改为你所备份的文件的时间戳
sudo tar -xf etc-gitlab-1399948539.tar -C /
```

- 恢复数据文件
```bash
# 将数据备份文件拷贝至备份目录
sudo cp 1393513186_gitlab_backup.tar /var/opt/gitlab/backups/

# 停止连接数据库的进程
sudo gitlab-ctl stop unicorn
sudo gitlab-ctl stop sidekiq

# 恢复1393513186这个备份文件，将覆盖GitLab数据库！
sudo gitlab-rake gitlab:backup:restore BACKUP=1393513186

# 启动 GitLab
sudo gitlab-ctl start

# 检查 GitLab
sudo gitlab-rake gitlab:check SANITIZE=true
```
## 持续集成（GitLab-CI）

1.  添加**Runner**安装源 
```bash
# For Debian/Ubuntu
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-ci-multi-runner/script.deb.sh | sudo bash

# For CentOS
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-ci-multi-runner/script.rpm.sh | sudo bash
```

2.  安装**gitlab-ci-multi-runner** 
```bash
# For Debian/Ubuntu
apt-get install gitlab-ci-multi-runner

# For CentOS
yum install gitlab-ci-multi-runner
```

3.  注册**Runner**<br />获取Token：以管理员身份登录GitLab，进入管理区域，点击侧边栏的Runner，如下图，“注册授权码”后的字符串便是Token。<br />![image.png](./搭建GitLab私有代码托管/1658806052966-07ec7967-496b-46af-911c-44a0667c327b.png)
```bash
sudo gitlab-ci-multi-runner register

Running in system-mode.

Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com/ci):
http://git.home.com/ci
Please enter the gitlab-ci token for this runner:
xxxx             # 输入Token
Please enter the gitlab-ci description for this runner:
[xxy-web-test-02]: test-runner  # 输入runner的名称
Please enter the gitlab-ci tags for this runner (comma separated):
test,php         # 输入runner的标签，以区分不同的runner，标签间逗号分隔
Registering runner... succeeded                     runner=YDPz2or3
Please enter the executor: ssh, shell, parallels, docker, docker-ssh, virtualbox:
shell
Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded!
```
 
