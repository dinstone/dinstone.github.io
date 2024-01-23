---
layout: post
title:  "真正的异步 API 网关 Agate"
categories: 框架
tags:  vert.x gateway agate
author: dinstone
---

* content
{:toc}


## 背景

自4年前结识[Vert.x](https://vertx.io/)以来，我已在多个项目中领略了其强大功能，尽管遭遇过一些挑战，但我对它的喜爱有增无减。Vert.x基于Netty的异步编程模型，其高效性让人联想到Nginx的编程模型。因此，我萌生了一个想法：是否能在JVM平台上打造一款类似于Kong（基于Nginx）的高性能异步API网关？尽管JVM上已有zuul和spring cloud gateway等杰出的产品，但我对于亲手打造API网关的热情始终未减。

在新冠疫情爆发期间，花了2周时间写了一个基于Vert.x的基本可用的API网关Agate，借此正好填补空虚失落的焦虑，抚慰一下多愁善感的心灵。下面介绍一下微服务架构下分布式API网关的架构和实现效果，更多细节可以参看源码：Agate。

在新冠疫情的严峻时期，我投入两周时间研发了一款基于Vert.x的API网关——[Agate](https://github.com/dinstone/agate)。这款产品虽尚显基础，但已具备实用价值，为我排遣了那段焦虑与迷茫的时光。其设计灵感源自微服务架构，旨在为分布式系统提供强大的API管理支持。如需深入了解其架构细节和实现效果，敬请参阅[Agate](https://github.com/dinstone/agate)的源代码。

## 架构

![运行架构图]({{site.url}}/img/vertx/agate-rmd.png)

**Agate由2部分组成：**

**Agate-Manager：**

    管理API的定义、配置信息，将这些信息持久化到数据库中，同时将要发布的API配置推送到Consul中。

    为了快速原型，当前使用spring mvc + jsp页面来实现的UI页面，功能实现比较糙，有待改进。

**Agate-Gateway：**

    监听Consul中API配置的变更，执行API的部署和启停，同时接受API客户端的请求，并根据API定义做路由处理，期间会执行日志、限流、熔断、认证、缓存等增强处理。

    Gateway使用了Vert.x框架，全异步流程处理，抽象了BeforeHandler、RouteHandler、AfterHandler、FailureHandler处理过程。

![组件架构图]({{site.url}}/img/vertx/agate-rmd.png)

## 系统依赖

Vert.x 4.0 和 Consul 1.7

## 特性列表

黑白名单 BlackWhiteList    待实现

流量限制 RateLimit    已实现

日志 Logging    已实现

追踪 Tracing    已实现

度量 Metrics    已实现

安全 Security    待实现

熔断 CircuitBreaker    已实现

灰度发布 GrayDeployment    待实现

路由 Routing    已实现


## 结语

限于时间和水平，很多地方实现的不是太好，后续还要持续完善。对于正在学习网络编程的同学来说，Vert.x是个不可多得好工具；对于研究高性能网关实现的同学来说，Agate是个不（言）可（过）多（其）得（实）的参考。
