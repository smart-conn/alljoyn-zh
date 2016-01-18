# 运行 Onboarding 样例应用程序 - iOS

## 前提条件

[Build the iOS sample apps][build-ios-osx] 在 iOS 设备上安装 Onboarding 样例应用程序。 


Onboarding 服务样例应用程序作为 Onboarding 服务框架中的 Onboarder 一方运行。在此时，不存在 iOS Onboardee 样例应用程序。为了获得可以交互的 Onboardee，需按照 [Run an Onboardee][run-onboardee] 中的说明，在一台 Android 机器上建立并运行一个可被载入的应用程序。此 Android 机器需与控
制方 iOS 设备处于同一网络当中。


## 运行 Onboarding 样例应用程序

1. 使用 iOS 设备中 **Settings** > **Wi-Fi** 菜单选项连接到你希望载入的设备所推广的 AP 上。 
2. 一旦你连接到此 AP，在你的 iOS 设备上运行 Onboarding 服务样例应用程序。
3. 点击 **Connect to AllJoyn** 按钮。
4. 在弹出的对话框中，设置应用程序需要使用的 About 功能的名字。可以使用默认的 org.alljoyn.BusNode.onboardingClient，也可自定义。应用程序现在 正在以 Onboarder 模式运行。在 Disconnect from AllJoyn 按钮下放的列表区域中，你将会看到已经通过 About 功能发现的支持 Onboarding 服务框架的正 在作为 Onboardee 的附近应用程序。
5. 若要与 Onboardee 交互，需从列表中选择一个已被发现的附近应用程序。
6. 从弹出的对话框中选择一个选项：
  * Show Announce: 用以观测从附近应用程序接收到的 About announcement.
  * About: 展示由 About Client 从附近应用程序取回来的所有信息。
  * Onboarding: 你可以使用此功能逐步调试将 Onboardee 载入到本地 Wi-Fi 网络的进程。
7. 选择 Onboarding 选项并执行如下操作：
  * 输入你想将设备载入到的 Wi-Fi 网络的 SSID 和密码，然后点击 **Configure**.  Onboarder 将会把这些值传入到 Onboardee.
  * 点击 **Connect**. 你将看到一个成功消息，伴随着转到 **Settings** > **Wi-Fi** 菜单进行网络切换设置的提示，以将你的设备切换到刚刚载入到的
  网络中。
  * 一旦切换网络，你会看到刚刚载入的设备现在已被列入附近设备列表，在 **Disconnect from AllJoyn** 按钮下方。若你选择此设备，你会发现他已经被
  载入，你现在可以选择 offboard 此设备。


## 运行一个 Onboardee

参照 [instructions to run the AboutConfOnbServer in Android][onboardee] 中的说明。你将可以使用 iOS Onboarding 服务应用程序用例来将应用程序
onboard 到 Android 设备上。

当你在 Android 设备上运行 AboutConfOnbServer 应用程序时，他会自动将设备转入"AP 模式"。根据你的 Android 设备，你可能需要手动编辑 AP 名，加入
"AJ_" 前缀。此前缀的作用是帮助 Onboarding 服务框架决定哪些 AP 是可用于支持 Onboarding 服务框架的 AllJoyn 设备的。


[build-ios-osx]: /develop/building/ios-osx
[run-onboardee]: #run-an-onboardee
[onboardee]: /develop/run-sample-apps/onboarding/android#running-android-sample-onboardingserver
