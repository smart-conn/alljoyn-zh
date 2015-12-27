# AllJoyn&trade; 会话

## 综述

在 AllJoyn 使用方已经发现一些提供所需要的服务的提供方设备后，下一步就是与这些提供方建立会话以便使用服务。AllJoyn 会话是在使用者和提供者应用
程序之间的逻辑连接，通过会话应用程序之间可以通信并交换信息。提供方应用程序创建 AllJoyn 会话，并等待使用方应用程序的加入。创建会话的应用程序
就是会话的拥有者（session host），其他的应用程序则是会话的加入者（joiners）。

在提供方的一边，应用程序将会话端口和 AllJoyn 核心库绑定，声明一个会话选项的列表（传输方式，会话类型等等），然后监听会话是否有使用者加入。会
话端口一般都会提前被使用方和提供方的应用程序所知晓。另一种选择是，会话端口可以通过接收提供方的 Announcement 消息被发现到。

在使用方的一边，应用程序通过声明会话端口，服务的 well-known name/ 唯一识别符以及会话选项（传输，会话类型等等），向 AllJoyn 总线发出加入给定
提供方应用程序建立的会话的请求。在这以后，AllJoyn 路由将使用方和提供方应用程序之间的会话建立流初始化。在第一名使用者加入会话后，提供方应用
会分配一个会话 ID. 此会话 ID 会被返回到使用方应用程序，并被用于后续与供应方的通话。

下图展示了 AllJoyn 会话建立的高层结构

![alljoyn-session-establishment-arch][alljoyn-session-establishment-arch]

**Figure:** AllJoyn 会话建立结构

提供方应用程序将针对于给定服务的会话端口与 AllJoyn 路由绑定。well-known name/ 独立标识符和会话端口的结合体唯一定义了端点。使用方应用程序根
据提供方应用程序的 well-known name/ 独立标识符 + 会话端口号来加入会话。在使用者一方的 AllJoyn 路由根据作为发现过程一部分的已发现信息建立一
个到供应方 AllJoyn 路由的物理连接。目前，这个操作包括建立建立一个 TCP 连接，或者，如果两路由间使用 UDP 传输建立会话，则不需要建立物理信道。

在建立了物理连接后，使用方的 AllJoyn 路由开始建立与提供方的会话。提供方 AllJoyn 路由将一个唯一的会话 ID 分配给会话，并创建一个存贮相关会话
信息的会话地图。一旦会话建立，Session Joined 回交将会与会话 ID 一起发送给提供方应用程序。使用方应用程序会收到带有会话 ID 的 Status OK 回应
，作为加入会话呼叫的回应。使用方应用程序也会建立存储会话细节的会话地图。



## 会话类型

根据被允许参与会话的用户数，或者根据会话数据的封装选项，AllJoyn 会话可以被分为不同的类型。

根据被允许参与会话的用户数，AllJoyn 系统支持如下种类的会话


* 点对点会话: 只有一个使用者（参与者）和一个服务端（会话主机）的 AllJoyn 会话。当任意一方离开会话时，此点对点会话结束。SessionLost 提示将被
发送给余下的参与者。
* 多方会话: AllJoyn 会话支持多于两个参与者的会话。这种会话包含一个提供者应用程序（会话主机应用程序）以及一个或多个使用方应用程序（参与方应用程序）在同一个会话中。多方会话可以在多个时间被加入，构成与多个（多于两个）端点的一对一会话。在会话被建立后，新的使用者可加入多方会话，现存的使用者也可以离开多方会话。在多方会话内的所有的参与者都可以相互沟通。

在一个多方会话中，所有的通信流量都会经过会话主机。与点对点会话类似，当一个参与者离开会话，仅剩余两个参与者时，多方会话便结束。

下图描绘了点对点 AllJoyn 会话以及四个参与者的多方 AllJoyn 会话。


![p2p-multipoint-session-examples][p2p-multipoint-session-examples]

**Figure:** 点对点以及多方 AllJoyn 会话

### 原始会话

在 AllJoyn 系统中，两对等节点之间典型的数据交换使用增强的 D-Bus 消息格式。但在一些场景中，与 D-Bus 相关的间接费用会带来不便。在这种情况中，
可以在两节点间使用 AllJoyn 原始会话交换原始数据。

AllJoyn 原始会话使用一个底层的物理连接（例如 TCP/UDP 基于套接字的通信）来实现端点间原始数据的交换。与常规会话不同，原始会话不携带 D-Bus 封装的消息，而是携带被直接由 TCP/UDP 套接字发送的未经封装的原始数据。原始会话仅支持点对点会话。

**NOTE:** 原始会话功能仅可在 AllJoyn 标准用户上使用，精简应用程序无法使用。此功能正在被反对，推荐开发者不使用原始会话功能。



## 点对点会话的建立

由 BusHello 消息获取的 AllJoyn 协议版本用来决定哪一个呼叫流程将被使用。


### Pre-15.04 点对点会话建立

下图描述了一个点对点 AllJoyn 会话建立的消息流程，生产方或使用方之一是14.12或更早的版本。
The following figure captures the AllJoyn session establishment
message flow for a point-to-point session when either the producer or consumer
is version 14.12 or earlier.

![establishing-p2p-session][establishing-p2p-session]

**Figure:** AllJoyn 点对点会话建立 - 14.12版本或更早

下面是生产方或使用方之一是14.12或更早的版本情况下的消息流程。

1. 提供方与使用方都通过 AllJoyn 核心库连接到各自的 AllJoyn 路由上，并获取被分配的唯一标识。
2. 提供方应用程序向 AllJoyn 核心库注册服务的总线对象。
3. 提供方应用程序通过 AllJoyn 核心库向 AllJoyn 路由请求一个 well-known name.
4. 提供方应用程序通过 AllJoyn 库的 `BindSessionPort` API 将会话端口捆绑，The provider app binds a session port with the AllJoyn router via the AllJoyn
library's `BindSessionPort` API. This call specifies a session port, session
options, and a SessionPortListener for the session.
5. The consumer app discovers the provider app using the AllJoyn Advertisement and Discovery mechanism.
6. The consumer app initiates joining the session with the
provider via the `JoinSession` API. This call specifies the unique name
of session host, session port, desired session options, and a SessionListener.
7. The consumer side AllJoyn router establishes a physical
channel with the provider side AllJoyn router (as applicable). For
TCP Transport, this involves setting up a TCP connection
between the two AllJoyn routers. If a UDP Transport is used
between the two routers for session setup, no physical channel
needs to be established.
8. Once a connection is set up between the two AllJoyn buses,
the consumer AllJoyn router initiates a `BusHello` message to
send its bus GUID and AllJoyn protocol version. The provider
AllJoyn router responds with its GUID, AllJoyn protocol
version, and unique name. The protocol version received from the routing nodes
during the `BusHello` stage is used to determine if the pre-15.04 or post-15.04
call flow is used.
9. The consumer and provider AllJoyn routers send out `ExchangeNames`
signals to exchange the set of known unique names and well-known names.
10. The consumer AllJoyn router invokes the `AttachSession`
method call at the provider AllJoyn router to join the session.
This call specifies the session port, session options, and unique
name/well-known name of the session host among other parameters.
11. If the session opts are compatible, the provider AllJoyn router invokes an
`AcceptSession` method call with the provider app which returns 'true' if the
session gets accepted.
Refer to section [Session options negotiation][session-options-negotiation] for
details of session opts compatibility.
12. In case of incompatible session opts or if the session is not accepted by
the provider app, an appropriate error code is sent back. If the session gets
accepted, the provider AllJoyn router generates a unique sessionId for this
session and sends a successful response. It sends back an `AttachSession` response
 message to the consumer AllJoyn router providing the result and sessionId if
 applicable.
13. The provider AllJoyn router sends a SessionJoined signal
to the provider app specifying the sessionId.
14. After receiving the `AttachSession` response, the consumer
AllJoyn router sends a JoinSession response message to the
app with an OK status and provides the session Id.

### Post-15.04 Point to Point Session establishment

The following figure captures the AllJoyn session establishment
message flow for a point-to-point session when both the producer and consumer
are version 15.04 or later.

![establishing-p2p-session-1504][establishing-p2p-session-1504]

**Figure:** AllJoyn point-to-point session establishment - 15.04 or later


This is the message flow when both the producer and consumer are version 15.04
or later.

1. The call flow until the `BusHello` stage is the same as described in [Pre-15.04 Point to Point Session establishment][pre-15-04-point-to-point-session-establishment].
The protocol version received from the routing nodes during the `BusHello` stage
is used to determine if the pre-15.04 or post-15.04 call flow is used.
2. The consumer AllJoyn router invokes the `AttachSessionWithNames`
method call at the provider AllJoyn router to join the session. This call
specifies the session port, session options, and unique name/well-known name of
the session host among other parameters. As a part of this method call, the
 consumer AllJoyn router also sends out the names required for establishing the
 session. It may send out all names if it has been requested by the consumer or
 provider app.
 Refer to [Names sent as a part of AttachSessionWithNames][names-sent-as-a-part-of-attachsessionwithnames] for more details.
3. If the session opts are compatible, the provider AllJoyn router invokes an
`AcceptSession` method
call with the provider app which returns 'true' if the session gets accepted.
Refer to section [Session options negotiation][session-options-negotiation] for
details of session opts compatibility.
4. In case of incompatible session opts or if the session is not accepted by
the provider app, an appropriate error code is sent back. If the session gets
accepted, the provider AllJoyn router generates a unique sessionId for this
session. It sends back an `AttachSessionWithNames` response message to the
consumer AllJoyn router providing the result and sessionId if applicable.
The provider AllJoyn router also sends out the names required for establishing
the session as a part of the response. It may send out all names if it has been
requested by the consumer or provider app.
 Refer to [Names sent as a part of AttachSessionWithNames][names-sent-as-a-part-of-attachsessionwithnames] for more details.
5. The provider AllJoyn router sends a SessionJoined signal
to the provider app specifying the sessionId.
6. After receiving the `AttachSessionWithNames` response, the consumer
AllJoyn router sends a JoinSession response message to the
app with an OK status and provides the session Id.


## Multipoint Session Establishment

The following use cases illustrate various AllJoyn session scenarios:

* Establish a multi-point session
* Consumer joins an existing multi-point session
* Consumer leaves a point-to-point Session
* Consumer leaves a multi-point session with more than 2 participants
* Provider unbinds a session port

### Establish a multi-point session

The following figure captures the session establishment
message flow for a multi-point session between two participants.

![establishing-multipoint-session][establishing-multipoint-session]

**Figure:** AllJoyn session - establishing a multi-point session

A multi-point session follows same message flow as the
point-to-point session with the additional step of sending
out the `MPSessionChanged` signal from the AllJoyn router
to the application indicating new participant. This signal
specifies the sessionId, the unique name/well-known name
of the participant, and a flag to indicate whether the
participant was added.

### Consumer joins an existing multi-point session
The following figure captures the message flow for the
scenario where a new consumer joins an existing multi-point session.

In a multi-point session, the new joiner is responsible
for notifying existing participants (other than session host)
of the newly added member to the session. This is so that
existing members can update their session routing information
to include the new joiner, and future session messages can be
routed appropriately. To achieve this, the new member invokes
an `AttachSession` with all existing members. This results in
existing members adding the new joiner to their session-related tables.

#### Consumer joins an existing multi-point session - Pre-15.04 call flow

![consumer-joins-multipoint-session][consumer-joins-multipoint-session]

**Figure:** AllJoyn session - consumer joins a multi-point session - 14.12 or earlier

The message flow steps are described below.

1. The provider and consumer app are set up and the consumer discovers the producer app
by using the AllJoyn Advertisement and Discovery mechanism.
2. The AllJoyn session establishment steps occur between
joiner 1 (consumer 1) and the session host (provider) to
establish a multi-point session as captured in [Establish a
multi-point session][establish-multi-point-session].
3. Consumer 2 (joiner 2) wants to join the existing multi-point
session, and initiates a JoinSession call with its AllJoyn router.
4. The joiner 2 AllJoyn router establishes a physical
channel with the provider side AllJoyn router (as applicable). For
TCP Transport, this involves setting up a TCP connection
between the two AllJoyn routers. If a UDP Transport is used
between the two routers for session setup, no physical channel
needs to be established.
5. Once a connection is set up between the two AllJoyn buses,
the consumer AllJoyn router initiates a `BusHello` message to
send its bus GUID and AllJoyn protocol version. The provider
AllJoyn router responds with its GUID, AllJoyn protocol
version, and unique name.
6. The joiner 2 and provider AllJoyn routers send out `ExchangeNames`
signals to exchange the set of known unique names and well-known names. The provider AllJoyn router forwards this `ExchangeNames` to all other connected routers including the joiner 2 AllJoyn router.
7. The AllJoyn session establishment steps occur between
joiner 2 and the session host to add this joiner to the
existing multi-point session.
8. An `MPSessionChanged` signal is sent out to the session
host app informing it of new joiner in the session.
9. Joiner 2 receives the set of existing members for the
multi-point session from the session host as part of the
`AttachSession` response.
10. Joiner 2 initiates an `AttachSession` with every received
member of the session (except the session host, which it
just did using the `AttachSession`) and sends it to the session host.
11. The session host forwards this `AttachSession` to the existing session member.
12. Joiner 1 receives `AttachSession` from joiner 2 and updates
its session-related tables to add joiner 2.
13. The AllJoyn router on joiner 1 sends out an `MPSessionChanged`
signal to the app, indicating a newly added member to the
multi-point session.
14. Joiner 2 also sends out separate `MPSessionChanged` signal
to the app for each existing member of the session.

#### Consumer joins an existing multi-point session - Post-15.04 call flow

![consumer-joins-multipoint-session-post-1504][consumer-joins-multipoint-session-post-1504]

**Figure:** AllJoyn session - consumer joins a multi-point session - 15.04 or later

The message flow steps are described below.

1. The provider and consumer app are set up and the consumer discovers the producer app
by using the AllJoyn Advertisement and Discovery mechanism.
2. The AllJoyn session establishment steps occur between
joiner 1 (consumer 1) and the session host (provider) to
establish a multi-point session as captured in [Establish a
multi-point session][establish-multi-point-session].
3. Consumer 2 (joiner 2) wants to join the existing multi-point
session, and initiates a JoinSession call with its AllJoyn router.
4. The AllJoyn session establishment steps occur between
joiner 2 and the session host to add this joiner to the
existing multi-point session and exchanges the necessary names.
Refer to [Names sent as a part of AttachSessionWithNames][names-sent-as-a-part-of-attachsessionwithnames] for more details.
5. An `MPSessionChanged` signal is sent out to the session
host app informing it of new joiner in the session.
6. Joiner 2 receives the set of existing members for the
multi-point session from the session host as part of the
`AttachSessionWithNames` response.
7. Joiner 2 initiates an `AttachSessionWithNames` with every received
member of the session (except the session host, which it
just did using the `AttachSessionWithNames`) to the session host.
8. The session host forwards this `AttachSessionWithNames` to the existing
session member and sends the unique name and aliases of the joiner app and its
routing node.  Refer to [Names sent as a part of AttachSessionWithNames][names-sent-as-a-part-of-attachsessionwithnames] for more details.
9. Joiner 1 receives `AttachSessionWithNames` from joiner 2 and updates
its session-related tables to add joiner 2 and sends a response back to the
session host AllJoyn Router.
10. The session  host AllJoyn Router forwards this response back to the
Joiner 2 routing node.
11. The AllJoyn router on joiner 1 sends out an `MPSessionChanged`
signal to the app, indicating a newly added member to the
multi-point session.
12. Joiner 2 also sends out separate `MPSessionChanged` signal
to the app for each existing member of the session.


### Consumer leaves a point-to-point session

The following figure captures the message flow for the scenario
where a consumer leaves an existing point-to-point session.
The same message flow is also applicable for the scenario when
a consumer leaves a multi-point session with only two participants.

When a participant leaves a point-to-point session or a multi-point
session with only two participants, the session ends and is removed
from session tables of both the participants. A participant can
leave a session by initiating a LeaveSession call with the AllJoyn
router. This results in a DetachSession signal being delivered
to the other member of the session. Receipt of this signal triggers
clearing of sessionId and other session-related information
from the session tables of that member. Whenever a session ends,
a SessionLost signal is sent to the application.  

**NOTE:** Either the joiner or the host of the session can leave
a session. A similar message flow is applicable when a session
host leaves the session.

![consumer-leaves-p2p-session][consumer-leaves-p2p-session]

**Figure:** AllJoyn session - consumer leaves a point-to-point session

The message flow steps are described below.

1. The consumer app establishes a session with the session host.
2. The consumer app decides to leave the session. It invokes
a LeaveSession API with the AllJoyn router via the AllJoyn
core library. This call takes in the sessionId as input parameter.
3. The AllJoyn router generates a DetachSession signal specifying
the sessionId and the member that is leaving the session.
This signal is sent to the other member in the session.
4. After receiving the DetachSession signal, the AllJoyn router
on the session host determines that it is the only member
left in the session. As a result, it concludes that the session
has ended and clears sessionId details from its session tables.
5. The AllJoyn router on the consumer side clears sessionId
details from its session tables and sends a successful
LeaveSession response to the application.
6. The AllJoyn router on the session host sends a SessionLost
signal to the application indicating that the session has ended.

### Consumer leaves a multi-point session

The following figure captures the message flow for the scenario
where a consumer leaves a multi-point session with more
than two participants.
In this scenario, the session continues with remaining
participants even after a member leaves the session.
The remaining participants update their session tables to
remove the member that left the session.

![consumer-leaves-multipoint-session][consumer-leaves-multipoint-session]

**Figure:** AllJoyn session - consumer leaves a multi-point session

The message flow steps are described below.

1. Two consumer apps (joiner 1 and joiner 2) have joined in
a single multi-point session with the provider.
2. Joiner 2 decides to leave the session. It invokes a
LeaveSession API with the AllJoyn router, specifying the sessionId.
3. The AllJoyn router on joiner 2 generates a DetachSession
signal, specifying the sessionId and the member that is
leaving the session. This signal is sent as a session broadcast
signal to all the other members in the session.
4. Upon receiving the DetachSession signal, the AllJoyn router
involved in the multi-point session determines that there
are two or more remaining participants in the session,
meaning the session will continue to exist. As a result,
it updates its session tables to remove the member received
in the DetachSession signal for that sessionId. The AllJoyn
router then sends an `MPSessionChanged` signal to the app
indicating member deletion for that session. This logic is
executed by the AllJoyn router for every remaining participant
in the session.
5. The AllJoyn router on the member leaving the session clears
sessionId details from its session tables and sends a successful
LeaveSession response to the application.

### Provider leaves a multi-point session

The following figure captures the message flow for the scenario
where a provider (session host) leaves a multi-point session
with more than two participants. In this case, the session
continues to exist and the remaining participants can continue
to communicate; however, no new participants can join the multi-point session.

![provider-leaves-multipoint-session][provider-leaves-multipoint-session]

**Figure:** AllJoyn session - provider leaves a multi-point session

### Provider unbinds a session port

The provider app can unbind a previously bound session port
at any time. As a result, no new sessions can be established
on that session port. Any existing sessions on that session
port will continue and are not impacted. If there was any multi-point
session on that session port, no new members can be added to
that multi-point session.

## Session options

The following tables capture the session options and values supported
for the AllJoyn session. Traffic, proximity, and transports
fields in the session option are specified as bit masks with values.

| Option       | Description                                                     | Data type |
|--------------|-----------------------------------------------------------------|-----------|
| traffic      | Specifies type of traffic sent over the session                 | byte      |
| isMultipoint | Specifies whether the session is multi-point or point-to-point. | bool      |
| proximity    | Specifies the proximity scope for this session                  | byte      |
| transports   | Specifies the allowed transports for this Session               | short     |
| nameTransfer | Name transfer type of session - Internal use only               | byte      |

### Traffic session allowed values

| Name                   | Value | Description |
|------------------------|:-----:|----------------------------------------------------------------------------------|
| TRAFFIC_MESSAGES       | 0x01  | Use reliable message-based communication to move data between session endpoints. |
| TRAFFIC_RAW_UNRELIABLE | 0x02  | Use unreliable (e.g., UDP) socket-based communication to move data between session endpoints. This creates a raw session where MESSAGE encapsulation is not used. |
| TRAFFIC_RAW_RELIABLE   | 0x04  | Use reliable (e.g., TCP) socket-based communication to move data between session endpoints. RAW. This creates a raw session where MESSAGE encapsulation is not used. |

### IsMultipoint session allowed values

| Name | Value | Description |
|---|:---:|---|
| N/A | true | A multi-point capable session. A multi-point session can be joined multiple times to form a single session with multiple (> 2) endpoints. |
| N/A | false | Session is not multi-point capable. Each join attempt will create a new point-to-point session. |

### Proximity session allowed values

**NOTE:** The PROXIMITY_PHYSICAL and PROXIMITY_NETWORK options are
not supported semantically today, meaning no enforcement is
done for spatial scope. Only bit matching is done for these
options when looking to find a set of compatible set of
session options. AllJoyn system provides flexibility to
support specific semantics for these options in future if needed.

| Name | Value | Description |
|---|:---:|---|
| PROXIMITY_ANY	| 0xFF | Spatial scope of the session is not limited. Session can be joined by joiners located anywhere. |
| PROXIMITY_PHYSICAL | 0x01 | Spatial scope of session is limited to the local host. Interpreted as "the same physical machine." Session can be joined by joiners located only on the same physical machine as the one hosting the session. |
| PROXIMITY_NETWORK | 0x02 | Spatial scope of session is limited to anywhere on the local logical network segment. Session can be joined by joiners located anywhere on the network. |

### Transports session allowed values

| Name                   |  Value   | Description |
|------------------------|:--------:|-------------|
| TRANSPORT_NONE         | `0x0000` | Use no transport to communicate with a given session. |
| TRANSPORT_LOCAL        | `0x0001` | Use only the local transport to communicate with a given session. |
| TRANSPORT_TCP          | `0x0004` | Use only the TCP transport to communicate with a given session. |
| TRANSPORT_UDP          | `0x0100` | Use only the UDP/ARDP transport to communicate with a given session. |
| TRANSPORT_EXPERIMENTAL | `0x8000` | Use only the experimental transport that has not yet reached the performance, stability or testing requirements of a commercialized transport to communicate with a given session. |
| TRANSPORT_IP           | `TRANSPORT_TCP` &#124; `TRANSPORT_UDP` | Use any IP based transport to communicate with a given session |
| TRANSPORT_ANY          | `TRANSPORT_LOCAL` &#124; `TRANSPORT_IP` | Use any commercialized transport. |

### Names sent as a part of AttachSessionWithNames

AllJoyn routers only exchange names required for establishing a session unless
specifically requested by the consumer and/or producer app. The app can request
for the routers to exchange all names by invoking the `SetAllNames` API on the
sessionOpts or by passing `exchangeAllNames=true` in the `SessionOpts` constructor.
The app may invoke the `SetSessionNames` API on the sessionOpts to reset to the
default behavior of exchanging only the required names.

#### Behavior when Session Names option is used
Point to point session: The Consumer and Provider AllJoyn routing nodes exchange
unique name and aliases of the routing node and session host/joiner app only as
a part of the `AttachSessionWithNames` method call/response.

Multipoint session: The Consumer AllJoyn routing node sends the unique name and
aliases of the routing node and session joiner app only. The Provider routing
node sends the unique names and aliases of the routing node, host and existing
members and their routing nodes. When the provider forwards an
`AttachSessionWithNames` to an existing session member, it sends out the unique
name and aliases of the joiner app and routing node.

#### Behavior when All Names option is used
Unique names of all locally and remotely connected router and leaf nodes are
exchanged as a part of the `AttachSessionWithNames` and its response.
In this case the names exchanged are identical to the ones exchanged between pre-15.04 routing nodes except that the names are exchanged as a part of `AttachSessionWithNames` instead of a separate `ExchangeNames` signal.

### Session options negotiation

A compatible set of session options must be agreed upon
between two endpoints to establish a session. If a compatible
set of session options cannot be established between two
endpoints, session establishment fails.
Session options negotiation occurs between session options
provided by the provider app at the time of invoking
`BindSessionPort(...)` and the session options requested
by the consumer app when invoking the `JoinSession(...)`.

* For certain session options, e.g., traffic, an
exact match must occur between the provider and consumer
session options for negotiation to be successful.
* For certain session options, e.g. isMultipoint, the option provided by
the producer is used.
* For other session options, the negotiation happens to the
lowest common session option level. Exact details of session
options negotiation is outside the scope of this document.

## Detecting missing or slow endpoints

The AllJoyn Router supports a probing mechanism to detect
other missing routers and missing applications so that
resources can be cleaned up for missing endpoints. Separate
logic is supported for detecting other missing routers and
applications as described in [Probing mechanism for detecting missing routers][probing-mechanism-for-detecting-missing-routers]
and [Probing mechanism for detecting missing applications][probing-mechanism-for-detecting-missing-apps].

The AllJoyn router also supports logic to detect and disconnect
any AllJoyn applications or other AllJoyn routers that are
slower to read data than the minimum desired performance level.
This logic is captured in [Detecting a slow reader][detecting-slow-reader].

Once a remote endpoint (an application or anther router) is
disconnected based on probing mechanism or slow reader detection
logic, the AllJoyn router will clean up any connection slots,
active advertisements and sessions associated with the remote
endpoint. The AllJoyn router will also send SessionLost,
`MPSessionChanged` and `DetachSession` signals to participants
that are in a session with the disconnected remote application
or in a session with applications connected to the disconnected
remote router.

### Probing mechanism for detecting missing routers

The AllJoyn router provides a `SetLinkTimeout()` API which
can be invoked by the application to detect missing routers.
The application provides an idle timeout value as part of the
API, which should be greater than or equal to the minimum value
(40 sec) defined at the router. A single probe is sent to the
other router after inactivity is detected for idle timeout period.
If no response is received in probe timeout period (10 sec), that
router is disconnected and all associated connection slots,
active advertisements and sessions are cleaned up.

This functionality to detect missing routers is not enabled
by default. An app needs to call the `SetLinkTimeout()` API
to enable it.

### Probing mechanism for detecting missing applications

The AllJoyn router provides a probing mechanism using DBus
pings to detect missing AllJoyn applications. The following
parameters determine the transmission schedule of the DBus pings:
* Number of probes(N): Total number of DBus pings sent.
* Idle timeout(I): Time after which the first DBus ping will be sent.
* Probe timeout(P): Time after which subsequent DBus ping
will be sent if a reply to the previous ping has not yet been received.

The values of the above parameters are specific to the AllJoyn TCP versus
UDP Transport over which the AllJoyn application is connected
to the AllJoyn router.

The following figure shows the transmission schedule of the DBus pings.

![probe-transmission-schedule-for-detecting-missing-apps][probe-transmission-schedule-for-detecting-missing-apps]

**Figure:** Probe transmission schedule for detecting missing apps

Connected AllJoyn applications will be able to select values
for idle and probe timeouts within a transport specific range
by invoking the `SetIdleTimeouts()` API. The call specifies
the requested idle and probe timeouts and returns the actual
values for the idle and probe timeouts.

### Detecting a slow reader

In order to maintain quality of service, the AllJoyn router
will disconnect any AllJoyn applications or AllJoyn routers
that are slower than the minimum desired performance level.

The AllJoyn router will disconnect a remote AllJoyn application/router
in either of the following scenarios:
* Once the network send buffer on the router and network
receive buffer on remote application/router are both full,
the remote application/router does not read data fast enough
to be able to fit the pending AllJoyn message within the
Send Timeout period.
* More than (10 * Send timeout) control messages originating
from the router are currently queued for the remote application/router.

The value of the Send timeout is specific to the TCP or UDP
transport over which the remote AllJoyn application/router is
connected to this AllJoyn router.

## Methods/signals used for an AllJoyn session

The AllJoyn framework supports session-related functionality
as part of the following AllJoyn interfaces:

* org.alljoyn.Daemon
* org.alljoyn.Bus
* org.alljony.Bus.Peer.Session

This section provides a summary of methods and signals from
these interfaces used for AllJoyn session-related functionality.

### org.alljoyn.Daemon

The org.alljoyn.Daemon interface is the main over-the-wire
interface used for communication between two AllJoyn router
components. The following tables summarize the org.alljoyn.Daemon
interface methods and signals used for session-related functions.

#### org.alljoyn.Daemon interface methods

| Method name | Description |
|---|---|
| AttachSession	| Method for a remote AllJoyn router to attach a session with this AllJoyn router. |
| GetSessionInfo | Method for a remote AllJoyn router to get session information from this AllJoyn router. |

#### org.alljoyn.Daemon.AttachSession method parameters

| Parameter name | Direction | Description |
|---|---|---|
| session port | in | AllJoyn session port |
| Joiner | in | Unique name of the joiner |
| creator | in | Unique name or well-known name of the session host |
| dest | in | <p>Unique name of the destination for the AttachSession.</p><ul><li>For point-to-point session, this is same as creator.</li><li>For multi-point session, this field can be different than the creator.</li></ul> |
| b2b | in | Unique name of the bus-to-bus end point on the joiner side. This is used to set up the message routing path for the session. |
| busAddr | in | A string indicating how to connect to the bus endpoint, for example, "tcp:192.23.5.6, port=2345" |
| optsIn | in | Session options requested by the joiner. |
| status | out | Session join status |
| sessionId | out | Assigned session ID |
| optsOut | out | Final selected session options |
| members | out | List of session members |

#### org.alljoyn.Daemon.AttachSessionWithNames method parameters

| Parameter name | Direction | Description |
|---|---|---|
| session port | in | AllJoyn session port |
| Joiner | in | Unique name of the joiner |
| creator | in | Unique name or well-known name of the session host |
| dest | in | <p>Unique name of the destination for the AttachSession.</p><ul><li>For point-to-point session, this is same as creator.</li><li>For multi-point session, this field can be different than the creator.</li></ul> |
| b2b | in | Unique name of the bus-to-bus end point on the joiner side. This is used to set up the message routing path for the session. |
| busAddr | in | A string indicating how to connect to the bus endpoint, for example, "tcp:192.23.5.6, port=2345" |
| optsIn | in | Session options requested by the joiner. |
| names | in | List of unique and well known names |
| status | out | Session join status |
| sessionId | out | Assigned session ID |
| optsOut | out | Final selected session options |
| members | out | List of session members |
| names | out | List of unique and well known names |

#### org.alljoyn.Daemon.GetSessionInfo method parameters

| Parameter name | Direction | Description |
|---|---|---|
| creator | in | Unique name for the app that bound the session port. |
| session port | in | Session port. |
| optsIn | in | Session options requested by the joiner. |
| busAddr | out | Returned bus address for the session to use when attempting to create a connection for joining the session, for example, "tcp:192.23.5.6, port=2345" |

#### org.alljoyn.Daemon interface signals

| Signal name | Description |
|---|---|
| ExchangeNames | A signal that informs remote AllJoyn router of names available on the local AllJoyn router. |
| DetachSession | A signal sent out to detach a joiner from an existing session |

#### org.alljoyn.Daemon.ExchangeNames signal parameters

| Parameter name | Description |
|---|---|
| uniqueName | List of one or more unique names available on the local AllJoyn router. |
| WKNs | List of one or more well-known names registered with each of the known unique name on the local AllJoyn router. |

#### org.alljoyn.Daemon.DetachSession signal parameters

| Parameter name | Description |
|---|---|
| sessionId | AllJoyn session ID |
| Joiner | Unique name of the joiner |

### org.alljoyn.Bus

The org.alljoyn.Bus interface is the main AllJoyn interface
between the application and the AllJoyn router. The following
tables summarize the org.alljoyn.Bus interface methods and
signals used for session-related functions.

#### org.alljoyn.Bus interface methods

| Method name | Description |
|---|---|
| BusHello | Method used to exchange identifiers. This can be used between app and AllJoyn router, as well as between two AllJoyn router components. |
| BindSessionPort | Method for an application to initiate binding a session port with the AllJoyn bus. |
| UnbindSessionPort | Method for an application to unbind a session port with the AllJoyn bus. |
| JoinSession | Method for an application to initiate joining a session. |
| LeaveSession | Method for an application to initiate leaving an existing session. |

#### org.alljoyn.Bus.BusHello method parameters

| Parameter name | Direction | Description |
|---|---|---|
| GUIDC | in | GUID of the client AllJoyn router. |
| protoVerC | in | AllJoyn protocol version of client AllJoyn router. |
| GUIDS | out | GUID of the service side AllJoyn router. |
| uniqueName | out | Unique name assigned to the bus-to-bus endpoint between two AllJoyn router components. |
| protoVerS | out | AllJoyn protocol version of service side of AllJoyn router. |

#### org.alljoyn.Bus.BindSessionPort method parameters

| Parameter name | Direction | Description |
|---|---|---|
| sessionPort | in | Specified session port. Set to SESSION_PORT_ANY if app is asking AllJoyn router to assign a session port. |
| opts | in | Specified session options. |
| resultCode | out | Result status |
| sessionPort | out | Same as input sessionPort unless SESSION_PORT_ANY was specified. In the latter case, set to an AllJoyn router-assigned session port. |

#### org.alljoyn.Bus.UnbindSessionPort method parameters

| Parameter name | Direction | Description |
|---|---|---|
| sessionPort | in | Specified session port. |
| resultCode | out | Result status |

#### org.alljoyn.Bus.JoinSession method parameters

| Parameter name | Direction | Description |
|---|---|---|
| sessionHost | in | Well-known name/unique name of the session creator. |
| sessionPort | in | Specified session port. |
| optsIn | in | Session options requested by the joiner. |
| resultCode | out | Result status |
| sessionId | out | Assigned session ID. |
| opts | out | Final selected session options. |

#### org.alljoyn.Bus.LeaveSession method parameters

| Parameter name | Direction | Description |
|---|---|---|
| sessionId | in | Session ID of the session. |
| resultCode | out | Result status |

#### org.alljoyn.Bus interface signals

| Signal name | Description |
|---|---|
| SessionLost | A signal that informs application when a session ends. |
| MPSessionChanged | A signal that informs application on changes to an existing session. |

#### org.alljoyn.Bus.SessionLost signal parameters

| Parameter name | Description |
|---|---|
| sessionId | Session ID of the session that was just lost. |

#### org.alljoyn.Bus.MPSessionChanged signal parameters

| Parameter name | Description |
|---|---|
| sessionId | Session ID that changed. |
| name | Unique name of the session member that changed. |
| isAdd | Flag indicating whether member was added. Set to true if the member has been added. |

### org.alljoyn.Bus.Peer.Session

The org.alljoyn.Bus.Peer.Session interface is an AllJoyn
interface between application and the AllJoyn router. The
following tables summarize the org.alljoyn.Bus.Peer.Session
interface methods and signals used for session-related functions.

#### org.alljoyn.Bus.Peer.Session interface methods

| Method name | Description |
|---|---|
| AcceptSession	| Method for invoking accepting a session locally on the session host. |

#### org.alljoyn.Bus.Peer.Session.AcceptSession parameters

| Parameter name | Direction | Description |
|---|---|---|
| sessionPort | in | Session port that received the join request. |
| sessionId | in | ID for the new session (if accepted). |
| creatorName | in | Session creator unique name. |
| joinerName | in | Session joiner unique name. |
| opts | in | Session options requested by the joiner. |
| isAccepted | out | Set to true if the creator accepts the session. |


#### org.alljoyn.Bus.Peer.Session interface signals

| Signal name | Description |
|---|---|
| SessionJoined | A signal sent locally on the session host to inform it that a session was successfully joined. |

#### org.alljoyn.Bus.Peer.SessionJoined signal parameters

| Parameter name | Description |
|---|---|
| sessionPort | Session port of the session which was just lost. |
| sessionId | ID for the new session. |
| creatorName | Session creator unique name. |
| joinerName | Session joiner unique name. |



[list-of-subjects]: /learn/core/system-description/
[establish-multi-point-session]: #establish-a-multi-point-session
[probing-mechanism-for-detecting-missing-routers]: #probing-mechanism-for-detecting-missing-routers
[probing-mechanism-for-detecting-missing-apps]: #probing-mechanism-for-detecting-missing-applications
[detecting-slow-reader]: #detecting-a-slow-reader
[session-options-negotiation]: #session-options-negotiation
[names-sent-as-a-part-of-attachsessionwithnames]: #names-sent-as-a-part-of-attachsessionwithnames
[pre-15-04-point-to-point-session-establishment]:#pre-15-04-point-to-point-session-establishment

[alljoyn-session-establishment-arch]: /files/learn/system-desc/alljoyn-session-establishment-arch.png
[p2p-multipoint-session-examples]: /files/learn/system-desc/p2p-multipoint-session-examples.png
[establishing-p2p-session]: /files/learn/system-desc/establishing-p2p-session.png
[establishing-p2p-session-1504]: /files/learn/system-desc/establishing-p2p-session-post-1504.png
[establishing-multipoint-session]: /files/learn/system-desc/establishing-multipoint-session.png
[consumer-joins-multipoint-session]: /files/learn/system-desc/consumer-joins-multipoint-session.png
[consumer-joins-multipoint-session-post-1504]: /files/learn/system-desc/consumer-joins-multipoint-session-post-1504.png
[consumer-leaves-p2p-session]: /files/learn/system-desc/consumer-leaves-p2p-session.png
[consumer-leaves-multipoint-session]: /files/learn/system-desc/consumer-leaves-multipoint-session.png
[provider-leaves-multipoint-session]: /files/learn/system-desc/provider-leaves-multipoint-session.png
[incompatible-session-options]: /files/learn/system-desc/incompatible-session-options.png
[probe-transmission-schedule-for-detecting-missing-apps]: /files/learn/system-desc/probe-transmission-schedule-for-detecting-missing-apps.png
