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

### 小说

待补充...

### 电影

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

### 动漫

待补充...

### 音乐

待补充...

### 有声读物

待补充...

### 视频

待补充...