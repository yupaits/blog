# yupan-data数据存储

yupan-data会按照资源类别将资源相关数据存储在不同的表中，例如：图片资源存储在`yd_picture`表中，小说资源存储在`yd_novel`表中。

资源公共信息：

- `id`: 资源ID
- `status`: 资源状态
- `crawlerJobId`: 采集任务ID
- `cleanerJobId`: 清洗任务ID
- `cleanTimes`: 清洗次数

以下是各类别资源的信息说明。

### 图片

- `id`: 资源ID
- `name`: 图片名称
- `description`: 图片描述
- `cate`: 图片分类
- `tags`: 标签
- `rarity`: 资源稀有度
- `multiple`: 是否套图
- `mainPic`: 主图地址
- `originMainPic`: 主图原图地址
- `previewPics`: 预览套图地址（仅适用于套图）
- `originPics`: 原图套图地址（仅适用于套图）
- `downloadUrl`: 打包下载地址
- `status`: 资源状态
- `crawlerJobId`: 采集任务ID
- `cleanerJobId`: 清洗任务ID
- `cleanTimes`: 清洗次数

### 小说

待补充...

### 电影

- `id`: 资源ID
- `name`: 电影名称
- `description`: 电影简介
- `cate`: 电影分类
- `tags`: 标签
- `rarity`: 资源稀有度
- `poster`: 电影海报
- `magnet`: 磁力链
- `bittorrent`: BT种子
- `movieOrigin`: 电影产地
- `year`: 电影年份
- `downloadUrl`: 打包下载地址
- `status`: 资源状态
- `crawlerJobId`: 采集任务ID
- `cleanerJobId`: 清洗任务ID
- `cleanTimes`: 清洗次数

### 动漫

待补充...

### 音乐

待补充...

### 有声读物

1. 读物信息

- `id`: 有声读物资源ID
- `name`: 名称
- `description`: 内容简介
- `cate`: 分类
- `tags`: 标签
- `rarity`: 资源稀有度
- `poster`: 海报
- `author`: 作者
- `castMember`: 演播员
- `serialStatus`: 连载状态
- `episodeNumber`: 集数
- `castDescription`: 演播简介
- `downloadUrl`: 打包下载地址

2. 剧集信息

- `id`: 资源ID
- `bookId`: 有声读物资源ID
- `no`: 序号
- `title`: 标题
- `originAudio`: 原音频地址
- `totalSize`: 资源总大小
- `progressSize`: 资源已下载大小
- `downloadUrl`: 下载地址
- `status`: 资源状态
- `crawlerJobId`: 采集任务ID
- `cleanerJobId`: 清洗任务ID
- `cleanTimes`: 清洗次数

### 视频

待补充...