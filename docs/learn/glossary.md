# 术语表

### About Client

About 功能中用于从 About Sever 接收信息的工具。

### About feature

使用 AllJoyn&trade 架构构件的开放式工具，用于广播 AboutData。

软件分层结构使得设备可以在 Annoucement 和会话中发布 AllJoyn 服务架构的接口和元数据（AboutData）。

[了解更多][about]

### AboutData

AllJoyn Variant 值的字符串密钥的哈希结构（键－值对），它表示各种设备的详细信息。

### AboutIcon

用于表示可被通过 About 接口远程获取的设备的图像。

### AboutService

开发者／OEM 在客户端模式或者服务器模式使用的 About 功能的一个类。服务器模式用来建立广告 AboutData 的应用程序，AboutData 从 PropertyStore 读取。客户端模式用来建立应用程序发现广告的 AboutData。

### About Service

About feature 用于广播 About 细节的工具。传统意义上，这是一个嵌入式系统。当然它也可以是任何支持 AllJoyn 服务架构的设备，如 电视、手机等。

### Action

AllJoyn 设备执行的功能。

[了解更多][events-and-actions].

### Action descriptor 

Action 中包含的内省的可读描述。

### Action-receiving device

执行某项操作的设备。有关 [Events and Actions feature][events-and-actions]。

### Adapter

将接收的 UI 元素转换成 iOS UI 元素的控制面板服务架构。

### AJSCL

AllJoyn 标准内核资源库。包含完整 AllJoyn 信息总线工具的应用程序或 AllJoyn 守护进程。

### AJTCL

AllJoyn 精简内核资源库。在内存和处理能力受限的设备上运行的 AllJoyn 资源库版本。 它更倾向于支持采用 Micro Controller Unit (MCU) 供电的设备。

### AllJoyn App

使用 AllJoyn 架构的应用程序，无论是 AllJoyn Core API 或者 AllJoyn Service Framework。应用程序既可以使用 Standard Core 工具，也可以使用 Thin Core 工具。

[了解更多][apps-and-routers].

### AllJoyn client app

作为对等会话的一部分，此应用程序的作用是通过对等回话请求服务应用程序的信息。它与网页客户端并不相关，因为客户端应用程序也可能公开网络组件。

### AllJoyn core package

AllJoyn 软件包

### AllJoyn-enabled device

安装了 AllJoyn 应用程序的设备，使用 Notification 服务架构接口，发送和接收通知。

### AllJoyn framework

开源、端到端架构，支持低等规格网络概念和API。

[了解更多][core]

### AllJoyn interface

组成应用程序相互通信的方法、信号和属性的集合。


### AllJoyn Router

在 AllJoyn 网络中，相互通信的 AllJoyn 网络组件。它能使不同路由上的应用程序进行通信。

[了解更多][apps-and-routers].

### AllJoyn service (frameworks)

使用 AllJoyn 架构提供特定功能的全功能工具的集合。这些都是构建基块可以组合在一起以构建可互操作的设备
和应用程序。

### AllJoyn Standard Core Library

详见 [AJSCL][ajscl]

### AllJoyn Thin Core Library

详见 [AJTCL][ajtcl]

### Announcement

一种 sessionless signal，内容包含了用于发现的公开服务接口和元数据。

[了解更多][about]

### ARDP

AllJoyn Reliable Datagram Protocol（AllJoyn 可靠数据报协议）。ARDP 旨在提供基于 UDP 的第 4 层传输机制的可靠送达和命令。ARDP 特别用来保证在 UDP 传输中为 AllJoyn messaging 提供适当保障。ARDP 是效仿 RDP 建立的，并针对 AllJoyn 的需求进行了扩展。

### Audio service framework

开放工具，允许使用 AllJoyon 框架同步播放来自一个或多个源的音频。

### Authoring app

执行 IFTTT 规则的应用程序。有关 [Events and Actions feature][events-and-actions].


### Bandwidth-Delay Product

是指产品每秒钟数据连接的容量和它的往返延迟。它代表了网络中可被传输（有时叫做空中传输）的数据量。


### Base services

兼容各种应用程序和产品分类的一套服务架构。

### Bundled router

包含了同一个设备上应用程序的 AllJoyn Router。
AllJoyn Standard Library 支持 Bundled Router。

### CNG

下一代加密技术。Windows 功能。

### ConfigClient

AllJoyn Configuration 服务架构中的一个类。通过它，应用程序开发者可以远程配置运行了 AllJoyn ConfigService 的设备。

### ConfigData

AllJoyn Variant 值的字符串密钥的哈希结构（键－值对），它表示各种设备的详细信息。这些信息可以被远程更改，并被保存到永久存储层，如 NVRAM。

### ConfigService

软件开发者／OEM 建立应用程序的 AllJoyn Configuration 服务架构中的一个模块。这些应用程序开放了远程修改 ConfigData 的功能。ConfigData 从 PropertyStore 读取，并保持。


### Config Client

Configuration 服务架构的一个用于远程配置设备的工具。

### Config Server

一个 Configuration 服务架构的工具。用于开放 ConfigData，并允许其他设备远程修改。

### Configuration service framework

使设备能够为会话中 AllJoyn 服务架构的元数据（ConfigData）提供远程配置的软件层。

### Consumer

AllJoyn 网络中的 AllJoyn 应用程序消费服务。
设备收到通知后，可以通过某种方式告知用户，如手机和电视。

[了解更多][notification]

### Control Panel

Widgets的集合，使用户可以与设备进行互动。一个控制面板由一个控制者定义并发布；并且被受控者发现和显示。设备可以超过一个，可以被定义为支持某种语言。

[了解更多][controlpanel]

### Controllee

广告自己 Control Panel 接口的 AllJoyn 应用程序，所以其它 AllJoyn 设备能控制它。

### Controller

控制广告自己 Control Panel 接口应用程序的 AllJoyn 应用程序。

### ControlPanelEventsListener

用于监听控制面板相关事件的接口。

### DeviceControlPanel 

某一可控制设备的特定控制面板。

### DeviceEventsListener

监听会话事件的接口。

### Device-specific callbacks

由 OEM 提供给受控者的特定代码，用于处理控制者的请求，设定适当的值以执行操作。除此之外，它能通过调用 Control Panel 服务架构的相应功能，刷新控制者。

### Device passcode

保存在设备配置接口中的一个安全密码。该安全密码保证了信息被传送至设备，类似家中 WI-FI 的加密方式。密码可以被 OEM 或 最终用户提前填充。如果没有提供值，那么该字段将被默认设置为六个零。

[了解更多][onboarding]

### Distributed AllJoyn bus

AllJoyn Application 连接 AllJoyn Router，AllJoyn Router 之间彼此相连。这样的网络整体上被称为 Distributed AllJoyn 总线。

### Event

一条消息说明某些事情发生了（来自系统描述）。

AllJoyn 接口中包含可读描述的信号。其参数也可能包含描述字段。

### Event Consumer

为监听事件建立的应用程序。

### Event descriptor

事件附带的可读字段。

### Event-emitting device

发送事件的设备

### Event Picker app

当某个事件被发送时，让最终用户的程序执行操作的应用程序。

### GUID

一种随机生成的 128 位标识符，其发生冲突的可能几乎可以忽略不计。

### IFTTT

If This Then That（如果这样，那么）。一种逻辑结构，如果它为 “true”。并且符合某种特定情况，那么就进行一个操作，

### IoE application

查看[AllJoyn App][alljoyn-app] 

### IoE device

某个直连或者通过网关连接到英特网的设备。在本文件中意味着它是一个运行 AllJoyn 程序的设备。

### Logical distributed software bus

查看 [Distributed AllJoyn bus][distributed-alljoyn-bus]

### Notification message

一条包含了指定细节的信息，包括显示给用户的通知文本。

### Notification service framework

使设备能够发送和接收可消费通知的软件层。

[了解更多][notification]

### Offboarding

将 AllJoyn 设备移除个人网络的过程。同时也从 AllJoyn 设备内存中会移除个人 Access Point（AP） 的 SSID 和密码。

### Onboardee

An application using this side of the service framework is 
known as the Onboardee.
％％％％％％％％％％％％％％％％％％

An AllJoyn device that advertises that it implements the 
Onboarding interface.
％％％％％％％％％％％％％％％％

### Onboarder

An application using this side of the service framework is 
known as the Onboarder.％％％％％％％％％％％％％％％％％％％％％％％％％％

一个设备，通常是一个手持设备，与 onboardee 进行互动，并得到用来 onboard 的 Wi-Fi 凭据。

### Onboarding Client

Onboarding 服务架构的一个工具，用来远程 onboard 某设备。

### OnboardingData

包含相关网络配置信息和控制设备 onboard 进程的状态的一种结构。远程更新的详细信息被保存到如 NVRAM 之类的永久存储层。


### OnboardingService

Onboarding 服务架构中的一个模块，开发者／OEM 用其建立应用程序，这样的应用程序提供了远程修改固化在其中的 OnboardingData 的能力。

### Onboarding Server

Onboarding 服务架构的一种工具。它开放了 OnboradingData，允许设备远程修改并且控制 onboarding 进程。

### Onboarding service framework

一种软件层。它允许设备提供远程配置（OnboardingData）和控制（驱动模式）设备通过 AllJoyn 会话 onboard 一个 Wi-Fi AP 的进程。

使设备可以进入和退出（onboarding/offboarding）用户个人网络的一组功能。

### Personal AP

最终用户希望 AllJoyn 设备加入的目标网络。这通常是最终用户的个人网络（个人、工作、办公室网络等）

### Producer

在 AllJoyn 网络中提供服务的 AllJoyn 应用程序。
向如家庭电器的设备生成并发送通知的 AllJoyn 设备。


[了解更多][notification]

### PropertyStore

（根据 thin app document）一种为服务架构保留默认值和运行时的属性值的模块。

该模块保留的值以 AboutData 的形式返回，这时 AboutData 已经与 ConfigData 的值合并了。
### Proximal network

不包含云服务的网络

### Proximal IoE network

包含云服务的网络

### RDP

Reliable Data Protocol（可靠数据协议）。为基于包的应用程序提供的一种高效可靠的数据传输服务。

### Reliable event

一种保证传输到相关消费者的事件。

### Remote application

通常，AllJoyn 应用程序与另一个 AllJoyn 应用程序之间通信。Remote application 就是正在与此应用程序通信的远端应用程序。

### Rule

某一事件与用户希望的动作的一组匹配对。当设备支持 Event 接口，并通过 OEM 鉴权时，就会完成动作。



### Security

AllJoyn 应用程序用于相互鉴权并相互传递加密数据的一种架构。


### Service_Common

一个包含了多种服务共享的代码的模块，包括 PropertyStore API 的定义。

### Sessionless signal

一种广播的 AllJoyn 信号，可以被所有在最终用户家庭网络（如 Wi-Fi 网络）中监听的设备接收到。Sessionless sigal 会在网络中持续广播，直到 time-to-live (TTL) 时间超时。About 功能通过 sessionless signal 的方式在 Wi-Fi 网络中发送 Annoucement。

[了解更多][sessionless-signal]

### SoftAP

当 AllJoyn 设备没有连接到 Wi-Fi Access Point（不在线）时，它会以 access point 模式发送广播。

软件实现的 Access Point 允许设备既能在 AP 模式工作，也能在客户端模式工作。

### Standalone router

包含了主程序、liballjoyn.so 和 librouter.so。它不与 AllJoyn 应用程序绑定。

### Standard app

使用 AllJoyn Standard Library 的 AllJoyn 应用程序。

### Standard core

包含了 Standard library 和 router library

### SYN, SYN+ACK, ACK

三路握手建立连接协议的几个部分。用于 TCP 和 ARDP。


### Thin app

包含 AllJoyn thin core library 的 AllJoyn 应用程序。

### Thin core

包含 Thin library

### Thin Library service app

作为会话的一部分公开一组功能的 AllJoyn 应用程序。它不会关联到 web 服务，因为 web 服务可能会作为客户端多次使用（由工具而定）。AllJoyn 服务的功能由其使用的一套 AllJoyn 服务架构而定。

### Translator

开发者使用的一种回调方法，提供了语言翻译和字符串操作功能。

[了解更多][events-and-actions]

### User

有很多情况。

在 Events and Actions 中，他是使用有 Event Picker 应用程序的设备的人

### Well-Known Name (WKN)

Well Known name 是 AllJoyn 发现 annoucement 的基础。通常应用程序会使用 About annoucement 而不是更低级别的 Well-Known Name。

### Widget

控制面板中的用于表示接口的 UI 元素。它以图形的方式调用设备功能和／或访问设备属性。

### WKN

[about]: /learn/core/about-announcement
[apps-and-routers]: /learn/architecture#apps-and-routers
[events-and-actions]: /learn/core/events-and-actions
[core]: /learn/core
[notification]: /learn/base-services/notification
[sessionless-signal]: /learn/core#sessionless-signal
[controlpanel]: /learn/base-services/controlpanel
[onboarding]: /learn/base-services/onboarding
[ajscl]: #ajscl
[ajtcl]: #ajtcl
[alljoyn-app]: #alljoyn-app
[distributed-alljoyn-bus]: #distributed-alljoyn-bus
