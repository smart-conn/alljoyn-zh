# 运行 Config 样例应用程序 - iOS

## 前提条件

根据 [Building - iOS OS X section][build-ios-osx] 上的指导在 iOS 设备上搭建并安装 Config 样例应用程序。

你可以使用 Configuration 服务框架样例应用程序来作为一个 Config Client，一个 Config Server，或者同时作为 Config Client 和 Config Server. 在
Client 模式中，你可以发现附近支持 Config 服务的任何应用程序，并与他们交互。在 Server 模式中，应用程序会作为一个 Config Server，其他附近的应
用程序可以通过 Config Client 来与他交互。如果你的应用程序作为 Client 和 Server 同时运行，你将可以通过运行在你应用程序中的 Config Client 和
同运行在你的应用程序中的 Client Server 交互。此功能实现了仅使用一个设备就可完成开发和调试的功能。

除此之外，还可以在一设备上运行应用程序作为 client，在另一设备上运行应用程序作为 server. 

**NOTE:** 在使用两台设备分别作 client 和 server 时，两设备需处于同一个 Wi-Fi 网络中。

## 运行 Configuration service 样例应用程序作为 Client 
1. 在 iOS 设备上运行 Configuration service 样例应用程序。
  ![][config-client-1]
2. 按下 **Connect to AllJoyn** 按钮。
  ![][config-client-2]
3. 应用程序现在以 Client 模式运行。在 Disconnect from AllJoyn 按钮下放的列表区域中会显示同时支持 Configuration 服务框架的，通过 About 功能
被发现的附近的应用程序。
  ![][config-client-3]  
   **NOTE:** 如果没有附近设备运行 Configuration 服务框架，请参阅  [Run the Configuration service sample app as a Server][run-config-sample-app-as-server] 中的步骤，将应用程序同时作为一个 Config Server 运行。借此你可以使用运行在应用程序上的 Config Client 和 Config Server 来完成交互。
4. 若要与 Config Server 交互, 首先在列表中选择一个已经被发现的附近应用程序。
5. 在弹出的窗口中选择一个选项
    ![][config-client-4]
  * __Show Announce__: 此项使你可以观看从附近设备接收的 About Announcement.
    ![][config-client-5]
  * __About__: 此项可以显示通过 About Client 检索到的附近应用程序的全套信息
    ![][config-client-6]
  * __Config__: 在这里，你可以观看由 Config Client 提供的从 运行在附近应用程序中的  Client Server 中检索到的信息。
  * 你还可以使用 Config Client 来与 Config Server 实例进行交互，并修改他所提供的不同配置选项。例如，如果你修改了 DeviceName 字段，并使用了 **Back** 按钮返回到显示附近应用程序的主视图，你将注意到列表中已将设备名更新。
    ![][config-client-7]
    ![][config-client-8]
    ![][config-client-9]

## 运行 Configuration service 样例应用程序作为 Server

1. 在 iOS 设备上运行 Configuration service 样例应用程序。
  ![][config-client-1]
2. 在屏幕底部, 按下 **Start Service** 按钮。
3. 应用程序现在以 Server 模式运行。
  ![][config-service-1]
   **NOTE:** 若要与 Config Client 交互, 需要在本设备或者另一设备上运行一个作为 Config Client 的样例应用程序，参见：
   [Run the Configuration service sample app as a Client][run-config-sample-app-as-client].


[config-client-1]: /files/develop/run-sample-apps/ios-config-sample/config-client-1.png
[config-client-2]: /files/develop/run-sample-apps/ios-config-sample/config-client-2.png
[config-client-3]: /files/develop/run-sample-apps/ios-config-sample/config-client-3.png
[config-client-4]: /files/develop/run-sample-apps/ios-config-sample/config-client-4.png
[config-client-5]: /files/develop/run-sample-apps/ios-config-sample/config-client-5.png
[config-client-6]: /files/develop/run-sample-apps/ios-config-sample/config-client-6.png
[config-client-7]: /files/develop/run-sample-apps/ios-config-sample/config-client-7.png
[config-client-8]: /files/develop/run-sample-apps/ios-config-sample/config-client-8.png
[config-client-9]: /files/develop/run-sample-apps/ios-config-sample/config-client-9.png
[config-service-1]: /files/develop/run-sample-apps/ios-config-sample/config-service-1.png


[build-ios-osx]: /develop/building/ios-osx
[run-config-sample-app-as-server]: #run-the-configuration-service-sample-app-as-a-server
[run-config-sample-app-as-client]: #run-the-configuration-service-sample-app-as-a-client
