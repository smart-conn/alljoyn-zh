# Security 2.0

Security 2.0 是对已有 AllJoyn&trade; Security 的一次加强。

Security 2.0 的目的在于，能够使应用程序根据其拥有者安装的规则，验证到安全端口或安全对象的连接。此功能是 AllJoyn 核心资源库的一部分。它不是应用程序执行权限的一个可选项。由用户根据应用程序访问控制列表（ACL），决定应用程序如何运行。

Security Manager 是一个可选服务，它帮助用户进行密钥管理和权限规则的制定。通过使用应用开发者定义的规则模板，Security Manager 生成应用程序清单，让用户授权应用程序可以做哪些交互。

## 了解更多

* [Security 2.0 High Level Design (HLD)][security2_0-hld]
* [Download the SDK][download], [build][build]

[security2_0-hld]: /learn/core/security2_0/hld
[download]: https://allseenalliance.org/framework/download
[build]: /develop/building
