# 运行 About Sample 应用程序 - iOS

## 前提条件
根据 [Building - iOS OS X section][build-ios-osx]  中的步骤在 iOS 设备上搭建和安装 About sample 应用程序。

你可以将 About sample 应用程序用作一个 About Client, 或者是一个 About Service, 也可以同时作Client 和 Service. 如果你将应用程序同时运行作输
入和输出，你将会在同一部 iOS 设备上发送和接收同一个消息称。                                                                                                                                                                                                                                                                                                                                                                      另外，还可在两台分别做 client 和service 的设备上运行应用程序。                                                                                                                                                                                                                                                                   

Alternately, run the app as a client on one device, and as a service on another device.

**NOTE:** 两设备必须处于同一个 Wi-Fi 网络中。

## 使用 About sample 应用程序作客户端

1. 在你的 iOS 设备上运行 About sample 应用程序。
2. 点击 **Connect to AllJoyn**.
3. 在弹出的窗口中设定应用程序 About 功能的名字。可以使用默认的 org.alljoyn.BusNode.aboutClient，也可自定义。
  * 应用程序现在以客户端模式开始运行。The application is now running in Client mode. 
  * 在 **Disconnect from AllJoyn** 按键下放的列表区域, 你将会看到通过 About announcements 被发现的附近的应用程序。 
  NOTE: 如果找不到附近设备，请按照 [Run the About sample app as a Service][run-about-sample-app-as-service] 中的指示同时运行应用程序，作为
一个 About Service. 
  to run the application simultaneously as an About Service. This will allow 
  you to interact with the About Server running in the app through the 
  About Client that is also running in the app.
 
4. To interact with an About Service, select one from the list 
of nearby applications that have been discovered.
5. Choose an option from the pop-up that appears:
  * **Show Announce**: This will allow you to view the About announcement 
  that was received from the nearby application.
  * **About**: This will show the full set of information retrieved 
  by the About Client from the nearby application.
  * **Icon**: This will display the About Icon that has been 
  retrieved from the nearby application.

## Run the About sample app as a Service

1. Run the About sample app on your iOS device.
2. At the bottom of the screen, click **Start About Service**.
3. The application is now running in Server mode.

**NOTE:** To interact with the About Service, either run the sample 
app as an About Client on the same device or on a different device, 
as detailed in [Run the About sample app as a Client](#run-the-about-sample-app-as-a-client).


[build-ios-osx]: /develop/building/ios-osx
[run-about-sample-app-as-service]: #run-the-about-sample-app-as-a-service
