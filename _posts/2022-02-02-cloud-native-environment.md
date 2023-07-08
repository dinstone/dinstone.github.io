---
layout: post
title:  "云原生开发环境搭建"
categories: 云原生 开发环境
tags:  cloud-native kubernetes docker containerd
author: dinstone
---

* content
{:toc}

# 基础知识

* 目前常用的 Linux 发行版主要包括 Debian/Ubuntu 系列和 CentOS/Fedora 系列。前者以自带软件包版本较新而出名，后者则宣称运行更稳定一些。选择哪个操作系统取决于使用者的具体需求。
* docker 是linux容器技术的开源实现。通讯底层基于iptables，firewalld也是对iptables的封装。
* docker-compose 是单机容器编排工具。
* docker-swarm 跨机器进行容器编排。
* kubernetes 作为云原生操作系统，用于大规模容器化应用的管理、编排、部署工作。

# docker安装

[ubuntu docker 安装](https://docker-practice.github.io/zh-cn/install/ubuntu.html)

```
$ sudo apt-get update

$ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

$ curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

$ echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

$ sudo apt-get update

$ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

默认情况下，docker 命令会使用 Unix socket 与 Docker 引擎通讯。而只有 root 用户和 docker 组的用户才可以访问 Docker 引擎的 Unix socket。出于安全考虑，一般 Linux 系统上不会直接使用 root 用户。因此，更好地做法是将需要使用 docker 的用户加入 docker 用户组。

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

## portainer安装

[portainer 安装](https://www.portainer.io/)，portainer是一个非常好用的docker管理工具。

```
docker run -d -p 9000:9000 --restart=always -v /var/run/docker.sock:/var/run/docker.sock --name portainer portainer/portainer
```

## ElasticSearch安装

```
docker run -d -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e ES_JAVA_OPTS="-Xms512m -Xmx512m" --name es -v /home/tuding/docker/elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml -v /home/tuding/docker/elasticsearch/plugins:/usr/share/elasticsearch/plugins elasticsearch:7.6.2
```

## cerebro安装

cerebro 是一个好用的ES web admin工具。

```
docker run -p 9000:9000 --name cerebro lmenezes/cerebro
```

## busybox安装

BusyBox 是一个集成了一百多个最常用 Linux 命令和工具（如 cat、echo、grep、mount、telnet 等）的精简工具箱，它只需要几 MB 的大小，很方便进行各种快速验证，被誉为“Linux 系统的瑞士军刀”。

BusyBox 可运行于多款 POSIX 环境的操作系统中，如 Linux（包括 Android）、Hurd、FreeBSD 等。

```
docker run -d --name=shell  --privileged busybox
```

## ubuntu安装

```
docker run --cap-add=NET_ADMIN -it ubuntu

sudo update-alternatives --config iptables

apt update -y

apt-get install iptables sudo -y

sudo iptables -L -n

cat /etc/resolv.conf
```

[Ubuntu 安装netstat网络工具](https://blog.csdn.net/benchi400/article/details/103656902)

## Alpine安装

Alpine 操作系统是一个面向安全的轻型 Linux 发行版。它不同于通常 Linux 发行版，Alpine 采用了 musl libc 和 busybox 以减小系统的体积和运行时资源消耗，但功能上比 busybox 又完善的多，因此得到开源社区越来越多的青睐。在保持瘦身的同时，Alpine 还提供了自己的包管理工具 apk，可以通过 https://pkgs.alpinelinux.org/packages 网站上查询包信息，也可以直接通过 apk 命令直接查询和安装各种软件。

```
docker run -it --cap-add=NET_ADMIN alpine /bin/sh

apk update

apk add iptables

iptables -L

cat /etc/resolv.conf
```

## 私有镜像仓库安装

Docker 官方提供了一个叫做 registry 的镜像用于搭建本地私有仓库使用。在内部网络搭建的 Docker 私有仓库可以使内网人员下载、上传都非常快速，不受外网带宽等因素的影响，同时不在内网的人员也无法下载我们的镜像，并且私有仓库也支持配置仓库认证功能。(https://zhuanlan.zhihu.com/p/211237898)

```
docker pull registry

docker run -d --restart=unless-stopped --name registry -p 5000:5000 registry

vi /etc/docker/daemon.json
"insecure-registries": ["192.168.1.120:5000"]

docker info
```

重新加载配置信息及重启 Docker 服务:

```
# 重新加载某个服务的配置文件
sudo systemctl daemon-reload
# 重新启动 docker
sudo systemctl restart docker
```

推送镜像至私有仓库：

1. 先给镜像设置标签 docker tag local-image:tagname new-repo:tagname

2. 再将镜像推送至私有仓库 docker push new-repo:tagname

```
docker tag hello-world:latest 192.168.1.120:5000/test-hello-world:1.0.0
docker push 192.168.1.120:5000/test-hello-world:1.0.0
```

浏览器输入：http://192.168.1.120:5000/v2/_catalog 可以看到私有仓库中已上传的镜像。

```
{"repositories":["msa/msa-config-server","msa/msa-gateway-cloud","msa/msa-service-consumer","msa/msa-service-provider"]}
```

## Consul安装

```
docker run -d --restart=unless-stopped --name consul -p 8500:8500 -v /home/tuding/consul:/consul/data consul agent -server -bootstrap -ui -client='0.0.0.0'
```


# Kubernetes安装

KubeKey 是用 Go 语言开发的一款全新的安装工具，代替了以前基于 ansible 的安装程序。KubeKey 为用户提供了灵活的安装选择，可以分别安装 KubeSphere 和 Kubernetes 或二者同时安装，既方便又高效。

## All-in-One 模式安装

下载 KubeKey：

```
curl -sfL https://get-kk.kubesphere.io | VERSION=v3.0.7 sh -
```

安装v1.24.x版本，选择containerd容器运行时：

```
./kk version --show-supported-k8s

./kk create cluster  --with-kubernetes v1.24.9 --container-manager containerd
```

检查安装结果：

```
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

给containerd镜像仓库docker.io添加加速地址：

```
sudo vim /etc/containerd/config.toml
endpoint = ["https://registry.aliyuncs.com"]

sudo systemctl daemon-reload
sudo systemctl restart containerd
```

给当前用户授权：

```
mkdir -p ~/.kube/config
sudo cp /etc/kubernetes/admin.conf ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config
kubectl get node -o wide
```

使用crictl查看镜像列表：

```
sudo crictl images ls
```

给containerd添加私有镜像仓库192.168.1.120:5000：

```
sudo vi /etc/containerd/config.toml

    [plugins."io.containerd.grpc.v1.cri".registry]
      [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
        [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
          #endpoint = ["https://registry.aliyuncs.com","https://registry-1.docker.io"]
          endpoint = ["https://mirror.baidubce.com","https://ung2thfc.mirror.aliyuncs.com"]
        
        [plugins."io.containerd.grpc.v1.cri".registry.mirrors."192.168.1.120:5000"]
          endpoint = ["http://192.168.1.120:5000"]
      
      [plugins."io.containerd.grpc.v1.cri".registry.configs]
        [plugins."io.containerd.grpc.v1.cri".registry.configs."192.168.1.120:5000".tls]
          insecure_skip_verify = true
        [plugins."io.containerd.grpc.v1.cri".registry.configs."192.168.1.120:5000".auth]
          username = "admin"
          password = "123456"

```

重启containerd服务，取镜像验证：

```
sudo systemctl daemon-reload
sudo systemctl restart containerd
sudo systemctl status containerd

sudo crictl pull 192.168.1.120:5000/msa/msa-service-provider
```

## kuboard安装

kuboard是 Kubernetes 多集群管理界面，非常的好用。https://www.kuboard.cn/

建议在K8s集群外单独安装kuboard服务：

```
sudo docker run -d \
  --restart=unless-stopped \
  --name=kuboard \
  -p 11080:80/tcp \
  -p 11081:10081/tcp \
  -e KUBOARD_ENDPOINT="http://192.168.1.120:11080" \
  -e KUBOARD_AGENT_SERVER_TCP_PORT="11081" \
  -v /home/tuding/kuboard:/data \
  eipwork/kuboard:v3.5.2.4
```

kuboard安装后访问：http://192.168.1.120:11080/。
