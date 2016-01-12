# 运行 About Sample 应用程序 - iOS

## 前提条件
根据 [Building - iOS OS X section][build-ios-osx]  中的步骤在 iOS 设备上搭建和安装 About sample 应用程序。

你可以将 About sample 应用程序用作一个 About Client, 或者是一个 About Service, 也可以同时作Client 和 Service. 如果你将应用程序同时运行作输
入和输出，你将会在同一部 iOS 设备上发送和接收同一个消息称。                                                                                                                                                                                                                                                                                                                                                                      另外，还可在两台分别作为 client 和service 的设备上运行应用程序。                                                                                                                                                                                                                        

**NOTE:** 两设备必须处于同一个 Wi-Fi 网络中。

## 使用 About sample 应用程序作客户端

1. 在你的 iOS 设备上运行 About sample 应用程序。
2. 点击 **Connect to AllJoyn**.
3. 在弹出的窗口中设定应用程序 About 功能的名字。可以使用默认的 org.alljoyn.BusNode.aboutClient，也可自定义。
  * 应用程序现在以客户端模式开始运行。The application is now running in Client mode. 
  * 在 **Disconnect from AllJoyn** 按键下放的列表区域, 你将会看到通过 About announcements 被发现的附近的应用程序。 
  NOTE: 如果找不到附近设备，请按照 [Run the About sample app as a Service][run-about-sample-app-as-service] 中的指示同时运行一个作为 About Server 的应用程序。借此你可以通过运行在应用程序中的 About Client 与同时运行在应用程序中的 About Server 进行交互。
4. 从已被发现的附近应用程序列表中选择一个作为进行交互的 About Service.
5. 在弹出的窗口中选择一项：
  * **Show Announce**: 用以观测从附近应用程序接收到的 About announcement.
  * **About**: 展示由 About Client 从附近应用程序取回来的所有信息。
  * **Icon**: 展示从附近应用程序被取回来的 About Icon.

## 运行 About sample 应用程序作服务器端

1. 在你的 iOS 设备上运行 About sample 应用程序。
2. 在屏幕底部，点击 **Start About Service**.
3. 应用程序现在正在作为服务器端运行。

**NOTE:** 为了与 About Service 互动, 可以在同一设备或两个不同设备上运行一个作为 About Client 的 sample 应用程序。细节参见
[Run the About sample app as a Client](#run-the-about-sample-app-as-a-client).


[build-ios-osx]: /develop/building/ios-osx
[run-about-sample-app-as-service]: #run-the-about-sample-app-as-a-service
