# 精简应用程序

## 概览

AllJoyn 系统旨在实现夸 AllJoyn 设备的功能控制。AllJoyn 标准内核资源库通常应用于拥有较大内存、较大电源、较强处理能力和拥有多线程操作和多种标准语言环境的操作系统中。AJSCL 为通用计算机设计，支持运行在 HLOS（包括Microsoft Windows、Linux、Android、iOS 和 OpenWRT）上的应用程序。

另一方案，单一目的的 AllJoyn 设备通常拥有一套嵌入式系统。该系统运行在提供某种特定功能的微控制器上。这些嵌入式系统为了降低设备的成本和缩减设备的体积，通常采用削减内存，降低处理速度，限制电源功率，删除周边设备和用户接口等方法。AllJoyn 精简内核为嵌入式系统设备提供了良好的 AllJoyn 分布式编程环境。

AJTCL 为嵌入式微控制器程序提供了一种轻量级的核心 AllJoyn 功能的实现方案。嵌入式 AllJoyn 设备（精简 AllJoyn 设备）只包含一个采用 AJTCL 的精简 AllJoyn 程序，鉴于有限的资源环境，并不包含 AllJoyn 路由组件。它向 AllJoyn 临域网络内的某一标准 AllJoyn 设备借用其 AllJoyn 路由，并利用它实现 AllJoyn 核心功能，如广告和信息转发。AllJoyn 精简应用程序完全兼容与临域网络内的标准 AllJoyn 应用程序进行互操作。实际上，远程控制程序甚至不知道另一侧与正自己进行会话的是一个精简 AllJoyn 应用程序。


下图展示了精简应用程序适配整个 AllJoyn 分布式系统的联系结构。

![img thin-app-arch][]

**图:** 精简应用程序联系结构

该图展示了两个 AllJoyn 设备（device 3 和 device 4），它们各自安装了一个 AllJoyn 精简应用程序。基于 AJTCL 建立的精简应用程序通过与一个标准 AllJoyn 设备上的路由（如安装在 Wi-Fi Access Point 上的 AllJoyn 路由）与分布式 AllJoyn 总线建立连接。AJTCL 使用 AllJoyn 的广告和发现服务，通过 BusNode well-known name 发现 AllJoyn 路由。

**注意:** 多个精简应用程序可连接到单个指定 AllJoyn 路由。

一个精简应用程序可同时作为 AllJoyn 服务的提供者和使用者，或其中的任一身份。会话的建立方式与标准 AllJoyn 应用程序接受、建立与另一个远程应用程序（标准应用程序或精简应用程序）会话的过程相同。

## 功能结构

下图展示了 AllJoyn 精简应用程序的详细功能结构。一个精简应用程序包含了应用指定代码（应用代码）和 AJTCL。作为应用代码的一部分，一个精简应用程序包含了一个或多个 AllJoyn 服务架构。这些服务架构包含了 Onboarding、Configuration 和 Notification 服务架构。如果精简应用程序以 AllJoyn 服务提供者的身份运行，那么其应用代码也会包含应用指定 AllJoyn 服务。

![img thin-app-functional-arch][]

**图:** 精简应用程序功能结构

AJTCL 包含了上图中所示支持的功能中比较重要的几个功能模块。这些模块包含了 Bus Connection Manager、About、Messaging 和 App Authentication 模块。

* Bus Connection Manager 模块提供了发现周边 AllJoyn 路由（BusNode）并与之建立连接的功能。
* About 模块为精简应用程序提供 advertisement 和 discovery 功能。该模块支持在分布式  AllJoyn 总线上发出精简应用程序的 Annoucement sessionless signal。
* Marshaling 模块为 AllJoyn 信息提供了封送和逆封送功能，并把这些信息转发到连接的 AllJoyn 路由上。
* App Authentication 模块为精简应用程序与远程 AllJoyn 应用程序之间提供了应用级别的身份验证和安全保护。在 14.06 版本之前，AJTCL 采用的是 ALLJOYN_PIN_KEYX 验证机制。14.06 版本以及其后续版本，都采用了一套全新的如 [App layer authentication][app-layer-auth] 所述的基于Elliptic Curve Diffie-Hellman Ephemeral (ECDHE)的验证机制。

## AJTCL 与 AllJoyn 路由的连接

在启动时，精简应用程序启动 discovery 进程，与另一个标准 AllJoyn 设备上的 AllJoyn 路由建立连接。这个过程通过 name-based discovery 机制实现。

AllJoyn 路由支持广告 BusNode well-known name 的精简应用程序。被广告的 well-known name 拥有一个或多个下列属性。

* 由 AllJoyn 路由配置的通用 Generic BusNode well-known name "org.alljoyn.BusNode"
* 由连接到 AllJoyn 路由的应用程序广播的特定 BusNode well-known name，旨在发现相关的精简应用程序。

AllJoyn 路由以被动方式广告 BusNode well-known name，广告信息不会被平白无故地发送。当收到精简应用程序的的查询需求时，才会发送 BusNode well-known name advertisement。此外，广告信息通过单播方式（而不是多播方式）回应给请求者。这样的方式旨在减少由精简应用程序发现服务相关的 AllJoyn 路由产生的网络流量。

AllJoyn 路由限制了 AllJoyn 网络中同时存在的精简应用程序连接数量。可以通过更改路由配置文件中的 '`max_remote_clients_tcp`' 值对限制值进行调整。

AJTCL 与 AllJoyn 路由之间的连接过程分为以下几个阶段：

* 发现阶段：AJTCL 通过 BusNode name-based discovery 机制发现 AllJoyn 临域网络内的的 AllJoyn 路由。发现的超时时长通过调用 `FindBusAndConnect()` API 进行设定。自 14.12 版本开始，AJTCL 加入了 mDNS-based discovery 方式进行 AllJoyn 路由发现。下文使用 pre-14.12 TCL 和 14.12 TCL 表述这两个阶段。AJTCl 为 BusNode well-known name 发送一个 WHO-HAS 消息，其后跟随一个退避列表。IS-AT 消息由广告 BusNode Name 的 AllJoyn 路由通过单播方式发送到 AJTCL。
* 连接阶段：AJTCL 通过从 discovery response 中获得的详细信息建立与 AllJoyn 路由之间的 TCP 连接。
* 身份认证阶段：AJTCL 通过 SASL 匿名身份认证开始使用 AllJoyn 路由的服务。

作为连接形成的一部分，AJTCL 同样与 AllJoyn 路由之间交换 AllJoyn 协议版本（AJPV）。如果 AllJoyn 路由支持的协议版本比应用程序要求的最低（AJPV）版本还低，那么连接进程将失败。这种失败方式或者其它类型的验证失败将会导致该节点被加入黑名单，在［Router blacklisting][RN blacklisting] 中具体说明。

### 14.12 版本之前的路由发现机制

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

在路由发现完成之后，其余的 AJTCL 逻辑与上述 [AJTCL-to-AllJoyn router connection][tcl-RN connect] 部分完全一致。

#### WHO-HAS message schedule WHO-HAS 消息标准

在14.12版本之前，AJTCL 支持以下方式重发 WHO-HAS 发现消息。

1. 每 1 秒发送一条 WHO-HAS 消息，持续 10 秒。
2. 等待10秒后，再发送一条 WHO-HAS 消息。
3. 等待20秒后，再发送一条 WHO-HAS 消息。
4. 等待40秒后，再发送一条 WHO-HAS 消息。不断重复直到发现服务超时。

### 14.12 router discovery

下图展示了 14.12 版本 AJTCL 发现和连接 AllJoyn 路由的信息流。

![img RN Discovery 1412][]

**图:** 14.12 路由发现和连接

AJTCL 同时支持 mDNS 和以往的发现机制。如果 AJTCL 的最低 AJPV 小于 10，那么该 AJTCL 只能与 14.06 或更早的版本的路由建立连接。在这种情况下，TCL 会生成和发送 WHO-HAS 信号，同时也会发送 mDNS 信号查询 BusName 前缀。发送此类消息的详情，请参阅 [Discovery message schedule][discovery msg sched]。

Discovery response（无论 mDNS response 或是 IS-AT message）通过广告 BusNode Name 的 AllJoyn 路由通过单播的方式传送到 AJTCL。mDNS response 可能会包含一组键－值对，说明了发信 AllJoyn 路由的协议版本（在 14.12 版本中被加入），协议版本的键为 'ajpv'。ajpv 的值用于判断版本是否低于精简应用程序要求的最低版本，如果低于最低要求，那么就会忽略 discovery response。如果 AJTCL 同时收到 IS-AT 和 mDNS response， mDNS response 将被优先处理。通过 AllJoyn 路由收到的在黑名单上的 response 将被忽略。

在路由发现完成之后，其余的 AJTCL 逻辑与上述 [AJTCL-to-AllJoyn router connection][tcl-RN connect] 部分完全一致。

#### Discovery 信息策略

在发送 discovery 信息时，AJTCL 提供了重试策略。同时 AJTCL 也会根据精简应用程序要求的最低协议版本，选择性地发送 WHO-HAS 信息；当最低版本低于10，将会同时发送 mDNS 查询和 WHO-HAS 信息，并且重试策略同时支持这两者。具体策略如下：

1. 发送一段三连 discovery 信息，随后间隔 1.1 秒。重复十次。 
2. 等待10.1秒，再发送一段三连信息。
3. 等待20.1秒，再发送一段三连信息。
4. 不断重复直到发现服务超时。

等待间隔时间多余的 100 毫秒保证了所有可能的 100 毫秒间隙都被以尽可能快的速度覆盖到。这增加了通过了 WI-FI 接受多播数据包回应的成功率。

### 路由选择

自 15.04 版本以来，AllJoyn 引入了路由选择功能。它为 AJTCL 提供了选择最理想 AllJoyn 路由的功能。[详细描述][design desc] ，请访问核心工作组 [Wikipage][Core Wiki] 的页面进行下载。

下图展示了 AJTCL 利用路由选择，发现并连接 15.04 版本 AllJoyn 路由的信息流。

![img RN Discovery with RS][]

**图:** 使用路由选择的路由发现

在高规格环境下，该功能将分为两个部分：

1. 路由使用包括电源、速率、连接可用性和连接容量等一系列的静态和动态参数进行 **rank** 的计算。**rank** 通过上述 mDNS 返回包 [14.12 路由发现][RN discovery 1412] 中的 Priority 字段体现。

2. AJTCL 至少花费 5 秒的时间接受 discovery 回应。每一个接受的回应的过程，都与上述 ‘ajpv’ 键－值对相关，同时黑名单也对这个过程有效。当等待时间结束，AJTCL 将选择期间接收的路由 rank 最高的一个进行连接。如果 rank 值相同，或者 discovery 回应中不包含 rank， AJTCL 将在路由中随机选择一个并连接。

### 路由黑名单

自 15.04 版本以来，AllJoyn 引入了路由黑名单功能。此功能使得 AJTCL 能够追踪不兼容的路由，并避免再次连接它们。为了追踪不兼容路由（根据建立情况决定），建立了黑名单。黑名单确保在名单内的 discovery 回应被忽略。

将路由加入黑名单的明确标准有两点。一是身份认证失败导致的不成功连接；二是协议版本低于精简应用程序要求的最低标准。黑名单的默认容量是 16；第 17 个路由将覆盖第 1 个(即黑名单列表是一个循环缓冲区)。黑名单会在精简应用程序重启时重置。


### AJTCL 和 AllJoyn 路由兼容性

下表展示了 14.02 和 14.06 版本中 AJTCL 和 AllJoyn 路由之间的兼容性

#### AJTCL 和 AllJoyn 路由之间的兼容性

| AJTCL / Router | 14.02 (AJTCL auth enabled) | 14.06 (AJTCL auth disabled) | 14.06 |
|---|---|---|---|
| **14.02** | Compatible | Compatible | Compatible |
| **14.06 (thin app not using NGNS)** | Incompatible | Compatible | Compatible |
| **14.06 (thin app using NGNS)** | Incompatible | Incompatible | Compatible |

### 发现路由链接失败

AJTCL 为精简应用程序提供了一种检测与 AllJoyn 路由之间失败连接的机制。通过调用 AJTCL 提供的 `SetBusLinkTimeout()` API 实现。在 API 中，精简应用程序可以指定一个超时值（至少 40 秒）。如果在这期间没有发现活动连接，AJTCL 将在路由链接中每隔 5 秒发送一个探测包，并把错误返回给精简应用程序。

在这种情况下，精简应用程序应该再次启动寻找 ALlJoyn 路由的 discovery。

## 精简应用程序功能

如上文所述，AJTCL 支持标准内核的主要功能。AJTCL 提供了一些 API，使得精简应用程序能够调用核心功能。AJTCL 轮流生成合适的 AllJoyn 格式信息（为方法调用／回应，信号等）调用 AllJoyn 路由上的相关 API。AJTCL 向 AllJoyn 路由发送生成的 AllJoyn 信息以完成指定功能。

下图展示了精简应用程序发现 well-known name 前缀的信息流。

**注意:** AJTCL 与 AllJoyn 路由之间通过 AllJoyn 信息（方法调用／回应和信号）交换数据。

![img RN Discovery][]

**图:** 精简应用程序发现 well-known-name 前缀

AJTCL 为以下核心 AJ 功能提供支持：

* 服务的发现和广告：支持老版本和新版本的 Name Service。
* About 广告
* 会话建立
* 无会话信号
* 应用层认证
* AJTCl 提供应用层认证。使得精简应用程序实现安全接口，并访问其它 AllJoyn 提供者的安全接口。
* 14.06 版本(查阅 [App layer authentication][app-layer-auth])中支持新的身份验证方案

通过绑定应用程序指定的资源库，精简应用程序也能够包含已有 AllJoyn 服务架构的功能。

## 应用层认证

AJTCL 为精简应用程序提供了应用层认证，使其可以部署和访问安全 AllJoyn 服务。14.06 版本之前的应用层认证会有所不同，下文重点介绍 14.06 版本和以后版本的认证方式。

在 14.06 版本之前，AJTCL 支持应用层认证的 ALLJOYN _PIN_KEYX 验证机制。同时，也支持 SASL 协议认证。

自 14.06 版本起，AJTCL 移除了 ALLJOYN _PIN_KEYX 验证机制。加入了 New Elliptic Curve Diffie-Hellman Ephemeral
(ECDHE)-based 验证机制。

* ECDHE_NULL 是匿名的密钥协商协议。不需要 PIN 或者密码短语。
* ECDHE_PSK 是通过预共享密钥，如 PIN、密码短语或对称密钥验证的匿名的密钥协商协议。
* ECDHE_ECDSA 是通过 ECDSA 签名生成的非对称密钥进行认证的的密钥协商协议。

14.06 版本移除了 SASL 协议的认证方式，加入了一种基于 AllJoyn 的协议进行应用层认证。

### 认证兼容性

14.06 版本的精简应用程序不能与 14.02 版本的精简应用程序通过安全接口进行互动，反之亦然，因为它们分别采用了不同的认证方式。但它们可以通过非安全接口进行互动。

下表展示了 14.02 和 14.06 版本的精简应用程序兼容性

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
