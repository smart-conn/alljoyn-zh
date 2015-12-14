# About Feature API Guide - Java

##Reference code

### Classes and interfaces used to send About Feature announcments and data

| Class/interface | Description |
|---|---|
| AboutObj | Class that implements the org.alljoyn.About interface. |
| AboutDataListener | Interface that supplies the list of properties required for Announce signal payload and GetAboutData(). |
| AboutIcon | Container class to hold information about an icon. |
| AboutIconObj | Class that implements the org.alljoyn.Icon interface. |

### Classes and interfaces used to receive About Feature announcements and data.

| Class/interface | Description |
|---|---|
| AboutListener | Interface implemented by AllJoyn&trade; users to receive About interface related events. |
| AboutProxy | Get proxy access to the `org.alljoyn.About` interface. This class enables the user to interact with the remote About `BusObject`. |
| AboutIconProxy | Helper class that provides access to the org.alljoyn.Icon interface. This class enables the user to interact with the remote AboutIcon `BusObject`. |

## Build an application that uses About Server

The following is the high-level process to build an application that will
broadcast an Announce signal. Lines marked with a \* are unique to
applications using the About Feature.

- Create an interface that represents an AllJoyn&trade; interface using annotations.
  - Add `announced="true"` to the `@BusInterface` annotation\*
- Implement the interface and the `BusObject`
- Implement an `AboutDataListener`\*
- Create a new `BusAttachment`
  - Connect
  - Bind a session port
  - Setup security etc.
- Create and register the `BusObject`
- Create `AboutObj` and `announce`\*

## Build an application that uses About Client

The following is the high-level process to build an application that will
receive an `org.alljoyn.About.Announce` signal. Lines marked with a \* are
unique to applications using the About Feature. 

- Create and connect `BusAttachment`
- Implement an `AboutListener`\*
- Register the new `AboutListener`\*
- call `BusAttachment::WhoImplements` member function to specify interfaces your
  application is interested in.\*

## Sample code for sending an `Announce` signal

### Create an interface that represents an AllJoyn interface using annotations
The interface is a collection methods, signals, and properties. The interface
can be represented in xml notation but an annotated interface that represents
that interface must be created.

For this sample the following xml interface was used.
```xml
<interface name='com.example.about.feature.interface.sample' >
  <method name='Echo'>
    <arg name='out_arg' type='s' direction='in' />
    <arg name='return_arg' type='s' direction='out' />
  </method>
</interface>
```
An Java interface annotated so it can be used for AllJoyn.  Note the `announced`
annotation is set to `"true"`.  The interface will not become part of the
`Announce` signal if the `announced` annotation is not added to the
`@BusInterface` annotation.

```java
@BusInterface (name = "com.example.about.feature.interface.sample", announced="true")
public interface SampleInterface {

    @BusMethod(name = "Echo")
    public String echo(String str) throws BusException;
}
```

### Implement the interface and the `BusObject`
The implementation of the `SampleInterface` can be done in just a few lines of
code.

```java
public static class SampleService implements SampleInterface, BusObject {
    public String echo(String str) {
        return str;
    }
}
```
### Implement an `AboutDataListener`

The `AboutDataListener` interface has two methods `getAboutData` and
`getAnnouncedAboutData`.

The method `getAnnouncedAboutData` is called by the AllJoyn framework to get a
`Map` where the key is a `String` and the value is a `Variant`. The map is
expected to contain only the data fields that are announced.
See [About interface data fields][about-interface-data-fields]. Feilds that have
multiple strings in multiple langauges will always return the language specified
in the `DefaultLanguage` tag for the announced data.

The `getAboutData` method is called by the AllJoyn framework when a `AboutProxy`
object calls `AboutProxy.getAboutData()` method. The language _must_ be an
IETF language tage specified by RFC 5646. _Important_ if the language parameter
is null or an empty string the about data for the `DefaultLanguage` should be
returned. If the language specified is not supported thow an
`ErrReplyBusException` with the `Status` `LANGUAGE_NOT_SUPPORTED`. If _any_
required field is not supplied then throw an `ErrReplyBusException` with the
`Status` `ABOUT_ABOUTDATA_MISSING_REQUIRED_FIELD`.

All strings must be encoded using UTF-8 encoding.

Sample implementation of an `AboutDataListener`:
```java
public class MyAboutData implements AboutDataListener {

    @Override
    public Map<String, Variant> getAboutData(String language) throws ErrorReplyBusException {
        System.out.println("MyAboutData.getAboutData was called for `"
                + language + "` language.");
        Map<String, Variant> aboutData = new HashMap<String, Variant>();
        // nonlocalized values
        aboutData.put("AppId", new Variant(new byte[] {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16}));
        aboutData.put("DefaultLanguage", new Variant(new String("en")));
        aboutData.put("DeviceId", new Variant(new String(
                "93c06771-c725-48c2-b1ff-6a2a59d445b8")));
        aboutData.put("ModelNumber", new Variant(new String("A1B2C3")));
        aboutData.put("SupportedLanguages", new Variant(new String[] { "en", "es" }));
        aboutData.put("DateOfManufacture", new Variant(new String("2014-09-23")));
        aboutData.put("SoftwareVersion", new Variant(new String("1.0")));
        aboutData.put("AJSoftwareVersion", new Variant(Version.get()));
        aboutData.put("HardwareVersion", new Variant(new String("0.1alpha")));
        aboutData.put("SupportUrl", new Variant(new String(
                "http://www.example.com/support")));
        // localized values
        // If the language String is null or an empty string we return the default
        // language in this case english
        if ((language == null) || (language.length() == 0) || language.equals("en")) {
            aboutData.put("DeviceName", new Variant(new String("A device name")));
            aboutData.put("AppName", new Variant(new String("An application name")));
            aboutData.put("Manufacturer", new Variant(new String(
                    "A mighty manufacturing company")));
            aboutData.put("Description",
                    new Variant( new String("Sample showing the about feature in a service application")));
        } else if (language.equals("es")) { // Spanish
            aboutData.put("DeviceName", new Variant(new String(
                    "Un nombre de dispositivo")));
            aboutData.put("AppName", new Variant(
                    new String("Un nombre de aplicación")));
            aboutData.put("Manufacturer", new Variant(new String(
                    "Una empresa de fabricación de poderosos")));
            aboutData.put("Description",
                    new Variant( new String("Muestra que muestra la característica de sobre en una aplicación de servicio")));
        } else {
            throw new ErrorReplyBusException(Status.LANGUAGE_NOT_SUPPORTED);
        }
        return aboutData;
    }

    @Override
    public Map<String, Variant> getAnnouncedAboutData() throws ErrorReplyBusException {
        System.out.println("MyAboutData.getAnnouncedAboutData was called.");
        Map<String, Variant> aboutData = new HashMap<String, Variant>();
        aboutData.put("AppId", new Variant(new byte[] {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16}));
        aboutData.put("DefaultLanguage", new Variant(new String("en")));
        aboutData.put("DeviceName", new Variant(new String("A device name")));
        aboutData.put("DeviceId", new Variant(new String("93c06771-c725-48c2-b1ff-6a2a59d445b8")));
        aboutData.put("AppName", new Variant( new String("An application name")));
        aboutData.put("Manufacturer", new Variant(new String("A mighty manufacturing company")));
        aboutData.put("ModelNumber", new Variant(new String("A1B2C3")));
        return aboutData;
    }

}
```

#### About interface data fields

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

`AppId` is a 128-bit UUID (16-bytes) as specified in RFC 4122.

### Create a new `BusAttachment`

Basic setup that all AllJoyn applications must do to announce there interfaces.
Depending on the application additional work may be needed to add in security or
application life-time management code.

```java
BusAttachment bus;
bus = new BusAttachment("AppName", BusAttachment.RemoteMessage.Receive);

Status status;
status = bus.connect();
if (status != Status.OK) {

    return;
}

// Bind a session port
Mutable.ShortValue contactPort = new Mutable.ShortValue(CONTACT_PORT);

SessionOpts sessionOpts = new SessionOpts();
sessionOpts.traffic = SessionOpts.TRAFFIC_MESSAGES;
sessionOpts.isMultipoint = false;
sessionOpts.proximity = SessionOpts.PROXIMITY_ANY;
sessionOpts.transports = SessionOpts.TRANSPORT_ANY;

status = bus.bindSessionPort(contactPort, sessionOpts, new SessionPortListener() {
    public boolean acceptSessionJoiner(short sessionPort, String joiner, SessionOpts sessionOpts) {
        if (sessionPort == CONTACT_PORT) {
            return true;
        } else {
            return false;
        }
    }
});
if (status != Status.OK) {
    return;
}
```

### Create and Register the `BusObject`
```java
SampleService mySampleService = new SampleService();
status = bus.registerBusObject(mySampleService, "/example/path");
if (status != Status.OK) {
    return;
}
```

### Create `AboutObj` and `announce`
```java
AboutObj aboutObj = new AboutObj(bus);
status = aboutObj.announce(contactPort.value, new MyAboutData());
if (status != Status.OK) {
    System.out.println("Announce failed " + status.toString());
    return;
}
```

## Sample code for receiving an `Announce` signal

Code that receives an `Announce` signal will need to create, start, and connect
a `BusAttachment` the same as the code that sent the `Announce` signal. The
application that receives the `Announce` signal does not need to bind a session
port. See [Create a new `BusAttachment`][create-a-busattachment]

### Implement an `AboutListener`
```java
static class MyAboutListener implements AboutListener {
    public void announced(String busName, int version, short port, AboutObjectDescription[] objectDescriptions, Map<String, Variant> aboutData) {
        // Place code here to handle Announce signal.
    }
}
```

The `AboutListener` is called by the AllJoyn routing node when an `Announce`
signal is found.  The `Announced` call back contains all the information
contained in the received `Announce` signal as well as the unique BusName of the
`BusAttachment` that emitted the `Announce` signal. This information can be used
to form a session with the remote device; and Make a `ProxyBus` object based on
the interfaces reported in the `objectDescriptions`.

### Register the new `AboutListener` and call `BusAttachment.whoImplements`

````java
AboutListener listener = new MyAboutListener();
bus.registerAboutListener(listener);

String ifaces[] = {"com.example.about.feature.interface.sample"};
status = bus.whoImplements(ifaces);
if (status != Status.OK) {
    return;
}
```

#### The whoImplements method
The `whoImplements` method is used to declare your interest in one or more
specific interfaces. If a remote device is announcing the interface(s) then
all Registered `AboutListeners` will be called.

For example, if you need both `com.example.Audio` *and*
`com.example.Video` interfaces then do the following.

Register `AboutListener` once:
```java
String ifaces[] = {"com.example.Audio", "com.example.Video"};
RegisterAboutListener(aboutListener);
bus.whoImplements(ifaces));
```

If the `AboutListener` should be called if `com.example.Audio` *or*
`com.example.Video` interfaces are found then call `WhoImplements` multiple
times:
```java
RegisterAboutListener(aboutListener);
String audioInterface[] = {"com.example.Audio"};
bus.whoImplements(audioInterface);
String videoInterface[] = {"com.example.Video"};
bus.whoImplements(videoInterface);
```

The interface name may be a prefix followed by a `*`.  Using this, the example
where we are interested in `com.example.Audio` *or* `com.example.Video`
interfaces could be written as:
```java
String exampleInterface[] = {"com.example.*"};
RegisterAboutListener(aboutListener);
WhoImplements(exampleInterface);
```

The AboutListener will receive any announcement that implements an interface
beginning with the `com.example.` name.

It is the AboutListeners responsibility to parse through the reported interfaces
to figure out what should be done in response to the `Announce` signal.

Calls to `whoImplements` is ref counted. If `whoImplements` is called with the same
list of interfaces multiple times then `cancelWhoImplements` must also be called
multiple times with the same list of interfaces.

Specifying `null` for the `interfaces` parameter is allowed, however, it
could have significant impact on network performance and should be avoided
unless all announcements are needed.

### Add an AboutIcon (optional)

An application that sends an `Announce` signal  can be extended to broadcast a
device icon using an instance of the `AboutIconObj` class.

#### Provision for the Icon content and URL

An icon is published directly as a byte array or a reference URL, and is
provisioned as follows:

Create an icon using a byte array.  An Icon size of 72 pixels x 72 pixels is
recommended.
```java
byte[] iconContent = { (byte)0x89, 0x50, 0x4E, 0x47/* Add relevant data here */ };
AboutIcon icon = null;
try {
    icon = new AboutIcon("image/png", iconContent);
} catch (BusException e) {
    System.out.println("AboutIcon threw a BusException when it was unexpected.");
}
```

Create an icon using a URL.
```java
AboutIcon icon = null;
try {
    icon = new AboutIcon("image/png", "http://www.example.com");
} catch (BusException e) {
    System.out.println("AboutIcon threw a BusException when it was unexpected.");
}
```
As long as the MimeType of the Url and the icon content are the same. Both the
Url and icon content can be set.
```java
byte[] iconContent = { (byte)0x89, 0x50, 0x4E, 0x47/* Add relevant data here */ };
AboutIcon icon = null;
try {
    icon = new AboutIcon("image/png", "http://www.example.com", iconContent);
} catch (BusException e) {
    System.out.println("AboutIcon threw a BusException when it was unexpected.");
}
```
#### AboutIconObj

The `AboutIconObj` will create and register a `BusObject` to handle remote
method calls made on the `org.alljoyn.Icon` interface.  The AboutIconObj is
announced by default.  Applications interested in the `org.alljoyn.Icon`
interface can call WhoImplements(`org.alljoyn.Icon`) to find applications
that broadcast device icon information.

Announce the `org.alljoyn.Icon` interface:
```java
AboutIconObj aio = new AboutIconObj(bus, icon);
AboutObj aboutObj = new AboutObj(bus);
status = aboutObj.announce(PORT_NUMBER, aboutData));
```
Discover the `org.alljoyn.Icon interface`
```java
status = clientBus.whoImplements(new String[] {org.alljoyn.bus.ifaces.Icon.INTERFACE_NAME});
```

### Using Ping to determine presence

The `BusAttachment` `Ping` method can be used to determine
if a device is responsive. Contents of an `org.alljoyn.About.Announce` signal can
be stale so it is recommended to ping the device to see if it is still present
and responsive before attempting to form a connection.

**NOTE:** The `BusAttachment.ping` method makes a bus call. If `BusAttachment.ping`
is called inside an AllJoyn callback, `BusAttachment.enableConcurrentCallbacks`
must be called first.

```java
// pinging a remote bus, wait a max of 5 seconds
bus.enableConcurrentCallbacks();
QStatus status = bus.ping(busName.c_str(), 5000);
if( ER_OK == status) {
   // remote device found
   ...
}
```

### Request non-announced data

If there is a need to request information that is not contained in the
announcement, perform the following steps.

1. Join the session

   Create a session with the application by calling `BusAttachment.joinSession`.

   **NOTE:** The variables name and port are obtained from the
   AboutListener::Announced member function.

   ```java
   SessionOpts sessionOpts = new SessionOpts();
   sessionOpts.traffic = SessionOpts.TRAFFIC_MESSAGES;
   sessionOpts.isMultipoint = false;
   sessionOpts.proximity = SessionOpts.PROXIMITY_ANY;
   sessionOpts.transports = SessionOpts.TRANSPORT_ANY;
    
   Mutable.IntegerValue sessionId = new Mutable.IntegerValue();
    
   bus.enableConcurrentCallbacks();

   Status status = bus.joinSession(busName, port, sessionId, sessionOpts, new SessionListener());
   if (status != Status.OK) {
       return;
   }
   ```

2. Create an `AboutProxy`

   Generate an About ProxyBusObject by passing the local `BusAttachment`, the
   name of the remote `BusAttachment`, and the `SessionId` obtained from the
   `BusAttachment.joinSession` call.   

   ```java
   AboutProxy aboutProxy = new AboutProxy(mBus, busName, sessionId.value);
   try {
        Map<String, Variant> aboutData;
        aboutData = aboutProxy.getAboutData("en");
   } catch (BusException e) {
       System.out.println("Unexpected BusException.")
   }
   ```

3. Create `AboutIconProxy` (optional)

   Generate an Icon ProxyBusObject by passing the local `BusAttachment`, the
   name of the remote `BusAttachment`, and the `SessionId` obtained from the
   `BusAttachment.joinSession` call.

   ```java
   AboutIconProxy aiProxy = new AboutIconProxy(clientBus, aListener.remoteBusName, sessionPortlistener.sessionId);
   AboutIcon aIcon;
   try {
       aIcon = aiProxy.getAboutIcon();
   } catch (BusException e) {
       System.out.println("Unexpected BusException.");
   }

   // Get the Url
   String url = aIcon.getUrl();
   // Get the content
   byte[] content = aIcon.getContent();
   // Get the MimeType
   String mimeType = aIcon.getMimeType();
   ```

[set-up-alljoyn-framework]: #setting-up-the-alljoyn-framework
[building-android]: /develop/building/android
[about-interface-definition]: /learn/core/about-announcement/interface
[about-interface-data-fields]: #about-interface-data-fields
[create-a-busattachment]: #create-a-new-BusAttachment

