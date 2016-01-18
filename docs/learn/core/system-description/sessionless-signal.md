# 无会话信号

## 概览

无会话信号是一项 AllJoyn&trade; 功能，它能够在 AllJoyn 临域网络内广播信号至各个节点。这与在 [Data Exchange][data-exchange] 中描述的基于会话的信号不同，基于会话的信号通过指定会话，或者根据 sessionId/destination 的路由通过多个会话，发送至接受者。

逻辑上说，无会话信号会发送一种信号，任何在 AllJoyn 临域网络内愿意接收 的应用程序都将收到在该网络内其它应用程序发送的所有。AllJoyn 系统使用逻辑上的，因为信号本身不广播/组播，而是向网络内的所有节点通过多播发送一种指示信号。应用程序不需要连接到会话就能接受，不过，在背后运行的 AllJoyn 路由必须建立一个根据指示信号获取这些信号的会话。应用程序能够指定匹配规则（通过 AddMatch）接收一部分特定的，并且 AllJoyn 路由通过那些匹配规则筛选信号。

下图展示了一个的无会话信号在提供者和消费者两侧的高规格的结构。AllJoyn 路由支持逻辑 SLS 模块实现无会话信号逻辑。SLS 模块使用 Name Service，广播和发现使用无会话信号指定的 well-known name 的。

![sls-arch][sls-arch]

**图:** 结构

在 AllJoyn 路由启动后，SLS 模块将执行以下步骤，为发送和／或接收无会话信号做准备。

1. 建立一个实现 "org.alljoyn.sl" 接口的对象，该接口用于两个 AllJoyn 路由进行无会话信号的交换。
2. 注册信号处理程序从 "org.alljoyn.sl" 接口接收信号。
3. 绑定一个 well-know 端口号 100，支持接收获取的请求。

愿意接收 的消费者应用程序会与 AllJoyn 路由注册一套匹配规则来接收。所以，SLS 模块能够通过 Name Service （根据路由版本，可能是老版本的 Name Service 或 NGNS） 发现无会话信号提供者。

在提供者方面，应用程序向 AllJoyn 路由发送一个无会话信号。SLS 模块在本地信息缓存内保存该信号。在提供者一方的无会话信号生成一个无会话信号指定的 well-known name，并在 AllJoyn 网络内广告。

一旦发现无会话信号提供者，消费者 AllJoyn 路由与提供者 AllJoyn 路由通过专属无会话信号的 well-known 会话端口建立一个会话。会话建立完毕后，消费者 SLS 模块通过 org.alljoyn.sl 接口获取。

以下章节详细描述了提供者和消费者关于无会话信号的行为。

### 14.06 版本中针对无会话信号的改善

在 14.06 之前的版本，消费者侧 SLS 模块提供了根据 AddMatch 规则指定的筛选条件请求无会话信号的功能。消费者从所有的提供者处获取，在讲这些信号发送给有意愿接收的应用程序之前，消费者会使用 AddMatch 规则筛选这些无会话信号。

在 14.06 版本中，无会话信号的新特性允许消费者应用程序从提供者应用程序支持的特定 AllJoyn 端口请求。举例说明，某个光线控制 app 能够从提供 org.alljoyn.LightBulb 接口的提供者应用程序处获取 Annoucement。

功能实现需要以下的一些重要的无会话信号增强：

* 广播名称得到加强，在无会话信号的头部加入了 <INTERFACE> 信息。消费者通过它能够只接收从根据消费者侧匹配规则指定的 <INTERFACE> 发送的。多个无会话信号名会被广告，每个代表一个无会话信号缓存中的接口。

* AddMatch 的匹配规则定义经过扩展，加入了一个新的 'implements' 键。它可以用于表明仅接收提供特定 AllJoyn 接口的应用程序的 Annoucement，这些接口由应用程序的 Annoucemnet signal 指定。

无会话信号仅被其接口符合匹配规则的提供者所获取。提供者使用 AddMatch 匹配规则筛选信号。


## 端到端逻辑

无会话信号端到端逻辑包含以下几个方面，以下章节会进行详细解释。

* 提供者缓存信号并且广播信号的可用性。
* 消费者发现无会话信号提供者。
* 消费者从提供者处获取无会话信号。

### 提供者缓存信号并且广播其可用性

在提供者侧，应用程序向 AllJoyn 路由发送一个带有 SESSIONLESS 标志的信号。提供者中的 SLS 模块将这个信号加入其 缓存。缓存项使用（SENDER,INTERFACE,MEMBER 和 PATH）等标头字段的组合作为信号的键。

后续向 AllJoyn 路由 发送的具有相同 (SENDER, INTERFACE, MEMBER, and PATH) 标头字段的无会话信号时，新的字段会在缓存中覆盖掉已缓存的 seesionless signal。

提供者 AllJoyn 路由为无会话信号分配 change_id.change_id 用于向 AllJoyn 网络内的消费者的指示无会话信号的更新。每个 缓存项包含 (SLS signal, change_id) 元组。当新信号进入缓存时，提供者会递增 change_id，消费者会在每一次递增过后从提供者处请求信号。

应用程序可以通过调用 /org/alljoyn/Bus object 的 org.alljoyn.Bus 接口的 CancelSessionlessMessage 方法从提供者的缓存中删除一个条目。通过序列号删除条目。当提供者从其缓存中移出一个信号后，change_id 将不会递增。缓存中的内容，包括相关的 change_id，决定了提供者将广播什么。

在 AllJoyn 14.06 版本之前，SLS 模块要求和广播以下无会话信号的 well-known name：

* "org.alljoyn.sl.x<GUID>.x<change_id>"

  当:
  
  * GUID 是 AllJoyn 路由的 GUID。
  * change_id 是 缓存中最大的 change_id。

自 14.06 版本的 AllJoyn 起，SLS 模块要求和广播以下无会话信号的 well-known name：

* "org.alljoyn.sl.y<GUID>.x<change_id>"

  当:
  
  * GUID 是 AllJoyn 路由的 GUID。
  * change_id 是 SLS 缓存中的最大 change_id。
  
* "<INTERFACE>.sl.y<GUID>.x<change_id>"
  
  当:
  
  * INTERFACE 是信号 INTERFACE 标头字段的值。
  * GUID 是 AllJoyn 路由的 GUID。
  * change_id 是在 缓存中拥有相同 INTERFACE 标头文件中最大的 change_id。

   多数情况下,每一个无会话信号缓存中的 INTERFACE 标头字段值，会要求并广告一个 well-known name。

下图展示了 14.06 版本之前的提供者侧的 SLS 模块逻辑。

![provider-sls-module-logic-pre-1406][provider-sls-module-logic-pre-1406]

**图:** 提供者侧 SLS 模块逻辑（14.06 之前的版本）

下图展示了 14.06 版本的提供者侧的 SLS 模块逻辑。

![provider-sls-module-logic-1406][provider-sls-module-logic-1406]

**图:** 提供者侧 SLS 模块逻辑（14.06 版本）

### 消费者发现无会话信号的提供者

在消费者侧，应用程序通过调用 D-Bus AddMatch 方法在无会话信号中注册一个兴趣。

**注意:** D-Bus AddMatch 方法是 org.freedesktop 的一部分。D-Bus 接口由 org/freedesktop/DBus object 提供。

匹配规则包含了指示针对无会话信号注册的 "sessionless='t'" 和其它筛选信号的键／值对。

在 14.06 版本之前，在接收到第一个 sessionless 匹配规则后，SLS 模块启动给予名称的发现进程，发现前缀为 "org.alljoyn.sl." 的 SLS WNK。当应用程序从 AllJoyn 路由中移除了最后一条撇配规则，SLS 模块停止发现 SLS WNK 前缀。

自 14.06 版本开始，消费者侧的无会话信号逻辑针对消费者从提供者的指定 AllJoyn 接口处获取无会话信号的能力进行了加强。新加入 AddMatch 的键 “implements” 用于实现它。在同一个匹配规则中可以指定多对 “implements” 键／值对。在发现 sesssionless signal 提供者的过程中，它们被视作逻辑与的关系。在目前的情况下，“implements” 键仅在接收 Annoucement sessionless sigal 时适用。包含 “implements” 键的 AddMatch 必需包含 "interface= org.alljoyn.About"。

下图展示了 14.06 版本中发现无会话信号提供者的消费者逻辑。

![consumer-logic-sessionless-providers-1406][consumer-logic-sessionless-providers-1406]

**图:** 发现 sessionless 提供者的消费者逻辑（14.06 AllJoyn 版本中引入）

如果 AddMatch 包含 "interface" 键但不包含 "implements" 键，SLS 模块使用基于名称的方式发现匹配规则中指定的 "<interface>.sl." 的名称前缀。

如果 AddMatch 包含一个或多个 "implements" 键，那么 SLS 会通过 NGNS 的方式发现 "implements" 指定的接口名称。SLS 模块也会通过 mDNS，使用 WHO-HAS message 进行基于名称的发现，找到具有 "org.alljoyn.sl." 前缀的名称。后者用于在 14.06 之前的版本中发现无会话信号提供者。基于 mDNS 的基于名称的发现用于从提供者的新／更新的无会话信号处获取未经请求的 mDNS 回应，

应用程序通过调用 RemoveMatch 方法和之前加入的匹配规则，取消对无会话信号的兴趣。当最后一条无会话信号匹配规则被移除时，SLS 模块停止与无会话信号相关的发现，包括基于名称和接口名称的发现。

### 消费者从提供者处获取无会话信号

在发现一个提供者后，消费者 SLS 模块根据消费者的匹配规则和提供者广告中的 change_id，决定它是否需要从提供者处获取无会话信号。消费者 SLS 模块始终跟随最后一个 change_id，为了得到其通过 广播名称发现的提供者 GUID。Sessionless signal 的获取逻辑和消费者对于每个提供者维持的状态，在 14.06 版本中都经过了修改。获取逻辑功能的区别如下：

* 在 14.06 之前的版本中，消费者 SLS 模块保留了 <Provider GUID, last acquired change_id> 列表信息来发现提供者。当从提供者处接收到任何更新的 change_id 时，消费者 SLS 模块会获取，其中 change_id 是 广播名称中的一部分。
* 自 14.06 版本起，能够从一个给定的提供者处获取多个无会话信号广告名称。除此之外，相关的 change_id 能够根据每个 广告名称的不同而不同。消费者 SLS 模块为发现的提供者保留了 <Provider GUID, SLS name, change_id> 列表。它也会保持对应用于给定提供者的匹配规则的跟踪。

下图展示了 14.06 版本中消费者无会话信号的获取逻辑。

![consumer-logic-sls-fetch-1406][consumer-logic-sls-fetch-1406]

**图:** 决定无会话信号获取的消费者逻辑 （14.06 版本中引入）

消费者 SLS 模块从提供者处接收无会话信号广播名称。无会话信号名称能够通过以下方式获取：

* 以单拨形式回应 mDNS 请求
* 未经请求的 mDNS 通过多拨形式回应
* IS-AT 多拨信息（经请求或自发）

消费者在最后一次从提供者处获取信息后，检查匹配规则是否被改变。或者从无会话信号名称获取的 change_id 是否比之前从提供者处获取的更大。

如果以上任意条件成立，消费者无需更多检查，便可以生成一个从旧 provider （14.06 版本之间）获取的无会话信号。这由检查从提供者处获取的无会话信号的广告名的 GUID 部分所决定。

* 在 14.06 版本之前，GUID 以 “x” 为前缀。
* 自 14.06 版本起，GUID 以 “y” 为前缀。

如果无会话信号名是来自 14.06 版本或后序版本，消费者会进行进一步确认，确定是否能从提供者处获取。

自 14.06 版本起，无会话信号名也包含了从无会话信号头文件获取的接口值。在这种情况下，消费者 SLS 模块会检查匹配规则中指定的接口（如果有的话）是否和从无会话信号名获取的接口一致。

* 如果是，那么消费者开始从提供者处获取。
* 如果匹配规则中没有指定接口，消费者也会开始获取无会话信号，因为这构成通配符匹配。

在 14.06 版本中，一个新的 RequestRangeMatch() 信号被定义为 org.alljoyn.sl 信号的一部分。这个信号用于获取一组匹配 RequestRangeMatch() 指定的任意匹配规则的。消费者 SLS 模块使用此信号获取 14.06 版本提供者的。

**注意:** 目前的实现方法，是在获取新信号以更新 change_id 之前，预先获取新匹配规则。两种获取的结果用于接收 的广告名，然而，这种情况很少出现因为加入一个新的匹配规则和接收一个无会话信号广告名通常不会同时出现。


当一个新的 AddMatch 规则被加入无会话信号，消费者 SLS 模块会被触发，从已知的提供者处预获取匹配规则，如 [Consumer fetchess from a provider][consumer-fetches-sls-from-provider] 所述。在预获取中，RequestRangeMatch 信号只包含新匹配规则。如果新 AddMatch 包含 “implements” 键，消费者 SLS 模块会开始发现这些接口的提供者。

一旦从经过请求的 mDNS 或 IS-AT 回复信息中的取得无会话信号广告名，消费者会立刻安排无会话信号的获取。由于 广告名作为未经请求的 mDNS 或 IS-AT 回复信息的一部分被接收，会在无会话信号之后安排一个退避算法，如 [Sessionless signal fetch backoff algorithm][sls-fetch-backoff-algorithm] 所述。

以下是获取无会话信号的步骤。

1. 消费者 SLS 模块通过无会话信号广播名和已知 SLS 端口（端口号 ＝ 100）加入一个会话。
2. 消费者通过已建立的会话向提供者发送一个 org.alljoyn.sl (`RequestSignals()`, `RequestRange()`, or `RequestRangeMatch()`) 中定义的信号，以获取无会话信号。
3. 提供者收到请求信号，发送要求的无会话信号并离开会话。

关于提供者从它的缓存向消费者发送何种信号，可以在 [org.alljoyn.sl interface][org-alljoyn-sl-interface] 查询这些信号的定义。

消费者接收，根据匹配规则筛选和转发这些信号。消费者 SLS 模块保留从提供者处获得的有关匹配规则和 change_id 的信息，以便将来 的获取。

#### 获取的退避算法

按照上文所述，在确定需要获取从一个给定的提供者处获取无会话信号后，消费者 SLS 模块尝试加入提供者的会话以获取无会话信号。如果消费者首次加入会话的尝试失败，它会跟随一个基于退避方式的重试逻辑，再次加入会话，以从提供者处获取信息。SLS 获取逻辑在不同消费者间加入随即延迟，保证消费者获取无会话信号的请求对于某个给定提供者方面能在时间上分离开。

消费者 SLS 模块跟随一个对于无会话信号获取的线性加指数退避尝试次数的混合结果。它支持最初的少量线性退避尝试与后序的指数线性退避的混合。从线性到指数退避尝试的分界点是可调节的。退避间隔被调节到和配置的最大值。重试次数算作一个总重试时间 R。当到达最大退避间隔时，会继续尝试一段时间（由最大退避间隔设定）直到总重试时间 R 结束。

下列配置参数已被加入路由配置文件：
* 线性到指数的转折点（k) - 指定退避会变为指数的重试次数。
* 最大退避间隔的因数 (c) - 指定 T（初始的退避时间） 的乘法因数，生成最大的退避间隔。
* 总尝试时常 (R) - 指定 SLS 获取重试次数的总时长（以秒为单位）。

下图展示了 SLS 重试的例子，按计划 SLS 重试发生在 T, 2T, 3T, 4T, 8T, 16T, 32T, 32T, 32T,....

![sls-fetch-backoff-schedule-example][sls-fetch-backoff-schedule-example]

**图:** SLS 获取退避的方式示例

对于每次 SLS 重试，加入提供者的会话会被随机地延迟 [0,重试间隔]，以保证消费者的要求在时间上被分隔开。上图中的例子可以说明：
* 通过第四次 SLS 获取重试加入会话的消费者将会被随机延迟 [0, 4T] 个间隔。
* 通过第 n 次 SLS 获取重试加入会话的消费者将会被随机延迟 [0, 16T] 个间隔。

因为 SLS 获取会被经过请求的 mDNS 发现应答所触发，加入会话请求不会被随机延迟。在这种情况下，为了 SLS 获取而加入会话会被立即执行。如果达到了消费者的最大连接限制，AllJoyn 路由器将会序列化这样的 SLS 获取。

## 信息序列 (在 14.06 版本之前)

由于无会话信号的逻辑在 14.06 版本中出现了很大变化，分离的 SLS 信息序列在 14.06 之前被捕获，并从 14.06 版本开始。

以下内容以实际案例的方式详细展示了 14.06 版本之前的无会话信号逻辑环境：

* 第一个无会话信号送达
* 同一个应用程序完成了另一个 AddMatch
* 另一个应用程序请求无会话信号

### 第一个无会话信号送达

下图展示了实际情况中分别在提供者和消费者处发送和接受第一个无会话信号的信息流。

**注意:** change_id 不包含在任何 信息中。然而，提供者 AllJoyn 路由的逻辑，保证它仅在消费者发现了 change_id 后，才会发送。当消费者完成了 JoinSession，它会使用从 IS-AT 信息中发现的 well-known 名。well-known 名中包含的 change_id 提供了 change_id 向消费者发送无会话信号的上限。

相似的信息流适用于实际使用中后序送达的。主要的区别在于如果适用，提供者会根据上文所述的逻辑，更新 change_id。

![first-sls-delivery][first-sls-delivery]

**图:** 首个无会话信号送达

信息流步骤如下所示。

1. 提供者和消费者应用同时连接到 AllJoyn 路由，AllJoyn 路由给应用终点安排唯一名称。
2. 提供者应用程序注册其服务对象，该对象提供了包含 AllJoyn 核心资源库信号成员的接口。
3. 消费者应用程序通过调用 AllJoyn 核心资源库的 `RegisterSignalHandler` API 为无会话信号注册一个信号处理器。
4. 消费者应用程序调用 AllJoyn 核心资源库的 `AddMatch` API 为接收无会话信号建立一个规则。该 API 使用 type='signal', sessionless='t' 和其他适用参数制定一套个信号匹配规则。
5. AllJoyn 核心资源库调用 AllJoyn 路由的 AddMatch 方法在 AllJoyn 路由中加入无会话信号筛选规则。
6. 消费者 AllJoyn 路由调用 `FindAdvertisedName()` 和 sessionless SLS WNK 前缀 "org.alljoyn.sl" 发现无会话信号的提供者。
7. 消费者 AllJoyn 路由发送一个寻找 "org.alljoyn.sl" 前缀的 WHO—HAS 信息。
8. 提供者应用程序有一个无会话信号需要发送。它调用 BusObject Signal(...) call，发送一条 AllJoyn SIGNAL 信息包含一个值为 true 的 sessionless 标志。
9. SIGNAL 信号从应用程序发送至 AllJoyn 路由。
10. 提供者 AllJoyn 路由在无会话信号缓存中存储信号并且分配一个新的 change_id 号码。
11. 提供者 AllJoyn 路由为含有最新 change_id 的 生成一个 well-known 名，使用 org.alljoyn.sl.x<GUID>.x<change_id> 的格式。
12. 提供者 AllJoyn 路由为存储这个 well-known 名建立一个 RequestName。随后它会调用 `AdvertiseName` 在 AllJoyn 网络内广播这个名称。
13. 提供者 AllJoyn 路由发出一个 IS-AT 信息，伴随生成的 well-known 名。
14. 消费者 AllJoyn 路由接受通过匹配 "org.alljoyn.sl" 前缀的 IS-AT 信息。FoundAdvertisedName 信号为无会话信号前缀而生成。
15. 消费者 AllJoyn 路由比较它现有的 AllJoyn 路由中 IS-AT 信息包含的 change_id 与从 IS-AT 信息中接收到的 change_id。这决定了接收到的 change_id 与目前的 change_id 不同，并且它需要从提供者 AllJoyn 路由获取一组新的。
16. 消费者 AllJoyn 路由调用 `JoinSessionAsync` 方法与提供者 AllJoyn 路由建立一个会话。这需要在众多参数中，指定 well-knonw 名和无会话信号会话端口。这在消费者和提供者 AllJoyn 路由之间开启了一个参与会话流。
17. 一旦会话建立完毕，消费者 AllJoyn 路由发送一个 RequestSignals 信号来请求从提供者应用程序获得最新的一组。此信号包含了提供者 AllJoyn 路由的 GUID 最新要求的 change_id。
18. 提供者 AllJoyn 路由向所有在 RequestSignals message 中提供的 change_id 后加入的无会话信号发送 SIGNAL 信息。
19. 一旦 SIGNAL 信息被发送，提供者 AllJoyn 路由为连接的会话开启一个 LeaveSession 方法。此触发器向消费者 AllJoyn 路由发送一个 DetachSession SIGNAL 信息。
20. 在收到 DetachSession 信号后，消费者 AllJoyn 路由知道它已经从提供者 AllJoyn 路由接收到所有新的。它随后会更新它 GUID 的 change_id 到它从 IS-AT 信息获取的最新 change_id。
21. 消费者 AllJoyn 路由根据针对无会话信号注册的 AddMatch 规则筛选接受的无会话信号信息。
22. 消费者 AllJoyn 路由向 AllJoyn 核心资源库通过回调发送 SIGNAL 信息。AllJoyn 核心资源库依次为无会话信号调用注册的信号处理器。

### 另一个应用程序的 AddMatch

消费者应用程序会请求后序 AddMatch 调用。在 14.06 版本之前，这被理解为加入一个心得规则筛选后序收到的无会话信号。

* 在 AllJoyn 路由中，任何后序接收的 SLS 信息将会被根据合成的匹配规则进行筛选。
* 如果有更严格的规则，会匹配更少的一组，同时又有一个更加宽松的规则能够匹配更多的无会话信号， AllJoyn 路由总会向应用程序发送更多的一组信号。

**注意:** 当加入新的匹配规则时，AllJoyn 路由不会再次获取与现有 change_id 相关的无会话信号信息。新的匹配规则应用于任何后续收到的信息。从 14.06 版本起，这样的设定经过了修改，SLS 模块会在新匹配规则加入时开启无会话信号获取。

下图展示了另一个 AddMatch 加入同一个应用程序的信息流的情况。多数情况下，与首个无会话信号送达情况一致。主要的区别在于不需要针对 "org.alljoyn.sl" 的 FindAdvertisedName，因为 SLS WNK 前缀的发现工作在收到第一个无会话信号的 AddMatch 时已经开启了，并且已在进程中。

![another-add-match-done-by-app][another-add-match-done-by-app]

**图:** 另一个应用程序的 AddMatch

### 另一个请求无会话信号的应用程序

在实际应用中，遇到多个应用程序连接到一个给定路由的情况，每个应用程序请求 `AddMatch` 调用来向 AllJoyn 路由中加入无会话信号的匹配规则。这些 AddMatch 滴哦用可被接受很多次。当第一个 AddMatch 调用从应用程序中接收到，AllJoyn 路由再从已发现的发送给那些应用程序的提供者处获取目前有效的无会话信号。AllJoyn 路由使用 RequestRange 信号获取目前的一组。

下图展示了后序应用程序处理首个 AddMatch 情况的信息流。

![another-app-requesting-sls][another-app-requesting-sls]

**图:** 另一个请求无会话信号的应用程序

## 信息序列 （14.06 版本）

在 14.06 版本中，无会话信号逻辑如前文所属得到了增强。本章关注无会话信号信息序列的逻辑上增强的部分。分几个具体示例来详细说明：

* 收到首个无会话信号
* 在一个新的消费者与老版本提供者之前的无会话信号送达
* 在一个老版本消费者与新的提供者之前的无会话信号送达
* 后续应用程序的 AddMatch

### 收到首个无会话信号

这个情况定义了当第一个 AddMatch 通过消费者应用程序来接收无会话的信号。AddMatch 中指定的匹配规则可能包含或不包含新键 “implements”。这两种情况被相应地列出：

* AddMatch 不包含 "implements" 键
* AddMatch 包含 “implements" 键

#### AddMatch 不包含 "implements" 键

下图展示在 AddMatch 不包含 "implements" 键/值 对的情况下，发送和接受首无会话信号的信息流。

![first-sls-delivery-no-implements-addmatch][first-sls-delivery-no-implements-addmatch]

**图:** 首个无会话信号的送达（AddMatch 中无 “implements”键）

信息流的步骤如下。
1. 提供者和消费者应用程序同时连接到 AllJoy 路由。
2. 提供者应用程序注册其服务对象，该对象提供了包含 AllJoyn 核心资源库信号成员的接口。
3. 消费者应用程序通过调用 AllJoyn 核心资源库的 `RegisterSignalHandler` API 为无会话信号注册一个信号处理器。
4. 消费者应用程序调用 AllJoyn 核心资源库的 `AddMatch` API 为接收无会话信号建立一个规则。该 API 使用 type='signal', sessionless='t' 和其他适用参数制定一套个信号匹配规则。
5. AllJoyn 核心资源库调用 AllJoyn 路由的 AddMatch 方法在 AllJoyn 路由中加入无会话信号筛选规则。
6. 消费者 AllJoyn 路由调用 `FindAdvertisedName()` 和 sessionless SLS WNK 前缀 "org.alljoyn.sl" 发现无会话信号的提供者。
7. 消费者 AllJoyn 路由使用 NGNS 发送基于名称的查询消息
8. 提供者应用程序有一个无会话信号需要发送。它调用 BusObject Signal(...) call，发送一条 AllJoyn SIGNAL 信息包含一个值为 true 的 sessionless 标志。
9. SIGNAL 信号从应用程序发送至 AllJoyn 路由
10. 提供者 AllJoyn 路由在无会话信号缓存存储信号。
11. 提供者 AllJoyn 路由生成以下内容：
   * 一个以 "org.alljoyn.sl.y<GUID>.x<change_id>" 格式，包含最新 change_id 的针对无会话信号的 well-known 名称。
   * 第二个包含最新 change_id 的针对 的 well-known 名称，这个 change_id 与给定 <INTERFACE> 生成的信号相关。
12. 提供者 AllJoyn 路由调用 RequestName 和 AdvertiseName 方法以请求和广告这些名称。
13. 提供者路由发送一个 Name Servie 回应信息以使用 NGNS 广告这些 well-known 名称。
14. 消费者 AllJoyn 路由接受其前缀符合 "org.alljoyn.sl." 或 "<INTERFACE>.y<GUID>.x<change_id>" 的 Name Service 回应信息。为广告生成一个 FoundAdvertisedName 信号。
15. 消费者基于接收到的无会话信号广告名称、change_id 比较和在 [Consumer fetches 
sessionless signals from a provider][consumer-fetches-sls-from-provider] 提到的目前的匹配规则决定是否在提供者处获取。
16. 消费者 AllJoyn 路由调用 JoinSessionAsync 方法开启一个与提供者 AllJoyn 路由间的会话。在参数中，它指定了 well-known 名称和无会话会话端口。这在 AllJoyn 路由级别的消费者和提供者之前建立了一个参与会话流。
17. 一旦建立了会话，消费者 AllJoyn 路由发送 RequestRangeMatch 信号以从提供者设备请求最新的一组。该信号包含最新为提供者 AllJoyn 路由的 GUID 获得的 change_id，并且匹配规则尚未被应用在提供者 GUID 上。
18. 提供者 AllJoyn 路由向所有在 RequestRangeMatch 区间内的无会话信号发送 AllJoyn SIGNAL 信息。
19. 一旦所有 SIGNAL 信息被发送，提供者 AllJoyn 路由为已连接的会话生成 LeaveSession。这个触发器向连接的 AllJoyn 路由发送一个 DetachSession SIGNAL 信息。
20. 在收到 DetachSession 信号后，消费者 AllJoyn 路由知道它已经从提供者 Alljoyn 路由处获取了全部的无会话信号。随后他会更新自己 GUID 的 change_id 至最新从广告接收到的版本，并且针对已应用在提供者的匹配规则更新状态。
21. 消费者 AllJoyn 路由通过回调向 AllJoyn 核心资源库发送 SIGNAL 信息。AllJoyn 核心资源库依次调用已注册的针对无会话信号的信号处理器。

#### AddMatch 包含 'implements' 键

下图展示了发送和接受第一个无会话信号的信息流，这适用于 AddMatch 包含一个或多个 'implements' 键／值对的使用场景。

**注意:** 目前，'implements' 键只应用与 Annoucement。作为结果，在这种情况下的 AddMatch 必需包含发送 Annoucement signal 的接口的 "interface=org.alljoyn.About"。

AllJoyn 路由通过 NGNS 启动接口名称发现，以发现提供了指定接口的提供者。一旦发现了提供者，消费者 AllJoyn 路由获取从那些提供者发送的 Annoucement 信号。

![first-sls-delivery-implements-addmatch][first-sls-delivery-implements-addmatch]

**图:** 首个无会话信号送达（在 AddMatch 中有 implements 的键）

### 新版消费者和旧版提供者之间的无会话信号传递。

下图展示了当一个新版消费者（14.06 版本或后续版本）从一个旧版（14.06 版本之前）提供者处收到无会话信号的信息流。

![sls-logic-new-consumer-legacy-provider][sls-logic-new-consumer-legacy-provider]

**图:** 新版消费者与旧版提供者之间无会话信号的逻辑

### 旧版消费者与新版提供者之间无会话信号传递

下图展示了当一个旧版消费者（14.06 版本之前）接收到从一个新版提供者（14.06 版本和后续版本）发出到无会话信号时的信息流。

![sls-logic-legacy-consumer-new-provider][sls-logic-legacy-consumer-new-provider]

**图:** 旧版消费者和新版提供者之间的无会话信号逻辑。

### 应用程序完成的后续 AddMatch

当 AllJoyn 路由调用了首个 AddMatch 后，应用程序能够继续调用其他的 AddMatch，为 加入更多的匹配规则。

从 14.06 版本起，无论合适任何应用程序调用了 AddMatch，SLS 模块会被触发，开始获取无会话信号信息。这样的逻辑与 [First delivery][first-sessionless-signal-delivery] 中叙述的获取首个无会话信号的场景很相似。加入的步骤用于从已存在的提供者处获取 信息，这些提供者都必须符合的针对无会话信号的筛选标准。

消费者 SLS 模块会记录从每个提供者处收到的无会话信号广告名。针对不包含 implements 键的 AddMatch 规则，消费者使用匹配规则在已有的提供者中选择匹配的提供者，并且从它们那里接收。

消费者 SLS 模块执行以下步骤：

1. 执行接口名称发现，寻找符合 AddMatch 中指定的键／值对的提供者。从这些发现的提供者处获取无会话信号。
2. 执行基于名称的发现，寻找符合 AddMatch 指定的新接口值的 "<INTERFACE>.sl"，为了未完成的发现。从发现的提供者处获取无会话信号。
3. 如果从这些提供者处获取的 符合匹配规则中指定的筛选标准，那么就从这些已知的提供者处获取无会话信号。

## org.alljoyn.sl 接口

org.alljoyn.sl 接口是 AllJoyn 路由用于交换 的 AllJoyn 接口。[org.alljoyn.sl interface signals][org-alljoyn-sl-interface-signals] 中列出了 org.alljoyn.sl 接口信号。

### org.alljoyn.sl 接口信号

| 信号名称 | 描述 |
|---|---|
| RequestSignals | 请求关于在 [fromId, currentChangeId] 区间内 change_id 的，在这个区间中的 currentChangeId 是提供者最新广告的 change_id。 |
| RequestRange | <p>一个请求无会话信号的信号，其 change_id 在[fromId, toId]内。</p><p>**注意:** "toId" 是排它的，如果消费者希望在 change_id 值上获得 SLS，应该设置 toId=<change_id_value>+1</p><p>这个信号出现在 AllJoyn 协议的版本 6 中</p> |
| RequestRangeMatch | <p>一个请求无会话信号的信号，其 change_id 在[fromId, toId]内,并且匹配任意一条匹配规则</p><p>"toId" 也是一个排它信号。</p><p>这个信号出现在 AllJoyn 协议的版本 10 中 (有关 14.06 版本).</p> |

### org.alljoyn.sl.RequestSignals 参数

| 参数名称 | 描述 |
|---|---|
| UINT32 fromId | change_id 范围的开始 | 

### org.alljoyn.sl.RequestRange 参数

| 参数名称 | 描述 |
|---|---|
| UINT32 fromId	| change_id 范围的开始 | 
| UINT32 toId | change_id 范围的结束 |

### org.alljoyn.sl.RequestRangeMatch 参数

| 参数名称 | 描述 |
|---|---|
| UINT32 fromId | change_id 范围的开始 | 
| UINT32 toId | change_id 范围的结束 | 
| ARRAY of STRING matchRules | 应用于范围的匹配规则| 



[data-exchange]: /learn/core/system-description/data-exchange
[consumer-fetches-sls-from-provider]: #consumer-fetches-sessionless-signals-from-a-provider
[sls-fetch-backoff-algorithm]: #sessionless-signal-fetch-backoff-algorithm
[org-alljoyn-sl-interface]: #org-alljoyn-sl-interface
[consumer-fetches-sls-from-provider]: #consumer-fetches-sessionless-signals-from-a-provider
[first-sessionless-signal-delivery]: #first-sessionless-signal-delivery
[org-alljoyn-sl-interface-signals]: #org-alljoyn-sl-interface-signals


[sls-arch]: /files/learn/system-desc/sls-arch.png
[sessionless-signal]: /learn/core/system-description/sessionless-signal
[provider-sls-module-logic-pre-1406]: /files/learn/system-desc/provider-sls-module-logic-pre-1406.png
[provider-sls-module-logic-1406]: /files/learn/system-desc/provider-sls-module-logic-1406.png
[consumer-logic-sessionless-providers-1406]: /files/learn/system-desc/consumer-logic-sessionless-providers-1406.png
[consumer-logic-sls-fetch-1406]: /files/learn/system-desc/consumer-logic-sls-fetch-1406.png
[first-sls-delivery]: /files/learn/system-desc/first-sls-delivery.png
[another-add-match-done-by-app]: /files/learn/system-desc/another-add-match-done-by-app.png
[another-app-requesting-sls]: /files/learn/system-desc/another-app-requesting-sls.png
[first-sls-delivery-no-implements-addmatch]: /files/learn/system-desc/first-sls-delivery-no-implements-addmatch.png
[first-sls-delivery-implements-addmatch]: /files/learn/system-desc/first-sls-delivery-implements-addmatch.png
[sls-logic-new-consumer-legacy-provider]: /files/learn/system-desc/sls-logic-new-consumer-legacy-provider.png
[sls-logic-legacy-consumer-new-provider]: /files/learn/system-desc/sls-logic-legacy-consumer-new-provider.png
[sls-fetch-backoff-schedule-example]: /files/learn/system-desc/sls-fetch-backoff-schedule-example.png
