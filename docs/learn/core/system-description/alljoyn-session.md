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
4.根据接收到的 DetachSession 信号， 多方会话中的 AllJoyn 路由发现会话中还剩余两个或多个参与者，会话将会继续存在。于是他会更新他的会话表，
根据 DetachSession 信号中的 sessionID 将对应的成员移除。AllJoyn 路由于是向应用程序发送一个 `MPSessionChanged` 信号，指示着会话中有成员被删
除。该逻辑由 AllJoyn 路由对会话中每一个剩余的参与者执行。
5. The AllJoyn router on the member leaving the session clears
sessionId details from its session tables and sends a successful
LeaveSession response to the application.离开会话成员的 AllJoyn 路由会清除自己会话表上的 sessionID 细节信息，并向应用程序发送一个 LeaveSession 成功回复。

### 提供方离开一个多方会话

下图指示了提供方（会话主机）离开一个有多于两个参与者的多方会话场景中的信息流。在这个例子中，会话仍可继续，剩余的参与者也可以互相通信；但是
没有新的参与者可以加入该多方会话。

![provider-leaves-multipoint-session][provider-leaves-multipoint-session]

**Figure:** AllJoyn 会话 - 提供方离开一个多方会话

### Provider 解绑会话端口

提供方应用程序可以在任何时间解绑之前已经绑定的会话端口。后果是，该会话端口不能再建立新的会话。任何在此会话端口上现存的会话可以继续，不会受到影响。如果该会话端口上存在多方会话的话，则没有新的成员可以被加入到这些多方会话中。

## Session 选项

下表展示了 AllJoyn 会话中的会话选项以及支持的值。在会话选项中，流量，邻域以及传送领域由带值的比特掩码声明。
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
