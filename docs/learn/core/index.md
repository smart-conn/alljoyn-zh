# Core Framework

此章节描述关于 AllJoyn&trade; 的核心概念。建议 AllJoyn 应用程序开发者深入了解此章节，即便只开发涉及 AllJoyn 服务架构的应用程序。
This section describes the AllJoyn&trade; Core concepts. A base high-level
understanding is suggested for anyone developing AllJoyn applications,
even if the application is only using AllJoyn Service Frameworks.

## Bus Attachment
AllJoyn 应用程序使用 AllJoyn Bus Attachment 进行交互以及连接到 AllJoyn 路由器。


AllJoyn Applications use and interact with the AllJoyn network
by first instantiating the AllJoyn Bus Attachment object and using
that object to connect to the AllJoyn Router.

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


[了解更多关于 About Announcements 的知识][about].

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

## 自省机制
自省机制内置于 AllJoyn 架构中。 
Introspection is built into the AllJoyn framework. APIs exist to easily introspect
a remote AllJoyn application to discover its object paths and objects;
its full interface including all methods; and parameters, properties,
and signals. Via introspection, one can learn about the remote device
and communicate with it without needing prior information about that
device.

An application's interfaces and associated methods, signals, and properties are
organized and defined by XML.  The schema for the introspection XML may be
found on the AllSeen Alliance website:

https://allseenalliance.org/schemas/introspect.xsd

## Events and Actions

Events and Actions is a convention for an application to describe its
events and actions. By adding simple metadata descriptors to signals
and methods, other AllJoyn applications can easily discover what
events the application will emit and what actions the application can
accept. This allows other applications to dynamically link events
and actions together between different devices to create more complex
if-this-then-that interactions.

[Learn more about Events and Actions][events-and-actions].

## Security

AllJoyn security occurs at the application level; there is no trust
at the device level. Each interface can optionally require security.
If required, authentication occurs on demand between the two apps
when a method is invoked or to receive a signal. Mulitple authentication
mechanisms are supported: PIN code, PSK, or ECDSA (Elliptical Curve Digital
Signature Algorithm). Once authenticated, all messages between these
two devices are encrypted using AES-128 CCM.

## Putting It All Together

An AllJoyn Application interacts with the AllJoyn framework via the
Bus Attachment. The application advertises its services via the About
Announcement, which lists metadata about the application, including the
supportedinterfaces. The UniqueName is returned in discovery to identify
the application.

When a remote application discovers an AllJoyn application, it can
create a session by connecting to a specific port. Both point-to-point
and multi-point sessions are supported.  The AllJoyn application
has the option of accepting or denying remote connection requests.

Prior to session creation, the application can create any number of bus
objects and place them at a specific object path. Each bus object can
implement a set of interfaces, defined by a set of methods, properties,
and signals.

After the session is created, the remote application will typically
communicate with the application by creating a local ProxyBusObject to
interact with the BusObject by invoking methods, getting and setting
properties, receiving signals.

![alljoyn-core-components][alljoyn-core-components]

In many cases, the client-side discovery, session setup and proxy object
management follow a simple, common pattern across applications. The Standard
Core library offers a convenience API for these cases with the
[Observer][observer-api-guide] class. The Observer class automates About
announcement parsing, session management and proxy object creation for the
client application.

## Learn more

* [Learn more about the AllJoyn Standard Core][aj-scl]
* [Learn more about the AllJoyn Thin Core][aj-tcl]
* [Learn more about the low-level details of the AllJoyn system][aj-system]

[about]: /learn/core/about-announcement
[events-and-actions]: /learn/core/events-and-actions
[alljoyn-core-sessions]: /files/learn/alljoyn-core-sessions.png
[alljoyn-core-busobject]: /files/learn/alljoyn-core-busobject.png
[alljoyn-core-components]: /files/learn/alljoyn-core-components.png

[aj-system]: /learn/core/system-description
[aj-scl]: /learn/core/standard-core
[aj-tcl]: /learn/core/thin-core
[observer-api-guide]: /develop/api-guide/core/observer/
