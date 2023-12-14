# 使用hexo快速搭建个人博客

摘要：本文主要介绍使用 **hexo博客框架** + **GitHub托管代码** + **GitHub Pages** 搭建个人博客网站。<br />由于各种原因，博主一直都有搭建个人博客的想法。在使用hexo之前，博主曾尝试过使用SpringBoot + JQuery编写了一个包含博客功能的[网站](https://github.com/YupaiTS/footprints)，由于这种运行于Java环境的项目正式部署到线上比较麻烦，所以就舍弃了。<br />偶然间发现了hexo搭配GitHub Pages可以快速搭建一个博客网站，心中甚是欢喜，立马就动手搭建了起来。在这里分享下使用这种方式搭建博客网站的过程。
## 环境搭建
### 安装git
进入[git官网](https://git-scm.com/)，下载安装git工具即可。
### 安装node.js
同样的，进入[node.js官网](https://nodejs.org/en/)，下载安装node.js工具即可。
### 安装hexo
hexo的安装需要node.js环境，在命令行中输入以下命令安装hexo-cli（hexo的命令行工具）。
```bash
npm install hexo-cli -g
```
## 使用hexo
### 创建本地hexo项目
```bash
hexo init blog  #使用hexo初始化blog项目
cd blog         #进入blog目录
npm install     #安装依赖
hexo server     #启动本地web服务，在浏览器输入localhost:4000预览博客
```
### 生成静态网站
```bash
hexo generate
```
生成静态网站后，项目的目录结构如下。
```
.deploy/        #需部署文件
node_modules/   #node.js依赖的插件
public/         #生成的静态网页文件
scaffolds/      #模版
source/         #博客正文和其他源文件
themes/         #主题
_config.yml     #全局配置文件
```
### 编辑_config.yml配置网站
```yaml
# Hexo Configuration     
## Docs: [https://hexo.io/docs/configuration.html](https://hexo.io/docs/configuration.html)     
## Source: [https://github.com/hexojs/hexo/](https://github.com/hexojs/hexo/)
# Site
title:  #标题
subtitle: #副标题
description:  #站点描述
author: #作者
language: zh-cn #语言
timezone:
# URL     
## If your site is put in a subdirectory, set url as ‘[http://yoursite.com/child](http://yoursite.com/child)‘ and root as ‘/child/‘
url:  #网址
root: /
permalink: :year/:month/:day/:title/ #文章的链接格式
permalink_defaults:
# Directory
source_dir: source #源文件目录
public_dir: public #生成的网页文件目录
tag_dir: tags #标签目录
archive_dir: archives #归档目录
category_dir: categories #分类目录
code_dir: downloads/code
i18n_dir: :lang
skip_render:
# Writing
new_post_name: :title.md #新文章标题
default_layout: post #默认模版，包括post、page、photo、draft（文章、页面、照片、草稿）
titlecase: false # Transform title into titlecase
external_link: true # Open external links in new tab
filename_case: 0
render_drafts: false
post_asset_folder: false
relative_link: false
future: true
highlight:  
  enable: true  
  line_number: true  
  auto_detect: false  
  tab_replace:
# Category
Tagdefault_category: uncategorized
category_map:
tag_map:
# Date / Time format     
## Hexo uses Moment.js to parse and display date     
## You can customize the date format as defined in     
## [http://momentjs.com/docs/#/displaying/format/](http://momentjs.com/docs/#/displaying/format/)
date_format: YYYY-MM-DD
time_format: HH:mm:ss
# Pagination     
## Set per_page to 0 to disable pagination
per_page: 10
pagination_dir: page
# Extensions     
## Plugins: [https://hexo.io/plugins/](https://hexo.io/plugins/)     
## Themes: [https://hexo.io/themes/](https://hexo.io/themes/)
theme: apollo #主题
# Deployment     
## Docs: [https://hexo.io/docs/deployment.html](https://hexo.io/docs/deployment.html)
deploy:  
  type: git  
  repo: 远程仓库地址  
  branch: master
```
### hexo命令行

- 常用命令
```
hexo help                   #查看帮助
hexo init                   #初始化一个目录
hexo new "postName"         #新建文章
hexo new page "pageName"    #新建页面
hexo generate               #生成网页，可在public目录查看
hexo server                 #本地预览
hexo deploy                 #部署.deploy目录
hexo clean                  #清除缓存，每次部署前都要删除.deploy目录
```

- 简写
```
hexo n == hexo new
hexo g == hexo generate
hexo s == hexo server
hexo d == hexo deploy
```
### 编辑文章
使用hexo new postName命令新建文章之后，可以在/source/_posts/目录下看到以postName命名的markdown文件，对该md文件进行编辑即可。
### 插件使用

- 添加rss订阅功能

安装hexo-generator-feed插件。
```
npm install hexo-generator-feed –-save
```
安装完成后，打开**_config.yml**文件进行配置。
```yaml
# Extensions
## Plugins: [http://hexo.io/plugins/](http://hexo.io/plugins/)     
#RSS订阅     
plugin:
- hexo-generator-feed
#Feed Atom
feed:
#可选项，可以不填
type: atom
path: atom.xml
limit: 20
```
打开当前主题的**_config.yml**文件，添加RSS订阅链接。
```yaml
Rss: /atom.xml
```
## GitHub Pages
### 注册GitHub帐号
进入[GitHub官网](https://github.com/)注册帐号。
### 创建代码仓库
使用注册的GitHub帐号登录之后，创建名称为username.github.io的仓库，这是特殊的命名约定。可以通过[http://username.github.io](http://username.github.io/)来访问个人主页。
### 使用SSH方式push代码到GitHub仓库
打开**Git Bash**工具，进入.ssh/目录，生成新的SSH key。
```bash
cd ~/.ssh
ssh-keygen -t rsa -C "Email地址"
```
之后会看到如下信息：
> Generating public/private rsa key pair.<br />Enter file in which to save the key (/Users/your_user_directory/.ssh/id_rsa):<回车就好>

回车之后会要求输入密码。
> Enter passphrase (empty for no passphrase):<输入加密串><br />Enter same passphrase again:<再次输入加密串>

如果输入的密码为空，在提交代码时系统不会弹出要求输入密码的弹框。<br />进入[GitHub](https://github.com/)， 点击头像进入`settings SSH and GPG keys New SSH key`选项，将公钥文件`~/.ssh/id_rsa.pub`的内容复制到Key里，点击`Add SSH key`按钮即可向GitHub添加SSH key。
## 部署hexo到GitHub Pages
### 配置代码仓库
打开 **_config.yml**文件，配置代码仓库。
```yaml
deploy:
  type: git
  repo: git@github.com:yourname/yourname.github.io.git
  branch: master
```
### 部署
打开**Git Bash**工具，输入以下命令部署hexo到GitHub Pages。
```bash
hexo clean  #清除缓存
hexo g      #生成网页文件
hexo d      #部署
```
生成SSH key的时候如果设置了密码的话，系统会弹窗提示输入密码，输入正确的密码即可完成部署。
### 查看
进入[GitHub Pages](https://yupaits.github.io/)可以查看博客。如果有自己的域名的话，可以在 GitHub 的项目`settings -> GitHub Pages -> Custom Domain`中填写个人博客域名保存，并将个人博客域名以 **CNAME** 方式解析到`yupaits.github.io`即可在自己的博客域名中浏览博客。如果不想每次`hexo d`部署博客之后都去 GitHub Pages 中修改域名，可以在`sources`目录下新建一个名为`CNAME`的文件，并用文本编辑器打开该文件输入博客域名保存即可。
