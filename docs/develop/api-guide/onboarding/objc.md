# Onboarding API Guide - Objective-C

## Reference code

### Source code

The Onboarder application uses the following Onboarding
service framework libraries:

* alljoyn_onboarding_objc.a
* alljoyn_onboarding_cpp.a
* alljoyn_about_cpp.a
* alljoyn_about_objc.a

### Reference Objective-C application code

| Application | Description |
|---|---|
| AboutConfOnboardingClient | UI-based application that can be used to onboard an AllJoyn&trade; device to a personal AP. This application includes also the About capability. |

## Obtain the Onboarding service framework

See the [Building iOS/OS X][building-ios] section for
instructions on compiling the Onboarding service framework.

## Build the Onboarder application

The following steps provide the high-level process to build an
Onboarding application.

1. Create the base for the AllJoyn application. See the
[About API Guide][about-api-guide-objc] for more information.
2. Set your iOS device network to connect to an AJ_ or _AJ network.
3. Initialize the AboutService in client mode and provide it
with the AnnouncementHandler object.

See the [About API Guide][about-api-guide-objc] for more information.

## Setting up the AllJoyn framework

The steps required for this service framework are universal
to all applications that use the AllJoyn framework and for
any application using one or more AllJoyn service frameworks.
Prior to use of the Onboarding service framework, the About
feature must be implemented and the AllJoyn framework set up.

Complete the procedures in the following sections to guide
you in this process:

* [Building iOS/OS X section][building-ios]
* [About API Guide][about-api-guide-objc]

## Implementing the Onboarder Application

### Initialize the AllJoyn framework

See the [Building iOS/OS X][building-ios] section for
instructions to set up the AllJoyn framework.

### Initialize the AboutService in client mode

The About feature is used to receive Announcement signals.
The AllJoyn device can start announcing itself once the iOS
device is connected to a Soft AP of the AllJoyn device. The
Announcement signal provides the information required for
starting the onboarding process.

For additional details, see the [About API Guide][about-api-guide-objc].

#### Initialize the About feature

##### Create, start, connect, and register a Bus attachment

```objc
clientBusAttachment = [[AJNBusAttachment alloc] initWithApplicationName:APPNAME
allowRemoteMessages:ALLOWREMOTEMESSAGES];
[clientBusAttachment start];
//Set a password for the daemon so Thin Clients can connect to it,
   before you connect the bus attachment.
[AJNPasswordManager setCredentialsForAuthMechanism:@"ALLJOYN_PIN_KEYX"
   usingPassword:@"000000"];
[clientBusAttachment connectWithArguments:@""];
[clientBusAttachment registerBusListener:self];
```

##### Register to receive announcements and sessionless signals

```objc
announcementReceiver = [[AJNAnnouncementReceiver alloc]
initWithAnnouncementListener:self andBus:self.clientBusAttachment];
[announcementReceiver registerAnnouncementReceiver];
[clientBusAttachment addMatchRule:@"sessionless='t',type='error'"];
// Advertise the name with a quite prefix for TC to find it
[clientBusAttachment advertiseName:@"quiet@org.alljoyn.BusNode.CPSService.542e8562- e29b-89c2-b456-334455667788"]
```

#### Listen for announcements from Onboardee devices

The onboardee will announce its presence on its own SoftAP.
To see it, change the physical Wi-Fi settings on the device
to connect to the SoftAP by going to **Settings > Wi-Fi**.

Once the onboarder has joined the Onboardee SoftAP, an
announcement from the onboardee is received by the announcement
listeners. Implement the AJNAnnouncementListener protocol in
your class to respond to new announcements.

For each announcement that is received, check if it implements
the Onboarding interface. If it does, save it as an onboardee
device for later use.

```objc
- (void)announceWithVersion:(uint16_t)version port:(uint16_t)port
                    busName:(NSString *)busName
         objectDescriptions:(NSMutableDictionary *)objectDescs
                  aboutData:(NSMutableDictionary **)aboutData
{
// Save the announcement in a AJNAnnouncement
AJNAnnouncement *announcement = [[AJNAnnouncement alloc]
initWithVersion:version port:port busName:busName
objectDescriptions:objectDescs aboutData:aboutData];

NSMutableDictionary *announcementObjDecs = [announcement objectDescriptions];

// See if this announcment is from a controller device for
     (NSString *key in announcementObjDecs.allKeys) {
   if ([key hasPrefix: @"/Onboarding/"]) {
      for (NSString *intf in[announcementObjDecs valueForKey:key]) {
         if ([intf isEqualToString: @"org.alljoyn.Onboarding"]) {
            hasOnboarding = true;
         }
      }
   }
}

if(hasOnboarding == true)
NSLog(@"This announcement has the onboarding service");
```

### Use the Onboarding service framework

1. Initialize the OnboardingClient based from values found
in the About Announcement.

```objc
onboardingClient =	[[AJOBSOnboardingClient alloc]
initWithBus:clientBusName];
```

2. Provide a UI for the user to input/select the personal AP,
then send via OnboardingClient.

```objc
AJOBInfo obInfo;
obInfo.SSID =ssidTextField.text;
obInfo.passcode =ssidPassTextField.text;
obInfo.authType = ANY;
[onboardingClient configureWiFi:onboardeeBus obInfo:obInfo
resultStatus:resultStatus sessionId:sessionId];
```

3. Tell the Onboardee to join the network provided.

```objc
[onboardingClient connectTo:onboardeeBus sessionId:sessionId] ;
```

**NOTE:** To see the device on the target AP, the user must connect
to that personal AP by going to **Settings > Wi-Fi** and
choosing the required AP. The OS may switch to that AP but
it may switch to another AP that, for example, has been selected
as the default AP on the device.

### Get the AllJoyn device last error

If an error occurred during the connection to the personal AP,
the AllJoyn device returns to SoftAP mode. At that point,
the iOS device moves back to the personal AP, expecting to
find the AllJoyn device on the personal network.

When the AllJoyn device does not appear in the personal AP,
the onboarder assumes an error occurred during the connection
attempt, for example, the incorrect Wi-Fi password was provided.
To know more about the error that occurred while not being
connected to the same network, call GetLastError after connecting
back to the soft AP by going into iOS settings and choosing
the soft AP in the list.

```objc
onboardingClient = [[AJOBSOnboardingClient alloc] initWithBus:clientBusName];
onboardingClient lastError:busName lastError: lastError sessionId: sessionId];
```

### Offboard the AllJoyn device

Offboarding the AllJoyn device disconnects it from the personal
AP and switches it back to the SoftAP mode.

This is used when there is a need to onboard the device to a
different AP, or if the password was changed on the personal AP,
and the AllJoyn device needs to reconnect to it.

```objc
onboardingClient =	[[AJOBSOnboardingClient alloc]
   initWithBus:clientBusName];
QStatus status = [self.onboardingClient offboardFrom:self.onboardeeBus sessionId:self.sessionId];
```

## Best Practices

### Onboarder application

#### Configuring Wi-Fi networks for iOS implementation

During the onboarding process, the user must use the Settings > Wi-Fi
menu option on the iOS device to manually connect to the Soft AP
that is advertised by the onboardee.

This step is necessary because it is not possible to programmatically
change the Wi-Fi network that the iOS device is connected to.

Additionally, once the onboardee has been onboarded, and is
therefore no longer in Soft AP mode, the iOS device may automatically
connect to a different access point than the one to which the
onboardee is connected. As a result, the user may need to use
the Settings > Wi-Fi menu option a second time on the iOS
device to connect to the access point that the onboardee
was onboarded to.

As a result, it is recommended that the application using the
Onboarding service framework provide hints or guides to the user
to perform these steps to properly access the Wi-Fi networks.

[building-ios]: /develop/building/ios-osx
[about-api-guide-objc]: /develop/api-guide/about/objc
