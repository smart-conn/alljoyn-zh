# AllJoyn&trade; Transport

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
| 内存占用 | 中等 | 高 | Since UDP Transport has to provide the reliability support, it requires much higher memory usage. |
| TTL-based Message Expiration | Not possible | Supported | UDP Transport uses the AllJoyn Reliable Datagram Protocol (ARDP), which supports TTL-based message expiration. |
| Types of Data Transfer | Performs best for bulk data transfer | Performs best for intermittent short data transfer | Default socket buffers for Layer 4 TCP connections are typically much larger than those for UDP connections. As a result, TCP performs much better for bulk data transfer. |

The following table captures some of the use case scenarios with the 
preferred transport selection between TCP Transport and UDP Transport, 
based on trade-offs outlined in [Performance of AllJoyn TCP Transport versus UDP Transport][performance-of-alljoyn-tcp-vs-udp]. 

#### AllJoyn use cases showing TCP vs UDP Transport selection

| Use Cases | TCP Transport | UDP Transport |
|---|:---:|:---:|
| Dominant traffic is method calls | X | |
| Dominant traffic is bulk data transfer | X | |
| AllJoyn messages have TTL associated | | X |
| Large number of simultaneous sessions with intermittent RPC calls | | X |
| Very dirty RF conditions | X | |

Details on AllJoyn TCP Transport and UDP Transport are 
captured in the following sections.

### TCP Transport mechanism

As mentioned previously, the AllJoyn TCP Transport takes its name 
from the TCP/IP layer 4 transport mechanism it uses. Since TCP 
provides a reliable data stream guarantee, the TCP Transport 
must only provide enough mechanism to translate AllJoyn messages 
to and from byte streams.  

#### TCP Transport data plane architecture

Each connection that uses the TCP Transport has an associated TCP Endpoint, 
TCP Stream, and TCP socket as shown in the following figure. 

![tcp-transport-data-plane-internal-architecture][tcp-transport-data-plane-internal-architecture]

**Figure:** TCP transport data plane internal architecture

The routing functionality of a Routing Node connects to a TCP Endpoint, 
which represents a Remote Endpoint for a TCP Transport connection. 
The TCP Endpoint translates AllJoyn messages to and from the 
byte-stream representation using a TCP Stream component. 
TCP Stream delivers and received data over a TCP socket.

#### TCP endpoint lifecycle

A TCP Endpoint goes through multiple states in the overall 
lifecycle of the Endpoint. The states and transitions for the
TCP Endpoint are shown in the following figure. 

![tcp-endpoint-lifecycle-states][tcp-endpoint-lifecycle-states]

**Figure:** TCP endpoint lifecycle states

TCP Endpoints are created either as a result of an active 
connection request or an incoming call for a passive connection. 
The TCP Endpoint maintains information about whether the 
precipitating event was an active or passive connection. 

A TCP Endpoint follows the basic lifetime of an AllJoyn Thread.
It is first created in the INITIALIZED state. Prior to being used 
in the AllJoyn system, a TCP Endpoint must be authenticated.  
This is a done as a separate step and is discussed in
[TCP Endpoint authentication phase][tcp-endpoint-auth-phase]. 
If the authentication succeeds, the TCP Endpoint thread is asked 
to start running, at which point it enters the STARTING state. 
If the authentication fails, the TCP Endpoint transitions into the 
FAILED state and is then ready for cleanup.

As soon as the Thread(s) required to support a newly created 
and authenticated TCP Endpoint is actually running, the Endpoint 
enters the STARTED state. In this state, the TCP Endpoint is 
registered with the Router and therefore data can be transferred 
through the Endpoint. Once the connection is no longer needed, 
the Endpoint method `Stop()` is called, and the Endpoint enters 
the STOPPING state. Once all threads which may be running in 
the Endpoint have exited, the Endpoint enters into a JOINING state, 
where any threads associated with the Endpoint are joined (in the
sense of a Posix thread join operation). The Endpoint is then 
unregistered from the AllJoyn Router. When the threading-related 
resources in an endpoint are cleaned up, the endpoint enters the 
DONE state at which time it can be removed from the system and deleted.

##### TCP Endpoint authentication phase

As mentioned above, TCP Endpoints must transition through an 
authentication phase that is required to complete before Messages 
are allowed to be transferred though the endpoint.This 
authentication phase is handled by a separate thread, and is shown
in the following figure. The authentication process is begun when 
the TCP Endpoint enters the INTIALIZED state.

![tcp-endpoint-auth-states][tcp-endpoint-auth-states]

**Figure:** TCP endpoint authentication states

TCP Endpoint authentication uses the Simple Authentication and 
Security Layer (SASL) framework "ANONYMOUS" mechanism. 
While in the actual AUTHENTICATING state, the TCP Stream 
runs in a string-transfer mode in order to transfer the 
SASL challenges and responses. If the SASL exchange fails, 
authentication transitions to the FAILED state which, in turn, 
drives the TCP Endpoint state to change to FAILED.

If the SASL exchange succeeds, authentication transitions to 
the SUCCEEDED state and this, in turn, drives the TCP Endpoint 
to transition to the STARTING state. When the TCP Endpoint 
transitions to STARTED state the associated TCP Stream will 
make a mode switch and begin sending and receiving AllJoyn Messages 
instead of text strings. 

As soon as the FAILED or SUCCEEDED determination is made, 
and the appropriate Endpoint lifetime actions are taken, 
the endpoint authentication thread exits and causes the 
authentication machine transition to DONE.
 
### UDP Transport mechanism

The AllJoyn UDP Transport, as its name implies, uses the 
UDP/IP protocol to move AllJoyn Messages from one host to 
another. Since UDP does not provide a reliability guarantee, 
the UDP Transport must provide some mechanism to provide a 
reliable Message delivery guarantee.  The UDP Transport uses 
the AllJoyn Reliable Datagram Protocol (ARDP) to provide 
reliable delivery of messages. ARDP is based loosely on 
the Reliable Data Protocol (RDP) as appears in RFC 908 (version 1) 
and RFC 1151 (version 2).

#### UDP Transport data plane architecture

Architecturally, the UDP Transport can be split into two 
large components: the routing functionality of a Router Node 
connects to a so-called UDP Endpoint, and the networking functionality 
of the UDP Transport that is accessed through ARDP.

The UDP Endpoint is the primary data plane interface between 
the Routing Node and the UDP Transport. From the Routing Node 
point of view, each UDP Transport connection is represented by 
a UDP Endpoint. Each UDP Endpoint has an associated ARDP stream 
that converts AllJoyn messages to ARDP datagrams. The UDP Transport 
data plane architecture is captured in the following figure.

![udp-transport-data-plane-internal-architecture][udp-transport-data-plane-internal-architecture]
 
**Figure:** UDP transport data plane internal architecture

The ARDP Stream component converts from the notion of a 
Message stream to a stream of datagrams and, in turn, talks 
to an ARDP Connection. The ARDP Connection provides the 
end-to-end state information required to establish the reliability 
guarantees, and talks to a single UDP socket that is shared 
among the various ARDP connections managed by the UDP Transport.

#### UDP Endpoint lifecycle

UDP Endpoints go through a well-defined lifecycle as shown in the following figure.

![udp-endpoint-lifecycle][udp-endpoint-lifecycle]

**Figure:** UDP endpoint lifecycle

Endpoints are constructed because of either an Active or a 
Passive connection request. Similar to the TCP concept, 
an Active connection is an outgoing connection that is actively 
started on the local side. A Passive connection is an incoming 
connection that was actively started on the remote side. 
The ARDP protocol has a three-way handshake similar to that
provided by RDP and TCP. The entity that issues the SYN request 
enters into ACTIVE state and the entity which responds with a 
SYN+ACK enters into PASSIVE state.

Unlike TCP and RDP, ARDP provides additional information as 
data in the SYN and SYN+ACK packets. During the SYN, SYN+ACK, 
ACK exchange (happening in ACTIVE and PASSIVE states), the involved 
endpoints are authenticating and identifying themselves to their 
remote counterparts. Once this phase has completed, the endpoints 
enter the STARTED state when the endpoint is registered with the 
Routing Node as being ready. The STARTED state is one in which 
AllJoyn Messages may be sent and received.

Eventually, a connection may be stopped either as a result of a local 
or remote disconnect event. A disconnect is initiated by the Routing 
function making a `Stop()` call into the UDP Endpoint. This causes 
a state transition from STARTED to STOPPING. For a local disconnect 
event, an immediate transition is made to the WAITING state. 
This allows all queued and in-flight Messages to be sent to the 
remote side before an ARDP Disconnect is executed. 

**NOTE:** Unlike TCP, there is no four-way ending handshake in ARDP - 
this is handled at the Session level in the UDP Transport state machine.  

Once all data is transferred and acknowledged, a transition is 
made back to the STOPPING state. In STOPPING state, the various 
threads are notified that the endpoint is closing down. Once the 
threads are verified as having left, the endpoint transitions 
into the JOINING state. This is where resources are freed and 
any threads that may have been associated to the endpoint are 
joined (in the sense of a Posix thread join operation). The last 
part of the resource management is to unregister the endpoint 
from the Routing Node. When this is complete, the endpoint enters the 
DONE state and becomes ready for deletion by the endpoint management function.

#### ARDP state machine

The ARDP is a close relative of RDP which is documented in RFC-908 (version 1)
and RFC-1151 (version 2). At the heart of the ARDP is the ARDP 
connection state machine. Although similar to the TCP state machine, 
the ARDP machine is simpler, requiring only six states as shown 
in the following figure.

![ardp-state-machine][ardp-state-machine]

**Figure:** ARDP state machine

As in TCP, connections may be started actively or passively.  
An active, or outgoing connection begins by creating a UDP Endpoint 
and transitioning it to the ACTIVE state. The endpoint provides 
an "introduction" Message and passes it to ARDP, which responds 
by creating a connection, adding the "introduction" to a SYN 
packet and sending it. After sending the SYN packet, the local 
ARDP connection enters the SYN-SENT state. The remote ARDP which 
is in the LISTEN state, receives the SYN and calls back into the 
UDP Transport, providing the "introduction" and notifying 
that a connection request has been received. If the UDP Transport 
determines that a connection should not be undertaken, ARDP 
is notified and sends an RST pack to abort the connection.  

If the UDP Transport determines that the connection should be 
brought up, it creates a new UDP Endpoint in PASSIVE state and 
responds to the ARDP callback with its own "introduction response".
The passive side then enters the UDP Endpoint PASSIVE state 
and the ARDP sends the "introduction response" back to the 
active side in a SYN+ACK packet. When the active side receives 
the SYN-ACK packet, the ARDP state machine sends the final 
ACK packet, transitions to OPEN state and notifies the UDP Endpoint 
which, in turn, transitions to STARTED state. The active side 
is then ready to send and receive data. When the passive side 
receives the final ACK packet, its three-way handshake is complete.  

It transitions into the OPEN state and notifies the UDP Endpoint 
which transitions into the STARTED state. At this point, 
both sides are ready to send and receive data.

Since it is possible that a failure happens somewhere in the 
exchange between the local UDP Endpoint, the local ARDP, the 
remote ARDP and the remote UDP Endpoint, both sides have 
watchdog timers that abort the process if it does not complete 
in a timely manner.

As described above, there is no orderly shutdown of connections 
in the ARDP. This is accomplished in the UDP Endpoint state machine.
Transitions out of ARDP OPEN state are done by receiving or sending 
RST packets. To avoid problems with reuse of ARDP ports, a 
CLOSE_WAIT state is implemented similar to that of TCP.

#### ARDP packet format

Details of the ARDP packet formats are available in RFC 908 and RFC 1151.
Extensions to support granularity of AllJoyn Message instead of 
UDP Datagrams and also dropping of in-flight Messages based on 
TTL expiration required changing SYN and DATA packet formats.

The following table shows the ARDP SYN packet format. 
A delayed ACK timeout was added to support functionality 
similar to delayed ACK as used in TCP. A variable length data 
and an associated Data Length field was also added. The 
SYN+ACK packet is returned in this format, but with the ACK bit set.

#### ARDP SYN Packet Format
| Fields |
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

The following table shows the ARDP DATA packet format. 
The format is substantially similar to that described by 
RFC 908 and RFC 1151, but several fields were added to 
support new features. Since ARDP is designed to support 
sending and receiving AllJoyn Messages, which can span 
three 65535-byte UDP datagrams, the concept of a Message 
fragment was added. This necessitated adding a fragment count 
field and a start-of-message sequence number to identify 
the sequence number corresponding to the first UDP datagram 
in an AllJoyn Message. A Time-to-Live field was also added 
to support expiring AllJoyn Messages with a finite time to live; 
and in order to coordinate expiration of Messages, which 
may be in the process of being retransmitted, the Acknowledge-Next 
field was added.

#### ARDP data packet format

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

#### UDP transport configuration

ARDP is a flexible protocol, and so there are a number of 
configurable parameters used. These parameters are settable via 
the AllJoyn Router configuration file.

| Parameter name | Description | Default value |
|---|---|:---:|
| udp_connect_timeout | When an initial ARDP connection is attempted, the precipitating SYN packet may be lost. If, after some time, the foreign host does not respond, the connection must be attempted again. This value is the time period that ARDP waits before attempting to resend the SYN packet. | 1000 msec |
| udp_connect_retries | When an initial ARDP connection is attempted, the precipitating SYN packet may be lost. If, after some time, the foreign host does not respond, the connection must be attempted again. This value is the number of times that ARDP will try to resent SYN packet before giving up. | 10 |
| udp_initial_data_timeout | When a data ARDP segment is sent, an RTO timer is started that determines when to resend the segment if an acknowledgment is not received. ARDP performs adaptive SRTT and RTO estimation using the TCP algorithm from RFC 6298. This parameter defines an initial RTO value which is used for a data segment only when no RTT estimates are available. | 1000 msec |
| udp_total_data_retry_timeout | The overall time period for which a data segment should be retried before giving up and disconnecting the associated ARDP connection. | 10000 msec |
| udp_min_data_retries | The minimum number of times a given ARDP data segment will be retransmitted. A data segment might be transmitted for more number of times than this value over the udp_total_data_retry_period. | 5 |
| udp_persist_interval | When the advertised window size on the foreign host goes to zero, it stops the (local) sender from transmitting data until the window becomes nonzero. Since ARDP does not reliably send ACK packets, it is possible to lose an ACK packet that reopens the window. In that case, the local and foreign sides could deadlock: the foreign side to receive data and the sender waiting for an ACK with a new window size. ARDP supports sending zero window probes (NUL packet) if it does not get update to the window after receiving a zero window ACK. The zero window probes are sent following an exponential backoff schedule. This parameter defines initial persist interval used as first timeout for the zero window schedule. | 1000 msec |
| udp_total_app_timeout | The overall time period for which zero window probes should be sent before the associated ARDP connection is declared broken. | 30000 msec |
| udp_link_timeout | ARDP is very interested in quickly determining when a link has gone down, idle or not. The idea is to guarantee that some data is present on the link at least once over a given interval. This may be data, ACK for that data, or a special NUL keep-alive packet.This parameter provides the default overall timeout period during which a broken link for a connection must be detected. A link timeout is used to compute the keep-alive interval for sending periodic keep-alive probes. This value is used only if the link timeout was not set by the app, otherwise the link timeout from the app is used. | 30000 msec |
| udp_keepalive_retries | Provides the total number of times keep-alive probes will be sent before declaring the link as broken and terminating the ARDP connection. | 5 |
| udp_fast_retransmit_ack_counter | Similar to TCP, ARDP supports fast retransmission of segments based on the out-or-order EACKs (Enhanced ACKs) received. This value defines how many out-of-order EACKs should be received before ARDP performs the retransmission. A segment is fast retransmitted only once. | 1 |
| udp_timewait_timer | Amount of time that a connection should remain in the RDP Close_Wait state, to ensure that all outstanding packets that might be wandering around the network have died out for that connection. This behavior ensures that the port pair defining the ARDP connection cannot be reused for twice the expected lifetime of a datagram and therefore datagrams from an earlier incarnation of a connection cannot interfere with a current connection. | 1000 msec |
| udp_segbmax | Maximum size of an ARDP segment as negotiated during connection setup. Since ARDP runs on top of UDP, this is determined based on the max UDP packet size. Since the maximum datagram size in UDP is 65535 bytes, the most efficient / maximum ARDP message size is the maximum size of UDP packet. Larger-sized AllJoyn messages are fragmented into the multiple segments required to carry those messages. | 65507 |
| udp_segmax | Maximum number of outstanding ARDP segments the receiver is willing to accept as negotiated during connection setup. This value governs how many segments can be in the flight and hence impacts the overall achieved throughput. The SEGMAX unit is ARDP segments. ARDP supports flow control through dynamic windowing in the message header. When data is received by ARDP and "checked in" to the ARDP receive queue, it is immediately acknowledged, but the receive window is decremented by 1. It is only when a datagram is delivered to the app, that the datagram is removed from the receive buffer and the receive window is incremented by 1. | 50 |

### Name Service usage by the AllJoyn Transport

Both the TCP Transport and the UDP Transport provide the same 
advertisement and discovery capabilities. Both of these transports 
use the IP multicast-based Name Service as their advertisement 
and discovery mechanism. The Name Service uses the underlying 
IP (UDP) multicast to accomplish advertisement and discovery 
functions. The Name Service is implemented in the Routing Node 
as a singleton and is accessed by both the TCP Transport and 
the UDP Transport through their respective control planes. 
[Advertisement and Discovery][advertisement-discovery] captures
the details on the legacy Name Service and Next-Generation Name Service
(NGNS) used for adverisement and discovery in the AllJoyn system,

### Transport selection at the AllJoyn Router

For discovery, if an application selects a specific transport 
(TCP Transport or UDP Transport), then the `FoundAdvertisedName()` 
callback is only sent for that transport. Also, as mentioned earlier, 
an app can indicate which specific transport to be used to 
establish a session, and the AllJoyn router will attempt to 
perform session setup only over the specified AllJoyn transport.

If an app does not indicate a specific AllJoyn transport for 
discovery or session setup, the AllJoyn router behavior is to 
give preference to UDP Transport. This behavior is mainly motivated 
by the fact that UDP Transport requires much smaller file descriptor 
resources which becomes an issue with TCP Transport as the number 
of connections grows. 

For discovery, if an app does not indicate a specific AllJoyn transport 
(that is, TRANSPORT_ANY is specified), the `FoundAdvertisedName()` 
callback is sent for both UDP Transport and TCP Transport, with the 
callback for UDP Transport sent first. Similarly for session setup, 
if TRANSPORT_ANY was indicated by the app, the AllJoyn router 
will establish session over UDP Transport if it is available 
at both endpoints of the connection. If the UDP Transport is not 
available, then session setup will be done over TCP Transport. 



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
