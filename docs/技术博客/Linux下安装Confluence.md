# Linux下安装Confluence

## Confluence简介
Confluence是一个专业的企业知识管理与协同软件，也可以用于构建**企业wiki** 。通过它可以实现团队成员之间的协作和知识共享。<br />Confluence为团队提供一个协作环境。在这里，团队成员齐心协力，各擅其能，协同地编写文档和管理项目。从此打破不同团队、不同部门以及个人之间信息孤岛的僵局，Confluence真正实现了组织资源共享。<br />Confluence使用简单，但它强大的编辑和站点管理特征能够帮助团队成员之间共享信息、文档协作、集体讨论，信息推送。
## 安装步骤

1.  进入Confluence官网<br />浏览[Confluence官网](https://www.atlassian.com/software/confluence)，进入[下载页面](https://www.atlassian.com/software/confluence/download)，选择 **Linux 64Bit** 版本进行下载，复制[下载地址](https://downloads.atlassian.com/software/confluence/downloads/atlassian-confluence-6.3.2-x64.bin)。 
2.  远程连接阿里云服务器实例。 
3.  下载Confluence 
```bash
wget https://downloads.atlassian.com/software/confluence/downloads/atlassian-confluence-6.3.2-x64.bin
```

4.  向安装文件添加执行权限 
```bash
chmod +x ./atlassian-confluence-6.3.2-x64.bin
```

5.  执行安装 
```bash
./atlassian-confluence-6.3.2-x64.bin
```

6.  填写配置信息 
```bash
[root@iZ125p3eqb4fw3Z data]# ./atlassian-confluence-6.3.1-x64.bin 
Unpacking JRE ...
Starting Installer ...
Aug 04, 2017 11:31:41 AM java.util.prefs.FileSystemPreferences$2 run
INFO: Created system preferences directory in java.home.

This will install Confluence 6.3.1 on your computer.
OK [o, Enter], Cancel [c]
o
Choose the appropriate installation or upgrade option.
Please choose one of the following:
Express Install (uses default settings) [1], 
Custom Install (recommended for advanced users) [2, Enter], 
Upgrade an existing Confluence installation [3]
2

Where should Confluence 6.3.1 be installed?
[/opt/atlassian/confluence]
/data/atlassian/confluence
Default location for Confluence data
[/var/atlassian/application-data/confluence]
/data/atlassian/application-data/confluence
Configure which ports Confluence will use.
Confluence requires two TCP ports that are not being used by any other
applications on this machine. The HTTP port is where you will access
Confluence through your browser. The Control port is used to Startup and
Shutdown Confluence.
Use default ports (HTTP: 8090, Control: 8000) - Recommended [1, Enter], Set custom value for HTTP and Control ports [2]
1
Confluence can be run in the background.
You may choose to run Confluence as a service, which means it will start
automatically whenever the computer restarts.
Install Confluence as Service?
Yes [y, Enter], No [n]
y

Extracting files ...
                                                                        

Please wait a few moments while we configure Confluence.
Installation of Confluence 6.3.1 is complete
Start Confluence now?
Yes [y, Enter], No [n]
y

Please wait a few moments while Confluence starts up.
Launching Confluence ...
Installation of Confluence 6.3.1 is complete
Your installation of Confluence 6.3.1 is now ready and can be accessed via
your browser.
Confluence 6.3.1 can be accessed at http://localhost:8090
Finishing installation ...
```

7.  完成安装，在浏览器中打开 `http://{host}:8090` 访问Confluence 
