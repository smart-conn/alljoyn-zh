# About API Guide - C++

The About Feature was integrated with the core library with the
AllJoyn&trade; 14.12 release.  The reference code found in this document refers
to the About Feature code developed before the the About Feature integration.

As a developer you are encouraged to discontinue use of these APIs and move to
the newer About Feature API.

[Current About API C++ Guide][about-cpp]


## Reference code

### Classes used to send AboutData

| Server class | Description |
|---|---|
| AboutService | Class that implements the org.alljoynAbout interface. |
| AboutIconService | Class that implements the org.alljoynIcon interface. |
| PropertyStore | Interface that supplies the list of properties required for Announce signal payload and GetAboutData(). |

### Classes used to receive AboutData

| Client class | Description |
|---|---|
| AboutClient | Helper class for discovering AboutServer that provides access to the Announcements and to the AboutService. It listens for Announcements sent using the org.alljoyn.About interface. |
| AboutIconClient | Helper class that provides access to the AboutIconService. |

### Reference C++ application code

| Application class | Description |
|---|---|
| AboutServerMain | Command line application that announces the About and DeviceIcon AllJoyn&trade; interfaces and handles remote access to these interfaces by registering an instance of AboutService and AboutIconService the AllJoyn bus. |
| AboutClientMain | Command line application that uses AboutClient to discover About servers and exercise their interfaces. |

## Build an application that uses AboutService

The following steps provide the high-level process to build an
application that will broadcast AboutData.

1. Implement PropertyStore to produce an AboutStore.
(See [Create a PropertyStore implementation][create-propertystore-implementation].)
2. Instantiate an AboutStore.
3. Create and register the AboutService, providing it with the AboutStore.

## Build an application that uses AboutClient

The following steps provide the high-level process to build an
application that will receive AboutData.

1. Create the base for the AllJoyn application.
2. Create a new AboutClient.
3. Register the AnnounceListener.
4. Register the AboutClient.

## Setting Up the AllJoyn Framework

### Create instance of BusAttachment

To use the About feature, an AllJoyn object call the BusAttachment
is needed that is used internally by the service to leverage
the AllJoyn API calls.

```cpp
BusAttachment* msgBus = new BusAttachment("AboutService", true);
```

### Create password for the bundled router

NOTE: Thin libraries at AllSeen Alliance version 14.06 or
higher do not require this step.

To allow thin libraries to connect to the bundled router,
the router requires a password.

```cpp
PasswordManager::SetCredentials("ALLJOYN_PIN_KEYX", PassCode);
}
```

### Start and connect the BusAttachment

Once created, the BusAttachment must be connected to the
AllJoyn framework.

```cpp
QStatus status = msgBus->Start();
if( status == ER_OK ) {
   status = msgBus->Connect(NULL);
}
```
## Implementing an Application that Uses AboutService

Implementing an AboutServer requires creating and registering
an instance of the AboutService class.

NOTE: Verify the BusAttachment has been created, started and
connected before implementing the AboutService. See [Setting
Up the AllJoyn Framework][set-up-alljoyn-framework] for the
code snippets. Code in this section references a variable
`msgBus` (the BusAttachment variable name).

### Declare listener class

Declare a listener class to receive the SessionPortListener callback.

Typically, an AcceptSessionJoiner callback in SessionPortListener
has a check to allow or disallow access. Since the AboutService
requires access to any application using AboutClient, return
true when this callback is triggered. Use the SessionJoined
handler to set the session timeout to 20 seconds.

```cpp
class MyListener : public SessionPortListener {
   private:
      BusAttachment *mMsgBus;

   public:
      MyListener( BusAttachment *msgBus ) {
         mMsgBus = msgBus;
   }

      bool AcceptSessionJoiner( SessionPort sessionPort, const
         char* joiner, const SessionOpts& opts ) {

         printf("Accepting join session request from %s (opts.proximity=%x,
            opts.traffic=%x, opts.transports=%x)\n",
               joiner, opts.proximity, opts.traffic, opts.transports);

         return true;
      }

      void SessionJoined( SessionPort sessionPort, SessionId id, const char*
joiner ) {
         printf("SessionJoined with %s (id=%d)\n", joiner, id);
         mMsgBus->EnableConcurrentCallbacks();
         uint32_t timeout = 20;
         QStatus status = mMsgBus->SetLinkTimeout(id, timeout);
         if( status == ER_OK ) {
            printf("Link timeout has been set to %ds\n", timeout);

         } else {
            printf("SetLinkTimeout(%d) failed\n", timeout);
         }
      }
};
```

### Bind session port

To allow incoming connections, the formation of a session is
needed. The AllJoyn framework must be told that connections
are allowed.

```cpp
SessionOpts opts(SessionOpts::TRAFFIC_MESSAGES, false,
    SessionOpts::PROXIMITY_ANY, TRANSPORT_ANY);
SessionPort sPort = SERVICES_PORT;
if( status == ER_OK )
    status = msgBus->BindSessionPort(sPort, opts, *busListener);
```

### Create a PropertyStore implementation

The PropertyStore interface is required by the AboutService to
store the provisioned values for the About interface data fields.
See the [About Interface Definition][about-interface-definition] for more information.

#### About interface data fields

| Field name | Required | Announced | Signature |
|---|---|---|---|
| AppId | yes | yes | ay |
| DefaultLanguage | yes | yes | s |
| DeviceName | yes | yes | s |
| DeviceId | yes | yes | s |
| AppName | yes | yes | s |
| Manufacturer | yes | yes | s |
| ModelNumber | yes | yes | s |
| SupportedLanguages | yes | no | as |
| Description | yes | no | s |
| DateofManufacture | no | no | s |
| SoftwareVersion | yes | no | s |
| AJSoftwareVersion | yes | no | s |
| HardwareVersion | no | no | s |
| SupportUrl | no | no | s |

An example PropertyStore implementation (AboutPropertyStoreImp)
is provided. All fields above can easily be set by calling the
appropriate setter function.

```cpp
aboutStore = new AboutPropertyStoreImpl();
aboutStore ->setDeviceId("1231232145667745675477");
aboutStore ->setDeviceName("MyDeviceName", "en");
aboutStore ->setDeviceName("NombreDeMiDispositivo", "es");
aboutStore ->setDeviceName("NomDispositif", "fr");
aboutStore ->setAppId("000102030405060708090A0B0C0D0E0C");
aboutStore ->setDefaultLang("en");

aboutStore ->setAppName("AboutConfig", "en");
aboutStore ->setAppName("AboutConfig", "es");
aboutStore ->setAppName("AboutConfig", "fr");
aboutStore ->setModelNumber("Wxfy388i");
aboutStore ->setDateOfManufacture("10/1/2199");
aboutStore ->setSoftwareVersion("12.20.44 build 44454");
aboutStore ->setAjSoftwareVersion(ajn::GetVersion());
aboutStore ->setHardwareVersion("355.499. b");

std::vector<qcc::String> languages(3);
languages[0] = "en";
languages[1] = "es";
languages[2] = "fr";
aboutStore ->setSupportedLangs(languages);

aboutStore ->setDescription("This is an AllJoyn application", "en");
aboutStore ->setDescription("Esta es una AllJoyn aplicacion", "es");
aboutStore ->setDescription("C'est une AllJoyn application", "fr");

aboutStore ->setManufacturer("Company", "en");
aboutStore ->setManufacturer("Empresa", "es");
aboutStore ->setManufacturer("Entreprise", "fr");

aboutStore ->setSupportUrl("http://www.allseenalliance.org");
```

### Create the AboutService object

For an application to send AboutData, it requires an instance
of the AboutService class. AboutService is an implementation
wrapper around AllJoyn native calls that handle the interactions
between AboutServer and AboutClient.

```cpp
AboutService* aboutService = NULL;
aboutService = aboutService = new AboutService(msgBus,aboutStore);
aboutService->Register(SERVICES_PORT);
msgBus->RegisterBusObject(*aboutService);
```

### Add interfaces to Announcement

```cpp
std::vector<qcc::String> interfaces;
interfaces.push_back("org.alljoyn.About");
aboutService->AddObjectDescription("/About", interfaces);
```

### Register AboutService object with BusAttachment

Register the AboutService with the obtained session port.

```cpp
aboutService->Register(sPort);
msgBus->RegisterBusObject(*aboutService);
```

### Add an AboutIconService (optional)

An applicaton that sends AboutData can be extended to
broadcast a device icon using an instance of the AboutIconService
class. AboutIconService is an implementation wrapper around
AllJoyn native calls that handle the interactions between
applications that use the AboutIconClient class.

#### Provision for the Icon content and URL

An Icon is published directly as a byte array or a reference
URL, and must be provisioned as follows:

```cpp
uint8_t aboutIconContent[] = { 0x89, 0x50, 0x4E, 0x47, 0x0D /* Add relevant data here */ };
qcc::String mimeType("image/png"); /* This should correspond to the content */
qcc::String url("http://myurl"); /* An alternate access to the Icon */
```

#### AddDeviceIcon object and interfaces to Announcement

```cpp
std::vector<qcc::String> interfaces;
interfaces.push_back("org.alljoyn.Icon");
aboutService->AddObjectDescription("/About/DeviceIcon", interfaces);
```

#### Create and register DeviceIcon object

```cpp
AboutIconService* aboutIconService = NULL;
aboutIconService = new AboutIconService(msgBus, mimeType, url,
   aboutIconContent, sizeof(aboutIconContent) / sizeof (*aboutIconContent));
aboutIconService->Register();
msgBus->RegisterBusObject(*aboutIconService);
```

### Advertise name

```cpp
if( status == ER_OK )
   status = msgBus->AdvertiseName(msgBus->GetUniqueName().c_str(),
      opts.transports);
```

### Announce name

```cpp
if( status == ER_OK )
status = aboutService->Announce();
```

### Unregister and delete AboutService, AboutStore, and AboutIconService

When your process is done with the AboutService and no
longer wishes to send announcements, unregister the process
from the AllJoyn bus and then delete variables used.

```cpp
if( aboutService != NULL ) {
   msgBus->UnregisterBusObject(*aboutService);
   delete aboutService;
}
if( aboutStore != NULL ) {
   delete aboutStore;
}
if( aboutIconService != NULL ) {
   msgBus->UnregisterBusObject(*aboutIconService);
   delete aboutIconService;
}
```

## Implementing an Application that Uses AboutClient

To implement an application to receive AboutData, use the
AboutClient class. By using the AboutClient class, your
application is notified when AboutServer instances send
announcements.

NOTE: Verify the BusAttachment has been created, started
and connected before using an AboutClient. See [Setting Up
the AllJoyn Framework][set-up-alljoyn-framework] for the code
snippets. Code in this section references a variable msgBus
(the BusAttachment variable name).

### Setup to receive the Announce signal

In order to receive the Announce signal, implement a class
that inherits from the
AnnounceHandler base class.

#### Create class to implement AnnounceHandler

This declaration of a class will allow for the signals to be
received. It needs to implement pure virtual function Announce.

```cpp
class AnnounceHandlerImpl : public ajn::services::AnnounceHandler (){
   void Announce(unsigned short version, unsigned short port,
      const char* busName, const ObjectDescriptions& objectDescs,
         const AboutData& aboutData);
}
```

#### Implement the Announce method that handles the Announce signal

With everything linked up using the AllJoyn framework, the
method registered with the AllJoyn framework will be executed
upon receipt of an Announce signal.

Because every application is different, as a developer you
will need to process the
AboutData and determine the following:

* How in the UI it should be rendered
* When to request the data that is not contained in the Announce signal
* Any logic that is needed

#### Register the announceHandler using the AnnouncementRegistrar class

When registering an announcement listener, specify which
interfaces the application is interested in. The code below
shows a listener registered to receive Announce signals that
include an object implementing the INTERFACE_NAME interface.

```cpp
AnnounceHandlerImpl* announceHandlerImpl = new AnnounceHandlerImpl();
const char* interfaces[] = { INTERFACE_NAME };
AnnouncementRegistrar::RegisterAnnounceHandler(*busAttachment,
   *announceHandlerImpl, interfaces, 1);
```

### Using Ping to determine presence

The BusAttachment Ping member function can be used to determine
if a device is responsive. Contents of an Announce signal can
be stale so it is recommended to ping the device to see if it
is still present and responsive before attempting to form a connection.

NOTE: The BusAttachment.Ping method makes a bus call. If `Ping`
is called inside an AllJoyn callback, `BusAttachment.EnableConcurrentCallbacks`
must be called first.

```cpp
// when pinging a remote bus wait a max of 5 seconds
#define PING_WAIT_TIME	5000
msgBus->EnableConcurrentCallbacks();
   QStatus status = msgBus->Ping(busName.c_str(), PING_WAIT_TIME);
   if( ER_OK == status) {
   ...
}
```

### Request non-announced data

If there is a need to request information that is not contained
in the announcement, perform the following steps.

1. Join the session

   Create a session with the application by using the
   BusAttachment JoinSession API.

   NOTE: The variables name and port are set from the AboutData
   from the Announce method.

   ```cpp
   SessionId sessionId;
      SessionOpts opts(SessionOpts::TRAFFIC_MESSAGES, false,
         SessionOpts::PROXIMITY_ANY, TRANSPORT_ANY);
      QStatus status = msgBus->JoinSession(name, port, NULL, sessionId, opts);
      if (status == ER_OK) {
         QCC_DbgTrace(("JoinSession SUCCESS (Session id=%d)", sessionId));
      } else {
         QCC_LogError(status, ("JoinSession failed"));
      }
   ```

2. Create AboutClient

   Generate an AboutProxyBusObject from the org.alljoyn.About
   Introspection XML and create an instance passing ButAttachment
   and sessionId.

   ```cpp
   AboutProxyBusObject * aboutClient = new AboutProxyBusObject
      (msgBus, sender_name,"\About", sessionId);
   aboutClient->GetAboutData("");
   ```

3. Create AboutIconClient

   Generate an IconProxyBusObject from the org.alljoyn.Icon
   Introspection XML and create an instance passing
   ButAttachment, port, and sessionId.

   ```cpp
   IconProxyBusObject * aboutIconClient = new IconProxyBusObject
      (msgBus, sender_name, "About\DeviceIcon", sessionId);
   aboutIconClient->GetUrl();
   ```

### Shutdown

Once you are done using the About feature and the AllJoyn
framework, free the variables used in the application.

NOTE: The AboutClient object must be deleted before the
BusAttachment object.

```cpp
delete aboutClient;
delete aboutIconClient;
delete msgBus;
```
[about-cpp]: /develop/api-guide/about/cpp
[create-propertystore-implementation]: #create-a-propertystore-implementation
[set-up-alljoyn-framework]: #setting-up-the-alljoyn-framework
[about-interface-definition]: /learn/core/about-announcement/interface
