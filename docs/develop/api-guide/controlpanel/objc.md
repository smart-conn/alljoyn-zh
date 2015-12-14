# Control Panel API Guide - Objective-C

## Reference code

### Source code

| Library | Description |
|---|---|
| alljoyn | The AllJoyn&trade; Standard Library code |
| alljoyn_services_common | The common code for all service frameworks. This is needed from Linux (C++) and Objective-C. |
| alljoyn_about | The About Feature library |
| alljoyn_controlpanel | The Control Panel library |
| alljoynFramework_iOS | The iOS binding of the AllJoyn framework |

### Reference iOS application code

| Application | Description |
|---|---|
| sampleApp | Sample application that uses the Control Panel service framework and adapter APIs. |

## Obtain the Control Panel service framework

See the [Building iOS/OS X][building-ios] section for
instructions on compiling the Control Panel service framework.

## Build a Controller

The following steps provide the high-level process to build a Controller.

1. Create the base for the AllJoyn application.
2. Start the AboutClient.
3. Listen for announcements to find Controllee devices on the network.
4. Choose a control panel from the collection that was received
in the announcement in your preferred language.
5. Establish a session with the Controllee device that you
would like to interact with.
6. Get the device's control panel widgets to pass to the
Adapter. The Adapter converts these widgets to iOS UI elements.
7. Get the iOS UI elements from the Adapter to be displayed
in the application. These elements are combined to create
the graphical control panel that is displayed by the Controller
application for the end user to interact with.

## Setting up the AllJoyn framework and About feature

The steps required for this service are universal to all
applications that use the AllJoyn framework and for any application
using one or more AllJoyn services. Prior to use of the Control
Panel service framework, the About feature must be implemented
and the AllJoyn framework set up.

Complete the procedures in the following sections to guide
you in this process:

* [Building iOS/OS X section][building-ios]
* [About API Guide][about-api-guide-objc]

## Implementing a Controller

### Initialize the AllJoyn framework

See the [Building iOS/OS X][building-ios] section for
instructions to set up the AllJoyn framework.

### Start the AboutService in client mode

The Control Panel service framework depends on the About feature.

For more information about the About feature, see the
[About API Guide][about-api-guide-objc].

#### Initialize the About feature

##### Create, start, connect, and register a Bus Attachment

```objc
clientBusAttachment = [[AJNBusAttachment alloc] initWithApplicationName:APPNAME
allowRemoteMessages:ALLOWREMOTEMESSAGES];
[clientBusAttachment start];
//Thin Libaries at AllSeen Alliance 14.06 or higher do not require this step.
//Set a password for the router so Thin Libraries can connect to it, before you connect the bus attachment.
[AJNPasswordManager setCredentialsForAuthMechanism:@"ALLJOYN_PIN_KEYX" usingPassword:@"000000"];
[clientBusAttachment connectWithArguments:@""];
[clientBusAttachment registerBusListener:self];
```

##### Register to receive announcements and sessionless signals

```objc
announcementReceiver = [[AJNAnnouncementReceiver alloc]
initWithAnnouncementListener:self andBus:self.clientBusAttachment];
[announcementReceiver
registerAnnouncementReceiverForInterfaces:NULL
withNumberOfInterfaces:0];
// Advertise the name with a quite prefix for TC to find it
   [clientBusAttachment advertiseName:@"quiet@org.alljoyn.BusNode.CPSService.542e8562-e29b-89c2-b456-
334455667788"]
```

#### Listen for announcements from Controllee devices

Once the client has been started, announcements will be received
by the announcement listeners.

Implement the AJNAnnouncementListener protocol in your class to
respond to new announcements.

For each announcement that is received, check if it implements
the ControlPanel interface. If it does, save it as a
controllee device for later use.

```objc
- (void)announceWithVersion:(uint16_t)version
                       port:(uint16_t)port
                    busName:(NSString *)busName
         objectDescriptions:(NSMutableDictionary *)objectDescs
                  aboutData:(NSMutableDictionary **)aboutData
{
// Save the announcement in a AJNAnnouncement
AJNAnnouncement *announcement = [[AJNAnnouncement alloc]
   initWithVersion:version port:port busName:busName objectDescriptions:objectDescs aboutData:aboutData];
   NSMutableDictionary *announcementObjDecs = [announcement objectDescriptions];
// See if this announcment is from a controller device for (NSString *key in announcementObjDecs.allKeys) {
   if ([key hasPrefix: @"/ControlPanel/"]) {
      for (NSString *intf in[announcementObjDecs valueForKey:key]) {
         if ([intf isEqualToString: @"org.alljoyn.ControlPanel.ControlPanel"]) {
            hascPanel = true;
         }
      }
   }
}

if(hascPanel == true)
NSLog(@"This announcement has control panel");
```

### Loading the controller's UI

The AJNAnnouncement object is used to load the controller's
table view when needed.

```objc
GetControlPanelViewController *getCpanelView =
[[GetControlPanelViewController alloc] initWithAnnouncement:announcement
   bus:self.clientBusAttachment]; [self.navigationController
   pushViewController:getCpanelView animated:YES];
```

### Compile the code

See the [Building iOS/OS X][building-ios] section for instructions
on how to compile the application with this service framework.

[building-ios]: /develop/building/ios-osx
[about-api-guide-objc]: /develop/api-guide/about/objc
