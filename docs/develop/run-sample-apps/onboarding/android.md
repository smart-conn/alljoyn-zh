# Android - Onboarding Sample Apps

## Running Android Sample OnboardingServer

The Android OnboardingServer provides a sample Android 
implementation of an app that uses the Onboarding server, 
to allow the device to be onboarded by another device's app 
using the Onboarding client.

1. On the device to be onboarded, first set up your Wi-Fi hotspot settings. 
Under **Settings** > **Wireless & networks**, select **Tethering & portable hotspot**. 
By default on some devices, this will be an open AP named "AndroidAP".

  ![][1.TetheringAndPortableHotspot]

2. Configure your Wi-Fi hotspot settings.

  ![][2.SetUpWiFiHotspot]

3. Load AboutConfOnbServer.apk, and start app `Onboarding Server`. 
You should see Wi-Fi hotspot notification bar icon pop up along 
with the text "Tethering or hotspot active". This device is now 
ready to be onboarded.

  ![][3.StartAppEnableHotspot]


## Running Android Sample OnboardingClient
The Android OnboardingClient provides a sample Android 
implementation of an app that uses the Onboarding client, 
to allow the app to onboard another device.

1. Load OnboardingSampleClient.apk, and start app `Onboarding Client`.

  ![][1.StartScreen]

2. Press `Scan WIFI networks`.

  ![][2.ScanNetworks]
  ![][3.NetworkList]

3. Select the Wi-Fi hotspot you configured on the device running 
the `Onboarding Server`, and enter a password if needed, then press **OK**.

  ![][4.EnterAccessPointPasswordIfNeeded]

4. Press the **Connect to AllJoyn** button, then press **OK** in 
the popup dialog - 'realm name' here is not important.

  ![][5.ChooseNetwork]
  ![][6.PressedConnectToAllJoyn]

5. A list of AllJoyn apps will be displayed. Long press on the `Hello` app, 
and select the **Onboarding** option.

  ![][7.DeviceList]
  ![][8.LongPressOnDevice]

6. Enter the access point info for the network that is being onboarded to.

  ![][9.SelectOnboarding]
  ![][10.EnterAccessPointInfoToOnboardTo]

7. Press **Configure** to configure the device with the access point info.

  ![][11.PressConfigure]

8. Press **Connect** to have the device connect with the configured AP information.

  ![][12.PressConnect]

9. If properly configured, the __other__ device running the 
`Onboarding Server` will be onboarded to the AP, after which 
the Wi-Fi hotspot notification bar icon disappears and the Wi-Fi 
icon appears in the notification bar.

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
