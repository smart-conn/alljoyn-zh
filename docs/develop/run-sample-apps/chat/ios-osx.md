# Running Chat Sample - iOS

## Prerequisites
* [Build the sample][build-ios-osx]
* Install the Chat sample app on two iOS devices.
* Both iOS devices must be connected to the same Wi-Fi network.

[build-ios-osx]: /develop/building/ios-osx

## Run AllJoyn&trade; Chat

Launch the AllJoyn Chat app on two iOS devices.

The AllJoyn Chat should now now be running on both iOS devices. The initial screen should look like this:
  ![][setup-screen]

  **Figure:** Chat startup screen

[setup-screen]: /files/develop/run-sample-apps/ios-chat-sample/setup-screen.png

### Chat using a session

1. On both devices, ensure that the **Use a session** option is toggled to _ON_.

2. On one device, select the **Host** button, then press **Start**.
On the second device, select the **Join** button, then press
**Start**. The screen on both apps should look like this:

  ![][chat-screen]

**Figure:** Initial message screen

3. On one device, enter a message and press **Send**. The message
appears on the device it was entered on, and also on the second
device. Example screenshots:

  ![][chat-device1-1]

**Figure:** Device 1 sends "hello"

  ![][chat-device2-1]

**Figure:** Device 2 receives "hello" from device 1

  ![][chat-device1-2]

**Figure:** Device 2 responds with  "hi"

  ![][chat-device2-2]

**Figure:** Device 1 receives "hi" from device 2

[chat-screen]: /files/develop/run-sample-apps/ios-chat-sample/chat-screen.png
[chat-device1-1]: /files/develop/run-sample-apps/ios-chat-sample/chat-device1-1.png
[chat-device1-2]: /files/develop/run-sample-apps/ios-chat-sample/chat-device1-2.png
[chat-device2-1]: /files/develop/run-sample-apps/ios-chat-sample/chat-device2-1.png
[chat-device2-2]: /files/develop/run-sample-apps/ios-chat-sample/chat-device2-2.png

### Chat using sessionless signals

1. On both devices, ensure that the **Use a session** option is toggled to _OFF_.

  ![][sls-setup-screen]

**Figure:** Chat startup screen

2. On both devices, press **Start**. The screen on both apps should look like this:

  ![][sls-chat-screen]

**Figure:** Initial message screen

3. On one device, enter a message and press **Send**. The message
appears on the device it was entered on, and also on the second device.
Example screenshots:

![][sls-chat-device1-1]

**Figure:** Device 1 user types "hi"

![][sls-chat-device1-2]

**Figure:** Device 1 receives "hey" response from Device 2

[sls-setup-screen]: /files/develop/run-sample-apps/ios-chat-sample/sls-setup-screen.png
[sls-chat-screen]: /files/develop/run-sample-apps/ios-chat-sample/sls-chat-screen.png

[sls-chat-device1-1]: /files/develop/run-sample-apps/ios-chat-sample/sls-chat-device1-1.png
[sls-chat-device1-2]: /files/develop/run-sample-apps/ios-chat-sample/sls-chat-device1-2.png
