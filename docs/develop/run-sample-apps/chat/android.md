# Android - Core Sample Apps

## 运行 Android SimpleClient, SimpleService 应用程序

Android SimpleClient 和 SimpleService 为解释客户端和服务器端应用程序的实现原理提供了一个简单的例子。SimpleService 监听连接，SimpleClient 加入 SimpleService 发起的会话，通过被 SimpleService 调用的 BusMethod 文本可以从 SimpleClient 被发送到 SimpleService. 两方应用程序中都会显示 BusObjects.


1. 将设备 A 与设备 B 连接到同一个网络中。

2. 在设备 A 中载入 SimpleClient.apk，并启动 "Simple Client" 应用程序。 

  ![][1.SimpleClientWaitingForSimpleService]

3. 在设备 B 中载入 SimpleService.apk，并启动 "Simple Service" 应用程序。 "Simple Service" 在启动时会呈现一个空白屏幕。
4. SimpleClient 会加入 SimpleService 发起的会话, 在这之后 SimpleClient 会有如下显示：
  ![][2.SimpleClientConnected]

5. 在 "Simple Client" 中键入文本并按下 Enter，文本会被发送到 "Simple Service" 并获得返回值，下图展示了两个应用程序的界面。
  ![][3.SimpleClientSentAndReceivedMessage]

## 运行 Android 聊天应用程序

Android 聊天应用程序展示了如何使用 AllJoyn&trade; 框架实现聊天室功能。在此场景中，一应用程序首先创建并加入一个会话，之后会有更多的应用程序
加入此会话。


1. 将所有设备连接到同一个网络中。
2. 将 Chat.apk 载入到各设备，随后启动 "AllJoyn Chat Sample for Android" 应用程序。
3. 在第一个设备上创建并开始一个信道。
      * 选择正确的标签 (带有 "+" 符号的那一个).
  ![][1.SetUpChannel]
      * 通过 **Set Channel Name** 按钮创建信道 - 在有提醒时输入一个信道名。
  ![][2.SetChannelName]
      * 按下 **Start Channel** 按钮。
  ![][3.StartChannel]
4. 加入第一个设备所在的信道。
      * 点击左边的标签。
      * 按下 **Join Channel** 按钮，选择那个刚刚被创建的信道。
  ![][4.ChooseChannelToJoin]
  ![][5.ChannelJoined]
5. 加入在其他设备上信道。
      * 点击左边的标签。
      * 按下 **Join Channel** 按钮， 选择上面刚刚创建的那个信道。
6. 在 "Enter message here" 文本框中输入字符，然后按下 enter 键与其他人聊天。在消息历史中，从"其他“设备发来的消息的左边栏会显示对应总线附件 的唯一识别符，来自本设备的消息则会显示 “Me”.
  ![][6.SendMessages]



[1.SimpleClientWaitingForSimpleService]: /files/develop/run-sample-apps/android-simple-sample/1.SimpleClientWaitingForSimpleService.png
[2.SimpleClientConnected]: /files/develop/run-sample-apps/android-simple-sample/2.SimpleClientConnected.png
[3.SimpleClientSentAndReceivedMessage]: /files/develop/run-sample-apps/android-simple-sample/3.SimpleClientSentAndReceivedMessage.png

[1.SetUpChannel]: /files/develop/run-sample-apps/android-chat-sample/1.SetUpChannel.png
[2.SetChannelName]: /files/develop/run-sample-apps/android-chat-sample/2.SetChannelName.png
[3.StartChannel]: /files/develop/run-sample-apps/android-chat-sample/3.StartChannel.png
[4.ChooseChannelToJoin]: /files/develop/run-sample-apps/android-chat-sample/4.ChooseChannelToJoin.png
[5.ChannelJoined]: /files/develop/run-sample-apps/android-chat-sample/5.ChannelJoined.png
[6.SendMessages]: /files/develop/run-sample-apps/android-chat-sample/6.SendMessages.png
