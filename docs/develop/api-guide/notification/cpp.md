# Notification API Guide - C++

## Reference code

### Source code

| Package | Description |
|---|---|
| AllJoyn&trade; | The Standard Client AllJoyn code |
| AboutService | About feature code |
| NotificationService | Notification service framework code |
| Services Common | Code that is common to the AllJoyn&trade; service frameworks |
| Sample Apps | Code that is common to the AllJoyn service framework sample applications

### Reference C++ application code

| Application | Description |
|---|---|
| Producer Basic | Basic application that sends a hard-coded notification. |
| Consumer Service | Simple consumer application that displayed received notifications. |

### Obtain the Notification service framework

See the [Building Linux][building-linux] section
for instructions on compiling the Notification service framework.

### Build a Notification Producer

The following steps provide the high-level process to build a Notification Producer.

1. Create the base for the AllJoyn application.
2. Implement the ProperyStore and use this with the AboutService
in server mode. See the [About API Guide][about-api-guide-cpp] for instructions.
3. Initialize the Notification service and create a Producer.
4. Create a notification, populate the necessary fields,
and use the Producer to send the notification.

### Build a Notification Consumer

The following steps provide the high-level process to build a
Notification Consumer.

1. Create the base for the AllJoyn application.
2. Create a class that implements the NotificationReceiver.
3. Initialize the Notification service and provide the
receiver implementation.
4. Start receiving notifications.

### Setting up the AllJoyn framework and About feature

The steps required for this service framework are universal
to all applications that use the AllJoyn framework and for
any application using one or more AllJoyn service frameworks.
Prior to use of the Notification service framework as a
Producer or Consumer, the About feature must be implemented
and the AllJoyn framework set up.

Complete the procedures in the following sections to guide
you in this process:

* [Building Linux][building-linux] section
* [About API Guide][about-api-guide-cpp]

## Implementing a Notification Producer

### Initialize the AllJoyn framework

See the [Building Linux][building-linux] section for instructions
to set up the AllJoyn framework.

#### Create bus attachment

```cpp
bus->Start();
bus->Connect();
```

### Start the AboutService in service mode

The Notification producer depends on the About feature.

For more information about the About feature, see the
[About API Guide][about-api-guide-cpp].

#### Create a PropertyStore and fill it with the needed values

```cpp
propertyStore = new AboutPropertyStoreImpl();
propertyStore->setDeviceId(deviceId);
propertyStore->setAppId(appIdHex);
propertyStore->setAppName(appName);
std::vector<qcc::String> languages(3);
languages[0] = "en";
languages[1] = "sp";
languages[2] = "fr";
propertyStore->setSupportedLangs(languages);
propertyStore->setDefaultLang(defaultLanguage);
   DeviceNamesType::const_iterator iter = deviceNames.find(languages[0]);
   if (iter != deviceNames.end()) {
      CHECK_RETURN(propertyStore->setDeviceName(iter->second.c_str(), languages[0]));
   } else {
      CHECK_RETURN(propertyStore->setDeviceName("My device name", "en"));
   }

   iter = deviceNames.find(languages[1]);
   if (iter != deviceNames.end()) {
      CHECK_RETURN(propertyStore->setDeviceName(iter->second.c_str(), languages[1]));
   } else {
      CHECK_RETURN(propertyStore->setDeviceName("Mi nombre de dispositivo",
"sp"));
   }

   iter = deviceNames.find(languages[2]);
   if (iter != deviceNames.end()) {
      CHECK_RETURN(propertyStore->setDeviceName(iter->second.c_str(), languages[2]));
   } else {
      CHECK_RETURN(propertyStore->setDeviceName("Mon nom de l'appareil", "fr"));
   }
```

#### Implement a BusListener and SessionPortListener

In order to bind a SessionPort and accept sessions, a new
class must be created that inherits from the AllJoyn
BusListener and SessionPortListener classes.

The class must contain the following function:

```cpp
bool AcceptSessionJoiner(SessionPort sessionPort,
   const char* joiner, const
SessionOpts& opts)
```

The AcceptSessionJoiner function will be called any time a
joinsession request is received; the Listener class needs
to dictate whether the joinsession request should be accepted
or rejected by returning true or false, respectively.
These considerations are application-specific and can include
any of the following:

* The SessionPort the request was made on
* Specific SessionOpts limitations
* The number of sessions already joined.

Here is an example of a full class declaration for the listener class.

```cpp
class CommonBusListener : public ajn::BusListener,
   public ajn::SessionPortListener {

   public: CommonBusListener();
     ~CommonBusListener();
      bool AcceptSessionJoiner(ajn::SessionPort sessionPort,
         const char* joiner, const ajn::SessionOpts& opts);
   void setSessionPort(ajn::SessionPort sessionPort);
      ajn::SessionPort getSessionPort();
   private:
      ajn::SessionPort m_SessionPort;
};

#### Instantiate the BusListener and initialize the About feature

```cpp
busListener = new CommonBusListener(); AboutServiceApi::Init(*bus, *propertyStore);
AboutServiceApi* aboutService = AboutServiceApi::getInstance();
busListener->setSessionPort(port);
bus->RegisterBusListener(*busListener);
TransportMask transportMask = TRANSPORT_ANY; SessionPort sp = port;
SessionOpts opts(SessionOpts::TRAFFIC_MESSAGES, false, SessionOpts::PROXIMITY_ANY, transportMask);
bus->BindSessionPort(sp, opts, *busListener);
aboutService->Register(port);
bus->RegisterBusObject(*aboutService);
```

### Initialize the Notification service framework

```cpp
NotificationService* prodService = NotificationService::getInstance()
```

### Start the Notification producer

Start the Notification service framework and pass it the
bus attachment and the newly created PropertyStore.

```cpp
Sender = prodService->initSend(bus, propertyStoreImpl);
```

### Send a notification

#### Prepare the text per language to be sent

```cpp
NotificationText textToSend1("en", "The fridge door is open");
NotificationText textToSend2("de", "Die Kuhlschranktur steht offen");

std::vector<NotificationText> vecMessages;
vecMessages.push_back(textToSend1);
vecMessages.push_back(textToSend2);
```

#### Create a notification object

Create a notification object where you can set all the optional
fields such as an audio URL, etc.

```cpp
Notification notification(messageType, vecMessages);
```

##### Notification optional parameters

The following optional parameters can be added to the notification.

* Icon URL

  Set an icon URL that can be used to display along with
  the notification.

  ```cpp
  notification.setRichIconUrl("http://iconUrl.com/notification.jpeg");
  ```

* Audio URL

  Set an audio URL that can be used to enrich the notification.
  Each audio URL is set per language.

  ```cpp
  richAudioUrl audio1("en", "http://audioUrl.com/notif_en.wav");
  richAudioUrl audio2("de", "http://audioUrl.com/notif_de.wav");
  std::vector<RichAudioUrl> richAudioUrl;
  richAudioUrl.push_back(audio1);
  richAudioUrl.push_back(audio2);
  notification.setRichAudioUrl(richAudioUrl);
  ```

* Icon object path

  Set an icon object path so that the receiver can fetch the
  content of the icon to display along with the notification.

  ```cpp
  notification.setRichIconObjectPath("/OBJ/PATH/ICON");
  ```

* Audio object path

  Set an audio object path so that the receiver can fetch
  the audio content to play along with the notification.

  ```cpp
  notification.setRichAudioObjectPath("/OBJ/PATH/AUDIO");
  ```

* Control Panel Service object path

  Set a response object path that can be used to interact
  with a bus object to allow the user to perform a control
  action as a result of a notification.

  ```cpp
  notification.setControlPanelServiceObjectPath("/CPS/OBJ/PATH");
  ```

#### Send the notification

```cpp
status = Sender->send(notification, TTL);
```

### Delete the last message

Once a notification was eligible for delivery and the
application writer wants to cancel it, for example, if the
notification was sent for an event that no longer occurs,
and the TTL is still valid, the deleteLastMsg API can be
used to delete the last notification for a given messageType.

```cpp
Sender->deleteLastMsg(deleteMessageType);
```

## Implementing a Notification Consumer

### Initialize the AllJoyn framework

See the [Building Linux][building-linux] section for instructions
to set up the AllJoyn framework.

#### Create bus attachment

```cpp
bus->Start();
bus->Connect();
```

### Initialize the Notification service framework

```cpp
conService = NotificationService::getInstance();
```

### Start the Notification consumer

#### Implement the notificationReceiver interface

The notificationReceiver interface has a Receive method that
gets a notificationObject as an argument.

When a notification is received by the Notification service
framework, it will call the Receive method of the implemented
notificationReceiver interface with the notification.

```cpp
public void Receive(ajn::services::Notification const& notification);
```

The notificationObject has "getters" for all notification arguments
that were sent in the message. Arguments that describe the device
and the app it was received from follow.

```cpp
const char* getDeviceId() const;
const char* getDeviceName() const;
const char* getAppId() const;
const char* getAppName() const;
```

Arguments that describe the message follow.

```cpp
const int32_t getMessageId() const;
const NotificationMessageType getMessageType() const;
```

Arguments that give the content of the message follow.

```cpp
const std::vector<NotificationText>& getText() const;
const char* getRichIconUrl() const;
const char* getRichIconObjectPath() const;
const char* getRichAudioObjectPath() const;
const std::vector<RichAudioUrl>& getRichAudioUrl() const;
const char* getControlPanelServiceObjectPath() const;
```

The Notification Producer interface has a dismiss method that
is used to dismiss notification.

An application can choose to dismiss the notification, thereby
removing the notificartion from all entities in the proximal area.

An application that wants to dismiss a notification must call
the `QStatus dismiss()` method.

```cpp
At void 'derived of NotificationReceiver'::receive(Notification conast& notification)
{
   Notification.dismiss()
}
```

Create the actual object.

```cpp
receiver = new NotificationReceiverTestImpl();
```

For more details, refer to the API documentation.

The notificationReceiver interface has a dismiss method that
gets called when the receiver gets a dismiss signal.

```cpp
virtual void Dismiss(const int32_t msgId, const qcc::String appId) = 0;
```

This method also must be implemented by the derived class.

When the method is called, the application must dismiss the
notification it holds.

The identifiers to the notification are - mgsId and appId
which are the parameters of the method

#### Start the consumer

Start the consumer and pass it the bus attachment and the
notificationReceiver implmented in [Implement the notificationReceiver interface][implement-notificationreceiver-interface].

```cpp
conService->initReceive(busAttachment, Receiver);
```

[building-linux]:  /develop/building/linux
[about-api-guide-cpp]: /develop/api-guide/about/cpp
[implement-notificationreceiver-interface]: #implement-the-notificationreceiver-interface
