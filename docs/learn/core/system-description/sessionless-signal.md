# Sessionless Signal

## 概览

Sessionless signal 是一项 AllJoyn&trade; 功能，它能够在 AllJoyn 临域网络内广播信号至各个节点。这与在 [Data Exchange][data-exchange] 中描述的基于会话的信号不同，基于会话的信号通过指定会话，或者根据 sessionId/destination 的路由通过多个会话，发送给接受人。

逻辑上说，Sessionless signal 会发送一种信号，任何在 AllJoyn 临域网络内愿意接收 sessionless signal 的应用程序都将收到在该网络内其它应用程序发送的所有 sessionless signal。AllJoyn 系统使用逻辑上的 sessionless signal，因为信号本身不广播/组播，而是向网络内的所有节点通过多播发送一种指示信号。应用程序不需要连接到会话就能接受 sessionless signal，不过，在背后运行的 AllJoyn 路由必须建立一个根据指示信号抓取这些信号的会话。应用程序能够指定匹配规则（通过 AddMatch）接收一部分特定的 sessionless signal，并且 AllJoyn 路由通过那些匹配规则筛选信号。

下图展示了一个的 sessionless signal 在提供者和消费者两侧的高规格的结构。AllJoyn 路由支持逻辑 SLS 模块实现 sessionless signal 逻辑。SLS 模块使用 Name Service，广播和发现使用 sessionless signal 指定的 well-known name 的 sessionless signal。

![sls-arch][sls-arch]

**图:** Sessionless signal 结构

在 AllJoyn 路由启动后，SLS 模块将执行以下步骤，为发送和／或接收 sessionless signal 做准备。

1. 建立一个实现 "org.alljoyn.sl" 接口的对象，该接口用于两个 AllJoyn 路由进行 sessionless signal 的交换。
2. 注册信号处理程序从 "org.alljoyn.sl" 接口接收信号。
3. 绑定一个 well-know sessionless signal 端口号 100，支持接收抓取 sessionless signal 的请求。

愿意接收 sessionless signal 的消费者应用程序会与 AllJoyn 路由注册一套匹配规则来接收 sessionless signal。所以，SLS 模块能够通过 Name Service （根据路由版本，可能是老版本的 Name Service 或 NGNS） 发现 sessionless 提供者。

在提供者方面，应用程序向 AllJoyn 路由发送一个 sessionless signal。SLS 模块在本地信息缓存内保存该信号。在提供者一方的 sessionless signal 生成一个 sessionless signal 指定的 well-known name，并在 AllJoyn 网络内广告。

一旦发现 sessionless signal 提供者，消费者 AllJoyn 路由与提供者 AllJoyn 路由通过专属 sessionless signal 的 well-known 会话端口建立一个会话。会话建立完毕后，消费者 SLS 模块通过 org.alljoyn.sl 接口抓取 sessionless signal。

以下章节详细描述了提供者和消费者关于 sessionless signal 的行为。

### 14.06 版本中针对 sessionless signal 的改善

在 14.06 之前的版本，消费者侧 SLS 模块提供了根据 AddMatch 规则指定的筛选条件请求 sessionless signal 的功能。消费者从所有的提供者处获取 sessionless signal，在讲这些信号发送给有意愿接收的应用程序之前，消费者会使用 AddMatch 规则筛选这些 sessionless signal。

在 14.06 版本中，sessionless signal 的新特性允许消费者应用程序从提供者应用程序支持的特定 AllJoyn 端口请求 sessionless signal。举例说明，某个光线控制 app 能够从提供 org.alljoyn.LightBulb 接口的提供者应用程序处获取 Annoucement sessionless signal。

功能实现需要以下的一些重要的 sessionless signal 增强：

* sessionless signal 广播名称得到加强，在 sessionless signal 的头部加入了 <INTERFACE> 信息。消费者通过它能够只接收从根据消费者侧匹配规则指定的 <INTERFACE> 发送的 sessionless signal。多个 sessionless signal 名会被广告，每个代表一个 sessionless signal 缓存中的接口。

* AddMatch 的匹配规则定义经过扩展，加入了一个新的 'implements' 键。它可以用于表明仅接收提供特定 AllJoyn 接口的应用程序的 Annoucement sessionless signal，这些接口由应用程序的 Annoucemnet signal 指定。

Sessionless signal 仅被其接口符合匹配规则的提供者所获取。提供者使用 AddMatch 匹配规则筛选信号。


## Sessionless signal 端到端逻辑

Sessionless signal 端到端逻辑包含以下几个方面，以下章节会进行详细解释。

* 提供者缓存信号并且广播信号的可用性。
* 消费者发现 sessionless signal 提供者。
* 消费者从提供者处获取 sessionless signal。

### 提供者缓存信号并且广播其可用性

在提供者侧，应用程序向 AllJoyn 路由发送一个带有 SESSIONLESS 标志的信号。提供者中的 SLS 模块将这个信号加入其 sessionless signal 缓存。缓存项使用（SENDER,INTERFACE,MEMBER 和 PATH）等标头字段的组合作为信号的键。

后续向 AllJoyn 路由 发送的具有相同 (SENDER, INTERFACE, MEMBER, and PATH) 标头字段的 sessionless signal 时，新的字段会在缓存中覆盖掉已缓存的 seesionless signal。

提供者 AllJoyn 路由为 sessionless signal 分配 change_id.change_id 用于向 AllJoyn 网络内的消费者的指示 sessionless signal 的更新。每个 sessionless signal 缓存项包含 (SLS signal, change_id) 元组。当新信号进入缓存时，提供者会递增 change_id，消费者会在每一次递增过后从提供者处请求信号。

应用程序可以通过调用 /org/alljoyn/Bus object 的 org.alljoyn.Bus 接口的 CancelSessionlessMessage 方法从提供者的缓存中删除一个条目。通过序列号删除条目。当提供者从其缓存中移出一个信号后，change_id 将不会递增。缓存中的内容，包括相关的 change_id，决定了提供者将广播什么。

在 AllJoyn 14.06 版本之前，SLS 模块要求和广播以下 sessionless signal 的 well-known name：

* "org.alljoyn.sl.x<GUID>.x<change_id>"

  当:
  
  * GUID 是 AllJoyn 路由的 GUID。
  * change_id 是 sessionless signal 缓存中最大的 change_id。

自 14.06 版本的 AllJoyn 起，SLS 模块要求和广播以下 sessionless signal 的 well-known name：

* "org.alljoyn.sl.y<GUID>.x<change_id>"

  当:
  
  * GUID 是 AllJoyn 路由的 GUID。
  * change_id 是 SLS 缓存中的最大 change_id。
  
* "<INTERFACE>.sl.y<GUID>.x<change_id>"
  
  当:
  
  * INTERFACE 是信号 INTERFACE 标头字段的值。
  * GUID 是 AllJoyn 路由的 GUID。
  * change_id 是在 sessionless signal 缓存中拥有相同 INTERFACE 标头文件中最大的 change_id。

   多数情况下,每一个 sessionless signal 缓存中的 INTERFACE 标头字段值，会要求并广告一个 well-known name。

下图展示了 14.06 版本之前的提供者侧的 SLS 模块逻辑。

![provider-sls-module-logic-pre-1406][provider-sls-module-logic-pre-1406]

**图:** 提供者侧 SLS 模块逻辑（14.06 之前的版本）

下图展示了 14.06 版本的提供者侧的 SLS 模块逻辑。

![provider-sls-module-logic-1406][provider-sls-module-logic-1406]

**图:** 提供者侧 SLS 模块逻辑（14.06 版本）

### 消费者发现 sessionless signal 的提供者

在消费者侧，应用程序通过调用 D-Bus AddMatch 方法在 sessionless signal 中注册一个兴趣。

**注意:** D-Bus AddMatch 方法是 org.freedesktop 的一部分。D-Bus 接口由 org/freedesktop/DBus object 提供。

匹配规则包含了指示针对 sessionless signal 注册的 "sessionless='t'" 和其它筛选信号的键／值对。

在 14.06 版本之前，在接收到第一个 sessionless 匹配规则后，SLS 模块启动给予名称的发现进程，发现前缀为 "org.alljoyn.sl." 的 SLS WNK。当应用程序从 AllJoyn 路由中移除了最后一条撇配规则，SLS 模块停止发现 SLS WNK 前缀。

自 14.06 版本开始，消费者侧的 sessionless signal 逻辑针对消费者从提供者的指定 AllJoyn 接口处获取 sessionless signal 的能力进行了加强。新加入 AddMatch 的键 “implements” 用于实现它。在同一个匹配规则中可以指定多对 “implements” 键／值对。在发现 sesssionless signal 提供者的过程中，它们被视作逻辑与的关系。在目前的情况下，“implements” 键仅在接收 Annoucement sessionless sigal 时适用。包含 “implements” 键的 AddMatch 必需包含 "interface= org.alljoyn.About"。

下图展示了 14.06 版本中发现 sessionless signal 提供者的消费者逻辑。

![consumer-logic-sessionless-providers-1406][consumer-logic-sessionless-providers-1406]

**图:** 发现 sessionless 提供者的消费者逻辑（14.06 AllJoyn 版本中引入）

如果 AddMatch 包含 "interface" 键但不包含 "implements" 键，SLS 模块使用基于名称的方式发现匹配规则中指定的 "<interface>.sl." 的名称前缀。

如果 AddMatch 包含一个或多个 "implements" 键，那么 SLS 会通过 NGNS 的方式发现 "implements" 指定的接口名称。SLS 模块也会通过 mDNS，使用 WHO-HAS message 进行基于名称的发现，找到具有 "org.alljoyn.sl." 前缀的名称。后者用于在 14.06 之前的版本中发现 sessionless signal 提供者。基于 mDNS 的基于名称的发现用于从提供者的新／更新的 sessionless signal 处获取未经请求的 mDNS 回应，

应用程序通过调用 RemoveMatch 方法和之前加入的匹配规则，取消对 sessionless signal 的兴趣。当最后一条 sessionless signal 匹配规则被移除时，SLS 模块停止与 sessionless signal 相关的发现，包括基于名称和接口名称的发现。

### 消费者从提供者处获取 sessionless signal

在发现一个提供者后，消费者 SLS 模块根据消费者的匹配规则和提供者广告中的 change_id，决定它是否需要从提供者处获取 sessioless signal。消费者 SLS 模块始终跟随最后一个 change_id，为了得到其通过 sessionless signal 广播名称发现的提供者 GUID。Sessionless signal 的获取逻辑和消费者对于每个提供者维持的状态，在 14.06 版本中都经过了修改。获取逻辑功能的区别如下：

* 在 14.06 之前的版本中，消费者 SLS 模块保留了 <Provider GUID, last acquired change_id> 列表信息来发现提供者。当从提供者处接收到任何更新的 change_id 时，消费者 SLS 模块会获取 sessionless signal，其中 change_id 是 sessionless signal 广播名称中的一部分。
* 自 14.06 版本起，能够从一个给定的提供者处获取多个 sessionless signal 广告名称。除此之外，相关的 change_id 能够根据每个 sessionless signal 广告名称的不同而不同。消费者 SLS 模块为发现的提供者保留了 <Provider GUID, SLS name, change_id> 列表。它也会保持对应用于给定提供者的匹配规则的跟踪。

下图展示了 14.06 版本中消费者 sessionless signal 的获取逻辑。

![consumer-logic-sls-fetch-1406][consumer-logic-sls-fetch-1406]

**图:** 决定 sessionless signal 获取的消费者逻辑 （14.06 版本中引入）

消费者 SLS 模块从提供者处接收 sessionless signal 广播名称。sessionless signal 名称能够通过以下方式获取：

* 以单拨形式回应 mDNS 请求
* 未经请求的 mDNS 通过多拨形式回应
* IS-AT 多拨信息（经请求或自发）

消费者在最后一次从提供者处获取信息后，检查匹配规则是否被改变。或者从 sessionless signal 名称获取的 change_id 是否比之前从提供者处获取的更大。

如果以上任意条件成立，消费者无需更多检查，便可以生成一个从旧 provider （14.06 版本之间）获取的 sessionles signal。这由检查从提供者处获取的 sessionless signal 的广告名的 GUID 部分所决定。

* 在 14.06 版本之前，GUID 以 “x” 为前缀。
* 自 14.06 版本起，GUID 以 “y” 为前缀。

If the sessionless signal name is from a 14.06 release or 
later provider, the consumer performs further checks to determine 
if the sessionless signal fetch should be done with the provider. 
如果 sessionless signal 名是来自 14.06 版本或后序版本，消费者会进行进一步确认，确定是否能从提供者处获取 sessionless signal。

自 14.06 版本起，sessionless signal 名也包含了从 sessionless signal 头文件获取的接口值。在这种情况下，消费者 SLS 模块会检查匹配规则中指定的接口（如果有的话）是否和从 sessionless signal 名获取的接口一致。

* 如果是，那么消费者开始从提供者处获取 sessionless signal。
* 如果匹配规则中没有指定接口，消费者也会开始获取 sessionless singal，因为这构成通配符匹配。

在 14.06 版本中，一个新的 RequestRangeMatch() 信号被定义为 org.alljoyn.sl 信号的一部分。这个信号用于获取一组匹配 RequestRangeMatch() 指定的任意匹配规则的 sessionless signal。消费者 SLS 模块使用此信号获取 14.06 版本提供者的 sessionless signal。

**注意:** 目前的实现方法，是在获取新信号以更新 change_id 之前，预先获取新匹配规则。两种获取的结果用于接收 sessionless signal 的广告名，然而，这种情况很少出现因为加入一个新的匹配规则和接收一个 sessionless signal 广告名通常不会同时出现。


当一个新的 AddMatch 规则被加入 sessinless signal，消费者 SLS 模块会被触发，从已知的提供则出预获取匹配规则，如 [Consumer fetches sessionless signals from a provider][consumer-fetches-sls-from-provider] 所述。在预获取中，RequestRangeMatch 信号只包含新匹配规则。如果新 AddMatch 包含 “implements” 键，消费者 SLS 模块会开始发现这些接口的提供者。

一旦从经过请求的 mDNS 或 IS-AT 回复信息中的取得 sessionless signal 广告名，消费者会立刻安排 sessionless signal 的获取。由于 sessionless signal 广告名作为未经请求的 mDNS 或 IS-AT 回复信息的一部分被接收，会安排一个退避算法在 sessionless signal 之后，如 [Sessionless signal fetch backoff algorithm][sls-fetch-backoff-algorithm] 所述。

以下是获取 sessionless signal 的步骤。

1. 消费者 SLS 模块通过 sessionless signal 广播名和已知 SLS 端口（端口号 ＝ 100）加入一个会话。
2. 消费者通过已建立的会话向提供者发送一个 org.alljoyn.sl (`RequestSignals()`, `RequestRange()`, or `RequestRangeMatch()`) 中定义的信号，以获取 sessionless signal。
3. 提供者收到请求信号，发送要求的 sessionless signal 并离开会话。

关于提供者从它的缓存向消费者发送何种信号，可以在 [org.alljoyn.sl interface][org-alljoyn-sl-interface] 查询这些信号的定义。

消费者接收 sessionless signal，根据匹配规则筛选和转发这些信号。消费者 SLS 模块保留从提供者处获得的有关匹配规则和 change_id 的信息，以便将来 sessionless signal 的获取。

#### sessionless signal 获取的退避算法

按照上文所述，在确定需要获取从一个给定的提供者处获取 sessionless signal 后，消费者 SLS 模块尝试加入提供者的会话以获取 sessionless signal。如果消费者首次加入会话的尝试失败，它会跟随一个基于退避方式的重试逻辑，再次加入会话，以从提供者处获取信息。SLS 获取逻辑在不同消费者间加入随即延迟，保证消费者获取 sessionless signal 的请求对于某个给定提供者方面能在时间上分离开。

消费者 SLS 模块跟随一个对于 sessionless signal 获取的线性加指数退避尝试次数的混合结果。它支持最初的少量线性退避尝试与后序的指数线性退避的混合。从线性到指数退避尝试的分界点是可调节的。退避间隔被调节到和配置的最大值。重试次数算作一个总重试时间 R。当到达最大退避间隔时，会继续尝试一段时间（由最大退避间隔设定）直到总重试时间 R 结束。

下列配置参数已被加入路由配置文件：
* 线性到指数的转折点（k) - 指定退避会变为指数的重试次数。
* 最大退避间隔的因数 (c) - 指定 T（初始的退避时间） 的乘法因数，生成最大的退避间隔。
* 总尝试时常 (R) - 指定 SLS 获取重试次数的总时长（以秒为单位）。

下图展示了 SLS 重试的例子，按计划 SLS 重试发生在 T, 2T, 3T, 4T, 8T, 16T, 32T, 32T, 32T,....

![sls-fetch-backoff-schedule-example][sls-fetch-backoff-schedule-example]

**图:** SLS 获取退避的方式示例

对于每次 SLS 重试，加入提供者的会话会被随机地延迟 [0, 重试间隔]，以保证消费者的要求在时间上被分隔开。上图中的例子可以说明：
* 通过第四次 SLS 获取重试加入会话的消费者将会被随机延迟 [0, 4T] 个间隔。
* 通过第 n 次 SLS 获取重试加入会话的消费者将会被随机延迟 [0, 16T] 个间隔。

因为 SLS 获取会被经过请求的 mDNS 发现应答所触发，加入会话请求不会被随机延迟。在这种情况下，为了 SLS 获取而加入会话会被立即执行。如果达到了消费者的最大连接限制，AllJoyn 路由器将会序列化这样的 SLS 获取。

## Sessionless signal 信息序列 (在 14.06 版本之前)

由于 sessionless 的逻辑在 14.06 版本中出现了很大变化，分离的 SLS 信息序列在 14.06 之前被捕获，并从 14.06 版本开始。

以下内容以实际案例的方式详细展示了 14.06 版本之前的 sessionless signal 逻辑环境：

* 第一个 sessionless signal 送达
* 同一个应用程序完成了另一个 AddMatch
* 另一个应用程序请求 sessionless signal

### 第一个 sessionless signal 送达

下图展示了实际情况中分别在提供者和消费者处发送和接受第一个 sesssionless signal 的信息流。

**注意:** sessionless signal change_id 不包含在任何 sessionless signal 信息中。然而，提供者 AllJoyn 路由的逻辑，保证它仅在消费者发现了 change_id 后，才会发送 sessionless signal。当消费者完成了 JoinSession，它会使用从 IS-AT 信息中发现的 sessionless signal well-known 名。well-known 名中包含的 change_id 提供了 change_id 向消费者发送 sessionless signal 的上限。

相似的信息流适用于实际使用中后序送达的 sessionless signal。主要的区别在于如果适用，提供者会根据上文所述的逻辑，更新 change_id。

![first-sls-delivery][first-sls-delivery]

**图:** 首个 sessionless signal 送达

信息流步骤如下所示。

1. 提供者和消费者应用同时连接到 AllJoyn 路由，AllJoyn 路由给应用终点安排唯一名称。
2. 提供者应用程序注册其服务对象，该对象提供了包含 AllJoyn 核心资源库信号成员的接口。
3. 消费者应用程序通过调用 AllJoyn 核心资源库的 `RegisterSignalHandler` API 为 sessionless signal 注册一个信号处理器。
4. 消费者应用程序调用 AllJoyn 核心资源库的 `AddMatch` API 为接收 sessionless signal 建立一个规则。该 API 使用 type='signal', sessionless='t' 和其他适用参数制定一套个信号匹配规则。
5. AllJoyn 核心资源库调用 AllJoyn 路由的 AddMatch 方法在 AllJoyn 路由中加入 sessionless signal 筛选规则。
6. 消费者 AllJoyn 路由调用 `FindAdvertisedName()` 和 sessionless SLS WNK 前缀 "org.alljoyn.sl" 发现 sessionless signal 的提供者。
7. 消费者 AllJoyn 路由发送一个寻找 "org.alljoyn.sl" 前缀的 WHO—HAS 信息。
8. 提供者应用程序有一个 sessionless signal 需要发送。它调用 BusObject Signal(...) call，发送一条 AllJoyn SIGNAL 信息包含一个值为 true 的 sessionless 标志。
9. SIGNAL 信号从应用程序发送至 AllJoyn 路由。
10. 提供者 AllJoyn 路由在 sessionless signal 缓存中存储信号并且分配一个新的 sessionless signal change_id 号码。
11. 提供者 AllJoyn 路由为含有最新 change_id 的 sessionless signal 生成一个 well-known 名，使用 org.alljoyn.sl.x<GUID>.x<change_id> 的格式。
12. 提供者 AllJoyn 路由为存储这个 well-known 名建立一个 RequestName。随后它会调用 `AdvertiseName` 在 AllJoyn 网络内广播这个名称。
13. 提供者 AllJoyn 路由发出一个 IS-AT 信息，伴随生成的 sessionless signal well-known 名。
14. 消费者 AllJoyn 路由接受通过匹配 "org.alljoyn.sl" 前缀的 IS-AT 信息。FoundAdvertisedName 信号为 sessionless signal 前缀而生成。
15. 消费者 AllJoyn 路由比较它现有的 AllJoyn 路由中 IS-AT 信息包含的 change_id 与从 IS-AT 信息中接收到的 change_id。这决定了接收到的 change_id 与目前的 change_id 不同，并且它需要从提供者 AllJoyn 路由获取一组新的 sessionless signal。
16. 消费者 AllJoyn 路由调用 `JoinSessionAsync` 方法与提供者 AllJoyn 路由建立一个会话。这需要在众多参数中，指定 sessionless signal well-knonw 名和 sessionless 会话端口。这在消费者和提供者 AllJoyn 路由之间开启了一个会话附件流。
17. 一旦会话建立完毕，消费者 AllJoyn 路由发送一个 RequestSignals 信号来请求从提供者应用程序获得最新的一组 sessionless signal。此信号包含了提供者 AllJoyn 路由的 GUID 最新要求的 change_id。
18. 提供者 AllJoyn 路由向所有在 RequestSignals message 中提供的 change_id 后加入的 sessionless signal 发送 SIGNAL 信息。
19. 一旦 SIGNAL 信息被发送，提供者 AllJoyn 路由为连接的会话开启一个 LeaveSession 方法。此触发器向消费者 AllJoyn 路由发送一个 DetachSession SIGNAL 信息。
20.  在收到 DetachSession 信号后，消费者 AllJoyn 路由知道它已经从提供者 AllJoyn 路由接收到所有新的 sessionless signal。它随后会更新它 GUID 的 change_id 到它从 IS-AT 信息获取的最新 change_id。
21. 消费者 AllJoyn 路由根据针对 sessionless signal 注册的 AddMatch 规则筛选接受的 sessionless signal 信息。
22. The consumer AllJoyn router sends SIGNAL messages to the 
AllJoyn core library via callback. The AllJoyn core library 
in turn calls the registered signal handler for the sessionless signal. 消费者 AllJoyn 路由向 AllJoyn 核心资源库通过回调发送 SIGNAL 信息

### Another AddMatch done by the app 另一个应用程序的 AddMatch

消费者应用程序会请求后序 AddMatch 调用 sessionless signal。在 14.06 版本之前，这被理解为加入一个心得规则筛选后序收到的 sessionless signal。

* 在 AllJoyn 路由中，任何后序接收的 SLS 信息将会被根据合成的匹配规则进行筛选。
* 如果有更严格的规则，会匹配更少的一组 sessionless signal，同时又有一个更加宽松的规则能够匹配更多的 sessionless signal， AllJoyn 路由总会向应用程序发送更多的一组信号。

**注意:** 当加入新的匹配规则时，AllJoyn 路由不会再次获取与现有 change_id 相关的 sessionless signal 信息。新的匹配规则应用于任何后续收到的信息。从 14.06 版本起，这样的设定经过了修改，SLS 模块会在新匹配规则加入时开启 sessionless signal 获取。

下图展示了另一个 AddMatch 加入同一个应用程序的信息流的情况。多数情况下，与首个 sessionless signal 送达情况一致。主要的区别在于不需要针对 "org.alljoyn.sl" 的 FindAdvertisedName，因为 SLS WNK 前缀的发现工作在收到第一个 sessionless signal 的 AddMatch 时已经开启了，并且已在进程中。

![another-add-match-done-by-app][another-add-match-done-by-app]

**图:** 另一个应用程序的 AddMatch

### 另一个请求 sessionless signal 的应用程序

在实际应用中，遇到多个应用程序连接到一个给定路由的情况，每个应用程序请求 `AddMatch` 调用来向 AllJoyn 路由中加入 sessionless signal 的匹配规则。这些 AddMatch 滴哦用可被接受很多次。当第一个 AddMatch 调用从应用程序中接收到，AllJoyn 路由再从已发现的发送给那些应用程序的提供者处获取目前有效的 sessionless singal。AllJoyn 路由使用 RequestRange 信号获取目前的一组 sessionless signal。

下图展示了后序应用程序处理首个 sessionless signal AddMatch 情况的信息流。

![another-app-requesting-sls][another-app-requesting-sls]

**图:** 另一个请求 sessionless signal 的应用程序

## Sessionless signal 信息序列 （14.06 版本）

在 14.06 版本中，sessionless signal 逻辑如前文所属得到了增强。本章关注 sessionless signal 信息序列的逻辑上增强的部分。分几个具体示例来详细说明：

* 收到首个 sessionless signal
* 在一个新的消费者与老版本提供者之前的 sessionless signal 送达
* 在一个老版本消费者与新的提供者之前的 sessionless signal 送达
* 后续应用程序的 AddMatch

### 收到首个 sessionless signal

This use case defines when the first AddMatch is done by a 
consumer app to receive sessionless signals. The match rules 
specified in the AddMatch may or may not include the new 'implements' 
key. Both use cases are captured accordingly:这个情况定义了当第一个 AddMatch 通过消费者应用程序来接收无会话的信号。AddMatch 中指定的匹配规则可能包含或不包含新键 “implements”。这两种情况被相应地列出：

* AddMatch 不包含 "implements" 键
* AddMatch 包含 “implements" 键

#### AddMatch 不包含 "implements" 键

下图展示在 AddMatch 不包含 "implements" 键/值 对的情况下，发送和接受首个 sessionless singal 的信息流。

![first-sls-delivery-no-implements-addmatch][first-sls-delivery-no-implements-addmatch]

**图:** 首个 sessionless signal 的送达（AddMatch 中无 “implements”键）

信息流的步骤如下。
1. 提供者和消费者应用程序同时连接到 AllJoy 路由。
2. 提供者应用程序注册其服务对象，该对象提供了包含 AllJoyn 核心资源库信号成员的接口。
3. 消费者应用程序通过调用 AllJoyn 核心资源库的 `RegisterSignalHandler` API 为 sessionless signal 注册一个信号处理器。
4. 消费者应用程序调用 AllJoyn 核心资源库的 `AddMatch` API 为接收 sessionless signal 建立一个规则。该 API 使用 type='signal', sessionless='t' 和其他适用参数制定一套个信号匹配规则。
5. AllJoyn 核心资源库调用 AllJoyn 路由的 AddMatch 方法在 AllJoyn 路由中加入 sessionless signal 筛选规则。
6. 消费者 AllJoyn 路由调用 `FindAdvertisedName()` 和 sessionless SLS WNK 前缀 "org.alljoyn.sl" 发现 sessionless signal 的提供者。
7. 消费者 AllJoyn 路由使用 NGNS 发送基于名称的查询消息
8. 提供者应用程序有一个 sessionless signal 需要发送。它调用 BusObject Signal(...) call，发送一条 AllJoyn SIGNAL 信息包含一个值为 true 的 sessionless 标志。
9. SIGNAL 信号从应用程序发送至 AllJoyn 路由
10. 提供者 AllJoyn 路由在 sessionless signal 缓存存储信号。
11. The provider AllJoyn router generates the following:
   * A well-known name for the sessionless signal of the format 
   "org.alljoyn.sl.y<GUID>.x<change_id>" with the latest change_id. 
   * A second well-known name for the sessionless signal of 
   the format "<INTERFACE>.y<GUID>.x<change_id>" with the 
   latest change_id associated with signals generated 
   by the given <INTERFACE>.
12. The provider AllJoyn router invokes the RequestName 
and AdvertiseName method calls to request and advertise these names. 
13. The provider AllJoyn router sends out a Name Service 
response messages to advertise these sessionless signal 
well-known names using NGNS.
14. The consumer AllJoyn router receives the Name Service 
response messages which pass the prefix matching for "org.alljoyn.sl." 
or "<INTERFACE>.y<GUID>.x<change_id>". A FoundAdvertisedName 
signal gets generated for the advertisements.
15. The consumer determines that it needs to fetch sessionless 
signals from the provider, based on the received sessionless 
signal advertised name, change_id comparison, and current 
set of match rules as per logic described in [Consumer fetches 
sessionless signals from a provider][consumer-fetches-sls-from-provider]. 
16. The consumer AllJoyn router invokes JoinSessionAsync 
method call to start a session with the provider AllJoyn router. 
It specifies the sessionless signal well-known name and 
sessionless session port among other parameters.
   This initiates a session attachment flow at the AllJoyn 
   router level between the consumer and provider. 
17. Once the session is established, the consumer AllJoyn 
router sends the RequestRangeMatch signal to request the 
latest set of sessionless signals from the provider device. 
This signal includes last acquired change_id for the GUID 
of provider AllJoyn router, and the match rules that have 
not yet been applied to the provider GUID.
18. The provider AllJoyn router sends the AllJoyn SIGNAL 
messages for all sessionless signals added that pass the 
match rules in the range provided in the RequestRangeMatch signal.
19. Once all SIGNAL messages have been sent, the provider 
AllJoyn router initiates LeaveSession for the connected session. 
This triggers sending a DetachSession SIGNAL message to the 
consumer AllJoyn router. 
20. After receiving the DetachSession signal, the consumer 
AllJoyn router knows that it has received all new sessionless 
signals from the provider AllJoyn router. It then updates its 
change_id for that GUID to the latest received change_id 
from the advertisement and also updates status for match 
rules which have been applied to that provider. 
21. The consumer AllJoyn router sends SIGNAL messages to the 
AllJoyn core library via callback. The AllJoyn core library 
in turn calls the registered signal handler for the sessionless signal. 

#### AddMatch includes the 'implements' key

The following figure shows the message flow for sending and 
receiving of the first sessionless signal for the use case 
when AddMatch includes one or more 'implements' key/value pair. 

**NOTE:** Currently, the 'implements' key only applies to the 
Announcement sessionless signal. As a result, the AddMatch 
in this case must include "interface=org.alljoyn.About", 
which is the interface that emits the Announcement signal.

The AllJoyn router initiates interface name discovery via 
NGNS to find providers which implements the specified interfaces. 
Once those providers are discovered, the consumer AllJoyn router 
fetches the Announcement signals from those providers.

![first-sls-delivery-implements-addmatch][first-sls-delivery-implements-addmatch]

**Figure:** First sessionless signal delivery (with implements' key in AddMatch)

### Sessionless signal delivery between a new consumer and a legacy provider

The following figure shows the message flow when a new consumer 
(14.06 release or later) received sessionless signals from a 
legacy provider (prior to the 14.06 release).

![sls-logic-new-consumer-legacy-provider][sls-logic-new-consumer-legacy-provider]

**Figure:** Sessionless signal logic between new consumer and legacy provider

### Sessionless signal delivery between a legacy consumer and a new provider

The following figure shows the message flow when a legacy consumer 
(prior to the 14.06 release) is receiving sessionless signals 
from a new provider (14.06 release or later).

![sls-logic-legacy-consumer-new-provider][sls-logic-legacy-consumer-new-provider]

**Figure:** Sessionless signal logic between legacy consumer and new provider

### Subsequent AddMatch done by an app 

After the first AddMatch call to the AllJoyn router, applications 
can subsequently invoke other AddMatch calls to add more 
match rules for sessionless signals. 

Starting from the 14.06 release, whenever an AddMatch call 
is invoked by any app, the SLS module takes steps to trigger 
fetch for sessionless signal messages. The logic is quite 
similar to the first sessionless signal delivery use case 
in [First sessionless signal delivery][first-sessionless-signal-delivery]. 
The additional step is to fetch sessionless signal messages 
from existing providers that match the specified filtering 
criteria for sessionless signals.

The consumer SLS module remembers the sessionless signal 
advertised name it has received from each provider. For the 
new AddMatch rule that doesn't include implements key, the 
consumer uses the match rule to find matching providers among 
existing providers and fetches sessionless signals from those providers.

The consumer SLS module performs the following steps.

1. Perform interface name discovery for providers for 
any new 'implements' key/value pair specified in AddMatch. 
Fetch the sessionless signals from the discovered providers.
2. Perform name-based discovery for "<INTERFACE>.sl" for any 
new interface value specified in AddMatch, for which discovery 
was not already done. Fetch the sessionless signals from 
the discovered providers.
3. Fetch the sessionless signals from the already known providers 
if the sessionless signal name received from these providers 
match the filtering criteria specified in match rule.

## org.alljoyn.sl interface

The org.alljoyn.sl interface is the AllJoyn interface between 
two AllJoyn routers used to enable the exchange of sessionless 
signals. [org.alljoyn.sl interface signals][org-alljoyn-sl-interface-signals] 
lists the org.alljoyn.sl interface signals.

### org.alljoyn.sl interface signals

| Signal name | Description |
|---|---|
| RequestSignals | Requests sessionless signals associated with change_ids in the range [fromId, currentChangeId], where currentChangeId is the most recently advertised change_id of the provider. |
| RequestRange | <p>A signal for requesting sessionless signals associated with change_ids in the range [fromId, toId).</p><p>**NOTE:** The "toId" is exclusive so a consumer should set toId=<change_id_value>+1 if it wants to get SLS up to the change_id_value.</p><p>This signal appeared in version 6 of the AllJoyn protocol.</p> |
| RequestRangeMatch | <p>A signal for requesting sessionless signals associated with change_ids in the range [fromId, toId) that match any of the provided match rules.</p><p>The "toId" is exclusive in this signal too.</p><p>This signal appeared in version 10 of the AllJoyn protocol (associated with the 14.06 release).</p> |

### org.alljoyn.sl.RequestSignals parameters

| Parameter name | Description |
|---|---|
| UINT32 fromId | Start of change_id range. | 

### org.alljoyn.sl.RequestRange parameters

| Parameter name | Description |
|---|---|
| UINT32 fromId	| Start of change_id range. | 
| UINT32 toId | End of change_id range. |

### org.alljoyn.sl.RequestRangeMatch parameters

| Parameter name | Description |
|---|---|
| UINT32 fromId | Start of change_id range | 
| UINT32 toId | End of change_id range | 
| ARRAY of STRING matchRules | Match rules to apply to the range.| 



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
