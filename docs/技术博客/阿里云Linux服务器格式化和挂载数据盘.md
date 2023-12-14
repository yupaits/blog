# 阿里云Linux服务器格式化和挂载数据盘

引用自：[Linux 格式化和挂载数据盘](https://help.aliyun.com/document_detail/25426.html)
## 操作须知
单独购买的数据盘需要先挂载数据盘，然后才能格式化。<br />随实例时一起购买的数据盘，无需挂载，直接格式化。<br />您需要知道挂载到实例的数据盘的设备名：您可以通过 **ECS 管理控制台** > **磁盘详情** > **磁盘挂载信息** 查到数据盘的设备名。数据盘的设备名由系统默认分配，从 **/dev/xvdb** 开始往后顺序排列，分布范围包括 `/dev/xvdb−/dev/xvdz`。
## 操作步骤

1.  远程连接实例。 
2.  运行 `fdisk -l` 命令查看实例是否有数据盘。如果执行命令后，没有发现 `/dev/vdb`，表示您的实例没有数据盘，无需格式化数据盘，请忽略本文后续内容。<br />如果您的数据盘显示的是 `dev/xvd?`，表示您使用的是非 I/O 优化实例。<br />其中 ? 是 a−z 的任一个字母。 
3.  创建一个单分区数据盘，依次执行以下命令： 
   1.  运行 `fdisk /dev/vdb`：对数据盘进行分区。 
   2.  输入 `n` 并按回车键：创建一个新分区。 
   3.  输入 `p` 并按回车键：选择主分区。因为创建的是一个单分区数据盘，所以只需要创建主分区。 
> 如果要创建 4 个以上的分区，您应该创建至少一个扩展分区，即选择 `e`。

   4.  输入分区编号并按回车键。因为这里仅创建一个分区，可以输入 1。 
   5.  输入第一个可用的扇区编号：按回车键采用默认值 1。 
   6.  输入最后一个扇区编号：因为这里仅创建一个分区，所以按回车键采用默认值。 
   7.  输入 `wq` 并按回车键，开始分区。 
```bash
[root@iXXXXXXX ~]# fdisk /dev/vdb
Device contains neither a valid DOS partition table, nor Sun, SGI or OSF disklabel
Building a new DOS disklabel with disk identifier 0x5f46a8a2.
Changes will remain in memory only, until you decide to write them.
After that, of course, the previous content won't be recoverable.
Warning: invalid flag 0x0000 of partition table 4 will be corrected by w(rite)
WARNING: DOS-compatible mode is deprecated. It's strongly recommended to
switch off the mode (command 'c') and change display units to
sectors (command 'u').
Command (m for help): n
Command action
e   extended
p   primary partition (1-4)
p
Partition number (1-4): 1
First cylinder (1-41610, default 1): 1
Last cylinder, +cylinders or +size{K,M,G} (1-41610, default 41610):
Using default value 41610
Command (m for help): wq
The partition table has been altered!
Calling ioctl() to re-read partition table.
Syncing disks.
```

4.  查看新的分区：运行命令 `fdisk -l`。如果出现以下信息，说明已经成功创建了新分区 `/dev/vdb1`。 
```bash
[root@iXXXXXXX ~]# fdisk -l
Disk /dev/vda: 42.9 GB, 42949672960 bytes
255 heads, 63 sectors/track, 5221 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x00053156
Device Boot      Start         End      Blocks   Id  System
/dev/vda1   *           1        5222    41942016   83  Linux
Disk /dev/vdb: 21.5 GB, 21474836480 bytes
16 heads, 63 sectors/track, 41610 cylinders
Units = cylinders of 1008 * 512 = 516096 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x5f46a8a2
Device Boot      Start         End      Blocks   Id  System
/dev/vdb1               1       41610    20971408+  83  Linux
```

5.  在新分区上创建一个文件系统：运行命令 `mkfs.ext4 /dev/vdb1`。 
> 本示例要创建一个 ext4 文件系统。您也可以根据自己的需要，选择创建其他文件系统，例如，如果需要在 Linux、Windows 和 Mac 系统之间共享文件，您可以使用 `mkfs.vfat` 创建 VFAT 文件系统。

6.  （建议）备份 **etc/fstab**：运行命令 `cp /etc/fstab /etc/fstab.bak`。 
7.  向 **/etc/fstab** 写入新分区信息：运行命令 `echo /dev/vdb1 /mnt ext3 defaults 0 0 >> /etc/fstab`。 
> 注意：Ubuntu 12.04 不支持 barrier，所以对该系统正确的命令是：`echo '/dev/vdb1 /mnt ext3 barrier=0 0 0' >> /etc/fstab`。

8.  查看 **/etc/fstab** 中的新分区信息：运行命令 `cat /etc/fstab`。 
```bash
[root@iXXXXXXX ~]# cat /etc/fstab
#
# /etc/fstab
# Created by anaconda on Thu Feb 23 07:28:22 2017
#
# Accessible filesystems, by reference, are maintained under '/dev/disk'
# See man pages fstab(5), findfs(8), mount(8) and/or blkid(8) for more info
#
UUID=3d083579-f5d9-4df5-9347-8d27925805d4 /                       ext4    defaults        1 1
tmpfs                   /dev/shm                tmpfs   defaults        0 0
devpts                  /dev/pts                devpts  gid=5,mode=620  0 0
sysfs                   /sys                    sysfs   defaults        0 0
proc                    /proc                   proc    defaults        0 0
/dev/vdb1 /mnt ext3 defaults 0 0
```

9.  挂载文件系统：运行命令 `mount /dev/vdb1 /mnt`。 
10.  查看目前磁盘空间和使用情况：运行命令 `df -h`。如果出现新建文件系统的信息，说明挂载成功，可以使用新的文件系统了。 
> 挂载操作完成后，不需要重启实例即可开始使用新的文件系统。

  
