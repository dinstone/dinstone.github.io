# dinstone's Blog

个人博客项目, fork自大佬HyG。

做了一些个人改动。这里记录下各个文件的用途, 也帮助别的像我一样的后端迅速上手。

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

算是收藏集合, 位于/page/3collections.md

直接在中间内容部分按照markdown形式更改即可。一般使用简介+链接的形式记录。

## 6 Projects

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