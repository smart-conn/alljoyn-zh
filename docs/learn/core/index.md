# Core Framework

此章节描述关于 AllJoyn&trade; 的核心概念。建议 AllJoyn 应用程序开发者深入了解此章节，即便只开发涉及 AllJoyn 服务架构的应用程序。
This section describes the AllJoyn&trade; Core concepts. A base high-level
understanding is suggested for anyone developing AllJoyn applications,
even if the application is only using AllJoyn Service Frameworks.

## Bus Attachment
AllJoyn 应用程序使用 AllJoyn Bus Attachment 进行交互以及连接到 AllJoyn 路由器。

## 推广和发现

AllJoyn 的应用程序通过两种机制来推广自己的服务： 发布公告以及著名名称。按照传输方式的可行性，AllJoyn 架构将应用相应的机制以确保应用程序可以被其他 AllJoyn 的应用程序发现。对于基于 IP 协议的传输层， mDNS 以及多路传送和 UDP 广播的结合将被使用。
AllJoyn applications can advertise its services via two mechanisms:
About Announcements and Well-Known Name. Depending on available
transports, the AllJoyn framework will use different mechanisms
to ensure that the application can be discovered by other AllJoyn
applications. For IP-based transports, mDNS and a combination of
multicast and broadcast UDP packets are used.

**About Announcements** 这是一种推荐的推广方式。About Announcements 允许应用程序对其所感兴趣的组织发布与该应用程序信息一致的一组元数据，例如样式，模型，支持接口种类，图标等等。

**Well-Known Name** 这是一种更加原始的推广方式。About Announcements 使用此机制。除对底层功能有特殊需求的应用程序外，应用程序推荐使用 About Announcements 机制。

在两种机制中，发现过程会对所识别的 UniqueName 返回一个 AllJoyn 应用程序列表。此列表将会被用于未来会话的创建。

[了解更多关于 About Announcements][about].

## 会话和端口

AllJoyn 架构负责处理不同 AllJoyn 应用程序之间联系的建立。通常情况下，一个正在被提供服务的应用程序会通过 About Announcements 机制来自我推广。远端应用程序在发现这个应用程序（以及他的 UniqueName ）时，可以创建会话，这个过程被称作 JoinSession. 提供服务的应用程序一方可以选择接受或拒绝 JoinSession 请求。

会话可以时端对端的，也可以是多端的。端对端会话允许建立一对一的连接，而多端会话允许多个设备／应用程序在一个对话内进行会话。

一个特殊端口将被用于建立会话。不同的端口被用来实现端对端会话和多端会话的连接结构。在下图左侧中，A 和 B 同时与 S端口 的 port 1端对端相连。在右侧中，A, B, C 全部已多端会话的方式连接在 S 端口的 port 2上。

![alljoyn-core-sessions][alljoyn-core-sessions]

## BusObject

AllJoyn 应用程序通过 BusObject 的抽象化进行交互通信。此抽象化与面向对象编程可自由转换，在这种情况下对象可通过已定义接口被创建。一般情况下，正在被提供服务的应用程序会创建一个 BusObject . 远端应用程序可在远端打开 BusObject 并调用其中的方法，类似于远端过程调用。

BusObject 可以实现一系列的接口。每一个接口清晰定义一系列的 BusMethods, BusProperties 和 BusSignals. BusMethods 允许远端实体调用其中的方法。BusProperties 可以被获得并设定。BusSignals 指正在被提供服务的应用程序所发出的信号。

BusObject 被附在一个特定的总线路径上。这样做可以使同一对象被附加在有着不同目的的不同的总线路径上，从而带来巨大的便利性。例如，一应用程序正在实现灶台控制服务，StoveBurner BusObject即可被附在多个总线路径上，如 ‘／range/left’ 和 ‘／range/right’可以被创建用来控制各个灶眼。

ProxyBusObject 对象可被远端应用程序创建，来实现对 BusObject 的接入。

总的来说，被提供服务的应用程序通过建立 BusObject 使他的一系列服务得以接入。远端应用程序与此应用程序建立会话并通过建立 ProxyBusObject，在特定的对象路径上连接到其 BusObject. 通过以上动作，远端应用程序可以调用 BusMethods， 接入 BusProperties 并接受 BusSignals.

![alljoyn-core-busobject][alljoyn-core-busobject]

## Sessionless Signal

Sessionless Signal 是一个无需手动建立会话的信号接收机制。在后台，Well-Known Name 推广机制被用来告知新信号的存在。远端实体自动建立临时会话接受数据，接受完成后会话将被移除。AllJoyn Core APIs 提供这些功能的虚拟化。

## 内省机制
内省机制内置于 AllJoyn 架构中。 API 被用于对远端 AllJoyn 应用程序的内省，从而发现其对象路径以及对象；此接口包括所有方法；所有参数及其对应属性，以及信号。通过自省机制，一方可了解远端机制并与其通信，而无需提前预知远端设备的具体信息。

应用程序的接口以及相关方法，信号和属性由 XML 语言组织并定义。关于 XML 内省模式可参阅 AllSeen Alliance 的网站：
https://allseenalliance.org/schemas/introspect.xsd

## Events and Actions

Events and Actions 是描述应用程序的事件与行为的常规。通过对信号和方法添加简单的元数据描述符，其他的 AllJoyn 应用程序可知晓该应用程序将要发出的事件，以及何种行为可被该应用程序所接受。此功能实现了不同设备间的应用程序与事件与行为的动态互联，从而实现更复杂的 if-this-then-that 接口。

[了解更多关于 Events and Actions][events-and-actions].

## 安全性

AllJoyn 的安全机制运作在应用级别；在设备级别并没有任何信任。每一个接口可选择是否要求安全机制。如果要求，在两应用程序之间调用函数或者接受信号时会要求认证。 认证支持多种安全机制，包括 PIN 码, PSK, 以及 ECDSA (Elliptical Curve Digital
Signature Algorithm). 一旦认证完成，所有设备间的交互信息将被用 AES－128 CCM 加密。

## Putting It All Together

AllJoyn 应用程序通过 Bus Attachment 与 AllJoyn 架构交互。应用程序通过 About Announcement 宣传其服务，这将会列出该应用程序的元数据，包括所有被支持的接口。在发现过程中，UniqueName 将会作为返回值用来识别应用程序。

当远端应用程序发现一个 AllJoyn 应用程序时， 一个由指定端口连接的会话可被创建。此会话可以是端对端的，也可以是多端的。AllJoyn 应用程序可以选择接受或拒绝该远端应用程序发出的会话请求。

在创建会话前，该应用程序可以建立任意个总线对象，并将其置入指定的对象路径中。每一个总线对象可实现由一系列方法，属性及信号定义的接口。

会话创建后，一般情况下远端应用程序会创建一个本地的 ProxyBusObject 通过调用方法，获取及设定属性以及接收信号与 BusObject 交互，从而实现与应用程序的通话。

![alljoyn-core-components][alljoyn-core-components]

许多情况下，客户端发现，会话建立以及代理对象管理都遵循一个通过应用程序的公共的，简单的模式。Standard Core 资源库提供一个简单易用的 API ， 定义在 [Observer][observer-api-guide] 类中。 Observer 类实现了客户应用程序对于 About Announcement 句法分析，会话管理以及代理对象创建的自动化操作。


## 了解更多

* [了解更多关于 AllJoyn Standard Core][aj-scl]
* [了解更多关于 AllJoyn Thin Core][aj-tcl]
* [了解更多关于 AllJoyn system 的底层细节][aj-system]

[about]: /learn/core/about-announcement
[events-and-actions]: /learn/core/events-and-actions
[alljoyn-core-sessions]: /files/learn/alljoyn-core-sessions.png
[alljoyn-core-busobject]: /files/learn/alljoyn-core-busobject.png
[alljoyn-core-components]: /files/learn/alljoyn-core-components.png

[aj-system]: /learn/core/system-description
[aj-scl]: /learn/core/standard-core
[aj-tcl]: /learn/core/thin-core
[observer-api-guide]: /develop/api-guide/core/observer/
