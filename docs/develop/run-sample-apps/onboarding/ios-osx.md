# Run the Onboarding Sample App - iOS

## Prerequisites

[Build the iOS sample apps][build-ios-osx] and install the 
Onboarding sample app on an iOS device.

The Onboarding service sample app functions as the Onboarder 
side of the Onboarding service framework. At this time, there 
is not an iOS Onboardee sample application. In order to have 
an Onboardee to interact with, follow the instructions in 
[Run an Onboardee][run-onboardee] to set up and run a 
sample Oboardable application on an Android device. The Android 
device and the iOS device must be on the same network.

## Run the Onboarding Sample App

1. Use the **Settings** > **Wi-Fi** menu option on your iOS device 
to connect to the AP being advertised by the device that you want to onboard.
2. Once you have connected to the device's AP, run the 
Onboarding service sample app on your iOS device.
3. Click the **Connect to AllJoyn** button.
4. In the pop-up that appears, set the name to be used 
by the About feature in the application. You can use the 
default of org.alljoyn.BusNode.onboardingClient, or enter your own.
The application is now running as an Onboarder. In the list 
area below the Disconnect from AllJoyn button, you will see 
any nearby applications that have been discovered via the 
About feature that support the Onboarding service framework 
and are acting as an Onboardee.
5. To interact with an Onboardee, select one from the list 
of nearby applications that have been discovered.
6. Choose an option from the pop-up that appears:
  * Show Announce: This will allow you to view the About 
  announcement that was received from the nearby application.
  * About: This will show the full set of information 
  retrieved by the About Client from the nearby application.
  * Onboarding: You can use the Onboarder to step through 
  the process of onboarding the Onboardee onto the local Wi-Fi network.
7. Select the Onboarding option and do the following:
  * Enter the SSID and password of the Wi-Fi network you want 
  to onboard the device onto, and then click **Configure**. 
  This will use the Onboarding service to pass these values to the Onboardee.
  * Click **Connect**. You should see a Success message along 
  with instructions to go to the **Settings** > **Wi-Fi** menu 
  option on your iOS device and switch networks to the one 
  that you onboarded the device to.
  * Once you switch networks, you should now see the device 
  you onboarded listed as a nearby device under the 
  **Disconnect from AllJoyn** button. If you select the device, 
  you will see that it has been onboarded, and you now have the 
  option to offboard the device.

## Run an Onboardee

Follow the [instructions to run the AboutConfOnbServer in Android][onboardee]. 
You will then be able to use the iOS Onboarding Service 
sample app to onboard the app on the Android device.

When you run the AboutConfOnbServer application on an Android device, 
it will automatically put the device into "AP mode". Depending on your 
Android device, you may need to manually edit the AP name to include 
a prefix of "AJ_". This prefix is used by the Onboarding service framework 
to determine which APs are for AllJoyn devices that support the Onboarding service framework. 

[build-ios-osx]: /develop/building/ios-osx
[run-onboardee]: #run-an-onboardee
[onboardee]: /develop/run-sample-apps/onboarding/android#running-android-sample-onboardingserver