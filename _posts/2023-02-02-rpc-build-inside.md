---
layout: post
title:  "由浅入深构建 RPC 框架"
categories: RPC
tags:  RPC Focus
author: dinstone
---

* content
{:toc}

## RPC 功能目标

在构建高效能RPC框架之前，我们先了解一下RPC是什么，以及运行机制是怎样的？

很早的时候，为了简化使用其它联网主机上的应用程序，工程师们设计了一种能够通过A计算机调用B计算机上边应用程序的技术，这种技术不需要开发人员对于网络通讯了解过多，并且调用其他机器上边程序的时候和调用本地的程序一样方便好用。

现代微服务架构模式下，各服务部署在不同机器上，服务间的调用免不了网络通信过程，服务消费方每调用一个服务都要写一坨网络通信相关的代码，不仅复杂而且极易出错。如果有一种方式能让我们像调用本地服务一样调用远程服务，而让调用者对网络通信这些细节透明，那么将极大的提高生产力。这种方式的实现其实就是 RPC 框架，在各大互联网公司中被广泛使用，如阿里巴巴的 hsf、dubbo（开源）、Facebook 的 thrift（开源）、Google grpc（开源）、Twitter 的 finagle（开源）等。

由此可见，RPC（Remote Procedure Call）远程过程调用，像调用本地服务(方法)一样调用服务器的服务(方法)。其主要功能目标是让构建分布式计算（应用）更容易，在提供强大的远程调用能力时不损失本地调用的语义简洁性。为实现该目标，RPC 框架需提供一种透明调用机制让使用者不必显式的区分本地调用和远程调用。

## RPC 调用过程

为了简化RPC调用，需要RPC框架对调用过程和通信细节进行封装，让网络通信细节对使用者透明。我们先看下一个 RPC 调用的流程涉及到哪些通信细节：

![rpc-process]({{site.url}}/img/rpc/process.jpg)

1. 服务调用者（caller）从服务消费方（client）获取服务代理（stub），并以本地调用方式调用服务；
2. client stub 将服务名称、方法名称、参数等请求数据组装成能够进行网络传输的消息（message）；
3. client network 找到服务地址并构建连接，然后将请求消息序列化后发送到服务端；
4. server network 收到请求消息后进行反序列化，并将请求消息交给server stub处理；
5. server stub 收到请求消息后，查找对应的服务实现者（callee），并调用服务实现者的方法；
6. 服务实现者（callee）注册到服务提供方（server），执行本地调用后将结果返回给 server stub；
7. server stub 将返回结果打包成能够进行网络传输的响应消息；
8. server network 将响应消息序列化后发送给消费端；
9. client stub 接收到响应消息，从响应消息中拿到结果；
10. 服务调用者（caller）得到最终结果；

RPC框架的目标就是要 2~9 这些步骤都封装起来，让用户对这些细节透明。

## RPC 架构设计
思考上面的调用过程，我们能够清晰的划分出RPC的职责边界，同时也能分析出RPC框架的架构主要包含以下几个核心组件：

![rpc-logic]({{site.url}}/img/rpc/logic.jpg)

* Client Stub组件：负责收集请求参数和处理响应结果，需要明确远程服务的服务器地址，该组件为内部组件，需依赖协议组件的消息抽象。
* Server Stub组件：负责调用真正的服务实现方法，需要明确服务接口的本地实现。该组件为内部组件，需依赖协议组件的消息抽象。
* Client Network组件：负责管理到服务器的连接，对请求消息和响应消息进行编解码。该组件为内部组件，需依赖协议组件的序列化、压缩编码工具。
* Server Network组件：负责接收来客户端的连接，对请求消息和响应消息进行编解码。该组件为内部组件，需依赖协议组件的序列化、压缩编码工具。
* 协议组件：负责定义请求、响应消息的RPC抽象，以及实现消息的序列化、压缩等编码方式。
* Client组件：服务调用者（caller）开始消费服务前，首先要获得服务的代理实现（client stub）。所以该组件的职责就是创建和管理服务接口的代理实现，为服务调用者提供远程服务接口的引入能力，需要框架暴露对外的API。
* Server组件：服务实现者（callee）对外提供服务前，需将其实现注册到一个地方，以方便Server Stub组件查找。所以该组件职责是管理服务的接口契约和接口实现的映射，为服务实现者提供远程服务接口的导出能力，需要框架暴露对外的API。

在分层架构的基础上，思考各组件运行机制，继续细化组件内外结构，可以得出如下运行架构图：

![rpc-runtime]({{site.url}}/img/rpc/runtime.jpg)

1. Server：负责导出（export）远程接口，将接口暴露出去供远程调用。
   
    服务实现者通常需要以某种形式提供服务调用的相关信息，包括但不限于服务接口定义、数据结构定义、数据序列化的服务定义文件。例如 Thrift、Protobuf 的 IDL 文件，Web service 的 WSDL 文件，服务调用者需要通过一定的途径获取远程服务调用的相关信息，才能正确发起调用。

2. Client：负责导入（import）远程接口的 stub 代理实现。

    目前，大部分跨语言平台 RPC 框架采用根据 IDL 定义，通过代码生成来实现 stub 代码，这种方式下实际导入的过程就是通过代码生成器在编译期完成的。代码生成的方式对跨语言平台 RPC 框架而言是必然的选择，而对于同一语言平台的 RPC 则可以通过共享接口来导入 stub 代理，这里的导入方式本质也是一种代码生成技术，只不过是在运行时生成，比静态编译期的代码生成看起来更简洁些。

3. Proxy：远程接口的代理实现。

    java 至少提供了两种技术来实现动态代码生成，一种是 jdk 动态代理，另外一种是字节码生成。 动态代理相比字节码生成使用起来更方便，但动态代理方式在性能上是要逊色于直接的字节码生成，而字节码生成在代码可读性上要差很多。两者权衡起来，个人认为牺牲一些性能来获得代码可读性和可维护性显得更重要。

4. Invoker：执行服务接口调用。
   
    * 客户端实现：负责发送调用请求到服务端并等待调用结果返回。
    * 服务端实现：负责调用服务端接口的具体实现并返回调用结果。

    通常，这里也是服务治理的最佳实现位置，如服务发现、服务路由、负载均衡、服务重试、熔断限流。

5. Protocol：定义请求消息、响应消息，及对消息的编码（序列化、压缩）。

    * 这里的请求消息、响应消息是RPC应用层的协议抽象，有别于传输层的数据格式，也是解耦传输层的设计。
    * 序列化、压缩，是针对应用层消息对象与传输层字节数据之间的转换，跨语言的关键在消息的序列化方式。

6. Connector：负责维持客户端和服务端的连接通道和发送数据到服务端。 
   
   传输层协议是决定跨平台性的关键。可基于 HTTP 或 TCP 协议协议实现，Web Service 就是基于 HTTP 协议的 RPC，它具有良好的跨平台性，但其性能却不如基于 TCP 协议的 RPC。
   
7. Acceptor：负责接收客户端请求数据并返回响应结果。
   
   通常，基于TCP协议的传输层会保持长连接来提升性能，但是连接经过一些负载中转设备，有可能连接一段时间不活跃时会被这些中间设备中断。 为了保持连接有必要定时为每个连接发送心跳数据以维持连接不中断。
   
   心跳消息的设计应该限制在传输层，它对应用层应该保持透明。

8. Processor：负责在服务端控制调用过程，包括管理调用线程池、超时时间等。 

   服务端的调用过程控制主要围绕性能展开（快速启动、快速执行、快速结束），可考虑3个因素： 
   * 效率提升：每个请求应该尽快被执行，因此我们不能每请求来再创建线程去执行，需要提供线程池服务。 
   * 资源隔离：当导出多个远程接口时，如何避免单一接口调用占据所有线程资源，而引发其他接口执行阻塞。 
   * 超时控制：当某个接口执行缓慢，而客户端已经超时放弃等待后，服务端的线程继续执行此时显得毫无意义。

## RPC 实现设计

![rpc-layer]({{site.url}}/img/rpc/layer.png)

为了使RPC架构更灵活，便于以后功能扩展，我们需要考虑插件化架构，可以将每个功能点抽象成一个接口作为插件的契约，然后把这个功能的接口与实现分离，并提供接口的默认实现，满足大多数场景。

这样一来，我们的设计就遵循了开闭原则，用户可以非常方便地通过插件扩展实现自己的功能，而且不需要修改核心功能的本身；其次就是保持了核心包的精简，依赖外部包更少，可以有效减少开发人员引入 RPC 框架导致的包版本冲突问题。

### Server组件设计
Server组件具有导出服务接口的能力，将其能力抽象为ServiceProvider接口，同时创建接口实现Server类。
```java
public interface ServiceProvider {

    public abstract <T> void exporting(Class<T> clazz, T instance);

    public abstract void destroy();

}
```
```java
ServiceProvider server = new Server(4455); 
DemoService demo = new DemoServiceImpl();
server.exporting(DemoService.class, demo, options); 
```

### Client组件设计

通常 RPC 调用有以下两种方式： 
* 同步调用：客户端等待调用执行完成并返回结果。 
* 异步调用：客户端调用后不用等待执行结果返回，但依然可以通过回调等方式获取返回结果。

```java
public interface FooService {

    public String hello(String name);

    public CompletableFuture<String> register(String name);
}
```

Client组件的导入服务代理的能力抽象为ServiceConsumer接口，同时提供接口默认实现Client类。

```java
public interface ServiceConsumer {

    public abstract <T> T importing(Class<T> sic);

    public abstract void destroy();

}
```

```java
ServiceConsumer client = new Client("localhost", 4455); 
FooService fooService = client.importing(FooService.class);

// 同步调用
String reply = fooService.hello("dinstone");
System.out.println(reply);

// 异步调用
CompletableFuture<String> rf = fooService.register("dinstone");
System.out.println(rf.get());
```

### 协议组件设计
消息抽象定义了代表请求的Call类和代表应答的Reply类。序列化可以抽象为Serializer接口，压缩可以抽象为Compressor接口，方便不同算法实现扩展，当前流行的跨语言序列化实现有Json、Protobuf、Thrift等。

```java
public class Call implements Serializable {

    private String service;

    private String method;

    private Object parameter;
}
```
```java
public class Reply implements Serializable {
    /** error or result */
    private Object data;
}
```
```java
public interface Serializer {
    /**
     * The serializer type
     *
     * @return
     */
    public String serializerType();

    public byte[] encode(Object content, Class<?> contentType) throws IOException;

    public Object decode(byte[] contentBytes, Class<?> contentType) throws IOException;

}
```
```java
public interface Compressor {

    /**
     * The compressor type
     *
     * @return
     */
    public abstract String compressorType();

    
    public abstract byte[] encode(byte[] data) throws IOException;

    public abstract byte[] decode(byte[] data) throws IOException;

}
```

### Stub组件设计
Server端Processor接口：
```java
public interface Processor {

    public void process(MessageContext context);

}
```

Client端Proxy接口：
```java
public interface Proxy {

    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable;

}
```

Invoker接口：
```java
public interface Invoker {

    public CompletableFuture<Reply> invoke(Call call) throws Exception;

}
```

### 传输组件设计

```java
public interface Acceptor {

    void bind(InetSocketAddress serviceAddress, Processor processor) throws Exception;

    void destroy();

}
```

```java
public interface Connector {

    CompletableFuture<Reply> send(InetSocketAddress serviceAddress, Call call) throws Exception;

    void destroy();
}
```

## 总结 
至此我们输出了一个 RPC框架的基本架构，并详细分析了需要考虑的一些实现细节，尤其对跨语言、跨平台性实现做了深入设计，为框架的扩展性提供了基础。 

1. 跨语言的关键是序列化的安全性、兼容性。
2. 跨平台的关键是传输协议的通用性。
3. 向下兼容的关键是API层的稳定性。
4. 可扩展的关键是插件化的架构设计。
