# Running About Sample App - iOS

## Prerequisites
Follow steps in the [Building - iOS OS X section][build-ios-osx] 
to build and install the About sample app on an iOS device.

You can use the About sample app to act as an About Client, an About Service, 
or both a Client and a Service simultaneously. If you run the app as both 
a client and server simultaneously, you will be able to publish and 
receive About announcements on a single iOS device.

Alternately, run the app as a client on one device, and as a service on another device.

**NOTE:** Both devices must be on the same Wi-Fi network.

## Run the About sample app as a Client

1. Launch the About sample app on your iOS device.
2. Click **Connect to AllJoyn**.
3. In the pop-up that appears, set the name to be used by the 
About feature in the application. You can use the default of 
org.alljoyn.BusNode.aboutClient, or enter your own.
  * The application is now running in Client mode. 
  * In the list area below the **Disconnect from AllJoyn** button, 
  you will see any nearby applications that have been discovered 
  via their About announcements.
  NOTE: If there are no nearby devices, follow the steps in 
  [Run the About sample app as a Service][run-about-sample-app-as-service] 
  to run the application simultaneously as an About Service. This will allow 
  you to interact with the About Server running in the app through the 
  About Client that is also running in the app.
 
4. To interact with an About Service, select one from the list 
of nearby applications that have been discovered.
5. Choose an option from the pop-up that appears:
  * **Show Announce**: This will allow you to view the About announcement 
  that was received from the nearby application.
  * **About**: This will show the full set of information retrieved 
  by the About Client from the nearby application.
  * **Icon**: This will display the About Icon that has been 
  retrieved from the nearby application.

## Run the About sample app as a Service

1. Run the About sample app on your iOS device.
2. At the bottom of the screen, click **Start About Service**.
3. The application is now running in Server mode.

**NOTE:** To interact with the About Service, either run the sample 
app as an About Client on the same device or on a different device, 
as detailed in [Run the About sample app as a Client](#run-the-about-sample-app-as-a-client).


[build-ios-osx]: /develop/building/ios-osx
[run-about-sample-app-as-service]: #run-the-about-sample-app-as-a-service