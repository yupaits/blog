---
title: Markdown语法
---

引用自：Te_Lee的 [Markdown——入门指南](http://www.jianshu.com/p/1e402922ee32)

Markdown 是一种轻量级的「标记语言」，它的优点很多，目前也被越来越多的写作爱好者，撰稿者广泛使用。看到这里请不要被「标记」、「语言」所迷惑，Markdown 的语法十分简单。常用的标记符号也不超过十个，这种相对于更为复杂的 HTML 标记语言来说，Markdown 可谓是十分轻量的，学习成本也不需要太多，且一旦熟悉这种语法规则，会有一劳永逸的效果。

<!--more-->

## 语法简要规则

### 标题

![Markdown标题](http://ww1.sinaimg.cn/large/6aee7dbbgw1effeaclhiyj20eh09cwez.jpg)

每篇文章都离不开标题，层次分明的标题可以让文章的结构清晰明了，让读者能快速抓住行文脉络。

`# 一级标题`  
`## 二级标题`  
`### 三级标题`

以此类推，最多可以到六级标题，#号后的空格可加可不加，规范的写法是加上一个空格。

### 列表

![Markdown列表](http://ww4.sinaimg.cn/large/6aee7dbbgw1effew5aftij20d80bz3yw.jpg)

无序列表在文字需要前加上 `-` 或者 `*`；而有序列表则需要在文字前加上 `1. ` ，注意空格，这里的数字1并不是固定写死的，使用任意数字都可以。

### 引用

![Markdown引用](http://ww3.sinaimg.cn/large/6aee7dbbgw1effezhonxlj20e009c3yu.jpg)

当你需要引用其他地方的一段文字时，需要用到引用的格式，在文本前加上 `>`。

> 青年的朝气倘已消失，前进不己的好奇心已衰退以后，人生就没有意义。 ——穆勒

### 图片与链接

![Markdown图片与链接](http://ww2.sinaimg.cn/large/6aee7dbbgw1efffa67voyj20ix0ctq3n.jpg)

插入链接与插入图片的语法很相似，区别在一个 `!` 号。  
图片： `![描述](url)`  
链接： `[描述](url)`

图片的地址一般需要**图床**工具或服务生成URL地址。

### 粗体与斜体

用两个`*`包含一段文本即可显示该段文本的黑体，类似的，用一个`*`或者`_`包含则可以显示斜体。

**粗体** _斜体_

### 删除线

用两个`~`包含一段文本即可在该段文本上显示删除线。

~~标记删除的文本~~ 

### 代码框

![Markdown代码框](http://ww3.sinaimg.cn/large/6aee7dbbgw1effg1lsa97j20lt0a8dgs.jpg)

用两个 ` 把中间的代码段包裹起来即可让代码段显示在代码框里。

`Hello, world!`

多行代码可以用三个 ` 前后包裹，加上编程语言类型可以使代码正确地显示语法高亮。
  
```java
public static void main(String[] args) {
    System.out.println("Hello, world!");
}
```

使用`tab`进行缩进。

### 分割线

分割线的语法只需要三个`*`号。

***

### 表格

下面上表格语法的一个例子。

```
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
```

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

### 折叠块

使用 `<details>` 标签表示一个可以折叠的块。

```
<details>
    <summary>折叠块展示的标题</summary>
    <p>折叠块的内容</p>
    Hello, Wrold!
</details>
```

<details>
    <summary>折叠块展示的标题</summary>
    <p>折叠块的内容</p>
    Hello, Wrold!
</details>

### GitHub的checkbox列表

在列表符号（即 `-` 或者 `*`）后面加上 `[x]` 或者 `[ ]`（注意中间的空格） 表示选中或者未选中的checkbox。

```
- [x] Java
- [x] JavaScript
- [x] HTML
- [x] CSS
- [ ] C++
- [ ] Go
```

- [x] Java
- [x] JavaScript
- [x] HTML
- [x] CSS
- [ ] C++
- [ ] Go

## 相关推荐

### 工具

#### Markdown编辑器

- [MarkdownPad](http://markdownpad.com/)
- [Mou](http://mouapp.com/)
- [CuteMarkEd](http://cloose.github.io/CuteMarkEd)
- [MarkPad](http://code52.org/DownmarkerWPF/)
- [Haroopad](http://pad.haroopress.com/user.html)

#### 图床工具

- [Droplr](http://droplr.com/)  
- [Cloudapp](http://www.getcloudapp.com/)  
- [ezShare for Mac](https://itunes.apple.com/cn/app/yi-xiang/id672522335?mt=12&uo=4)  
- [围脖图床修复计划](http://weibotuchuang.sinaapp.com/)  

下图介绍了图床的用途。

![图床](https://pic2.zhimg.com/v2-f0c54b4b142546767d920f7fb488cf81_b.jpg)

### 文章

> 官方文档  
> [创始人 John Gruber 的 Markdown 语法说明](http://daringfireball.net/projects/markdown/syntax)  
> [Markdown 中文版语法说明](http://wowubuntu.com/markdown/)

- [为什么作家应该用 Markdown 保存自己的文稿](http://www.jianshu.com/p/qqgjln)  
- [Markdown写作浅谈](http://www.yangzhiping.com/tech/r-markdown-knitr.html)  
- [Markdown 工具补完](http://www.appinn.com/markdown-tools/)  
- [Drafts + Scriptogr.am + Dropbox 打造移动端 Markdown 风格博客](http://jianshu.io/p/63HYZ6)  
- [为什么我们要学习Markdown的三个理由](http://news.cnblogs.com/n/139649/)  
- [Markdown 语法写作入门指南 by ibuick](http://ibuick.me/?p=4093)


