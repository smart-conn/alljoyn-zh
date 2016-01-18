# Android - Onboarding 样例应用程序

## 运行 Android OnboardingServer 样例


Android OnboardingServer 提供了使用 Onboarding 服务的一个 Android 样例实现应用程序。设备可以被另一个使用 Onboarding 客户端的设备所载入。

1. 在需要被载入的设备上, 首先设置好 Wi-Fi hotspot.  在 **Settings** > **Wireless & networks** 中, 选择 **Tethering & portable hotspot**. 
在一些设备上, 此项会默认是一个名为 "AndroidAP" 的开放式 AP.

  ![][1.TetheringAndPortableHotspot]

2. 配置你的 Wi-Fi hotspot 设置。

  ![][2.SetUpWiFiHotspot]

3. 载入 AboutConfOnbServer.apk, 随后启动 `Onboarding Server`应用程序。你会看到 Wi-Fi hotspot 通知栏图标弹出带有 "Tethering or hotspot active" 字样的通知。此设备已准备好被载入。


  ![][3.StartAppEnableHotspot]


## 运行 Android OnboardingClient 样例应用程序。 OnboardingClient 提供了使用 Onboarding 服务的一个 Android 样例实现应用程序。设备可以使用 Onboarding 客户端将另一个设备载入。

1. 运行 OnboardingSampleClient.apk, 然后启动 `Onboarding Client` 应用程序。

  ![][1.StartScreen]

2. 按下 `Scan WIFI networks`.

  ![][2.ScanNetworks]
  ![][3.NetworkList]

3. 选择在运行`Onboarding Server` 的设备上配置好的 Wi-Fi hotspot，如果需要可以键入密码，然后按下 **OK**. 

  ![][4.EnterAccessPointPasswordIfNeeded]

4. 按下 **Connect to AllJoyn** 按钮, 然后在弹出的对话框中按下 **OK** ，此处的'realm name' 无关紧要。

  ![][5.ChooseNetwork]
  ![][6.PressedConnectToAllJoyn]

5. 然后会显示一个 AllJoyn 应用程序列表。长按 `Hello` 应用程序，并选择 **Onboarding** 选项。

  ![][7.DeviceList]
  ![][8.LongPressOnDevice]

6. 输入正在被载入到的网络接入点信息。

  ![][9.SelectOnboarding]
  ![][10.EnterAccessPointInfoToOnboardTo]

7. 按下 **Configure** ，确认设备和接入点信息。

  ![][11.PressConfigure]

8. 按下 **Connect** ，使设备与配置好的 AP 信息连接。 

  ![][12.PressConnect]

9. 如果设置正确,  __other__ 在 `Onboarding Server` 上运行的应用程序将会被载入到 AP, 在这之后，相应图标会出现在通知栏里。
  ![][4.OnboardedSuccessfully]

[1.TetheringAndPortableHotspot]: /files/develop/run-sample-apps/android-onboardingserver-sample/1.TetheringAndPortableHotspot.png
[2.SetUpWiFiHotspot]: /files/develop/run-sample-apps/android-onboardingserver-sample/2.SetUpWiFiHotspot.png
[3.StartAppEnableHotspot]: /files/develop/run-sample-apps/android-onboardingserver-sample/3.StartAppEnableHotspot.png
[4.OnboardedSuccessfully]: /files/develop/run-sample-apps/android-onboardingserver-sample/4.OnboardedSuccessfully.png

[1.StartScreen]: /files/develop/run-sample-apps/android-onboardingclient-sample/1.StartScreen.png
[2.ScanNetworks]: /files/develop/run-sample-apps/android-onboardingclient-sample/2.ScanNetworks.png
[3.NetworkList]: /files/develop/run-sample-apps/android-onboardingclient-sample/3.NetworkList.png
[4.EnterAccessPointPasswordIfNeeded]: /files/develop/run-sample-apps/android-onboardingclient-sample/4.EnterAccessPointPasswordIfNeeded.png
[5.ChooseNetwork]: /files/develop/run-sample-apps/android-onboardingclient-sample/5.ChooseNetwork.png
[6.PressedConnectToAllJoyn]: /files/develop/run-sample-apps/android-onboardingclient-sample/6.PressedConnectToAllJoyn.png
[7.DeviceList]: /files/develop/run-sample-apps/android-onboardingclient-sample/7.DeviceList.png
[8.LongPressOnDevice]: /files/develop/run-sample-apps/android-onboardingclient-sample/8.LongPressOnDevice.png
[9.SelectOnboarding]: /files/develop/run-sample-apps/android-onboardingclient-sample/9.SelectOnboarding.png
[10.EnterAccessPointInfoToOnboardTo]: /files/develop/run-sample-apps/android-onboardingclient-sample/10.EnterAccessPointInfoToOnboardTo.png
[11.PressConfigure]: /files/develop/run-sample-apps/android-onboardingclient-sample/11.PressConfigure.png
[12.PressConnect]: /files/develop/run-sample-apps/android-onboardingclient-sample/12.PressConnect.png
