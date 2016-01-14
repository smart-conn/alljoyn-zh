# 运行聊天样例 - iOS

## 前提条件
* [Build samples][build-ios-osx] 
* 在两个 iOS 设备上安装 Basic Client 和 Basic Service sample 应用程序。 
* 两个 iOS 设备必须连接到同一个 Wi-Fi 网络中。

[build-ios-osx]: /develop/building/ios-osx

## 运行 AllJoyn&trade; 聊天

在两个设备上运行 AllJoyn 聊天应用程序。

现在两个 iOS 设备上都应该运行着 AllJoyn 聊天应用程序。初始界面应是如下图所示：
  ![][setup-screen]

  **Figure:** 聊天初始化界面

[setup-screen]: /files/develop/run-sample-apps/ios-chat-sample/setup-screen.png

### 使用会话的聊天

1. 确保两个设备上的 **Use a session** 选项都被放置在 _ON_ 状态上。

2. 在一方设备上，选中 **Host** 按钮，然后按下 **Start**. 在另一设备上，选中 **Join** 按钮，然后按下 **Start**.两方的应用程序界面都应如下图
所示：

  ![][chat-screen]

**Figure:** 初始化消息界面

3. 在一方设备上，键入一条消息并按下 **Send**. 此消息出现在发送端的设备上，同时也出现在另一方设备上。截图如下：

  ![][chat-device1-1]

**Figure:** 设备1发送 "hello"

  ![][chat-device2-1]

**Figure:** 设备2收到设备1发送的 "hello"

  ![][chat-device1-2]

**Figure:** 设备2回复  "hi"

  ![][chat-device2-2]

**Figure:** 设备1收到设备2回复的 "hi" 

[chat-screen]: /files/develop/run-sample-apps/ios-chat-sample/chat-screen.png
[chat-device1-1]: /files/develop/run-sample-apps/ios-chat-sample/chat-device1-1.png
[chat-device1-2]: /files/develop/run-sample-apps/ios-chat-sample/chat-device1-2.png
[chat-device2-1]: /files/develop/run-sample-apps/ios-chat-sample/chat-device2-1.png
[chat-device2-2]: /files/develop/run-sample-apps/ios-chat-sample/chat-device2-2.png

### 使用非会话信号的聊天
1. 确保两个设备上的 **Use a session** 选项都被放置在 _OFF_ 状态上。

  ![][sls-setup-screen]

**Figure:** 初始化聊天界面

2. 在两设备上按下 **Start**. 两方的应用程序界面都应如下图所示：

  ![][sls-chat-screen]

**Figure:** 初始消息界面

3. 在一方设备上，键入一条消息并按下 **Send**. 此消息出现在发送端的设备上，同时也出现在另一方设备上。截图如下：


![][sls-chat-device1-1]

**Figure:** 设备1键入 "hi"

![][sls-chat-device1-2]

**Figure:** 设备1 收到设备2回复的 "hey" 

[sls-setup-screen]: /files/develop/run-sample-apps/ios-chat-sample/sls-setup-screen.png
[sls-chat-screen]: /files/develop/run-sample-apps/ios-chat-sample/sls-chat-screen.png

[sls-chat-device1-1]: /files/develop/run-sample-apps/ios-chat-sample/sls-chat-device1-1.png
[sls-chat-device1-2]: /files/develop/run-sample-apps/ios-chat-sample/sls-chat-device1-2.png
