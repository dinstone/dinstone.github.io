---
layout: post
title:  "Apache Mina 和 Netty 的历史"
categories: 框架
tags:  netty mina
author: dinstone
---

* content
{:toc}


**Apache Mina 和 Netty 是 java 平台下很好用的网络编程框架，可以帮助我们快速开发高性能、高扩展性的网络通信应用。了解他们的历史和演变历程有助于我们更深入的理解和使用框架。**

## Mina 简介

Apache Mina 是一个很受欢迎的网络通信应用框架。Mina 可以帮助我们快速开发高性能、高扩展性的网络通信应用，Mina 主要是对基于 TCP/IP、UDP/IP 协议栈提供了事件驱动、异步操作（异步 IO 默认使用的是 JAVA NIO 作为底层支持）的编程模型。

## Netty 简介

Netty 是一个高性能、异步事件驱动的 NIO 框架，它提供了对 TCP、UDP 和文件传输的支持，作为一个异步 NIO 框架，Netty 的所有 IO 操作都是异步非阻塞的，通过 Future-Listener 机制，用户可以方便的主动获取或者通过通知机制获得 IO 操作结果。

作为当前最流行的 NIO 框架，Netty 在互联网领域、大数据分布式计算领域、游戏行业、通信行业等获得了广泛的应用，很多业界著名的开源组件也都基于 Netty 框架构建。

## 历史

**2004 年 6 月 Netty2 发布**

    2004 年 6 月 Netty2 的 1.0 版本发布，这是在 java 社区中第一个基于事件驱动的应用网络框架。

    Maven 仓库最后版本：1.9.2 ：net.gleamynode:netty2:1.9.2

**2005 年 5 月 Mina 发布**

    2005 年 5 月官方发布了第一个版本 mina 0.7.1，并在 ApacheDS 项目中使用。

    2006 年 10 月 Mina 发布 1.0.0 版本。

    2010 年 9 月 Mina 发布 2.0.0 版本。

**2008 年 Netty3 发布**

    2008 年 10 月 jboss 发布 Netty3.0.0 版本。

**2013 年 Netty4 发布**

    2013 年 7 月 Netty（netty.io）发布 4.0.0 版本。

## 参考

http://www.theserverside.com/discussions/thread/26416.html

http://www.theserverside.com/discussions/thread.tss?thread_id=33969

http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22netty2%22

http://mina.apache.org/mina-project/index.html

http://archive.apache.org/dist/mina/

http://netty.io/wiki/related-articles.html