# AllJoyn&trade; Standard Core

## 概览
AllJoyn 框架是一个开源操作系统，为强调移动性，安全性以及动态配置的分布式应用程序提供运行环境。AllJoyn 系统可处理异构分布式 系统所固有的复杂问题，包括可移动性介入后所带来的特殊问题。借此帮助，程序开发者可以专注于解决核心问题。

AllJoyn 框架是“平台无关”的，其设计初衷为尽最大可能独立于运行设备的操作系统，硬件及软件特性。AllJoyn 框架被设计应用于 Microsoft Windows, Linux, Android, iOS, OS X, 以及 OpenWRT 平台。

亲近性与移动性一值保留在 AllJoyn 框架的设计理念当中。在移动环境中，设备会不停地进入，离开其他设备的邻域，与此同时，基础网络 容量也会发生变化。

AllJoyn SDKs 可在以下网址获得 (http://www.allseenalliance.org).

可用 AllJoyn 框架开发的应用程序类别仅仅受限于开发者的想像力。例如社交网络的拓展。用户可以建立个人简介并定义喜好和兴趣。在进入一个位置时， 支持 AllJoyn 的设备将会立即发现周边有着共同兴趣的同好，并与其建立通信网络以实现通信及信息交换。

现如今大多数设备都已集成 Wi-Fi，如此，当两名用户步入带有 Wi-Fi 热点的住宅或办公室时，他们的设备可连接到接触网络接入点，并公 开利用附加的网络容量。此外，这些设备还可以在其可见域内（取决于Wi-Fi的覆盖面积）对其他设备进行定位，同时可选择发现并使用其他 设备提供的各种服务。进一步，借助混合拓补结构，可以将一个应用了 AllJoyn Thin库的设备定义为应用蓝牙的传输机，由此便可与其他连 接到 Wi-Fi 的设备的应用程序进行交互。

另外一个例子是在实时多玩家游戏上的应用。例如，一款多玩家游戏可以运行在诸如笔记本电脑，平板电脑以及手持设备上，基础网络技术（例如 Wi-Fi）也不尽相同。这些所有的基础设施细节管理都可以经由 AllJoyn 架构处理，这使得游戏作者可以将全部精力投入游戏设计与 与实现上，而不必考虑点对点网络的复杂度。

作为 AllJoyn 生态系统的延伸， 还有很多应用程序创意。例如：

* 创建一个音乐播放列表，将歌曲共享到支持 AllJoyn 的车载音响系统中，或者将歌曲储存到家庭音响中 （受到数字版权保护）。
* 在活动或旅程结束后的的返程路上，将照片或其他媒体文件同步至支持 AllJoyn 的电视中
* 远程控制家用电器，例如电视机，数字监控系统，游戏机等。
* 在局域网内与笔记本电脑和台式机互动并分享内容。
* 在企业或教育场景中，完成同事或学生之间项目合作。
* 提供适地性服务，例如发放优惠券或 vcards. 


## AllJoyn 架构的优势

之前已提及，AllJoyn 架构是一个平台无关的系统，旨在简化分布在异构分布式系统上的邻近网络。

异构在这里不仅指代不同设备，还指运行在不同操作系统上，应用不同通信机制的不同种类的设备（例如，个人电脑，手持设备，平板电脑，消费类电子产品）。

### 开源
AllJoyn 架构一贯是开源开发。所有的 AllJoyn 代码库都开放检视并欢迎开发者进行补充和完善。如果 AllJoyn 架构缺失某一功能，你可 以添加。如果你在应用 AllJoyn 框架时遇到了困难或者技术问题，开源社区中的其他参与者会及时提供善意的帮助和指导。AllJoyn 的代码 库可以在以下网址获得 (http://www.allseenalliance.org).

### 操作系统无关性

AllJoyn 框架所提供的抽象层使其代码和应用程序可以在多种操作系统上运行。截止到本协议编写时，AllJoyn 框架已支持大多数 Linux 发行版包括 Ubuntu，并可以运行在 Android 2.3 （姜饼） 以及后续智能手机和平板电脑上。AllJoyn 框架代码也可运行在众多流行的微软 操作系统版本上，包括 Windows XP, Windows 7, Windows RT, 和 Windows 8. 此外，AllJoyn 框架代码可运行在 Apple 操作系统 iOS 以及 OS X上，以及诸如 OpenWRT 的嵌入式操作系统。

### 语言无关性

开发者目前使用 C++,Java, C#, JavaScript 以及 Objective-C 语言来创建应用程序。

### 物理网络及协议无关性

目前有许多可供联网设备使用的技术。AllJoyn 框架提供的抽象层定义了接入到基础网络站的清晰接口，使得主管软件工程师添加新的网络 实现工具变得相对容易。

例如，截止本协议编写时，Wi-Fi 联盟已经发布了支持点对点连接的 Wi-Fi Direct 技术的参数明细。Wi-Fi Direct 的网络模块正在密集的 被开发，很明显他会将 Wi-Fi Direct 以及预先关联的发现机制加入到可选网络选项中，供 AllJoyn 的开发者选择。

### 动态配置

移动设备在其寿命中常会经过多重地点，网络关联建立后又断开。这意味着 IP（Internet Protocal）地址会发生变化，网络接口会失效 ，服务也会不稳定。

当旧服务失效以及新服务出现时，AllJoyn 框架会发出提醒，如有必要也将建立新的关联。AllJoyn 框架已做好成为Wi-Fi Hotspot 2.0 （使移动电话，移动基站与 Wi-Fi 热点透明连接的技术）应用层的准备。

### 广告服务及发现
无论何时，设备的通信一定伴随着服务的推广与发现。在过去的静态网时代，设备间的通信由人工管理员做出明确的分配实现。现今时代，零配置网络的概念已十分流行，特别是借助于 Apple Bonjour 以及 Microsoft Universal Plug and Play 的帮助。

同时，我们也见到了如 Bluetooth Service Discovery Protocol 的已经存在的发现机制，以及正在发展的如 Wi-Fi Direct P2P 的发现机
制。AllJoyn 架构提供服务推广及发现的虚拟化，以简化定位及使用服务的过程。

### 安全性

在分布式应用程序中，安全性的自然模型是应用程序对应用程序的。不幸的事，在很多情况下网络安全模型并不适用于此模型。例如，蓝牙协议在完成设备配对时，会将双方设备中的所有应用程序全部授权。但如果双方设备比蓝牙耳机更复杂，如两台笔记本电脑通过蓝牙相连，这种授权模式将会变得不理想，转而需要更精细的粒度。AllJoyn 框架可对诸如此类强调应用对应用通信的复杂安全模型提供广泛支持。

### 对象模型以及远程方法调用

AllJoyn 框架应用了简单明了的对象模型以及远程方法调用（ RMI ）机制。AllJoyn 模式重新实现并扩展了 D-Bus 标准定义的有线协议，以实现对分布式设备的支持。


### 软件元件

伴随着标准化对象模型和有线协议，随之而来是将各类接口标准化为元件的能力。与 Java 接口声明机制所提供的与本地实例交互功能的实 现规范类似，AllJoyn 的对象模型提供了与编程语言无关的，与远程实现交互的规范。

有了成型的规范，就可以考虑众多接口的实现，从而使应用程序通信的标准建立变得可行。这项技术对软件组件很有帮助。软件部分是许多现代系统的中心，在类似 Android 的系统中则更为明显。在 Android 中定义了4种主要成分类型，作为仅有的能接入 Android Application Framework 的方式，同理在微软系统中，Component Object Model （ COM ）的继任版本被用作此功能。

为了实现在 [概述][overview]中所描绘的场景，我们期盼接口定义将会出现丰富的“海洋”。 AllJoyn 项目期望能与众多用户一起完成接口 的定义与标准化，并协助实现方法的共享。

## 概念性概述

AllJoyn 架构包含一系列可供使用的抽象层以便于理解并将子模块关联起来。其中只有很小部分的抽象层是理解基于 AllJoyn 的系统所必须的。

这一章提供了一个 AllJoyn 架构高层次的视角为之后的文档如 API 详解提供必要的基础。

### 远程方法调用

分布式系统是以完成同一目标为目的的使用一定形式的网络连接起来的独立计算机群，因此需要有一台机器上的一定地址空间下的某个程序以类似于本地调用的方式使用位于另一台物理分离的机器上的一个地址空间下的进程的能力。这通常是通过远程函数调用（RPC）或者以面向对象的方式来说称作远程方法调用（RMI）或远程调用（RI）的方式来完成。

RPC 的模型通常需要一个客户端也就是 RPC 的调用者和一个服务器端（AllJoyn模型中称为服务器）也就是实际上执行所期望的远程函数的 程序。调用者执行一个看上去和本地系统上的函数一样的客户端的存根，它会将函数的参数进行打包（称为对参数的编组或串行化）为某个格式的消息然后发送给 RPC 系统将其通过如传输控制协议（TCP）一类的标准机 制送达服务端。在远端机器上会有相应的 RPC 系统在运行 ，参数将会被反编组（反序列化）并将消息发送给服务端存根，它会安排执行期望的函数。如果被调用的函数需要返回任何信息，会使用相似的过程将返回值转运给客户端存根并将其发送给原始的调用者。


注意这里并没有要求一个客户端或服务端功能只能在一个进程中实现。如果两个或更多线程实现同一个客户端或服务端功能的某个方面，这些线程被看成端点。在很多情况下 AllJoyn 应用会实现类似的功能，这时它们也会被作为端点来看待。AllJoyn 架构能够支持经典的客户端 和服务器端的功能，同时也能支持端到端的网络功能。

### AllJoyn bus
AllJoyn 系统中最基本的抽象概念就是 AllJoyn 总线。它提供了一中快速轻量的方法在分布式系统中传输编组过的消息。可以将 AllJoyn 总线看成是一种消息流的“高速公路”。下图从概念上展示了一个 AllJoyn 总线在同一个设备上的实例。

![prototypical-alljoyn-bus][prototypical-alljoyn-bus]

**Figure:** Prototypical AllJoyn bus

AllJoyn 总线原理上讲包含一下几点：
 • 图中较粗的黑色横线表示总线自身，竖线可以被理解为流经总线的消息流的源头和/或目的地“出口”。
 • 与总线的连接用六边形表示。和高速公路上的出口通常会被编号类似，每一个连接会被赋予一个唯一的名字。图中使用了简化的形式来命名连接用以说明。
 • 在很多情况下到总线的连接可以被认为是和线程共驻内存的。因此，唯一连接名:1.1可能被赋予给了一个运行着某个应用实例的线程所在的连接，而唯一连接名:1.4可能被赋予给了另一个运行着某个应用实例的线程所在的连接。AllJoyn 总线的目标就是使两个应用可以在不 需要处理底层具体的交换机制的情况下进行通信。一端的连接可以被认为是客户端存根而另一端则完成所有服务端存根所要求的所有任务。

原始的 AllJoyn 总线图表达了一个 AllJoyz 总线的案例，并描绘了软件总线为接驳在其上的不同组件提供进程间通信的具体实现方法。一
般情况下， AllJoyn 总线会被延伸到下图所示的设备中。当组件需要时，一条通信链路会建立在分布在智能手机上的逻辑总线片段和分布在 Linux 主机上的组件之间。

![device-device-comm][device-device-comm]

**Figure:** 由 AllJoyn 框架操作的设备与设备间通信

此通信链路由 AllJoyn 系统管理，可以由底层技术实现，诸如 Wi-Fi 或 Wi-Fi Direct. 在 AllJoyn 主线上作为主机运行的设备可以有多
个，但对于在分布式主线上的用户这些主机是透明的。从主线的一个组件的角度看，分布式 AllJoyn 系统就像是在设备本地的一条主线。

下图展示了分布式主线在用户角度可能呈现的样子。组件（例如标签为 `:1.1`的智能手机连接）可以对标签为`:1.7`的 Linux 主机进行远
程方法调用，而无需担心该组件所处的位置。

![dist-bus-local-bus][dist-bus-local-bus]

**Figure:** A distributed AllJoyn bus appears as a local bus

### 总线路由

就像设备对设备通信图描绘的那样，逻辑分布式总线会被分为数个片段，每一片都运行在不同的设备上。在 AllJoyn 中，实现对逻辑总线分
割功能的设备被称作 AllJoyn 路由。

守护进程在由 Unix 衍生出的系统中很常见，他被用于描述为电脑系统提供重要功能性的一些程序。在 Linux 系统中我们将 daemon 称为
独立路由。在 Windows 系统中更倾向于用“服务”这个词，但我们用 AllJoyn 路由来描述他。

![总线泡泡图][bubble-diagram-bus]

**Figure:** 相关的总线泡泡图

创建泡泡图可以使 AllJoyn 路由可视化。如之前的图所示，两个 AllJoyn 总线片段分别位于智能手机和 Linux 主机上。我们用户（ C ）以及服务（ S ）来标注到总线的连接，这里用到了 RMI 中 的用户／服务理念模型。实现核心分布式总线功能的 AllJoyn 路由被标记
为 （ D ）。图中的组件被转换成下图中的图标。

![alljoyn 泡泡图][alljoyn-bubble-diagram]

**Figure:** AllJoyn 泡泡图

图中的泡泡可被看作是运行在分布式系统上的电脑进程。左边的两个用户（ C ）和服务（ S ）进程运行在智能手机上。位于右侧的路由 器用于实现在 Linux 主机上的 AllJoyn 总线的本地片段。

如分布式 AllJoyn 总线图所示，这两个路由点协调着跨越逻辑总线的消息流，呈现到连接上的则是一个整体。与智能手机端的配置相同，在 Linux 主机上同样设有两个服务组件和一个用户组件。


在这种配置中，用户组件 C1 可以对服务组件 S1 进行远程方法调用，就像操作本地对象那样一样。序列化的参数由源头被运行在智能手机上
的路由器传送出本地总线片段。经过网络链路（对用户透明）发送到 Linux 主机的路由点。Linux 主机上的 AllJoyn 路由识别出参数目的地
为 S1，随后将参数解序列化并执行远程方法调用。如果需要返回值，此进程可被反转，将返回值送回客户端。

由于独立路由运行在后台进程中，不同于用户与服务所在的进程，在每一个进程中需要有一个路由“代表”。在 AllJoyn 框架中这些代表被称
为总线附件。


### 总线附件

每一个到 AllJoyn 总线的连接都会经过特定的 AllJoyn 组件，这个组件被称作总线附件。总线附件存在于每一个需要连接到 AllJoyn 软件
总线的进程当中。

当讨论软件组件时，常会在软件和硬件之间做一个类比。分布式 AllJoyn 总线上的本地片段就像是台式机上的硬件背板总线。硬件总线可传
送电子信号，与其他卡片有被称为连接体的接驳点。类比于硬件，AllJoyn 框架中的总线附件就像硬件中的连接体。

AllJoyn 总线附件是一个已定义语言的对象，对于客户端，服务或者一个点，他代表着分布式 AllJoyn 总线。例如，C++ 语言中为用户提供
了总线附件的一种实现方法，在 Java 中则有另一种实现方法来实现同一总线附件。由于 AllJoyn 框架添加了语言联编，更多已定义语言的 实现方法将会出现。

### 总线方法，总线属性及总线信号

AllJoyn 框架是一个面向对象的系统。在面向对象的系统中，总会提及调用对象上的方法 （因此，在提及分布式系统时也常会提及远程方法
调用）。在面向对象编程理念中，对象有一系列成员。这些对象方法或属性，在 AllJoyn 框架中被称为总线方法和总线属性。AllJoyn 框架
同时还有总线信号的概念，作为在对象中一些项目或状态变化的异步提醒。

为了做到客户，服务与点之间的通信安排透明化，调用总线方法和总线信号的参数一定要有规范，同时也需要对总线属性定义一些种类信息。在计算机科学中，调用方法或信号的输入和输出的类型被称为类型签名。

类型签名由字符串定义。同时类型签名可以描述字符串，以及所有主流编程语言中的数据类型和诸如数组，结构体的复合类型。类型签名的具体任务及使用已超出了此篇简介的介绍范围。总的来说，总线方法，信号或属性的类型签名可以告知底层 AllJoyn 系统如何将传输参数和返 回值从已序列化的表达方式中转换过来。

### 总线接口

在大多数面向对象系统当中，有内在共性的方法集和属性集会被编入小组。这些功能组的统一描述被称作接口。接口是一个在实现接口规范的
实体和外界世界之间的契约。依此，接口是通过合适的标准机构的标准化的候选人。各类服务（从电话到媒体播放控制）的接口的规范可以在网站上找到。根据 D-Bus 规范，这些接口由 XML 描述。

一个接口定义将一组主线方法，主线信号和主线属性，以及他们对应的类型签名集成到一个已命名的组中。在实际操作中，接口通常由客户，服务或者点的进程实现。当已命名的接口被实现后，在实现方和外界世界之间将生成一个内含的契约，并将支持所有该接口的总线方法，总线信号及总线属性。

接口名通常取用反转的域名。例如，一个 AllJoyn 的标准接口是`org.alljoyn.Bus`接口，由路由器创建，并为总线附件提供一些基础服务。

由任意命名空间的字符串创建接口名称是不可取的。接口名称字符串为一个特定的方法服务，不可以与其他相似的字符串相混淆，尤其是主线名称。例如，`org.alljoyn.sample.chat` 可以是一个恒定不变的可以由用户搜索到的主线名称。同时也可以是一个在总线对象中定义了与已定义了总线名称的总线附件相关的，可使用的方法，信号及属性的名字。被赋予名称的接口的存在暗含在主线名称的存在当中，虽然他们有时看起来完全相同，但他们是完全不同的两类。


### 总线对象和总线路径

总线接口为工作在分布式系统上的接口的声明提供了一个标准化的方式。总线对象为实现给定规范的接口提供了脚手架。总线对象存在于总线附件中，扮演通信终点的角色。

由于实现存在于任意给定总线附件的指定接口的方法不止一种，此处需要一个可以通过对象路径实现的附加结构，用以区分这些不同的接口实现方法。

就像存在于接口命名空间的接口名字符串一样，对象路径也存在于一个命名空间中。此命名空间被规划为一个树型结构，在文件系统中寻找路径的模型则是一个目录树。事实上，对象路径的路径分隔符是一个正斜杠 (/)，与 Unix 文件系统中相同。由于总线对象是总线接口的实现，
对象路径可以与其相应接口的命名规则保持一致。

In the case of an
interface defining a disk controller interface (for example,
`org.freedesktop.DeviceKit.Disks`), one could imagine a case
where multiple implementations of this interface were described
by the following object paths corresponding to an implementation
of the interface for two separate physical disks in a system:

```sh
/org/freedesktop/DeviceKit/Disks/sda1

/org/freedesktop/DeviceKit/Disks/sda2
```

### Proxy bus object

Bus objects on an AllJoyn bus are accessed through proxies.
A proxy is a local representation of a remote object that is
accessed through the bus. Proxy is a common term that is not
specific to the AllJoyn system, however you will often encounter
the term ProxyBusObject in the context of the AllJoyn framework
to indicate the specific nature of the proxy - that it is a
local proxy for a remotely located bus object.

The ProxyBusObject is the portion of the low-level AllJoyn code
that enables the basic functionality of an object proxy.

Typically, the goal of an RMI system is to provide a proxy that
implements an interface which looks just like that of the remote
object that will be called. The proxy object implements the
same interface as the remote object, but drives the process
of marshaling the parameters and sending the data to the service.

In the AllJoyn framework, the client and service software,
often through specific programming language bindings, provides
the actual user-level proxy object. This user-level proxy object
uses the capabilities of the AllJoyn proxy bus object to
accomplish its goal of local/remote transparency.

### Bus names

A connection on the AllJoyn bus acting as a service provides
implementations of interfaces described by interface names.
The interface implementations are organized into a tree of
bus objects in the service. Clients wishing to consume the
services do so via proxy objects, which use lower-level
AllJoyn proxy bus objects to arrange for delivery of bus method-,
bus signal- and bus property-related information across the
logical AllJoyn bus.

In order to complete the addressing picture of the bus,
connections to the bus must have unique names. The AllJoyn
system assigns a unique temporary bus name to each bus attachment.
However, this unique name is autogenerated each time the service
connects to the bus and is therefore unsuitable for use as
a persistent service identifier. There must be a consistent
and persistent way to refer to services attached to the bus.
These persistent names are referred to as *well-known names*.

Just as one might refer to a host system on the Internet by
a domain name that does not change over time (e.g., quicinc.com),
one refers to a functional unit on the AllJoyn bus by its well-known
bus name. Just as interface names appear to be reversed domain names,
bus names have the same appearance. Note that this is the source of
some confusion, since interface names and well-known bus names
are often chosen for convenience to be the same string.
Remember that they serve distinct purposes: the interface name
identifies a contract between the client and the service that
is implemented by a bus object living in a bus attachment;
and the well-known name identifies the service in a consistent
way to clients wishing to connect to that attachment.

To use a well-known name, an application (by way of a bus
attachment) must make a request to the bus router to use that
name. If the well-known name is not already in use by another
application, exclusive use of the well-known name is granted.
This is how, at any time, well-known names are guaranteed to
represent unique addresses on the bus.

Typically, a well-known name implies a contract that the associated
bus attachment implements a collection of bus objects and therefore
some concept of a usable service. Since bus names provide a unique
address on the distributed bus, they must be unique across the bus.
For example, one could use the bus name, `org.alljoyn.sample.chat`,
which would indicate that a bus attachment of the same name would
be implementing a chat service. By virtue of the fact that it
has taken that name, one could infer that it implements a
corresponding `org.alljoyn.sample.chat` interface in a bus
object located at object path `/org/alljoyn/sample/chat`.

The problem with this is that in order to "chat", one would
expect to see another similar component on the AllJoyn bus
indicating that it also supports the chat service. Since bus
names must uniquely identify a bus attachment, there is a
requirement to append some form of suffix to ensure uniqueness.
This could take the form of a user name, or a unique number.
In the chat example, one could then imagine multiple bus attachments:

```sh
org.alljoyn.sample.chat.bob

org.alljoyn.sample.chat.carol
```

In this case, the well-known name prefix `org.alljoyn.sample.chat.`
acts as the service name, from which one can infer the existence
of the chat interface and object implementations. The suffixes,
`bob` and `carol`, serve to make the instance of the well-known name unique.

This leads to the question of how services are located in the
distributed system. The answer is via service advertisement and discovery by clients.

### Advertisements and discovery

There are two facets to the problem of service advertisement
and discovery. As described above, even if the service resides
on the local segment of the AllJoyn bus, one needs to be able
to see and examine the well-known names of all of the bus attachments
on the bus in order to determine that one of them has a specific
service of interest. A more interesting problem occurs when
one considers how to discover services that are not part of
an existing bus segment.

Consider what might happen when one brings a device running
the AllJoyn framework into the proximity of another. Since the
two devices have been physically separated, there is no way for
the two involved bus routers to have any knowledge of the other.
How do the routing nodes determine that the other exists, and
how do they determine that there is any need to connect to
each other and form a logical distributed AllJoyn bus?

The answer is through the AllJoyn service advertisement and
discovery facility. When a service is started on a local device,
it reserves a given well-known name and then advertises its
existence to other devices in its proximity. The AllJoyn framework
provides an abstraction layer that makes it possible for a
service to do an advertise operation that may be communicated
transparently via underlying technologies, such as Wi-Fi, Wi-Fi
Direct, or other/future wireless transports. Neither the client
nor the service require any knowledge of how these advertisements
are managed by the underlying technology.

For example, in a contacts-exchanging application, one instance
of the application may reserve the well-known name
`org.alljoyn.sample.contacts.bob` and advertise the name.
This might result in one or more of the following: a UDP
multicast over a connected Wi-Fi access point, a pre-association
service advertisement in Wi-Fi Direct, or a Bluetooth Service
Discovery Protocol message. The mechanics of how the advertisement
is communicated do not necessarily concern the advertiser.
Since a contacts-exchange application is conceptually a
peer-to-peer application, one would expect the second phone to
also advertise a similar service, for example, `org.alljoyn.sample.contacts.carol`.

Client applications may declare their interest in receiving
advertisements by initiating a discovery operation. For example,
it may ask to discover instances of the contacts service as
specified by the prefix `org.alljoyn.sample.contacts`. In this case,
both devices would make that request.

As soon as the phones enter the proximity of the other, the
underlying AllJoyn systems transmit and receive the advertisements
over the available transports. Each will automatically receive
an indication that the corresponding service is available.

Since a service advertisement can receive over multiple
transports, and in some cases it requires additional low-level work
to bring up an underlying communication mechanism, there is another
conceptual part to the use of discovered services. This is the communication session.

### Sessions

The concepts of bus names, object paths, and interface names have
been previously discussed. Recall that when an entity connects to
an AllJoyn bus, it is assigned a unique name. Connections
(bus attachments) may request that they be granted a well-known name.
The well-known name is used by clients to locate or discover
services on the bus. For example, a service may connect to an
AllJoyn bus and be assigned the unique name `:1.1` by the bus.
If a service wants other entities on the bus to be able to find it,
the service must request a well-known name from the bus,
for example, `com.companyA.ProductA` (remember that a unique
instance qualifier is usually appended).

This name implies at least one bus object that implements some
well-known interface for it to be meaningful. Usually, the
bus object is identified within the connection instance by a
path with the same components as the well-known name (this is
not a requirement, it is only a convention). In the example,
the path to the bus object corresponding to the bus name
`com.companyA.ProductA` might be `/com/companyA/ProductA`.

In order to understand how a communication session from a client
bus attachment to a similar service attachment is formed and to
provide an end-to-end example, it is useful to compare and contrast
the AllJoyn mechanism to a more familiar mechanism.

#### Postal address analogy

In the AllJoyn framework, a service requests a human-readable name
so it can advertise itself with a well-known and well-understood label.
Well-known names must be translated into unique names for the
underlying network to properly route information, for example:

```
Well-known-name:org.alljoyn.sample.chat

Unique name::1.1
```

This tells us that the well-known name advertised as
`org.alljoyn.sample.chat` corresponds to a bus attachment that
has been assigned the unique name `:1.1`. One can think of this
in the same way as a business has a name and a postal address.
To continue the analogy, a common situation arises when a
business is located in a building along with other businesses.
In such a situation, one might find a business address further
qualified by a suite number. Since AllJoyn bus attachments are
capable of providing more than one service, there must also be
a way to identify more than one destination on a particular attachment.
A "contact port number" corresponds to the suite number destination
in the postal address analogy.

Just as one may send a letter by the national mail system
(U.S. Post Office, La Poste Suisse) or a private company
(Federal Express, United Parcel Service) and by different
urgencies (overnight, two-day, overland delivery), when contacting
a service using the AllJoyn framework, one must specify
certain desired characteristics of the network connection to
provide a complete delivery specification (e.g., reliably
delivered messages, reliably delivered unstructured data,
or unreliably delivered unstructured data).

Notice the separation of the address information and the
delivery information in the example  above. Just as one can
contemplate choosing several ways to get a letter from one place
to another, it will become evident that one can choose from several
ways to get data delivered using the AllJoyn system.

#### The AllJoyn session

Just as a properly labeled postal letter has "from" and "to"
addresses, an AllJoyn session requires equivalent "from" and "to"
information. In the case of an AllJoyn system, the from address
would correspond to the location of the client component and
the to address would relate to the service.

Technically, these from or to addresses, in the context of
computer networking, are called half-associations.
In the AllJoyn framework, this to (service) address has the following form:

```c
{session options, bus name, session port}
```

The first field, session options, relates to how the data is
moved from one side of the connection to the other. In an
IP network, choices might be TCP or UDP. In the AllJoyn framework,
these details are abstracted and so choices might be,
"message-based", "unstructured data", or "unreliable unstructured data".
A service destination is specified by the well-known name the
corresponding bus attachment has requested.

Similar to the suite number in the postal example, the AllJoyn
model has the concept of a point of delivery "inside" the
bus attachment. In the AllJoyn framework, this is called a
session port. Just as a suite number has meaning only within
a given building, the session port has meaning only within
the scope of a given bus attachment. The existence and values
of contact ports are inferred from the bus name in the same
way that underlying collections of objects and interfaces are inferred.

The from address, corresponding to the client information, is
similarly formed. A client must have its own half-association
in order to communicate with the service.

```c
{session options, unique name, session ID}
```

It is not required for clients to request a well-known bus name,
so they provide their unique name (such as `:1.1`). Since clients
do not act as the destination of a session, they do not provide
a session port, but are assigned a session ID when the connection
is established. Also during the session establishment procedure,
a session ID is returned to the service. For those familiar with
TCP networking, this is equivalent to the connection establishment
procedure used in TCP, where the service is contacted over a
well-known port. When the connection is established, the client
uses an ephemeral port to describe a similar half-association.

During the session establishment procedure, the two half-associations
are effectively joined:

```c
{session options, bus name, session port}	Service

{session options, unique name, session ID}	Client
```

Notice that there are two instances of the session options.
When communication establishment begins, these may be viewed
as supported session options provided by the service and
requested session options provided by the client. Part of
the session establishment procedure consists of negotiating
an actual final set of options to be used in the session.
Once a session has been formed, the half-associations of
the client and service side describe a unique AllJoyn
communication path:

```c
{session options, bus name, unique name, session ID}
```

During the session establishment procedure, a logical networking
connection is formed between the communicating routing nodes.
This may result in the creation of a wireless radio topology
management operation. If such a connection already exists,
it is re-used. A newly created underlying router-to-router
connection is used to perform initial security checks, and once
this is complete, the two routers have effectively joined the
two separate AllJoyn software bus segments into the larger virtual bus.

Because issues regarding end-to-end flow control of the underlying
connection must be balanced with topological concerns in some
technologies, the actual connection between the two communicating
endpoints (the "from" client and the "to" service) may or may
not result in a separate communication channel being formed.
In some cases it is better to flow messages over an ad hoc
topology and in some cases it may be better to flow messages
directly over a new connection (TCP/IP). This is another of the
situations that may require deep understanding of the underlying
technology to resolve, and which the AllJoyn framework happily
accomplishes for you. A user need only be aware that messages
are routed correctly over a transport mechanism that meets
the abstract needs of the application.

#### Self-join feature

In AllJoyn releases up to R14.06, it was impossible for applications
to join a session they themselves hosted. For applications that consume
information or services they themselves also provide, this created an
asymmetry: they had to treat the bus objects they hosted themselves
differently from those hosted by other peers. The self-join feature
removes this asymmetry by allowing applications to join the sessions
they themselves host. Consequently, a locally hosted bus object can be
treated in exactly the same way as a remotely hosted bus object.

#### Determining the presence of a peer - pinging and auto-pinging

Sometimes, a application needs to know which peers are present on the communication
channel ("the wire") and which aren't.  For this reason, a PING API was introduced in
version 14.06. This PING API allows to determine whether a peer is up or not.
However, for this API, the responsibility for using the PING API was with the
Application, which periodically needed to ping the peers. From Release 14.12 onwards,
an automatic PING or Auto-Pinger is introduced. This Auto-Pinger performs the
periodic peer detection, relieving  the application of having to do it.

### Bringing it all together

The AllJoyn framework aims to provide a software bus that
manages the implementation of advertising and discovering services,
providing a secure environment, and enabling location-transparent
remote method invocation. A traditional client/service arrangement
is enabled, and peer-to-peer communications follow by combining
the aspects of client and services.

The most basic abstraction in the AllJoyn framework is the
software bus that ties everything together. The virtual distributed
bus is implemented by AllJoyn routing nodes which are background
programs running on each device. Clients and services (and peers)
connect to the bus via bus attachments. The bus attachments
live in the local processes of the clients and services and
provide the interprocess communication that is required to
talk to the local AllJoyn router.

Each bus attachment is assigned a unique name by the system
when it connects. A bus attachment can request to be granted
a unique human-readable bus name that it can use to advertise
itself to the rest of the AllJoyn world. This well-known bus
name lives in a namespace that looks like a reversed domain
name and encourages self-management of the namespace.
The existence of a bus attachment of a specific name implies
the further existence of at least one bus object that implements
at least one interface specified by a name. Interface names are
assigned out of a namespace that is similar, but has a different
meaning than bus names. Each bus object lives in a tree structure
rooted at the bus attachment and described by an object path
that looks like a Unix filesystem path.

The following figure shows a hypothetical arrangement of how
all of these pieces are related.

![hypothetical-alljoyn-bus-instance][hypothetical-alljoyn-bus-instance]

**Figure:** Overview of a hypothetical AllJoyn bus instance

At the center is the dark line representing the AllJoyn bus.
The bus has "exits" which are the BusAttachments assigned
the unique names `:1.1` and `:1.4`. In the figure, the BusAttachment
with the unique name of `:1.1` has requested to be known as
`org.alljoyn.samples.chat.a` and has been assigned the corresponding
well-known bus name. The "a" has been added to ensure that
the bus name is unique.

There are a number of things implied by taking on that bus name.
First, there is a tree structure of bus objects that resides
at different paths. In this hypothetical example, there are
two bus objects. One is at the path `/org/alljoyn/samples/chat/chat`
and which presumably implements an interface suitable for chatting.
The other bus object lives at the path `/org/alljoyn/samples/chat/contacts`
and implements an interface named `org.alljoyn.samples.chat.contacts`.
Since the given bus object implements the interface, it must
provide implementations of the corresponding bus methods,
bus signals, and bus properties.

The number 42 represents a contact session port that clients
must use to initiate a communication session with the service.
Note that the session port is unique only within the context of
a particular bus attachment, so the other bus attachment in the
figure may also use 42 as its contact port as shown.

After requesting and being granted the well-known bus name,
a service will typically advertise the name to allow clients
to discover its service. The following figure shows a service making an
advertise request to its local router. The router, based on
input from the service, decides what network medium-specific
mechanism it should use to advertise the service and begins doing so.

![service-performs-advertise][service-performs-advertise]

**Figure:** Service performs an Advertise

When a prospective client wants to locate a service for consumption,
it issues a find name request. Its local router device, again
based on input from the client, determines the best way to
look for advertisements and probes for advertisements.

![client-requests-find-name][client-requests-find-name]

**Figure:** Client requests to Find Name

Once the devices move into proximity, they begin hearing
each other's advertisements and discovery requests over whichever
media are enabled. The following figure shows how the router hosting the
service hears the discovery requests and responds.

![router-reports-found-name][router-reports-found-name]

**Figure:** Router reports Found Name

Finally, the following figure shows the client receiving an indication
that there is a new router in the area that is hosting the desired service.

![client-discovers-service][client-discovers-service]

**Figure:** Client discovers service

The client and service sides of the developing scenario both
use methods and callbacks on their bus attachment object to
make the requests to orchestrate the advertisement and discovery
process. The service side implements bus objects to provide
its service, and the client will expect to use a proxy object
to provide an easy-to-use interface for communicating with
the service. This proxy object will use an AllJoyn ProxyBusObject
to orchestrate communication with the service and provide
for the marshaling and unmarshaling of method parameters
and return values.

Before remote methods can be called, a communication session
must be formed to effectively join the separate bus segments.
Advertisement and discovery are different from session establishment.
One can receive an advertisement and take no action. It is
only when an advertisement is received, and a client decides
to take action to join a communication session, that the
buses are logically joined into one. To accomplish this,
a service must create a communication session endpoint and
advertise its existence; and a client must receive that
advertisement and request to join the implied session.
The service must define a half-association before it advertises
its service. Abstractly this will look something like the following:

```c
{reliable IP messages, org.alljoyn.samples.chat.a, 42}
```

This indicates that it will talk to clients over a reliable
message-based transport, has taken the well-known bus name
indicated, and expects to be contacted at session port 42.
This is the situation seen in the hypothetical bus instance figure.

Assume that there is a bus attachment with the unique
name `:2.1` wanting to connect from a physically remote
routing node. It will provide its half association to the
system and a new session ID will be assigned and communicated
to both sides of the conversation:

```c
{reliable IP messages, org.alljoyn.samples.chat.a, :2.1, 1025}
```

The new communication session will use a reliable messaging
protocol implemented using the IP protocol stack which will
exist between the bus attachment named `org.alljoyn.samples.chat.a`
(the service) and the bus attachment named :2.1 (the client).
The session ID used to describe the session is assigned by
the system and is 1025 in this case.

As a result of establishing the end-to-end communication
session, the AllJoyn system takes whatever actions are
appropriate to create the virtual software bus shown in
the distributed bus figure. Note that this is a virtual picture, and what
may have actually happened is that a Wi-Fi Direct peer-to-peer
connection was formed to host a TCP connection, or a Wireless
access point was used to host a UDP connection, depending
on the provided session options. Neither the client nor
the service is aware that this possibly very difficult
job was completed for them.

At this point, authentication can be attempted if desired
and then the client and service begin communicating using the RMI model.

Of course, the scenario is not limited to one client on one
device and one service on another device. There may be any number
of clients and any number of services (up to a limit of device or
network capacity) combining to accomplish some form of
cooperative work. Bus attachments may take on both client
and service personalities and implement peer-to-peer services.
AllJoyn routers take on the hard work of forming a manageable
logical unit out of many disparate components and routing messages.
Additionally, the nature of the interface description and
language bindings allow interoperability between components
written in different programming languages.

## High-Level System Architecture

From the perspective of a user of the AllJoyn system, the most
important piece of the architecture to understand is that of
a client, service, or peer. From a system perspective, there
is really no difference between the three basic use cases;
there are simply different usage patterns of the same system-provided functionality.

### Clients, services, and peers

The following figure shows the architecture of the system from a user
(not AllJoyn router) perspective.

![client-service-peer-arch][client-service-peer-arch]

**Figure:** Basic client, service, or peer architecture

At the highest level are the language bindings. The AllJoyn system
is written in C++, so for users of this language, no bindings
are required. However, for users of other languages, such
as Java or JavaScript, a relatively thin translation layer
called a language binding is provided. In some cases, the binding
may be extended to offer system-specific support. For example,
a generic Java binding will allow the AllJoyn system to be
used from a generic Java system that may be running under
Windows or Linux; however, an Android system binding may
also be provided which more closely integrates the AllJoyn system
into Android-specific constructs such as a service component in
the Android application framework.

The system and language bindings are built on a layer of helper
objects which are designed to make common operations in the
AllJoyn system easier. It is possible to use much of the AllJoyn
system without using these helpers; however, their use is
encouraged since it provides another level of abstract interface.
The bus attachment, mentioned in the previous chapters, is a
critical helper without which the system is unusable. In addition
to the several critical functions provided, a bus attachment
also provides convenience functions to make management of
and interaction with the underlying software bus much easier.

Under the helper layer is the messaging and routing layer.
This is the home of the functionality that marshals and
unmarshals parameters and return values into messages that
are sent across the bus. The routing layer arranges for the
delivery of inbound messages to the appropriate bus objects
and proxies, and arranges for messages destined for other
bus attachments to be sent to an AllJoyn router for delivery.

The messaging and routing layer talks to an endpoint layer.
In the lower levels of the AllJoyn system, data is moved
from one endpoint to another. This is an abstract communication
endpoint from the perspective of the networking code.
Networking abstractions are fully complete at the top of the
endpoint's layer, where there is essentially no difference
between a connection over a non Wi-Fi radio (Bluetooth) and
a connection over a wired Ethernet.

Endpoints are specializations of transport mechanism-specific
entities called transports, which provide basic networking
functionality. In the case of a client, service, or peer,
the only network transport used is the local transport.
This is a local interprocess communication link to the
local AllJoyn bus router. In Linux-based systems, this is
a Unix-domain socket connection, and in Windows-based systems
this is a TCP connection to the local router.

The AllJoyn framework provides an OS abstraction layer to
provide a platform on which the rest of the system is built,
and at the lowest level is the native system.

### Routers

AllJoyn routers are the glue that holds the AllJoyn system together.
As previously discussed, routers are programs that run in
the background, waiting for interesting events to happen and
responding to them. Because these events are usually external,
it is better to approach the router architecture from a bottom-up
perspective.

At the lowest level of the router architecture figure below,
resides the native system. We use the same OS abstraction layer
as we do in the client architecture to provide common abstractions
for routers running on Linux, Windows, and Android. Running on
the OS abstraction layer, we have the various low-level networking
components of the router. Recall that clients, services, and
peers only use a local interprocess communication mechanism
to talk to a router, so it is the router that must deal with
the various available transport mechanisms on a given platform.
Note the "Local" transport in the router architecture figure which is the sole
connection to the AllJoyn clients, services, and peers running
on a particular host.

![router-arch][router-arch]

**Figure:** Basic router architecture

For example, a Bluetooth transport would handle the complexities
of creating and managing piconets in the Bluetooth system.
Additionally, a Bluetooth transport provides service advertisement
and discovery functions appropriate to Bluetooth, as well
as providing reliable communications. Bluetooth and other
transports would be added at this transport layer along side
the IP transport.

The wired, Wi-Fi, and Wi-Fi Direct transports are grouped under
an IP umbrella since all of these transports use the underlying
TCP-IP network stack. There are sometimes significant differences
regarding how service advertisement and discovery is accomplished,
since this functionality is outside the scope of the TCP-IP
standard; so there are modules dedicated to this functionality.

The various technology-specific transport implementations are
collected into a Network Transports abstraction. The Sessions module
handles the establishment and maintenance of communication
connections to make a collection of routers and AllJoyn applications
appear as a unified software bus.

AllJoyn routers use the endpoint concept to provide connections
to local clients, services, and peers but extend the use of
these objects to bus-to-bus connections which are the transports
used by routers to send messages from host-to-host.

In addition to the routing functions implied by these connections,
an AllJoyn router provides its own endpoints corresponding
to bus objects used for managing or controlling the software
bus segment implemented by the router. For example, when
a service requests to advertise a well-known bus name, what
actually happens is that the helper on the service translates
this request into a remote method call that is directed to
a bus object implemented on the router. Just as in the case
of a service, the router has a number of bus objects living
at associated object paths which implement specific named interfaces.
The low-level mechanism for controlling an AllJoyn bus is
sending remote method invocations to these router bus objects.

The overall operation of certain aspects of router operation
are controlled by a configuration subsystem. This allows a
system administrator to specify certain permissions for the
system and provides the ability to arrange for on-demand
creation of services. Additionally, resource consumption may
be limited by configuration of the router, allowing a system
administrator to, for example, limit the number of TCP connections
active at any given time. There are options which allow system
administrators to mitigate the effects of certain denial-of-service
attacks, by limiting the number of connections which are
currently authenticating, for example.

## Summary

The AllJoyn framework is a comprehensive system designed to
provide a framework for deploying distributed applications
on heterogeneous systems with mobile elements.

The AllJoyn framework provides solutions, building on proven
technologies and standard security systems, that address the
interaction of various network technologies in a coherent,
systematic way. This allows application developers to focus
on the content of their applications without requiring a large
amount of low-level networking experience.

The AllJoyn system is designed to work together as a whole
and does not suffer from inherent impedance mismatches that
might be seen in ad-hoc systems built from various pieces.
We believe that the AllJoyn system can make development and
deployment of distributed applications significantly simpler
than those developed on other platforms.

[overview]: #overview
[prototypical-alljoyn-bus]: /files/learn/standard-core/prototypical-alljoyn-bus.png
[device-device-comm]: /files/learn/standard-core/device-device-comm.png
[dist-bus-local-bus]: /files/learn/standard-core/dist-bus-local-bus.png
[bubble-diagram-bus]: /files/learn/standard-core/bubble-diagram-bus.png
[alljoyn-bubble-diagram]: /files/learn/standard-core/alljoyn-bubble-diagram.png
[hypothetical-alljoyn-bus-instance]: /files/learn/standard-core/hypothetical-alljoyn-bus-instance.png
[service-performs-advertise]: /files/learn/standard-core/service-performs-advertise.png
[client-requests-find-name]: /files/learn/standard-core/client-requests-find-name.png
[router-reports-found-name]: /files/learn/standard-core/router-reports-found-name.png
[client-discovers-service]: /files/learn/standard-core/client-discovers-service.png
[client-service-peer-arch]: /files/learn/standard-core/client-service-peer-arch.png
[router-arch]: /files/learn/standard-core/router-arch.png
