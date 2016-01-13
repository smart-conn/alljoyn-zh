# 运行 Basic Sample - iOS

## 前提条件

* [Build samples][build-ios-osx] 在两个 iOS 设备上安装 Basic Client 和 Basic Service sample 应用程序。 
* 两个 iOS 设备必须连接到同一个 Wi-Fi 网络中。


## 运行 Basic Client & Service
1. 在一个 iOS 设备上运行 Basic Client 应用程序。
2. Basic Client 应用程序的显示界面应类似于下图所示： 

  ![][basic-client-screen-1]

  **Figure:** 客户端初始化界面

3. 在第二个 iOS 设备上运行 Basic Service 应用程序。
4. 显示界面应类似于下图所示：

  ![][basic-service-screen-1]

  **Figure:** 服务器端初始化界面

5. 在 Basic Client 应用程序中, 按下 **Call Service** 按钮。这会引发客户端试图寻找服务，连接到服务并执行一个 sample 总线方法。

  ![][basic-client-screen-2]

  **Figure:** 按下 `Call Service` 之后的客户端界面

6. Basic Client 应用程序的显示界面应类似于下图所示

  ![][basic-client-screen-3]

  **Figure:** 成功连接后的客户端界面。

7. Basic Service 应用程序的显示界面应类似于下图所示：

  ![][basic-service-screen-2]

  **Figure:** 成功连接后的服务器端界面。

[basic-client-screen-1]: /files/develop/run-sample-apps/ios-basic-sample/ios-basic-client-1.png
[basic-client-screen-2]: /files/develop/run-sample-apps/ios-basic-sample/ios-basic-client-2.png
[basic-client-screen-3]: /files/develop/run-sample-apps/ios-basic-sample/ios-basic-client-3.png
[basic-service-screen-1]: /files/develop/run-sample-apps/ios-basic-sample/ios-basic-service-1.png
[basic-service-screen-2]: /files/develop/run-sample-apps/ios-basic-sample/ios-basic-service-2.png

[build-ios-osx]: /develop/building/ios-osx
