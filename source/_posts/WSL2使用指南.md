---
title: WSL2使用指南
date: 2020-03-28 12:36:36
category: 工具
tags:
  - WSL2
---

## WSL2简介及安装

- [关于 WSL2](https://docs.microsoft.com/zh-cn/windows/wsl/wsl2-about)
- [安装 WSL2](https://docs.microsoft.com/zh-cn/windows/wsl/wsl2-install)

## 安装WSL2支持的Linux发行版

进入 Microsoft Store 搜索关键词 `wsl`，选择要安装的Linux发行版，推荐安装 Ubuntu。

<!--more-->

## Ubuntu系统配置

### 替换 APT 软件源

备份原有源文件：

```bash
# 备份
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
```

执行 `sudo nano /etc/apt/sources.list` 修改 `sources.list` 文件，更改为阿里源：

```
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
```

更新软件源并升级：

```bash
# 更新
sudo apt update
# 升级
sudo apt upgrade
```

### 配置中文环境

安装中文语言包：

```bash
sudo apt install language-pack-zh-hans language-pack-zh-hans-base
```

运行语言支持检查：

```bash
sudo apt install $(check-language-support)
```

执行 `sudo nano /etc/default/locale` 修改配置文件为如下内容：

```toml
LANG=zh_CN.UTF-8
LANGUAGE=zh_CN:zh
LC_NUMERIC=zh_CN
LC_TIME=zh_CN
LC_MONETARY=zh_CN
LC_PAPER=zh_CN
LC_NAME=zh_CN
LC_ADDRESS=zh_CN
LC_TELEPHONE=zh_CN
LC_MEASUREMENT=zh_CN
LC_IDENTIFICATION=zh_CN
LC_ALL=zh_CN.UTF-8
```

执行 `sudo nano /etc/environment` 在环境配置文件追加以下内容：

```toml
LANG=zh_CN.UTF-8
LANGUAGE=zh_CN:zh
LC_NUMERIC=zh_CN
LC_TIME=zh_CN
LC_MONETARY=zh_CN
LC_PAPER=zh_CN
LC_NAME=zh_CN
LC_ADDRESS=zh_CN
LC_TELEPHONE=zh_CN
LC_MEASUREMENT=zh_CN
LC_IDENTIFICATION=zh_CN
LC_ALL=zh_CN.UTF-8
```

重启 WSL2 服务：

打开 `任务管理器 -> 服务 -> LxssManager`，右键菜单选择 `重新启动`。