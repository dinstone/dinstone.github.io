---
layout: post
title:  "Github博客搭建"
categories: 建站
tags:  blog docker jekyll github
author: dinstone
---

* content
{:toc}


> 样板博客网址为 [Shen-Xmas’s Blog](https://shen-xmas.github.io/)

## 搭建Github博客运行环境

首先在Github上建立一个博客仓库。其实只要把 [博客代码(点击跳转)](https://github.com/shen-xmas/shen-xmas.github.io/) fork下来, 仓库名改为自己的 {{site.github_username}}.github.io 就可以了。

接着按照Shen-Xmas的博客指南修改配置后，提交到Github就可以访问 {{site.github_username}}.github.io 预览了。


## 搭建Github博客开发环境

搭建好了博客，我们就可以开始写blog了，但每次写完后需要提交到Github上后，才能预览。如果能在本地搭建一个开发环境，可以很及时的预览，及早发现问题，那是多么的方便啊！

上面创建的Github博客，其实是基于Github的pages功能实现的，而Github的pages功能又基于jekyll技术，所以很自然的在本地构建一个jekyll环境就能解决问题了。当然，在现在一切可docker的时代，最快的方法还就是使用docker镜像构建jekyll的开发环境了。

- 下载仓库
```
  cd /Users/dinstone/git
  git clone https://github.com/dinstone/dinstone.github.io
```
- 下载镜像
```
  docker pull jekyll/jekyll
```
- 构建环境
```
  docker run -it -p 4000:4000 -v /Users/dinstone/git/dinstone.github.io/:/srv/jekyll/ --name=jekyll_blog jekyll/jekyll  bash
  在shell中执行启动命令：jekyll server -w
  如果发现错误： `require': cannot load such file -- webrick (LoadError)，请执行如下命令：
  gem install webrick
```
- 开发测试

  1.启动服务：jekyll server -w
  ```
  ruby 3.1.1p18 (2022-02-18 revision 53f5fc4236) [x86_64-linux-musl]
  Configuration file: /srv/jekyll/_config.yml
              Source: /srv/jekyll
        Destination: /srv/jekyll/_site
  Incremental build: disabled. Enable with --incremental
        Generating... 
                      done in 0.513 seconds.
  Auto-regeneration: enabled for '/srv/jekyll'
      Server address: http://0.0.0.0:4000/
    Server running... press ctrl-c to stop.
  ```
  2.访问 http://0.0.0.0:4000/，就能看到blog了。

  3.编辑blog，在_posts目录下编辑blog后，会自动更新到站点。
  ```
        Regenerating: 1 file(s) changed at 2023-01-29 05:37:50
                      _posts/2022-11-21-myblog-tutorial.md
                      ...done in 1.527379098 seconds.
                      
        Regenerating: 1 file(s) changed at 2023-01-29 06:11:56
                      _posts/2022-11-21-myblog-tutorial.md
                      ...done in 0.494004279 seconds.
  ```