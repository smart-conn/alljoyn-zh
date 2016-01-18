#运行控制面板样例应用程序 - iOS

## 前提条件

按照 [Building - iOS OS X section][build-ios-osx] 中的说明在 iOS 设备上搭建并安装控制面板样例应用程序。

控制面板服务样例应用程序扮演着控制面板服务框架中的控制方。此时，并不存在 iOS 被控制方应用程序样例。为了获得可以交互的被控制方，需按照
[Run a Controllee][run-controllee] 中的说明，在一台 Linux 机器上建立并运行一个被控制方应用程序。此 Linux 机器需与控制方 iOS 设备处于同一网
络当中。

## 运行控制面板样例应用程序

1. 在你的 iOS设备上安装控制面板应用程序样例。
2. 点击 Connect to AllJoyn 按钮。
3. 在弹出的窗口中设定应用程序 About 功能的名字。可以使用默认的 org.alljoyn.BusNode.aboutClient，也可自定义。应用程序现在正在以控制方模式运
行。在 Disconnect from AllJoyn 按钮下放的列表区域中，你将会看到已经通过 About 功能发现的支持控制面板服务框架的正在作为被控制方的附近应用程
序。
4. 若要与被控制方交互，需从列表中选择一个已被发现的附近应用程序。
5. 在弹出的对话框中选择一个选项：
  * Show Announce: 用以观测从附近应用程序接收到的 About announcement.
  * About: 展示由 About Client 从附近应用程序取回来的所有信息。
  * Control Panel: 使用控制方 Control Panel 可以与被控制方暴露的控制面板进行交互。
    * 选择此选项之后，点击屏幕右上角的 **Language** 按钮并键入一种被支持的语言到文本框中。例如，键入 "en" 可以观看控制面板的英语版本。
    * 一旦你选择了控制面板并指定了语言，相关控制面板的数据会用所指定的语言被显示。截止到此时，并没有可用于 iOS 的组件渲染库。因此，控制面板
    的显示方式是一系列的条目，包括每一个控制对象的数据和属性。


## 运行被控制方应用程序

按照 [Running - Linux section][run-linux] 的说明搭建并运行被控制方应用程序。由此你可以在一台 Linux 机器上运行 ControlPanelService 被控制方
样例应用程序。

[build-ios-osx]: /develop/building/ios-osx
[run-linux]:  /develop/run-sample-apps/controlpanel/linux
