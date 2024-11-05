---
layout: post
title:  "古董机做成Ubuntu服务器"
categories: Ubuntu
tags:  ubuntu
author: dinstone
---

* content
{:toc}

# 背景

自从上次把我的古董笔记本电脑X201i升级后，一直安装的是Ubuntu桌面系统。今天突发奇想装个Gitlab玩玩，在安装docker镜像时发现，系统待机状况下CPU资源负载就高达23%左右，4G的内存仅剩1.5G了，这怎么行呢。

后来想反正以后也是当服务器用了，不如装个Linux的服务器版，鉴于Ubuntu的成功安装经验，所以直接下载Ubuntu的server版得了，省的再倒腾其他OS了，可没想到，安装过程也是一波三折，费了不少时间，不过结果是喜人的，谨记如下，分享之。

# 安装过程

1. 首先去官网下载最新的Ubuntu服务器版：ubuntu-22.04.2-live-server-amd64.iso。地址：https://ubuntu.com/download/server 。

2. 使用Rufus制作Ubuntu的USB启动盘。Rufus很小，无需安装，随下随用，引导类型选择刚下载的ubuntu server ISO文件，其余默认即可，然后开始制作中，大约十分钟即可完成。也可以参考：https://zhuanlan.zhihu.com/p/498100251 。

3. 有了USB的安装盘，安装过程就很简单了，一路可以默认，选择“done”就行。具体安装过程也可参考: https://blog.csdn.net/weixin_43824829/article/details/126975368 。


# 系统设置

## 1. Wifi设置

安装过程中，可以设置WiFi，如果跳过了设置，可以在系统安装完后进行设置。

  * 查看无线网卡名字

    ifconfig -a 或 ip a

  * 安装WPA2加密工具
    
    sudo apt-get install wpasupplicant

    sudo apt-get install network-manager

  * 修改wifi配置文件

    cd /etc/netplan/
    
    sudo vim /etc/netplan/00-intaller-config-wifi.yaml

  * wifi配置文件是yaml格式的，注意格式，给你的无线网卡“wlp2s0”添加如下内容SSID信息：

  ```yaml
  network:
    version: 2
  wifis:
      wlp2s0:
          dhcp4: true
          access-points:
              "wifi ssid":
                  password: "wifi 密码"
          addresses: [192.168.1.120/24]
          optional: true
  ```

  * 验证和应用设置

```
    sudo netplan try
    sudo netplan apply
```

  * 更多参考：

    > https://blog.csdn.net/weixin_44244400/article/details/125116027
    > https://www.dandelioncloud.cn/article/details/1595000146184294401

## 2. CPU过高的问题

系统安装成功后，CPU负载和内存占用确实下来了，但是只要SSH一连接，CPU就飙升到20%以上，top查看发现是systemd-logind进程做怪，网上也有很多类似的问题。既然找到了罪魁后手，那就解决systemd-logind占用cpu过高的问题。参考网友的方法直接停止该服务就行：https://www.landui.com/help/show-3135 

执行如下命令搞定：

```
// 停止该服务

  sudo systemctl stop systemd-logind
  
// 永久停用该服务

  sudo systemctl mask systemd-logind
```

## 3. 时间设置

ubuntu server设置时区和更新时间：

  * 查看时区

    date -R

  * 调整时区
    
    sudo cp /usr/share/zoneinfo/Asia/Shanghai  /etc/localtime

## 4. 盒盖不睡眠

编辑配置文件：

```
sudo vim /etc/systemd/logind.conf
```

默认是这三种模式：

```
HandleLidSwitch=suspend                     盒盖后挂起
HandleLidSwitchExternalPower=suspend        连接外接电源时，盒盖后挂起
HandleLidSwitchDocked=ignore                连接到扩展坞时，盒盖后无动作
```

修改为：

```
HandleLidSwitch=ignore                 
HandleLidSwitchExternalPower=ignore
HandleLidSwitchDocked=ignore
```

如果需要，你可以根据自己的喜好将这些参数的值更改为其中之一：

​​suspend​​：合盖时挂起

​​lock​​：合盖时锁定

​​ignore​​：什么都不做

​​poweroff​​：关机

​​hibernate​​：合盖时休眠

# 参考

  * https://blog.csdn.net/endswell/article/details/126656840

  * https://www.shuzhiduo.com/A/Ae5R4gR7zQ/
