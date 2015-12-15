# About Announcement About Announcement

About Announcements enables a device or app to announce itself on the
AllJoyn&trade; network for other devices and apps to discover. The following information
is shared:
About Announcement 为设备或者应用提供了在 AllJoyn&trade; 网络中广播自己的功能，以便其他设备和应用发现。以下信息将可以被分享：

* App and Device Friendly Names
* Make, Model, Version, Description 
* Supported Languages
* App Icon
* Supported objects and interfaces
* Service Port number
* App and Device unique identifiers
* 应用和设备的别名
* Make，模型，版本，描述
* 支持的语言
* 应用图标
* 支持的对象和接口
* 服务端口号
* 应用和设备的唯一标识符

查看[Interface Definiton][about-interface]以获取完整列表。

The About feature supports multiple languages, so the client can display the language
that is most appropriate for the user. With the About feature, a client can discover
devices and apps on the network, get some meta data about the device/app,
discover the services it supports, and get an icon to represent the device/app.
About 功能支持多种语言，所以客户端可以选择一个最适合的语言展示给用户。About 功能可以实现：某个客户端能够发现网络上的设备和应用，得到一些设备或应用的元数据，发现他所支持的服务，并获取一个可以代表该设备或应用的图标。

## 概念和术语

Generally speaking, there are two sides to the About feature:
* About Server. This is the device or app that is announcing itself.
* About Client. This is the device or app that is discovering apps/devices.
通常来说，About 功能有两个部分：
* About Server. 自己发布广播的设备或应用。
* About Client. 发现其他应用或设备的应用或设备。
## How It Works 运行方式

Here's roughly what happens behind the scenes:幕后大致发生了什么：

1. An About Server announces itself by sending a sessionless signal including:
   the session port, list of objects and interfaces; and a subset of the About
   Announcement information, including App and Device Name, default language,
   App and Device unique identiers.
1. About Server 通过发送 sessionless signal 广播自己。Sessionless signal 包含了对象和接口的列表；About Annoucement 信息的一个子集，该信息包含了应用和设备名，默认语言，应用程序和设备的唯一标识符。

2. An About Client discovers the sessionless signal, which includes the information
   listed above. The client can now display some information about the discovered
   device/app, App/Device Name and supported services.
2，About 客户端发现包含以上信息的 sessionless signal。客户端能够展示一些关于被发现设备／应用的信息，应用／设备名和支持的服务。
3. Optionally, the About Client can connect to the app/device's About Server
   on the service port to extract more information. Typically, this is done
   to get the app icon.
3. （可选）About客户端可以通过连接应用／设备的 About 服务器的服务端口来获取更多信息。通常，这个步骤是用来获得应用图标。

## Learn More 了解更多

* [了解更多关于 About Interface Definition][about-interface]
* [下载 SDK][download], [build][build] 和
  [运行示例应用[sample-apps]
* [了解更多关于 About APIs][api-guide]

[about-interface]: /learn/core/about-announcement/interface
[download]: https://allseenalliance.org/framework/download
[build]: /develop/building
[sample-apps]: /develop/run-sample-apps/about
[api-guide]: /develop/api-guide/about
