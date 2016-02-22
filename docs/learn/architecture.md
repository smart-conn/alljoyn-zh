# 结构

## 网络结构

AllJoyn&trade; 架构在本地网络上运行，使设备和应用程序能够广播自己的存在和发现彼此。本小节解释了 AllJoyn 的网络结构和不同 AllJoyn 组件之间的关系。

### 应用和路由器

AllJoyn 架构包括 AllJoyn 应用和 AllJoyn 路由器（Router），简称应用和路由。应用和路由之间可以相互通信。应用只能通过路由来与另一个应用进行通信。

应用和路由可以属于同一个物理设备，也可以分布在不同的设备上。从 AllJoyn 的角度来看，两者之间没有区别。在现实中，存在三个常见的拓扑结构：

1. 单个应用程序使用自己的路由。在这种情况下，根据路由与应用之间的绑定关系，路由被称之为“绑定路由”。在如 Android 和 iOS 的手机操作系统，以及如 Mac OS X 和 Windows 的桌面操作系统上运行的 AllJoyn 应用通常都属于“绑定路由”这一类型。

2. 在同一设备上的多个应用程序使用一个路由。在这种情况下，这个路由被称之为“独立路由”，它通常在后台／服务进程中运行。这样的情况多发生在 Linux 系统中。在 Linux 系统中，AllJoyn 路由作为守护进程（daemon process）运行，其他 AllJoyn 应用则连接到独立路由。通过让同一设备上的多个应用连接到一个共用路由上，设备减少了对总体资源的消耗。

3. 某个应用使用不同设备上的路由。嵌入式设备（通常使用精简 AllJoyn 架构，之后会具体说明）通常属于这个类型，因为嵌入式设备通常没有足够强大的 CPU 和内存来运行 AllJoyn 路由。

![apps-and-routers][apps-and-routers]

### 传输 

AllJoyn 架构在本地网络上运行。目前它支持 Wi-Fi、Ethernet、serial 和 Power Line（PLC）。不过由于开发 AllJoyn 软件是与传输层协议不相关的，并且 AllJoyn 系统是一个不断完善的开源项目，因此在未来其中将会加入对更多传输方式的支持。

除此之外，可以开发桥程序将 AllJoyn 架构与其他类型的系统连接起来，如 Zigbee、Z-wave 和云。实际上，有一个工作组正在负责向 AllJoyn 标准服务中加入一个 [网关代理][gateway-agent]。

##  软件结构

AllJoyn 架构包含了 Alljoyn 应用和 AllJoyn 路由。

一个 AllJoyn 应用包含了以下组件：
* [AllJoyn 应用程序][app-code]
* [AllJoyn 服务架构库][services]
* [AllJoyn 核心库][core]

[AllJoyn 路由][router] 既可以是独立的，也可以绑定到 AllJoyn 核心库。

![alljoyn-software-architecture][alljoyn-software-architecture]

###  AllJoyn 路由

AllJoyn 路由负责转发所有 AllJoyn 路由与应用之间的 AllJoyn 消息，其中包括不同传输方式之间的消息。

### AllJoyn 核心资源库

AllJoyn 核心资源库提供了与 AllJoyn 网络互动的最低级别的应用程序接口（API）。它为以下内容提供了直接访问方式：

* 通告和发现
* 建立会话
* 方法、属性和信号的接口定义
* 对象的创建和处理

开发人员使用这些应用程序接口（API）来实现 AllJoyn 服务架构或私有接口。

[了解关于 AllJoyn 核心架构的更多信息][learn-core]。

### AllJoyn 服务架构库

AllJoyn 服务架构实现了一套通用服务，例如新设备管理、通知和控制面板。通过使用通用 AllJoyn 服务架构，应用和设备能够进行适当的协作，从而完成特定的功能。

服务架构被分为如下工作组：

* [基础服务][base-services]
  * [新设备接入][onboarding]。为新设备加入 Wi-Fi 网络提供一个统一的方式。

  * [设置][configuration]。允许用户设置应用／设备的特定属性，如它的易记名。

  * [通知][notifications]。允许基于文本的通知在 AllJoyn 网络中的收发。也支持基于 URL 的声音和图像。

  * [控制面板][controlpanel]。允许设备广播一个虚拟的控制面板以被远程控制。

* [更多的服务架构][wiki]。Allseen 工作组正在积极开发更多的服务架构。

我们鼓励开发者尽可能地使用 AllJoyn 服务架构。如果现有的服务无法满足需求，那么我们鼓励开发者与 Allseen 联盟共同建立一个标准服务。在某些情况下，使用私有服务和接口或许是最佳的解决方案。然而，这些私有服务将不能与更广的 AllJoyn 生态系统的设备和应用互通和互惠。

### AllJoyn 应用代码

这是 AllJoyn 应用的应用逻辑。它既可以用 AllJoyn 服务架构库进行编写以实现更高级的功能，也可以用能直接访问 AllJoyn 核心 API 的 AllJoyn 核心资源库。

### 精简版与标准版

AllJoyn 架构提供了两种变种：

* 标准版。适用于非嵌入式设备，如 Android、iOS、Linux。
* 精简版。适用于资源受限的嵌入式设备，如 Arduino、ThreadX、内存受限的Linux。

![alljoyn-standard-and-thin][alljoyn-standard-and-thin]

## 编程模型

通常建议使用 AllJoyn 服务架构 API 来编写应用程序，这样便于与使用相同服务架构的设备相兼容。只有使用 AllSeen 工作组开发的 AllJoyn 服务框架编写的应用程序才能与 Allseen 生态系统中的其他应用或设备相兼容。

如果应用希望推出它们自己的服务，可以通过直接使用 AllJoyn 核心 API 来实现。在这样做时，建议遵循事件和动作（Events and Actions）规则以实现应用与其他 AllJoyn 设备间的自主互动。

应用程序可以同时使用服务架构与核心 API。

[了解关于事件和动作（Events and Actions）的更多信息][events-and-actions].

[apps-and-routers]: /files/learn/apps-and-routers.png

[learn-core]: /learn/core

[app-code]: #alljoyn-app-code
[services]: #alljoyn-service-frameworks-libraries
[core]: #alljoyn-core-library
[router]: #alljoyn-router

[events-and-actions]: /learn/core/events-and-actions
[alljoyn-software-architecture]: /files/learn/alljoyn-software-architecture.png
[alljoyn-standard-and-thin]: /files/learn/alljoyn-standard-and-thin.png

[base-services]: /learn/base-services
[onboarding]: /learn/base-services/onboarding
[configuration]: /learn/base-services/configuration
[notifications]: /learn/base-services/notification
[controlpanel]: /learn/base-services/controlpanel

[wiki]: https://wiki.allseenalliance.org/
[gateway-agent]: https://wiki.allseenalliance.org/gateway/gatewayagent
