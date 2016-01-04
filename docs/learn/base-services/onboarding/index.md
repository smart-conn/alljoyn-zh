# 加入服务

加入服务为被带入 Wi-Fi 网络的新设备提供普适简便的加入方式。对于像 SmartPlug 这样的用户接口有限的设备，加入服务会更加实用。


## 工作原理

现存的加入机制只使用 Wi-Fi, 但系统在变得与使用其它标准的设备越来越相关的时候，可以进化到使用其它的硬件（例如 BTLE）.

所支持的两个角色：

* **Onboardee**. 指的是未被配置并需要被带入 Wi-Fi 网络的的设备，

* **Onboarder**. 指的是配置 Onboardee 所用的设备，通常是一个移动式的应用程序或是‘一台电脑’。

下面展示了加入设备的方法

### 1. Onboardee 广播自己的 SSID

当 Onboardee 设备第一次接入时，他会通过 Wi-Fi 广播其 SSID. 此 SSID 以 “AJ\” 或者 “\_AJ” 为前缀，意思是该设备支持 AllJoyn&trade 的加入服务。

### 2. Onboarder 连接到 Onboardee

Onboarder 将会通过查找带有 "AJ\_" 或者 "\_AJ" 的 SSID 来扫描未被配置的 AllJoyn 设备。用户可以选择操作一个特定的 Onboardee 设备。第一步是
连接到该 Onboardee 设备的 SSID 上。根据 Onboarder 平台，这件事可以由应用程序自动完成。


### 3. Onboarder 发送 Wi-FI 凭证

在连接到 Onboardee 的 SSID 之后，Onboarder 会监听 [AllJoyn About announcements][about-announcement]. 之后，Onboarder 会使用加入服务接口向
Onboardee 设备发送目标 Wi-Fi 网络的凭证。


### 4. 切换到目标 Wi-Fi 

两方设备都将会切换到目标 Wi-Fi 网络

### 5. Onboarder 监听 Onboardee 设备

最后一步是，Onboarder 会监听来自 Onboardee 设备的 About announcement。当收到时，Onboarder 就认为 Onboardee 已经顺利连接。


![][onboarding-state-diagram]

[onboarding-state-diagram]: /files/learn/onboarding-state-diagram.png

## 学习更多

* [Learn more about the Onboarding Interface Definition][onboarding-interface]
* [Download the SDK][download], [build][build] and
  [run the sample apps][sample-apps]
* [Learn more about the Onboarding APIs][api-guide]

[about-announcement]: /learn/core/about-announcement
[onboarding-interface]: /learn/base-services/onboarding/interface
[download]: https://allseenalliance.org/framework/download
[build]: /develop/building
[sample-apps]: /develop/run-sample-apps/onboarding
[api-guide]: /develop/api-guide/onboarding
