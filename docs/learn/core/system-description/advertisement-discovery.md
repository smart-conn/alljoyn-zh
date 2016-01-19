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
| Timer | <p>计算 (以秒计算) 哪些 IS-AT 应答应被认为有效。</p><p>此字段应根据下列参数设定：</p><ul><li>Adv_Validity_Period 被推广的 well-known name 默认的有效期限。</li></ul><ul><li>Adv_Infinite_Validity_Value for a well-known name advertisement that is valid "forever", or at least until withdrawn. A zero in this field means that the sending AllJoyn router is withdrawing the advertisements.</li></ul> |

##### IS-AT message

The following figure shows version 1 of the IS-AT message. 

[IS-AT message format version 1 fields][is-at-message-format-v1-fields] 
defines the IS-AT message fields

![is-at-message-format-v1][is-at-message-format-v1]

**Figure:** IS-AT message format (version 1)

##### IS-AT message format version 1 fields

| Field | Description |
|---|---|
| R4 Bit | If set to '1', the R4 bit indicates that the IPv4 endpoint (IP address and port) of a reliable transport (TCP) is present. |
| U4 Bit | If set to '1', the U4 bit indicates that the IPv4 endpoint (IP address and port) of an unreliable transport (UDP) is present. |
| R6 Bit | If set to '1', the R6 bit indicates that the IPv6 endpoint (IP address and port) of a reliable transport (TCP) is present. |
| U6 Bit | If set to '1', the U6 bit indicates that the IPv6 endpoint (IP address and port) of an unreliable transport (UDP) is present. |
| C Bit | If set to '1', the C bit indicates that the list of StringData records is a complete list of all well-known names exported by the responding AllJoyn router. |
| G Bit | If set to '1', the G bit indicates that a variable length daemon GUID string is present. |
| M | Message type of the IS-AT message. Defined to be '01' (1) for IS-AT. |
| Count | Number of StringData items that are included in the IS-AT message. |
| TransportMask | Bit mask of transport identifiers that indicates which AllJoyn transport is making the advertisement. |
| StringData | Describes a single AllJoyn well-known name being advertised. |

##### WHO-HAS message

The following figure shows version 1 of the WHO-HAS message. 

[WHO-HAS message format version 1 fields][who-has-message-format-fields] defines the 
WHO-HAS message fields.

![who-has-message-format-v1][who-has-message-format-v1]

**Figure:** WHO-HAS message format (version 1)

##### WHO-HAS message format version 1 fields

| Field | Description |
|---|---|
| Reserved | Reserved bits. |
| M | Message type of the WHO-HAS message.  Defined to be '10' (2) for WHO-HAS. |
| Count | Number of StringData items that are included in the WHO-HAS message. |
| StringData | Describes a single AllJoyn well-known name that the consumer AllJoyn router is interested in. |

### Legacy announcement-based discovery

This section captures design for the legacy announcement-based 
discovery supported prior to the 14.06 release.

In the announcement-based discovery, the provider device 
announces the set of AllJoyn interfaces supported via an 
announcement broadcast signal. The consumer device interested 
in making use of the AllJoyn services opts to receive these 
broadcast announcement messages from providers to discover 
the interfaces for the supported AllJoyn services. 

The Announcement message is generated by the About feature 
and is delivered as an AllJoyn sessionless signal using the 
sessionless signal mechanism provided by the AllJoyn router 
(detailed [Sessionless Signal][sessionless-signal]). The sessionless signal module makes 
use of the AllJoyn name service messages (IS-AT and WHO-HAS) 
to notify the consumer of new signals using a specially 
formatted well-known name for the sessionless signal. Once the 
consumer AllJoyn router discovers the sessionless signal's 
well-known name, it connects back to the provider over an 
AllJoyn session to fetch the service announcement message 
from the provider device.

The following figure captures the high-level architecture 
for the announcement-based discovery process.

![announcement-service-discovery-arch][announcement-service-discovery-arch]

**Figure:** Announcement-based service discovery architecture

The Announcement message is sent as a sessionless signal 
from the provider app to the AllJoyn router, and gets cached 
in the sessionless signal cache. The sessionless signal module 
generates a specially formatted well-known name for the 
sessionless signal as shown below (see details in [Sessionless Signal][sessionless-signal]):

```
SLS WKN format: org.alljoyn.sl.x<GUID>.x<change_id>
```

The sessionless signal module interacts with the Name Service 
to send an IS-AT message for that well-known name. The AllJoyn 
router on the consumer side is looking to discover this well-known 
name. Upon receiving the IS-AT message, the sessionless signal 
module on the consumer side connects back to the sessionless 
signal module on the provider via an AllJoyn session and fetches 
the Announcement message which then gets delivered to the consumer app.

#### Message sequence

The following figure shows the message sequence for the announcement-based discovery.

![announcement-service-discovery][announcement-service-discovery]

**Figure:** Announcement-based service discovery message sequence

#### Announcement message

The Announcement message provides a list of object paths for 
objects implemented by the AllJoyn application and AllJoyn 
interfaces supported by each of those objects. The AllJoyn 
application controls which objects get announced in the Announcement message. 

The Announcement message also contains additional About fields 
describing information about the application and the device. 
See the About HLD for Announcement message details.

### Legacy AllJoyn discovery configuration parameters

[AllJoyn discovery configuration parameters][alljoyn-discovery-config-params] captures 
configuration parameter for legacy AllJoyn discovery.

**NOTE:** Implementation may use different names for these parameters.

#### AllJoyn discovery configuration parameters

| Parameter | Default value | Range | Description |
|---|---|---|---|
| Adv_Validity_Period | 120 seconds | TBD | Validity period used for IS-AT advertisements. |
| Adv_Infinite_Validity_Value | 255 | TBD | Time value for indicating that an advertisement is valid forever. |
| Adv_Msg_Retransmit_Interval |	40 seconds | TBD | Interval in seconds for sending out IS-AT messages. |
| Disc_Msg_Number_Of_Retries | 2 | TBD | Number of times the WHO-HAS message is sent after the first transmission. |
| Disc_Msg_Retry_Interval | 5 seconds | TBD | Interval in seconds between retries of the WHO-HAS message. |

### Next-generation name service

The Next-Generation Name Service (NGNS) is implemented in the 
14.06 release and offers considerable performance enhancements 
for discovery and presence features offered by the AllJoyn platform, 
detailed in the subsequent relevant sections. 

The following figure shows the high-level architecture for NGNS.

![ngns-high-level-arch][ngns-high-level-arch]

**Figure:** NGNS high-level architecture

The architecture shows main logical components related 
to NGNS. The enhanced discovery and presence functionality 
are exposed via new APIs as part of the AllJoyn core library. 
The About functionality is included in the AllJoyn core library, 
and enables an AllJoyn app to send Announcement sessionless signals. 
The sessionless signal module caches the Announcement signal. 
The NGNS module uses information in the Announcement signal 
to answer interface-based discovery queries received from consumer apps.

#### Discovery

The AllJoyn framework offers name-based discovery or announcement-based 
discovery as mentioned earlier in this chapter. NGNS supports 
the following discovery mechanisms:

* NGNS supports name-based discovery. Although there is no change 
at the API level, the discovery utilizes DNS service discovery 
framework over mDNS. NGNS sends out legacy (pre-14.06 release) 
discovery messages as per the configuration setting in the 
AllJoyn router config file for compatibility.
* NGNS supports a more efficient announcement-based discovery 
process by allowing a consumer application to query for a set 
of AllJoyn interfaces. Prior to the 14.06 release, the consumer 
application had to create match rules to receive all Announce 
signals (transmitted as sessionless signals), and parse through 
the set of AllJoyn interfaces that the provider application is 
announcing prior to making a determination if any interfaces of 
interest are provided. While this mechanism is more powerful 
than the well-known name-based mechanism, it was not efficient. 
The NGNS feature allows a consumer application to query for 
the set of AllJoyn interfaces, and only the provider applications 
that make use of those interfaces answer the query.

#### Presence detection

Prior to the 14.06 release, presence (or absence) detection 
was based on three successive IS-AT messages missing for a 
given name (well-known or unique name) by the consumer application. 
The time taken for this detection was deterministic (3*40 sec = 120 sec). 

The use of NGNS in the 14.06 release introduces an efficient 
consumer application-driven presence detection that makes use 
of unicast messaging. Once a name has been discovered, the 
consumer application can invoke the new Presence API and determine 
the presence state. Since each application has its own logic 
regarding times and events triggering presence detection, NGNS 
provides the API and leaves the triggering logic for the application to drive.

#### NGNS design aspects

The following sections detail the design aspects of the NGNS feature.

##### Usage of mDNS

The 14.02 discovery protocol is based on AllJoyn-specific 
UDP messages over the AllJoyn-assigned multicast IP address. 
This design can limit discoverability (IP routers can block 
AllJoyn-assigned multicast IP address and/or port numbers) 
in the field. To address this issue, the 14.06 discovery 
protocol is based on multicast DNS (mDNS) that uses IANA-assigned 
multicast IP address and port numbers.

##### Multicast IP addresses and port numbers used by NGNS

| Address | Value |
|---|---|
| IPv4 Multicast group address | 224.0.0.251 |
| IPv6 Multicast group address | FF02::FB |
| Multicast port number | 5353 |

Furthermore, mDNS already supports the following features 
that are utilized by the AllJoyn discovery protocol:

* Solicit unicast responses
* Send query message using unicast
* Send unsolicited responses from the responder

This constitutes version 2 of the discovery protocol. 
The version number is set in the pv field of the "sender-info" 
TXT record in the additional section of the mDNS query and response.

**NOTE:** The 14.02 Name Service implementation uses version 0 and 1 
of the discovery protocol. 

##### Usage of DNS-SD 

The 14.06 discovery design is based on [RFC 6763](http://tools.ietf.org/html/rfc6763). 

A client discovers the list of available instances of a given 
service name (as registered with IANA, e.g., alljoyn is a 
registered service name) using a query for a DNSPTR record 
with a name of the form:

```
"<Service>.<Domain>" [RFC 1035](https://www.ietf.org/rfc/rfc1035.txt). 
```

The result of this PTR lookup for the name "<Service>.<Domain>" 
is a set of zero or more PTR records giving Service Instance Names of the form:

```
Service Instance Name = <Instance>.<Service>.<Domain>
```

In addition to that service instance, the DNS-SD responder sends 
DNS SRV [RFC 2782](https://www.ietf.org/rfc/rfc2782.txt) and DNS TXT 
[RFC 1035](https://www.ietf.org/rfc/rfc1035.txt) record. 
The SRV and TXT records have a name of the form:

```
"<Instance>.<Service>.<Domain>"
```

The SRV record gives the target host and port where the service 
instance can be reached. The DNS TXT record of the same name 
gives additional information about this instance, in a 
structured form using key/value pairs.

In addition to the service discovery framework specified in 
[RFC 6763](http://tools.ietf.org/html/rfc6763), 
the NGNS discovery protocol sends DNS TXT records in the 
Additional section of the DNS-SD query to optimize the 
discovery scope without requiring further negotiation by 
establishing an AllJoyn session with the provider application.  
The same feature is utilized in other use cases, such as sending 
sender-information or presence-related information. The DNS-SD 
message format is described in detail in [DNS-SD message format][dns-sd-message-format].

##### Design considerations for Wi-Fi

It is well known that the multicast success rate over Wi-Fi 
is not optimal and in some cases it is substantially degraded. 
As per the Wi-Fi specification, each station is allowed to 
go into sleep state and wake up periodically. The wake-up 
interval is provisioned at the device and is supposed to 
be a factor of the time interval used by the AP to schedule 
the multicast traffic. 

The AP buffers the incoming multicast data and schedules it 
based on the time interval determined by the DTIM (Delivery Traffic 
Indication Message) interval. In reality, it has been observed 
that the wake-up interval is set to multiples of the DTIM value 
(typically 1, 3, or 10). This implies that the device might 
miss the multicast data. Since this is a realistic scenario, 
the AllJoyn discovery protocol was designed to handle this 
scenario in a robust fashion. 

Specifically, the design principles captured in sections below are adopted.

###### Transmission schedule

The multicast schedule was designed to support devices that 
wake up to process multicast packets in the multiple of DTIM 
interval. Although the schedule backs off exponentially, 
each multicast message is repeated twice to improve reliability 
of multicast messages with devices that wake up every third 
DTIM interval (a very typical case). 

The schedule sends query messages at the following times: 
0, 1, 3, 9, and 27 seconds. At each transmit time trigger, 
a total of three messages (original plus two repeats 100 msec apart) 
are sent. This is referred to as burst in the call flows. 
As far as the message recipient is concerned, a response 
to the first successfully received message in a burst is 
sent and all subsequent messages that are part of the same burst are ignored. 

###### Minimize multicast and maximize unicast transmissions

Another design aspect is to send multicast messages to initiate 
queries but rely on unicast responses for replies and presence 
detection. The DNS allows unicast responses to be solicited 
in the mDNS query, and the discovery protocol utilizes that 
feature. This is indicated in the top bit of the qclass field 
of the DNS message header [RFC 6762](http://tools.ietf.org/html/rfc6762).

##### Discovery and Presence API snapshot

[Discovery and Presence APIs related to discovery scenarios][discovery-presence-apis]
lists the Discovery and Presence APIs offered by the AllJoyn 
system and maps them to discovery scenarios. The main paradigm 
is that discovery and presence are driven by the consumer application.

##### Discovery and Presence APIs related to discovery scenarios

| Discovery scenario | API |
|---|---|
| Consumer application Name query | `FindAdvertisedName()` |
| Consumer application gets notified about discovery or loss of an advertised name | <ul><li>`FoundAdvertisedName()`</li><li>`LostAdvertisedName()`</li></ul> |
| Consumer application cancelling the Name query | `CancelFindAdvertisedName()` |
| Provider application advertising a name | `AdvertiseName()` |
| Providing application canceling advertising a name | `CancelAdvertiseName()` | 
| Provider application sending an Announcement message | `Announce()` | 
| Consumer application queries for set of AllJoyn interfaces | `RegisterAnnounceHandler()` |
| Consumer application cancels a query for set of AllJoyn interfaces | `UnregisterAnnounceHandler()` |
| Consumer application queries for presence | `Ping()` |

###### Discovery APIs that trigger DNS-SD multicast messages

Some of the discovery scenarios trigger multicast messaging. 
The APIs that trigger multicast messaging are: `FindAdvertisedName()`, 
`CancelAdvertiseName()`, `AdvertiseName()`, `Announce()`, and `RegisterAnnounceHandler()`.

Some key aspects of the multicast transmission are listed below:

* DNS-SD query issued over mDNS multicast address 
* Transmission schedule as per [Transmission schedule][transmission-schedule]
* Name Service messages sent depending on the LegacyNS flag 
setting in the Router config file
* Legacy Name Service WHO-HAS and mDNS messages follow the 
same transmission schedule.

##### Backward compatibility

NGNS is designed to meet the following backward compatibility requirements:

* Support all existing 14.02 APIs
* Support all legacy (version 0 and 1) NS discovery packet formats
* Send equivalent 14.02 discovery message over the wire 
whenever the corresponding DNS-SD message is being sent 
(provided the LegacyNS flag is set to true)
* Replies with 14.02 response message upon receipt of a 
14.02 query message provided the supported version (SVer) 
field indicates that querier doesn't support NGNS. If the 
querier supports NGNS as indicated by the supported version, 
then NGNS waits for the DNS-SD messages to arrive.

The AllJoyn router configuration file adds a LegacyNS flag 
to enable legacy discovery behavior. By default, the legacy behavior is enabled.

### NGNS message sequences 

This section captures message sequences for NGNS.

#### Name-based discovery

This section captures messages sequences for NGNS name-based discovery scenarios.

##### NGNS consumer app with NGNS provider app

In this scenario, the consumer application's AllJoyn router 
has disabled the legacy behavior, i.e., no Name Service 
messages are being sent by the consumer application. 

This message sequence assumes that the provider application 
is already on the AllJoyn network. 

The main steps for the message sequence are described below.

1. The message flow is initiated by the consumer application 
invoking FindAdvertisedName().
2. NGNS sends DNS-SD based query messages over mDNS.
3. Any provider application that matches the name being 
searched responds via the DNS-SD response message over 
unicast to the consumer application.

![ngns-discovery-consumer-app-provider][ngns-discovery-consumer-app-provider]

**Figure:** NGNS name-based discovery between consumer app and provider

##### NGNS consumer app with NGNS and Name Service provider apps

This message sequence assumes the following:

* The consumer application's AllJoyn router has enabled the 
legacy Name Service behavior.
* The provider applications are already on the AllJoyn network. 

The main steps for the message sequence are described below.

1. The message flow is initiated by the consumer application 
invoking `FindAdvertisedName()`.
2. The NGNS sends DNS-SD based query messages over mDNS as 
well as the legacy WHO-HAS message.
3. Any AllJoyn provider application that matches the name 
being searched responds via a DNS-SD response message over unicast
4. Any legacy (14.02) provider application also responds 
via an IS-AT message if there is a match for the name being 
discovered in the WHO-HAS message.

![ngns-discovery-ngns-name-service-provider-apps][ngns-discovery-ngns-name-service-provider-apps]

**Figure:** NGNS name-based discovery (NGNS and Name Service provider apps)

##### FindAdvertisedName pending; provider apps arrive later

This message sequence assumes the following:

* The consumer application's AllJoyn router has enabled the 
legacy Name Service behavior. 
* The provider applications are not on the AllJoyn network 
at the time of initial query. 

The main steps for the message sequence are described below.

1. The message flow is initiated by the consumer application 
invoking `FindAdvertisedName()`.
2. The NGNS sends DNS-SD based query messages over mDNS, as 
well as legacy Name Service messages.
3. The query schedule for mDNS messages and WHO-HAS messages expires
4. Upon joining the AllJoyn network, the NGNS provider app 
sends unsolicited DNS-SD response messages and advertises names via IS-AT messages.
5. Upon joining the AllJoyn network, the Name Service provider 
application sends IS-AT messages.
6. The consumer AllJoyn router performs the following tasks:
  1. It consumes the Name Service and NGNS messages.
  2. It filters the names being advertised.
  3. It sends `FoundAdvertisedName()` only if there is a match.


![find-advertised-name-api-called-provider-arrives-later][find-advertised-name-api-called-provider-arrives-later]

**Figure:** FindAdvertisedName API called; provider arrives later

#### Interface names discovery

##### NGNS consumer app and NGNS provider app

This message sequence assumes the following:

* The provider application is already on the AllJoyn network. 
* The legacy Name Service behavior is turned off on the consumer AllJoyn router. 

The main steps for the message sequence are described below.

1. The message flow is initiated by the consumer application 
registering the announce handler (by calling RegisterAnnounceHandler) 
and providing a set of AllJoyn interfaces. This triggers the 
discovery for provider applications that implement those interfaces. 
2. The NGNS sends DNS-SD based query messages over mDNS and 
populates the search TXT record in the Additional section 
based on the AllJoyn interfaces being discovered.
3. Any AllJoyn provider application that provides the 
AllJoyn interfaces being discovered sends the DNS-SD 
response message and includes the sessionless signal 
well-known name corresponding to the About Announce signal. 
   Note that this message is sent over unicast
4. The consumer application immediately initiates a 
sessionless signal fetch to retrieve the Announce signal.

![alljoyn-interface-query-ngns-consumer-provider-apps][alljoyn-interface-query-ngns-consumer-provider-apps]

**Figure:** AllJoyn interface query (NGNS consumer app and NGNS provider app)

##### NGNS consumer app; NGNS and Name Service provider app

This message sequence is an extension of the call flow in 
[NGNS consumer app and NGNS provider app][ngns-consumer-provider-apps] 
with the legacy Name Service behavior being enabled. 

Although the interface-based query is a 14.06 feature, it 
has been designed such that legacy Name Service provider 
applications can participate in the discovery process. 
This is enabled by sending WHO-HAS message with WKN=org.alljoyn.sl. 

This message sequence assumes that the provider application 
is already on the AllJoyn network. 

The main steps for the message sequence are described below:
1. The message flow is initiated by the consumer application 
registering the announce handler (by calling RegisterAnnounceHandler) 
and providing a set of AllJoyn interfaces for discovery.
2. The NGNS sends DNS-SD based query messages over mDNS, 
and populates the search TXT record in the Additional section 
based on the AllJoyn interfaces being discovered.
3. The NGNS sends WHO-HAS discovery messages with WKN=org.alljoyn.sl.
4. Any NGNS provider application that provides the AllJoyn 
interfaces being discovered sends the DNS-SD response message 
and includes the sessionless signal well-known name corresponding 
to the About Announce signal. 
   Note that this message is sent over unicast.
5. The consumer application immediately initiates a sessionless 
signal fetch to retrieve the Announce signal.
6. Any legacy provider application sends an IS-AT message with 
the sessionless signal well-known name if there are any 
sessionless signals in the sessionless signal cache.
7. The consumer application immediately initiates sessionless 
signal fetch and filters the Announce signals that provide the 
AllJoyn interfaces being discovered.

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

