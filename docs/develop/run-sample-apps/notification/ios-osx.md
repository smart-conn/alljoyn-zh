# Run the Notification Sample App - iOS

## Prerequisites
Follow steps in the [Building - iOS OS X section][build-ios-osx]
to build and install the Notification sample app on an iOS device.

You can use the Notification service sample app to act as a
Notification Producer, a Notification Consumer, or both a
Producer and Consumer, simultaneously. If you run the app
as both a producer and consumer simultaneously, you will be
able to send and receive notifications on a single iOS device.

Alternately, you can run the app as a Producer on one device,
and as a Consumer on another device.

**NOTE:** Both devices must be on the same Wi-Fi network.

## Run the Notification Sample App as a Producer

1. Launch the Notification sample app on your iOS device.

  ![producer-1][]

2. In the Application Name field, enter a name to be used as
the application name by the Notification producer, for example, TestApp.
3. Click __Producer__ to run in Producer mode.

  ![producer-2][]

4. In the first text field, enter the message you want to send in a notification.
5. Optionally, enter the message in another language in the
second text field. You can use the selector to the right of
the text field to choose the second language.
6. Use the standard TTL, or enter a new one if desired.
7. Optionally, toggle on the Audio and Icon URL fields.
8. Next to the Message type label, use the selector to choose
a message type of INFO, WARNING, or EMERGENCY.
9. Press the __Send__ button to send the notification.

  ![producer-3][]
  ![producer-4][]

**NOTE:** To receive and view the notification you sent, either
run the Notification service sample app as a Consumer
on the same device or on a different device.

## Run the Notification Sample App as a Consumer

1. Launch the Notification sample app on your iOS device.

  ![producer-1][]

2. Do one of the following in the Application Name field:
  * Enter a name to be used as the application name. In this case,
  the application filters out any notifications that it receives
  where the app name in the notification does not match the app
  name in the Application Name field. This feature is to facilitate
  testing sending and receiving notifications between multiple
  different applications simultaneously on the same network.
  * Leave the field blank. In this case, the application will
  display all notifications that it receives, regardless of
  which application produced them.
3. Click __Consumer__ to run in Consumer mode.

  ![][consumer-1]

The application will now receive notifications.

  ![][consumer-2]

**NOTE:** To receive notifications in the app, either run the
Notification service sample app as a Producer on the same
device or on a different device, as detailed in
[Run the Notification sample app as a Producer][run-notif-sample-app-producer].

[producer-1]: /files/develop/run-sample-apps/ios-notification-sample/producer-1.png
[producer-2]: /files/develop/run-sample-apps/ios-notification-sample/producer-2.png
[producer-3]: /files/develop/run-sample-apps/ios-notification-sample/producer-3.png
[producer-4]: /files/develop/run-sample-apps/ios-notification-sample/producer-4.png
[consumer-1]: /files/develop/run-sample-apps/ios-notification-sample/consumer-1.png
[consumer-2]: /files/develop/run-sample-apps/ios-notification-sample/consumer-2.png


[build-ios-osx]: /develop/building/ios-osx
[run-notif-sample-app-producer]: #run-the-notification-sample-app-as-a-producer
