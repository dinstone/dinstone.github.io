---
layout: post
title:  "深入理解kubernetes架构设计"
categories: k8s
tags:  k8s docker
author: dinstone
---

* content
{:toc}


## 概述

随着互联网技术的飞速发展，微服务架构成了当下各个企业的标准开发模式，在微服务落地的过程中，容器化应用部署成了首选，随着业务的发展，系统中的容器越来越多。于是，容器的资源调度，部署运行，扩容缩容就成了我们要面临的问题。

我们都知道，当下 Kubernetes 作为容器集群的管理平台被广泛应用，但是，您可能并不了解它的组件以及这些组件的交互方式，不能很好的理解它的设计原理，也就不能理解它为什么是一个用于大规模运行分布式应用和服务的开源容器编排平台。

## 技术定位

Kubernetes（简称k8s）是一个开源的容器编排平台，由Google发起并开源。它用于自动化容器化应用程序的部署、扩展和管理。Kubernetes支持多种容器运行时技术，其中最为广泛使用的就是Docker。通过Kubernetes，我们可以对容器进行分布式管理，实现容器的高可用、弹性伸缩和故障恢复等功能。

![msc]({{site.url}}/img/k8s/msc.png)

Kubernetes 是一个多语言的通用容器管理平台，能够运行本地云和传统的容器化应用程序。但是随着能力不断增强，逐渐的覆盖了所有微服务关注点，成为了下一代构建云原生技术中台的基础平台。

![msa]({{site.url}}/img/k8s/msa.png)

![msk]({{site.url}}/img/k8s/msk.png)


## 设计原则

Kubernetes 设计基于 3 个原则：

1. 安全。它应遵循最新的安全最佳实践。
2. 易用。它应能通过一些简单的命令进行操作。
3. 可扩展。不应偏向于某一个提供商，而是能通过配置文件进行自定义。

## 架构设计

![msa]({{site.url}}/img/k8s/k8s.jpg)

Kubernetes 集群是用来管理容器集群的平台。既然是管理集群，那么就存在控制节点和计算节点，在这些节点上运行着控制面相关的组件和计算面相关的容器应用。

其中控制节点，即Master节点，负责管理和控制集群节点，由3个紧密协作的组件组成，分别是负责API服务的kube-api-server、负责调度的 kube-scheduler、负责容器编排的 kube-controller-manager。整个集群的持久化数据，则由 kube-apis-erver 处理后保存在 etcd 中。

其中计算节点，即Worker节点，会运行一个名为kubelet的控制面核心组件。kubelet组件主要负责同容器运行时（比如docker）交互，交互通过一个称作CRI（Container Runtime Interface）的远程调用接口，该接口定义了容器运行时的各项核心操作，比如启动一个客器需要的所有参数。

这也是为何 Kubernetes 项目并不关心你部署的是什么容器运行时、使用了什么技术实现，只要你的容器运行时能够运行标准的容器镜像，它就可以通过实现 CRI 接入 Kubernetes 项目。

## 运行原理

我们通过 Master 对每个Worker节点发送命令。简单来说，Master 就是管理者，Worker 就是被管理者。

Worker 可以是一台机器或者一台虚拟机。在 Worker 上面可以运行多个 Pod，Pod 是 Kubernetes 管理的最小单位，同时每个 Pod 可以包含多个容器（Docker）。