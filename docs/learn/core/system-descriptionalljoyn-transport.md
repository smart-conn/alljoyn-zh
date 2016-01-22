# AllJoyn&trade; 传输方式

## 概览

AllJoyn Transport 是一种具体机制的概念。这个机制用于在 AllJoyn 应用之间传递 AllJoyn Messsages（根据方法调用，方法答复，属性获取/设置或信号）。

AllJoyn Tranport 提供了以下基础功能：
* 在 AllJoyn 应用（通过 AllJoyn 路由）之间和在 AllJoyn 应用和程序之间建立和摧毁连接。
* 在 AllJoyn 应用和路由之间可靠地发送和接收 AllJoyn Messages。
* 可选地，提供适用于底层网络技术的广告和发现服务。

AllJoyn Transport 支持在多种底层物理网络层，包括 TCP、UDP 和 本地 UNIX 传输中建立连接和传递信息。AllJoyn Transport 支持的完整底层传输列表收录在 [AllJoyn TransportMask definition][alljoyn-transportmask-definition]。应用程序能够指定运行在何种用于建立连接和传递信息的底层传输方式中。

根据连接终点的类型划分， AllJoyn Transport 功能可被分围以下几个类型：
* **Local AllJoyn Transports**: Local AllJoyn Transports 主要负责提供核心资源库与 AllJoyn 路由之间的通信。它支持应用和路由之间连接的建立和信息转发。关于此种 Local Transports 的详细信息，收录在 [Local AllJoyn Transports][local-alljoyn-transports]。
* **Bus-to-Bus AllJoyn Transports**: 该类型的 AllJoyn Transports 支持 AllJoyn 路由之间连接建立和信息转发。关于此种 Local Transports 的详细信息，收录在 [Bus-to-Bus AllJoyn Transports][b2b-alljoyn-transports]。

## AllJoyn Transports 中终点的使用方法

如 [AllJoyn endpoints][alljoyn-endpoints] 所述，AllJoyn Transport 使用终点建立连接并在应用和路由之间转发信息。AllJoyn Endpoint 类似与 socket 编程中的 socket endpoint。AllJoyn Endpoint 是 AllJoyn 通信连接中的一侧。AllJoyn 通信连接可以建立在一个应用与一个路由之间，或者建立在两个路由之间。

下面列出了 AllJoyn 系统中的终点的一般分类：
* **Local Endpoint**: 本地终点代表了一个指向自己的连接。在核心资源库中，它路由和应用用来建立指向自己的连接。本地终点表示在同一进程内的连接。
* **Remote Endpoint**: 远程终点代表应用和路由之间的连接。发往应用程序的消息路由到其远程终点。一种特别的远程终点的类型称为 “Bus-to-Bus” 终点，表示两个路由之间的连接。远程终点表示两个进程之间连接。

下图展示了本地终点和远程终点的概念。

![local-remote-endpoints][local-remote-endpoints]

**图:** 本地和远程终点

图片表明了 AllJoyn 应用与预装路由之间的假想连接。AllJoyn 应用与核心资源库进行会话，把网关提供给更广的分布式总线。核心资源库有两个主要连接：一是应用之间的连接，由 Local Endpoint 提供 ；二是与路由之间的连接（代表了远程 Remote Endpoint）。

AllJoyn 路由有相应的远程终点代表与用于转发信息的核心资源库相连连接的终点。AllJoyn 路由内的 本地终点表示一个连接到路由器上的路由发送到路由器的控制消息。

多个程序能够在一个分布式总线结构中连接同一个 AllJoyn 路由。AllJoyn 路由为每一个连接的程序提供了一个远程终点，如下图所示 (AllJoyn router wiht multiple remote endpoints)。

![alljoyn-router-multiple-remote-endpoints][alljoyn-router-multiple-remote-endpoints]

**图:** 有多个远程终点的 AllJoyn 路由

核心资源库和路由都提供远程终点，然而他们在信息转发功能方面有所不同-AllJoyn 路由能在终点之间转发信息，然而核心资源库仅能在特定一组本地和远程终点之间转发信息。

AllJoyn 系统支持完全分布式的总线配置，具体表现为一个路由通过与其它路由的连接，加入一个单一分布式 AllJoyn 总线的总线段，如图所示：


![alljoyn-distributed-bus-b2b-endpoints][alljoyn-distributed-bus-b2b-endpoints]

**图:** 包含 bus-to-but 终点的 AllJoyn 分布式总线

如图，在图片的上半部分展示了一个包含一个 AllJoyn 路由和两个应用程序的总线段。在图片的下半部分，同样有一个包含一个 AllJoyn 路由和两个应用程序的总线段。

这两个总线段通过称为 Bus-to-Bus 的远程终点相连。每个路由为它所连接的路由提供了一个 Bus-to-Bus Endpoint。在图中，一个 Bus-to-Bus Endpoint 表示于上方 Routing Node 的连接，另一个 Bus-to-Bus Endpoint 表示与下方Routing Node 的连接。
 
Remote Endpoints 通过 AllJoyn Transport 相关的底层通讯机制进行配对。举例说明， Routing Nodes 中的 Bus-to-Bus Endpoints 可能通过 TCP Transport 或者 UDP Transport 控制，它们同时也控制了从一段（Endpoint）到另一段的连接中传递 Messages 的细节。

在核心资源库与 AllJoyn 路由之间通过 Remote Endpoints 连接的情况下，底层通信机制可能根据主机环境的不同而有所区别。举例说明，Linux 系统中使用 UNIX domain sockets 工具，然而 Windows 系统中使用 TCP 工具。

### 精简资源库终点

精简资源库 (TCL) 使用 TCP 传输，但它的实现与一般的核心资源库与 AllJoyn 路由之间的 TCP 传输有所不同。

在 TCL 中，没有明确的远程终点和本地终点。TCL 提供了与另一台 AllJoyn 设备上的 AllJoyn 路由上的 TCP 远程节点连接并通信的最小功能实现。

在 Routing Node 侧，精简资源库设备连接方式，就像使用本地 TCP 回环连接的本地核心资源库。

**注意:** 这是 Windows 环境下，Bus Attachments 连接 Routing Nodes 的方式。TCP 传输用于连接，但是数据实际上不通过网络传输；而是在被发送到某个已连接的 IP 网络之前，被回环并发送至网络堆栈。

下图展示了精简资源库终点的使用方式。

![thin-core-library-endpoint][thin-core-library-endpoint]
 
**图:** 精简资源库终点

## 网络模型中的 AllJoyn Transport

尽管 AllJoyn 传输的基本任务是从一个终点向另一个终点传输或转移 AllJoyn Messages，但是也须要区别 AllJoyn Transport 与  International Standards Organization Open Systems Interconnection (ISO/OSI) 7-layer model 中传输层（第四层）的概念。

The following figure shows where AllJoyn Transports fit in the 
7-layer ISO/OSI model. 下图展示了在 七层 ISO/OSI 模型概念中，AllJoyn Transport 的位置。

![alljoyn-osi-seven-layer-arch][alljoyn-osi-seven-layer-arch]

**图:** 七层 ISO/OSI 模型中的 AllJoyn Transport

在应用程序逻辑之下，有一个负责封包和解包 AllJoyn 信息（信号和方法调用）的 AllJoyn Message 层。该层可被视为位于 ISO/OSI 模型的表现层。

AllJoyn 信息通过 AllJoyn Transport 层被路由至目的地。由于 AllJoyn Transport 层控制应用程序和 AllJoyn 路由之间的连接，所以它可以被相应地视为 ISO/OSI 模型中的会话层（第五层）。AllJoyn Tranport 使用第四层的传输方式，如 TCP 或 UDP，以便管理不同网络实体间 AllJoyn 信息的实际传输。

由于 AllJoyn Transport 包含了转移数据序列、建立连接、广告和发现功能，针对不同的底层传输机制，有不同的 AllJoyn Transports。
* AllJoyn TCP Transport 使用 TCP/IP 机制传输数据。
* AllJoyn UCP Transport 使用 UCP/IP 机制传输数据。
* AllJoyn Bluetooth (BT) Transport 使用相同的方式进行蓝牙连接。
* AllJoyn Local Transport 使用  UNIX domain sockets。

AllJoyn 传输方式的命名通常参照其使用的底层 OSI 四层机制中的方法。

AllJoyn 应用程序可能会选择 AllJoyn Transport，通过在适当的 AllJoyn API 中选择一个或多个 TransportMask 位来实现。目前支持的 TransportMask 位在展示在下表中：


#### AllJoyn TransportMask definition

|Transport name | 值 | 描述 |
|---|:---:|---|
| TRANSPORT_NONE         | 0x0000 | 无传输。 |
| TRANSPORT_LOCAL        | 0x0001 | 本地传输。 |
| TRANSPORT_TCP          | 0x0004 | Transport 使用 TCP 作为底层传输机制。 |
| TRANSPORT_UDP          | 0x0100 | Transport 使用 UDP 作为底层传输机制。 |
| TRANSPORT_EXPERIMENTAL | 0x8000 | 选择一个 release-specific 实验性传输方式。 |
| TRANSPORT_IP           | 0x0104 | 允许系统选择使用 TCP 或是 UDP。 |
| TRANSPORT_ANY          | 0x0105 | 允许系统选择任意适当的传输工具。|

如果 AllJoyn 应用程序希望只使用 TCP 作为第四层传输机制，它可以在广播、发现、加入会话、绑定选项中指定为 TRANSPORT_TCP。如果应用程序只希望使用基于 IP 的传输方式，它可以设定为 TRANSPORT_IP，使 AllJoyn 系统从 TCP 和 UDP 中选择。

每种传输方式根据其基于的底层物理传输方式建立和保持连接。根据底层物理传输方式的不同，在一个 AllJoyn 网络中两个节点间的实际连接可以是单跳或多跳的。AllJoyn 分布式总线基本上是一种覆盖网络，它的拓扑结构不需要直接映射到底层网络的拓扑结构。如果某个应用程序没有偏好，它可以设为 TRANSPORT_ANY 并且允许 AllJoyn 系统决定使用何种传输方式。

## 本地 AllJoyn 传输方式

AllJoyn Local Transports 是被设计主要用于提供核心资源库和它们的 AllJoyn 路由之间连接的一组 AllJoyn Transports：

* Null Transport
* UNIX Domain Socket Transport
* TCP Transport

### Null Transport

最简单的本地传输方式是 Null Transport。设计这种传输方式用于提供核心资源库与绑定路由之间的连接，它们都在常规进程内运行。根据功能调用。一个 Null Transport 的终点直接通过方法调用连接到另一侧。在这种情况下，实际上核心资源库与路由之间的连接路径并没有 Transport，连接通过一种称之为接口的直接方式连接在了一起。

### UNIX Domain Sockets Transport

Posix 系统采用 The UNIX Domain Sockets Transport 为 核心资源库和预装 AllJoyn 路由之间提供了一个进程间的连接（IPC）。由于是一种本地传输方式，不需要支持多终点，广播和发现。此种传播方式以分离的形式在核心资源库与 AllJoyn 路由之间实现。

### TCP Transport

TCP Transport 用于 Windows 系统，在核心资源库与预装 AllJoyn 路由之间提供一个进程间的连接。由于不需要支持多终点，也不需要广告和发现功能，针对核心资源库的 TCP Transport 相较于 TCP Transport 的总线到总线版本，要简化许多。查看 [TCP Transport mechanism][tcp-transport-mechanism] 了解更多关于 TCP Transport 的细节。
	
## 总线到总线 AllJoyn Transport

总线到总线 AllJoyn Transport 实现了在 AllJoyn 路由之间建立连接、转发信息。AllJoyn 系统中最常见的总线到总线传输方式是基于 IP 传输的机制。这包含了 TCP Transport 和 UDP transport。

如上文所述，一个应用程序能够指定用于建立连接和传输信息的 AllJoyn 传输方式。如果应用程序没有指定，AllJoyn 路由器会选择用于传输的方式。TCP 传输方式和 UDP 传输方式都是有效的 AllJoyn 传输方式。在这两种传输方式中做出选择时，需要权衡利弊。一般来说，使用 TCP 或 UDP 传输方式次数的多少，取决于使用者对它们的喜爱程度。

下表总结了在不同系统标准下，AllJoyn TCP 和 UDP 传输方式性能上的差异。

#### TCP 和 UDP 传输方式的性能对比

| 系统标准 | TCP 传输方式 | UDP 传输方式 | 描述 |
|---|---|---|---|
| 支持的连接数量 | 少于平均值 | 高 | 由于大量使用文件描述符，TCP 传输方式不支持大量同时进行的连接。UDP 传输方式对于多个连接，只是用单个文件描述符，所以它能够支持大量同时发生的连接，不会达到文件描述符系统上线。 |
| 内存占用 | 中等 | 高 | 由于 UDP 传输方式提供了可靠性支持，所以它需要更大的内存。 |
| 基于 TTL 的信息过期 | 不可能 | 支持 | UDP 传输方式使用支持基于 TTL 信息过期机制的 AllJoyn 可靠数据报协议 (ARDP)|
| 数据传输的类型 | 在大容量数据传输时表现最好 | 在间歇性短数据传输时表现最好 | 第四层 TCP 连接的默认 socket 缓冲区通常比 UDP 连接大得多。所以，TCP 在大容量数据传输时表现得更好。|

下表展示了不同应用场景中，基于 [Performance of AllJoyn TCP Transport versus UDP Transport][performance-of-alljoyn-tcp-vs-udp] 所属的利弊关系，TCP 和 UDP 传输方式的取舍。

#### 不同使用场景中，TCP 和 UDP 传输方式的选择。

| 使用场景 | TCP 传输方式 | UDP 传输方式 |
|---|:---:|:---:|
| 主要传输方法调用 | X | |
| 主要传输大容量数据 | X | |
| AllJoyn 信息与 TTL 相关 | | X |
| 伴随间歇性 RPC 调用的大量并发会话 | | X |
| 高度污染的 RF 环境 | X | |

 以下章节具体描述 AllJoyn TCP 和 UDP 传输方式的细节。

### TCP 传输机制

如前文所述，AllJoyn TCP 传输方式从它使用的 TCP/IP 第四次层传输机制中获取名称。由于 TCP 提供了一个可靠的数据流保障，TCP 传输方式必须提供从比特流翻译信息并发送至比特流的机制。

#### TCP 传输方式数据层结构

Each connection that uses the TCP Transport has an associated TCP Endpoint, 
TCP Stream, and TCP socket as shown in the following figure. 如图，每个使用 TCP 传输方式的连接都有相关的 TCP 终点、TCP 流和 TCP socket。

![tcp-transport-data-plane-internal-architecture][tcp-transport-data-plane-internal-architecture]

**图:** TCP transport data plane internal architecture TCP 传输数据层内部结构

路由节点的路由功能连接至一个 TCP 终点，这代表了一个针对 TCP 传输方式连接的远程终点。TCP 终点使用 TCP 串流组件从比特流翻译信息并发送至比特流。TCP 流通过 TCP socket 接收和发送数据。

#### TCP 终点生命周期

TCP 终点在整个生命周期中经历多个状态。这些 TCP 终点的状态和变化在下图中呈现。

![tcp-endpoint-lifecycle-states][tcp-endpoint-lifecycle-states]

**图:** TCP 终点生命周期的状态

TCP 终点既可能是一个活动连接请求的结果，也可能是一个被动连接的传入呼叫。TCP 终点包含关于这些突发事件属于活动连接或是被动连接的信息。

TCP 终点遵循 AllJoyn 线程的基本生命周期。它首先在 INITIALIZED 状态中生成。在 TCP 终点使用与 AllJoyn 系统之前，必须先将其认证。这是一个独立的步骤，在 [TCP Endpoint authentication phase][tcp-endpoint-auth-phase] 中具体说明。如果认证成功，TCP 终点线程被要求启动，同时进入 STARTING 状态。如果认证失败，TCP 终点转换为 FAILED 状态，并准备好被清理。

当线程要求支持一个新建的或经过认证的正在运行的 TCP 终点，该终点进入 STARTED 状态。在此状态下，TCP 终点被注册至路由，因此数据可以通过终点传输。当不再需要这个连接时，就会调用终点方法 `Stop()`，那么终点将进入 STOPPING 状态。当终点中所有的线程都退出后，终点进入 JOINING 状态，这个状态下任何相关的线程都能够加入（类似于 Posix 线程加入的操作）。终点随后会从 AllJoyn 路由中注销。当终点里与线程相关的资源被清除后，终点进入 DONE 状态，在这个状态下它能够从系统中被移除和删除。

##### TCP Endpoint authentication phase TCP 终点验证步骤

如上文所述，TCP 终点在允许信息通过之前，必须完成一个验证步骤。这个验证步骤由一个单独的线程处理，在下图中展示。验证进程在 TCP 终点进入 INTIALIZED 阶段时启动。

![tcp-endpoint-auth-states][tcp-endpoint-auth-states]

**图:** TCP 终点验证状态

TCP 终点验证使用 Simple Authentication and Security Layer (SASL) 架构的 "ANONYMOUS" 机制。实际上在 AUTHENTICATING 状态中，TCP 流为了传输 SASL 挑战和应答，运行在字符串传输模式中。如果 SASL 交换失败，验证转换到 FAILED 状态，这就导致了 TCP 终点进入 FAILED 状态。

如果 SASL 交换成功，认证转换到 SUCCEEDED 状态，这会使 TCP 终点转换为 STARTING 状态。当 TCP 终点转换为 STARTED 状态，相关的 TCP 流会进行模式转换，并开始发送和接收 AllJoyn 信息，停止发送和接收文本字符串。

一旦做出了 FAILED 或 SUCCEEDED 的决定，就会生成一个适当的终点生存周期，退出终点认证和认证机制的转变都会导致终点的结束。
 
### UDP 传输机制

ALlJoyn UDP 传输机制，顾名思义，使用 UDP/IP 协议从一端向另一端转移 AllJoyn 信息。由于 UDP 不提供可靠性的保障，UDP 传输方式必须提供一种保障信息送达的机制。UDP 传输方式使用 AllJoyn Reliable Datagram Protocol (ARDP) 提供信息送达保障。 ARDP 大致上基于 Reliable Data Protocol (RDP)，如 RFC 908 (版本 1) 和 RFC 1151 (版本 2) 中所体现的一样。

####  UDP 传输数据层结构

结构上说，UDP 传输方式可被分为两大组件；路由节点连接到所谓 UDP 终点的路由功能，可通过 ARDP 访问的 UDP 传输方式的网络功能。

UDP 终点事路由节点与 UDP 传输方式之间的基础数据层接口。从路由节点的角度来看，每个 UDP 传输连接都是一个 UDP 终点的代表。每个 UDP 终点有一个相关的 ARDP 流，它能把 AllJoyn 信息转换为 ARDP 数据包。下图展示了 UDP 传输方式数据层结构。

![udp-transport-data-plane-internal-architecture][udp-transport-data-plane-internal-architecture]
 
**图:** UDP 传输方式数据层内部结构

ARDP 流组件从信息流的概念转换成了数据包流，与 ARDP 连接进行会话。ARDP 连接提供了端到端状态信息，使可靠性得到了保障，并且能够与独立的通过各种由 UDP 传输方式管理的 ARDP 连接分享的 UDP socket 进行会话。

#### UDP Endpoint lifecycle UDP 终点生命周期

UDP 终点通过一个如下图所示定义明确的生命周期。

![udp-endpoint-lifecycle][udp-endpoint-lifecycle]

**图:** UDP 终点生命周期

终点既适用于主动连接请求，也适用于被动连接请求。与 TCP 概念相似，主动连接是从本地发出的连接。被动连接是传入的，从远程发出的连接。ARDP 协议有一个三步握手的机制，与 RDP 和 TCP 提供的类似。发出 SYN 请求的实体进入 ACTIVE 状态，使用 SYN+ACK 回应的实体进入 PASSIVE 状态。

与 TCP 和 RDP 不同，ARDP 提供了额外的信息，如 SYN 和 SYN+ACK 包中的数据。在 SYN，SYN+ACK，ACK 交换（发生在 ACTIVE 和 PASSIVE 状态）期间，包含的终点与它们的远程部分进行认证和识别。当这个步骤完成时，并且终点注册的远程节点进入待命状态时，该终点进入 STARTED 状态。在 STARTED 状态下，AllJoyn 信息可以被发送和接受。

最后，本地和远程方面都可以调用断开连接的事件来终止连接。路由通过向 UDP 终点发送一个 `Stop()` 命令来断开连接。这会导致状态由 STARTED 进入 STOPPING。在本地断连情况下，会立刻进入 WAITING 状态。该状态下允许在 ARDP 断连被执行前，所有在排队的或在途中的信息被发送至远程端。

**注意:** 与 TCP 不同，在 ARDP 中没有四步骤结束握手的方式 —— 这是由 UDP 传输状态的设备中会话层所处理的。 

当所有数据都被传输网称并且公布后，状态会重新会到 STOPPING。在 STOPPING 模式下，不同的线程被告知终点已被关闭。当线程被验证为已退出的状态，终点转换为 JOINING 状态。在这个状态下，资源被释放，任何关于这个终点的线程都被加入（类似于 Posix 线程的加入操作）。资源管理的最后一个部分是从路由节点注销终点。当这个步骤完成时，终点进入 DONE 状态，并且准备好被终点管理功能删除。

#### ARDP state machine ARDP 状态设备

The ARDP is a close relative of RDP which is documented in RFC-908 (version 1)
and RFC-1151 (version 2). At the heart of the ARDP is the ARDP 
connection state machine. Although similar to the TCP state machine, 
the ARDP machine is simpler, requiring only six states as shown 
in the following figure.

![ardp-state-machine][ardp-state-machine]

**图:** ARDP 状态设备

如 TCP 一样，连接既可以是主动的，也可以是被动的。在主动情况下，同构建立一个 UDP 终点并把它转换为 ACTIVE 状态发出一个连接。终点提供了 “introduction” 信息，并把它传送至 ARDP，ARDP 通过建立一个连接，把 “introduction” 加入 SYN 包并发送的方式做出应答。当 SYN 包被发送后，本地 ARDP 连接进入 SYN-SENT 状态。在 LISTEN 状态的远程 ARDP，接收到 SYN，并且返回至 UDP 传输方式，提供 "introduction" 并且发出一个连接请求已被接收的通知。如果 UDP 传输方式决定某个连接不应该存在，就会通知 ARDP，ARDP 就会发送一个 RST 包来取消连接。

如果 UDP 传输方式决定了使用某个连接，它会简历一个新 UDP 终点，并使其进入 PASSIVE 状态，并且使用它本身的 "introduction response" 回复 ARDP callback。被动方随后进入 UDP 终点 PASSIVE 状态并且 ARDP 在 SYN+ACK 包中发送 "introduction response" 返回至主动端。当主动端收到了 ACK 包，将转换为 STARTED 状态。主动端就为发送和接收数据做好了准备。当被动端接收到了最终 ACK 包，它的三步握手就完成了。

他转换至 OPEN 状态并且通知转换为 STARTED 状态的 UDP 终点。此时，两端都准备好发送和接收数据了。

由于在本地 UDP 终点、本地 ARDP、远程 ARDP 和 远程 UDP 终点 之间传递信息可能出现失败。两端都装有看门狗计时器，能够及时地中止进程。

如上文所述，在 ARDP 中关闭连接没有先后顺序。这是在 UDP 终点状态设备中完成的。通过接收或发送 RST 包从 ARDP OPEN 状态转换至别的状态。为了避免 ARDP 端口重复使用的问题，提供了一个 CLOSE_WAIT 状态，与 TCP 中的类似。

#### ARDP packet format ARDP 包格式

ARDP 包格式的细节在 RFC 908 和 RFC 1151 提到。为了支持 AllJoyn 信息间隔的扩展而不是使用 UDP数据报，并且删除基于 TTL 超时的途中信息，需要改变 SYN 和 DATA 包的格式。

下表展示了 ARDP SYN 包的个是。一个延迟 ACK 超时加入了支持功能，类似于 TCP 中使用的延迟 ACK。长度变量的数据和相关数据长度字段也加入其中。SYN + ACK 数据包返回此格式，但包含 ACK 位。

#### ARDP SYN 包格式
| 字段 |
|:---:|
| FLAGS (8 bits) / Header Length (8 bits) |
| Source Port (16 bits) |
| Destination Port (16 bits) |
| Data Length (16 bits) |
| Initial Sequence (32 bits) |
| Acknowledgement (32 bits) |
| Local Receive Window Size (16 bits) |
| Maximum Size of Receivable Datagram (16 bits) |
| Delayed ACK Timeout (32 bits) |
| Data (variable length) |

下图展示了 ARDP DATA 包的格式。该格式基本上与 RFC 908 和 RFC 1151 中描述的相同。由于 ARDP 是用来支持发送和接收 AllJoyn 信息的，它可以跨越了三个 65535 字节 UDP 数据报，所以加入了信息片段的概念。加入一个片段计数字段和启动消息序列号，会根据 一条 AllJoyn 信息中的首个 UDP 数据报识别序列号。Time-to-Live 字段也被加入，使 AllJoyn 信息获得一个存活时间；为了配合传输信息信息的过期机制，加入了 Acknowledge-Next 字段。

#### ARDP 数据包格式

| Fields |
|:---:|
| FLAGS (8 bits) / Header Length (8 bits) |
| Source Port (16 bits) |
| Destination Port (16 bits) |
| Data Length (16 bits) |
| Sequence Number of Current Segment (32 bits) |
| Acknowledge Number of Last In-Sequence Segment (32 bits) |
| Time to Live (32 bits) |
| Last Consumed Sequence Number (32 bits) |
| Acknowledge-Next (32 bits) |
| Start-of-Message Sequence (32 bits) |
| Fragment Count (16 bits) |
| Extended ACK Bitmask (variable length) |
| Data (variable length) |

#### UDP 传输方式配置

ARDP 是一个弹性协议，使用了很多的可配置参数。这些参数可通过 AllJoyn 路由配置文件进行修改。

| 参数名 | 描述 | 默认值 |
|---|---|:---:|
| udp_connect_timeout | 当首个 ARDP 连接尝试时， SYN 包可能会丢失。如果丢失，一段时间过后，远端不会回应，必须重新尝试建立连接。这个值代表了 ARDP 准备再次发送 SYN 包前的等待时间。 | 1000 msec |
| udp_connect_retries | 当首个 ARDP 连接尝试时，SYN 包可能丢失。如果丢失，一段时间后，远端不会回应，必须重新尝试建立连接。这个只代表了 ARDP 重新发送 SYN 包的尝试次数。 | 10 |
| udp_initial_data_timeout | 当一个数据 ARDP 段被发送后，RTO 计时器启动，它决定了在确定未收到该端数据后，何时重新发送。ARDP 使用 RFC 6298 中 TCP 算法中的 SRTT 和 RTO 估计。这个参数决定了当 RTT 估计失效时，该段数据 RTO 的初始值。 | 1000 msec |
| udp_total_data_retry_timeout | 在放弃重试并断开相关 ARDP 连接之前，某个数据段总共的尝试次数。 | 10000 msec |
| udp_min_data_retries | 给定 ARDP 数据段最小重试次数。在 udp_total_data_retry_period 允许的范围内，可以重试多于该值的次数。 | 5 |
| udp_persist_interval | When the advertised window size on the foreign host goes to zero, it stops the (local) sender from transmitting data until the window becomes nonzero. Since ARDP does not reliably send ACK packets, it is possible to lose an ACK packet that reopens the window. In that case, the local and foreign sides could deadlock: the foreign side to receive data and the sender waiting for an ACK with a new window size. ARDP supports sending zero window probes (NUL packet) if it does not get update to the window after receiving a zero window ACK. The zero window probes are sent following an exponential backoff schedule. This parameter defines initial persist interval used as first timeout for the zero window schedule.当广播的窗口大小在远端变为了 0，它会停止（本地）发送者传输数据知道窗口值不再为 0.由于 ARDP 不能十分可靠滴发送 ACK 包，可能会丢失 ACK 包，导致窗口重新打开。在这种情况下，本地和远端可能会进入一个死循环：远端要接收数据，发送者等待一个携带新窗口大小的 ACK。如果 ARDP 在接收到 0 窗口 ACK后 window 值并没有更新，ARDP 支持发送 0 窗口探测（空数据包）。0 窗口探测信号后会跟随一个指数退避列表。该参数决定了初始间隔，用于 0 窗口列表的首个超时时间。 | 1000 msec |
| udp_total_app_timeout | 在相关 ARDP 宣布连接失败之前，发送 0 窗口探测的总时长。| 30000 msec |
| udp_link_timeout | ARDP 十分乐意判断一个连接失效、空闲的时间。这个想法用于保证某些数据在连接中，至少经过一次间隔。它可以是数据、数据的 ACK 或者特殊的空白保持活动包。某个连接超时时长用于计算用于发送周期保持活动探测的保持活动间隔。该参数提供了一个断开连接被必须被发现的时间的默认总时常。该值仅在应用程序没有设定连接超时时长的情况下使用，否则使用应用程序规定的超时时长。 | 30000 msec |
| udp_keepalive_retries | Provides the total number of times keep-alive probes will be sent before declaring the link as broken and terminating the ARDP connection.规定了在确定连接已经失效并且终止 ARDP 连接之前，保持活动探测发送的总数 | 5 |
| udp_fast_retransmit_ack_counter | Similar to TCP, ARDP supports fast retransmission of segments based on the out-or-order EACKs (Enhanced ACKs) received. This value defines how many out-of-order EACKs should be received before ARDP performs the retransmission. A segment is fast retransmitted only once.与 TCP 相似，ARDP 支持基于接收到的出错 EACKs (Enhanced ACKs)的段落重传。该值决定了在 ARDP 重传前应该接收出错 EACKs 数量。 | 1 |
| udp_timewait_timer | 某个连接应该保持在 RDP Close_Wait 状态的时长，因为有些发出的包可能在网络中在网络中徘徊，直到失效。这个参数保证了定义 ARDP 连接的某个端口对在给定时间内不会被第二次使用，防止之前残留的信号与当前信号产生冲突。  | 1000 msec |
| udp_segbmax |在连接建立阶段 ARDP 段落的最大容量。由于 ARDP 在 UDP 顶端运行，该值由最大 UDP 包的容量而定。由于 UDP 中最大数据报的容量使 65535 字节，最有效／最大 ARDP 信息的大小就是最大 UDP 包的大小。| 65507 |
| udp_segmax | Maximum number of outstanding ARDP segments the receiver is willing to accept as negotiated during connection setup. This value governs how many segments can be in the flight and hence impacts the overall achieved throughput. The SEGMAX unit is ARDP segments. ARDP supports flow control through dynamic windowing in the message header. When data is received by ARDP and "checked in" to the ARDP receive queue, it is immediately acknowledged, but the receive window is decremented by 1. It is only when a datagram is delivered to the app, that the datagram is removed from the receive buffer and the receive window is incremented by 1.在建立连接阶段接受者愿意接受的最大 ARDP。该值管理了在传输中的最多段落数，并且因此会影响整体实现的吞吐量。SEGMAX 的单位是 ARDP 段。ARDP 支持通过信息头部的动态窗口来控制流量。当数据被 ARDP 接收并且在 ARDP 接收队列中登记，他会被立刻广播，但接收窗口以 1 为单位递减。只有当数据报被传输至应用后，数据包才会从接收缓存中移除，同时，接受窗口以 1 为单位递增。 | 50 |

### AllJoyn 传输方式使用的名称服务

TCP 和 UDP 传输方式都提供了相同的广告和发现的功能。两种传输方式在广播和发现机制中都采用了基于多拨的 IP 名称服务。名称服务使用底层 IP （UDP） 多拨完成广播和发现功能。名称服务在路由节点中以独立形式存在，可以通过 TCP 和 UDP 传输方式的不同控制层使用。[Advertisement and Discovery][advertisement-discovery] 展示了 AllJoyn 系统中用于广播和发现的老版本名称服务和下一代名称服务 (NGNS) 的详细内容。

### AllJoyn 路由选择传输方式

在发现中，如果一个应用程序选择某个特定的传输方式（TCP 或 UDP），那么  `FoundAdvertisedName()` 仅已选定的传输方式发送。同样的，如上文所述，一个应用程序可以指定建立会话的传输方式，并且 AllJoyn 路由将仅在指定的 AllJoyn 传输方式下尝试建立连接。

如果应用程序没有指定用于发现或建立会话的 AllJoyn 传输方式， AllJoyn 路由会更倾向于使用 UDP 传输方式。这是因为 UDP 传输方式占用更小的文件描述符资源。而在 TCP 方式下，特别是在连接数不断增长时，将会遭遇许多麻烦。

在发现中，如果一个应用程序没有指定 AllJoyn 传输方式（也就是说，指定为 TRANSPORT_ANY），`FoundAdvertisedName()`  会以 TCP 和 UDP 两种方式同时发出，UDP 方式会稍快发出。对于会话建立，情况类似。如果应用程序指定为 TRANSPORT_ANY， AllJoyn 会在两段都允许的情况下使用 UDP 传输方式。如果不允许使用 UDP 传输方式，就会使用 TCP 传输方式建立会话。



[alljoyn-endpoints]: /learn/core/system-description#alljoyn-endpoints


[alljoyn-transportmask-definition]: #alljoyn-transportmask-definition
[local-alljoyn-transports]: #local-alljoyn-transports
[tcp-transport-mechanism]: #tcp-transport-mechanism
[b2b-alljoyn-transports]: #bus-to-bus-alljoyn-transports
[performance-of-alljoyn-tcp-vs-udp]: #performance-of-alljoyn-tcp-transport-versus-udp-transport
[tcp-endpoint-auth-phase]: #tcp-endpoint-authentication-phase


[local-remote-endpoints]: /files/learn/system-desc/local-remote-endpoints.png
[alljoyn-router-multiple-remote-endpoints]: /files/learn/system-desc/alljoyn-router-multiple-remote-endpoints.png
[alljoyn-distributed-bus-b2b-endpoints]: /files/learn/system-desc/alljoyn-distributed-bus-b2b-endpoints.png
[thin-core-library-endpoint]: /files/learn/system-desc/thin-core-library-endpoint.png
[alljoyn-osi-seven-layer-arch]: /files/learn/system-desc/alljoyn-osi-seven-layer-arch.png
[tcp-transport-data-plane-internal-architecture]: /files/learn/system-desc/tcp-transport-data-plane-internal-architecture.png
[tcp-endpoint-lifecycle-states]: /files/learn/system-desc/tcp-endpoint-lifecycle-states.png
[tcp-endpoint-auth-states]: /files/learn/system-desc/tcp-endpoint-auth-states.png
[udp-transport-data-plane-internal-architecture]: /files/learn/system-desc/udp-transport-data-plane-internal-architecture.png
[udp-endpoint-lifecycle]: /files/learn/system-desc/udp-endpoint-lifecycle.png
[ardp-state-machine]: /files/learn/system-desc/ardp-state-machine.png
