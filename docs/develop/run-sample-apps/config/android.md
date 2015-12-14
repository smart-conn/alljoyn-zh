# Android - Config Sample Apps

## Running Android ConfigClientSample
The Android ConfigClientSample provides a sample Android 
implementation of an app that uses the Config client.

1. Load ConfigClientSample.apk, and start app `Config Client`.

  ![][1.StartScreen]

2. Connect a second device, running an app which implements 
the Config service, to the same network that the first 
device is connected to. (You can use the AboutConfOnbServer.apk 
in the Onboarding SDK.)

3. On the first device, in the `Config Client` app, 
press the **Connect to AllJoyn** button, and press **OK**.

  ![][2.PressedConnectToAllJoynButton]

4. In the device list of the `Config Client` app, the 
friendly name of the app from the second device should show up.

  ![][3.DeviceListShowsAnAppSupportingConfigService]

5. Select the device list entry to configure the second 
device's app that implements the Config service.

  ![][4.SelectDeviceShowConfigurableFields]

6. Change the desired fields, check the appropriate 
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
