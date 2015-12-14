# About API Guide - Objective-C

## Reference code

The reference code consists of service and client implementations of the About feature.

### Classes/Interfaces used to send About feature announcements and data

| Class/Interface | Description |
|---|---|
| AJNAboutObject | Class the implements the org.alljoyn.About interface. |
| AJNAboutDataListener | Interface that supplies the list of properties required for Announce payload and About Data |
| AJNAboutIcon | Container class to hold information about an icon |
| AJNAboutIconObject | Class that implements org.alljoyn.Icon interface |

### Classes/Interfaces used to receive About feature announcements and data

| Class/Interface | Description |
|---|---|
| AJNAboutListener | Interface implemented by AllJoyn&trade; users to receive About interface related events |
| AJNAboutProxy | Get proxy access to the `org.alljoyn.About` interface. This class enables the user to interact with the remote About `BusObject`|
| AJNIconProxy | Helper class that provides access to the org.alljoyn.Icon interface. This class enables the user to interact with the remote AboutIcon `BusObject`. |

## Obtain the About feature

See the [Building iOS/OS X section][building-ios] for instructions on compiling the About feature.

## Build an application that uses About Service

The following is the high-level process to build an application that will broadcast an Announce signal. Steps marked with a \* are unique to applications using the About feature

1. Use the code generator to produce the Objective-C boiler plate code
2. Mark an interface as announced
3. Implement an `AJNAboutDataListener` \* (See [Create a PropertyStore Implementation][create-propertystore-implementation].)
4. Create and register the `BusObject`
5. Create and setup a new AJNBusAttachment
    - Start
    - Connect
    - Bind
6. Create About object
7. Add an AboutIcon object (optional)
8. Announce \*

## Build an application that uses About Client

The following steps provide the high-level process to build an
application that will receive an `org.alljoyn.About.Announce` signal. Steps marked with a \* are unique to applications using the About feature

1. Create a new BusAttachment
    - Start
    - Connect
2. Implement an `AJNAboutListener` \*
3. Register the `AJNAboutListener` \*
4. Call `AJNBusAttachment::WhoImplements` member function to specify interfaces your application is interested in.\*

## Sample code for sending an `Announce` signal

Code in this chapter references a variable `clientBusAttachment` (the BusAttachment variable name).

### Generate Objective-C boiler plate code

Follow the steps mentioned in [building-ios-osx document link] to specify an interface definition and generate the wrapper Objective-C code for your bus object

Typically, a `shouldAcceptSessionJoinerNamed:onSessionPort
withSessionOptions:` callback in `SessionPortListener` has a
check to allow or disallow access. Since the AboutService
requires access to any application using AboutClient with a
specific port, return true when this callback is triggered.

```objc
self.aboutSessionPortListener = [[CommonBusListener alloc]
initWithServicePort:1000];

self.serviceBusAttachment registerBusListener:self.aboutSessionPortListener];
```

### Mark an interface as announced

There are two ways to mark an interface as announced
- Add the flag `ANNOUNCED` to the generated code for the bus object
- Use AJNBusAttachment::SetAnnouceFlag

<!--QUESTION FOR GEORGE: Need to resolve code snippet reference below-->

[code snippet for both]

### Implement an AJNAboutDataListener and provide the values for About interface fields

When a user wants to send an About announcement they would need
to provide the implementation of two virutal functions that are
a part of the AJNAboutDataListener. The intent is to fill in the
about or announce data in form of a dictionary which is announced

The AJNAboutDataListener interface is required by the About service
application to store the provisioned values for the About interface
data fields (listed in [About interface data fields][about-interface-data-fields]).
See the [About Interface Definition][about-interface-definition]
for more information.

**NOTE:** It is recommended that OEMs create a shared provisioning file
that includes the DefaultLanguage, DeviceName, and DeviceID fields.
This file can be used by developers to manage these fields in the
AllJoyn services that make use of them.

AJNAboutDataListener is a protocol in AllJoyn Objective-C bindings
which means that it will has functions which need to be implemented
by the class which implements the protocol

The interface declaration would look like:

```objc
@interface MySampleClass <AJNAboutDataListener>
```
The two functions in AJNAboutDataListener that need to be implemented
in accordance with [About interface data fields][about-interface-data-fields] are

```objc
-(QStatus)getAboutDataForLanguage:(NSString *)language usingDictionary:(NSMutableDictionary **)aboutData
{
    .
    .
    .
    *aboutData = [[NSMutableDictionary alloc] initWithCapacity:16];
    AJNMessageArgument *appID = [[AJNMessageArgument alloc] init];
    uint8_t originalAppId[] = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 };
    [appID setValue:@"ay", sizeof(originalAppId) / sizeof(originalAppId[0]), originalAppId];
    [appID stabilize];
    [*aboutData setValue:appID forKey:@"AppId"];

    AJNMessageArgument *defaultLang = [[AJNMessageArgument alloc] init];
    [defaultLang setValue:@"s", "en"];
    [defaultLang stabilize];
    [*aboutData setValue:defaultLang forKey:@"DefaultLanguage"];
	.
    .
    .
}

-(QStatus)getDefaultAnnounceData:(NSMutableDictionary **)aboutData
{
    .
    .
    .
     *aboutData = [[NSMutableDictionary alloc] initWithCapacity:16];
    gDefaultAboutData = [[NSMutableDictionary alloc] initWithCapacity:16];

    AJNMessageArgument *appID = [[AJNMessageArgument alloc] init];
    uint8_t originalAppId[] = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 };
    [appID setValue:@"ay", sizeof(originalAppId) / sizeof(originalAppId[0]), originalAppId];
    [appID stabilize];
    [*aboutData setValue:appID forKey:@"AppId"];

    AJNMessageArgument *defaultLang = [[AJNMessageArgument alloc] init];
    [defaultLang setValue:@"s", "en"];
    [defaultLang stabilize];
    [*aboutData setValue:defaultLang forKey:@"DefaultLanguage"];
    .
    .
    .
}
```

#### About interface data fields

| Field name | Required | Announced | Localized | Signature |
|:---:|:---:|:---:|:---:|:---:|
| AppId | yes | yes | no | ay |
| DefaultLanguage | yes | yes | no | s |
| DeviceName | no | yes | yes | s |
| DeviceId | yes | yes | no | s |
| AppName | yes | yes | yes | s |
| Manufacturer | yes | yes | yes | s |
| ModelNumber | yes | yes | yes | s |
| SupportedLanguages | yes | no | no | as |
| Description | yes | no | yes | s |
| DateofManufacture | no | no | no | s |
| SoftwareVersion | yes | no | no | s |
| AJSoftwareVersion | yes | no | no | s |
| HardwareVersion | no | no | no | s |
| SupportUrl | no | no | no | s |


<!--QUESTION FOR GEORGE: Need to resolve code snippet reference below-->

[code snippet showing how to fill in aboutdatalistener]


### Create and setup a new AJNBusAttachment

Every AllJoyn application requires a base set to be in place
before implementing specific features that include creating a
BusAttachment and connecting to the AllJoyn framework.

### Create instance of BusAttachment

```objc
self.clientBusAttachment = [[AJNBusAttachment alloc]
initWithApplicationName:APPNAME allowRemoteMessages:ALLOWREMOTEMESSAGES];
```

### Create password for the bundled router

**NOTE:** Thin libraries at AllSeen Alliance version 14.06 or higher
do not require this step.

To allow thin libraries to connect to the bundled router,
the router requires a password.

```objc
[AJNPasswordManager setCredentialsForAuthMechanism:@"ALLJOYN_PIN_KEYX" usingPassword:@"000000"];
```

### Start Connect and Bind

Once created, the BusAttachment must be connected to the AllJoyn framework.

[code for starting a bus attachment]

```objc
[self.clientBusAttachment connectWithArguments:@""];
```

**NOTE:** This step is not mandatory if you are only sending an announcement.
To allow incoming connections, the formation of a session is needed.
The AllJoyn framework must be told that connections are allowed.

```objc
AJNSessionOptions *opt = [[AJNSessionOptions alloc]
   initWithTrafficType:kAJNTrafficMessages
   supportsMultipoint:false proximity:kAJNProximityAny
   transportMask:kAJNTransportMaskAny];

serviceStatus = [self.serviceBusAttachment
   bindSessionOnPort:1000 withOptions:opt
   withDelegate:self.aboutSessionPortListener];
```


### Provision PropertyStore with default values

In the application, the PropertyStore instance you created will
be loaded with the default values. In the sample implementation
above, the PropertyStore instance is provided with a default values map.

The following subsections highlight provisioning fields
according to their data type.

#### AppId field

The AppId field is an array of bytes. It is a globally unique
identifier (GUID) encoded as an array of 16 bytes.

```objc
self.uniqueID = [[NSUUID UUID] UUIDString];

[self.aboutPropertyStoreImpl setAppId:self.uniqueID];
```

#### SupportedLanguages field

The SupportedLanguages field is a list of text strings.
Some fields can have a language-dependent value that must
be provided for each of the supported languages.

```objc
NSArray *languages = @[@"en", @"sp", @"fr"];

[self.aboutPropertyStoreImpl setSupportedLangs:languages];
```

#### Non-language-specific fields

Non-language-specific fields support a single supplied text
string. Following is an example for the ModelNumber field on
how to insert into the PropertyStore. The code below can be
used with the field name being replaced by other field names
listed in [About data interface fields][about-interface-data-fields].

```objc
[self.aboutPropertyStoreImpl setModelNumber:@"Wxfy388i"];
```

#### Language-dependent fields

Language-dependent fields support a single supplied text string.
Below is an example for the Description field on how to insert
into the PropertyStore. The code below can be used with the
field name being replaced by other field names listed in
[About data interface fields][about-interface-data-fields].

```objc
[self.aboutPropertyStoreImpl setDescription:@"This is an AllJoyn application" language:@"en"];

[self.aboutPropertyStoreImpl setDescription:@"Esta es una AllJoyn aplicacion" language:@"sp"];

[self.aboutPropertyStoreImpl setDescription:@"C'est une AllJoyn application" language:@"fr"];
```

### Create an instance About Object

For an application to send AboutData, it requires an instance
of the AboutService class. AboutServiceImpl is an implementation
wrapper around AllJoyn native calls that handle the interactions
between About Service and About Client.

```objc
AboutService aboutService = AboutServiceImpl.getInstance();
```

### Add an AboutIcon Object (optional)


#### Provision for the Icon content and URL

An Icon is published directly as a byte array or a reference
URL, and must be provisioned as follows:

```objc
uint8_t aboutIconContent[] = { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44,
   0x52, 0x00, 0x00, 0x00, 0x0A, 0x00, 0x00, 0x00, 0x0A, 0x08, 0x02, 0x00, 0x00,

0x00, 0x02, 0x50, 0x58, 0xEA, 0x00,
   0x00, 0x00, 0x04, 0x67, 0x41, 0x4D, 0x41, 0x00, 0x00, 0xAF, 0xC8, 0x37, 0x05,

0x8A, 0xE9, 0x00, 0x00, 0x00, 0x19,
   0x74, 0x45, 0x58, 0x74, 0x53, 0x6F, 0x66, 0x74, 0x77, 0x61, 0x72, 0x65, 0x00,

0x41, 0x64, 0x6F, 0x62, 0x65, 0x20,
   0x49, 0x6D, 0x61, 0x67, 0x65, 0x52, 0x65, 0x61, 0x64, 0x79, 0x71, 0xC9, 0x65,

0x3C, 0x00, 0x00, 0x00, 0x18, 0x49,
   0x44, 0x41, 0x54, 0x78, 0xDA, 0x62, 0xFC, 0x3F, 0x95, 0x9F, 0x01, 0x37, 0x60,

0x62, 0xC0, 0x0B, 0x46, 0xAA, 0x34,
   0x40, 0x80, 0x01, 0x00, 0x06, 0x7C, 0x01, 0xB7, 0xED, 0x4B, 0x53, 0x2C, 0x00,

0x00, 0x00, 0x00, 0x49, 0x45, 0x4E,
   0x44, 0xAE, 0x42, 0x60, 0x82 };

};

NSString *mimeType = @"image/png"; /* This should correspond
   to the content */ NSString *url = @"http://tinyurl.com/llrqvrb";
   /* An alternate access to the Icon
*/
```

#### Create and register DeviceIcon object

Register the relevant BusObjects and add the relevant interfaces
to the Announcement's ObjectDescription.

```objc
self.aboutIconService = [[AJNAboutIconService alloc] initWithBus:self.serviceBusAttachment
   mimeType:mimeType url:url content:aboutIconContent csize:csize];

[self.aboutIconService registerAboutIconService];
```

### Send the Announcement

```objc
[self.aboutServiceApi announce];
```

### Unregister and delete AboutService and BusAttachment

When your process is done with the AboutService and no longer
wishes to send announcements, unregister the process from the
AllJoyn bus and then delete variables used.

```objc
// Stop AboutIcon
[self.serviceBusAttachment unregisterBusObject:self.aboutIconService];
self.aboutIconService = nil;

// Delete AboutServiceApi [self.aboutServiceApi destroyInstance];
   self.aboutServiceApi = nil;

// Delete AboutPropertyStoreImpl self.aboutPropertyStoreImpl = nil;

// Bus attachment cleanup
[self.serviceBusAttachment cancelAdvertisedName:[self.serviceBusAttachment
   uniqueName] withTransportMask:kAJNTransportMaskAny];

[self.serviceBusAttachment unbindSessionFromPort:SERVICE_PORT];

// Delete AboutSessionPortListener
[self.serviceBusAttachment unregisterBusListener:self.aboutSessionPortListener];
self.aboutSessionPortListener = nil;

// Stop bus attachment
[self.serviceBusAttachment stop];
self.serviceBusAttachment = nil;
```

## Implementing an Application that Uses AboutClient

To implement an application to receive AboutData, use the
AboutClient class. By using the AboutClient class, your
application is notified when About Service instances
send announcements.

Verify the BusAttachment has been created, started and
connected before implementing an About Client. See [Setting
Up the AllJoyn Framework][set-up-alljoyn-framework] for the
code snippets. Code in this chapter references a variable
`self.clientBusAttachment` (the BusAttachment variable name).

### Setup to receive the Announce signal

In order to receive the Announce signal from an application
using AboutService, a class implementation of AJNAnnouncementListener
protocol must be created.

#### Create class to implement AJNAnnouncementListener protocol

This declaration of a class will allow for the signals to
be received. It must implement the pure virtual function Announce.

```objc
@interface sampleClass <AJNAnnouncementListener>

- (void)announceWithVersion:(uint16_t)version
                       port:(uint16_t)port
                    busName:(NSString *)busName
         objectDescriptions:(NSMutableDictionary *)objectDescs
                  aboutData:(NSMutableDictionary **)aboutData {
// add your implementation here
}
```

#### Implement the Announce method that handles the Announce signal

With everything linked up using the AllJoyn framework, the
method registered with the AllJoyn framework will be executed
upon receipt of an Announce signal.

Because every application is different, as a developer you
must process the AboutData and determine the following:

* How it should be rendered in the UI.
* When to request the data that is not contained in the Announce signal.
* Any logic that is needed.

#### Register the AJNAnnouncementListener

When registering an announcement listener, specify which
interfaces the application is interested in. The code below
shows a listener registered to receive Announce signals
that include an object implementing the INTERFACE_NAME interface.

```objc
self.announcementReceiver = [[AJNAnnouncementReceiver alloc]
initWithAnnouncementListener:self andBus:self.clientBusAttachment];

const char* interfaces[] = { [INTERFACE_NAME UTF8String] };

[self.announcementReceiver registerAnnouncementReceiverForInterfaces:interfaces
   withNumberOfInterfaces:1];
```

### Using ping to determine presence

The AJNBusAttachment pingPeer member function can be used to
determine if a device is responsive. Contents of an Announce
signal can be stale so it may be useful to ping the device to
see if it is still present and responsive before attempting
to form a connection.

**NOTE:** The AJNBusAttachment pingPeer method makes a bus call.
If pingPeer is called inside an AllJoyn callback, `AJNBusAttachment
enableConcurrentCallbacks` must be called first.

```objc
// When pinging a remote bus name wait a max of 5 seconds
[self.clientBusAttachment enableConcurrentCallbacks];
QStatus status = [self.clientBusAttachment pingPeer:busName
  withTimeout:5000];
if (ER_OK == status) {
   ...
}
```

### Request non-announced data

If there is a need to request information that is not contained
in the announcement (meaning they are not marked as announcable),
complete the tasks in the following subsections.

#### Join a session

Create a session with the application by using the
BusAttachment JoinSession API.

**NOTE:** The variables name and port are set from the AboutData
from the Announce method.

```objc
AJNSessionOptions *opt = [[AJNSessionOptions alloc]
initWithTrafficType:kAJNTrafficMessages supportsMultipoint:false
proximity:kAJNProximityAny transportMask:kAJNTransportMaskAny];


self.sessionId = [self.clientBusAttachment
      joinSessionWithName:[self.clientInformation.announcement busName]
            onPort:[self.clientInformation.announcement port]
            withDelegate:(nil) options:opt];
```

#### Create AboutClient

Generate an AJNAboutClient and create an instance passing in
the BusAttachment that was created in [Start and connect the
BusAttachment][start-connect-busattachment].

```objc
AJNAboutClient *ajnAboutClient = [[AJNAboutClient alloc]
initWithBus:self.clientBusAttachment];
```

#### Create AJNAboutIconClient

Generate an AJNAboutIconClient and create an instance passing
in the BusAttachment created in [Start and connect the BusAttachment][start-connect-busattachment].

```objc
self.ajnAboutIconClient = [[AJNAboutIconClient alloc]
initWithBus:self.clientBusAttachment];

[self.ajnAboutIconClient urlFromBusName:announcementBusName url:&url
sessionId:self.sessionID];
```

### Shutdown

Once you are done using the About feature and the AllJoyn
framework, free the variables used in the application.

```objc
self.clientBusAttachment = nil;
```

[building-ios]: /develop/building/ios-osx
[create-propertystore-implementation]: #create-a-propertystore-implementation

[set-up-alljoyn-framework]: #setting-up-the-alljoyn-framework

[about-interface-definition]: /learn/core/about-announcement/interface
[about-interface-data-fields]: #about-interface-data-fields

[start-connect-busattachment]: #start-and-connect-the-busattachment
