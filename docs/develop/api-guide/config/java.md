# Configuration API Guide - Java

## Reference code

### Classes used to maintain/provide ConfigData

| Server class | Description |
|---|---|
| ConfigService | Class that implements the org.alljoyn.Config interface. |
| PropertyStore | Interface that supplies the list of properties required for `GetConfigurations()` and enables user manipulation of their values via `UpdateConfigurations()` and `ResetConfigurations()`. |

### Classes used to remotely manipulate ConfigData

| Client class | Description |
|---|---|
| ConfigClient | Helper class for discovering About Server that provides access to the Announcements and to the AboutService. It listens for Announcements sent using the org.alljoyn.About interface. |

## Obtain the Configuration service framework

See the [Building Android section][building-android] for
instructions on compiling the Configuration service framework.

## Build an application that uses Config Server

The following steps provide the high-level process to build an
application that will maintain ConfigData.

1. Create the base for the AllJoyn&trade; application.
2. Implement PropertyStore to produce a ConfigStore.
(See [Create a PropertyStore implementation][create-propertystore-implementation].)
3. Instantiate a ConfigStore.
4. Initialize the AboutService in server mode.
5. Implement the callbacks required by the Config Server.
6. Initialize the ConfigService in server mode, providing
it with the ConfigStore and callbacks.

### Build an application that uses Config Client

The following steps provide the high-level process to build an application
that will remotely manipulate ConfigData.

1. Create the base for the AllJoyn application.
2. Initialize the AboutService in client mode.
3. Initialize the ConfigService in client mode.
4. Create a ConfigClient to interact with an announced Config Server.

## Setting up the AllJoyn framework and About feature

The steps required for this service framework are universal to
all applications that use the AllJoyn framework and for any application
using one or more AllJoyn service framework. Prior to use of the
Configuration service framework as a Config Server or Config Client,
the About feature must be implemented and the AllJoyn framework set up.

Complete the procedures in the following sections to guide you in this process:

* [Building Android][building-android]
* [About API Guide][about-api-guide-java]

## Implementing an Application that Uses Config Server

Implementing a Config Server requires creating and registering
an instance of the ConfigService class. Any application using
Config Server also requires an About Server to facilitate the
discovery via Announcements.

**NOTE:** Verify the BusAttachment has been created, started and
connected before implementing the ConfigService. See the
[About API Guide][about-api-guide-java] for the code snippets.
Code in this section references a variable `mBus` (the BusAttachment
variable name).

### Declare listener class

Declare a listener class to receive the `SessionPortListener` callback.

Typically, an `AcceptSessionJoiner` callback in `SessionPortListener`
has a check to allow or disallow access. Since the AboutService
requires access to any application using AboutClient, return
true when this callback is triggered. Use the SessionJoined
handler to set the session timeout to 20 seconds.

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
};
```

### Bind session port

**NOTE:** This step is not mandatory if you are only sending an announcement.

To allow incoming connections, the formation of a session is needed.
The AllJoyn framework must be told that connections are allowed.

```java
final Mutable.ShortValue sPort = new Mutable.ShortValue((short)0);

SessionOpts sessionOpts = new SessionOpts();
sessionOpts.traffic = SessionOpts.TRAFFIC_MESSAGES;
sessionOpts.isMultipoint = true;
sessionOpts.proximity = SessionOpts.PROXIMITY_ANY;
sessionOpts.transports = SessionOpts.TRANSPORT_ANY;

Status status = m_bus.bindSessionPort(sPort, sessionOpts, new SessionPortListener()
   {
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

String logMessage = String.format("BusAttachment.bindSessionPort(%d, %s): %s",
sPort.value, sessionOpts.toString(), status);
Log.d(TAG, logMessage);
```

### Create a PropertyStore implementation

The PropertyStore interface is required by the AboutService to
store the provisioned values for the About interface data fields.
See the [About Interface Definition][about-interface-definition] for more information.

The ProperyStore interface is also required by the ConfigService
to store and facilitate manipulation of some updateable fields
(listed in [Config interface data fields][config-interface-data-fields.
See the [Configuration Interface Definition][config-interface-definition]
for more information.

#### Config interface data fields

| Field name | Required | Signature |
|---|---|---|
| `DefaultLanguage` | yes | `s` |
| `DeviceName` | yes | `s` |

**NOTE:** Any changes made to these fields should be written to
a shared provisioning file. See the [About API Guide][about-api-guide-java]
for more information.

#### Sample ConfigStore implementation

An example PropertyStore implementation (ConfigStore)
is provided below that specifies the following dictionary
of metadata fields:

* Keys are the field names
* Values are a Map of String to Object entries where the
String is the language tag associated with the Object value

This implementation extends the example AboutStore implementation
in the [About API Guide][about-api-guide-java] and is passed to the
AboutService instead of AboutStore.

```java
public class ConfigStore implements PropertyStore
{
   private Map < String, Map < String, Object > > m_DefaultMap = new HashMap
< String, Map < String, Object > >();
   private Set < String > m_AnnounceKeys = new HashSet < String >();
   private Set < String >	m_WriteableKeys = new HashSet < String >();
   private Map < String, Map < String, Object > > m_DataMap = new HashMap <
String, Map < String, Object > >();

   public ConfigStore(Map < String, Map < String, Object > > defaultMap)
   {
      m_DefaultMap = defaultMap;

      // Initialize set of Announce keys m_AnnounceKeys.add("AppId");
      m_AnnounceKeys.add("DefaultLanguage");
      m_AnnounceKeys.add("DeviceName");
      m_AnnounceKeys.add("DeviceId");
      m_AnnounceKeys.add("AppName");
      m_AnnounceKeys.add("Manufacturer");
      m_AnnounceKeys.add("ModelNumber");

      // Initialize set of Writable keys m_WriteableKeys.add("DefaultLanguage");
      m_WriteableKeys.add("DeviceName");

      // Load default values loadDefaults();

      // Load override values loadConfigurations();
   }

   @Override
   public void readAll(String languageTag, Filter filter, Map<String, Object> dataMap)
         throws PropertyStoreException {
if (dataMap == null) {
         throw new
PropertyStroreException(PropertyStoreException.INVALID_VALUE);
      }
      languageTag = checkLanguage(languageTag);
      for (Entry<String, Map<String, Object>> entry :
m_DataMap.entrySet()) {
         if (entry.getValue().containsKey(languageTag))
         {
            String lang = "";
            if (entry.getValue().containsKey(languageTag)) {
               lang = languageTag;
         }
         switch (filter)
         {
         case READ:
            {
               dataMap.put(entry.getKey(),
entry.getValue().get(lang));
            }
            break;
         case ANNOUNCE:
            if (m_AnnounceKeys.contains(entry.getKey()))
            {
               dataMap.put(entry.getKey(),
entry.getValue().get(lang));
            }
            break;
         case WRITE:
            if (m_WriteableKeys.contains(entry.getKey()))
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
public void reset(String key, String languageTag) throws
PropertyStoreException {
   languageTag = checkLanguage(languageTag);
   if (!m_DataMap.containsKey(key)) {
      throw new PropertyStoreException();
   }
   m_DataMap.get(key).remove(languageTag);
saveConfigurations();
   }

@Override

public void resetAll() throws PropertyStoreException {
   m_DataMap.clear();
   loadDefaults();
}

@Override
public void update(String key, String languageTag, Object newValue)
   throws PropertyStoreException { languageTag = checkLanguage(languageTag);
   if (!m_DataMap.containsKey(key))
   {
      throw new
PropertyStoreException(PropertyStoreException.INVALID_VALUE);
   }
   m_DataMap.get(key).put(languageTag, newValue);
   saveConfigurations();
}

   private String checkLanguage(String languageTag) throws
PropertyStoreException
   {
      if (languageTag == null) {
         throw new
PropertyStoreException(PropertyStoreException.INVALID_VALUE);
   }
      if (languageTag.isEmpty()) {
         return (String) m_DataMap.get("DefaultLanguage").get("");
   }
   if
(((Set<String>)m_DataMap.get("SupportedLanguages").get("")).contains(languageTa g)) {
         throw new
PropertyStoreException(PropertyStoreException.UNSUPPORTED_LANGUAGE);
   }
   return languageTag;
}

private void loadDefaults()
{
   m_DataMap.putAll(m_DefaultMap);
}

private void loadConfigurations()
{
   // Implement your persistence of Config fields here
}

private void saveConfigurations()
{
   // Implement your persistence of Config fields here

   }
}
```

### Provision ConfigStore instance with default values

In the application, the ConfigStore instance which you
created will be loaded with the default values. In the
sample implementation above, the ConfigStore instance will
be provided with a default values map.

```java
Map < String, Map < String, Object > defaultMap = new HashMap < String, Map < String, Object > >();
// Populate map with fields' names and values.
Map < String, Object > defaultDeviceName = new HashMap <String, Object>();
defaultValue.put("", "MyDevice");// An empty string means non-language specific field.
defaultMap.put("DeviceName", defaultDeviceName);
Map < String, Object > defaultLanguage = new HashMap <String, Object>();
defaultValue.put("", "en");// An empty string means non-language specific field.
defaultMap.put("DefaultLanguage", defaultLanguage);
Map < String, Object > deviceId = new HashMap <String, Object>();
deviceId.put(mBus. getGlobalGUIDString(), "en");
// An empty string means non- language specific field.
defaultMap.put("DeviceId", deviceId);
PropertyStore aboutStore = new AboutStore(defaultMap);
```

The following subsections highlight provisioning fields
according to their data type.

#### AppId field

The AppId field is an array of bytes. It is a globally
unique identifier (GUID) encoded as an array of 16 bytes.

```java
UUID uuid = UUID.randomUUID();
Map < String, Object > defaultAppId = new HashMap <String, Object>();
defaultAppId.put("", TransportUtil.uuidToByteArray(uuid));
defaultMap.put("AppId", defaultAppId);
```

#### SupportedLanguages field

The SupportedLanguages field is a list of text strings.
Some fields can have language-dependent value that must
be provided for each of the supported languages.

```java
String [] supportedLanguages = { "en", "fr" };
Map < String, Object > defaultSupportedLanguages = new HashMap <String, Object>();
defaultSupportedLanguages.put("", supportedLanguages);
```

#### Non-language-specific fields

Non-language-specific fields support a single supplied
text string. Below is an example for the ModelNumber field
on how to insert into the ConfigStore. The code below can be
used with the field name being replaced by other field names
listed in [Config interface data fields][config-interface-data-fields].

```java
Map < String, Object > defaultModelNumber = new HashMap <String, Object>();
defaultModelNumber.put("", "MN-123");");// An empty string means non-language specific field.
defaultMap.put("ModelNumber", defaultModelNumber);
```

#### Language-dependent fields

Language-dependent fields support a single supplied text string.
Below is an example for the Description field on how to insert
into the PropertyStore. The code below can be used with the field
name being replaced by other field names listed in
[Config interface data fields][config-interface-data-fields].

```java
Map < String, Object > defaultDescription = new HashMap <String, Object>();
defaultDescription.put("en", "The description in English");
defaultDescription.put("fr", "La description en francais");
defaultMap.put("AppId", defaultDescription);
```

### Establish the AboutService in Server mode

For an application to provide Config Server, it requires to
Announce its interface via an About Server. AboutServiceImpl
is an implementation wrapper around AllJoyn native calls that
handle the interactions between About Server and About Client.
For more details, see the content in [Provision PropertyStore instance
with default values][prov-propertystore] through [Send the Announcement][send-announcement]
in the [About API Guide][about-api-guide-java].

```java
AboutService aboutService = AboutServiceImpl.getInstance();
aboutService.startAboutServer(sPort.value, configStore, mBus);
```

### Create the ConfigService object

For an application to receive and modify ConfigData, it requires
an instance of the ConfigService class. ConfigServiceImpl is an
implementation wrapper around AllJoyn native calls that handle
the interactions with the Config Server.

```java
ConfigService configService = ConfigServiceImpl.getInstance();
```

### Start Server mode

Perform the following tasks to start Server mode.

#### Implement application callbacks

Before starting in server mode, a few application callbacks
must be implemented that allow reaction to changes in various
field values.

```java
ConfigChangeListener configChangeListener = new ConfigChangeListener()
{
   @Override
   public void onConfigChanged(Map<String, Variant> newConfiguration, String languageTag)
   {
      // Perform any action that depends on configuration value changes. E.g. propagate a changed DeviceName to other services that may consume it.
   }
   @Override
   public void onResetConfiguration(String language, String[] fieldNames)
   {
      // Perform any action that depends on configuration value changes. E.g. propagate a reset DeviceName to other services that may consume it.
   }
};
RestartHandler restartHandler = new RestartHandler()
{
   @Override
   public void restart()
   {
      // Restart application disconnecting and reconnecting to the
AllJoyn network.
   }
};
FactoryResetHandler factoryResetHandler = new FactoryResetHandler()
{
   public void doFactoryReset()
   {
      configStore.resetAll(); // Reset the ConfigStore restoring default factory values.
         // Perform any other reset logic related to the AllJoyn services
platform.
   }
}
PassphraseChangedListener passphraseChangeListener = new
PassphraseChangedListener()
{
   public void onPassphraseChanged(byte[] passphrase)
   {
      // Perform any other passphrase change logic related to the application.
   }
}
```

#### Start the ConfigService in Server mode

Once the callbacks are initialized, the Configuration service
framework can be started. Register the relevant BusObjects,
add the relevant interfaces to the Announcement's ObjectDescription
and register the callbacks.

```java
configService.startConfigServer(aboutStore, configChangeListener,
restartHandler, factoryResetHandler, passphraseChangeListener, mBus);
```

#### Register SetPasswordHandler

A SetPasswordHandler is required to be registered with the
ConfigService in order to handler remote calls to set a new
password as the secret for the key exchange encryption mechanism.

```java
SetPasswordHandler setPasswordHandler = new SetPasswordHandler() {
   @Override
   public void setPassword(String peerName, char[] password)
   {
      // Store new credentials
      // Clear all current encryption keys that were generated from the current passphrase.
      mBus.clearKeyStore();
   }
};
configService.setSetPasswordHandler(setPasswordHandler);
```

### Advertise to allow connections

```java
mBus.advertiseName(mBus.getUniqueName());
```

### Send the Announcement

```java
aboutService.announce();
```

### Unregister and delete ConfigService and BusAttachment

When your process is done with the ConfigService and no
longer wishes to send announcements, unregister the process
from the AllJoyn bus and then delete variables used.

```java
if( configService != null ) {
   configService.stopServer();
}
if( aboutService != null ) {
   aboutService.stopServer();
}
if( mBus != null) {
   mBus.disconnect();
   mBus.release();
   mBus = null;
}
```

## Implementing an Application that Uses Config Client

To implement an application to receive and modify ConfigData,
use the ConfigClient class. The AboutClient class must be used
so that your application is notified when applications with
About Server and possibly Config Server instances can send announcements.

Verify the BusAttachment has been created, started and connected
before implementing a Config Client. See the [About API Guide][about-api-guide-java]
for the code snippets. Code in this chapter references a
variable `mBus` (the BusAttachment variable name).

### Establish the AboutService object

For an application to discover peer applications that
are ConfigService providers, it requires an instance of
the AboutService class running in Client mode. AboutServiceImpl
is an implementation wrapper around AllJoyn native calls that
handle the interactions with the About Server. The following
is an aggregation of the content in [Create the AboutService object]
[create-aboutservice-object] through [Set up ability to receive the
Announce signal][set-up-announce-signal] of the [About API Guide][about-api-guide-java].

```java
AboutService aboutService = AboutServiceImpl.getInstance();
aboutService.startClient(mBus);
MyAnnouncementHandler announceHandler = new MyAnnouncementHandler();
aboutService.addAnnouncementHandler(announceHandler, new String[]
   { "org.alljoyn.Config" });
```

### Create the ConfigService object

For an application to receive and modify ConfigData, it requires an
instance of the ConfigService class. ConfigServiceImpl is an implementation
wrapper around AllJoyn native calls that handle the interactions with the
Config Server.

```java
ConfigService configService = ConfigServiceImpl.getInstance();
```

### Start Client mode

```java
configService.startConfigClient(mBus);
```

### Engage with a peer ConfigService

Perform the following tasks to engage with a peer ConfigService
whose Announcement was received.

#### Create ConfigClient

Generate an instance of ConfigClient to receive and send
ConfigData to and from a peer Config Server whose Announcement
was received in the `onAnnouncement()` implementation of your
MyAnnouncementHandler instance. The following is an example
implementation of the call shown in [Implement AnnounceHandler class]
[implement-announcehandler-class] of the [About API Guide][about-api-guide-java].

```java
private void engageWithPeer(Short port, String peerName, BusObjectDescription[]
interfaces, Map<String, Object> announceMap) {
   MyAvailabilityListener availabilityListener = new
MyAvailabilityListener();
   ConfigClient configClient = configService.createFeatureConfigClient
(peerName, availabilityListener, port);
```

#### Request the ConfigData

The updateable ConfigData is requested through the ConfigClient
via the GetConfigurations() method call. The structure that is
returned can be iterated through to determine the contents.
The content definition is found in the [Configuration Interface Definition][config-interface-definition].

```java
Map <String, Variant> configMap =
configClient.GetConfigurations((String)announceMap.get("DefaultLanguage"));
```

#### Update the ConfigData

The received data can be updated through the ConfigClient via the
`UpdateConfigurations()` method call. The structure that was
returned by `GetConfigurations()` can be iterated through to
determine the contents. The content definition is found in the
[Configuration Interface Definition][config-interface-definition].

```java
configMap.put("DefaultLanaguge", new Variant("fr", "s");
configClient.UpdateConfigurations((String)announceMap.get("DefaultLanguage"), configMap);
```

#### Reset the ConfigData

The ConfigData can be reset to default through the ConfigClient
via the `ResetConfigurations()` method call. The structure
that was returned by `GetConfigurations()` can be iterated
through to determine the list of reset fields. The content
definition is found in the [Configuration Interface Definition][config-interface-definition].

```java
String [] fieldsToReset = new String [] { "DeviceName" };
configClient.ResetConfigurations((String)announceMap.get("DefaultLanguage"), fieldsToReset);
```

#### Reset the peer device application to factory defaults

The peer device/application configuration can be reset to
factory defaults through the ConfigClient via the `FactoryReset()` method call.

**NOTE:** This is a no-reply call, so its success cannot be determined directly.

```java
configClient.FactoryReset();
```

#### Restart the peer

The peer application can be restarted though the ConfigClient
via the `Restart()` method call.

**NOTE:** This is a no-reply call, so its success cannot be determined directly.

```java
configClient.Restart();
```

#### Setting a passcode on the peer

The peer application can be set to have a different passcode
through the ConfigClient via the `SetPasscode()` method call.
This revokes the current encryption keys and regenerates new
ones based on the new shared secret, namely the passcode.

**NOTE:** The realm name is currently ignored.

```java
byte [] passcode = new byte [] { 0x01, 0x02, 0x03, 0x04, 0x05, 0x06 };
configClient.SetPasscode("", passcode);
// Revoke current encryption key that was based on the previous passcode. StringValue peerGuid = new StringValue();
Status status = m_Bus.getPeerGUID(m_currentPeer.deviceName, peerGuid);
if(status.equals(Status.OK)){
   mBus.clearKeys(peerGuid.value);
}
```

### Delete variables and unregister listeners

Once you are done using the About feature, Configuration service
framework, and the AllJoyn framework, free the variables used
in the application.

```java
if(configClient != null) {
   configClient.disconnect();
}
if(configService != null) {
   configService.stopClient();
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

[building-android]: /develop/building/android
[create-propertystore-implementation]: #create-a-propertystore-implementation
[about-api-guide-java]: /develop/api-guide/about/java
[config-interface-data-fields]: #config-interface-data-fields
[about-interface-definition]: /learn/core/about-announcement/interface
[config-interface-definition]: /learn/base-services/configuration/interface
[prov-propertystore]: /develop/api-guide/about/java#provision-propertystore-instance-with-default-values
[send-announcement]: /develop/api-guide/about/java#send-the-announcement
[create-aboutservice-object]: /develop/api-guide/about/java#create-the-aboutservice-object
[set-up-announce-signal]: /develop/api-guide/about/java#set-up-ability-to-receive-the-announce-signal
[implement-announcehandler-class]: /develop/api-guide/about/java#implement-announcehandler-class
