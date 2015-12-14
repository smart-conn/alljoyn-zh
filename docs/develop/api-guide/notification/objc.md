# Notification Service API Guide - Objective-C

## Using the Notification Service

There are two ways to use the Notification Service, as a
*Producer* and as *Consumer*. The power of the
[Notification service][learn_notif] is its simplicity and ability to
allow devices to "talk" to end users to provide meaningful information.

The Notification Producer side of an application is responsible
for sending a [sessionless signal][sessionless_signal] that
contains a small amount of text with some optional values.
This text is intended to be rendered on any device that contains
the Consumer side of the Notification Service.

The Notification Consumer side of an application is responsible
for registering to receive the [sessionless signal][sessionless_signal]
from any application that supports the Producer side of the Notification service.

An application can be a consumer, a producer, or both.

## Reference code

### Source code

| Component | Description |
|---|---|
| AllJoyn&trade; | The AllJoyn Standard Library code |
| NotificationService | Notification service framework code |
| ServiceCommons | Code that is common to the AllJoyn service frameworks |
| SampleApps | Code that is common to the AllJoyn service framework sample applications |

### Reference iOS application code

| Application | Description |
|---|---|
| NotificationService | An iOS application of both a producer and consumer. |

## Prerequisites

Follow the steps in the [Building iOS/OS X][building-ios] section to
get your environment and project setup to use the AllJoyn&trade;
framework and the Notification Service.

## Build a Notification Producer

The following steps provide the high-level process to build a Notification Producer.

1. Create the base for the AllJoyn application.
2. Implement the ProperyStore and use this with the AboutService in server mode.
3. Initialize the Notification service framework and create a Producer.
4. Create a notification, populate the necessary fields, and use
the Producer to send the notification.

## Build a Notification Consumer

The following steps provide the high-level process to build a Notification Consumer.

1. Create the base for the AllJoyn application.
2. Create a class that implements the NotificationReceiver.
3. Initialize the Notification service framework and provide
the receiver implementation.
4. Start receiving notifications.

## Producing Notifications

### General AllJoyn Setup

#### Initialize the AllJoyn framework

See the [Building iOS/OSX][building-ios] section for instructions
to set up the AllJoyn framework.

#### Create bus attachment

```objc
AJNBusAttachment* bus = [[AJNBusAttachment alloc]
initWithApplicationName:@"CommonServiceApp" allowRemoteMessages:true];
[bus start];
```

### About Feature Setup

#### Create a PropertyStore and fill it with the needed values

```objc
self.aboutPropertyStoreImpl = [[QASAboutPropertyStoreImpl alloc]
   init]; setAppId:[[NSUUID UUID] UUIDString];
[self.aboutPropertyStoreImpl setAppName:@"NotificationApp"];
[self.aboutPropertyStoreImpl setDeviceId:@"1231232145667745675477"];
[self.aboutPropertyStoreImpl setDeviceName:@"Screen"];
NSArray* languages = @[@"en", @"sp", @"de"];
```

#### Start the About Service

```objc
self.aboutService = [QASAboutServiceApi sharedInstance];
[self.aboutService startWithBus:self.busAttachment
   andPropertyStore:self.aboutPropertyStoreImpl];
```

### Create Notification Producer

#### Initialize the Notification service framework

```objc
  AJNSNotificationService *producerService;
  // Initialize a AJNSNotificationService object
  self.producerService =  [[AJNSNotificationService alloc] init];
```

#### Start the Notification producer, providing the bus attachment
and About property store implementation

```objc
  AJNSNotificationSender *Sender;
  // Call initSend
  self.Sender = [self.producerService startSendWithBus:self.busAttachment
    andPropertyStore:self.aboutPropertyStoreImpl];
  if (!self.Sender) {
      [self.logger fatalTag:[[self class] description]
        text:@"Could not initialize Sender"];
      return ER_FAIL;
  }
```

#### Create a Notification

  Required parameters are `Message Type` and `Notification Text`

```objc
  AJNSNotification *notification;
  self.notification = [[AJNSNotification alloc] initWithMessageType:self.messageType
     andNotificationText:self.notificationTextArr];
```

  Set the `DeviceId` `DeviceName` `AppId` `AppName` and
  `Sender` so that applications that receive and consumer the
  notification know where it came from and who sent it.

```objc
  [self.notification setDeviceId:nil];
  [self.notification setDeviceName:nil];
  [self.notification setAppId:nil];
  [self.notification setAppName:self.appName];
  [self.notification setSender:nsender];
```

#### Send the Notification

  Provide a valid TTL.

```objc
  QStatus sendStatus = [self.Sender send:self.notification ttl:nttl];
  if (sendStatus != ER_OK) {
    [self.logger infoTag:[[self class] description]
       text:[NSString stringWithFormat:@"Send has failed"]];
  }
  else {
    [self.logger infoTag:[[self class] description]
       text:[NSString stringWithFormat:@"Successfully sent!"]];
  }
```

#### Advanced Features
  * Audio
  * Image
  * Custom Attributes
  * Delete the last message sent

## Consuming Notifications

### General AllJoyn Setup

#### Initialize the AllJoyn framework

See the [Building iOS/OSX][building-ios] section for instructions
to set up the AllJoyn framework.

#### Create bus attachment

```objc
AJNBusAttachment* bus = [[AJNBusAttachment alloc]
initWithApplicationName:@"CommonServiceApp" allowRemoteMessages:true];
[bus start];
```

### About Feature Setup
### Create Notification Consumer

#### Initialize the Notification service framework

```objc
  AJNSNotificationService *consumerService;
  self.consumerService = [AJNSNotificationService sharedInstance];
```

#### Implement the `notificationReceiver` interface (`receive` and
`dismissMsgId` methods)

```objc
  - (void)receive:(AJNSNotification *)ajnsNotification
  {
    // application logic to handle the received notification
  }

  - (void)dismissMsgId:(const int32_t)msgId appId:(NSString*) appId
  {
    // application logic to handle the dismissed notification
  }
```

#### Start the Notification consumer, providing the bus attachment
and Notification receiver

```objc
  // Call "initReceive"
  status = [self.consumerService startReceive:self.busAttachment
     withReceiver:self];
  if (status != ER_OK) {
    [self.logger fatalTag:[[self class] description]
       text:@"Could not initialize receiver"];
    return ER_FAIL;
  }
```

Refer to the Notification Service Sample App source code
and API documentation for examples and more details.  

[learn_notif]: /learn/base-services/notification
[building-ios]: /develop/building/ios-osx
[sessionless_signal]: /learn/core#sessionless-signal
