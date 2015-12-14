# Running Basic Sample - iOS

## Prerequisites

* [Build samples][build-ios-osx] and install the Basic Client and Service sample apps on two iOS devices.
* Both iOS devices must be connected to the same Wi-Fi network


## Run Basic Client & Service
1. Launch the Basic Client app on one iOS device.
2. The Basic Client app screen should look similar to this:

  ![][basic-client-screen-1]

  **Figure:** Client startup screen

3. Launch the Basic Service app on a second iOS device.
4. The screen should look similar to this:

  ![][basic-service-screen-1]

  **Figure:** Service startup screen

5. In the Basic Client app, press the **Call Service** button.
This will cause the client to try and find the service, connect
to the service, and execute a sample bus method.

  ![][basic-client-screen-2]

  **Figure:** Client screen after pressing `Call Service`

6. The Basic Client app screen should look like this:

  ![][basic-client-screen-3]

  **Figure:** Client screen after successful connection

7. The Basic Service app screen should look like this:

  ![][basic-service-screen-2]

  **Figure:** Service screen after successful connection

[basic-client-screen-1]: /files/develop/run-sample-apps/ios-basic-sample/ios-basic-client-1.png
[basic-client-screen-2]: /files/develop/run-sample-apps/ios-basic-sample/ios-basic-client-2.png
[basic-client-screen-3]: /files/develop/run-sample-apps/ios-basic-sample/ios-basic-client-3.png
[basic-service-screen-1]: /files/develop/run-sample-apps/ios-basic-sample/ios-basic-service-1.png
[basic-service-screen-2]: /files/develop/run-sample-apps/ios-basic-sample/ios-basic-service-2.png

[build-ios-osx]: /develop/building/ios-osx
