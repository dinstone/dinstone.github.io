---
layout: post
title:  "github博客搭建"
categories: 前端
tags:  前端
author: dinstone
---

* content
{:toc}


> 样板博客网址为 [dinstone's blog](https://dinstone.github.io/)

## 首先搭建起一个github博客

首先建立一个个人博客github仓库。其实只要把 [博客代码(点击跳转)](https://github.com/dinstone/dinstone.github.io/) fork下来, 仓库名改为自己的{{github.username}}.github.io就可以了。

fork下来项目以后别忘了看看 代码仓库-Settings-Pages的Branch等设置好没有。

大概等待几分钟看到settings-pages出现如下图标则表示已搭建成功, 可以通过其中的url访问了。

![搭建成功的page示例](https://s3.uuu.ovh/imgs/2022/11/24/861297a7040b780f.png)

然后根据以下做需要的改造即可:

(Ps: 原本fork自大佬HyG, 做了一些个人改动。这里记录下各个文件的用途, 也帮助像我一样很少接触前端的后端迅速上手。)

---



## 1 左上角标题及简介以及下方的介绍

变量都位于_config.yaml文件,直接修改即可。
- title 左上角标题
- brief-intro 左上角简介
- description_footer 下方的小字

## 2 评论和访客数

评论使用的是Disqus插件。访问量使用的百度统计。不是放在逻辑里用代码写的。

注册自己对应的账号ID等.. 直接在_config,yaml中修改对应变量即可。

## 3 文章

文章都放置在_posts中, 需要按特定格式书写, 是markdown格式。

## 4 Home Archives Categories 和 Tags

![tags等位置示例](https://s3.uuu.ovh/imgs/2022/11/24/139d0bfa6e825599.png)

这些的展现逻辑都已经写好了, 不用动。
- Archives是按照时间排序。
- Categories是按类别排序。
- Tags是按照tag过滤。
文章开头都会填写这些字段的值, 多字段直接空格隔开即可, 如:

```markdown
---
layout: post
title:  "填写需要的标题"
categories: Java Python Golang
tags:  Java Python Golang
author: dinstone
---

* content
{:toc}
```

然后接下来就可以按照markdown的格式书写内容了。

## 5 Collections

![Collections](https://s3.uuu.ovh/imgs/2022/11/24/140a871affd7855b.png)

算是收藏集合, 位于/page/3collections.md

直接在中间内容部分按照markdown形式更改即可。一般使用简介+链接的形式记录。

## 6 Projects

![demo](https://s3.uuu.ovh/imgs/2022/11/24/b75a0c5c84040aff.png)

主要用来介绍自己一些项目的地方。为了简单我的已经把图片展示去掉了。主要留文字简介和链接。

更改位置是/js/waterfall.js。在demoContent变量中增减值即可。按照字段内容填写。
```
{
  demo_link: 'https://github.com/dinstone/spring-boot-demo',
  code_link: 'https://github.com/dinstone/spring-boot-demo',
  title: 'Java Spring-Boot demos',
  core_tech: 'Java, Spring Boot, 各种中间件 ..',
  description: '适合初学者入门的一些demo, 个人的一些学习思考, 欢迎指正. 详情见 <a href ="https://github.com/dinstone/spring-boot-demo">这里</a>。'
}
```

## 7 About

主要用来介绍自己以及留下联系方式。更改位置位于/page/4about.md。