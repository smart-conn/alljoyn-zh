# Android - 配置应用程序样例

## 运行 Android ConfigClientSample
Android ConfigClientSample 提供了一个使用 Config 客户端的 Android 应用程序的实现方法。

1. 载入 ConfigClientSample.apk, 然后运行 `Config Client` 应用程序。

  ![][1.StartScreen]

2. 连接第二个设备，运行实现了 Config 服务的应用程序，与第一个设备需在同一个网络内。(你可以使用 Onboarding SDK 中的AboutConfOnbServer.apk).

3. 在第一个设备的 `Config Client` 应用程序中, 按下 **Connect to AllJoyn** 按钮, 然后按下 **OK**.

  ![][2.PressedConnectToAllJoynButton]

4. 在 `Config Client` 应用程序的设备列表中, 友好名称会出现第二个设备的应用程序名。

  ![][3.DeviceListShowsAnAppSupportingConfigService]

5. 进入设备列表并选择设备，由此可以配置实现 Config 服务的第二个设备的应用程序。

  ![][4.SelectDeviceShowConfigurableFields]

6. 按自己的意图改变, 检查检验盒之后即可点击 **Save**。配置改变应该已经被使用。
checkboxes, and press **Save**. The config changes should now be applied.

  ![][5.ModifyName]

[1.SimpleClientWaitingForSimpleService]: /files/develop/run-sample-apps/android-simple-sample/1.SimpleClientWaitingForSimpleService.png
[2.SimpleClientConnected]: /files/develop/run-sample-apps/android-simple-sample/2.SimpleClientConnected.png
[3.SimpleClientSentAndReceivedMessage]: /files/develop/run-sample-apps/android-simple-sample/3.SimpleClientSentAndReceivedMessage.png

[1.StartScreen]: /files/develop/run-sample-apps/android-config-sample/1.StartScreen.png
[2.PressedConnectToAllJoynButton]: /files/develop/run-sample-apps/android-config-sample/2.PressedConnectToAllJoynButton.png
[3.DeviceListShowsAnAppSupportingConfigService]: /files/develop/run-sample-apps/android-config-sample/3.DeviceListShowsAnAppSupportingConfigService.png
[4.SelectDeviceShowConfigurableFields]: /files/develop/run-sample-apps/android-config-sample/4.SelectDeviceShowConfigurableFields.png
[5.ModifyName]: /files/develop/run-sample-apps/android-config-sample/5.ModifyName.png
