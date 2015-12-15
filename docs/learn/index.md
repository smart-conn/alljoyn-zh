# Learn

AllJoyn&trade;是一个开源的协作软件框架，他允许开发者开发可以发现附近设备并建立沟通的应用程序，并不受设备品牌，种类以及操作系统的限制，也不需用到云端。AllJoyn 框架的灵活性和多功能性可以将物联网概念带入现实。

## 近端网络

AllJoyn 框架可以处理发现附近设备，建立会话，建立安全通信机制等一系列复杂问题。他提取物理通信的细节信息并提供简单易用的应用程序编程接口，并支持多方接入会话结构，包括端对端以及群组会话。安全架构灵活，支持多种会话机制和信任模式。数据传输形式灵活，支持原始套接字或带有已定义接口，方法，权限以及信号的虚拟对象。

## 灵活性

AllJoyn 固有的灵活性是其最具识别度的特性。 AllJoyn 被设计应用于多种平台：从小型嵌入式实时操作系统到全功能操作系统， 并支持多种语言绑定和传输。由于 AllJoyn 框架的开源特性，其灵活性可在未来被继续扩展以支持更多传输，绑定和其他功能。

* 传输层: Wi-Fi, Ethernet, Serial, Power Line (PLC)
* 语言绑定: C, C++, Obj-C, Java
* 操作平台: RTOS, Arduino, Linux, Android, iOS, Windows, Mac
* 安全机制: peer-to-peer encryption (AES128) and authentication (PSK, ECDSA)

## 物联网通用语言

为了圆满实现物联网构想，设备和应用程序之间需要一种常用方式来实现互动和交流。 我们相信这种常用方式会是 AllJoyn 框架：一个将各种设备与众多公司黏合到一起，并且可以运行在多种操作系统，用不同编程语言实现的框架。总的来说，他解决问题。 

The AllSeen Alliance 与开源社区协同作用，正在定义并且实现常规服务的以及对应特定用途的[接口][interfaces]服务，例如[首次接入新设备][onboarding], [发送提醒][notifs], 和[设备控制][controlpanel]. 开发者可选择将以上功能集成到他们的产品中，且不用担心与其他 AllJoyn 生态圈设备与应用程序的兼容问题。

除常规服务与接口外，私密接口也可被应用程序或设备实现。如此，应用程序既可调用常规服务与接口参与 AllJoyn 大生态圈， 也可通过 AllJoyn 架构与其他应用程序和设备进行私密会话。这种灵活性因 AllJoyn 架构才得以实现。

## 可选云

AllJoyn 架构运行在本地网络，并不需要云功能介入。应用程序以及设备可进行快捷，安全的直接通话。这意味着当设备就在眼前时，无需跳出并等待云就位。如果一定需要云介入，AllJoyn 架构也提供支持，这需要通过一个[网关代理][gateway-agent]. 安全性是此架构的一大优势：只有网管代理被直连到互联网，这减少了连接到互联网的设备数量，从而减少了攻击面。

## 生长性

作为一个协作开源项目， AllSeen 生态系统在不断生长进化。伴随每一次版本更新越来越多的公共服务被添加进来，包括对多种平台的实现。AllSean 的势头强大，伴随着你们的帮助 AllJoyn 架构会成为非常流行的物联网语言。

## 下一步

了解更多关于[用例][use-cases] 的知识。 然后跳转到关于总体[结构][arch], [核心框架][core], 以及 [基础服务][services].
Learn more about [use cases][use-cases].

[interfaces]: /learn/core#busobject
[onboarding]: /learn/base-services/onboarding
[notifs]: /learn/base-services/notification
[controlpanel]: /learn/base-services/controlpanel
[gateway-agent]: https://wiki.allseenalliance.org/gateway/gatewayagent

[use-cases]: /learn/use-cases
[arch]: /learn/architecture
[core]: /learn/core
[services]: /learn/base-services
