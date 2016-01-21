# 推广和发现

## 概述

AllJoyn&trade; 系统支持一种可被提供者用于通过 AllJoyn 网络推广服务，同时也可被消费者用于发现并消费这些服务的机制。AllJoyn 支持跨越多种底层
接入网（例如 Wi-Fi）的发现机制。AllJoyn 发现协议的推广和发现功能使用了通过 Wi-Fi 的 IP 多播。发现机制的细节将会对 AllJoyn 应用程序隐藏。

AllJoyn 路由支持为了使用 IP 传输的 Wi-Fi 的指定传输方式的发现机制。

应用程序可以用下列方法中的一种，实现在 AllJoyn 框架上的推广和发现服务。细节讨论在此章节后面的部分。

* 基于 Name: 服务的推广和发现使用一个 well-known name 或者唯一识别符。
* 基于 Announcement: 服务的推广和发现使用一个 well-known name 或者唯一识别符。 

### 14.06 版本中关于发现功能的增强

AllJoyn 发现功能在 14.06 版本中有所提升，支持了通过一种更为便捷的方法（NGNS，之前定义的）来发现支持一系列接口的的设备/应用程序。 NGNS 支持
基于 m-DNS 的发现协议，可以在一个 over-the-wire 发现消息中指定 AllJoyn 接口。另外，基于 mDNS 的协议可以提供通过单播的发现回应，以提升发现
协议的性能，将 AllJoyn 发现进程中生成的多播交通总流量降至最低。

通过加入一个通过单播发送的明确的基于 mDNS 的 ping() 消息用来判断远端端点是否活动，目前用于 AllJoyn 设备/应用程序的的探测机制已经被加强。此
ping() 机制由基于自身逻辑的应用程序所驱动。

此章节首先描述了 AllJoyn 历史版本的发现机制（14.06版本之前），随后介绍了基于 NGNS 的发现机制以及当前的发现机制，参见 [NGNS 消息序列
][ngns-message-sequences].

## 基于 name 的历史版本发现机制

此章节捕捉了14.06版本之前的历史版本中基于 name 的发现机制设计。

AllJoyn 路由支持一个 Name 服务，从而实现了基于 name 的服务发现模式。Name 服务支持一个基于 UDP 的协议，用于完成通过基于 IP 的接入网（包括 Wi-Fi）的发现工作。基于 Name 的发现的 API 通过 AllJoyn 核心库被暴露。

Name 服务支持 IS-AT 和 WHO-HAS 协议消息，在下面会有他们的描述。这些协议消息携带者将会被推广和发现的 well-known names. 协议消息通过 AllJoyn 近端网络（本地子网）被多播，使用了 IANA-registered IP 多播组以及如下所示的端口名 [IANA-registered multicast addresses for the AllJoyn framework][iana-multicast-addresses].

### 用于 AllJoyn 框架的 IANA-registered 多播地址 

| Address | Port |
|---|---|
| IPv4 Multicast group address | 224.0.0.113 |
| IPv6 Multicast group address	| FF0X::13A |
| Multicast port number | 9956 |

下图捕捉了基于 name 发现机制的高层结构，展示了 Name 服务生成 IS-AT 和 WHO-HAS 消息的过程。

![name-based-discovery-arch][name-based-discovery-arch]

**Figure:** 基于 Name 的发现架构

## IS-AT

IS-AT 消息通过 well-known name 或者唯一识别符来推广 AllJoyn 服务。一条 IS-AT 消息可以包括包含一个或多个用于推广的 well-known names 或者唯一
识别符的列表。IS-AT 消息通过 Adv_Validity_Period 配置参数为 well-known name 推广指定了一个有效周期。

提供方设备上的 AllJoyn 路由通过 IP 多播周期性地发送 IS-AT 消息，用来推广自己所支持的服务。此周期由提供方上的 Adv_Msg_Retransmit_Interval 可配置参数定义。

IS-AT 消息也可以作为收到的正在寻找服务的 WHO-HAS 消息的回复被发出。借此机制，使用方设备可以被直接提醒，从而最大限度减少了发现过程的时间。

### WHO-HAS

WHO-HAS 消息可使用 well-known name 或者唯一识别符发现一个或多个 AllJoyn 服务。与 IS-AT 类似，一条 WHO-HAS 消息也包含带有一个或多个用于发现 的 well-known name 或者唯一识别符。WHO-HAS 消息也可以包含一个 well-known name 前缀（取代复杂的 well-known name），可与 IS-AT 消息中所推广的
well-known name 相匹配。

例如，WHO-HAS 消息中的 well-known name 前缀 "org.alljyon.chat" 可以与 IS-AT 消息中推广的 "org.alljoyn.chat._123456.Joe" well-known name 相匹配。

当使用方设备试图发现一个服务时，他会通过 IP 多播发送出 WHO-HAS 消息。此 WHO-HAS 消息将被重复几次，一定概率上引起 Wi-Fi 网络中 collision 的
出现，从而导致多播包数量的减少。

下列参数决定了 WHO-HAS 消息的传输模式：

* Disc_Msg_Number_Of_Retries
* Disc_Msg_Retry_Interval

在第一次传输后，每一个 Disc_Msg_Retry_Interval 内 WHO-HAS 消息都会被重新发送 Disc_Msg_Number_Of_Retries 次。作为 WHO-HAS 消息的回应，使用方
可以获取一条由提供方发来的推广了被请求的服务的 IS-AT 消息。

### 使用方行为

下图展示了基于 name 发现机制中使用方 AllJoyn 路由的行为：

![consumer-router-discovery-behavior][consumer-router-discovery-behavior]

**Figure:** 使用方 AllJoyn 路由发现行为

### 消息序列

在基于 Name 发现的场景中捕捉了下列用例：

* 在 IP 连接已经建立好时发现
* 不可靠的网络环境下的发现
* IP 连接建立延迟的发现
* IP 连接丢失导致的 WKN 丢失
* 提供方取消推广 well-known name
* 使用方取消发现 well-known name

#### 在 IP 连接已经建立好时发现

下图展示了一个在典型的发现场景中的 AllJoyn 服务 well-known name 的消息序列。在此例中，提供方和使用方设备已经建立了 IP 连接。第一条 WHO-HAS
消息通过 IP 多播已经被传输到提供方设备上，提供方设备随即回复了一条 IS-AT 消息。

![typical-discovery-wkn][typical-discovery-wkn]

**Figure:** 典型的 well-known name 发现

#### 不可靠的网络环境下的发现

下图展示了在一个底层网络漏掉了一些多播的 WHO-HAS 消息的发现场景中，AllJoyn 服务 well-known name 的消息序列。在这种情况下，WHO-HAS retry 机
制将被触发，消息将根据 Disc_Msg_Number_Of_Retries 和 Disc_Msg_Retry_Interval parameters 两参数来执行重发操作。

![不可靠网络环境下的发现][discovery-unreliable-network]

**Figure:** 不可靠的网络环境下的发现

#### IP 连接建立延迟的发现

下图展示了在使用方发送完 WHO-HAS 消息之后，连接到 AllJoyn 的近端网络 AP 已延迟的场景中，AllJoyn 服务 well-known name 的消息序列。这种情况在
使用方设备刚刚进入一个新的 AllJoyn 近端网络时可能会发生。子网的 IS-AT 消息已经被使用方的 AllJoyn 路由接收到，并导致了被请求 well-known name
的 FoundAdvertiseName.



![discovery-late-ip-connectivity][discovery-late-ip-connectivity]

**Figure:** IP 连接建立延迟的发现

#### IP 连接丢失导致的 WKN 丢失。

下图展示了在使用方丢失与 AllJoyn 近端网络热点的 IP 连接所导致的 well-known name 丢失的场景中，AllJoyn 服务 well-known name 的消息序列。在使
用方设备离开 AllJoyn 近端网络时可能会发生这种情况。

如果使用方的 AllJoyn 路由在 Adv_Validity_period 时间内没有收到任何给定 well-known name 的 IS-AT 消息，他将宣布 well-known name 丢失，并生成
一个针对此 well-known name 的 LostAdvertiseName.

![wkn-lost-ip-connectivity][wkn-lost-ip-connectivity]

**Figure:** IP 连接丢失导致的 WKN 丢失

#### 提供方取消推广 well-known name

下图展示了在提供方应用程序取消了对之前的一个 well-known name 的推广的场景中，AllJoyn 服务 well-known name 的消息序列。

![provider-cancels-wkn-advertisement][provider-cancels-wkn-advertisement]

**Figure:** 提供方取消推广 well-known name

##### 使用方取消发现 well-known name

下图展示了在使用方应用程序取消了对 well-known name 的发现的场景中，AllJoyn 服务 well-known name 的消息序列。

![consumer-cancels-wkn-discovery][consumer-cancels-wkn-discovery]

**Figure:** 使用方取消发现 well-known name

#### 消息结构

如前所述，Name 服务支持 IS-AT 和 WHO-HAS 消息。这些消息在一个更高层级的 Name 服务消息中被嵌入，将 Name 服务消息可以将 IS-AT 和 WHO-HAS 消息纳入同一个 Name 服务消息中，从而提供了灵活性。当 AllJoyn 应用程序同时作为提供方（推广 well-known name） 和使用方（发现 well-known name）时，这将会非常有用。

下图展示了 Name 服务的消息结构。[Name Service message structure fields][name-service-message-structure-fields] 定义了消息结构字段。

![name-service-message-structure][name-service-message-structure]

**Figure:** Name 服务消息结构

##### Name 服务消息结构字段

| 字段 | 描述 |
|---|---|
| Sver | 发送端最新实现的 AllJoyn 发现协议的版本。|
| MVer | Name 服务消息的版本。|
| QCount | 跟随头文件的 WHO-HAS 问题消息的个数。|
| ACount | 跟随头文件的 IS-AT 应答消息的个数。|
| Timer | <p>计算 (以秒计算) 哪些 IS-AT 应答应被认为有效。</p><p>此字段应根据下列参数设定：</p><ul><li>Adv_Validity_Period 被推广的 well-known name 默认的有效期限。</li></ul><ul><li>Adv_Infinite_Validity_Value 指示着一个永久有效的 well-known name 推广，或者至少在被回收前
有效。如果此项为0，则指示着发送方的 AllJoyn 路由正在回收此推广。</li></ul> |

##### IS-AT 消息

下图展示了 IS-AT 消息的第一版

[IS-AT message format version 1 fields][is-at-message-format-v1-fields]  定义了 IS-AT 消息字段。

![is-at-message-format-v1][is-at-message-format-v1]

**Figure:** IS-AT 消息格式 (版本 1)

##### IS-AT 消息格式版本 1 字段

| 字段 | 描述 |
|---|---|
| R4 Bit | 如果设置为 '1',  R4 bit 指示着将会呈现一个端点使用 IPv4 （IP 地址和端口号）的可靠传输（TCP）. |
| U4 Bit | 如果设置为 '1',  U4 bit 指示着将会呈现一个端点使用 IPv4 （IP 地址和端口号）的不可靠传输（UDP）. |
| R6 Bit | 如果设置为 '1',  R6 bit 指示着将会呈现一个端点使用 IPv6 （IP 地址和端口号）的可靠传输（TCP）. |
| U6 Bit | 如果设置为 '1',  U4 bit 指示着将会呈现一个端点使用 IPv6 （IP 地址和端口号）的不可靠传输（UDP）. |
| C Bit | 如果设置为 '1', C bit 指示着 StringData 记录列表是一个由所有被回应方 AllJoyn 路由输出的 well-known names 构成的完整列表。|
| G Bit | 如果设置为 '1', G bit 指示着将会呈现一个可变长度的 daemon GUID 字符串。 |
| M | 指示 IS-AT 消息的类型。对于 IS-AT，此项被定义为 '01' (1) 。|
| Count | IS-AT 消息中所包含的 StringData 项目的个数。 |
| TransportMask | 传送提示符的比特掩码，指示着哪一个 AllJoyn 传输正在执行推送。 |
| StringData | 描述一个正在被推广的 AllJoyn well-known name. |

##### WHO-HAS 消息

下图展示了 WHO-HAS 消息的第一版


[WHO-HAS message format version 1 fields][who-has-message-format-fields] 定义了 WHO-HAS 消息的字段

![who-has-message-format-v1][who-has-message-format-v1]

**Figure:** WHO-HAS 消息格式 (版本 1)

##### WHO-HAS 版本 1 消息格式字段

| 字段 | 描述 |
|---|---|
| Reserved | 保留位 |
| M | WHO-HAS 消息的类型。  对于 WHO-HAS 此项被定义为 '10' (2) 。|
| Count | WHO-HAS 消息中所包含的 StringData 项目的个数。|
| StringData | 描述使用方 AllJoyn 路由感兴趣的一个 AllJoyn well-known name.|

### 历史版本的 announcement-based 发现

此章描述了14.06及以前历史版本中关于基于 announcment 的发现的设计。

在基于 announcement 的发现中，提供方设备通过一个 announcment 广播信号来宣布被支持的 AllJoyn 接口。对使用 AllJoyn 服务有兴趣的使用方设备可以
选择接受这些来自提供方的广播 announcement 消息，以发现被支持的 AllJoyn 服务的接口。

Announcment 消息又 About 功能生成，并使用 AllJoyn 路由提供的非会话信号机制（详见 [Sessionless Signal][sessionless-signal]）被当作一个 AllJoyn 非会话信号发送。此非会话信号模型使用 AllJoyn name 服务消息（IS-AT 和 WHO-HAS），和为非会话信号指定格式的 well-known names 对使用方 作出有新信号的提醒。一旦使用方的 AllJoyn 路由发现了此非会话信号的 well-known name, 他将会通过 AllJoyn 会话连接到此提供方，并获取提供方设备
的服务宣布消息。

下图展示了基于 announcement 的发现进程的高层结构。

![announcement-service-discovery-arch][announcement-service-discovery-arch]

**Figure:** 基于 announcement 的服务发现结构

Announcement 消息被作为一个非会话信号从提供方应用程序发送到 AllJoyn 路由，并在非会话信号缓存中被缓存。此非会话信号模块会为非会话信号生成一
个特定格式的 well-known name，如下所示（详见[Sessionless Signal][sessionless-signal]）：

```
SLS WKN format: org.alljoyn.sl.x<GUID>.x<change_id>
```

此非会话信号模块与 Name 服务进行交互，发送给定 well-known name 的 IS-AT 消息。在使用方上的 AllJoyn 路由开始对此 well-known name 进行发现。
根据收到的 IS-AT 消息，在使用方上的非会话信号会通过 AllJoyn 会话连接到提供方的非会话信号模块上，并接收 Announcement 消息，这些 Announcenemt
消息随后会被送至使用方应用程序。


#### 消息序列

下图展示了基于 Announcement 发现中的消息序列

![announcement-service-discovery][announcement-service-discovery]

**Figure:** 基于 Announcement 发现中的消息序列

#### Announcement 消息

此 Announcement 消息提供一个对象路径的列表，来自被 AllJoyn 应用程序所实现的对象和这些对象支持的接口。此 AllJoyn 应用程序决定在 Announcement
消息中有哪些对象被宣布。

此 Announcementt 消息还包含用于描述应用程序和设备信息的附加 About 字段。详情参见 About HLD. 

### 历史版本的 AllJoyn 发现功能的配置参数

[AllJoyn discovery configuration parameters][alljoyn-discovery-config-params] 展示了历史 AllJoyn 发现过程中的配置参数。

**NOTE:** 具体实现中这些参数可能有不同的名字。

#### AllJoyn 发现配置参数

| Parameter | 默认值 | 范围 | 描述 |
|---|---|---|---|
| Adv_Validity_Period | 120 seconds | TBD | IS-AT 推广的有效时限。 |
| Adv_Infinite_Validity_Value | 255 | TBD | 此值指示一个永久有效的推广消息。 |
| Adv_Msg_Retransmit_Interval |	40 seconds | TBD | 发送 IS-AT 消息的间歇时间（以秒计算）。 |
| Disc_Msg_Number_Of_Retries | 2 | TBD | 第一次传输之后，WHO-HAS 消息被发送的次数。 |
| Disc_Msg_Retry_Interval | 5 seconds | TBD | 重新发送 WHO-HAS 消息的等待时间（以秒计算）。 |

### 下一代 Name 服务

下一代 Name 服务（NGNS）在14.06之后的版本中被实现，在 AllJoyn 平台提供的发现和 presence 功能方面带来了明显的性能提升，下文有详细说明。

下图展示了 NGNS 的高层结构。

![ngns-high-level-arch][ngns-high-level-arch]

**Figure:** NGNS 高层结构

此结构展示了关于 NGNS 的主要逻辑组件。增强版的发现和 presence 功能通过新的 API 被暴露，并作为 AllJoyn 核心库的一部分。About 功能也被包含在
核心库中，并允许 AllJoyn 应用程序发送 Announcement 非会话信号。非会话信号模块将 Announcement 信号缓存。NGNS 模块使用 Announcement 信号的信
息来应答从使用方应用程序发来的基于接口的发现请求。

#### 发现

如上文所述，AllJoyn 框架提供基于 name 的发现或基于 announcement 的发现。NGNS 支持下列发现机制：

* NGNS 支持基于 name 的发现。尽管在 API 层并无变化，此发现机制使用通过 mDNS 的 DNS 服务发现框架。NGNS 根据 AllJoyn 路由中的配置文件发送历史
版本的（14.06以前的版本）发现消息，以实现兼容。 
* NGNS 支持一套更有效的基于 announcement 的发现进程，支持使用方应用程序向多个 AllJoyn 接口发送请求。在14.06版本之前，使用方不得不创建匹配规
则以接收所有的 Announce 信号（作为非会话信号被传输），并在作出哪些自己感兴趣的接口被提供的决定之前将提供方应用程序宣布的所有 AllJoyn 接口解
析。此机制虽然比基于 well-known name 的机制更加强大，但不够有效率。NGNS 功能运行一个使用方应用程序向多个 AllJoyn 接口发出请求，只有使用同样
接口的提供方应用程序需要应答。


#### 存在检测

在 14.06 版本以前，存在（或者缺席）检测使用的机制通过由使用方应用程序指定 name （well-known name 或唯一识别符）的三条连续的 IS-AT 消息丢失
来判断的。这种检测所花费的时间是固定的（3*40 sec = 120 sec）.

在 14.06 版本中使用的 NGNS 机制引入了一套更有效率的存在检测机制，此机制由使用方应用程序驱动，并使用了单播消息。一旦 name 已经被发现，使用方
应用程序即可调用新的 Presence API 并判断存在状态。由于每个应用程序在存在检测被触发的时间和事件方面都有自己的逻辑，NGNS 仅仅提供了 API，将具
体的触发逻辑留给应用程序驱动。

#### NGNS 设计层面

下文详细说明了 NGNS 功能的设计层面信息。

##### mDNS 的使用

14.02版本的发现协议是基于通过 AllJoyn 分配的多播 IP 地址发送的 AllJoyn 指定的 UDP 消息的。这种设计限制了可被发现性（IP 路由可能会屏蔽由
ALlJoyn 分配的多播 IP 地址或者/以及端口号）。为了解决该问题，14.06版本的发现协议使用了通过 IANA 分配的多播 IP 地址和端口号发送的 mDNS.

##### NGNS 使用的多播 IP 地址和端口号

| 地址 | 值 |
|---|---|
| IPv4 多播组播地址 | 224.0.0.251 |
| IPv6 多播组播地址 | FF02::FB |
| 多播端口号 | 5353 |

此外，mDNS 已经支持以下被 AllJoyn 发现协议所使用的功能：

* 征求单播响应
* 使用单播发送请求消息
* 回应方发送主动相应

这些功能构成了发现协议的第二版本。版本号被写在 "sender-info" 文本记录 中的 pv 字段，位于 mDNS 请求和应答的附加章节中。


**NOTE:** 14.02 Name 服务实现使用了发现协议的第0版和第1版。

##### DNS-SD 的使用 

14.06 版本的设计是基于 [RFC 6763](http://tools.ietf.org/html/rfc6763). 

客户端使用一个对 DNSPTR 记录的请求来完成对一个给定服务 name（与在 IANA 注册的相同，例如 AllJoyn 就是一个已注册的服务名）的可用实例列表 的发现，此 name 有如下格式：

```
"<Service>.<Domain>" [RFC 1035](https://www.ietf.org/rfc/rfc1035.txt). 
```

对于 name "<Service>.<Domain>" 的 PTR查找结果是一系类的0，或者是多个有以下形式的 Service Instance Names 的 PTR 记录：

```
Service Instance Name = <Instance>.<Service>.<Domain>
```

此外，对于此服务实例，DNS-SD 回应方发送 DNA SRV [RFC 2782](https://www.ietf.org/rfc/rfc2782.txt)和 DNS TXT [RFC 1035](https://www.ietf.org/rfc/rfc1035.txt) 记录。SRV 和 TXT 记录都有以下形式的名字：

```
"<Instance>.<Service>.<Domain>"
```

SRV 记录给出了服务实例可以到达的目标主机和端口号。有同样名字的 DNS TXT 记录给出了此实例的详细信息，在一个使用 key/value 对儿的结构中。

除了在 [RFC 6763](http://tools.ietf.org/html/rfc6763) 中指定的服务发现框架中，NGNS 发现协议还在 DNS-SD 请求的附加部分中发送 DNS TXT 记录，
优化了发现范围，而无需通过建立与提供方应用程序的 AllJoyn 会话完成的进一步协商。其他用例中也用了同样的功能，例如发送发送者信息，或者与存在
有关的信息。DNS-SD 消息的细节描述请参见：[DNS-SD message format][dns-sd-message-format].

##### 用于 Wi-Fi 的设计中的考虑 

众所周知，通过 Wi-Fi 多播的成功率还有待改善，在某些情况中甚至更糟。根据 Wi-Fi 的规范，每一个站点都被允许周期性的进入睡眠状态和唤醒。唤醒的周期由设备提供，应该是 AP 使用的协调多播流量时间区间的因数。

AP 会将收到的多播数据缓存，并根据由 DTIM （Delivery Traffic Indication Message） 决定的时间区间来安排这些数据的发送。在现实中，根据观察，唤醒区间会被设置为 DTIM 值（常常是1,3或10） 的倍数。这样的实现方式使设备有可能
错过多播数据。由于这是一个真实的场景，AllJoyn 发现的协议的设计使用了稳健的方式来处理问题。

具体的，被使用的设计准则如下文描述。

###### 传送计划

此多播方案为在多个 DTIM 区间中唤醒并处理多播包的设备提供支持。尽管此方案是指数后退的，每一条消息都会被重复两遍，以提升在每三个 DTIM 区
间唤醒一次（很典型的例子）的设备上的多播消息的可靠性。

此方案在下列时间点发送请求消息：0, 1, 3, 9, 和 27 秒。每一次传输触发时，一共有三条消息（原始消息和两条分隔100毫秒的重复）被发送。这种
模式在呼叫流程图中被称为 burst. 就消息接收方而言，他只需要对 burst 中第一个成功接收到的消息发送回复，余下的消息将被忽略。

###### 最小多播与最大单播传输

这里考虑另一个设计层面：使用多播消息来初始化请求，但使用单播来完成回复以及存在检测。DNS 允许 mDNS 请求中的单播回应被请求，发现协议使用
了此功能。在 DNS 消息头文件的 qclass 字段的首位上有关于此功能的标识 [RFC 6762](http://tools.ietf.org/html/rfc6762).

##### 发现并呈现 API 快照

[Discovery and Presence APIs related to discovery scenarios][discovery-presence-apis] 列出了 AllJoyn 系统提供的发现与呈现 APIs 的功能
并将它们映射到了发现场景中。主要的范例是由使用方应用程序主导的发现和呈现功能。

##### 与发现场景有关的发现并呈现 API 功能

| 发现场景 | API |
|---|---|
| 使用方应用程序请求 Name | `FindAdvertisedName()` |
| 使用方应用程序收到推广名发现或丢失的通知 | <ul><li>`FoundAdvertisedName()`</li><li>`LostAdvertisedName()`</li></ul> |
| 使用方应用程序取消了 Name 请求 | `CancelFindAdvertisedName()` |
| 提供方应用程序推广 Name | `AdvertiseName()` |
| 提供方应用程序取消了 Name 推广 | `CancelAdvertiseName()` | 
| 提供方应用程序发送一个 Announcement 消息 | `Announce()` | 
| 使用方应用程序请求一系列的接口 | `RegisterAnnounceHandler()` |
| 使用方应用程序取消对一系列的接口的请求 | `UnregisterAnnounceHandler()` |
| 使用方应用程序探测对方是否存在| `Ping()` |

###### 触发 DNS-SD 多播消息的 API 发现。

一些发现场景会触发多播消息。触发多播消息的 API 包括：`FindAdvertisedName()`, `CancelAdvertiseName()`, `AdvertiseName()`, `Announce()`, 和 `RegisterAnnounceHandler()`.

一些多播传输的关键方面在下文列出。

* 通过 mDNS 多播的 mDNS 请求。
* 根据 [Transmission schedule][transmission-schedule] 的传输方案。
* 根据在路由的配置文件中设置的 LegacyNS 旗发送 Name 服务消息。
* 历史版本 Name 服务中跟随同一传送方案的 WHO-HAS 和 mDNS 消息。

##### 向下兼容性

NGNS 在设计中包括了向下兼容的要求：

* 支持所有现存的 14.02 APIs
* 支持所有历史版本的 (版本 0 和 1) NS 发现包格式。 
* 在任何有 DNS-SD 消息被发送的时候都发送一个等价的 14.02 发现消息 (带有设定为 true 的LegacyNS 标识)。
* 在请求消息的所支持版本（SVer）字段中指示此请求不支持 NGNS 的情况下，使用14.02版本的消息进行回应。如果请求方在所支持版本中声明了对 NGNS 的支持，NGNS 则会等待 DNS-SD 消息的到来。

AllJoyn 路由配置文件也添加了一项 LegacyNS 标识，以实现发现老版本的功能。Legacy 行为是默认使用的。

### NGNS 消息序列

此部分捕捉了 NGNS 的消息序列。

#### 基于 name的发现

此部分描述了 NGNS 基于 name 发现的场景中的消息序列。

##### NGNS 使用方应用程序和提供方应用程序

在这一场景中，使用方应用程序的 AllJoyn 路由禁用了历史版本行为的功能，因此使用方应用程序不会发出 Name Service 消息。

这里的消息序列假定提供方的应用程序已经处在 AllJoyn 网络上。

消息序列的几个主要步骤的描述如下。

1. 使用方应用程序通过调用 FindAdvertisedName() 来初始化消息流。
2. NGNS 通过 mDNS 发送基于 DNS-SD 的请求消息。
3. 任何与被搜索的 name 匹配的提供方应用程序将会通过 DNS-SD，以单播的形式向使用方应用程序回复消息。

![ngns-discovery-consumer-app-provider][ngns-discovery-consumer-app-provider]

**Figure:** NGNS 基于 name 的发现

##### NGNS 使用方应用程序与 NGNS 提供方应用程序

此消息序列作出以下假设：

* 使用方应用程序的 AllJoyn 路由已经开启了历史版本 Name 服务行为模式。
* 提供方应用程序已经连接到 AllJoyn 网络。

消息序列的主要步骤如下所述：

1. 使用方应用程序通过调用 FindAdvertisedName() 来初始化消息流。
2. NGNS 通过 mDNS 发送基于 DNS-SD 的请求消息，同时也发送历史版本的 WHO-HAS 消息。
3. 任何与被搜索的 name 匹配的提供方应用程序将会通过 DNS-SD，以单播的形式向使用方应用程序回复消息。
4. 与 WHO-HAS 中的 name 相匹配的任何历史版本的提供方 (14.02版本) 也会通过一个 IS-AT 消息发出回应。

![ngns-discovery-ngns-name-service-provider-apps][ngns-discovery-ngns-name-service-provider-apps]

**Figure:** NGNS 基于 name 的发现 (NGNS 以及 Name 服务的提供方应用程序)

##### FindAdvertisedName 挂起; 提供方应用程序迟到

此消息序列作出以下假设：

* 使用方应用程序的 AllJoyn 路由已经开启了历史版本 Name 服务行为模式。
* 发起请求的时刻，提供方应用程序未连接到 AllJoyn 网络。

消息序列的主要步骤如下所述：

1. 使用方应用程序通过调用 FindAdvertisedName() 来初始化消息流。
2. NGNS 通过 mDNS 发送基于 DNS-SD 的请求消息，同时也发送历史版本的 WHO-HAS 消息。
3. mDNS 消息和 WHO-HAS 消息的请求调度已过期。
4. 在加入 AllJoyn 网络时，NGNS 提供方应用程序通过 IS-AT 消息发出主动的 DNS-SD 回应消息并推
5. 在加入 AllJoyn 网络时, name 服务提供方应用程序发送 IS-AT 消息。
6. 使用方 AllJoyn 路由执行以下任务：
  1. 使用 Name 服务以及 NGNS 消息。
  2. 过滤出被推广的 names.
  3. 如有匹配成功，则发出 `FoundAdvertisedName()` 消息。


![find-advertised-name-api-called-provider-arrives-later][find-advertised-name-api-called-provider-arrives-later]

**Figure:** FindAdvertisedName API 被调用; 提供方迟到

#### 发现接口名

##### NGNS 使用方应用程序和 NGNS 提供方应用程序

此消息序列作出以下假设：

* 提供方应用程序已经连接到 AllJoyn 网络。
* 使用方应用程序的 AllJoyn 路由关闭了历史版本 Name 服务行为模式。

消息序列的主要步骤如下所述：

1. 使用方应用程序通过注册 announce handler（调用 RegisterAnnounceHandler ）来初始化消息流。这将触发实现了那些接口的提供方的发现进程。
2. NGNS 通过 mDNS 发送基于 DNS-SD 的请求消息，并根据被发现的 AllJoyn 接口，将搜索 TXT 记录放置在附加的区域中。
3. 任何提供了被发现的 AllJoyn 接口的 AllJoyn 提供方应用程序都要发送 DNS-SD 消息作出回应，并将与 Abount Announce 信号相对应的 well-known name 非会话信号包括在内。
   注意，此消息将通过单播发送。
4. 使用方应用程序即刻初始化一个用于接收并取回 Announce 信号的非会话信号。

![alljoyn-interface-query-ngns-consumer-provider-apps][alljoyn-interface-query-ngns-consumer-provider-apps]

**Figure:** AllJoyn 接口请求 (NGNS 使用方应用程序和 NGNS 提供方应用程序)

##### NGNS 使用方和提供方应用程序

此消息序列作为呼叫流程的一个延伸 [NGNS consumer app and NGNS provider app][ngns-consumer-provider-apps]，并伴随着历史版本 Name 服务模
式开启。

尽管基于接口的请求是一个14.06版本的功能，她还是在设计中加入了可以使历史版本 Name 服务提供方应用程序可以加入到发现进程的功能。通过发送
WKN=org.alljoyn.sl 的 WHO-HAS 消息可以开启此功能。

此消息序列假设提供方应用程序已经连接到 AllJoyn 网络。

消息序列的主要步骤如下所述：

1. 使用方应用程序通过注册 announce handler（调用 RegisterAnnounceHandler ），并提供一系列用于发现的 AllJoyn 接口来初始化消息流。
2. NGNS 通过 mDNS 发送基于 DNS-SD 的请求消息，并根据被发现的 AllJoyn 接口，将搜索 TXT 记录放置在附加的区域中。
3. NGNS 发送 WKN=org.alljoyn.sl 的 WHO-HAS 发现消息。
4. 任何提供了被发现的 AllJoyn 接口的 AllJoyn 提供方应用程序都要发送 DNS-SD 消息作出回应，并将与 Abount Announce 信号相对应的 well-known name 非会话信号包括在内。
   注意，此消息将通过单播发送。
5. 使用方应用程序即刻初始化一个用于接收并取回 Announce 信号的非会话信号。
6. 若非会话信号缓存中存在非会话信号，任何历史版本的提供方应用程序都会发送一条带有非会话信号 well-known name 的 IS-AT 消息。
7. 使用方应用程序即刻初始化一个用于接收并取回提供 AllJoyn 被发现的接口的 Announce 信号的非会话信号。

![interface-query-ngns-consumer-app-ngns-ns-provider-apps][interface-query-ngns-consumer-app-ngns-ns-provider-apps]

**Figure:** Interface query (NGNS consumer app; NGNS and Name Service provider apps)

##### Pending AllJoyn interface names query; provider apps arrive later

This message sequence describes the scenario when there is 
a pending query (i.e., the transmission schedule has expired) 
but the Announce signal handler is still registered. 

The main steps for the message sequence are described below:
1. The message sequence is initiated by the consumer application 
registering the announce handler (by calling RegisterAnnounceHandler) 
and providing a set of AllJoyn interfaces for discovery.
2. The NGNS sends DNS-SD based query messages over mDNS, and 
populates the search TXT record in the Additional section based 
on the AllJoyn interfaces being discovered.
3. The NGNS sends WHO-HAS discovery messages with WKN=org.alljoyn.sl.
4. The query schedule for mDNS messages and WHO-HAS message expires
5. Upon arrival of the provider application on the AllJoyn 
network, the NGNS sends unsolicited DNS-SD response messages 
with the sessionless signal well-known names and also advertises 
the sessionless signal well-known names via IS-AT messages.
6. Upon joining the AllJoyn network, the Name Service provider 
application advertises the sessionless signal well-known name via IS-AT messages.
7. The consumer AllJoyn router fetches the sessionless signals 
from the provider apps and performs filtering; the Announce 
signal is sent to the consumer application if there is a match.

![pending-interface-query-ngns-consumer-app-ngns-ns-provider-apps][pending-interface-query-ngns-consumer-app-ngns-ns-provider-apps]

**Figure:** Pending AllJoyn interface query (NGNS consumer app, NGNS and Name Service provider apps)

#### Cancel advertisement

##### NGNS provider app, NGNS and Name Service consumer apps

The main steps for the message sequence are described below.

1. The provider application calls CancelAdvertiseName().
2. The NGNS sends both IS-AT and DNS-SD response message. 
Note that advertise TXT record in the mDNS message has TTL set to 0.
3. The consumer application receives LostAdvertisedName() 
upon receipt of the cancel advertisement discovery message.

![cancel-advertised-name-ngns-consumer-app-ngns-ns-provider-apps][cancel-advertised-name-ngns-consumer-app-ngns-ns-provider-apps]

**Figure:** Cancel advertised name (NGNS consumer app, NGNS and Name Service provider apps)

#### Presence

##### NGNS consumer app and NGNS provider app

Two modes of the Presence API is supported:  synchronous and asynchronous mode.  
From the perspective of wire protocol, the message sequence is identical.

In the 14.02 release, presence is validated by the receipt 
of the IS-AT messages for a name; and three successive losses 
of IS-AT messages trigger a LostAdvertisedName() to the consumer 
application. Since the delay was not tolerable for most 
applications, the presence was redesigned in the 14.06 
release. A consumer application can initiate the presence 
of a name that was previously discovered using the newly 
introduced Ping API. 

* If the discovered name is connected to a 14.06 AllJoyn router, 
the presence message sequence is initiated. 
* If the discovered name is connected to a 14.02 AllJoyn router, 
the API invocation returns an error.

The main steps for the message sequence are described below.
1. The consumer application initiates a presence check for 
the name by invoking the Ping API.
2. The AllJoyn router returns the unimplemented error code 
if the name being pinged is connected to a 14.02 AllJoyn 
router at the time of discovery; else, the message sequence continues.
3. If there is an entry for the name in the AllJoyn routing 
table, then mDNS message is sent over unicast to check the presence state.
4. Upon receipt of the mDNS message, the AllJoyn router checks 
the presence state for the name and sends an mDNS response 
message over unicast. The presence check is performed using D-Bus Ping method call.

![ping-api-over-ngns-ngns-consumer-provider-apps][ping-api-over-ngns-ngns-consumer-provider-apps]

**Figure:** Ping API called by consumer application over NGNS (NGNS consumer app and NGNS provider app)

##### Legacy presence with NGNS consumer app and Name Service provider app

If a name that was discovered is connected to a 14.02 
AllJoyn router, the new Ping API message sequence is not 
supported. If the Ping API returns not implemented error code, 
the consumer application must issue `FindAdvertisedName()` 
with the discovered name so that presence for that name can be initiated.

![revert-legacy-presence-ngns-consumer-app-ns-provider-app][revert-legacy-presence-ngns-consumer-app-ns-provider-app]

**Figure:** Reverting to legacy presence (NGNS consumer app and Name Service provider app)

### DNS-SD message format

See [Usage of DNS-SD ][dns-sd-usage] for information on how the 
AllJoyn framework makes use of the DNS-SD protocol. 
The AllJoyn discovery process is based on the DNS-SD and the 
message format is captured below. 

**NOTE:** <guid> in the resource records refers to the AllJoyn 
router'\'s GUID. In addition, the presence of specific records 
in a given message is specified in the NGNS message sequences 
capture above while the tables below show all the possible 
records types that can be present in the query or response messages:

#### DNS-SD query

##### DNS-SD query: question format

| Name | Type | Record-specific data |
|---|:---:|---|
| <ul><li>alljoyn._udp.local.</li><li>alljoyn._tcp.local.</li></ul> | PTR | <p>The service name is alljoyn as allocated through IANA.</p><p>In the 14.06 release, the protocol used in the service description is TCP. When UDP transport is supported in future, the protocol for service name will be UDP.</p><p>The discovery scope is the local network.</p> |

##### DNS-SD query: Additional section

| Name | Type | Record-specific data |
|---|:---:|---|
| search.<guid>.local. | TXT | <p>Captures the well-known names or interfaces that are being searched. The key notation is as follows:</p><ul><li>txtvrs=0; this represents version of the TXT record.</li><li>n_1, n_2, etc., if multiple well-known names are present, they are logically ANDed; n_# is the key for well-known names.</li><li>i_1, i_2, etc., if multiple interface names are being queried. If multiple interface names are present, they are logically ANDed; i_# is the key for interface names.</li><li>Since the APIs for name-based and interface-based query are different, the search record has either name keys or interface keys.</li></ul><p>If the consumer application intends to perform logical OR operation for interface names, it must call the discovery API with interface name multiple times.</p><p>Example:  i_1 = org.alljoyn.About</p> |
| sender-info.<guid>.local. | TXT | <p>Captures additional data regarding the sender of the message. The following keys are sent:</p><ul><li>txtvrs=0; represents the version of the TXT record.</li><li>pv (protocol version):  represents the discovery protocol version.</li><li>IPv4 and UDPv4 address: represents the IPv4 address and UDP port.</li><li>bid (burst identifier): represents the burst identifier.</li></ul> | 
| ping.<guid>.local. | TXT | <p>Captures the names that are being pinged by the consumer application. The key notation is as follows:</p><ul><li>txtvrs=0; represents version of the TXT record.</li><li>n= the well-known name or the unique name.</li></ul><p>Only one key can be present in the ping record.</p>

#### DNS-SD response

##### DNS-SD response message: Answer section

| Name | Type | Record-specific data |
|---|:---:|---|
| _alljoyn._tcp.local. | PTR | <guid>._alljoyn._tcp.local. |
| <guid>._alljoyn._tcp.local. | TXT | <p>txtvrs=0</p><p>Except for text record version, there is no additional record.</p> |
| <guid>._alljoyn._tcp.local. | SRV | <p>port, <guid>.local</p><p>port represents TCP port number used for the router-router connection.</p> |

##### DNS-SD response message: Additional section

| Name | Type | Record-specific data |
|---|:---:|---|
| advertise.<guid>.local. | TXT | <p>Captures the well-known names that the provider application is advertising.The key notation is as follows:</p><p>n_1, n_2, etc., if multiple well-known names are being advertised; n_# is the key for well-known names.</p><p>For interface query response, the sessionless signal well-known name that is advertised is as follows:</p><p>n_1=org.alljoyn.About.sl.y<guid>.x<latest change_id></p> |
| sender-info.<guid>.local. | TXT | <p>Captures additional data regarding the sender of the message. The following keys are sent:</p><ul><li>txtvrs=0; represents version of the TXT record.</li><li>pv (protocol version):  represents the discovery protocol version.</li><li>IPv4 and UDPv4 address: represents the IPv4 address and UDP port.</li><li>bid (burst identifier): represents the burst identifier.</li></ul> |
| Ping-reply.<guid>.local. | TXT | <p>Captures the names that are being pinged by the consumer application. The key notation is as follows:</p><ul><li>txtvrs=0; represents version of the TXT record.</li><li>n= well-known name or unique name.</li><li>replycode = reply code as returned by the router.</li></ul> |
| <guid>.local | A | This resource record sends IPv4 address. It is present in response messages for discovery. |

#### NGNS configuration parameters

| Parameter | Default value | Range | Description |
|---|---|---|---|
| EnableLegacyNS | true | boolean | Specifies the backward compatibility behavior with respect to legacy Name Service. |

### Discovery usage guidelines

Although the AllJoyn system supports both the name-based and 
announcement-based discovery, the preferred and recommended 
method for discovering services in an AllJoyn IoE network 
is the announcement-based discovery.

The name-based service discovery process can be used for 
app-to-app based discovery, where both provider and consumer 
applications are aware of the well-known name. This discovery 
process is also used for sessionless signals and to discover 
the AllJoyn router for the thin app. 
[AllJoyn discovery method usage guidelines][discovery-method-usage-guidelines] 
summarizes usage guidelines for the two AllJoyn discovery methods.

#### AllJoyn discovery method usage guidelines

| Name-based discovery usage | Announcement-based discovery usage |
|---|---|
| <ul><li>App-to-app discovery</li><li>Sessionless signals</li><li>AllJoyn router discovery for thin apps</li></ul> | AllJoyn service interfaces discovery on the AllJoyn network. |



[iana-multicast-addresses]: #iana-registered-multicast-addresses-for-the-alljoyn-framework
[ngns-message-sequences]: #ngns-message-sequences
[name-service-message-structure-fields]: #name-service-message-structure-fields
[is-at-message-format-v1-fields]: #is-at-message-format-version-1-fields
[who-has-message-format-fields]: #who-has-message-format-version-1-fields
[sessionless-signal]: /learn/core/system-description/sessionless-signal
[alljoyn-discovery-config-params]: #alljoyn-discovery-configuration-parameters
[dns-sd-message-format]: #dns-sd-message-format
[discovery-presence-apis]: #discovery-and-presence-apis-related-to-discovery-scenarios
[transmission-schedule]: #transmission-schedule
[ngns-consumer-provider-apps]: #ngns-consumer-app-and-ngns-provider-app
[dns-sd-usage]: #usage-of-dns-sd
[discovery-method-usage-guidelines]: #alljoyn-discovery-method-usage-guidelines



[name-based-discovery-arch]: /files/learn/system-desc/name-based-discovery-arch.png
[consumer-router-discovery-behavior]: /files/learn/system-desc/consumer-router-discovery-behavior.png
[typical-discovery-wkn]: /files/learn/system-desc/typical-discovery-wkn.png
[discovery-unreliable-network]: /files/learn/system-desc/discovery-unreliable-network.png
[discovery-late-ip-connectivity]: /files/learn/system-desc/discovery-late-ip-connectivity.png
[wkn-lost-ip-connectivity]: /files/learn/system-desc/wkn-lost-ip-connectivity.png
[provider-cancels-wkn-advertisement]: /files/learn/system-desc/provider-cancels-wkn-advertisement.png
[consumer-cancels-wkn-discovery]: /files/learn/system-desc/consumer-cancels-wkn-discovery.png
[name-service-message-structure]: /files/learn/system-desc/name-service-message-structure.png
[is-at-message-format-v1]: /files/learn/system-desc/is-at-message-format-v1.png
[who-has-message-format-v1]: /files/learn/system-desc/who-has-message-format-v1.png
[announcement-service-discovery-arch]: /files/learn/system-desc/announcement-service-discovery-arch.png
[announcement-service-discovery]: /files/learn/system-desc/announcement-service-discovery.png
[ngns-high-level-arch]: /files/learn/system-desc/ngns-high-level-arch.png
[ngns-discovery-consumer-app-provider]: /files/learn/system-desc/ngns-discovery-consumer-app-provider.png
[ngns-discovery-ngns-name-service-provider-apps]: /files/learn/system-desc/ngns-discovery-ngns-name-service-provider-apps.png
[find-advertised-name-api-called-provider-arrives-later]: /files/learn/system-desc/find-advertised-name-api-called-provider-arrives-later.png
[alljoyn-interface-query-ngns-consumer-provider-apps]: /files/learn/system-desc/alljoyn-interface-query-ngns-consumer-provider-apps.png
[interface-query-ngns-consumer-app-ngns-ns-provider-apps]: /files/learn/system-desc/interface-query-ngns-consumer-app-ngns-ns-provider-apps.png
[pending-interface-query-ngns-consumer-app-ngns-ns-provider-apps]: /files/learn/system-desc/pending-interface-query-ngns-consumer-app-ngns-ns-provider-apps.png
[cancel-advertised-name-ngns-consumer-app-ngns-ns-provider-apps]: /files/learn/system-desc/cancel-advertised-name-ngns-consumer-app-ngns-ns-provider-apps.png
[ping-api-over-ngns-ngns-consumer-provider-apps]: /files/learn/system-desc/ping-api-over-ngns-ngns-consumer-provider-apps.png
[revert-legacy-presence-ngns-consumer-app-ns-provider-app]: /files/learn/system-desc/revert-legacy-presence-ngns-consumer-app-ns-provider-app.png

