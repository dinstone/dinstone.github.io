---
layout: post
title:  "面向领域的六边形架构"
categories: 方法论
tags:  方法论 六边形架构
author: dinstone
---

* content
{:toc}

## DOHA 

DOHA (Domain-Oriented Hexagonal Architecture) 面向领域的六边形架构的核心在于使用领域驱动设计（DDD）的思想来设计和组织业务逻辑，并结合六边形架构的端口适配器模式来实现业务逻辑与外部接口的分离，为构建健壮、可维护、可扩展的复杂应用系统提供了有力的支持。

![六边形架构]({{site.url}}/img/arch/ha.jpg)

2005 年，Alistair Cockburn 提出的六边形架构，将应用程序巧妙地划分为内部的业务逻辑层和外部的适配器层。内部聚焦于业务逻辑，而外部具有一个或多个入站适配器（而不是表示层），通过调用业务逻辑来处理来自外部的请求。同样，外部具有一个或多个出站适配器（而不是数据持久层），业务逻辑调用这些出站适配器来访问外部应用程序。

为了解耦内部和外部之间的依赖，业务逻辑层抽象出端口来应对业务逻辑与外部的交互，这些端口实质上代表了一种协议，通常以接口 API 的形式呈现。

六边形架构的一个重要好处是业务逻辑不依赖于表示层逻辑或数据访问层逻辑。它将业务逻辑与适配器中包含的表示层和数据访问层的逻辑分离开来。由于这种分离，单独测试业务逻辑就容易得多了。

六边形架构的另一个好处是它是描述微服务架构中每个服务的架构的好方法。可以通过多个适配器调用业务逻辑，每个适配器实现特定的 API 或用户界面。业务逻辑还可以通过端口调用多个适配器，每个适配器调用不同的外部系统。

六边形架构以业务为核心，解耦外部依赖，分离了业务复杂度和技术复杂度等。然而，六边形架构本身并不涉及内部业务逻辑的设计模式，因此在落地过程中，需要我们自己选择业务逻辑的设计模式。通常，对于简单应用可以选择面向事务脚本模式来组织业务逻辑，而对于复杂应用来说，面向领域建模模式是首选。

## 逻辑架构

![逻辑架构]({{site.url}}/img/arch/doha-l.jpg)

DOHA 架构将应用细化为五个分层： Inbound Adapter 层、Inbound Port 层、Domain 层、Outbound Port 层、Outbound Adapter层。

 Inbound Adapter层和 Outbound Adapter层作为适配器层，依赖业务层（Inbound Port 层，Outbound Port 层和 Domain 层）。

## 实现架构

![实现架构]({{site.url}}/img/arch/doha-p.jpg)

DOHA 将工程分为：

- doha-handler：应用程序入口，入站适配器实现都在这里，负责处理外部请求，依赖其它工程。

- doha-interface：提供给第三方应用依赖的编程接口，如 RPC、Event、MQ 等，不依赖其它工程。

- doha-invoker：出站适配器实现都在这里，负责调用外部系统，依赖 doha-business 工程。

- doha-business：业务逻辑实现的地方，包括入站端口服务、领域模型、出站端口接口，不依赖其它工程。

## 快速开始

1. 安装DOHA工程模板

``` shell
git clone https://github.com/dinstone/doha.git

cd doha/doha-archetype/

mvn clean install
```

2. 应用模板创建工程

``` shell
mvn archetype:generate  -DarchetypeGroupId=io.doha.template  -DarchetypeArtifactId=doha-template-archetype  -DarchetypeVersion=2.0.0 -DgroupId=demo.service -DartifactId=order-service -Dpackage=demo.service.order
```

## 模板工程

Java : https://github.com/dinstone/doha
Go   : https://github.com/dinstone/doha-go
