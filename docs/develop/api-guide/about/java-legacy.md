# About API Guide - Java

##Reference code

### Classes used to send AboutData

| Server class | Description |
|---|---|
| AboutService | Class that implements the org.alljoyn.About interface. |
| AboutIconService | Class that implements the org.alljoyn.Icon interface. |
| PropertyStore | Interface that supplies the list of properties required for Announce signal payload and GetAboutData(). |

### Classes used to receive AboutData

| Client class | Description |
|---|---|
| AboutClient | Helper class for discovering About Server that provides access to the Announcements and to the AboutService. It listens for Announcements sent using the org.alljoyn.About interface. |
| AboutIconClient | Helper class that provides access to the AboutIconService. |

## Obtain the About feature

See the [Building Android section][building-android] for instructions
on compiling the About feature.

## Build an application that uses About Server

The following steps provide the high-level process to build an
application that will broadcast AboutData.

1. Create the base for the AllJoyn&trade; application.
2. Implement PropertyStore to produce an AboutStore.
(See [Create a PropertyStore implementation][create-propertystore-implementation])
3. Instantiate an AboutStore.
4. Create and register the AboutService, providing it with the AboutStore.
5. Announce the AboutService.

## Build an application that uses About Client

The following steps provide the high-level process to build an
application that will receive AboutData.

1. Create the base for the AllJoyn application.
2. Create and register the AboutService.
3. Create and register the AnnounceListener.
4. Create and use the AboutClient.

## Setting Up the AllJoyn Framework

Every AllJoyn application requires a base set to be in
place before implementing specific features that include
creating a BusAttachment and connecting to the AllJoyn framework.

### Set up AllJoyn variables

```java
static { System.loadLibrary("alljoyn_java"); }  
private BusAttachment mBus;
```

### Prepare the AllJoyn framework

```java
DaemonInit.PrepareDaemon(this); // where 'this' is an android.content.Context class
```

### Create a BusAttachment instance

```java
mBus = new BusAttachment("AboutApplication", BusAttachment.RemoteMessage.Receive);
```

### Create password for the bundled router

NOTE: Thin libraries at AllSeen Alliance version 14.06 or higher do not require this step.

To allow thin libraries to connect to the Android bundled router,
the router requires a password.

```java
Status status = PasswordManager.setCredentials(ALLJOYN_PIN_KEYX, DAEMON_PWD);
if (Status.OK != status) {
    Log.e(TAG, "Failed to set password for daemon, Error: " + status);
}
```

### Start and connect the BusAttachment

Once created, the BusAttachment must be connected to the AllJoyn framework.

```java
Status status = mBus.connect();
if (Status.OK != status) {
    Log.e(TAG, "Failed connect to bus, Error: '" + status + "'");;
}
```

### Advertise the daemon

The application should advertise the daemon so that the
thin client can find it and connect to it.

```java
int flag = BusAttachment.ALLJOYN_REQUESTNAME_FLAG_DO_NOT_QUEUE;
String daemonName = 'org.alljoyn.BusNode_' + mBus.getGlobalGUIDString();
Status status = mBus.requestName(daemonName, flag);
if (Status.OK == status) {
    status = mBus.advertiseName('quiet@' +, SessionOpts.TRANSPORT_ANY);
    if (Status.OK != status) {
        mBus.releaseName(daemonName);
    }
}
```

## Implementing an Application that uses About Server

Implementing an About Server requires creating and registering
an instance of the AboutService class.

NOTE: Verify the BusAttachment has been created, started and
connected before implementing the AboutService. See [Setting up the
AllJoyn Framework][set-up-alljoyn-framework] for the code snippets.
These code snippets references a variable `mBus` (the BusAttachment variable name).

### Declare listener class

Typically, an `AcceptSessionJoiner` callback in SessionPortListener
has a check to allow or disallow access. Since the AboutService
requires access to any application using AboutClient, return true
when this callback is triggered. Use the SessionJoined handler
to set the session timeout to 20 seconds.

```java
class MyListener implements SessionPortListener {
    boolean acceptSessionJoiner( short sessionPort, String joiner, SessionOpts opts ) {
        return true;
    }

    void sessionJoined( short sessionPort, int id, String joiner ) {
        mBus.enableConcurrentCallbacks();
        uint32_t timeout = 20;
        Status status = mBus.SetLinkTimeout(id, timeout);
    }
}
```

### Bind session port

NOTE: This step is not mandatory if you are only sending an
announcement. To allow incoming connections, the formation
of a session is needed. The AllJoyn framework must be told
that connections are allowed.

```java
final Mutable.ShortValue sPort = new Mutable.ShortValue((short) 0);
SessionOpts sessionOpts = new SessionOpts();
sessionOpts.traffic = SessionOpts.TRAFFIC_MESSAGES;
sessionOpts.isMultipoint = true;
sessionOpts.proximity = SessionOpts.PROXIMITY_ANY;
sessionOpts.transports = SessionOpts.TRANSPORT_ANY;

Status status = m_bus.bindSessionPort(sPort, sessionOpts,
    new SessionPortListener() {
        @Override
        public boolean acceptSessionJoiner(short sessionPort, String joiner, SessionOpts sessionOpts) {
            if (sessionPort == sPort.value) {
                return true;
            } else {
                return false;
            }
        }

        public void sessionJoined(short sessionPort, int id, String joiner){
            Log.i(TAG,
                String.format("SessionPortListener.sessionJoined(%d, %d, %s)", sessionPort, id, joiner));
        }
    });

String logMessage =
    String.format("BusAttachment.bindSessionPort(%d, %s): %s", sPort.value, sessionOpts.toString(), status);
Log.d(TAG, logMessage);
```

### Create a PropertyStore implementation

The PropertyStore interface is required by the AboutService
to store the provisioned values for the About interface data
fields (listed in [About interface data fields][about-interface-data-fields]).
See the [About Interface Definition][about-interface-definition] for more information.

NOTE: It is recommended that OEMs create a shared provisioning
file that includes the DefaultLanguage, DeviceName, and DeviceID
fields. This file can be used by developers to manage these fields
in the AllJoyn services that make use of them.

#### About interface data fields

| Field name | Required | Announced | Signature |
|---|---|---|---|
| AppID | yes | yes | ay |
| DefaultLanguage | yes | yes | s |
| DeviceName | yes | yes | s |
| DeviceId | yes | yes | s |
| AppName | yes | yes | s |
| Manufacturer | yes | yes | s |
| ModelNumber | yes |yes | s |
| SupportedLanguages | yes | no | as |
| Description | yes | no | s |
| DateofManufacture | no | no | s |
| SoftwareVersion | yes | no | s |
| AJSoftwareVersion | yes | no | s |
| HardwareVersion | no | no | s |
| SupportUrl | no | no | s |

#### Sample PropertyStore implementation

An example PropertyStore implementation (AboutStore) is provided
below that specifies the following dictionary of metadata fields:

* Keys are the field names
* Values are a Map of String to Object entries, where the
String is the language tag associated with the Object value

```java
public class AboutStore implements PropertyStore
{
    private Set < String > m_AnnounceKeys = new HashSet < String >();
    private Map < String, Map < String, Object > > m_DataMap = new HashMap < String, Map < String, Object > >();
    public AboutStore(Map < String, Map < String, Object > > defaultMap)
    {
        // Initialize set of Announce keys m_AnnounceKeys.add("AppId");
        m_AnnounceKeys.add("DefaultLanguage");
        m_AnnounceKeys.add("DeviceName");
        m_AnnounceKeys.add("DeviceId");
        m_AnnounceKeys.add("AppName");
        m_AnnounceKeys.add("Manufacturer");
        m_AnnounceKeys.add("ModelNumber");
        m_DataMap.putAll(defaultMap);
    }

    @Override
    public void readAll(String languageTag, Filter filter, Map<String, Object> dataMap) throws PropertyStoreException {
        languageTag = checkLanguage(languageTag);
        for (Entry<String, Map<String, Object>> entry : m_DataMap.entrySet()) {
            if (entry.getValue().containsKey(languageTag)) {
                String lang = "";
                if (entry.getValue().containsKey(languageTag)) {
                    lang = languageTag;
                }
                switch (filter)
                {
                case READ:
                    entry.getValue().get(lang));
                    break;
                case ANNOUNCE:
                    if (m_AnnounceKeys.contains(entry.getKey()))
                    {
                        dataMap.put(entry.getKey(),
                        entry.getValue().get(lang));
                    }
                    break;
                }
            }
        }
    }

    @Override
    public void reset(String key, String languageTag) throws PropertyStoreException {}

    @Override
    public void resetAll() throws PropertyStoreException {}

    @Override
    public void update(String key, String languageTag, Object newValue) throws PropertyStoreException {}

    private String checkLanguage(String languageTag) throws PropertyStoreException
    {
        if (languageTag == null) {
            throw new PropertyStoreException(PropertyStoreException.INVALID_VALUE);
        }
        if (languageTag.isEmpty()) {
            return (String) m_DataMap.get("DefaultLanguage").get("");
        }
        if (((Set<String>)m_DataMap.get("SupportedLanguages").get("")).contains(languageTag)) {
            throw new PropertyStoreException(PropertyStoreException.UNSUPPORTED_LANGUAGE);
        }
        return languageTag;
    }
}
```

### Provision PropertyStore instance with default values

In the application, the PropertyStore instance you created
will be loaded with the default values. In the sample implementation
above, the AboutStore instance is provided with a default values map.

```java
Map<String, Map<String, Object> defaultMap = new HashMap<String, Map<String, Object>>();

// Populate map with fields names and values.
String fieldname = "FieldName";
String languageTag = "";

Map<String, Object> defaultValue = new HashMap<String, Object>();
defaultValue.put("", "Value");// An empty string means non-language specific field.
defaultMap.put(fieldName, defaultValue);
PropertyStore aboutStore = new AboutStore(defaultMap);
```

The following subsections highlight provisioning fields
according to their data type.

#### AppId field

The AppId field is an array of bytes. It is a globally
unique identifier (GUID) encoded as an array of 16 bytes.

```java
UUID uuid = UUID.randomUUID();
Map <String, Object> defaultAppId = new HashMap <String, Object>();
defaultAppId.put("", TransportUtil.uuidToByteArray(uuid));
defaultMap.put("AppId", defaultAppId);
```

#### SupportedLanguages field

The SupportedLanguages field is a list of text strings.
Some fields can have language-dependent value that must
be provided for each of the supported languages.

```java
String [] supportedLanguages = { "en", "fr" };
Map <String, Object> defaultSupportedLanguages = new HashMap <String, Object>();
defaultSupportedLanguages.put("", supportedLanguages);
```

#### Non-language specific fields

Non-language-specific fields support a single supplied
text string. Below is an example for the ModelNumber field
on how to insert into the PropertyStore. The code below can
be used with the field name being replaced by other field
names listed in [About interface data fields][about-interface-data-fields].

```java
Map <String, Object> defaultModelNumber = new HashMap <String, Object>();
defaultModelNumber.put("", "MN-123");");// An empty string means non-language specific field.
defaultMap.put("ModelNumber", defaultModelNumber);
```

#### Language-dependent fields

Language-dependent fields support a single supplied text
string. Below is an example for the Description field on
how to insert into the PropertyStore. The code below can
be used with the field name being replaced by other field
names listed in [About interface data fields][about-interface-data-fields].

```java
Map <String, Object> defaultDescription = new HashMap <String, Object>();
defaultDescription.put("en", "The description in English");
defaultDescription.put("fr", "La description en francais");
defaultMap.put("AppId", defaultDescription);
```

### Create the AboutService object

For an application to send AboutData, it requires an instance
of the AboutService class. AboutServiceImpl is an implementation
wrapper around AllJoyn native calls that handle the interactions
between About Server and About Client.

```java
AboutService aboutService = AboutServiceImpl.getInstance();
```

### Start Server mode

Register the relevant BusObjects and add the relevant interfaces
to the Announcements ObjectDescription. Then invoke `startAboutServer`.

```java
aboutService.startAboutServer(mBus, sPort.value, aboutStore);
```

### Add an AboutIconService (optional)

An application that sends AboutData can be extended to broadcast
a device. AboutServiceImpl is also an implementation wrapper
around AllJoyn native calls that handle the interactions between
applications that use the AboutIconClient class.

#### Provision for the Icon content and URL

An Icon is published directly as a byte array or a reference
URL, and must be provisioned as follows:

```java
byte [] aboutIconContent = { 0x89, 0x50, 0x4E, 0x47, 0x0D /* Add relevant data here */ };
String mimeType("image/png"); /* This should correspond to the content */
String url("http://myurl"); /* An alternate access to the Icon */
```

#### Register icon

Register the relevant BusObjects and add the relevant interfaces
to the Announcements ObjectDescription. Then register the icon.

```java
aboutService.registerIcon(mimeType, url, aboutIconContent);
```

### Advertise to allow connections

```java
mBus.advertiseName(mBus.getUniqueName());
```

### Send the Announcement

```java
aboutService.announce();
```

### Releasing resources

When your process is done with the AboutService and no longer
wishes to send announcements, unregister the process from the
AllJoyn bus.

```java
if (null != aboutService) {
    aboutService.unregisterIcon();
    aboutService.stopServer();
}
if( null != mBus) {
    mBus.disconnect();
    mBus.release();
    mBus = null;
}
```

## Implementing an Application that uses About Client

To implement an application to receive AboutData, use the
AboutClient class. By using the AboutClient class, your
application is notified when About Server instances send announcements.

Verify the BusAttachment has been created, started and connected
before implementing an About Client. See [Setting Up the AllJoyn Framework]
[set-up-alljoyn-framework] for the code snippets. These codes snippets
reference a variable `mBus` (the BusAttachment variable name).

### Create the AboutService object

For an application to receive AboutData, it requires an instance
of the AboutService class. AboutServiceImpl is an implementation
wrapper around AllJoyn native calls that handle the interactions
with the About Server.

```java
AboutService aboutService = AboutServiceImpl.getInstance();
```

### Start Client mode

```java
aboutService.startAboutClient(mBus);
```

### Set up ability to receive the Announce signal

In order to receive the Announce signal from an application
using AboutService, a few tasks must be performed.

#### Implement AnnounceHandler class

Create a class that implements the AboutHandler. This class
will be triggered when an announcement arrives.

NOTE: onDeviceLost has been deprecated. Use BusAttachment.ping
to detect whether an application sending an Announce signal is
present and responding.

```java
public class MyAnnouncementHandler implements AnnouncementHandler
{
    @Override
    public void onAnnouncement(String peerName, short port,
       BusObjectDescription[] interfaces, Map<String, Variant> aboutMap) {

        Map<String, Object> newMap = new HashMap<String, Object>();
        try {
            newMap = TransportUtil.fromVariantMap(aboutMap);
            String deviceId = (String) (newMap.get(AboutKeys.ABOUT_APP_ID).toString());
            String deviceFriendlyName = (String) newMap.get(AboutKeys.ABOUT_DEVICE_NAME);
                m_logger.debug(TAG, "onAnnouncement received: with parameters:
                busName:"+deviceName+"\t, port:"+port+"\t, deviceid"+deviceId+ "\t,
                   deviceName:"+deviceFriendlyName);
            // create a client instance to connect to this peer. See possible
            // implementation of this call in "Create the AboutService object".
            engageWithPeer(port, peerName, interfaces, newMap);
        } catch (BusException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onDeviceLost(String serviceName) {}
}
```

#### Register the class you created

After starting the AboutService in [Start Client mode][start-client-mode], add
the following to register the class you created in [Implement
AnnounceHandler class][implement-announcehandler-class].

When registering an announcement listener, specify which interfaces
the application is interested in. The code below shows a listener
registered to receive Announce signals that include an object
implementing the INTERFACE_NAME interface.

```java
MyAnnouncementHandler announceHandler = new MyAnnouncementHandler();
aboutService.addAnnouncementHandler(announceHandler, new String[] { INTERFACE_NAME });
```

### Using ping to determine presence

The BusAttachment ping member function can be used to determine
if a device is responsive. Contents of an Announce signal can
be stale so it may be useful to ping the device to see if it
is still present and responsive before attempting to form a connection.

NOTE: The BusAttachment.ping method makes a bus call. If ping is
called inside an AllJoyn callback, BusAttachment.enableConcurrentCallbacks
must be called first.

```java
// When pinging a remote bus name wait a max of 5 seconds
private final int PING_WAIT_TIME = 5000;
mBus.enableConcurrentCallbacks();
Status status = mBus.ping(peerName, PING_WAIT_TIME);
if (Status.OK == status) {
}
```

### Request non-announced data

If there is a need to request information that is not contained
in the announcement, perform the following steps.

#### Create AboutClient

Generate an instance of AboutClient to engage with a peer
About Server whose Announcement was received in the
onAnnouncement() implementation of your MyAnnouncementHandler instance.

Using the AboutClient instance you can exercise the About
feature API as described in the [About Interface Definition][about-interface-definition].

The following is an example implementation of the call
shown in [Implement AnnounceHandler class][implement-announcehandler-class].

```java
private void engageWithPeer(Short port, String peerName, BusObjectDescription[]
interfaces, Map<String, Object> announceMap) {
    MyAvailabilityListener availabilityListener = new MyAvailabilityListener();
    AboutClient aboutClient = aboutService.createAboutClient(peerName, availabilityListener, port);
    aboutClient.connect();
    // Use the generated AboutClient instance according to your needs.
    // E.g. retrieve AboutData
    Map <String, Object> aboutData =
    aboutClient.getAbout((String)announceMap.get("DefaultLanaguge"));
    // E.g. retrieve ObjectDescription
    BusObjectDescription [] od = aboutClient.getBusObjectDescription();
}
```

#### Request AboutData

AboutData is retrieved via the AboutClient. The structure that
is returned can be iterated through to determine the contents.
The content definition is found in the [About Interface Definition][about-interface-definition].

```java
aboutClient.getAbout((String)announceMap.get("DefaultLanaguge"));
```

#### Create AboutIconClient (optional)

Generate an instance of AboutIconClient to receive the DeviceIcon
out of a peer About Server whose Announcement was received in
the onAnnouncement() implementation of your MyAnnouncementHandler instance.

The following is an example implementation of the call shown
in [Implement AnnounceHandler class][implement-announcehandler-class].

```java
private void engageWithPeer(Short port, String peerName, BusObjectDescription[]
interfaces, Map<String, Object> announceMap) {
    MyAvailabilityListener availabilityListener = new MyAvailabilityListener();
    boolean hasIcon = false;
    for (BusObjectDescription bod : objectDescriptionArray) {
        if (bod.path.equals("/About/DeviceIcon") {
            hasIcon = true;
            break;
        }
    }
    if (hasIcon) {
        AboutIconClient aboutIconClient = aboutService.createAboutIconClient(peerName, availabilityListener, port);
        aboutIconClient.connect();
        // Use the generated AboutIconClient instance according to your needs.
        // E.g. retrieve icon content
        byte [] iconContent = aboutIconClient.GetContent();
    }
}
```

#### Request the icon content (optional)

The icon data is requested through the AboutClientIcon.
The structure that is returned can be iterated through
to determine the contents. The content definition is found
in the [About Interface Definition][about-interface-definition].

```java
aboutIconClient.GetContent();
```

### Releasing resources

Once you are done using the About feature and the AllJoyn
framework, unregister listeners, disconnect and stop the
clients, services, and the BusAttachment used in the application.

```java
if(aboutClient != null) {
    aboutClient.disconnect();
}
if(aboutService != null) {
    aboutService.unregisterAnnounceListener(announceListener);
    aboutService.stopClient();
}
if(mBus != null) {
    mBus.disconnect();
    mBus.release();
    mBus = null;
}
```

[set-up-alljoyn-framework]: #setting-up-the-alljoyn-framework

[building-android]: /develop/building/android
[create-propertystore-implementation]: #create-a-propertystore-implementation
[about-interface-definition]: /learn/core/about-announcement/interface
[about-interface-data-fields]: #about-interface-data-fields
[start-client-mode]: #start-client-mode
[implement-announcehandler-class]: #implement-announcehandler-class
