# 使用rclone同步onedrive

## 安装rclone并配置onedrive
进入windows环境，[下载windows版rclone](https://rclone.org/downloads/)并执行命令：
```shell
rclone.exe authorize "onedrive"
```
之后会进入onedrive授权网页，授权完成后，控制台会输出**token**信息。

在树莓派中使用官网推荐脚本安装rclone。

`curl https://rclone.org/install.sh | bash`

安装完成后，开始rclone的onedrive配置。
```bash
pi@raspberrypi:~/app/rclone $ sudo rclone config
2022/11/06 13:43:39 NOTICE: Config file "/root/.config/rclone/rclone.conf" not found - using defaults
No remotes found, make a new one?
n) New remote
s) Set configuration password
q) Quit config
n/s/q> n

Enter name for new remote.
name> onedrive

Option Storage.
Type of storage to configure.
Choose a number from below, or type in your own value.
 1 / 1Fichier
   \ (fichier)
 2 / Akamai NetStorage
   \ (netstorage)
 3 / Alias for an existing remote
   \ (alias)
 4 / Amazon Drive
   \ (amazon cloud drive)
 5 / Amazon S3 Compliant Storage Providers including AWS, Alibaba, Ceph, China Mobile, Cloudflare, ArvanCloud, Digital Ocean, Dreamhost, Huawei OBS, IBM COS, IDrive e2, IONOS Cloud, Lyve Cloud, Minio, Netease, RackCorp, Scaleway, SeaweedFS, StackPath, Storj, Tencent COS, Qiniu and Wasabi
   \ (s3)
 6 / Backblaze B2
   \ (b2)
 7 / Better checksums for other remotes
   \ (hasher)
 8 / Box
   \ (box)
 9 / Cache a remote
   \ (cache)
10 / Citrix Sharefile
   \ (sharefile)
11 / Combine several remotes into one
   \ (combine)
12 / Compress a remote
   \ (compress)
13 / Dropbox
   \ (dropbox)
14 / Encrypt/Decrypt a remote
   \ (crypt)
15 / Enterprise File Fabric
   \ (filefabric)
16 / FTP
   \ (ftp)
17 / Google Cloud Storage (this is not Google Drive)
   \ (google cloud storage)
18 / Google Drive
   \ (drive)
19 / Google Photos
   \ (google photos)
20 / HTTP
   \ (http)
21 / Hadoop distributed file system
   \ (hdfs)
22 / HiDrive
   \ (hidrive)
23 / In memory object storage system.
   \ (memory)
24 / Internet Archive
   \ (internetarchive)
25 / Jottacloud
   \ (jottacloud)
26 / Koofr, Digi Storage and other Koofr-compatible storage providers
   \ (koofr)
27 / Local Disk
   \ (local)
28 / Mail.ru Cloud
   \ (mailru)
29 / Mega
   \ (mega)
30 / Microsoft Azure Blob Storage
   \ (azureblob)
31 / Microsoft OneDrive
   \ (onedrive)
32 / OpenDrive
   \ (opendrive)
33 / OpenStack Swift (Rackspace Cloud Files, Memset Memstore, OVH)
   \ (swift)
34 / Oracle Cloud Infrastructure Object Storage
   \ (oracleobjectstorage)
35 / Pcloud
   \ (pcloud)
36 / Put.io
   \ (putio)
37 / QingCloud Object Storage
   \ (qingstor)
38 / SMB / CIFS
   \ (smb)
39 / SSH/SFTP
   \ (sftp)
40 / Sia Decentralized Cloud
   \ (sia)
41 / Storj Decentralized Cloud Storage
   \ (storj)
42 / Sugarsync
   \ (sugarsync)
43 / Transparently chunk/split large files
   \ (chunker)
44 / Union merges the contents of several upstream fs
   \ (union)
45 / Uptobox
   \ (uptobox)
46 / WebDAV
   \ (webdav)
47 / Yandex Disk
   \ (yandex)
48 / Zoho
   \ (zoho)
49 / premiumize.me
   \ (premiumizeme)
50 / seafile
   \ (seafile)
Storage> onedrive

Option client_id.
OAuth Client Id.
Leave blank normally.
Enter a value. Press Enter to leave empty.
client_id>

Option client_secret.
OAuth Client Secret.
Leave blank normally.
Enter a value. Press Enter to leave empty.
client_secret>

Option region.
Choose national cloud region for OneDrive.
Choose a number from below, or type in your own string value.
Press Enter for the default (global).
 1 / Microsoft Cloud Global
   \ (global)
 2 / Microsoft Cloud for US Government
   \ (us)
 3 / Microsoft Cloud Germany
   \ (de)
 4 / Azure and Office 365 operated by Vnet Group in China
   \ (cn)
region> 1

Edit advanced config?
y) Yes
n) No (default)
y/n> n

Use auto config?
 * Say Y if not sure
 * Say N if you are working on a remote or headless machine

y) Yes (default)
n) No
y/n> n

Option config_token.
For this to work, you will need rclone available on a machine that has
a web browser available.
For more help and alternate methods see: https://rclone.org/remote_setup/
Execute the following on the machine with the web browser (same rclone
version recommended):
        rclone authorize "onedrive"
Then paste the result.
Enter a value.
config_token> {"access_token":"${token}","expiry":"2022-11-06T14:53:47.1130596+08:00"}

Option config_type.
Type of connection
Choose a number from below, or type in an existing string value.
Press Enter for the default (onedrive).
 1 / OneDrive Personal or Business
   \ (onedrive)
 2 / Root Sharepoint site
   \ (sharepoint)
   / Sharepoint site name or URL
 3 | E.g. mysite or https://contoso.sharepoint.com/sites/mysite
   \ (url)
 4 / Search for a Sharepoint site
   \ (search)
 5 / Type in driveID (advanced)
   \ (driveid)
 6 / Type in SiteID (advanced)
   \ (siteid)
   / Sharepoint server-relative path (advanced)
 7 | E.g. /teams/hr
   \ (path)
config_type> 1

Failed to query available drives: Get "https://graph.microsoft.com/v1.0/me/drive": EOF

Option config_type.
Type of connection
Choose a number from below, or type in an existing string value.
Press Enter for the default (onedrive).
 1 / OneDrive Personal or Business
   \ (onedrive)
 2 / Root Sharepoint site
   \ (sharepoint)
   / Sharepoint site name or URL
 3 | E.g. mysite or https://contoso.sharepoint.com/sites/mysite
   \ (url)
 4 / Search for a Sharepoint site
   \ (search)
 5 / Type in driveID (advanced)
   \ (driveid)
 6 / Type in SiteID (advanced)
   \ (siteid)
   / Sharepoint server-relative path (advanced)
 7 | E.g. /teams/hr
   \ (path)
config_type> 1

Option config_driveid.
Select drive you want to use
Choose a number from below, or type in your own string value.
Press Enter for the default (437a11f60d433efa).
 1 /  (personal)
   \ (437a11f60d433efa)
config_driveid> 1

Drive OK?

Found drive "root" of type "personal"
URL: https://onedrive.live.com/?cid=437a11f60d433efa

y) Yes (default)
n) No
y/n> y

Configuration complete.
Options:
- type: onedrive
- token: {"access_token":"${token}","expiry":"2022-11-06T14:53:47.1130596+08:00"}
- drive_id: 437a11f60d433efa
- drive_type: personal
Keep this "onedrive" remote?
y) Yes this is OK (default)
e) Edit this remote
d) Delete this remote
y/e/d> y

Current remotes:

Name                 Type
====                 ====
onedrive             onedrive

e) Edit existing remote
n) New remote
d) Delete remote
r) Rename remote
c) Copy remote
s) Set configuration password
q) Quit config
e/n/d/r/c/s/q> q
```
165行中输入的token即为上述在windows中得到的token。

完成onedrive配置后，需要将onedrive挂载到本地目录。
```bash
sudo rclone mount onedrive:/ /media/nas/onedrive --copy-links --no-gzip-encoding --no-check-certificate --allow-other --allow-non-empty --vfs-cache-mode writes --umask 000
```
附：[rclone mount使用说明](https://rclone.org/commands/rclone_mount/)
## 设置rclone开机挂载onedrive
编辑`sudo nano /etc/systemd/system/rclone.service`并写入以下内容：
```nginx
[Unit]
Description=rclone
After=network-online.target

[Service]
Type=simple
ExecStart=sudo rclone mount onedrive:/ /media/nas/onedrive --copy-links --no-gzip-encoding --no-check-certificate --all>Restart=on-abort

[Install]
WantedBy=default.target

```
启用rclone挂载开机启动：
```bash
#启用开机启动
sudo systemctl enable rclone

#启动、停止、重启、状态
sudo service rclone start|stop|restart|status
```
## rclone使用说明
### rclone指令

- rclone config 	- 以控制会话的形式添加rclone的配置，配置保存在.rclone.conf文件中。 
- rclone copy 		- 将文件从源复制到目的地址，跳过已复制完成的。 
- rclone sync 		- 将源数据同步到目的地址，只更新目的地址的数据。 –dry-run标志来检查要复制、删除的数据 
- rclone move 	- 将源数据移动到目的地址。 
- rclone delete 	- 删除指定路径下的文件内容。
- rclone purge 	- 清空指定路径下所有文件数据。 
- rclone mkdir 	- 创建一个新目录。 
- rclone rmdir 	- 删除空目录。 
- rclone check 	- 检查源和目的地址数据是否匹配。 
- rclone ls 		- 列出指定路径下所有的文件以及文件大小和路径。 
- rclone lsd 		- 列出指定路径下所有的目录/容器/桶。 
- rclone lsl 		- 列出指定路径下所有文件以及修改时间、文件大小和路径。 
- rclone md5sum 	- 为指定路径下的所有文件产生一个md5sum文件。 
- rclone sha1sum 	- 为指定路径下的所有文件产生一个sha1sum文件。 
- rclone size 		- 获取指定路径下，文件内容的总大小。
- rclone version 	- 查看当前版本。 
- rclone cleanup 	- 清空remote。 
- rclone dedupe 	- 交互式查找重复文件，进行删除/重命名操作。 
- rclone mount 	- 挂载云盘为本地硬盘 
- fusermount 		-qzu LocalFolder - 卸载挂载的云盘
### rclone常用操作
#### ls
```bash
### 显示远端bucket下的文件
rclone ls s3-overseas:bucket-name
OUT:   106622 header.png

### 显示远端bucket下的目录
rclone lsd s3-overseas:bucket-name
OUT:   0 2020-08-27 15:57:08        -1 new

### 以json形式列出bucket下的目录和文件
rclone lsjson s3-overseas:bucket-name
OUT: [
OUT: {"Path":"header.png","Name":"header.png","Size":106622,"MimeType":"image/png","ModTime":"2020-08-27T07:32:29.000000000Z","IsDir":false,"Tier":"STANDARD"},
OUT: {"Path":"new","Name":"new","Size":0,"MimeType":"inode/directory","ModTime":"2020-08-27T16:02:42.413393904+08:00","IsDir":true}
OUT: ]

### 以json形式递归的列出bucket-name下目录和文件
rclone lsjson s3-overseas:bucket-name -R

### 查看存储桶中500B以上的文件列表
rclone --min-size 500B lsl s3-overseas:bucket-name

```
#### sync
```bash
### 同步本地目录或文件到远端bucket
rclone sync <LOCAL_PATH> s3-overseas:bucket-name/target-path/

### 同步远端bucket目录到本地
rclone sync s3-overseas:bucket-name/target-path/ <LOCAL_PATH>

### 远端同步到远端
# S3直接同步到阿里的OSS
rclone sync s3-overseas:bucket-name oss-hwpf:bucket-name

### 将本地文件同步到远端，并备份被删除或修改的文件到备份存储桶中
rclone sync <LOCAL_PATH> s3-overseas:bucket-name --backup-dir s3-overseas:backup-bucket-name/backup-dir

```
**sync操作，会删除目标端的目录或文件。** 执行前可以加 --dry-run参数查看将要删除的文件或目录。
#### copy
```bash
### 拷贝本地文件到远端
rclone copy <LOCAL_PATH> s3-overseas:bucket-name/target-path/

## 拷贝远端对象到本地
rclone copy s3-overseas:bucket-name/target-path/ <LOCAL_PATH>

rclone copy --max-age 24h --progress --no-traverse <LOCAL_PATH> s3-overseas:bucket-name/target-path/
```
**copy操作，不会删除目标端的任何文件**

--max-age 24h: 过滤出来最近24小时变更过的文件

--progress: 显示进度 等同于 -P

--no-traverse: 从源拷贝少量文件到目的中大量目的文件时，速度会更快
#### mkdir
```bash
### 创建新的bucket 需要AKSK有权限
rclone mkdir s3-overseas:new-bucket-name  # 在AWS创建存储桶new-bucket-name

### 创建新目录
rclone mkdir s3-overseas:bucket-name/new-dir
```
#### delete
```bash
### 删除bucket根目录下的delete.file  如果`--include`不加路径，则递归删除所有该名字文件
rclone delete s3-overseas:bucket-name --include=/delete.file
```
#### check
```bash
### 对比本地文件和远端文件，默认校验修改时间和大小
rclone check <LOCAL_PATH> s3-overseas:bucket-name/target-path/ --one-way

### 进行数据对比校验
rclone check s3-overseas:bucket-name/target-path/  oss-hwpf:bucket-name/target-path/ -P
```
