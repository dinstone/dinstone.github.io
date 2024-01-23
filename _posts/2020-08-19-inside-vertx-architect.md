---
layout: post
title:  "深入浅出 Vert.x 架构"
categories: 框架
tags:  vert.x netty
author: dinstone
---

* content
{:toc}


**Vert.x** 是在 JVM 上构建响应式应用（reactive application）的工具集。Vert.x 是事件驱动的和非阻塞的，这意味着应用程序可以使用少量内核线程就可以处理很多并发。本文基于 [Vertx](https://vertx.io/) 3.4 版本讲解。

## Vert.x 特性

* 响应式的(Responsive)：一个响应式系统需要在合理的时间内处理请求。

* 弹性的(Resilient)：一个响应式系统必须在遇到异常（崩溃，超时， 500 错误等等）的时候保持响应的能力，所以它必须要为异常处理而设计。

* 可伸缩的(Elastic)：一个响应式系统必须在不同的负载情况下都要保持响应能力，所以它必须能伸能缩，并且可以利用最少的资源来处理负载。

* 消息驱动(Message driven)：一个响应式系统的各个组件之间通过 "异步消息传递" 来进行交互。

* 多种语言支持：只要能运行在 JVM 上的语言，基本都支持。

* 简单的并发模型：就像写单线程代码一样简单，多线程并发由 Vertx 控制。

* 集群支持：在同一个 Vertx 实例中各个 Verticle 实例间可以通过 Event Bus 通信。同时在同一个 Vertx 集群也支持跨进程的 TCP Event Bus。

* Vertx 使用 Netty4 处理所有的网络 IO。

## 概念模型

![概念模型图]({{site.url}}/img/vertx/cmd.png)

通常，一个进程会创建一个 Vert.x 实例，Vert.x 负责部署 Verticle 和管理运行时资源。Verticle 实例之间可通过 EventBus 发送异步消息来通讯，发送来的消息由 Verticle 中注册的 Handler 处理。

在集群模式下，通过 ClusterManager 可发现远程 Verticle，EventBus 从而可将消息路由到远程 Verticle。

## 运行架构


![运行架构图]({{site.url}}/img/vertx/rmd.png)

Vertx 的 AcceptorEventloopGroup 只有 1 个 AcceptorEventloop，即通过 1 个线程监听所有客户端的连接，连接建立后会交由 VertxEventLoopGroup 中的一个 EventLoop 来处理。

Vertx 可以将 server(HttpServer,TcpServer,UdpServer)部署在多个 verticle 实例中，这些 verticle 实例共享这个 server。AcceptorEventloop 监听和处理连接事件，但 NIO 读写事件的触发和处理都在 VertxEventLoopGroup 的 EventLoop 中执行。

每部署 1 个 verticle 实例，都会为该 verticle 创建 1 个执行 context（每个 context 都绑定一个 EventLoop 和 Handler 处理线程），传入的业务 request 事件都在此 context 对应的 Handler 处理线程中执行。

对于标准模式的 verticle，context 对应的 Handler 处理线程就是该 verticle 绑定的 EventLoop 线程；对于 worker 模式的 verticle，context 对应的 Handler 处理线程是 worker 线程。因此，对于标准模式 verticle，编解码 handler、request handler 都在 context 绑定的 EventLoop 中执行；对于 worker 模式 verticle，编解码 handler 会在 context 绑定的 EventLoop 中执行，但 request handler 会在 context 对应的 worker 线程中顺序的执行。

任何 verticle 中通过 excuteBlocking 方法提交的任务，都会由 worker 线程池执行；

当部署的 verticle 数量小于 VertxEventLoopGroup 的 EventLoop 数量时，会造成部分 EventLoop 空闲；当部署的 verticle 数量大于 VertxEventLoopGroup 的 EventLoop 数量时，多个 verticle 可能绑定同一个 EventLoop。
