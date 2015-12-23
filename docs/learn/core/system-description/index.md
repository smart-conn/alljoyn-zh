# AllJoyn&trade; 系统描述

## 发布历史

| 发布版本 | 日期 | 改变内容 |
|---|---|---|
| 14.06 | 9/26/2014 | 初版 |
| 14.12 | 12/17/2014 | <p>14.12中加入的新功能:</p><ul><li>UDP 传输设计</li><li>路由端的 TCP vs UDP 选择逻辑</li><li>基于 mDNS 的 TCL 路由发现机制 TCL</li><li>更新了 SLS fetch backoff 设计以支持线性+指数性 backoff</li><li>加入路由探测机制以探测失踪的应用程序</li><li>加入可以检测并断开读取速度慢的节点的路有逻辑</li></ul><p>其他更新:</p><ul><li>Endpoints 对 AllJoyn 的传输可用</li><li>TCP 传输的数据平面模型以及状态机</li><li>AllJoyn 协议版本与不同发布的对应 </li><li>路由间的连接超时机制以检测失踪路由</li></ul>|
| 15.04 | 4/29/2015 | <p>在 Thin Apps 部分中有关于如下功能的更新:</p><ul><li>安全性以及对路由选择添加描述</li><li>修复错字增强可读性和一致性的常规清理</li></ul><p>其他更新:</p><ul><li>常规清理</li><li>去掉了对 RSA 和 PIN认证机制的引用由于他们将不被支持</li>|

此部分详细描述了 AllJoyn 在系统层中的工作方式

## 系统概览

### 概览
物联网（IoE）是一个令人兴奋的愿景，他承诺将人与物或物与物以各种方式连接在一起；这将会创造新的容量和丰富的体验，并将使我们的生活更简单。 IoE 承诺将把人，进程，数据以及物品汇聚到一起，给网络化的连接带来前所未有的相关性及价值，将信息转化成行动，并带来之前从未实现过的能力。


IoE 将会为住宅，办公室，汽车，街道，机场以及购物中心等等带来智能物品和智能设备。这些设备将为用户提供实时的情景体验。距离相近的 IoE 设备将组
建近端 IoE 网络，例如，在住宅内，在车里或者在办公室里。IoE 的愿景是实现多个 IoE 近端网络的互连互通。

对比现今存在的因特网以及物联网可以发现很多有趣的事。现今的因特网由受因特网编号管理局 (IANA) 集中管理的数百万已注册的高层域名构成。域名的发
现可由通过域名系统（DNS）进行按层次查找完成。在 IoE 网络中，会存在潜在的数百亿 IoE 设备。由可测量性的角度看，想要试图通过一个中央实体对 IoE
设备注册进行管理是不太可能的。并且在 IoE 网络中，基于邻近域的设备间交互减少了延迟，并且不需要将每个设备都直连到因特网。因此，物联网的发现机
制应该是基于邻域标准自动触发的。由于越来越多的个人及家庭设备会将接口暴露给物联网用于连接及控制，安全性和隐私性变得尤为重要。

下图展示了多个通过因特网互相连接的邻域 IoE 网络的一个实例。

![ioe-network-example][ioe-network-example]

**Figure:** IoE 网络实例

通过直接的点对点连接，IoE 邻域网络中的智能设备可以做到对其他设备的动态发现和通信。对于某些使用网络地址转换的设备，他们可以通过基于云的发现服务来发现对方。基于云的发现服务也可以被用于不同的 IoE 邻域网络内 IoE 设备的发现和连接。综合 IoE 网络可能会有附加的用来提供特殊功能的基于云
的服务，例如，远程住宅自动化，远程诊断/保养，数据收集/报告等等。IoE 网络还可以将一些现存的基于云的服务集成进来，例如将 Facebook 或 Twitter 集成到设备状态更新中。

在任何 IoE 网络中，内在或夸 IoE 邻域网中设备的协同互用性对提供丰富的，可扩展的，为设备提供服务及应用程序的 IoE 生态系统至关重要。在设计 IoE
系统时，一定要考虑一些特定的关键设计层面，包括设备的广播及发现，移动性和动态 IoE 网络管理，安全性和隐私性，跨载体/操作系统的协同互用
性，用以支持瘦终端/哑终端的轻量化解决方案，可延展性以及总体可测量性。一个成功的 IoE 系统必须是开放的，并提供可用于跨越不同垂直用例的水平化
解决方案。

AllJoyn 系统专注于这些核心设计层面。此系统提供开源的软件框架，可实现基于邻近域的，点对点的，承载无关的 IoE 设备网络化。AllJoyn 系统为设备及
应用程序提供了可以通过使用点对点协议在邻近域网络内广播并发现对方的方式。

AllJoyn 开源软件系统提供了可以完成夸异构分布式系统的 IoE 设备间通信的框架。AllJoyn 是一个基于邻近域的点对点通信平台，面向在分布式系统中的设
备。他不需要使用集中式的服务器来完成通信。支持 AllJoyn 的设备运行一个或多个 AllJoyn 应用程序，并形成点对点的 AllJoyn 网络。AllJoyn 系统是分
布式的软件平台，支持运行在 IoE 设备上的应用程序推广，发现服务，以及连接到其他设备以使用其他设备提供的服务。AllJoyn 框架使这些应用程序可以通
过可被发现的 API 来暴露自己的功能，这些 API 是定义应用程序所提供的功能的契约。

在邻近域 AllJoyn 网络中， 安装在 IoE 设备上的 AllJoyn 应用程序们互为 peers. 一个支持 AllJoyn 的应用程序可以作为一个供应方，消费方，或者既是
供应方也是消费方，这取决于服务模型。供应方的应用程序实现服务，并将它们通过 AllJoyn 网络推广。对这些服务有兴趣的消费方应用程序就可以连接到供
应方应用程序并根据自己的喜好使用服务。一个 AllJoyn 的应用程序可以同时扮演供应方和消费方的角色。这意味着该应用程序可以广播某一套他所支持的服
务，也可以发现并利用其它在邻近域中的应用程序所提供的各种服务。

下图展示了有4台设备的 AllJoyn 网络

![alljoyn-network][alljoyn-network]

**Figure:** AllJoyn 网络

设备1和设备2只有提供 AllJoyn 服务的供应方应用程序。设备3只有使用其它设备服务的消费方应用程序。设备4的应用程序可以同时充当供应方和消费方。设备4上的应用程序使用设备2的应用程序所提供的服务。同时他提供的服务还被设备3上的应用程序所使用。箭头的方向从供应方指向消费方，指示着服务的消费。

AllJoyn 框架为 IoE 设备之间的通信建立了一个底层总线结构。在 IoE 设备上的 AllJoyn 应用程序 通过 AllJoyn 总线与其他应用程序连接并通信。
AllJoyn 总线为在 IoE 设备上的应用程序提供了可以发送通知或者交换数据的平台以及无线链路无关的传输机制。AllJoyn 总线负责处理与底层物理的特定网
络传输相配饰的工作。

每一个 AllJoyn 的应用程序都连接到本地的 AllJoyn 总线。一个给定的本地 AllJoyn 总线可以连接一个或者多个应用程序。AllJoyn 总线使附着在它上面的
应用程序可以完成广播服务，发现服务以及互相通信的功能。在多个设备上的 AllJoyn 总线用类似 Wi-Fi 的底层网络技术来互相通信。

AllJoyn 平台的开源实现方式提供了一个生态系统，诸多用户可以通过添加新功能及增强功能来为 AllJoyn 生态系统做贡献。此系统支持通过 OS 抽象层实现
的操作系统无关性，使得 AllJoyn 框架以及应用程序可以在多种操作平台上运行。AllJoyn框架支持大多数的标准 Linux 发行版，Android2.3 及后续版本，
常见的 Microsoft Windows 操作系统，Apple iOS, Mac OS X, 嵌入式的诸如 OpenWRT 的操作系统以及类似 ThreadX 的实时操作系统。

AllJoyn 框架同时也支持多种用于为 IoE设备开发应用程序及服务的编程语言，这丰富了开发 AllJoyn 应用及服务的生态系统。 AllJoyn 框架目前支持C, C++, Java, C#, JavaScript, 以及 Objective-C.


### AllJoyn 系统以及 D-bus 规范

AllJoyn系统

AllJoyn 实现了一个广泛兼容的 D-Bus over-the-wire 协议，并遵守在 D-Bus 规范中的众多命名习俗和指导原则。AllJoyn 延展并显著强化了 D-Bus 消息
总线，以支持分布式总线的场景。AllJoyn 系统使用按照下文描述的 D-Bus 规范：

* 使用 D-Bus 的数据类型系统以及序列化格式
* 通过添加 flags 以及 headers（具体细节请参阅[Message format][message-format]）实现增强版的 D-Bus over-the-wire 协议。
* 对 well-known names （服务器），接口，接口成员（方法，信号以及属性）以及对象路径的命名使用 D-Bus 的命名原则。
* 使用 D-Bus 定义的简单认证与安全层（SASL）框架完成应用程序层中支持 AllJoyn 应用程序间的认证。并支持不限于由 D-Bus 规范定义的多种认证机制。

D-Bus 规范请参阅以下网址： (http://dbus.freedesktop.org/doc/dbus-specification.html).

### AllJoyn 系统的关键概念

如之前所述，AllJoyn 框架为应用程序提供可以推广和发现服务，以及使用其他应用程序提供的功能的底层总线结构。为了实现此结构，AllJoyn 框架提供了
一个可供应用程序交互的面向对象的软件框架。

#### AllJoyn 路由

AllJoyn 路由组件为 AllJoyn 系统提供核心功能，包括点对点推广/发现，建立连接，广播信号以及控制/投递数据消息。AllJoyn 路由通过实现软件总线功能
以及到应用程序的连接使 AllJoyn 框架的核心功能受益。每一个 AllJoyn 路由的实例都有一个自行分配的全球唯一标识符（GUID）。此 GUID 并不是持久有
效的，每当 AllJoyn 路由启动时都会被分配一个新的 GUID. AllJoyn 路由可以是捆绑在每一个应用程序上的（捆绑模式），也可以是被众多应用程序所分享
的（独立模型），如下图所示。


![alljoyn-bundled-standalone-router-examples][alljoyn-bundled-standalone-router-examples]

**Figure:** AllJoyn 捆绑式以及独立式 router 举例

AllJoyn 路由有定义了被支持功能集合的相关 AllJoyn 协议译本。在连接建立后，此协议会在 AllJoyn 网络上的 AllJoyn 路由之间交换，作为建立 AllJoyn
会话的一部分。

#### AllJoyn 总线

AllJoyn 路由提供了软件总线功能，借助此功能一个或多个应用程序可以与总线建立连接并交换消息。在设备上的 AllJoyn 路由实例建立本地的 AllJoyn 逻 辑总线，如下图所示。

![logical-router-bus-mapping][logical-router-bus-mapping]

**Figure:** AllJoyn 路由到 AllJoyn 总线的映射转换

AllJoyn 逻辑总线映射到一个单独的 AllJoyn 路由有以下两种情况：

* 设备上只有一个应用程序的捆绑部署模型，如 UC2 所示。
* 设备上有一个或多个应用程序的独立部署模型，如 UC3 所示。

在设备上有多个应用程序的捆绑部署模型中，AllJoyn 逻辑总线映射到多个 AllJoyn 路由实例的情况请参阅 UC1.

**NOTE:*8 在此文档中，AllJoyn 路由与 AllJoyn 总线这两个术语是可以相互替换的，他们指代着一个由 AllJoyn 系统提供的相同集合的总线功能。

下图是在有多个应用程序连接到总线的两个不同设备上的 AllJoyn 本地总线的简化视图。

![alljoyn-bus][alljoyn-bus]

**Figure:** AllJoyn 总线

AllJoyn 总线为连接到总线的应用程序之间通信提供了一个媒介。在多个设备上的 AllJoyn 总线通过类似 Wi-Fi 的底层网络技术实现通信。

下图展示了由跨越多个设备的多个 AllJoyn 总线实例所构成的逻辑分布式 AllJoyn 软件总线:

![distributed-alljoyn-bus][distributed-alljoyn-bus]

**Figure:** 分布式 AllJoyn 总线

分布式 AllJoyn 总线隐藏了所有运行在多个设备上的应用程序中的通信链路细节。对于连接到 AllJoyn 总线的一个应用程序来说，运行在另一个设备上的远
端应用程序看起来就像在这个设备本地的一个应用程序一样。AllJoyn 分布式总线为在分布式系统上传送消息提供了一个快速且轻量化的方式。

#### AllJoyn 服务

如前所述，在 AllJoyn 网络中，供应方应用程序提供可被 AllJoyn 网络中其他应用程序所使用的服务。例如，一台电视可以提供图像渲染功能，从而显示另
一个设备（例如智能手机）上的图片。AllJoyn 服务是一个理论的/逻辑的概念，由向消费方暴露服务功能的一个或多个 AllJoyn 接口（详细描述请参阅
[AllJoyn interfaces][alljoyn-interfaces]）定义。

AllJoyn 应用程序可以同时提供并消费 AllJoyn 服务，也就是说 AllJoyn 应用程序可以同时扮演供应方和消费方。

#### 唯一标识
每一个 AllJoyn 应用程序都连接到一个单一的 AllJoyn 路由。为了实现对每一个独立应用程序的寻址，AllJoyn 路由会为每一个连接在其上的应用程序分配
一个唯一标识符。此唯一标示符使用 AllJoyn 路由的 GUID 作前缀，并遵循如下格式：

```
Unique Name = ":"<AJ router GUID>"."<Seq #>
```

**NOTE:** ":<AJ router GUID>.1" 标识符会一直被分配给 AllJoyn 路由的本地终点。

下图展示了一个 GUID=100的单一 AllJoyn 路由为三个连接到 AllJoyn 总线的应用程序分配唯一标识符的过程：

![uniquename-assignment-1][uniquename-assignment-1]

**Figure:** AllJoyn 唯一标识符分配1 (多个应用程序连接到单一 AllJoyn 路由)
 
此场景描述了有多个 AllJoyn 应用程序的设备连接到一个单一 AllJoyn 路由的情况。

我们期望大多数支持 AllJoyn 的设备都是单一目的设备（例如，冰箱，烤箱，照明灯泡等等），并只有一个连接到 AllJoyn 总线的应用程序在其上。但是也
会有 AllJoyn 路由单一实例支持多个应用程序的设备，比如电视。

下图展示了组成 AllJoyn 总线并在 AllJoyn 路由上有多个实例的 AllJoyn 应用程序的独立标识分配过程：


![uniquename-assignment-2][uniquename-assignment-2]

**Figure:** AllJoyn 唯一标识符分配2 (每个应用程序都有 AllJoyn 路由的实例）。


**NOTE:** 每个唯一标识的 GUID 部分都是不同的，他们与相关联的 AllJoyn 路由上的 GUID 相同

下图展示了通过分布式 AllJoyn 总线连接的两个不同设备上应用程序的独立标识分配过程：

![uniquename-assignment-3][uniquename-assignment-3]

**Figure:** AllJoyn 唯一标识符分配3 (通过分布式 AllJoyn 总线连接的两个设备上的应用程序)。

#### Well-known name

AllJoyn 应用程序可以决定为他的服务使用 well-known names.  well-known names 是由 AllJoyn 总线提供的可以持续地查阅到服务（或一系列服务）的方
法。应用程序可以对其所提供的所有服务使用单一的 well-known name，也可以对这些服务使用多个 well-known names.

应用程序可以为他的服务向 AllJoyn 总线申请一个或多个 well-known names. 如果被申请的 well-known names 尚未被使用，申请使用的应用程序将会被授
予独家使用权。该操作确保了 well-known names 在任何时候都可以代表唯一的地址。此唯一性仅在本地的 AllJoyn 总线内存在。若要实现 well-known names 的全局唯一性，需使用特定的命名规范及格式。

AllJoyn 的 well-known name 使用翻转的域名作为标准格式。在分布式 AllJoyn 总线上的给定应用程序可以用多个实例，例如，在邻域网中（一个在厨房， 另一个在地下室），由同一个供货商提供的两个不同冰箱上面运行的相同的冰箱应用程序。为了分辨在 AllJoyn 总线上一个给定应用程序的多个实例，需要给
well-known name 加上声明应用程序的标签作后缀，例如，区别应用程序实例的 GUID.

AllJoyn 的 well-known name 遵守 D-Bus 规范中的命名原则，其格式如下所示：

```
WKN = <reverse domain style name for service/app>"."<app instance GUID>
```
例如，一个冰箱服务可以使用如下的 well-known name:

```
com.alljoyn.Refrigerator.12345678
```

#### AllJoyn 对象

为了支持 AllJoyn 的服务功能，AllJoyn 应用程序可以实现一个或多个 AllJoyn 对象。这些 AllJoyn 对象被称为服务对象，并通过 AllJoyn 总线被推广。
其他的 AllJoyn 应用程序可以通过 AllJoyn 总线发现这些对象，并对他们进行远程访问，消费他们提供的服务。

消费方应用程序通过一个代理对象来访问 AllJoyn 的服务对象。代理对象是远端服务对象的本地代表，通过 AllJoyn 总线被访问。

下图展示了 AllJoyn 服务对象与代理对象之间的区别。

![alljoyn-service-object-proxy-object][alljoyn-service-object-proxy-object]

**Figure:** AllJoyn 服务对象和代理对象

每一个服务对象实例都有对应的可以唯一指认出此实例的对象路径。在供应方创建服务对象时，对象路径即被分配。代理对象需要对象路径来建立与远端服务
对象的通信。对象路径仅在给定的应用程序内有效，因此只有在实现对象的应用程序内，对象路径才有唯一性。所以对象路径的命名不需要遵守翻转域名命名转换规则，而可以由应用程序随意选择。

对象路径的命名仍然遵循 D-Bus 规范的命名原则。一个由冰箱实现的服务对象的对象路径可以是如下表达：

```
/MyApp/Refrigerator
```

#### AllJoyn 接口

每一个 AllJoyn 对象经过一个或多个 AllJoyn 接口向 AllJoyn 总线显示他的功能。AllJoyn 接口定义了实现接口规范的实体与其他对此接口提供的服务有兴
趣的其他实体之间的通信协议。AllJoyn 接口作为标准化的候选人，使支持 AllJoyn 的 IoE设备间能够互用。

AllJoyn 接口可以包含以下一种或者几种类型的成员：

* 方法: 方法就是一个函数的调用，伴随一系列的输入，并对输入进行处理，通常会返回一个或多个反应处理结果的输出。请注意，方法并不是强制包含输入和（或）输出的，方法也不被强制给予回应。
 

* 信号: 信号是由服务生成的一个异步提醒，用来向一个或多个远端 peers 告知事件或状态的变化。 信号可以由已建立完成的对等网络 AllJoyn 连接（ AllJoyn 会话。也可以通过分布式 AllJoyn 总线被广播到全局所有的 AllJoyn peers. 信号有三种类型：

  * 指定会话的信号：这些信号被传输到一个或多个连接到邻域网中给定的 AllJoyn 会话的 peers. 如果目的地已写明，信号将只会被传输到那个通过 AllJoyn 会话连接的目的地节点。如果没有声明目的地，信号会被传输到除生成该信号的节点之外的通过给定会话连接的所有节点。如果会话是多端的，这种信号则会通过多播传送到其他所有的参与者。

  * 会话广播信号：这些信号被送往所有通过任意 AllJoyn 会话连接的的节点

  * 非会话信号: 这些信号被送往在邻域网中所有对接收非会话信号表示出兴趣的节点。在接收这种信号时，节点不需要通过 AllJoyn 会话建立连接。非会话
  信号本质上就是独立于会话连接的广播信号。

* 属性: 属性是一个有值的变量，他可以是只读的，可读写的，或者只写的。
每一个 AllJoyn 接口都有一个全局唯一的接口名，用于识别由此接口提供的方法，信号以及属性群。AllJoyn 接口名的定义是接口标准化的一部分。与 well-known name 类似，AllJoyn 接口名也遵循域名反转规则以及 D-Bus 规范的命名原则。

例如，一台冰箱可能支持一下标准的 AllJoyn 冰箱接口：

```
org.alljoyn.Refrigerator
```

#### AllJoyn 核心库

AllJoyn 核心库将 AllJoyn 总线功能展示给 AllJoyn 应用程序。 每一个应用程序都关联到一个单一的 AllJoyn 核心库实例上，以便与 AllJoyn 总线建立连
接。AllJoyn 核心库在应用程序与远端 AllJoyn 应用程序点对点通信时扮演了网关的角色。他可被用于连接到总线，推广并发现服务，建立到远端 peer 的连
接，消费服务，以及许多其他的 AllJoyn 功能。应用程序向 AllJoyn 核心库注册它的对象，以便将其推广到 AllJoyn 总线。

下图展示了三个应用程序通过 AllJoyn 核心库连接到一个给定 AllJoyn 总线的过程：

![alljoyn-core-library][alljoyn-core-library]

**Figure:** AllJoyn 核心库

AllJoyn 核心库可以是为标准 AllJoyn 应用程序设计的标准核心库（SCL），也可以是为精简 AllJoyn 应用程序设计的精简核心库（TCL）。在本文档中，大
多数的系统设计都是又标准核心库描述的。更多关于精简核心库的设计细节，请查阅 [Thin Apps][thin-apps].

#### “About” 功能

“About” 功能在 AllJoyn 框架中作为核心库的一部分被支持。“About”功能使应用程序可以展示关于自身的关键信息，包括应用程序名，应用程序识别符，设备名，设备识别符，被支持的 AllJoyn 接口列表以及其他信息。此功能由被 org.alljoyn.About object 对象实现的 org.alljoyn.About 接口支持。

应用程序通过一个由“ About ”接口定义的 Announce 信号来展示自己的关键信息。此信号在邻域 AllJoyn 网络中被当作非会话信号发送。任何对发现服务有
兴趣的应用程序都可以使用 Announce 信号用于发现。“About” 功能同时也提供通过直接调用方法来获取应用程序信息的机制。关于 “About” 功能的技术细节
请参阅[About HLD]


#### AllJoyn 端点

AllJoyn 应用程序使用 D-Bus 格式的消息来交换信息。这些消息会指明原地址和目的地当作端点。一个 AllJoyn 端点代表着一条 AllJoyn 通信链路的一边。
端点被用于将消息路由到正确的目的地。

端点由核心库以及 AllJoyn 路由维护，以实现消息路由。以下端点由核心库维护：

* **Local Endpoint**: 在核心库内部的本地端点代表着到附属应用程序的连接。

* **Remote Endpoint**: 在核心库内的远程端点代表着到 AllJoyn 路由的连接。仅当 AllJoyn 路由为非捆绑式时此端点才有效。

由 AllJoyn 路由维护的端点被分配给他的唯一标识所唯一确定。以下端点被 AllJoyn 路由维护：

* **Local Endpoint**: 本地端点是在 AllJoyn 路由内部的端点。他定义了到路由本身的连接，被用于在 AllJoyn 路由间交换 AllJoyn 控制信息。第一个端
点常常被分配":<AJ router GUID>.1"这个标识符

* **Remote Endpoint**: 远程端点定义了在应用程序与 AllJoyn 路由器之间的连接。以应用程序为目的地的消息会被路由到应用程序端点。

* **Bus-to-Bus Endpoint**: 总线到总线 (B2B) 端点是定义了两个 AllJoyn 路由之间连接的一类特殊的远程端点。在 AllJoyn 路由器交换消息时，此端点
被当作路由消息的下一跳。 

AllJoyn 路由会保留一张路由表，以便将消息路由到不同类型的端点。两个 AllJoyn 路由之间的控制消息（如 AttachSession 消息）会被路由到本地端点。
两应用程序之间的 AllJoyn 消息会被路由到应用程序端点。这些消息将会把应用程序端点当作原地址和目的地。B2B 端点在两 AllJoyn 路由交换消息（app-
directed 或者控制消息）时会作为下一跳。

下图展示了 AllJoyn 系统中不同类型的端点。

The following figure shows different endpoints in the AllJoyn system.

![alljoyn-endpoints][alljoyn-endpoints]

**Figure:** AllJoyn 端点

#### 自省性

The AllJoyn system supports D-Bus defined introspection 
feature that enables AllJoyn objects to be introspected at 
runtime, returning introspection XML describing that object. 
The object should implement org.freedesktop.DBus.Introspectable 
interface. This interface has an Introspect method that can be 
called to retrieve introspection XML for the object.

#### AllJoyn entity relationship

It is useful and important to understand how different high-level 
AllJoyn entities relate to each other. 

The following figure captures the relationship between various 
high-level AllJoyn entities including device, application, 
objects, interfaces, and interface members. 

![alljoyn-entity-relationship][alljoyn-entity-relationship]

**Figure:** AllJoyn entity relationship

An AllJoyn-enabled device can support one or more AllJoyn 
applications. Each AllJoyn application supports one or more 
AllJoyn objects that implement desired application functionality. 
Application functionality can include providing AllJoyn 
services or consuming AllJoyn services, or both. Accordingly, 
objects supported by the AllJoyn application can be service 
objects, proxy objects, or combination of both. A service 
object exposes its functionality via one or more AllJoyn 
interfaces. Each AllJoyn interface can support one or more 
of methods, signals, and properties.

An AllJoyn service is implemented by one or more AllJoyn 
service objects. An AllJoyn service object can implement 
functionality for one or more AllJoyn services. Hence, AllJoyn 
service and AllJoyn service object have an n:n relationship as 
captured in the following figure.

![alljoyn-service-service-object-relationship][alljoyn-service-service-object-relationship]

**Figure:** AllJoyn service and AllJoyn service object relationship

### AllJoyn services

An AllJoyn application can support one or more service frameworks 
and some application layer services.

#### AllJoyn service framework

AllJoyn service frameworks provide some of the core and 
fundamental functionality developed as enablers for higher-layer 
application services. Service frameworks sit on top of the AllJoyn 
router and provide APIs to application developers to invoke their 
functionality. Initial AllJoyn service frameworks include 
Configuration service framework, Onboarding service framework, 
Notification service framework, and Control Panel service framework. 

**NOTE:** Service frameworks are also referred to as base services.

Example: a refrigerator application can make use of the Onboarding 
service framework to onboard a refrigerator to a home network 
and send out notifications to user devices using the Notification 
service framework.

#### Application layer service

An application layer service is an app-specific service provided 
by the AllJoyn application to achieve desired application 
layer functionality. These application layer services can 
make use of service frameworks to achieve their functionality.

Example: a refrigerator application can offer an application 
layer service to change refrigerator and freezer temperature. 
This service can make use of the Notification service framework 
to send out a notification when the temperature setting goes 
out of a specified range to notify the user.

### AllJoyn transport

The AllJoyn Transport is an abstract concept that enables 
connection setup and message routing across AllJoyn applications 
via AllJoyn routers. The AllJoyn transport logic in turn 
supports transmitting messages over multiple underlying 
physical transports including TCP transport, UDP transport 
and Local Transport (e.g., UNIX domain sockets).

The AllJoyn transport logic delivers the advertisement and 
discovery messages based on specified list of transports by 
the app.  Similarly, the AllJoyn transport enables session 
establishment and message routing over multiple underlying 
transports based on transport selection made by the application. 
The set of underlying transports supported by the AllJoyn 
transport is specified by a TransportMask as captured in 
[AllJoyn Transport in Networking Model][alljoyn-transport-in-networking-model].
If an app does not specify any transport(s), the AllJoyn 
transport value defaults to TRANSPORT_ANY.

See [AllJoyn Transport][alljoyn-transport-section] for more information.

### Advertisement and discovery 

The AllJoyn framework provides a means for applications to 
advertise and discover AllJoyn services. The AllJoyn discovery 
protocol manages the dynamic nature of services coming in 
and going out of the proximal AllJoyn network and notifies 
AllJoyn applications of the same. The AllJoyn framework 
leverages an underlying transport-specific mechanism to 
optimize the discovery process. The AllJoyn framework makes 
use of IP multicast over Wi-Fi for service advertisement and 
discovery. The details of underlying mechanism are hidden 
from the AllJoyn applications.

The following sections details the ways that applications 
can use to advertise and discover services over the AllJoyn framework.

#### Name-based discovery

In the name-based discovery, advertisement and discovery 
typically happens using a well-known name. In this approach, 
the unique name can also be used for discovery per an application's 
discretion (e.g., if a well-known name was not assigned). 
A provider application advertises supported well-known names 
over the proximal AllJoyn network leveraging the underlying 
transport specific mechanism (IP multicast over Wi-Fi). 
These well-known names get advertised as part of an advertisement 
message generated by the AllJoyn router. 

A consumer application interested in a given well-known name 
can ask the AllJoyn router to begin discovering that name. 
When the provider app advertising that name comes in the 
proximity, the AllJoyn router receives the corresponding 
advertisement. The AllJoyn router then sends a service discovery 
notification to the application for the well-known name.

The advertisement message carries connectivity information 
back to the provider app. After discovery, the consumer app 
can request AllJoyn router to establish a connection with 
the discovered provider app for consuming the service. 
The AllJoyn router uses the connectivity information to 
connect back to the provider app.

#### Announcement-based discovery

Since AllJoyn services are ultimately implemented by one or 
more interfaces, service discovery can be achieved by discovering 
associated AllJoyn interfaces. In the announcement-based discovery, 
advertisement and discovery happens using AllJoyn interface names. 
This mechanism is intended to be used by devices to advertise 
their capabilities.

The provider application creates a service announcement message 
specifying a list of AllJoyn interfaces supported by that 
application. The service announcement message is delivered 
as a broadcast signal message using sessionless signaling 
mechanism (described in detail in [Sessionless Signal][sessionless-signal-section]).

Consumer applications interested in making use of AllJoyn 
services look for these broadcast service announcement messages 
by specifically registering its interest in receiving these 
announcements with AllJoyn router. When the consumer device 
is in the proximity of a provider, it receives the service 
announcement that contains the AllJoyn interfaces supported 
by the provider.

The AllJoyn router maintains connectivity information to 
connect back to the provider from which the service announcement 
message was received. After discovery, the consumer app can 
request the AllJoyn router to establish a connection with 
the provider app that supports the desired interfaces for 
consuming the service. The AllJoyn router uses connectivity 
information to connect back to the provider app.

#### Discovery enhancements in the 14.06 release

The AllJoyn discovery feature was enhanced in the 14.06 
release to enable the discovery of devices/apps that support 
a certain set of interfaces in a more efficient way. The 
enhanced discovery is referred to as Next-Generation Name 
Service (NGNS). NGNS supports a multicast DNS (mDNS)-based 
discovery protocol that enables specifying AllJoyn interfaces 
in an over-the-wire discovery message. In addition, the mDNS-based 
protocol is designed to provide discovery responses over unicast 
to improve performance of the discovery protocol and minimize 
overall multicast traffic generated during the AllJoyn discovery process. 

The presence detection mechanism for AllJoyn devices/apps 
has been enhanced by adding an explicit mDNS-based ping() 
message that is sent over unicast to determine if the remote 
endpoint is still alive. The ping() mechanism is driven by 
the application based on application logic.

### AllJoyn session

Once a client discovers an AllJoyn service of interest, 
it must connect with the service in order to consume that 
service (except for the Notification service framework, 
which relies completely on sessionless signals). Connecting 
with a service involves establishing an AllJoyn session with 
that service. A session is a flow-controlled data connection 
between a consumer and provider, and as such allows the client 
to communicate with the service. 

A provider app advertising a service binds a session port with 
the AllJoyn bus and listens for clients to join the session. 
The action of binding and listening makes the provider the 
session host. The session port is typically known ahead of 
time to both the consumer and the provider app. In the case 
of announcement-based discovery, the session port is discovered 
via the Announcement message. After discovering a particular 
service, the consumer app requests the AllJoyn router to 
join the session with the remote service (making it a session 
joiner) by specifying the session port and service's unique 
name/well-known name. After this, the AllJoyn router takes 
care of establishing the session between the consumer and 
the provider apps. 

Each session has a unique session identifier assigned by the 
provider app (session host). An AllJoyn session can be one 
of the following:

* Point-to-point session: A session with only two participants-the 
session host and the session joiner. 
* Multi-point session: A session with multiple participants-a 
single session host and multiple session joiners.

After session establishment, the consumer application must 
create a proxy object to interact with the provider app. The 
proxy object should be initialized with a session ID and the 
remote service object path. Once complete, the consumer app 
can now interact with the remote service object via this proxy object.

### Sessionless signals

The AllJoyn framework provides a mechanism to broadcast signals 
over the proximal AllJoyn network. A broadcast signal does 
not require any application layer session to be established 
for delivering the signal. Such signals are referred to as 
sessionless signals and are broadcast using a sessionless 
signaling mechanism supported by the AllJoyn router. 

The delivery of sessionless signals is done as a two-step process. 

1. The provider device (sessionless signal emitter) advertises 
that there are sessionless signals to receive. 
2. Any consumer devices wishing to receive a sessionless 
signal will connect with the provider device to retrieve new signals. 

Using the sessionless signal mechanism, a provider application 
can send broadcast signals to the AllJoyn router. The AllJoyn 
router maintains a cache for these signals. The content of the 
sessionless signal cache is versioned. The AllJoyn router sends 
out a sessionless signal advertisement message notifying other 
devices of new signals at the provider device. The sessionless 
signal advertisement message includes a sessionless signal-specific 
well-known name specifying the version of the sessionless signal cache. 

The consumer app interested in receiving the sessionless signal 
performs discovery for the sessionless signal-specific well-known 
name. The AllJoyn bus on the consumer maintains the latest sessionless 
signal version it has received from each of the provider AllJoyn router. 
If it detects a sessionless signal advertisement with an updated 
sessionless signal version, it will fetch new set of sessionless 
signals and deliver them to the interested consumer applications.

#### Sessionless signal enhancement in the 14.06 release

The sessionless signal feature was enhanced in the 14.06 release 
to enable a consumer application to request sessionless signals 
from provider applications that support certain desired AllJoyn 
interfaces. The following sessionless signal enhancements were made:

* The sessionless signal advertised name was enhanced to add 
<INTERFACE> information from the header of the sessionless signal. 
Consumers use this to fetch sessionless signals only from those 
providers that are emitting signals from the <INTERFACE> it 
is interested in. A separate sessionless signal name is advertised 
one for each unique interface in the sessionless signal cache.
* A mechanism was added for the consumer app to indicate receiving 
Announce sessionless signal only from applications implementing 
certain AllJoyn interfaces.

Sessionless signals are only fetched from those providers that 
support desired interfaces. This improves the overall performance 
of the sessionless signal feature.

### Thin apps

An AllJoyn Thin App is designed for use in embedded devices 
such as sensors. These types of embedded devices are optimized 
for a specific set of functions and are constrained in energy, 
memory and computing power. An AllJoyn thin app is designed to 
bring the benefits of the AllJoyn framework to embedded systems. 
The thin app is designed to have a very small memory footprint. 

A thin AllJoyn device makes use of lightweight thin application 
code along with the AllJoyn Thin Core Library (AJTCL) running 
on the device. It does not have an AllJoyn router running on 
that device. As a result, the thin app must use an AllJoyn 
router running on another AllJoyn-enabled device, essentially 
borrowing the AllJoyn router functionality running on that device. 

At startup, the thin application discovers and connects with 
an AllJoyn router running on another AllJoyn-enabled device. 
From that point onwards, the thin app uses that AllJoyn router 
for accomplishing core AllJoyn functionality including service 
advertisement/discovery, session establishment, signal 
delivery, etc. If a thin app is not able to connect to previously 
discovered AllJoyn router, it attempts to discover another 
AllJoyn router to connect to.

An AllJoyn thin app is fully interoperable with an AllJoyn 
standard application. It uses same set of over-the-wire protocols 
as a standard AllJoyn app. This ensures compatibility between 
the thin app and standard apps. An AllJoyn standard app communicating 
with a thin app will not know that it is talking to a thin app 
and vice versa. However, there are some message size constraints 
that apply to the thin app based on available RAM size.

### AllJoyn protocol version

Functionality implemented by the AllJoyn Router is versioned through an AllJoyn
Protocol Version (AJPV) field. The following table shows the AJPV for various
AllJoyn releases; unless otherwise noted the AJPV for the major release version
applies to all the patch release versions as well. The AJPV is exchanged
between routers as part of the BusHello messaging during the AllJoyn session
establishment and between the leaf and routing node when the leaf node connects
to the router. This field is used by the core libraries to identify
compatibility with the router, and specifically by thin apps to determine
whether or not to connect to a particular router or keep searching for another
one.  It is also used by the router to determine if functionality is available
at the leaf (e.g. self-join, SessionLostWithReason, etc.)

** Table: ** AllJoyn Release to Protocol Version mapping

| &#160; Release version &#160; | &#160; AJPV &#160; |
|:------------------------------:|:-----------------:|
|        legacy 03.04.06         |        9          |
|        v14.02                  |        9          |
|        v14.06                  |        10         |
|        v14.12                  |        11         |
|        v15.04                  |        12         |


[list-of-subjects]: /learn/core/system-description/
[message-format]: /learn/core/system-description/data-exchange#message-format
[alljoyn-interfaces]: #alljoyn-interfaces
[sessionless-signal-section]: /learn/core/system-description/sessionless-signal
[thin-apps]: /learn/core/system-description/thin-apps
[alljoyn-transport-section]: /learn/core/system-description/alljoyn-transport
[alljoyn-transport-in-networking-model]:  /learn/core/system-description/alljoyn-transport#alljoyn-transport-in-networking-model


[ioe-network-example]: /files/learn/system-desc/ioe-network-example.png
[alljoyn-network]: /files/learn/system-desc/alljoyn-network.png

[alljoyn-bundled-standalone-router-examples]: /files/learn/system-desc/alljoyn-bundled-standalone-router-examples.png
[logical-router-bus-mapping]: /files/learn/system-desc/logical-router-bus-mapping.png
[alljoyn-bus]: /files/learn/system-desc/alljoyn-bus.png
[distributed-alljoyn-bus]: /files/learn/system-desc/distributed-alljoyn-bus.png
[uniquename-assignment-1]: /files/learn/system-desc/uniquename-assignment-1.png
[uniquename-assignment-2]: /files/learn/system-desc/uniquename-assignment-2.png
[uniquename-assignment-3]: /files/learn/system-desc/uniquename-assignment-3.png
[alljoyn-service-object-proxy-object]: /files/learn/system-desc/alljoyn-service-object-proxy-object.png
[alljoyn-core-library]: /files/learn/system-desc/alljoyn-core-library.png
[alljoyn-endpoints]: /files/learn/system-desc/alljoyn-endpoints.png
[alljoyn-entity-relationship]: /files/learn/system-desc/alljoyn-entity-relationship.png
[alljoyn-service-service-object-relationship]: /files/learn/system-desc/alljoyn-service-service-object-relationship.png



























