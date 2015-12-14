# Notification API Guide - Java

## Reference code

### Source code

| Package | Description |
|---|---|
| NotificationService | Notification service framework code, not platform-dependent. |
| NotificationServiceCommons | Code that is common to all Java AllJoyn&trade; service frameworks. |
| NotificationServiceNativePlatformAndroid | Code that is Android-specific. |

### Reference Java application code

| Application | Description |
|---|---|
| NotificationServiceUISample | UI-based application that can be used as a producer and/or a consumer to send and receive notifications. |

## Obtain the Notification service framework

See the [Building Android][building-android] section for instructions
on compiling the Notification service framework.

### Build a Notification Producer

The following steps provide the high-level process to build
a Notification Producer.

1. Create the base for the AllJoyn application.
2. Implement the ProperyStore and use this with the AboutService
in server mode. See the [About API Guide][about-api-guide-java] for instructions.
3. Initialize the Notification service framework and create a Producer.
4. Create a notification, populate the necessary fields, and
use the Producer to send the notification.

### Build a Notification Consumer

The following provides the high-level steps to build a Notification Consumer.

1. Create the base for the AllJoyn application.
2. Initialize the AboutService in client mode. See the
[About API Guide][about-api-guide-java] for instructions.
3. Create a class that implements the NotificationReceiver.
4. Initialize the Notification service framework and provide
the receiver implementation.
5. Start receiving notifications.

### Setting up the AllJoyn framework and About feature

The steps required for this service are universal to all applications
that use the AllJoyn framework and for any application using one or
more AllJoyn service frameworks. Prior to use of the Notification
service framework as a Producer or Consumer, the About feature must
be implemented and the AllJoyn framework set up.

Complete the procedures in the following sections to guide you in this process:

* [Building Android][building-android]
* [About API Guide][about-api-guide-java]

## Implementing a Notification Producer

### Initialize the AllJoyn framework

See the [Building Android][building-android] section for instructions to
set up the AllJoyn framework.

### Start the AboutService in server mode

The Notification service framework Producer depends on the About feature.

For more information about the About feature, see the [About API Guide][about-api-guide-java].

#### Initialize the About feature

```java
aboutService = AboutServiceImpl.getInstance();
```

#### Create a PropertyStore

```java
PropertyStore propertyStore = new PropertyStoreImpl(this);
Map<String, Object> config = propertyStore.ReadAll(Property.NO_LANGUAGE,Filter.READ);
String deviceName = (String)config.get(AboutKeys.ABOUT_DEVICE_NAME);
   propertyStore.setValue(AboutKeys.ABOUT_DEVICE_NAME, DEVICE_NAME, Property.NO_LANGUAGE);
}
propertyStore.setValue(AboutKeys.ABOUT_APP_NAME, appName, Property.NO_LANGUAGE);
try {
   aboutService.startAboutServer((short)1080, propertyStore, bus);
}
catch (Exception e) {
   Log.e(TAG, "AboutConfigService failed, Error: " + e.getMessage());
```

### Initialize the Notification service framework

```java
notificationService = NotificationService.getInstance();
```

### Start the Notification service framework producer

Start the Notification service framework, and pass it the
bus attachment and the newly created PropertyStore.

```java
notificationSender = notificationService.initSend(bus, propertyStore);
isSenderStarted	= true;
```

### Send a notification


#### Prepare the text per language to be sent

```java
List<NotificationText> text = new LinkedList<NotificationText>();
text.add(new NotificationText("en", "The fridge door is open"));
text.add(new NotificationText("de", "Die Kuhlschranktur steht offen"));
```

#### Create a notification object

Create a notification object where you can set all the optional
fields such as an audio URL, etc.

```java
Notification notif = new Notification(messageType, text);
```

##### Notification optional parameters

The following optional parameters can be added to the notification:

* Icon URL - Set an icon URL that can be used to display along with the notification.

  ```java
   notif.setRichIconUrl("http://iconUrl.com/notification.jpeg");
  ```

* Audio URL - Set an audio URL that can be used to enrich the
notification. Each audio URL is set per language.

  ```java
   List< RichAudioUrl> audioUrl = new LinkedList< RichAudioUrl>();
   audioUrl.add(new NotificationText("en", "http://audioUrl.com/notif_en.wav"));
   audioUrl.add(new NotificationText("de", "http://audioUrl.com/notif_de.wav""));

      notif.setRichAudioUrl(audioUrl);
  ```

* Icon object path - Set an icon object path so that the receiver
can fetch the content of the icon to display along with the notification.

  ```java
   notif.setRichIconObjPath("/OBJ/PATH/ICON");
  ```

* Audio object path - Set an audio object path so that the receiver
can fetch the audio content to play along with the notification.

  ```java
   notif.setRichAudioObjPath("/OBJ/PATH/AUDIO");
  ```

* Response object path - Set a response object path that can
be used to interact with a bus object to allow the user to
perform a control action as a result of a notification.

  ```java
   notif.setResponseObjectPath(/CPS/OBJ/PATH);
  ```

#### Send the notification

```java
notificationSender.send(notif, ttl);
```

### Delete the last message

Once a notification was sent out and the application writer
would like to cancel it, for example, if the notification was
sent for an event that no longer occurs, and the TTL is still
valid, use the deleteLastMsg API to delete the last notification
for a given messageType.

```java
notificationSender.deleteLastMsg(messageType);
```

## Implementing a Notification Consumer

### Initialize the AllJoyn framework

See the [About API Guide][about-api-guide-java] for instructions
to set up the AllJoyn framework.

### Start an AboutClient in client mode

The Notification service framework consumer depends on the About feature.

For more information about the About feature, see the [About API Guide][about-api-guide-java].

#### Initialize the About feature

```java
aboutService = AboutServiceImpl.getInstance();
```

#### Start the AboutClient in client mode

Start the client to receive announcements.

```java
aboutService.startAboutClient(bus);
```

### Initialize the Notification service framework

```java
notificationService = NotificationService.getInstance();
```

### Start the Notification service framework consumer

#### Implement the notificationReceiver interface

The notificationReceiver interface contains the following
methods that can be implemented.

##### `receive`

The `receive` method gets a notification object as an argument.
Implement this method to receive the notifications sent on the network.

When a notification is received by the service, it will call
the `receive` method of the implemented notificationReceiver
interface with the notification.

```java
@Override
public void receive(Notification notification)

@Override
public void receive(Notification notification)
```

The notificationObject has a `dismiss` method and "getters"
for all notification arguments that were sent in the message.

Dismiss a message:

Implement this method to receive dismiss signals that were
sent on the network so you can dismiss notifications that
were received and should not be shown.

```java
notification.dismiss();
```

Arguments that describe the device and app it were received from follow.

```java
UUID notifAppId	 = notification.getAppId();
String notifAppName	= notification.getAppName();
String notifDeviceId	= notification.getDeviceId();
String notifDeviceName	= notification.getDeviceName();
```

Arguments that describe the message follow.

```java
int msgID	= notification.getMessageId();
String msgType = notification.getMessageType();
```

Arguments that give the content of the message follow.

```java
List<NotificationText> text	= notification.getText();
List<RichAudioUrl> richAudioUrlL = notification.getRichAudioUrl();

String richIconUrl	= notification.getRichIconUrl();
   String richIconObjPath	= notification.getRichIconObjPath();
   String richAudioObjPath	= notification.getRichAudioObjPath();
   String responseObjectPath = notification.getResponseObjectPath();
```

For more details, refer to the API documentation.

##### Dismiss

When a dismiss signal is received by the service it calls the
`dismiss` method the application writer provided the service,
so that the application can remove the application from the UI:

```java
@Override
public void dismiss(int notifId, UUID appId)
```

#### Start the consumer

Start the consumer and pass it the bus attachment and the
notificationReceiver from above.

```java
notificationService.initReceive(bus, notificationReceiver);
```


[building-android]: /develop/building/android
[about-api-guide-java]: /develop/api-guide/about/java
