# 运行提醒应用程序样例 - iOS

## 前提条件
按照 [Building - iOS OS X section][build-ios-osx] 中的说明在 iOS 设备上搭建并安装控制面板样例应用程序。

你可以使用 Notification 服务框架样例应用程序来作为一个 Notification Producer，一个 Notification Consumer，或者同时作为 Notification Producer 和 Notification Consumer. 如果你的应用程序作为 Producer 和 Consumer 同时运行，你将可以通过运行在你应用程序中的 Notification Producer 和 同运行在你的应用程序中的 Notification Consumer 交互。

除此之外，还可以在一设备上运行应用程序作为 Producer，在另一设备上运行应用程序作为 Consumer.

**NOTE:** 两设备需处于同一个 Wi-Fi 网络中。

## 运行 Notification 样例应用程序作为 Producer


1. 在 iOS 设备上运行 Notification 样例应用程序。

  ![producer-1][]

2. 在应用程序名字段中键入一个用于作 producer 方应用程序名的名字，例如 TestApp.  
3. 点击 __Producer__ ，以 Producer 模式运行。

  ![producer-2][]

4. 在第一个字段中键入将被作为 Notification 消息的文本。
5. 可选地，你还可以在第二个字段用另一种语言输入消息。在文本框右侧的 seelctor 可用来选择第二种语言。
6. 可使用标准 TTL，也支持自定义。
7. 可选地, 可以打开 Audio and Icon URL 字段。
8. Message type 标签旁边, 可以用 selector 选择 INFO, WARNING, 或者 EMERGENCY 中的一种作为消息类型。
9. 按下 __Send__ 按钮，发送提醒。

  ![producer-3][]
  ![producer-4][]

**NOTE:** 若要接收并观看已发送的提醒，可以在同一设备或另一设备上运行一个作为 Consumer 的 提醒服务样例应用程序。

## 运行作为 Consumer 的 提醒服务样例应用程序

1. 在你的 iOS 设备上运行提醒服务样例应用程序。

  ![producer-1][]

2. 在 Application Name 字段中，选择下列一种操作执行：
  * 键入一个将被用于应用程序名的名字。若如此做，应用程序会过滤掉任何与 Application Name 字段中指定的名字不匹配提醒。此供能旨在帮助测试在同
一网络中的多个应用程序之间同时发送并接收提醒的场景。
  * 保留空白。若如此做，应用程序将会显示接收自所有 Producer 的提醒。
3. 点击 __Consumer__ 以 Consumer 模式运行。

  ![][consumer-1]

应用程序将会接收提醒。

  ![][consumer-2]

**NOTE:** 若要在应用程序内接收提醒，需要在本设备或其他设备上将提醒服务应用程序样例以 Producer 模式运行。详情请参见
[Run the Notification sample app as a Producer][run-notif-sample-app-producer].

[producer-1]: /files/develop/run-sample-apps/ios-notification-sample/producer-1.png
[producer-2]: /files/develop/run-sample-apps/ios-notification-sample/producer-2.png
[producer-3]: /files/develop/run-sample-apps/ios-notification-sample/producer-3.png
[producer-4]: /files/develop/run-sample-apps/ios-notification-sample/producer-4.png
[consumer-1]: /files/develop/run-sample-apps/ios-notification-sample/consumer-1.png
[consumer-2]: /files/develop/run-sample-apps/ios-notification-sample/consumer-2.png


[build-ios-osx]: /develop/building/ios-osx
[run-notif-sample-app-producer]: #run-the-notification-sample-app-as-a-producer
