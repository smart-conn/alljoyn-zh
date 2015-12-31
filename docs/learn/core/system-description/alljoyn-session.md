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
，作为加入会话命令的回应。使用方应用程序也会建立存储会话细节的会话地图。



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

下图描述了一个点对点 AllJoyn 会话建立的信息流，生产方或使用方之一是14.12或更早的版本。
The following figure captures the AllJoyn session establishment
message flow for a point-to-point session when either the producer or consumer
is version 14.12 or earlier.

![establishing-p2p-session][establishing-p2p-session]

**Figure:** AllJoyn 点对点会话建立 - 14.12版本或更早

下面是生产方或使用方之一是14.12或更早的版本情况下的信息流。

1. 提供方与使用方都通过 AllJoyn 核心库连接到各自的 AllJoyn 路由上，并获取被分配的唯一标识。
2. 提供方应用程序向 AllJoyn 核心库注册服务的总线对象。
3. 提供方应用程序通过 AllJoyn 核心库向 AllJoyn 路由请求一个 well-known name.
4. 提供方应用程序通过 AllJoyn 库的 `BindSessionPort` API 将会话端口捆绑。此命令为会话指定一个会话号，会话选项以及一个 SessionPortListener.

5. 使用方应用程序使用 AllJoyn 的推广与发现机制来发现提供方应用程序。
6. 使用方应用程序通过 `JoinSession` API 来初始化加入到提供方的会话。命令叫指定一个会话主机的唯一识别符，会话端口，偏好的会话选项以及一个
SessionListener.
7. 使用方的 AllJoyn 路由建立一个到供应方 AllJoyn 路由的物理信道（如果可用）。在 TCP 传输时，这将包括在两个 AllJoyn 路由之间建立一个 TCP 连
接。在 UDP 传输时，无需建立物理信道。
8. 两个 AllJoyn 总线之间的连接建立之后，使用方的 AllJoyn 路由会初始化一个 `BusHello` 消息，以发送他的总线 GUID 和 AllJoyn 协议版本。提供方
应用程序会回应此消息，并附带自己的 GUID 和 AllJoyn 协议版本，以及唯一识别符。在 `BusHello` 阶段时收到的由路由节点发送的协议版本信息被用来判
断是早于15.04版本的通话流程正在被使用还是晚于15.04版本的通话流程正在被使用。
9. 使用方和提供方的 AllJoyn 路由发送 `ExchangeNames` 信号，交换已知的独立识别符和 well-known names.
10. 使用方 AllJoyn 路由调用在提供者路由上的 `AttachSession` 来加入会话。此调用会指定会话主机的端口号，端口选项，独立识别符/ well-known names 以及其他的参数。
11. 如果会话选项可用，提供方 AllJoyn 路由调用 `AcceptSession` 方法，如果会话被接受，提供方应用程序将返回一个 'true '.更多关于会话选项适用性
的细节请参阅 [Session options negotiation][session-options-negotiation].
12. 在会话选项不可用，或是提供方应用程序没有接受该会话时，系统将发出一合适的错误代码。如果会话被接受，提供方的 AllJoyn 路由器会为此会话提供
一个唯一标识符作为 sessionId，并发送一个提示成功的回应。他将 `AttachSession` 消息发送给使用方 AllJoyn 路由，以提供结果以及 sessionID (若可以使用)
13. 提供方 AllJoyn 路由向提供方应用程序发送一个 SessionJoined 信号，指定了sessionaID.
14. 在接收到 `AttachSession` 回应之后，使用者的 AllJoyn 路由发出一个 JoinSession 回应消息，带有 OK status 以及会话的 ID.

### 15.04版本后 点对点会话的建立

下图展示了 AllJoyn 会话建立的信息流，此会话是点对点的，提供方和使用方的版本都是15.04或更新。

![establishing-p2p-session-1504][establishing-p2p-session-1504]

**Figure:** AllJoyn 建立点对点对话 - 15.04 或更晚。


下面是使用者和提供者都是15.04或以后版本时的信息流：

1. 直到 `BusHello`阶段，之前的流程与 [Pre-15.04 Point to Point Session establishment][pre-15-04-point-to-point-session-establishment] 中所
描述的一样。在 `BusHello` 阶段时收到的由路由节点发送的协议版本信息被用来判断是早于15.04版本的通话流程正在被使用还是晚于15.04版本的通话流程正在被使用。

2. 使用方的 AllJoyn 路由调用位于提供方 AllJoyn 路由的  `AttachSessionWithNames` 方法以加入会话。此命令指定会话端口，会话选项，以及会话主机
的唯一识别符/ well-known name. 作为这个方法的一部分使用方 AllJoyn 路由同时也发出建立会话所需的标识符们。如果被使用者或提供者的应用程序所请
求，他可以发送出所有标识符。
 参考： [Names sent as a part of AttachSessionWithNames][names-sent-as-a-part-of-attachsessionwithnames] 

3. 如果会话选项是兼容的，提供方 AllJoyn 路由调用 `AcceptSession` 方法，如果会话被接受了，提供方应用程序会返回 'true'，更多信息请参阅
[Session options negotiation][session-options-negotiation] 

4. 在不兼容的会话选择中，或者，假如会话没能被提供方应用程序所接受，会有一个适当的错误代码被送回。如果会话被接受了，提供方的 AllJoyn 路由为
会话生成一个唯一的 sessionID. 他将送回一个 `AttachSessionWithNames` 回复消息到使用方 AllJoyn 路由，提供结果和 sessionID（如果可用）。提供方
AllJoyn 路由也会发出建立会话所需的标识符，作为回应的一部分。如果他已经被使用方或提供方应用程序请求，他可能会发送所有的标识符。具体细节请参阅 [Names sent as a part of AttachSessionWithNames][names-sent-as-a-part-of-attachsessionwithnames].
5. 提供方 AllJoyn 路由向提供方应用程序发送一个指明 sessionID 的 SessionJoined 信号。
6. 在收到 `AttachSessionWithNames` 回应后，使用方的 AllJoyn 路由向应用程序发送一个带有 OK status 和会话 ID 的 JoinSession 回复。

## 多方会话的建立

下列用例说明了多种 AllJoyn 会话场景:

*  建立一个多方的会话
*  使用方加入现存的多方会话
*  使用方离开一个点对点的会话
*  使用方离开一个多于两个参与者的多方会话
*  提供方解绑一个会话端口

### 建立一个多方会话

下图解释了在两个参与者之间的多方会话建立时的信息流

![establishing-multipoint-session][establishing-multipoint-session]

**Figure:** AllJoyn 会话 - 建立一个多方会话

多方会话与点对点会话建立的信息流是一致的。只是多出了由 AllJoyn 路由发送给应用程序指示新参与者的 `MPSessionChanged` 信号。此信号指明
sessionID, 参与者的唯一识别符/ well-known name 以及指示参与者是否被添加的标志位。

### 使用方加入现存的多方会话
下图展示了新使用方加入现存的多方会话场景的信息流

在多方会话中，新加入者（并不是会话主机）负责提醒现存的参与者有新成员加入会话。这样一来，现存的成员就可以更新自己的会话路由信息，将新成员加入其中，未来的会话消息即可被正确传送。新成员调用 `AttachSession` 来实现这一行为。该调用将导致现存成员将新成员添加到他们的会话相关表中。

#### 使用者加入一个现存的点对点会话 - 15.04及以前版本的呼叫流程

![consumer-joins-multipoint-session][consumer-joins-multipoint-session]

**Figure:** AllJoyn 会话 - 使用者加入多方会话 - 14.12版本或更早

信息流如下所述
[Establish a multi-point session][establish-multi-point-session]
1. 提供方与使用方的应用程序被安装，使用方使用 AllJoyn 发现与推广机制来发现生产方应用程序。
2. AllJoyn 会话的建立发生在加入者1（使用者1）以及会话主机（提供方）之间，目的是建立一个如 [Establish a multi-point session][establish-multi-point-session] 所示的多方会话
3. 使用者2（加入者2）想要加入当前的多方会话，并使用自己的 AllJoyn 路由初始化了一个 JoinSession 命令。 
4. 加入者2的 AllJoyn 路由建立了与提供方 AllJoyn 路由（如果可用）的物理信道。在 TCP 传输中，这将包括建立两 AllJoyn 路由之间的 TCP 连接。如使
用 UDP 则不需要物理层链路。
5. 一旦两个 AllJoyn 总线之间的连接建立之后，使用方的 AllJoyn 路由会初始化一个 `BusHello` 消息，以发送他的总线 GUID 和 AllJoyn 协议版本。提供方应用程序会回应此消息，并附带自己的 GUID 和 AllJoyn 协议版本，提供方 AllJoyn 路由将自己的 GUID 及 AllJoyn协议版本还有唯一
识别符发出作为回应。
6. 参与者2 和提供方路由发出 `ExchangeNames` 信号，交换已知的唯一识别符和 well-known names. 提供方 AllJoyn 路由将 `ExchangeNames` 发送到所有
连接到他的路由，包括参与者2的 AllJoyn 路由。
7. AllJoyn 会话建立的步骤发生在参与者2和会话主机之间，试图将新来的加入者添加到多人会话。 
8. 一个 `MPSessionChanged` 信号会被送到会话主机应用程序上，通知有新的成员加入会话。
9. 参与者2从会话主机那里收到了多方会话中现存成员的集合，作为 `AttachSession` 回复的一部分。
10.参与者2初始化了一个`AttachSession`，面向除了会话主机以外的每一个成员，随后将其送到会话主机。  
11. 会话主机将 `AttachSession` 发送到现存的人员处。
12. 参与者1收到来自参与者2的 `AttachSession`，更新自己的会话相关表，以添加参与者2。 
13. 参与者1上的 AllJoyn 路由向应用程序发出 `MPSessionChanged` 信号，指示有新加入成员进入多方会话。
14. 参与者2也向在会话中的成员的应用程序发送 `MPSessionChanged` 信号。

#### 使用者加入一个现存的多方会话 - 15.04及其以后版本的呼叫流程

![consumer-joins-multipoint-session-post-1504][consumer-joins-multipoint-session-post-1504]

**Figure:** AllJoyn session - 使用者加入多方会话 - 15.04 或更新

The message flow steps are described below.

1. 提供方与使用方的应用程序被安装，使用方使用 AllJoyn 发现与推广机制来发现生产方应用程序。
2. AllJoyn 会话的建立发生在加入者1（使用者1）以及会话主机（提供方）之间，目的是建立一个如 [Establish a multi-point session][establish-multi-point-session] 所示的多方会话
3. 使用者2（加入者2）想要加入当前的多方会话，并使用自己的 AllJoyn 路由初始化了一个 JoinSession 命令。 
4. AllJoyn 会话建立的步骤发生在参与者2和会话主机之间，试图将新来的加入者添加到多人会话，并交换所需要的标识符。详情请参阅
[Names sent as a part of AttachSessionWithNames][names-sent-as-a-part-of-attachsessionwithnames].
5. 一个 `MPSessionChanged` 信号会被送到会话主机应用程序上，通知有新的成员加入会话。
6. 参与者2从会话主机那里收到了多方会话中现存成员的集合，作为 `AttachSession` 回复的一部分。
7. 参与者2初始化了一个`AttachSessionWithNames`，面向除了会话主机以外的每一个成员。
8. 会话主机将此 `AttachSessionWithNames` 发送到现有的会话成员，同时将加入应用程序的唯一识别符，别名和路由节点一并发送。详情请参阅
[Names sent as a part of AttachSessionWithNames][names-sent-as-a-part-of-attachsessionwithnames].
9. 加入者1从加入者2处接收到`AttachSessionWithNames`，并更新自己的会话相关表，将加入者2添加进来，同时给会话主机的 AllJoyn 路由发送回复。
10. 会话主机的 AllJoyn 路由将此回复返还给加入者2的路由节点。
11. 加入者1上的 AllJoyn 路由向应用程序发送 `MPSessionChanged` 信号，指示有新成员加入多方会话。
12. 加入者2也向每一个在会话中的成员的应用程序发送 `MPSessionChanged` 信号。


### 使用方离开点对点会话

下图展示了使用方离开一个现存的点对点会话场景时的信息流。此信息流同样适用于使用方离开只有两个参与者的多方会话的场景。

当一参与者离开一个点对点或只有两个参与者的多方会话时，会话会终结，并从两方的会话表中被移除。通过向 AllJoyn 路由初始化一个 LeaveSession 命令，参与者可以离开会话。这将会导致 DetachSession 信号被传输到其他会话成员。此信号的接收将会触发会话列表中关于此参与者的 sessionID 以及其 他与会话相关信息的清除。不论会话何时结束，SessionLost 信号都会被发送到该应用程序。

**NOTE:** 会话主机及参与者都可以选择离开会话，会话主机离开时的信息流也是类似的。



![consumer-leaves-p2p-session][consumer-leaves-p2p-session]

**Figure:** AllJoyn 会话 - 使用方离开一个点对点会话

信息流描述如下：

1. 使用方应用程序与会话主机建立会话。
2. 使用方应用程序决定离开会话。他通过 AllJoyn 核心库对 AllJoyn 路由调用了 LeaveSession API. 此调用使用 SessionID 作为输入。
3. AllJoyn 路由生成了针对 sessionID 和正在离开的成员生成 DetachSession 信号，此信号被发送到会话中的其他成员。
4. 收到 DetachSession 信号后，会话主机上的 AllJoyn 路由判断出自己是会话上仅存的成员。因此，他推断出会话已经结束，进而将会话表上的 sessionID 细节全部清除。
5. 使用方一端的 AllJoyn 路由将自己会话表上的 sessionID 信息清除，并向应用程序发送 LeaveSession 成功的回复。 
6. 会话主机上的 AllJoyn 路由向应用程序发送 SessionLost 信号，指示会话已经结束。

### 使用方离开多方会话

下图展示了使用方离开一个多于两个参与者的多方会话场景时的信息流。
在这个场景中，即使一方离开，剩下的参与者依然继续着会话。剩下的参与者将自己的会话表更新，将离开会话的成员移除。

![consumer-leaves-multipoint-session][consumer-leaves-multipoint-session]

**Figure:** AllJoyn 会话 - 使用方离开多方会话

以下描述了信息流

1. 两个使用方应用程序（参与者1与参与者2）已经加入同一与供应方的多方会话。
2. 参与者2决定离开会话。他向 AllJoyn 路由调用了 LeaveSession API，并指明了 sessionID.
3. 参与者2上的 AllJoyn 路由生成了指明 sessionID 和成员的 DetachSession 信号。该信号被当作会话
的广播信号发送到所有会话中的其他成员。
4. 根据接收到的 DetachSession 信号， 多方会话中的 AllJoyn 路由发现会话中还剩余两个或多个参与者，会话将会继续存在。于是他会更新他的会话表，
根据 DetachSession 信号中的 sessionID 将对应的成员移除。AllJoyn 路由于是向应用程序发送一个 `MPSessionChanged` 信号，指示着会话中有成员被删
除。该逻辑由 AllJoyn 路由对会话中每一个剩余的参与者执行。
5. 离开会话成员的 AllJoyn 路由会清除自己会话表上的 sessionID 细节信息，并向应用程序发送一个 LeaveSession 成功回复。

### 提供方离开一个多方会话

下图指示了提供方（会话主机）离开一个有多于两个参与者的多方会话场景中的信息流。在这个例子中，会话仍可继续，剩余的参与者也可以互相通信；但是
没有新的参与者可以加入该多方会话。

![provider-leaves-multipoint-session][provider-leaves-multipoint-session]

**Figure:** AllJoyn 会话 - 提供方离开一个多方会话

### Provider 解绑会话端口

提供方应用程序可以在任何时间解绑之前已经绑定的会话端口。后果是，该会话端口不能再建立新的会话。任何在此会话端口上现存的会话可以继续，不会受到影响。如果该会话端口上存在多方会话的话，则没有新的成员可以被加入到这些多方会话中。

## Session 选项

下表展示了 AllJoyn 会话中的会话选项以及支持的值。在会话选项中，流量，邻域以及传送领域由带值的比特掩码声明。


| 选项         | 描述                                                            | 数据类型  |
|--------------|-----------------------------------------------------------------|-----------|
| traffic      | 指在会话中被发送的 traffic 类型                                 | byte      |
| isMultipoint | 区分会话是点对点还是多方                                        | bool      |
| proximity    | 声明此会话的邻域范围                                            | byte      |
| transports   | 声明会话中被允许使用的传输方式                                  | short     |
| nameTransfer | 声明会话中识别符转换的类型 - 仅限内部使用                       | byte      |

### 会话中的 traffic 值

| 名称                   |  值   |   描述   |
|------------------------|:-----:|----------------------------------------------------------------------------------|
| TRAFFIC_MESSAGES       | 0x01  | 使用可靠的基于消息的通信在会话的端点之间传送数据|
| TRAFFIC_RAW_UNRELIABLE | 0x02  | 使用不可靠的（例如 UDP）基于套接字的通信在两个会话端点之间传送数据。这会创造一个不封装 MESSAGE 的原始会话 |
| TRAFFIC_RAW_RELIABLE   | 0x04  | 使用可靠的（例如TCP）基于套接字的通信在两个会话端点之间传送数据。这会创造一个不封装 MESSAGE 的原始会话 |

### 会话中的 IsMultipoint 值

| 名称 | 值 | 描述 |
|---|:---:|---|
| N/A | true  | 支持多方参与的会话。多点会话可以被加入多次，形成一个有多于两个端点参与的单个对话。 |
| N/A | false | 不支持多方参与的会话。每一次加入会话的尝试将会创建一个新的点对点会话。|

### 会话中的 Proximity 值

**NOTE:** PROXIMITY_PHYSICAL 和  PROXIMITY_NETWORK 选项在现在不再被识别，也就是说不再有针对空间范围的限制。在寻找兼容的会话选项时，只通过
未匹配即可完成。如果未来有需要，AllJoyn 系统会为这些选项的特定语意提供灵活。

| 名称 | 值 | 描述 |
|---|:---:|---|
| PROXIMITY_ANY	| 0xFF | 会话没有空间范围限制。 会话可以被在任何地点的参与者加入。|
| PROXIMITY_PHYSICAL | 0x01 | 会话空间仅限于本地主机，解释为“同一个物理机器”。只有与会话主机在相同物理机器上的参与者可以加入。|
| PROXIMITY_NETWORK | 0x02 | 会话空间限于本地逻辑网络部分。在此网络上任意位置的参与者都可以加入会话。|

### 会话中的 Transports 值

| 名称                   |  值      |    描述     |
|------------------------|:--------:|-------------|
| TRANSPORT_NONE         | `0x0000` | 不适用任何传输来与给定会话通信  |
| TRANSPORT_LOCAL        | `0x0001` | 仅使用本地传输来与给定会话通信  |
| TRANSPORT_TCP          | `0x0004` | 仅使用 TCP 传输来与给定会话通信 |
| TRANSPORT_UDP          | `0x0100` | 仅使用 UDP/ARDP 传输来与给定会话通信|
| TRANSPORT_EXPERIMENTAL | `0x8000` | 使用还未达到商用传输所要求的性能以及稳定性要求的实验形传输与给定会话通信。 |
| TRANSPORT_IP           | `TRANSPORT_TCP` &#124; `TRANSPORT_UDP` | 使用任何基于 IP 的传输来与给定会话通信。|
| TRANSPORT_ANY          | `TRANSPORT_LOCAL` &#124; `TRANSPORT_IP` | 使用任意商业化传输。 |

### 作为 AttachSessionWithNames 一部分发送的 NAME.

除非使用方和/或者 供应方应用程序有特殊请求，AllJoyn 路由仅交换建立会话所需要的识别符。应用程序可以通过调用在 sessionOpts 上的 `SetAllNames` API, 或者通过在 `SessionOpts` 构造函数中传递 `exchangeAllNames=true`来向路由申请交换所有的识别符。应用程序可以通过调用在 sessionOpts 上的
`SetSessionNames` API 来重置到仅交换所需要的识别符的默认设置。


#### Session Names 选项启用时的反应
点对点会话：使用方和提供方 AllJoyn 路由节点交换该节点，会话主机/参与方应用程序的唯一识别符和别名的行为仅仅当作 `AttachSessionWithNames` 
方法的调用/回复。

多方会话：使用方 AllJoyn 路由节点仅发送路由节点和会话参与者应用程序的唯一识别符和别名。提供方路由节点发送该路由点，主机和现存成员，以及他们的路有点的唯一识别符和别名。当提供方发送 `AttachSessionWithNames`到一个现存的会话成员时，他会发送出该参与者应用程序和路有点的唯一识别符和别
名。


#### All Names 选项启用时的反应`AttachSessionWithNames`

所有本地和远端连接的路由和叶子节点的唯一识别符都会被交换，作为 `AttachSessionWithNames` 和其相应的一部分。在这种情况中的识别符交换与在15.04
之前版本中路由节点之间的识别符交换大致相同，唯一的区别是识别符交换不再是分开的 `ExchangeNames` 信号，而是 `AttachSessionWithNames` 的一部分。

### Session 选项协商

两个端点之间必须存在相兼容的会话选项集合，会话才能建立。如果相兼容的会话选项集合没能在两端点之间被建立，会话建立会失败。
会话选项协商发生在由提供方应用程序通过调用 `BindSessionPort(...)` 所提供的会话选项，以及使用方应用程序调用 `JoinSession(...)` 时请求的会话选项之间。
求的会话选项。


* 对于给定的会话选项，例如，traffic，提供方和使用方的会话选项必须精确吻合，协商才能成功。
* 对于给定的会话选项，例如 isMultipoint，提供方提供的选项被使用。
* 对于其他会话选项，协商会发生在最低的通用会话选项级别。更详尽的会话选项协商机制不在本文档的描述范围内。

## 探测丢失或速度慢的端点
AllJoyn 路由支持用于探测其他丢失的路由以及应用程序的探测机制，因此分配给丢失端点的资源可以被清除。对于探测其他丢失的路由和应用程序，使用了
不同的逻辑，请参见[Probing mechanism for detecting missing routers][probing-mechanism-for-detecting-missing-routers]
以及 [Probing mechanism for detecting missing applications][probing-mechanism-for-detecting-missing-apps].

AllJoyn 路由也支持用于探测并断开任意读取数据速度低于最小性能需求限制的 AllJoyn 应用程序或者路由的逻辑。该逻辑在 [Detecting a slow reader][detecting-slow-reader] 中有描述。

一旦一个远端节点（应用程序或者另一个路由）根据探测机制或者根据读取速度慢探测逻辑被断开， AllJoyn 路由会将与之相关的所有连接点，动态的推广以
及会话全部清除。AllJoyn 路由同时也会发送 SessionLost, `MPSessionChanged` 以及 `DetachSession` 信号，通知与被断开应用程序同在一个对话中的参
与者，或是连接到被断开路由的应用程序。


### 用于探测丢失路由的探测机制

AllJoyn 提供了 `SetLinkTimeout()` API, 可被应用程序调用，用于探测丢失的路由。该应用程序提供了一个大于等于路由器定义的最小值(40 sec)的空闲超时值，作为 API 的一部分。当有超过空闲超时值周期的静止被探测到时，一个单独的探针会被送到其他路由。如果在探针超时周期（10 sec）内
没有收到回复，该路由将被断开，与其相关的连接位，动态推广以及会话也会被清除。

该探测路由的功能不是默认开启的。若要开启应用程序需要调用  `SetLinkTimeout()` API.


### 用于探测丢失应用程序的探测机制

AllJoyn 路由提供一个使用 D-Bus pings 功能的用于探测丢失的 AllJoyn 应用程序的探针机制。下列参数决定了D-Bus pings 的传输方案：

* 探针数量(N): DBus pings 被发送的总数。
* 空闲超时(I): 第一个 DBus ping 被发送之前的等待时间。 
* 探针超时(P): 前面发送的 ping 没有回应的情况下，下一个DBus ping 被发送前的等待时间。 

以上参数的值是针对 AllJoy TCP 相对于 UDP 在连接到 AllJoyn 路由上的应用程序上传输设定的。

下图展示了 DBus pings 的传输方案。
![probe-transmission-schedule-for-detecting-missing-apps][probe-transmission-schedule-for-detecting-missing-apps]

**Figure:** 用于探测丢失应用程序的探针传输方案

通过调用 `SetIdleTimeouts()` API , 已连接的 AllJoyn 应用程序可以在一个运输专用的范围内选择空闲超时和探针超时的值。该调用声明了所请求的空闲
以及探针超时值，并将实际的空闲以及探针超时值返回。

### 探测一个读取速度慢的应用程序

为了保持服务质量，AllJoyn 路由会将任何读取速度低于最小性能所需值的 AllJoyn 路由或者应用程序断开。

在下面任一种场景中，AllJoyn 路由会断开一个远端的 AllJoyn 应用程序/路由：

* 每当路由端的网络发送缓存以及远端应用程序/路由端的网络接受缓存同时被占满，远端应用程序/路由端的读取速度在 Send Timeout 周期内不能应付即将发生的 AllJoyn 消息时。
* 在路由端排队等待发送给远端应用程序/路由端的控制消息多于（10 * Send timeout）个。

Send timeout 的值是针对远端应用程序/路由端连接到 AllJoyn 路由的连接方式（TCP 或是 UDP）而设定的。 

## AllJoyn 会话中所用的方法/信号

AllJoyn 框架支持作为下列 AllJoyn 接口一部分的会话关联的功能：

* org.alljoyn.Daemon
* org.alljoyn.Bus
* org.alljony.Bus.Peer.Session

此章节将为 AllJoyn 会话关联的功能中的方法和信号做出总结。

### org.alljoyn.Daemon

org.alljoyn.Daemon 接口是用于两个 AllJoyn 路由组建之间通信的主要 over-the-wire 接口。下列表格列出了该接口被用于会话关联的功能的方法和信号： 
#### org.alljoyn.Daemon 接口的方法

| 方法名 | 描述 |
|---|---|
| AttachSession	| 针对远端 AllJoyn 路由的方法，可以将一个会话附加到此路由上。|
| GetSessionInfo | 针对远端 AllJoyn 路由的方法，可以获取此路由的会话信息。 |

#### org.alljoyn.Daemon.AttachSession 方法参数

| 参数名 | 方向 | 描述 |
|---|---|---|
| session port | in | AllJoyn 会话端口 |
| Joiner | in | 参与者的唯一标识符 |
| creator | in | 会话主机的唯一标识符或者 well-known names |
| dest | in | <p>AttachSession 目的地的唯一标识符.</p><ul><li>对于点对点会话，此项与 creator 相同</li><li>对于多方会话，此项可能与 creator 有区别</li></ul> |
| b2b | in | 参与者一方总线对总线端点的唯一标识符，用于建立会话的消息路由路径 |
| busAddr | in | 指示如何连接到总线端点的字符串，例如 "tcp:192.23.5.6, port=2345" |
| optsIn | in | 参与者请求的会话选项 |
| status | out | 会话参与状态 |
| sessionId | out | 被分配的会话 ID |
| optsOut | out | 最终会话选项 |
| members | out | 会话成员列表 |

#### org.alljoyn.Daemon.AttachSessionWithNames 方法参数

| 参数名 | 方向 | 描述 |
|---|---|---|
| session port | in | AllJoyn 会话端口 |
| Joiner | in | 参与者的唯一标识符 |
| creator | in | 会话主机的唯一标识符或者 well-known names |
| dest | in | <p>AttachSession 目的地的唯一标识符.</p><ul><li>对于点对点会话，此项与 creator 相同</li><li>对于多方会话，此项可能与 creator 有区别</li></ul> |
| b2b | in | 参与者一方总线对总线端点的唯一标识符，用于建立会话的消息路由路径 |
| busAddr | in | 指示如何连接到总线端点的字符串，例如 "tcp:192.23.5.6, port=2345" |
| optsIn | in | 参与者请求的会话选项 |
| names | in | 唯一标识符与 well-known names 的列表 |
| status | out | 会话参与状态 |
| sessionId | out | 被分配的会话 ID |
| optsOut | out | 最终会话选项 |
| members | out | 会话成员列表 |
| names | out | 唯一标识符与 well-known names 的列表 |

#### org.alljoyn.Daemon.GetSessionInfo 方法参数

| 参数名 | 方向 | 描述 |
|---|---|---|
| creator | in | 绑定会话端口的应用程序的唯一识别符 |
| session port | in | 会话端口 |
| optsIn | in | 参与者请求的会话选项 |
| busAddr | out | 试图创建加入会话的连接时返回的供会话使用的总线地址，例如 "tcp:192.23.5.6, port=2345" |

#### org.alljoyn.Daemon 接口信号

| 信号名 | 描述 |
|---|---|
| ExchangeNames | 用于通知远端 AllJoyn 路由本地 AllJoyn 路由可用的识别符的信号 |
| DetachSession | 使参与者离开现存会话的信号 |

#### org.alljoyn.Daemon.ExchangeNames 信号参数

| 参数名 | 描述 |
|---|---|
| uniqueName | 包含一个或多个在本地 AllJoyn 路由上可用的唯一识别符的列表 |
| WKNs | 包含一个或多个对应注册到本地 AllJoyn 路由上唯一识别符的 well-known names |

#### org.alljoyn.Daemon.DetachSession 信号参数

| 参数名 | 描述 |
|---|---|
| sessionId | AllJoyn 会话 ID |
| Joiner | 参与者的唯一标识符 |

### org.alljoyn.Bus

org.alljoyn.Bus 接口是位于应用程序和 AllJoyn 路由之间的主要接口。下表总结了该接口中用于会话相关功能的方法与信号。

#### org.alljoyn.Bus 接口方法

| 方法名 | 描述 |
|---|---|
| BusHello | 用于交换标识符的方法。可被用于应用程序和 AllJoyn 路由之间，也可被用于两个 AllJoyn 路由组建之间。 |
| BindSessionPort | 应用程序用来初始化将会话端口绑定到 AllJoyn 总线的方法 |
| UnbindSessionPort | 应用程序用来将会话端口与 AllJoyn 总线解除绑定的方法 |
| JoinSession | 应用程序用来初始化加入一个会话的方法 |
| LeaveSession | 应用程序用来初始化离开一个现存会话的方法 |

#### org.alljoyn.Bus.BusHello 方法参数

| 参数名 | 方向 | 描述 |
|---|---|---|
| GUIDC | in | 客户端 AllJoyn 路由的 GUID |
| protoVerC | in | 客户端 AllJoyn 路由的 AllJoyn 协议版本 |
| GUIDS | out | 服务端 AllJoyn 路由的 GUID |
| uniqueName | out | 两 AllJoyn 路由组建之间总线对总线端点的唯一标识符 |
| protoVerS | out | 服务端 AllJoyn 路由的 AllJoyn 协议版本 |

#### org.alljoyn.Bus.BindSessionPort 方法参数

| 参数名 | 方向 | 描述 |
|---|---|---|
| sessionPort | in | 指定的会话端口。如果应用程序向 AllJoyn 路由申请分配一个会话端口，则设置为 SESSION_PORT_ANY |
| opts | in | 指定的会话选项 |
| resultCode | out | 结果状态 |
| sessionPort | out | 与输入的 sessionPort 相同，除非 SESSION_PORT_ANY 之前被指定。如被指定，则将此参数设定为一个由 AllJoyn 路由分配的会话 端口。|

#### org.alljoyn.Bus.UnbindSessionPort 方法参数

| 参数名 | 方向 | 描述 |
|---|---|---|
| sessionPort | in | 指定的会话端口 |
| opts | in | 指定的会话选项 |

#### org.alljoyn.Bus.JoinSession 方法参数

| 参数名 | 方向 | 描述 |
|---|---|---|
| sessionHost | in | 会话创建者的唯一识别符/ well-known name |
| sessionPort | in | 给定的会话端口 |
| optsIn | in | 参与方请求的会话选项 |
| resultCode | out | 结果状态 |
| sessionId | out | 被分配的会话 ID |
| opts | out | 最终选择的会话选项 |

#### org.alljoyn.Bus.LeaveSession 方法参数

| 参数名 | 方向 | 描述 |
|---|---|---|
| sessionId | in | 会话的会话 ID |
| resultCode | out | 结果状态 |

#### org.alljoyn.Bus 接口信号

| 信号名 | 描述 |
|---|---|
| SessionLost | 在会话结束时用来通知应用程序的信号 |
| MPSessionChanged | 在现存会话发生变化时用来通知应用程序的信号 |

#### org.alljoyn.Bus.SessionLost 信号参数

| 参数名 | 描述 |
|---|---|
| sessionId |刚刚丢失的会话的会话 ID |

#### org.alljoyn.Bus.MPSessionChanged 信号参数

| 参数名 | 描述 |
|---|---|
| sessionId | 改变的会话 ID |
| name | 改变的会话成员的唯一识别符 |
| isAdd | 指示成员是否被添加的标志位。如已经被添加则设置为 true |

### org.alljoyn.Bus.Peer.Session

org.alljoyn.Bus.Peer.Session 接口是用于应用程序和 AllJoyn 路由之间的 AllJoyn 接口。下表总结了该接口中用于会话相关功能的方法与信号。

#### org.alljoyn.Bus.Peer.Session 接口方法

| 方法名 | 描述 |
|---|---|
| AcceptSession	| 会话主机端用来调用接受一个会话到本地的方法 |

#### org.alljoyn.Bus.Peer.Session.AcceptSession 参数

| 参数名 | 方向 | 描述 |
|---|---|---|
| sessionPort | in | 收到加入请求的会话端口 |
| sessionId | in | 新会话的 ID （如果被接受的话） |
| creatorName | in | 会话创立者的唯一标识符 |
| joinerName | in | 会话参与者的唯一标识符 |
| opts | in | 参与者请求的会话选项|
| isAccepted | out | 如果创建者接受了此会话，则将其设置为 true |


#### org.alljoyn.Bus.Peer.Session 接口信号

| 信号名 | 描述 |
|---|---|
| SessionJoined | 在会话主机本地发送的信号，提示着会话已经被成功建立 |

#### org.alljoyn.Bus.Peer.SessionJoined 信号参数

| 参数名 | 描述 |
|---|---|
| sessionPort | 刚刚丢失的会话的会话端口 |
| sessionId | 新回话的 ID |
| creatorName | 会话创建者的唯一识别符 |
| joinerName | 会话加入者的唯一识别符 |



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
