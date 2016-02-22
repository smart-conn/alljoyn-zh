# 学习AllJoyn

AllJoyn&trade;是一个协作开源软件架构，它使得开发者可以容易地开发出应用程序来发现附近设备并与设备直接地沟通，而所有的这些均不受设备品牌，种类以及操作系统的限制，也不需用到云端。正是因为AllJoyn架构在多功能的同时具有极大的灵活性，它必将有助于人们实现对物联网的种种构想。

## 近端网络

AllJoyn架构可以处理发现附近设备，建立设备间的会话，进行设备间安全通信等一系列复杂任务。它掩盖了物理层传输的细节，为开发者提供了简单易用的应用程序编程接口（API）。它支持多方接入会话的拓扑结构，包括端对端以和群组会话。其安全架构灵活，支持多种机制和信任模式。而且其数据传输形式灵活，支持原始套接字（raw socket）或带有明确定义的接口，方法，权限以及信号的虚拟对象。

## 灵活性

AllJoyn固有的灵活性是其最具识别度的特性。 AllJoyn被设计成可运行于多种平台：从小型嵌入式实时操作系统（RTOS）到全功能操作系统。它支持多种编程语言绑定和传输。由于AllJoyn 架构的开源特性，其灵活性可在未来被继续扩展以支持更多的传输，绑定和功能。

* 传输层: Wi-Fi, Ethernet, Serial, Power Line (PLC)
* 编程语言绑定: C, C++, Obj-C, Java
* 操作系统平台: RTOS, Arduino, Linux, Android, iOS, Windows, Mac
* 安全机制: 点到点加密 (AES128)和验证(PSK, ECDSA)

## 物联网通用语言

为了圆满实现物联网构想，设备和应用程序之间需要一种通用的方式或语言来互动和交流。我们相信这种通用语言会是AllJoyn架构：它能使不同公司的运行在不同操作系统和使用不同编程语言的设备粘合在一起，相互之间可以无缝交流和协同工作。

AllSeen Alliance与开源社区一起协作，正在定义并实现通用服务和针对某些特定用途的[接口][interfaces]，例如[接入新设备][onboarding], [发送提醒][notifs], 和[设备控制][controlpanel]. 开发者可选择将以上功能集成到他们的产品中，且不用担心与其他在AllJoyn生态圈中的设备与应用程序的兼容问题。

除通用服务与接口外，应用程序或设备也可实现私有接口。这样一来，应用程序既可调用通用服务与接口从而加入到AllJoyn大生态圈，也可通过AllJoyn架构与其他应用程序和设备进行私有会话。AllJoyn架构使这种灵活性成为可能。

## 可选的云

AllJoyn架构运行在本地网络，其运行并不需要云。应用程序和设备之间可直接进行快捷，高效、安全的通话。这意味着当设备就在本地网络中时，设备运行无需接入互联网而依赖云的就位。如果某些应用场景中需要云，AllJoyn架构可以通过一个[网关代理][gateway-agent]来提供支持。此架构的一大优势是其安全性：只有网管代理直接连到互联网，从而减少了连接到互联网的设备数量，因此缩小了攻击面。

## 发展前景

作为一个协作开源项目，AllSeen生态系统在不断成长和演进。伴随每一次版本更新越来越多的通用服务被添加进来，其中包括在多种平台上的实现。AllSean的发展前景巨大，在你们的帮助下AllJoyn 架构必会成为通用的物联网语言。

## 下一步

了解更多关于[应用实例][use-cases]的知识。 然后转到关于总体[结构][arch], [核心架构][core], 以及 [基础服务][services]方面的介绍.

[interfaces]: /learn/core#busobject
[onboarding]: /learn/base-services/onboarding
[notifs]: /learn/base-services/notification
[controlpanel]: /learn/base-services/controlpanel
[gateway-agent]: https://wiki.allseenalliance.org/gateway/gatewayagent

[use-cases]: /learn/use-cases
[arch]: /learn/architecture
[core]: /learn/core
[services]: /learn/base-services
