# Running Config Sample App - iOS

## Prerequisites

Follow steps in the [Building - iOS OS X section][build-ios-osx] 
to build and install the Config sample app on an iOS device.

You can use the Configuration service framework sample app 
to act as a Config Client, a Config Server, or both a Config Client 
and a Config Server simultaneously. In Client mode, you will 
be able to see any nearby applications that support the Config 
service and interact with them. In Server mode, the app will 
act as a Config Server, allowing other nearby applications 
to interact with it via a Config Client. If you run the app 
as both a client and a server, you will be able to interact 
with the Config server running in the app through the Config 
client that is also running in the app. This allows for development 
and testing using just a single device.

Alternately, run the app as a client on one device, and as a server on another device.

**NOTE:** If you are running the client and server on separate devices, 
both devices must be on the same Wi-Fi network.

## Run the Configuration service sample app as a Client
1. Launch the Configuration service sample app on your iOS device.
  ![][config-client-1]
2. Press the **Connect to AllJoyn** button.
  ![][config-client-2]
3. The application is now running in Client mode. In the list 
area below the Disconnect from AllJoyn button, any nearby 
applications that have been discovered via the About feature 
that also support the Configuration service framework are listed.
  ![][config-client-3]  
   **NOTE:** If there are not any nearby devices running the 
  Configuration service framework, follow the steps in 
  [Run the Configuration service sample app as a Server][run-config-sample-app-as-server] 
  to run the application simultaneously as a Config Server. 
  This will allow you to interact with the Config Server running 
  in the app through the Config Client that is also running in the app.
4. To interact with a Config Server, select one from the list 
of nearby applications that have been discovered.
5. Choose an option from the pop-up that appears:
    ![][config-client-4]
  * __Show Announce__: This will allow you to view the About 
  announcement that was received from the nearby application.
    ![][config-client-5]
  * __About__: This will show the full set of information 
  retrieved by the About Client from the nearby application.
    ![][config-client-6]
  * __Config__: Here, you can view the information provided by 
  the Config Client that it has retrieved from the Config Server 
  running in the nearby application. 
    * You can also use the Config Client to interact with and 
    configure different options provided by the Config Server 
    instance. For example, if you change the DeviceName field, 
    and then use the **Back** button to return to the main view 
    that displays nearby applications, you will notice the new device name is listed.
    ![][config-client-7]
    ![][config-client-8]
    ![][config-client-9]

## Run the Configuration service sample app as a Server

1. Launch the Configuration service sample app on your iOS device.
  ![][config-client-1]
2. At the bottom of the screen, press the **Start Service** button.
3. The application is now running in Server mode.
  ![][config-service-1]
   **NOTE:** To interact with the Config Server, either run 
   the sample app as a Config Client on the same device or on 
   a different device, as detailed in 
   [Run the Configuration service sample app as a Client][run-config-sample-app-as-client].


[config-client-1]: /files/develop/run-sample-apps/ios-config-sample/config-client-1.png
[config-client-2]: /files/develop/run-sample-apps/ios-config-sample/config-client-2.png
[config-client-3]: /files/develop/run-sample-apps/ios-config-sample/config-client-3.png
[config-client-4]: /files/develop/run-sample-apps/ios-config-sample/config-client-4.png
[config-client-5]: /files/develop/run-sample-apps/ios-config-sample/config-client-5.png
[config-client-6]: /files/develop/run-sample-apps/ios-config-sample/config-client-6.png
[config-client-7]: /files/develop/run-sample-apps/ios-config-sample/config-client-7.png
[config-client-8]: /files/develop/run-sample-apps/ios-config-sample/config-client-8.png
[config-client-9]: /files/develop/run-sample-apps/ios-config-sample/config-client-9.png
[config-service-1]: /files/develop/run-sample-apps/ios-config-sample/config-service-1.png


[build-ios-osx]: /develop/building/ios-osx
[run-config-sample-app-as-server]: #run-the-configuration-service-sample-app-as-a-server
[run-config-sample-app-as-client]: #run-the-configuration-service-sample-app-as-a-client