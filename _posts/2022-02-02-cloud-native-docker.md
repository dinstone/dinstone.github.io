---
layout: post
title:  "云原生 docker 搭建开发环境"
categories: 云原生
tags:  cloud-native kubernetes docker
author: dinstone
---

* content
{:toc}

# 基础知识

* 目前常用的 Linux 发行版主要包括 Debian/Ubuntu 系列和 CentOS/Fedora 系列。前者以自带软件包版本较新而出名，后者则宣称运行更稳定一些。选择哪个操作系统取决于使用者的具体需求。
* docker 是linux容器技术的开源实现。通讯底层基于iptables，firewalld也是对iptables的封装。
* docker-compose 是单机容器编排工具。
* docker-swarm 跨机器进行容器编排。
* kubernetes 作为云原生操作系统，用于管理大量容器的管理、编排、部署工作。

# docker安装

[linux docker 安装](https://blog.csdn.net/u010800804/article/details/109594890)

```
sudo groupadd docker     #添加docker用户组
sudo usermod -aG docker $USER      #将登陆用户加入到docker用户组中
newgrp docker     #更新用户组
docker ps    #测试docker命令是否可以使用sudo正常使用
```

[docker 常用命令](https://blog.csdn.net/lihongbao80/article/details/108019773?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-108019773-blog-126176819.235%5Ev27%5Epc_relevant_landingrelevant&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-108019773-blog-126176819.235%5Ev27%5Epc_relevant_landingrelevant&utm_relevant_index=1)

[docker DNS实现](https://www.ucloud.cn/yun/129499.html)

[docker容器的DNS ](https://www.cnblogs.com/wangguishe/p/15630748.html)

[docker最佳实践](https://docker-practice.github.io/zh-cn/)

# portainer安装

[portainer 安装](https://www.portainer.io/)，portainer是一个非常好用的docker管理工具。

docker run -d -p 9000:9000 --restart=always -v /var/run/docker.sock:/var/run/docker.sock --name portainer portainer/portainer


# ElasticSearch安装

docker run -d -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e ES_JAVA_OPTS="-Xms512m -Xmx512m" --name es -v /home/tuding/docker/elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml -v /home/tuding/docker/elasticsearch/plugins:/usr/share/elasticsearch/plugins elasticsearch:7.6.2

# cerebro安装

cerebro 是一个好用的ES web admin工具。

docker run -p 9000:9000 --name cerebro lmenezes/cerebro

# busybox安装

BusyBox 是一个集成了一百多个最常用 Linux 命令和工具（如 cat、echo、grep、mount、telnet 等）的精简工具箱，它只需要几 MB 的大小，很方便进行各种快速验证，被誉为“Linux 系统的瑞士军刀”。

BusyBox 可运行于多款 POSIX 环境的操作系统中，如 Linux（包括 Android）、Hurd、FreeBSD 等。

docker run -d --name=shell  --privileged busybox

# ubuntu安装
docker run --cap-add=NET_ADMIN -it ubuntu

sudo update-alternatives --config iptables

apt update -y

apt-get install iptables sudo -y

sudo iptables -L -n

cat /etc/resolv.conf

[Ubuntu 安装netstat网络工具](https://blog.csdn.net/benchi400/article/details/103656902)

# Alpine安装

Alpine 操作系统是一个面向安全的轻型 Linux 发行版。它不同于通常 Linux 发行版，Alpine 采用了 musl libc 和 busybox 以减小系统的体积和运行时资源消耗，但功能上比 busybox 又完善的多，因此得到开源社区越来越多的青睐。在保持瘦身的同时，Alpine 还提供了自己的包管理工具 apk，可以通过 https://pkgs.alpinelinux.org/packages 网站上查询包信息，也可以直接通过 apk 命令直接查询和安装各种软件。

docker run -it --cap-add=NET_ADMIN alpine /bin/sh

apk update

apk add iptables

iptables -L

cat /etc/resolv.conf

