# Configuration API Guide - Objective-C

## Reference code

### Classes used to remotely change ConfigData

| Client class | Description |
|---|---|
| ConfigClient | Helper class for discovering About Server that provides access to the Announcements and to the AboutService. It listens for Announcements sent using the org.alljoyn.About interface. |

## Obtain the Configuration service framework

See the [Building iOS/OS X section][building-ios] for 
instructions on compiling the Configuration service framework.

## Build an application that uses ConfigClient

The following steps provide the high-level process to build an
application that will remotely manipulate ConfigData.

1. Create the base for the AllJoyn&trade; application.
2. Initialize the AboutService in client mode.
3. Initialize the ConfigService in client mode.
4. Create a ConfigClient to interact with an announced Config Server.

## Setting up the AllJoyn framework and About feature

The steps required for this service framework are universal
to all applications that use the AllJoyn framework and for any
application using one or more AllJoyn service frameworks.
Prior to use of the Configuration service framework as a
Config Client, the About feature must be implemented and
the AllJoyn framework set up.

Complete the procedures in the [Building iOS/OS X section][building-ios]
to guide you in this process.

## Implementing an Application that uses Config Client

To implement an application to receive and modify ConfigData,
use the ConfigClient class. The AboutClient class must be used
so that your application is notified when applications with
About Server and possibly Config Server instances send announcements.

Verify the BusAttachment has been created, started and
connected before implementing a Config Client.

**NOTE:**  Code in this chapter references a variable
`clientBusAttachment` (the BusAttachment variable name).

### Establish the AboutService object

For an application to discover peer applications that are
ConfigService providers, it requires an instance of AJNAnnouncementReceiver.

```objc
self.announcementReceiver = [[AJNAnnouncementReceiver alloc]
initWithAnnouncementListener:self andBus:self.clientBusAttachment];
const char* interfaces[] = { "org.alljoyn.Config" };
[self.announcementReceiver
registerAnnouncementReceiverForInterfaces:interfaces
   withNumberOfInterfaces:1];
```

### Create the ConfigService object

For an application to receive and modify ConfigData, it requires
an instance of the ConfigService class. AJCFGConfigService is
an implementation wrapper around AllJoyn native calls that
handle the interactions with the Config Server.

```objc
self.configService = [[AJCFGConfigService alloc]initWithBus:self.
   busAttachment propertyStore:self.propertyStore listener:self.configServiceListenerImpl];
```

### Start Client mode

```objc
[[AJCFGConfigClient alloc] initWithBus:self.clientBusAttachment];
```

### Engage with a peer ConfigService

Perform the following tasks to engage with a peer ConfigService
whose Announcement was received.

#### Create ConfigClient

Generate an instance of ConfigClient to receive and send
ConfigData to and from a peer Config Server.

```objc
self.configClient = [[AJCFGConfigClient alloc]
initWithBus:self.clientBusAttachment];
```

#### Request the ConfigData

The updateable ConfigData is requested through the ConfigClient
via the  configurationsWithBus:languageTag:configs:sessionId
method call. The structure that is returned can be iterated through
to determine the contents. The content definition is found in
the [Configuration Interface Definition][config-interface-definition].

```objc
NSMutableDictionary *configDict = [[NSMutableDictionary alloc] init];
self.configClient configurationsWithBus:self.annBusName languageTag:@""
configs:&configDict sessionId:self.sessionId];
```

#### Update the ConfigData

The received data can be updated through the ConfigClient
via the UpdateConfigurations() method call. The structure
that was returned by GetConfigurations() can be iterated
through to determine the contents. The content definition
is found in the [Configuration Interface Definition][config-interface-definition].

```objc
NSMutableDictionary *configElements = [[NSMutableDictionary alloc] init];
NSString *key = [self.writableElements allKeys][textField.tag];
AJNMessageArgument *msgArgValue = [[AJNMessageArgument alloc] init];
const char *char_str_value = [QASConvertUtil
convertNSStringToConstChar:textField.text];
[msgArgValue setValue:@"s", char_str_value];
configElements[key] = msgArgValue;
self.configClient updateConfigurationsWithBus:self.annBusName
   languageTag:@"" configs:&configElements sessionId:self.sessionId];
```

#### Reset the ConfigData

The ConfigData can be reset to default through the ConfigClient
via the ResetConfigurations() method call. The structure that
was returned by GetConfigurations() can be iterated through to
determine the list of reset fields. The content definition is
found in the [Configuration Interface Definition][config-interface-definition].

```objc
NSMutableArray *names = [[NSMutableArray alloc]
initWithArray:@[@"DeviceName"]];
[self.configClient resetConfigurationsWithBus:self.annBusName languageTag:@""
configNames:names];
```

#### Reset the peer device application to factory defaults

The peer device/application configuration can be reset to
factory defaults through the ConfigClient via the
`FactoryReset()` method call.

**NOTE:** This is a no-reply call, so its success cannot be determined directly.

```objc
[self.configClient factoryResetWithBus:self.annBusName
   sessionId:self.sessionId];
```

#### Restart the peer

The peer application can be restarted though the ConfigClient
via the Restart() method call.

**NOTE:**  This is a no-reply call, so its success cannot be
determined directly.

```objc
[self.configClient factoryResetWithBus:self.annBusName
   sessionId:self.sessionId];
```

#### Setting a passcode on the peer

The peer application can be set to have a different passcode
though the ConfigClient using the SetPasscode() method call.
This revokes the current encryption keys and regenerates new
ones based on the new shared secret, namely the passcode.

**NOTE:** The realm name is currently ignored.

```objc
NSString *pass = @"123456";
NSData *passcodeData = [pass dataUsingEncoding:NSUTF8StringEncoding];
const void *bytes = [passcodeData bytes];
int length = [passcodeData length];
[self.configClient setPasscodeWithBus:self.annBusName
   daemonRealm:self.realmBusName newPasscodeSize:length
   newPasscode:(const uint8_t
*)bytes sessionId:self.sessionId];
```

### Delete variables and unregister listeners

Once you are done using the About feature, Configuration
service framework, and the AllJoyn framework, free the
variables used in the application.

The ARC takes care of releasing some objects so no need to
do it explicitly.

```objc
const char* interfaces[] = { "org.alljoyn.Config" };
   [self.announcementReceiver unRegisterAnnouncementReceiverForInterfaces:interfaces withNumberOfInterfaces:1];
self.announcementReceiver = nil;
```

[building-ios]: /develop/building/ios-osx
[config-interface-definition]: /learn/base-services/configuration/interface
