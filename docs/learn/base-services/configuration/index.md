# Configuration Service

Configuration Service 提供了配置设备的功能。如配置设备的名称和密码。

## 概念和术语

Two roles exist:有两个角色：
* **Config Server**. Config Server 运行在被配置的设备上，这些设备提供 Configuration 服务。

* **Config Client**. Config Client 运行在设备或应用程序上，用于配置远程设备。

有以下几个可配置项：

* **Factory Reset**. 将设备恢复至原生出厂设置。所有配置数据将被还原；如果设备支持 Onboarding 服务，那么设备将会进入它原本的 offboarded 区域。

* **Set Passcode**. 设置设备的密码，用于连接安全端口。

* **Default Language**. 在没有指定语言的情况下，设置设备的默认语言。

* **Device Name**. 设置设备名称。

Configuration Service 在一个简单的安全端口中提供服务。查看 [Configuration Interface Definition][config-interface] 获取更多信息。

## 了解更多

* [了解更多关于 Configuration Interface Definition][config-interface]
* [下载 SDK][download] 和 [build][build]
* [了解更多关于 Configuration APIs][api-guide]

[config-interface]: /learn/base-services/configuration/interface
[download]: https://allseenalliance.org/framework/download
[build]: /develop/building
[api-guide]: /develop/api-guide/config
