# About API Guide - C++

<!-- QUESTION FOR GEORGE: I don't understand this first statement. Please resolve.-->

These APIs were added to AllJoyn&trade; 14.12 release for using the About Feature in an
older release please see: [Legay C++ About API Guide][about-cpp-legacy]

## Reference code

### Classes used to send AboutData

| Class | Description |
|---|---|
| `AboutObj` | Class that implements the `org.alljoyn.About` interface as a `BusObject`. |
| `AboutIconObj` | Class that implements the `org.alljoyn.Icon` interface as a `BusObject`. |
| `AboutDataListener` | Interface that supplies the MsgArg containing the AboutData fields required for the  `Announce` signal payload and `GetAboutData()`. |
| `AboutData` | A default implementation of the `AboutDataListener` interface. For most developers this implementation will be sufficient. |
| `AboutIcon` | A container class that holds the icon sent by the `AboutIconObj` |

### Classes used to receive AboutData

| Class | Description |
|---|---|
| `AboutProxy` | Class used to get proxy access to the AboutObj. |
| `AboutIconProxy` | Class used to get proxy access to the AboutIconObj. |
| `AboutListener` | Abstract base class implemented by AllJoyn users to receive About interface related events |
| `AboutData` | A default implementation of the `AboutDataListener` interface. This class can be used to read the contents of an `org.alljoyn.About.Announce` signal |
| `AboutObjectDescription` | A helper class for accessing the fields of the ObjectDescription MsgArg that is sent as part of the `org.alljoyn.About.Announce` signal |
| `BusAttachment` | Used to register `AboutListener`s and specify interfaces of interest |

## Setting Up an application to send an `Announce` signal

The following is the high-level process to build an application that will
broadcast an `Announce` signal. Steps marked with a \* are unique to
applications using the About Feature.

- [Create a `BusAttachment`][create-a-busattachment]
  - Start
  - Connect
  - Bind session port
  - Other setup for security etc
- [Create interfaces][create-interfaces]
- [Create `BusObject`s for interfaces][create-busobject]
  - When Adding interfaces to the `BusObject` mark it as `ANNOUNCED`\*
- [Register the `BusObject`s with the `BusAttachment`][register-busobjects]
- [Fill in your `AboutData`\*][fill-aboutdata]
- [Create an `AboutObj`\*][create-about-object]
- [Call `AboutObj::Announce(sessionPort, aboutData)`\*][create-about-object]

## Setting Up the AllJoyn Framework to receive an `Announce` signal

The following is the high-level process to build an application that will
receive an `Announce` signal. Steps marked with a \* are unique to applications
using the About Feature.

- [Create a `BusAttachment`][create-a-busattachment]
  - Start
  - Connect
  - Other setup for security etc
- [Create an `AboutListener`\*][create-aboutlistener]
- [Register the new `AboutListener`\*][register-aboutlistener-whoimplements]
- [call `BusAttachment::WhoImplements` member function to specify interfaces your
  application is interested in.\*][register-aboutlistener-whoimplements]


## Sample code for sending an `Announce` signal

###Create a `BusAttachment`
Create a new BusAttachment.

```cpp
BusAttachment bus("About Service Example");
```
Start the BusAttachment and Connect to the routing node.
```cpp
status = bus.Start();
if (ER_OK != status) {
    printf("FAILED to start BusAttachment (%s)\n", QCC_StatusText(status));
    exit(1);
}

status = bus.Connect();
if (ER_OK != status) {
    printf("FAILED to connect to router node (%s)\n", QCC_StatusText(status));
    exit(1);
}
```
Bind a session port that will be used to communicate. the value for
`ASSIGNED_SESSION_PORT` is chosen by the developer.  The value itself is
unimportant.  What is important is that the session port bound to is part of the
`Announce` signal.

```cpp
SessionOpts opts(SessionOpts::TRAFFIC_MESSAGES, false, SessionOpts::PROXIMITY_ANY, TRANSPORT_ANY);
SessionPort sessionPort = ASSIGNED_SESSION_PORT;
MySessionPortListener sessionPortListener;
bus.BindSessionPort(sessionPort, opts, sessionPortListener);
if (ER_OK != status) {
    printf("Failed to BindSessionPort (%s)", QCC_StatusText(status));
}
```

### Create interfaces

The interface is a collection methods, signals, and properties. The interface
can be specified in code or using xml notation.

For this sample the following xml interface was used.
```xml
<interface name='com.example.about.feature.interface.sample' >
  <method name='Echo'>
    <arg name='out_arg' type='s' direction='in' />
    <arg name='return_arg' type='s' direction='out' />
  </method>
</interface>
```

C++ code showing adding the interface to the BusAttachment using xml. The
`INTERFACE_NAME` is coded to be the string
`com.example.about.feature.interface.sample`.
```cpp
qcc::String interface = "<node>"
                        "<interface name='" + qcc::String(INTERFACE_NAME) + "'>"
                        "  <method name='Echo'>"
                        "    <arg name='out_arg' type='s' direction='in' />"
                        "    <arg name='return_arg' type='s' direction='out' />"
                        "  </method>"
                        "</interface>"
                        "</node>";

status = bus.CreateInterfacesFromXml(interface.c_str());
if (ER_OK != status) {
    printf("Failed to parse the xml interface definition (%s)", QCC_StatusText(status));
    exit(1);
}
```
Alternative C++ code showing adding the interface with out using xml notation.
```cpp
/* Add org.alljoyn.Bus.method_sample interface */
InterfaceDescription* intf = NULL;
status = bus.CreateInterface(INTERFACE_NAME, intf);

if (status == ER_OK) {
    printf("Interface created.\n");
    intf->AddMethod("Echo", "s",  "s", "out_arg,return_arg", 0);
    intf->Activate();
} else {
    printf("Failed to create interface '%s'.\n", INTERFACE_NAME);
}
```

###Create `BusObject`s for interfaces

Sample implementation of a BusObject that announces the interface defined above.
When adding the interface to the BusObject you can specify if that interface is
announced by adding the `ANNOUNCED` value to the `AddInterface()` member
function.

**NOTE:** The BusObject adds method handlers for methods specified in the
`com.example.about.feature.interface.sample` interface. If it contained any
properties it would also be responsible for add Get/Set handler functions for
the properties as well. The code lets the object path be passed in at
runtime. The path could have also been hard coded into the BusObject.

```cpp
class MyBusObject : public BusObject {
  public:
    MyBusObject(BusAttachment& bus, const char* path)
        : BusObject(path) {
        QStatus status;
        const InterfaceDescription* iface = bus.GetInterface(INTERFACE_NAME);
        assert(iface != NULL);

        // Here the value ANNOUNCED tells AllJoyn that this interface
        // should be announced
        status = AddInterface(*iface, ANNOUNCED);
        if (status != ER_OK) {
            printf("Failed to add %s interface to the BusObject\n", INTERFACE_NAME);
        }

        /* Register the method handlers with the object */
        const MethodEntry methodEntries[] = {
            { iface->GetMember("Echo"), static_cast<MessageReceiver::MethodHandler>(&MyBusObject::Echo) }
        };
        AddMethodHandlers(methodEntries, sizeof(methodEntries) / sizeof(methodEntries[0]));
    }

    // Respond to remote method call `Echo` by returning the string back to the
    // sender.
    void Echo(const InterfaceDescription::Member* member, Message& msg) {
        printf("Echo method called: %s", msg->GetArg(0)->v_string.str);
        const MsgArg* arg((msg->GetArg(0)));
        QStatus status = MethodReply(msg, arg, 1);
        if (status != ER_OK) {
            printf("Failed to created MethodReply.\n");
        }
    }
};
```

### Register the `BusObjects` with the `BusAttachment`

```cpp
MyBusObject busObject(bus, "/example/path");
status = bus.RegisterBusObject(busObject);
if (ER_OK != status) {
    printf("Failed to register BusObject (%s)", QCC_StatusText(status));
    exit(1);
}
```

### AboutData fields

| Field name | Required | Announced | Localized | Signature |
|---|:-:|:-:|:-:|:-:|
| `AppId` | yes | yes | no | `ay` |
| `DefaultLanguage` | yes | yes | no | `s` |
| `DeviceName` | no | yes | yes | `s` |
| `DeviceId` | yes | yes | no | `s` |
| `AppName` | yes | yes | yes | `s` |
| `Manufacturer` | yes | yes | yes| `s` |
| `ModelNumber` | yes | yes | no | `s` |
| `SupportedLanguages` | yes | no | no | `as` |
| `Description` | yes | no | yes | `s` |
| `DateofManufacture` | no | no | no | `s` |
| `SoftwareVersion` | yes | no | no | `s` |
| `AJSoftwareVersion` | yes | no | no | `s` |
| `HardwareVersion` | no | no | no | `s` |
| `SupportUrl` | no | no | no | `s` |

Fields marked as Announced are part of the `Announce` signal.  If a value is not
announced then you must use the `org.alljoyn.About.GetAboutData` method to
access those values.

Fields marked as Required must all be supplied to send an `Announce` signal.
They are required even if the value is not part of the `Announce` signal.

Fields marked as Localized should supply localization values for every language
listed in the `SupportedLanguages`

`AppId` is a 128-bit UUID (16-bytes) as specified in RFC 4122.

### Fill in your `AboutData`

The `AboutData` is an instance of the `AboutDataListener` interface. For most
developers, the `AboutData` will provide the `AboutDataListener` dictionary of
key/value pairs (`a{sv}`). This is needed to send an `Announce signal.

```cpp
// Setup the about data
// The default language is specified in the constructor. If the default language
// is not specified any Field that should be localized will return an error
AboutData aboutData("en");
//AppId is a 128bit uuid
uint8_t appId[] = { 0x01, 0xB3, 0xBA, 0x14,
                    0x1E, 0x82, 0x11, 0xE4,
                    0x86, 0x51, 0xD1, 0x56,
                    0x1D, 0x5D, 0x46, 0xB0 };
aboutData.SetAppId(appId, 16);
aboutData.SetDeviceName("My Device Name");
//DeviceId is a string encoded 128bit UUIDf
aboutData.SetDeviceId("93c06771-c725-48c2-b1ff-6a2a59d445b8");
aboutData.SetAppName("Application");
aboutData.SetManufacturer("Manufacturer");
aboutData.SetModelNumber("123456");
aboutData.SetDescription("A poetic description of this application");
aboutData.SetDateOfManufacture("2014-03-24");
aboutData.SetSoftwareVersion("0.1.2");
aboutData.SetHardwareVersion("0.0.1");
aboutData.SetSupportUrl("http://www.example.org");
```

Localized values like `DeviceName`, `AppName`, etc are automatically set to the
default language specified in the constructor unless a different language tag
is passed in when setting the values.  For example,  to add the Spanish language
to the `AboutData` the following would be done. All strings must be UTF-8
encoded.

```cpp
aboutData.SetDeviceName("Mi dispositivo Nombre", "es");
aboutData.SetAppName("aplicación", "es");
aboutData.SetManufacturer("fabricante", "es");
aboutData.SetDescription("Una descripción poética de esta aplicación", "es");
```

Any new language specified, including the default language, is automatically
added to the `SupportedLanguages` by the `AboutData` implementation.

The `AJSoftwareVersion` is also automatically filled in by the `AboutData`
implementation.

### Create an `AboutObj` and `Announce`

```cpp
AboutObj aboutObj(bus);
status = aboutObj.Announce(sessionPort, aboutData);
if (ER_OK != status) {
    printf("AboutObj Announce failed (%s)\n", QCC_StatusText(status));
    exit(1);
}
```

The ObjectDesciprition part of the announced signal is found automatically by
introspectin the the `BusObjects` that were registered with the `BusAttachment`.

Any time a new interface is added or the AboutData is changed the `Announce`
member function should be called again.

## Sample code for receiving an `Announce` signal

Code that receives an `Announce` signal will need to create, start, and connect
a `BusAttachment` the same as the code that sent the `Announce` signal. The
application that receives the `Announce` signal does not need to bind a session
port. See [create a `BusAttachment`][create-a-busattachment]

###create an `AboutListener`

The AboutListener interface is responsible for responding to `Announce` signals.

```cpp
class MyAboutListener : public AboutListener {
    void Announced(const char* busName, uint16_t version, SessionPort port,
                   const MsgArg& objectDescriptionArg, const MsgArg& aboutDataArg) {
        // Place code here to handle Announce signal.
    }
};
```

The `AboutListener` is called by the AllJoyn routing node when an `Announce`
signal is found.  The `Announced` call back contains all the information
contained in the received `Announce` signal as well as the unique BusName of the
`BusAttachment` that emitted the `Announce` signal. This information can be used
to form a session with the remote device; and Make a `ProxyBus` object based on
the interfaces reported in the `objectDescriptionArg`.

### Register the new `AboutListener` and call `WhoImplements`
```cpp
MyAboutListener aboutListener;
bus.RegisterAboutListener(aboutListener);

const char* interfaces[] = { INTERFACE_NAME };
status = bus.WhoImplements(interfaces, sizeof(interfaces) / sizeof(interfaces[0]));
if (ER_OK != status) {
    printf("WhoImplements call FAILED with status %s\n", QCC_StatusText(status));
    exit(1);
}
```

Although it is possible to register multiple `AboutListener`s it is unlikely
that a program will need more than one `AboutListener`.

#### The `WhoImplements` member function

The `WhoImplements` member function is used to declare your interest in one or
more specific interfaces. If a remote device is announcing the interface(s)
then all Registered `AboutListeners` will be called.

For example, if you need both `com.example.Audio` *and*
`com.example.Video` interfaces then do the following.

RegisterAboutListener once:
```cpp
const char* interfaces[] = {"com.example.Audio", "com.example.Video"};
RegisterAboutListener(aboutListener);
WhoImplements(interfaces, sizeof(interfaces) / sizeof(interfaces[0]));
```

If the AboutListener should be called if `com.example.Audio` *or*
`com.example.Video` interfaces are found then call `WhoImplements` multiple
times:
```cpp
RegisterAboutListener(aboutListener);
const char* audioInterface[] = {"com.example.Audio"};
WhoImplements(audioInterface, sizeof(audioInterface) / sizeof(audioInterface[0]));
const char* videoInterface[] = {"com.example.Video"};
WhoImplements(videoInterface, sizeof(videoInterface) / sizeof(videoInterface[0]));
```

The interface name may be a prefix followed by a `*`.  Using this, the example
where we are interested in `com.example.Audio` *or* `com.example.Video`
interfaces could be written as:
```CPP
const char* exampleInterface[] = {"com.example.*"};
RegisterAboutListener(aboutListener);
WhoImplements(exampleInterface, sizeof(exampleInterface) / sizeof(exampleInterface[0]));
```

The AboutListener will receive any announcement that implements an interface
beginning with the `com.example.` name.

It is the AboutListeners responsibility to parse through the reported interfaces
to figure out what should be done in response to the `Announce` signal.

Calls to WhoImplements is ref counted. If WhoImplements is called with the same
list of interfaces multiple times then CancelWhoImplements must also be called
multiple times with the same list of interfaces.

Specifying NULL for the `implementsInterfaces` parameter is allowed, however, it
could have significant impact on network performance and should be avoided
unless all announcements are needed.

### Add an AboutIcon (optional)

An application that sends an `Announce` signal  can be extended to broadcast a
device icon using an instance of the `AboutIconObj` class.

#### Provision for the Icon content and URL

An Icon is published directly as a byte array or a reference URL, and is
provisioned as follows:

Create an icon using a byte array.  An Icon size of 72 pixels x 72 pixels is
recommended.
```cpp
uint8_t aboutIconContent[] = { 0x89, 0x50, 0x4E, 0x47, 0x0D /* Add relevant data here */ };
AboutIcon icon;
status = icon.SetContent("image/png", aboutIconContent, sizeof(aboutIconContent) / sizeof(aboutIconContent[0]));
```

Create an icon using a URL.
```cpp
AboutIcon icon;
status = icon.SetUrl("image/png", "http://www.example.com");
```
As long as the MimeType of the Url and the icon content are the same. Both the
Url and icon content can be set.

#### AboutIconObj

The `AboutIconObj` will create and register a `BusObject` to handle remote
method calls made on the `org.alljoyn.Icon` interface.  The AboutIconObj is
announced by default.  Applications interested in the `org.alljoyn.Icon`
interface can call WhoImplements(`org.alljoyn.Icon`) to find applications
that broadcast device icon information.

Announce the `org.alljoyn.Icon` interface:
```cpp
AboutIconObj aboutIconObj(bus, icon);
aboutObj.Announce(port, aboutData);
```
Discover the `org.alljoyn.Icon interface`
```cpp
bus.WhoImplements(org::alljoyn::Icon::InterfaceName);
```

### Using Ping to determine presence

The `BusAttachment` `Ping` member function can be used to determine
if a device is responsive. Contents of an Announce signal can
be stale so it is recommended to ping the device to see if it
is still present and responsive before attempting to form a connection.

**NOTE:** The `BusAttachment::Ping` member function makes a bus call. If `Ping`
is called inside an AllJoyn callback, `BusAttachment::EnableConcurrentCallbacks`
must be called first.

```cpp
// when pinging a remote bus wait a max of 5 seconds
#define PING_WAIT_TIME	5000
bus.EnableConcurrentCallbacks();
QStatus status = bus.Ping(busName.c_str(), PING_WAIT_TIME);
if( ER_OK == status) {
   ...
}
```

### Request non-announced data

If there is a need to request information that is not contained in the
announcement, perform the following steps.

1. Join the session

   Create a session with the application by calling `BusAttachment::JoinSession`.

   **NOTE:** The variables name and port are obtained from the
   AboutListener::Announced member function.

   ```cpp
   SessionId sessionId;
   SessionOpts opts(SessionOpts::TRAFFIC_MESSAGES, false,
                    SessionOpts::PROXIMITY_ANY, TRANSPORT_ANY);
   QStatus status = bus.JoinSession(name, port, NULL, sessionId, opts);
   if (status == ER_OK) {
      printf("JoinSession SUCCESS (Session id=%d)", sessionId);
   } else {
      printf("JoinSession failed");
   }
   ```

2. Create an `AboutProxy`

   Generate an About ProxyBusObject by passing the local `BusAttachment`, the
   name of the remote `BusAttachment`, and the `SessionId` obtained from the
   `BusAttachment::JoinSession` call.

   ```cpp
   AboutProxy aboutProxy(bus, busName, sessionId);
   MsgArg arg;
   status = aboutProxy.GetAboutData("", arg);
   if(ER_OK != status) {
       //handle error
   }
   ```

3. Create `AboutIconProxy` (optional)

   Generate an Icon ProxyBusObject by passing the local `BusAttachment`, the
   name of the remote `BusAttachment`, and the `SessionId` obtained from the
   `BusAttachment::JoinSession` call.

   ```cpp
   AboutIconProxy aiProxy(bus, busName, sessionId);

   AboutIcon retIcon;
   status = aiProxy.GetIcon(retIcon);
   if(ER_OK != status) {
       //handle error
   }
   // Get the Url
   retIcon.url
   // Get the content size
   retIcon.contentSize
   // Get a pointer to the icon content
   retIcon.content
   // Get the MimeType
   retIcon.mimetype
   ```
<!--QUESTION FOR GEORGE: Need to resolve TODOs-->
<!--TODO add section on adding user defined values to AboutData -->
<!--TODO add section on Creating child AboutData implementation -->
<!--TODO add section on Making an AboutDataListener from legacy PropertyStore -->
<!--TODO add section on run time adding and removing BusObjects using `BusObject::SetAnnouceFlag` -->

[about-cpp-legacy]: /develop/api-guide/about/cpp-legacy
[create-a-busattachment]: #create-a-busattachment-
[create-interfaces]: #create-interfaces
[create-busobject]: #create-busobject-s-for-interfaces
[register-busobjects]: #register-the-busobjects-with-the-busattachment-
[fill-aboutdata]: #fill-in-your-aboutdata-
[create-about-object]: #create-an-aboutobj-and-announce-
[create-aboutlistener]: #create-an-aboutlistener-
[register-aboutlistener-whoimplements]: #register-the-new-aboutlistener-and-call-whoimplements-
[about-interface-definition]: /learn/core/about-announcement/interface
