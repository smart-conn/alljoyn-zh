# Thin Apps 精简应用程序

## Overview 概览

The AllJoyn&trade; system is designed to operate across AllJoyn-enabled
devices with different capabilities. The AllJoyn Standard Core Library (AJSCL)
is designed to run on devices that usually have significant
amounts of memory, available energy, and computing power,
along with operating systems that support multiple processes/threads
with multiple standard language environments. The AJSCL is designed
for general purpose computer devices and supports application
running on HLOS including Microsoft Windows, Linux, Android, iOS, and OpenWRT.
AllJoyn 系统旨在实现夸 AllJoyn 设备的功能控制。AllJoyn 标准内核资源库通常应用于拥有较大内存、较大电源、较强处理能力和拥有多线程操作和多种标准语言环境的操作系统中。AJSCL 为通用计算机设计，支持运行在 HLOS（包括Microsoft Windows、Linux、Android、iOS 和 OpenWRT）上的应用程序。

On the other hand, single-purpose AllJoyn-enabled devices
usually have an embedded system running on a microcontroller
designed to provide specific functionality. Such embedded
systems are optimized to reduce the size and cost of the product,
often by limiting memory size, processor speed, available power,
peripherals, user interfaces, or all of the above.
The AllJoyn Thin Core Library (AJTCL) is designed to bring
the benefits of the AllJoyn distributed programming environment
to embedded system-based devices.
另一方案，单一目的的 AllJoyn 设备通常拥有一套嵌入式系统。该系统运行在提供某种特定功能的微控制器上。这些嵌入式系统为了降低设备的成本和缩减设备的体积，通常采用削减内存，降低处理速度，限制电源功率，删除周边设备和用户接口等方法。AllJoyn 精简内核为嵌入式系统设备提供了良好的 AllJoyn 分布式编程环境。

The AJTCL provides a lightweight implementation of core AllJoyn
functionality for embedded microcontroller applications. An embedded
system-based AllJoyn device (thin AllJoyn device) only includes an
AllJoyn thin application utilizing the AJTCL and does not include
an AllJoyn router component because of its resource-constrained
environment. It borrows an AllJoyn router from another standard
AllJoyn-enabled device in the AllJoyn proximal network, and
uses it for core AllJoyn functions including advertisement and
message routing. An AllJoyn thin application is fully compatible
and inter-operable with standard AllJoyn applications on the
AllJoyn proximal network. In fact, a remote application will
not even know that it is talking with an AllJoyn thin application
on the other side.
AJTCL 为嵌入式微控制器程序提供了一种轻量级的核心 AllJoyn 功能的实现方案。嵌入式 AllJoyn 设备（精简 AllJoyn 设备）只包含一个采用 AJTCL 的精简 AllJoyn 程序，鉴于有限的资源环境，并不包含 AllJoyn 路由组件。它向 AllJoyn 临域网络内的某一标准 AllJoyn 设备借用其 AllJoyn 路由，并利用它实现 AllJoyn 核心功能，如 advertisement 和信息转发。AllJoyn 精简应用程序完全兼容与临域网络内的标准 AllJoyn 应用程序进行互操作。实际上，远程控制程序甚至不知道另一侧与正自己进行会话的是一个精简 AllJoyn 应用程序。


The following figure shows a context architecture depicting
how AllJoyn thin applications fit in the overall AllJoyn distributed system.
下图展示了精简应用程序适配整个 AllJoyn 分布式系统的联系结构。

![img thin-app-arch][]

**图:** Thin app context architecture 精简应用程序联系结构

It shows two thin AllJoyn-enabled devices (device 3 and device 4)
with a single AllJoyn thin application installed on each of them.
A thin app is built on top of AJTCL and it connects with the
distributed AllJoyn bus by establishing a connection with an
AllJoyn router on a standard AllJoyn-enabled device (e.g., AllJoyn router
installed on the Wi-Fi Access Point). The AJTCL uses the AllJoyn
service advertisement and discovery process to discover the
AllJoyn router via a BusNode well-known name. After the
discovery phase, the AJTCL establishes a connection with
the discovered AllJoyn router over TCP. Once connected with
the AllJoyn router, the thin app is just like any other
application endpoint on the AllJoyn distributed bus.
该图展示了两个 AllJoyn 设备（device 3 和 device 4），它们各自安装了一个 AllJoyn 精简应用程序。基于 AJTCL 建立的精简应用程序通过与一个标准 AllJoyn 设备上的路由（如安装在 Wi-Fi Access Point 上的 AllJoyn 路由）与分布式 AllJoyn 总线建立连接。AJTCL 使用 AllJoyn 的 advertisement 和 discovery 服务，通过 BusNode well-known name 发现 AllJoyn 路由。

**注意:** More than one thin application can connect to a given AllJoyn router. 多个精简应用程序可连接到单个指定 AllJoyn 路由。

A thin app can act as an AllJoyn service provider, an AllJoyn
service consumer or both. It follows the same session establishment
procedures as AllJoyn standard apps to accept sessions from and/or
connect to sessions with other remote apps, which can be another
AllJoyn thin app or AllJoyn standard app.
一个精简应用程序可同时作为 AllJoyn 服务的提供者和使用者，或其中的任一身份。会话的建立方式与标准 AllJoyn 应用程序接受、建立与另一个远程应用程序（标准应用程序或精简应用程序）会话的过程相同。

## Functional architecture 功能结构

The following figure shows the detailed functional architecture
for an AllJoyn thin application. A thin app includes app-specific
code (app code) and the AJTCL. As part of the app code, a thin
app can include one or more AllJoyn service frameworks which
include Onboarding, Configuration, and Notification service
frameworks. App Code also includes app-specific AllJoyn services
if the thin app is acting as an AllJoyn service provider.
下图展示了 AllJoyn 精简应用程序的详细功能结构。一个精简应用程序包含了应用指定代码（应用代码）和 AJTCL。作为应用代码的一部分，一个精简应用程序包含了一个或多个 AllJoyn 服务架构。这些服务架构包含了 Onboarding、Configuration 和 Notification 服务架构。如果精简应用程序以 AllJoyn 服务提供者的身份运行，那么其应用代码也会包含应用指定 AllJoyn 服务。

![img thin-app-functional-arch][]

**图:** Thin app functional architecture 精简应用程序功能结构

The AJTCL consists of some key functional modules as shown in
the previous figure, among other supported functions. These include
Bus Connection Manager, About, Messaging and App Authentication modules.
AJTCL 包含了上图中所示支持的功能中比较重要的几个功能模块。这些模块包含了 Bus Connection Manager、About、Messaging 和 App Authentication 模块。

* The Bus Connection Manger module provides discovery and
connection establishment with a nearby AllJoyn router (BusNode).
* Bus Connection Manager 模块提供了发现周边 AllJoyn 路由（BusNode）并与之建立连接的功能。
* The About module provides advertisement and discovery
functions for thin app. It supports sending out the Announcement
sessionless signal for the thin app over distributed AllJoyn bus.
* About 模块为精简应用程序提供 advertisement 和 discovery 功能。该模块支持在分布式  AllJoyn 总线上发出精简应用程序的 Annoucement sessionless signal。
* The  marshaling module provides marshaling/unmarshaling for AllJoyn
messages and routing these to the connected AllJoyn router.
* Marshaling 模块为 AllJoyn 信息提供了封送和逆封送功能，并把这些信息转发到连接的 AllJoyn 路由上。
* The App Authentication module provides application-level authentication
and security between thin app and remote AllJoyn apps. The ALLJOYN_PIN_KEYX
auth mechanism is supported in the AJTCL for releases before the 14.06 release.
This auth mechanism is removed from AJTCL in the 14.06 release.
Starting from the 14.06 release, the AJTCL supports a new set of
Elliptic Curve Diffie-Hellman Ephemeral (ECDHE)-based auth mechanisms
as described in [App layer authentication][app-layer-auth].
* App Authentication 模块为精简应用程序与远程 AllJoyn 应用程序之间提供了应用级别的身份验证和安全保护。在 14.06 版本之前，AJTCL 采用的是 ALLJOYN_PIN_KEYX 验证机制。14.06 版本以及其后续版本，都采用了一套全新的如 [App layer authentication][app-layer-auth] 所述的基于Elliptic Curve Diffie-Hellman Ephemeral (ECDHE)的验证机制。

## AJTCL-to-AllJoyn router connection AJTCL 与 AllJoyn 路由的连接

Upon startup, the thin application initiates the process of
discovery and connection establishment with an AllJoyn router
on another standard AllJoyn-enabled device. This is done using
the name-based discovery mechanism.
在启动时，精简应用程序启动 discovery 进程，与另一个标准 AllJoyn 设备上的 AllJoyn 路由建立连接。这个过程通过 name-based discovery 机制实现。

An AllJoyn router that supports hosting connections for thin apps
advertises a BusNode well-known name. The advertised well-known
name can be one or both of the following:
AllJoyn 路由支持广告 BusNode well-known name 的精简应用程序。被广告的 well-known name 拥有一个或多个下列属性。

* Generic BusNode well-known name "org.alljoyn.BusNode"
driven by the AllJoyn router configuration
* 由 AllJoyn 路由配置的通用 Generic BusNode well-known name "org.alljoyn.BusNode"
* Specific BusNode well-known name advertised by an application
attached to the AllJoyn router, meant for discovery only by
related thin applications.
* 由连接到 AllJoyn 路由的应用程序广播的特定 BusNode well-known name，旨在发现相关的精简应用程序。

The AllJoyn router advertises the BusNode well-known name quietly,
that is, the advertisement messages are not sent out
gratuitously by the AllJoyn router. Instead, the AllJoyn router
only sends out the BusNode well-known name advertisement in
response to a query from a thin app. Also, the advertisement
message is sent out quietly via unicast back to the requester
(instead of being sent over multicast). This logic is meant
to minimize the network traffic generated as a result of
thin app-related discovery of an AllJoyn router.
AllJoyn 路由以被动方式广告 BusNode well-known name，广告信息不会被平白无故地发送。当收到精简应用程序的的查询需求时，才会发送 BusNode well-known name advertisement。此外，广告信息通过单播方式（而不是多播方式）回应给请求者。这样的方式旨在减少由精简应用程序发现服务相关的 AllJoyn 路由产生的网络流量。

The AllJoyn router limits the number of simultaneous connections
with thin applications in the AllJoyn network. This limit is
configurable as '`max_remote_clients_tcp`' via the router
config file. The AllJoyn router stops advertising all BusNode
names when the '`max_remote_clients_tcp`' limit is reached and resumes when the
current number of thin app connections drop down below the limit.
AllJoyn 路由限制了 AllJoyn 网络中同时存在的精简应用程序连接数量。可以通过更改路由配置文件中的 '`max_remote_clients_tcp`' 值对限制值进行调整。

The connection process between the AJTCL and the AllJoyn router
is split into the following phases:
AJTCL 与 AllJoyn 路由之间的连接过程分为以下几个阶段：

* Discovery phase: The AJTCL discovers an AllJoyn router on
the AllJoyn proximal network via the BusNode name-based
discovery mechanism. The overall discovery timeout is specified
by the thin app in the `FindBusAndConnect()` API call.
Starting from the 14.12 release, the AJTCL supports mDNS-based
discovery along with legacy discovery for discovering AllJoyn
routers. Logic for this phase is captured below for pre-14.12 TCL
and 14.12 TCL.
  The AJTCL sends out a WHO-HAS message for the BusNode
  well-known name following a backoff schedule. The IS-AT
  message is sent over unicast to the AJTCL by the
  AllJoyn router advertising that BusNode name.
* 发现阶段：AJTCL 通过 BusNode name-based discovery 机制发现 AllJoyn 临域网络内的的 AllJoyn 路由。发现的超时时常通过调用 `FindBusAndConnect()` API 进行设定。自 14.12 版本开始，AJTCL 加入了 mDNS-based discovery 方式进行 AllJoyn 路由发现。下文使用 pre-14.12 TCL 和 14.12 TCL 表述这两个阶段。AJTCl 为 BusNode well-known name 发送一个 WHO-HAS 消息，其后跟随一个退避列表。IS-AT 消息由广告 BusNode Name 的 AllJoyn 路由通过单播方式发送到 AJTCL。
* Connection phase: The AJTCL establishes a TCP connection
with the AllJoyn router based on the connection details
received in the discovery response.
* 连接阶段：AJTCL 通过从 discovery response 中获得的详细信息建立与 AllJoyn 路由之间的 TCP 连接。
* Authentication phase: SASL anonymous authentication is used
by the AJTCL to authenticate and start using services of the
AllJoyn router.
* 身份认证阶段：AJTCL 通过 SASL 匿名身份认证开始使用 AllJoyn 路由的服务。

As part of the connection establishment, the AJTCL also exchanges
the AllJoyn protocol version (AJPV) with the AllJoyn router.
If the AllJoyn router supports a lower AllJoyn protocol version
than the minimum AJPV the thin app requires, the connection
process fails. This failure or an authentication failure will
result in the routing node being added to the blacklist, described
in [Router blacklisting][RN blacklisting].
For the first-time connecting with any AllJoyn router, this
connection establishment process also generates a local GUID
for the AJTCL and sends it to the AllJoyn router.
作为连接形成的一部分，AJTCL 同样与 AllJoyn 路由之间交换 AllJoyn 协议版本（AJPV）。如果 AllJoyn 路由支持的协议版本比应用程序要求的最低（AJPV）版本还低，那么连接进程将失败。这种失败方式或者其它类型的验证失败将会导致该节点被加入黑名单，在［Router blacklisting][RN blacklisting] 中具体说明。

### Pre-14.12 router discovery

The following figure shows the message flow for the pre-14.12
release for the AJTCL discovering and connecting with the
AllJoyn router.
下图展示了 pre-14.12 版本 AJTCL 发现和连接 AllJoyn 路由的信息流。

![img RN Discovery pre-1412][]

**图:** Pre-14.12 router discovery and connection

The AJTCL sends out a WHO-HAS message for the BusNode well-known
name following the message schedule as described in
[WHO-HAS message schedule][WHO-HAS schedule].
The response IS-AT message is sent over unicast to the AJTCL
by the AllJoyn router advertising that BusNode name. Any
responses received from the AllJoyn routers on the blacklist
are ignored.
¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥。回应的 IS-AT 消息通过 AllJoyn 路由广播该 BusNode Name 被单播传播至 AJTCL。所有从 AllJoyn 路由黑名单中发出的回应信息都会被忽略。

After router discovery, the rest of the AJTCL logic is same as
described above in [AJTCL-to-AllJoyn router connection][tcl-RN connect].
在路由发现完成之后，其余的 AJTCL 逻辑与上述 [AJTCL-to-AllJoyn router connection][tcl-RN connect] 部分完全一致。

#### WHO-HAS message schedule WHO-HAS 消息标准

Prior to the 14.12 release, the AJTCL supports the following
retry schedule for sending WHO-HAS discovery messages:
在14.12版本之前，AJTCL 支持以下方式重发 WHO-HAS 发现消息。

1. Send the WHO-HAS message once a second for 10 seconds. 每 1 秒发送一条 WHO-HAS 消息，持续 10 秒。
2. Wait 10 seconds, then send another WHO-HAS message. 等待10秒后，再发送一条 WHO-HAS 消息。
3. Wait 20 seconds, then send another WHO-HAS message. 等待20秒后，再发送一条 WHO-HAS 消息。
4. Wait 40 seconds, then send another; repeat until the overall discovery
timeout expires. 等待40秒后，再发送一条 WHO-HAS 消息。不断重复直到发现服务超时。

### 14.12 router discovery

The following figure shows the message flow for the 14.12 release
for the AJTCL discovering and connecting with the AllJoyn router.
下图展示了 14.12 版本 AJTCL 发现和连接 AllJoyn 路由的信息流。

![img RN Discovery 1412][]

**图:** 14.12 router discovery and connection

The AJTCL supports both mDNS and legacy discovery mechanism. If the
AJTCL minimum AJPV is lower than "10", the AJTCL can connect
to routers prior to the 14.06 release. In this case, the TCL
generates and sends out both WHO-HAS and mDNS query messages
for the BusName prefix. The schedule for sending these messages
is described in [Discovery message schedule][discovery msg sched].
AJTCL 同时支持 mDNS 和 以往的发现机制。如果 AJTCL 的最低 AJPV 小于 10，那么该 AJTCL 只能与 14.06 或更早的版本的路由建立连接。在这种情况下，TCL 会生成和发送 WHO-HAS 信号，同时也会发送 mDNS 信号查询 BusName 前缀。发送此类消息的详情，请参阅 [Discovery message schedule][discovery msg sched]。

The discovery response (either an mDNS response or IS-AT message)
is sent over unicast to the AJTCL by the AllJoyn router advertising
that BusNode name. The mDNS responses may include a key-value pair
indicating the protocol version (the key is 'ajpv') of the
transmitting AllJoyn router (this was added in 14.12 release).
The value of ajpv is used to ignore the discovery response if
the version is less than the minimum required by the thin app.
If both IS-AT and mDNS responses are received by AJTCL at the
same time, the mDNS response is processed first. Responses received
from the AllJoyn routers on the blacklist are ignored.
Discovery response（无论 mDNS response 或是 IS-AT message）通过广告 BusNode Name 的 AllJoyn 路由通过单播的方式传送到 AJTCL。mDNS response 可能会包含一组键-值对，说明了发信 AllJoyn 路由的协议版本（在 14.12 版本中被加入），协议版本的键为 'ajpv'。ajpv 的值用于判断版本是否低于精简应用程序要求的最低版本，如果低于最低要求，那么就会忽略 discovery response。如果 AJTCL 同时收到 IS-AT 和 mDNS response， mDNS response 将被优先处理。通过 AllJoyn 路由收到的在黑名单上的 response 将被忽略。

在路由发现完成之后，其余的 AJTCL 逻辑与上述 [AJTCL-to-AllJoyn router connection][tcl-RN connect] 部分完全一致。

#### Discovery message schedule Discovery 信息策略

The AJTCL supports a retry schedule for sending discovery messages.
It will also selectively send WHO-HAS messages depending on the
minimum protocol version the thin app requests; if the minimum
version is less than 10 it will send both an mDNS query and a
WHO-HAS message. The retry schedule applies to both types of
discovery messages and is as follows:
在发送 discovery 信息时，AJTCL 提供了重试策略。同时AJTCL也会根据精简应用程序要求的最低协议版本，选择性地发送 WHO-HAS 信息；当最低版本低于10，将会同时发送 mDNS 查询和 WHO-HAS 信息，并且重试策略同时支持这两者。具体策略如下：

1. Send a burst of three discovery message(s) and pause 1.1 seconds. Repeat 10
times. 发送一段三连 discovery 信息，随后间隔 1.1 秒。重复十次。 
2. Wait 10.1 seconds, then send another burst of three messages. 等待10.1秒，在发送一段三连信息。
3. Wait 20.1 seconds, then send another burst of three messages. 等待20.1秒，在发送一段三连信息。
4. Wait 40.1 seconds, then send another burst of three messages. 等待40.1秒，在发送一段三连信息。
Repeat until the overall discovery timeout expires. 不断重复直到发现服务超时。

The addition of the 100 msec on the wait intervals ensures that
all possible 100ms slots are covered as quickly as possible. 
This increases the likelihood of successful receipt of multicast
packets over Wi-Fi.
等待间隔时间多余的 100 毫秒保证了所有可能的 100 毫秒间隙都被以尽可能快的速度覆盖到。这增加了通过了 WI-FI 接受多播数据包回应的成功率。

### Router Selection 路由选择

Starting in the in the 15.04 release a feature called Router Selection was
introduced. This feature enables an AJTCL to select the most desirable AllJoyn
router. The detailed [design description][design desc] is available for download
on the Core Working Group [Wikipage][Core Wiki].
自 15.04 版本以来，AllJoyn 引入了路由选择功能。它为 AJTCL 提供了选择最理想 AllJoyn 路由的功能。[详细描述][design desc] ，请访问核心工作组 [Wikipage][Core Wiki] 的页面进行下载。

The following figure shows the message flow for a 15.04 AJTCL discovering and
connecting with a 15.04 AllJoyn router using router selection.
下图展示了 AJTCL 利用路由选择，发现并连接 15.04 版本 AllJoyn 路由的信息流。

![img RN Discovery with RS][]

**图:** Router discovery using Router Selection 使用路由选择的路由发现

At a high level the feature is implemented in two parts: 在高规格应用时，该功能将分为两个部分：

1. The router uses a number of both static and dynamic parameters, including
power source, mobility, as well as connection availability and capacity, to
calculate a **rank**, which is communicated via the Priority field of the mDNS
response packet described above in [14.12 router discovery][RN discovery 1412].
Details of the algorithm to calculate the rank, and how that is converted into
the a DNS Priority value are in the [design description][design desc].
1. 路由使用包括电源、速率、连接可用性和连接容量等一系列的静态和动态参数进行 **rank** 的计算。**rank** 通过上述 mDNS 返回包 [14.12 路由发现][RN discovery 1412] 中的 Priority 字段体现。

2. AJTCL will wait a minimum of 5 seconds collecting discovery responses. For
each response received the processing  related to the 'ajpv' key-value pair and
blacklisting takes place. Once the wait time is complete AJTCL will connect to
the router with the highest rank it has received to that point.  If there is a
tie, or none of the discovery responses it receives contain a rank, it will
randomly select among the equivalent routers and connect. After router
discovery, the rest of the AJTCL logic is same as described above in
[AJTCL-to-AllJoyn router connection][tcl-RN connect].
2. AJTCL 至少花费 5 秒的时间接受 discovery 回应。每一个接受的回应的过程，都与上述 ‘ajpv’ 键－值对相关，同时黑名单也对这个过程有效。当等待时间结束，AJTCL 将选择期间接收的路由 rank 最高的一个进行连接。如果 rank 值相同，或者 discovery 回应中不包含 rank， AJTCL 将在路由中随机选择一个并连接。

### Router blacklisting 路由黑名单

Starting in the in the 15.04 release a feature called router blacklisting was
added. This feature enables an AJTCL to track routers that are incompatible and
avoid attempting to connect to them again. In order to track incompatible
routers (as determined during connection establishment), a blacklist has been
implemented. The blacklist ensures discovery responses for routers on the
blacklist are ignored.
自 15.04 版本以来，AllJoyn 引入了路由黑名单功能。此功能使得 AJTCL 能够追踪不兼容的路由，并避免再次连接它们。为了追踪不兼容路由（根据建立情况决定），建立了黑名单。黑名单确保在名单内的 discovery 回应被忽略。

The explicit criteria for adding a router to the blacklist
is a connection failure either because authentication does
not complete successfully, or because the protocol version
of the router does not meet the minimum required by the thin app.
The default size of the blacklist is 16 entries; the addition of
a 17th router will over-write the first in the list (i.e.,
the list is actually a circular buffer). The blacklist only
persists until the thin app is restarted.
将路由加入黑名单的明确标准有亮点。一是身份认证失败导致的不成功连接，二是协议版本低于精简应用程序要求的最低标准。黑名单的默认容量是 16；第 17 个路由将覆盖第 1 个(即黑名单列表是一个循环缓冲区)。黑名单会在精简应用程序重启时重置。


### AJTCL and AllJoyn router compatibility AJTCL 和 AllJoyn 路由兼容性

The following table captures the compatibility matrix between
the AJTCL and AllJoyn router across the AllJoyn 14.02 and 14.06
releases. The AJTCL using the 14.06 release is only compatible
with a 14.02 AllJoyn router if the router does not require AJTCL
authentication. The AJTCL default minimum protocol version
in the 14.12 AJTCL is set to 11 (the version of the 14.12
AllJoyn router), but can be changed by the thin application
if it does not need to use the NGNS feature.
下表展示了 14.02 和 14.06 版本中 AJTCL 和 AllJoyn 路由之间的兼容性

#### AJTCL and AllJoyn router compatibility

| AJTCL / Router | 14.02 (AJTCL auth enabled) | 14.06 (AJTCL auth disabled) | 14.06 |
|---|---|---|---|
| **14.02** | Compatible | Compatible | Compatible |
| **14.06 (thin app not using NGNS)** | Incompatible | Compatible | Compatible |
| **14.06 (thin app using NGNS)** | Incompatible | Incompatible | Compatible |

### Detecting a router link failure 发现路由链接失败

The AJTCL provides a mechanism for the thin application to
implement a probing mechanism to detect connectivity failures
with the AllJoyn router. This can be achieved by invoking the
`SetBusLinkTimeout()` API provided by the AJTCL. The thin app
specifies a timeout value (with minimum timeout of 40 seconds)
as part of this API. If no link activity is detected during
this time period, the AJTCL sends probe packets every 5 seconds
over the router link. If no acknowledgment is received for three
consecutive probe packets, an error is returned to the thin application.
AJTCL 为精简应用程序提供了一种检测与 AllJoyn 路由之间失败连接的机制。通过调用 AJTCL 提供的 `SetBusLinkTimeout()` API 实现。在 API 中，精简应用程序可以指定一个超时值（至少 40 秒）。如果在这期间没有发现活动连接，AJTCL 将在路由链接中每隔 5 秒发送一个探测包，并把错误返回给精简应用程序。

At this point, the thin app should re-initiate discovery for the AllJoyn router.
在这种情况下，精简应用程序应该再次启动寻找 ALlJoyn 路由的 discovery。

## Thin app functionality 精简应用程序功能

As mentioned previously, the AJTCL supports all of the key
AllJoyn core functionality as a standard core library. APIs
are provided as part of the AJTCL for the thin app to invoke
core functionality. The AJTCL in turn generates appropriate
AllJoyn format messages (for method_call/reply, signals etc.)
to invoke related APIs on the AllJoyn router. The AJTCL sends
the generated AllJoyn messages to the AllJoyn router to accomplish
the given functionality. The thin app message flow for core
functionality is similar to the standard app with the key difference
that the thin app is connected remotely with the AllJoyn router.
如上文所述，AJTCL 支持标准内核的主要功能。AJTCL 提供了一些 API，使得精简应用程序能够调用核心功能。AJTCL 轮流生成合适的 AllJoyn 格式信息（为方法调用／回应，信号等）调用 AllJoyn 路由上的相关 API。AJTCL 向 AllJoyn 路由发送生成的 AllJoyn 信息以完成指定功能。

The following figure shows an example message flow for a thin
app discovering a well-known name prefix.
下图展示了精简应用程序发现 well-known name 前缀的信息流。

**注意:** The AJTCL and AllJoyn router exchange data using AllJoyn
messages (method_call/reply and signals). AJTCL 与 AllJoyn 路由之间通过 AllJoyn 信息（方法调用／回应和信号）交换数据。

![img RN Discovery][]

**图:** Thin app discovering a well-known-name prefix 精简应用程序发现 well-known-name 前缀

The AJTCL provides support for following core AJ functionality: AJTCL 为以下核心 AJ 功能提供支持：

* Service Discovery and Advertisement:  Both legacy Name Service
and Next-Gen Name Service functions are supported. 服务的发现和广告：支持老版本和新版本的 Name Service。
* About advertisement About 广告
* Session establishment 会话建立
* Sessionless signals 
* App layer authentication 应用层认证
* The AJTCL provides app layer authentication so that thin app
can implement secure interfaces and also access secure
interfaces on other AllJoyn providers.AJTCl 提供应用层认证。使得精简应用程序实现安全接口，并访问其它 AllJoyn 提供者的安全接口。
* New authentication schemes are supported in the 14.06 release
(see [App layer authentication][app-layer-auth]).

Thin apps can also include existing AllJoyn service framework
functionality by bundling thin app-specific libraries provided
for these service frameworks.

## App layer authentication

The AJTCL provides support for app layer authentication for
the thin app to implement and access secure AllJoyn services.
App layer authentication schemes supported are different in
release prior to the 14.06 release and starting from the 14.06
release as described below.

Prior to the 14.06 release, the AJTCL supports ALLJOYN _PIN_KEYX
auth mechanism for app layer authentication. Also, SASL protocol
is used for authentication.

Starting from the 14.06 release, ALLJOYN _PIN_KEYX auth mechanism
is removed from AJTCL. New Elliptic Curve Diffie-Hellman Ephemeral
(ECDHE)-based auth mechanism were added to the AJTCL:

* ECDHE_NULL is an anonymous key agreement. There is no PIN or pass-phrase
required.
* ECDHE_PSK is a key agreement authenticated with a pre-shared
key like a PIN, pass-phrase, or symmetric key.
* ECDHE_ECDSA is a key agreement authenticated with an asymmetric
key validated with an ECDSA signature.

The use of SASL protocol for authentication is removed from the
AJTCL in the 14.06 release. Instead, an AllJoyn-based protocol
is used for app layer authentication.

### Auth compatibility

A 14.06 thin app cannot interact with a 14.02 thin app over secure
interfaces and vice versa because these apps support different types
of auth mechanisms. These apps can still talk to each other over non-secure
interfaces.

The following table shows the thin app compatibility matrix across the 14.02 and
14.06 releases.

| 14.02 provider thin app | 14.06 consumer thin app |
|---|---|
| With secure interfaces | Incompatible |
| With non-secure interfaces | Compatible |

| 14.06 provider thin app | 14.02 consumer thin app |
|---|---|
| With secure interfaces | Incompatible |
| With non-secure interfaces | Compatible |



[app-layer-auth]: #app-layer-authentication
[tcl-RN connect]: #ajtcl-to-alljoyn-router-connection
[RN discovery 1412]: #14-12-router-discovery
[RN blacklisting]: #router-blacklisting
[WHO-HAS schedule]: #who-has-message-schedule
[discovery msg sched]: #discovery-message-schedule

[design desc]: https://wiki.allseenalliance.org/_media/core/alljoyn_router_selection_for_tcl_design-3-4-15.pdf
[Core Wiki]: https://wiki.allseenalliance.org/core/overview#technical_proposals

[img thin-app-arch]: /files/learn/system-desc/thin-app-arch.png
[img thin-app-functional-arch]: /files/learn/system-desc/thin-app-functional-arch.png
[img RN Discovery]: /files/learn/system-desc/thin-app-discovering-wkn-prefix.png
[img RN Discovery pre-1412]: /files/learn/system-desc/thin-app-discovering-connecting-to-router-pre-1412.png
[img RN Discovery 1412]: /files/learn/system-desc/thin-app-discovering-connecting-to-router-1412.png
[img RN Discovery with RS]: /files/learn/system-desc/thin-app-discovering-with-router-selection.png
