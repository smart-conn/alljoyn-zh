# Build an Application Using the Thin Library

## Obtain the sample app

Refer to the target platform documentation for instructions
to download the sample apps.

## Reference code

The reference code consists of a module that implements the
main function and a module the implements the services handlers.

### Sample app modules

| Module | Description |
|---|---|
| AboutSample | About sample code. Includes provisioning and business logic related to the About feature. |
| ConfigSample | Configuration service framework sample code. Includes provisioning and business logic that exercises the service's developers' API. |
| ControlPanelSample | ControlPanel service framework sample code. Includes provisioning and business logic that exercises the service's developers' API. |
| ControlPanelGenerated | ControlPanel service framework sample generated controllee model. |
| ControlPanelProvided | ControlPanel Service Framework sample provisioned controlee business logic that interacts with the generated model. |
| PropertyStore | PropertyStore implementation code; this supports all core services. |
| ServerSample | Main function for service application and provisioning code for all service frameworks. |
| ServicesHandlers | Sample code for services handlers. |
| SimpleNotificationProducerSample | Notification service framework sample Producer sample code. Includes provisioning and business logic that exercises the producer's developers' API. |
| SimpleNotificationConsumerSample | Notification Service Framework simple Consumer sample code. Includes provisioning and business logic that exercises the consumer's developers' API. |

## Build a Thin Library server app

Perform the following steps at a high level to build a Thin Library server app.

1. Create the base for the AllJoyn&trade; application.
2. Call services handlers.
3. Implement the PropertyStore. See the [About API Guide][about-api-guide-thin-library]
for instructions.
4. Implement remote callbacks.
5. (Optional) Integrate the Configuration service framework
with an AuthListener.

## Server sample app walkthrough

The sample app sends an Announce signal with the About
interfaces, other registered servicess interfaces, and
the information stored in the PropertyStore. Depending on
the service frameworks included in the compilation, the
application can then send a notification, enable onboarding,
store configuration in NVRAM, or act as a Control Panel device.
The specific functionality of each service framework is covered
in the appropriate service framework's API Guide.

See the [appropriate API Guide][about-api-guides] for the
service framework you are working with.

## Implementing a Thin Library Server App

### Create the base for the AllJoyn application

See the [About API Guide][about-api-guide-thin-library] for more information.

#### Initialize the AllJoyn framework

```c
AJ_Initialize();
```

#### Initialize the PropertyStore

```c
PropertyStore_Init();
```

#### Initialize the About feature

```c
AJ_AboutSetIcon(aboutIconMimetype, aboutIconContent, aboutIconContentSize, aboutIconUrl);
```

#### Initialize each included service framework

The initialization of the service typically calls the corresponding
Start method of the service's API passing the relevant settings
and callbacks that integrate the service within the overall application
provisioning and business logic.

```c
#ifdef CONFIG_SERVICE Config_Init();
#endif
#ifdef NOTIFICATION_SERVICE_PRODUCER NotificationProducer_Init();
#endif
#ifdef NOTIFICATION_SERVICE_PRODUCER NotificationConsumer_Init();
#endif
#ifdef CONTROLPANEL_SERVICE Controllee_Init();
#endif
```

#### Set bus authentication password callback

```c
SetBusAuthPwdCallback(MyBusAuthPwdCB);
```

Refer to the API Reference Manual for the SetBusAuthPwdCallback method.

#### Create main loop

```c
static uint8_t isBusConnected = FALSE; static AJ_BusAttachment busAttachment;
   AJ_Status status;
while (TRUE) {
   AJ_Message msg;
   status = AJ_OK;
```

##### Connect to the AllJoyn bus

```c
if (!isBusConnected) {
status = AJSVC_RoutingNodeConnect(&busAttachment, "org.alljoyn.BusNode",
   AJAPP_CONNECT_TIMEOUT,
   AJAPP_CONNECT_PAUSE, AJAPP_BUS_LINK_TIMEOUT, &isBusConnected);
      if (!isBusConnected) { // Failed to connect to Routing Node?
         continue; // Retry establishing connection to Routing Node.
      }
```

##### Set up the relevant bus authentication listener callback (optional)

In cases where your code uses secured methods, you will need to
register the relevant authentication listener callback. Inclusion
of the Configuration service framework and/or enabling security
in the Control Panel service framework implies your code uses
secured methods.

The sample applications typically set up a shared secret-based
mechanism that requires a password callback as follows:

```c
/* Setup password based authentication listener for secured peer-to-peer connections */
AJ_BusSetPasswordCallback(&busAttachment, PasswordCallback);
```

##### Set up remote access to the services and publish their capabilities

```c
status = AJApp_ConnectedHandler(&busAttachment, AJAPP_MAX_INIT_ATTEPTS, AJAPP_SLEEP_TIME);
```

After the connection has been made, perform the following
steps to ensure the service frameworks function successfully
(these are encapsulated in the call `AJApp_ConnectedHandler()` shown above).

1. Initialize the individual services. Upon successful connection
to the routing node, each service must set up a dedicated
session port or register signal matching rule(s).
2. Bind the session port. This enables the creation of sessions.

   ```c
   #define APP_SERVICE_PORT 900
   AJ_BusBindSessionPort(&busAttachment, APP_SERVICE_PORT, NULL, 0);
   ```

3. Advertise the unique name of the message bus. This allows
other applications to locate and track this device.

   ```c
   AJ_BusAdvertiseName(&busAttachment, AJ_GetUniqueName(&busAttachment),
      AJ_TRANSPORT_ANY, AJ_BUS_START_ADVERTISING);
   ```

4. Initialize the About feature with the session port.
The About announcement will include the port, other metadata,
and a description of the registered bus objects that are
flagged as announced.

   ```c
   AJ_AboutInit(&busAttachment, APP_SERVICE_PORT);
   ```

##### Continue main loop

After the connection is established and the AllJoyn services
application layer is initialized, continue with main loop.
Perform the following tasks:

* Check whether request for announcement was flagged and
announce accordingly.
* Check the Wi-Fi state and trigger a reconnection if network
connection was lost.
* Continue with main loop cycling through the services to
perform incoming message processing and idle tasks execution,
including outgoing signal sending e.g. sending pending requests
for notification signals.

```c
status = AJ_AboutAnnounce(&busAttachment);
if (status == AJ_OK) {
   status = AJ_UnmarshalMsg(&busAttachment, &msg, 1000);
   isUnmarshalingSuccessful = (status == AJ_OK);

   if (status == AJ_ERR_TIMEOUT) {
      if (AJ_ERR_LINK_TIMEOUT == AJ_BusLinkStateProc(&busAttachment)) {
          status = AJ_ERR_READ; // something's not right. force disconnect
      } else { // nothing on bus, do our own thing
         AJApp_DoWork();
         continue;
      }
   }

   if (isUnmarshalingSuccessful) {
      service_Status = AJApp_MessageProcessor(&msg, &status);
      if (service_Status == SERVICE_STATUS_NOT_HANDLED) {
         //Pass to the built-in bus message handlers status = AJ_BusHandleBusMessage(&msg);
      }
      AJ_NotifyLinkActive();
   }

   //Unmarshaled messages must be closed to free resources
   AJ_CloseMsg(&msg);
}
```

##### Graceful disconnect from the AllJoyn bus and end of loop

During the message processing the connection may be lost by
external disconnection of the router or the Wi-Fi network.
This is designated by the status value AJ_ERR_READ returned
by any of the AllJoyn message handling calls in the following sections:

* [Connect to the AllJoyn bus][connect-alljoyn-bus]
* [Set up remote access to the services and publish their capabilities][set-up-remote-access]
* [Continue main loop][continue-main-loop]

Depending on the severity of an error received by the app or
the logic of the app, the application and services' business
logic must perform a graceful soft disconnect from the Wi-Fi
router. In other cases, a hard disconnect that reboots the
hardware and resets the Wi-Fi network is required. These are
indicated respectively by status values AJ_ERR_RESTART and
AJ_ERR_RESTART_APP returned by any of the AllJoyn message
handling calls in the sections listed above.

```c
if (status == AJ_ERR_READ || status == AJ_ERR_RESTART ||
    status == AJ_ERR_RESTART_APP) {
   if (isBusConnected) {
      forcedDisconnnect = (status != AJ_ERR_READ);
         rebootRequired = (status == AJ_ERR_RESTART_APP);
         AJApp_DisconnectHandler(&busAttachment, forcedDisconnect);
         AJSVC_RoutingNodeDisconnect(&busAttachment, forcedDisconnnect,
            AJAPP_SLEEP_TIME, AJAPP_SLEEP_TIME, &isBusConnected);
   if (status == AJ_ERR_RESTART_APP) { AJ_Reboot();
      }
   }
}
```

When the connection is about to be lost, perform the following
steps to ensure the services clean up any state established
with the Wi-Fi router (these are encapsulated in the call
`AJApp_DisconnectHandler()` above):

1. Stop advertising the current unique name of the message bus.

   ```c
   AJ_BusAdvertiseName(busAttachment, AJ_GetUniqueName(busAttachment),
      AJ_TRANSPORT_ANY, AJ_BUS_STOP_ADVERTISING, 0);
   ```
2. Unbind the session port.

   ```c
   AJ_BusUnbindSession(busAttachment, AJ_ABOUT_SERVICE_PORT);
   ```

3. Set the flag so that an Announcement will be sent upon
reconnect to a Wi-Fi router.

   ```c
   AJ_AboutSetShouldAnnounce();
   ```

### Create service framework handlers

The service framework handlers are service functionality that
must be called at a specific time in the main loop.

#### Connected handler

After the router is connected, and before performing the
application connected handlers, the individual registered
services connected handlers are called. Complete the steps
outlined in [Initialize the AllJoyn framework][initialize-alljoyn-framework] through
[Connect to the AllJoyn bus][connect-alljoyn-bus].


**NOTE:** This must occur before a peer has connected or a service
framework API is executed to publish information or send information.

```c
AJ_Status AJSVC_ConnectedHandler(AJ_BusAttachment* busAttachment)
{
AJ_BusSetPasswordCallback(&busAttachment, PasswordCallback);
/* Configure timeout for the link to the daemon bus */
   AJ_SetBusLinkTimeout(&busAttachment, 60); // 60 seconds AJ_Status status = AJ_OK;
do {
#ifdef CONFIG_SERVICE
   if (status == AJ_OK) {
      status = AJCFG_ConnectedHandler(busAttachment);
   }
#endif
#ifdef NOTIFICATION_SERVICE_PRODUCER
   if (status == AJ_OK) {
      status = AJNS_Producer_ConnectedHandler(busAttachment);
   }
#endif
#ifdef CONTROLPANEL_SERVICE
   if (status == AJ_OK) {
      status = AJCPS_ConnectedHandler(busAttachment);
   }
#endif
#ifdef NOTIFICATION_SERVICE_CONSUMER
   if (status == AJ_OK) {
      status = AJNS_Consumer_ConnectedHandler(busAttachment);
   }
#endif
   return status;
   } while (0);
   AJ_Printf("Service ConnectedHandler returned an error %s\n",
      (AJ_StatusText(status)));
}
```

#### Message processor

When the AllJoyn framework receives a message from the
connected message bus, it must be processed and handled.
The processing of an incoming message is performed in a
chain of common services, as well as with the application
and individual services' message processors. Each message
processor evaluates the message, delegates its handling if
relevant, and returns whether it handled the message or not.
The incoming message is returned by a call to `AJ_UnmarshalMsg()`.

```c
AJ_Message msg;
AJ_Status status = AJ_UnmarshalMsg(&busAttachment, &msg, 1000);
...
if (serviceStatus == AJSVC_SERVICE_STATUS_NOT_HANDLED) {
   serviceStatus = AJApp_MessageProcessor(&busAttachment, &msg, &status);
}
```

At the conclusion of the processing chain after calling
`AJApp_MessageProcessor()`, any unprocessed messages are
processed by the default AllJoyn message processor.

```c
if (serviceStatus == AJSVC_SERVICE_STATUS_NOT_HANDLED) {
   //Pass to the built-in bus message handlers status = AJ_BusHandleBusMessage(&msg);
}
```

##### Common services manager processor

The common services message processor handles common services'
messages that deal with session establishment and teardown.
It delegates the processed message to the relevant registered services.

```c
AJSVC_ServiceStatus AJSVC_MessageProcessorAndDispatcher(AJ_BusAttachment*
busAttachment,
   AJ_Message* msg, AJ_Status* status)
{
   AJSVC_ServiceStatus serviceStatus = AJSVC_SERVICE_STATUS_NOT_HANDLED;

   if (msg->msgId == AJ_REPLY_ID(AJ_METHOD_JOIN_SESSION))
      { // Process all incoming replies to join a session and
         pass session state change to all services uint32_t replyCode = 0;
      uint32_t sessionId = 0;
      uint8_t sessionJoined = FALSE;
      uint32_t joinSessionReplySerialNum = msg->replySerial;
      if (msg->hdr->msgType == AJ_MSG_ERROR) { AJ_AlwaysPrintf(("JoinSessionReply: AJ_METHOD_JOIN_SESSION:
AJ_ERR_FAILURE\n"));
      *status = AJ_ERR_FAILURE;
   } else {
      *status = AJ_UnmarshalArgs(msg, "uu", &replyCode, &sessionId);
      if (*status != AJ_OK) {
         AJ_AlwaysPrintf(("JoinSessionReply: failed to unmarshal\n"));
      } else {
         if (replyCode == AJ_JOINSESSION_REPLY_SUCCESS) { AJ_AlwaysPrintf(("JoinSessionReply:
AJ_JOINSESSION_REPLY_SUCCESS with sessionId=%u and replySerial=%u\n", sessionId, joinSessionReplySerialNum));
      sessionJoined = TRUE;
      } else {
         AJ_AlwaysPrintf(("JoinSessionReply: AJ_ERR_FAILURE\n"));
         *status = AJ_ERR_FAILURE;
      }
   }
}
if (sessionJoined) {
   serviceStatus = SessionJoinedHandler(busAttachment, sessionId, joinSessionReplySerialNum);
   } else {
      serviceStatus = SessionRejectedHandler(busAttachment, sessionId, joinSessionReplySerialNum, replyCode);
   }
      if (serviceStatus == AJSVC_SERVICE_STATUS_NOT_HANDLED) { AJ_ResetArgs(msg);
   }
   } else if (msg->msgId == AJ_SIGNAL_SESSION_LOST || msg->msgId == AJ_SIGNAL_SESSION_LOST_WITH_REASON) {
      // Process all incoming LeaveSession replies and lost session signals and pass session state change to all services
      uint32_t sessionId = 0;
      uint32_t reason = 0;
      if (msg->msgId == AJ_SIGNAL_SESSION_LOST_WITH_REASON) {
         *status = AJ_UnmarshalArgs(msg, "uu", &sessionId, &reason);
      } else {
         *status = AJ_UnmarshalArgs(msg, "u", &sessionId);
      }
      if (*status != AJ_OK) {
         AJ_AlwaysPrintf(("JoinSessionReply: failed to marshal\n"));
      } else {
         AJ_AlwaysPrintf(("Session lost: sessionId = %u, reason = %u\n", sessionId, reason));
         serviceStatus = SessionLostHandler(busAttachment, sessionId, reason);

         if (serviceStatus == AJSVC_SERVICE_STATUS_NOT_HANDLED) { AJ_ResetArgs(msg);
         }
      }
   } else {
#ifdef CONFIG_SERVICE
      if (serviceStatus == AJSVC_SERVICE_STATUS_NOT_HANDLED) {
         serviceStatus = AJCFG_MessageProcessor(busAttachment, msg, status);
      }
#endif
#ifdef ONBOARDING_SERVICE
      if (serviceStatus == AJSVC_SERVICE_STATUS_NOT_HANDLED) {
         serviceStatus = AJOBS_MessageProcessor(busAttachment, msg, status);
      }
#endif
#ifdef NOTIFICATION_SERVICE_PRODUCER
      if (serviceStatus == AJSVC_SERVICE_STATUS_NOT_HANDLED) {
status);
      }
      serviceStatus = AJNS_Producer_MessageProcessor(busAttachment, msg,
      }
#endif
#ifdef NOTIFICATION_SERVICE_CONSUMER
      if (serviceStatus == AJSVC_SERVICE_STATUS_NOT_HANDLED) {
         serviceStatus = AJNS_Consumer_MessageProcessor(busAttachment, msg,
status);
      }
#endif
#ifdef CONTROLPANEL_SERVICE
      if (serviceStatus == AJSVC_SERVICE_STATUS_NOT_HANDLED) {
         serviceStatus = AJCPS_MessageProcessor(busAttachment, msg, status);
      }
#endif
   }
   return serviceStatus;
}
```

##### Common (service-side) message processor

Service-side services such as the Notification service framework's
Producer, are delegated to check whether incoming requests for
joining a session is targeted at it.

```c
uint8_t AJSVC_CheckSessionAccepted(uint16_t port,
   uint32_t sessionId, char* joiner)
{
   uint8_t session_accepted = FALSE;
#ifdef NOTIFICATION_SERVICE_PRODUCER
   session_accepted |= AJNS_Producer_CheckSessionAccepted(port, sessionId, joiner);
#endif

#ifdef CONTROLPANEL_SERVICE
   session_accepted |= AJCPS_CheckSessionAccepted(port, sessionId, joiner);
#endif
   return session_accepted;
}
```

##### Common (client-side) message processor

Client-side services such as the Notification service framework's
Consumer, are delegated the replies to join session requests and
session lost signals.

```c
AJSVC_ServiceStatus
   SessionJoinedHandler(AJ_BusAttachment*
   busAttachment, uint32_t sessionId, uint32_t replySerialNum)
{
   AJSVC_ServiceStatus serviceStatus = AJSVC_SERVICE_STATUS_NOT_HANDLED;

#ifdef NOTIFICATION_SERVICE_CONSUMER
   if (serviceStatus == AJSVC_SERVICE_STATUS_NOT_HANDLED) {
      serviceStatus = AJNS_Consumer_SessionJoinedHandler(busAttachment, sessionId, replySerialNum);
   }
#endif

   return serviceStatus;
}

static AJSVC_ServiceStatus
   SessionRejectedHandler(AJ_BusAttachment*
   busAttachment, uint32_t sessionId, uint32_t replySerialNum, uint32_t replyCode)
{
   AJSVC_ServiceStatus serviceStatus = AJSVC_SERVICE_STATUS_NOT_HANDLED;

#ifdef NOTIFICATION_SERVICE_CONSUMER
   if (serviceStatus == AJSVC_SERVICE_STATUS_NOT_HANDLED) {
      serviceStatus = AJNS_Consumer_SessionRejectedHandler(busAttachment, replySerialNum, replyCode);
   }
#endif

   return serviceStatus;
}

static AJSVC_ServiceStatus
   SessionLostHandler(AJ_BusAttachment*
   busAttachment, uint32_t sessionId, uint32_t reason)
{
   AJSVC_ServiceStatus serviceStatus = AJSVC_SERVICE_STATUS_NOT_HANDLED;

#ifdef NOTIFICATION_SERVICE_CONSUMER
   if (serviceStatus == AJSVC_SERVICE_STATUS_NOT_HANDLED) {
      serviceStatus = AJNS_Consumer_SessionLostHandler(busAttachment, sessionId, reason);
   }
#endif

   return serviceStatus;
}
```

##### Common application message processors

The application message processor is responsible for delegating
any incoming message to all the relevant message processors.
`AJApp_MessageProcessor` (provided below) performs the following tasks:

1. Identifies incoming session requests and delegates the
requests to the message processors in the relevant services
via a call to `AJSVC_CheckSessionAccepted` method. See [Common services
manager processor][common-services-manager-processor].
2. Identify and handle any replies to the service initialization
requests sent in `AJSVC_ConnectedHandler` method. See [Connected handler][conneced-handler].
3. Pass any other messages to the common services' message
processor `AJSVC_MessageProcessorAndDispatcher` method which
identifies service-related messages and handles them.
See [Common (service-side) message processor][common-service-side-processor].

```c
AJSVC_ServiceStatus AJApp_MessageProcessor(AJ_BusAttachment* busAttachment,
   AJ_Message* msg, AJ_Status* status)
{
   AJSVC_ServiceStatus serviceStatus = AJSVC_SERVICE_STATUS_HANDLED;
   uint16_t port;
   char* joiner;
   uint32_t sessionId = 0;
   uint8_t session_accepted = FALSE;

   if (msg->msgId == AJ_METHOD_ACCEPT_SESSION) { // Process all
      incoming request to join a session and pass request for acceptance by all services
      *status = AJ_UnmarshalArgs(msg, "qus", &port, &sessionId, &joiner);
      if (*status != AJ_OK) {
         return serviceStatus;
      }
      session_accepted |= (port == servicePort);
      session_accepted |= AJSVC_CheckSessionAccepted(port, sessionId, joiner);
      *status = AJ_BusReplyAcceptSession(msg, session_accepted);
      AJ_AlwaysPrintf(("%s session session_id=%u joiner=%s for port %u\n", (session_accepted ?
         "Accepted" : "Rejected"), sessionId, joiner, port));
   } else {
      switch (currentServicesInitializationState) {
      case INIT_SERVICES_PORT:
         if (msg->msgId == AJ_REPLY_ID(AJ_METHOD_BIND_SESSION_PORT)) {
            currentServicesInitializationState = nextServicesInitializationState;
         }
         break;

      case INIT_ADVERTISE_NAME:
         if (msg->msgId == AJ_REPLY_ID(AJ_METHOD_ADVERTISE_NAME)) {
            currentServicesInitializationState = nextServicesInitializationState;
         }
         break;

      default:
         serviceStatus = AJSVC_MessageProcessorAndDispatcher(busAttachment, msg, status);
         break;
      }
   }

   return serviceStatus;
}
```

#### DoWork handler

When there is a connection and the message loop is idling,
the individual registered services' sample DoWork callbacks
are called to allow the service's business logic to perform
the service's sample business logic. These callbacks are implemented
in the corresponding service's sample application code.

**NOTE:** The message loop is considered idling when no messages
are ready to marshal, and the MCU will sleep to conserve
resources for a small period of time.

```c
void AJApp_DoWork(AJ_BusAttachment* busAttachment)
{
   #ifdef CONFIG_SERVICE
   Config_DoWork(busAttachment);
   #endif

   #ifdef NOTIFICATION_SERVICE_PRODUCER
   NotificationProducer_DoWork(busAttachment);
   #endif

   #ifdef NOTIFICATION_SERVICE_CONSUMER
   NotificationConsumer_DoWork(busAttachment);
   #endif

   #ifdef CONTROLPANEL_SERVICE
   Controllee_DoWork(busAttachment);
   #endif
}
```

#### Disconnect handler

When the application needs to perform a graceful disconnect
from the Wi-Fi router, the application and individual registered
services get an opportunity to relinquish their resources and
undo any registered state with the Wi-Fi router that was
established during connection or operation. The disconnect
handlers are called to allow for this cleanup work to be performed.
Complete the steps outlined in [Initialize the AllJoyn framework][initialize-alljoyn-framework]
through [Connect to the AllJoyn bus][connect-alljoyn-bus].

```c
AJ_Status AJSVC_DisconnectHandler(AJ_BusAttachment* busAttachment)
{
   #ifdef CONFIG_SERVICE
   AJCFG_DisconnectHandler(busAttachment);
   #endif

   #ifdef ONBOARDING_SERVICE
   AJOBS_DisconnectHandler(busAttachment);
   #endif

   #ifdef NOTIFICATION_SERVICE_CONSUMER
   AJNS_Consumer_DisconnectHandler(busAttachment);
   #endif

   #ifdef NOTIFICATION_SERVICE_PRODUCER
   AJNS_Producer_DisconnectHandler(busAttachment);
   #endif

   #ifdef CONTROLPANEL_SERVICE
   AJCPS_DisconnectHandler(busAttachment);
   #endif
}
```

### Implement the PropertyStore

The PropertyStore module is required by principally by the
About feature (to store the AboutData), the Configuration
service framework (to store the ConfigData), and may be used
also by other service frameworks (such as the Notification
service framework's Producer to retrieve required application
and device identifying properties). The module's API is specified
in propertyStore.h.

The About feature uses the PropertyStore to retrieve the
provisioned (default and runtime) values for the AboutData
fields listed in [AboutData fields][about-data-fields].
See the [About Interface Definition][about-interface-definition]
for more information.

#### AboutData fields

| Field name | Required | Announced | Type |
|---|---|---|---|
| `AppId` | yes | yes | `ay` |
| `DefaultLanguage` | yes | yes | `s` |
| `DeviceName` | yes | yes | `s` |
| `DeviceId` | yes | yes | `s` |
| `AppName` | yes | yes | `s` |
| `Manufacturer` | yes | yes | `s` |
| `ModelNumber` | yes | yes | `s` |
| `SupportedLanguages` | yes | no | `as` |
| `Description` | yes | no | `s` |
| `DateofManufacture` | no | no | `s` |
| `SoftwareVersion` | yes | no | `s` |
| `AJSoftwareVersion` | yes | no | `s` |
| `HardwareVersion` | no | no | `s` |
| `SupportUrl` | no | no | `s` |

The Configuration service framework uses the PropertyStore
to retrieve the provisioned (default and runtime) values
for the ConfigData and persist the values manipulated by
the Config interface listed in [Config data fields][config-data-fields].

See the [Configuration Interface Definition][config-interface-definition] for more information.

#### Config data fields

| Field name | Required | Announced | Type |
|---|---|---|---|
| `DefaultLanguage` | yes | yes | `s` |
| `DeviceName` | yes | yes | `s` |
| `MaxLength` | no | yes | `q` |

##### PropertyStore example implementation

The PropertyStore.c file in AppsCommon is an example PropertyStore
implementation that supports the requirements of the About feature
and Configuration service framework, and is included in the ServerSample code.

The PropertyStore uses the field definitions that are defined
in the PropertyStore.c file. A provisioning example is provided
in the ServerSample code and is reviewed in the following subsections.

##### Field indexes

The following enumeration is used to define the fields' indexes.
The enumeration is used as an index into the various fields' tables.

The enumerationinteger values are scoped into the following
subsets delimited by the respectively named alias counter values:

* Runtime keys (AJSVC_PROPERTY_STORE_NUMBER_OF_RUNTIME_KEYS) -
This subset contains the fields that are initialized and persisted
on first run (or after factory reset).
* Mandatory keys (AJSVC_PROPERTY_STORE_NUMBER_OF_MANDATORY_KEYS)
- This subset contains the fields that are mandatory as per the
definition of the About feature and Configuration Service Framework
in [AboutData fields][about-data-fields].
* ALL keys (AJSVC_PROPERTY_STORE_NUMBER_OF_KEYS) - This subset
contains ALL the fields.

**NOTE:** Do NOT remove the counters (AJSVC_PROPERTY_STORE_NUMBER_OF_*)
as the PropertyStore code refers to them!

```c
typedef enum _AJSVC_PropertyStoreFieldIndices {
   AJSVC_PROPERTY_STORE_ERROR_FIELD_INDEX = -1,
   //Start of keys
   AJSVC_PROPERTY_STORE_DEVICE_ID,
   AJSVC_PROPERTY_STORE_APP_ID,
   AJSVC_PROPERTY_STORE_DEVICE_NAME,
#ifndef CONFIG_SERVICE
   AJSVC_PROPERTY_STORE_NUMBER_OF_RUNTIME_KEYS,
   //End of runtime keys
   AJSVC_PROPERTY_STORE_DEFAULT_LANGUAGE = AJSVC_PROPERTY_STORE_NUMBER_OF_RUNTIME_KEYS,
   AJSVC_PROPERTY_STORE_APP_NAME,
#else AJSVC_PROPERTY_STORE_DEFAULT_LANGUAGE,
   AJSVC_PROPERTY_STORE_PASSCODE,
   AJSVC_PROPERTY_STORE_REALM_NAME,
   AJSVC_PROPERTY_STORE_NUMBER_OF_RUNTIME_KEYS,
   //End of runtime keys
   AJSVC_PROPERTY_STORE_APP_NAME = AJSVC_PROPERTY_STORE_NUMBER_OF_RUNTIME_KEYS,
#endif AJSVC_PROPERTY_STORE_DESCRIPTION,
   AJSVC_PROPERTY_STORE_MANUFACTURER,
   AJSVC_PROPERTY_STORE_MODEL_NUMBER,
   AJSVC_PROPERTY_STORE_DATE_OF_MANUFACTURE,
   AJSVC_PROPERTY_STORE_SOFTWARE_VERSION,
   AJSVC_PROPERTY_STORE_AJ_SOFTWARE_VERSION,
#ifdef CONFIG_SERVICE
   AJSVC_PROPERTY_STORE_MAX_LENGTH,
#endif
   AJSVC_PROPERTY_STORE_NUMBER_OF_MANDATORY_KEYS,
   //End of mandatory keys
   AJSVC_PROPERTY_STORE_HARDWARE_VERSION = AJSVC_PROPERTY_STORE_NUMBER_OF_MANDATORY_KEYS,
   AJSVC_PROPERTY_STORE_SUPPORT_URL,
   AJSVC_PROPERTY_STORE_NUMBER_OF_KEYS,
  //End of About keys
} AJSVC_PropertyStoreFieldIndices;
```

##### SupportedLanguages and language indexes

The following constants are used to define special language indexes.
The index is used within the supported languages' tables and the
various fields' tables.

```c
#define AJSVC_PROPERTY_STORE_ERROR_LANGUAGE_INDEX	-1
#define AJSVC_PROPERTY_STORE_NO_LANGUAGE_INDEX	0
```

The following definitions and structures in PropertyStoreOEMProvisioning.h
are needed by the sample application in order to provision for
the sample PropertyStore implementation.

```c
extern const uint8_t AJSVC_PROPERTY_STORE_NUMBER_OF_LANGUAGES;
extern const char** propertyStoreDefaultLanguages;
#define LANG_VALUE_LENGTH 7
```

The language names are provisioned in the ServerSample's ServerSample.c
as English and Austrian dialect of German.

```c
static const char DEFAULT_LANGUAGE[] = "en";
static const char* DEFAULT_LANGUAGES[] = { DEFAULT_LANGUAGE };
static const char SUPPORTED_LANG2[] = "de-AT";
static const char* SUPPORTED_LANGUAGES[] = { DEFAULT_LANGUAGE, SUPPORTED_LANG2
};
const char** propertyStoreDefaultLanguages = SUPPORTED_LANGUAGES;
const uint8_t AJSVC_PROPERTY_STORE_NUMBER_OF_LANGUAGES = sizeof(SUPPORTED_LANGUAGES) / sizeof(char*);
```

**NOTE:** The language names are according to the IETF language
tags specified by RFC 5646. The example implementation supports
only simple languages and extended languages or variant sub-tags
(regional) languages. Hence, `LANG_NAME_LEN` is defined as 7.

##### Field definition structure

The following bit field structure is used to define the
behavior of each field with respect to its exposure to
remote clients various calls.

```c
typedef struct _PropertyStoreEntry {	const char* keyName;
   // The property key name as shown in About and Config documentation
   // msb=public/private; bit number 3 - initialise once;
   bit number 2 - multi-language value; bit number 1 - announce;
   bit number 0 - read/write uint8_t mode0Write : 1; uint8_t mode1Announce : 1; uint8_t mode2MultiLng : 1;
   uint8_t mode3Init : 1;
   uint8_t mode4 : 1;
   uint8_t mode5 : 1;
   uint8_t mode6 : 1;
   uint8_t mode7Public : 1;
} PropertyStoreEntry;
```

##### Field definitions

The following bit field structure is used to define the
behavior of each field with respect to its exposure to
remote clients various calls.

```c
extern const PropertyStoreEntry propertyStoreProperties[AJSVC_PROPERTY_STORE_NUMBER_OF_KEYS];
const PropertyStoreEntry propertyStoreProperties[AJSVC_PROPERTY_STORE_NUMBER_OF_KEYS] =
{
// { "Key Name	", W, A, M, I .. . . ., P },
   { "DeviceId",	0, 1, 0, 1, 0, 0, 0, 1 },
   { "AppId",	0, 1, 0, 1, 0, 0, 0, 1 },
#ifndef CONFIG_SERVICE
   { "DeviceName",	0, 1, 0, 1, 0, 0, 0, 1 },
#else
   { "DeviceName",
#endif
// Add other persisted keys above this line
#ifndef CONFIG_SERVICE
   { "DefaultLanguage",	0, 1, 0, 0, 0, 0, 0, 1 },
#else
   { "DefaultLanguage",
#endif
#ifdef CONFIG_SERVICE
   { "Passcode",	1, 0, 0, 0, 0, 0, 0, 0 },
   { "RealmName",	1, 0, 0, 0, 0, 0, 0, 0 },
#endif
// Add other configurable keys above this line
   { "AppName",	0, 1, 0, 0, 0, 0, 0, 1 },
   { "Description",	0, 0, 1, 0, 0, 0, 0, 1 },
   { "Manufacturer",	0, 1, 1, 0, 0, 0, 0, 1 },
   { "ModelNumber",	0, 1, 0, 0, 0, 0, 0, 1 },
   { "DateOfManufacture",	0, 0, 0, 0, 0, 0, 0, 1 },
   { "SoftwareVersion",	0, 0, 0, 0, 0, 0, 0, 1 },
   { "AJSoftwareVersion",	0, 0, 0, 0, 0, 0, 0, 1 },
#ifdef CONFIG_SERVICE
   { "MaxLength",	0, 0, 1, 0, 0, 0, 0, 1 },
#endif
// Add other mandatory about keys above this line
   { "HardwareVersion",	0, 0, 0, 0, 0,	0, 0,	1	},
   { "SupportUrl",	0, 0, 1, 0, 0,	0, 0,	1	},
// Add other optional about keys above this line
};
```

##### Field default values

The following array is used to provision the fields' default values:

```c
extern const char** propertyStoreDefaultValues[AJSVC_PROPERTY_STORE_NUMBER_OF_KEYS];
// Array of Array of size 1 or AJSVC_PROPERTY_STORE_NUMBER_OF_LANGUAGES
   constant buffers depending on whether the property is multilingual
```

The following array is a snippet of code for provisioning for the
Configuration service framework based on the ServerSample's ServerSample.c file:

```c
#ifdef CONFIG_SERVICE
static const char* DEFAULT_PASSCODES[] = { "303030303030" };
// HEX encoded { '0', '0', '0', '0', '0', '0' }
#endif
static const char* DEFAULT_APP_NAMES[] = { "Configuree" };
static const char DEFAULT_DESCRIPTION_LANG1[] = "AC IOE device";
static const char DEFAULT_DESCRIPTION_LANG2[] = "Mein erstes IOE Geraet";
static const char* DEFAULT_DESCRIPTIONS[] = { DEFAULT_DESCRIPTION_LANG1, DEFAULT_DESCRIPTION_LANG2 };
static const char DEFAULT_MANUFACTURER_LANG1[] = "Company A(EN)";
static const char DEFAULT_MANUFACTURER_LANG2[] = "Firma A(DE-AT)";
static const char* DEFAULT_MANUFACTURERS[] = { DEFAULT_MANUFACTURER_LANG1, DEFAULT_MANUFACTURER_LANG2 };
static const char* DEFAULT_DEVICE_MODELS[] = { "0.0.1" };
static const char* DEFAULT_DATE_OF_MANUFACTURES[] = { "2014-02-01" };
static const char* DEFAULT_SOFTWARE_VERSIONS[] = { "0.0.1" };
static const char* DEFAULT_HARDWARE_VERSIONS[] = { "0.0.1" };
static const char DEFAULT_SUPPORT_URL_LANG1[] = "www.company_a.com";
static const char DEFAULT_SUPPORT_URL_LANG2[] = "www.company_a.com/de-AT";
static const char* DEFAULT_SUPPORT_URLS[] = { DEFAULT_SUPPORT_URL_LANG1, DEFAULT_SUPPORT_URL_LANG2 };

const char** propertyStoreDefaultValues[AJSVC_PROPERTY_STORE_NUMBER_OF_KEYS] =
{
// "Default Values per language",	 "Key Name"
   NULL,	/*DeviceId*/
   NULL,	/*AppId*/
   NULL,	/*DeviceName*/
// Add other persisted keys above this line
   DEFAULT_LANGUAGES,	/*DefaultLanguage*/
#ifdef CONFIG_SERVICE
   DEFAULT_PASSCODES,	/*Passcode*/ NULL,	/*RealmName*/
#endif
// Add other configurable keys above this line
   DEFAULT_APP_NAMES,	         /*AppName*/
   DEFAULT_DESCRIPTIONS,	 /*Description*/
   DEFAULT_MANUFACTURERS,	 /*Manufacturer*/
   DEFAULT_DEVICE_MODELS,	 /*ModelNumber*/
   DEFAULT_DATE_OF_MANUFACTURES, /*DateOfManufacture*/
   DEFAULT_SOFTWARE_VERSIONS,	 /*SoftwareVersion*/
   NULL,	                 /*AJSoftwareVersion*/
#ifdef CONFIG_SERVICE
   NULL,	                 /*MaxLength*/
#endif
// Add other mandatory about keys above this line
   DEFAULT_HARDWARE_VERSIONS,	 /*HardwareVersion*/
   DEFAULT_SUPPORT_URLS,	 /*SupportUrl*/
// Add other optional about keys above this line
};
```

##### Field runtime values and persistence

The following structure is used to store runtime-provisioned
value or remotely modified value.

```c
typedef struct _PropertyStoreRuntimeEntry {
   char** value;	// An array of size 1 or
AJSVC_PROPERTY_STORE_NUMBER_OF_LANGUAGES mutable buffers
depending on whether the property is multilingual
   uint8_t size; // The size of the value buffer(s)
} PropertyStoreConfigEntry;
```

The various length constants are appropriately set for each
field in order to optimize memory usage.

```c
#define LANG_VALUE_LENGTH 7
#define KEY_VALUE_LENGTH 10
#define MACHINE_ID_LENGTH (UUID_LENGTH * 2)
#define DEVICE_NAME_VALUE_LENGTH 32
#ifdef CONFIG_SERVICE
#define PASSWORD_VALUE_LENGTH (AJ_ADHOC_LEN * 2)
#endif
```

The following array is used to maintain the runtime Config
fields' modified values and is implemented as part of PropertyStore.c file.

```c
extern PropertyStoreConfigEntry propertyStoreRuntimeValues[AJSVC_PROPERTY_STORE_NUMBER_OF_RUNTIME_KEYS]
```

The following array is a snippet of code for provisioning
for the Configuration service framework based on the ServerSample's
ServerSample.c file:

```c
static char machineIdVar[MACHINE_ID_LENGTH + 1] = { 0 };
static char* machineIdVars[] = { machineIdVar };
static char deviceNameVar[DEVICE_NAME_VALUE_LENGTH + 1] = { 0 };
static char* deviceNameVars[] = { deviceNameVar };
static char defaultLanguageVar[LANG_VALUE_LENGTH + 1] = { 0 };
static char* defaultLanguageVars[] = { defaultLanguageVar };
#ifdef CONFIG_SERVICE
static char passcodeVar[PASSWORD_VALUE_LENGTH + 1] = { 0 };
static char* passcodeVars[] = { passcodeVar };
static char realmNameVar[KEY_VALUE_LENGTH + 1] = { 0 };
static char* realmNameVars[] = { realmNameVar };
#endif

PropertyStoreConfigEntry PropertyStoreRuntimeValues[AJSVC_PROPERTY_STORE_NUMBER_OF_RUNTIME_KEYS] =
{
// {"Buffers for Values per language", "Buffer Size"},	"Key Name"
   { machineIdVars,	MACHINE_ID_LENGTH + 1 },	 /*DeviceId*/
   { machineIdVars,	MACHINE_ID_LENGTH + 1 },	 /*AppId*/
   { deviceNameVars,	DEVICE_NAME_VALUE_LENGTH + 1 },  /*DeviceName*/
// Add other persisted keys above this line
   { defaultLanguageVars,	LANG_VALUE_LENGTH + 1 }, /*DefaultLanguage*/
#ifdef CONFIG_SERVICE
   { passcodeVars,	PASSWORD_VALUE_LENGTH + 1 },	/*Passcode*/
   { realmNameVars,	KEY_VALUE_LENGTH + 1 },	        /*RealmName*/
#endif
```

**NOTE:** The size entry needs to match the actual allocation
buffer length that is provisioned for each field. Refer to
PropertyStore.c `PropertyStore_Init()` and `InitMandatoryPropertiesInRAM()`
for an example runtime initialization of the persisted fields.

If the value of a Config field (such as DeviceName) was modified,
it is stored in the array under the relevant language.

If `ResetConfigurations()` for this field (for some given language)
or a `globalFactoryReset()` has been remotely called, the value
(for the given language) will be reset to an empty string.

In order to conserve memory a single shared buffer machineIdVars
is used for both the AppId and DeviceId fields.

##### Implementation and provisioning information

The bit field values in the example are an implementation of
the About feature and Configuration service framework per the
[About Interface Definition][about-interface-definition] and
[Configuration Interface Definition][config-interface-definition].
You should not require any change in these and only alter
the String values of the fields. You may of course remove
optional fields such as DateOfManufacture.

Depending on the `AJSVC_PROPERTY_STORE_NUMBER_OF_LANGUAGES`
you've provisioned, this structure must be populated with as
many default values. Use NULL for non-provisioned values such
as when the field is non-language dependent (e.g., DeviceName).

When provisioning a non-language dependent field, the first
value (at index `AJSVC_PROPERTY_STORE_NO_LANGUAGE_INDEX`) is
used and all other values are ignored, yet must be initialized.

##### Adding custom field definition and values

Complete the following steps to add your own custom fields.

1. Decide to which subset the field belongs and add it to the enumeration
`AJSVC_PropertyStoreFieldIndices` accordingly.
2. Add a new field entry at the respective index to the propertyStoreProperties.
3. Decide whether the field is publicly accessible from
remote clients. If the field is public, set the `mode7Public` bit to 1.
4. Decide whether the field is to be allowed to be configured
remotely through the Configuration service framework. If the
field is updateable, then set the `mode0Write` bit to 1.
   **NOTE:** If you set this bit, the field's index must be included
   in the Persisted or Config keys subsets.
5. Decide whether the field is to be includedin the Announcement.
If the field is announced, then set the `mode1Announce` bit to 1.
  **NOTE:** It is recommended to limit the inclusion of a field in
  the Announcement according to its immediate relevance to the
  relevant service framework's discovery. Only the value associated
  with the currentDefaultLanguage will be sent in the Announcement.
6. Decide whether the field is multi-language and add the relevant
values for the provisioned languages. If the field is multi-language,
then set the `mode2MultiLng` bit to
1.
7. Decide whether the field is to be provisioned dynamically
in code and persisted during first-time (or post-factory reset)
device startup. If the field is to be initialized once, then
set the `mode3Init` bit to 1 and add the relevant code to initialize it.

   Refer to PropertyStore.c `PropertyStore_Init()` and
   `InitMandatoryPropertiesInRAM()` for an example setup
   for the DeviceId and AppId fields.

  **NOTE:** If you set this bit, the field's index must be
  included in the Persisted keys subsets.
8. Add relevant validation of updated value for your custom
key by modifying the default implementation of `IsValueValid()`
in ConfigSample.c file.
   ```c
   uint8_t IsValueValid(const char* key, const char* value) {return TRUE;}
   ```
9. Add entry in corresponding index of `propertyStoreDefaultValues`
to provision default value(s).
10. Add entry in corresponding index of `propertyStoreRuntimeValues`
to provision for runtime value(s) buffer(s).

**NOTE:** The example implementation of PropertyStore supports
properties with value of type String ('s') only. If your
property must be of a different type, you must provision the
default value as a String and perform the relevant de/serialization
on the client side.

The following shows an example of how to add a configurable
proprietary property named "MyProperty" that has a language-dependent value.
* Add index MyProperty to `AJSVC_PropertyStoreFieldIndices`:

  ```c
  MyProperty, AJSVC_PROPERTY_STORE_NUMBER_OF_RUNTIME_KEYS,
  ```

* Add a new entry to the `propertyStoreProperties` array in
the index which corresponds to the enumeration value defined above:

  ```c
  //{ "Key Name	", W, A, M, I .. . . ., P },
  { "MyProperty",	1, 0, 1, 0, 0, 0, 0, 1 },
  // Add other configurable keys above this line
  ```

* Add a new entry to the `propertyStoreDefaultValues` array
in the index which corresponds to the enumeration value defined above:

  ```c
  static const char DEFAULT_MYPROPERTY_LANG1[] = "My";
  static const char DEFAULT_MYPROPERTY_LANG2[] = "Mein";
  static const char* DEFAULT_MYPROPERTIES[] =
  { DEFAULT_ MYPROPERTY_LANG1, DEFAULT_ MYPROPERTY_LANG2 };
  ...
  DEFAULT_MYPROPERTIES,	/*MyProperty*/
  // Add other configurable keys above this line
  ```

### Implement remote callbacks

Callbacks are provided by the service frameworks to allow for
the application writer to react to various remotely initiated
calls and events. In particular, the Configuration service
framework has callbacks that allow for the application writer
to react to remote initiated events and the Controlee part
of the Control Panel service framework has callbacks that allow
for the application writer to write the business logic for the ControlPanel model.

See the [Configuration API Guide][config-api-guide-thin-library] and the
[Control Panel API Guide][controlpanel-api-guide-thin-library], respectively, for more information.

### Integrate the Configuration service framework with an
application's AuthListener (optional)

The Configuration service framework and other AllJoyn service
framework interface methods and signals require a secure
AllJoyn connection. The application writer may choose to use
an ALLJOYN_ECDHE_PSK authentication mechanism in its AuthListener implementation.

The Configuration service framework enables remote setting
of a password that can be used as the secret for a key exchange
authentication mechanism. An example implementation that uses
this facility is included in the sample server application in
the ServicesHandlers.c file as shown below.

```c
uint32_t PasswordCallback(uint8_t* buffer, uint32_t bufLen)
{
   AJ_Status status = AJ_OK;
   const char* hexPassword;
   size_t hexPasswordLen;
   uint32_t len = 0;

   hexPassword = AJSVC_PropertyStore_GetValue(AJSVC_PROPERTY_STORE_PASSCODE);
   if (hexPassword == NULL) {
      AJ_ErrPrintf(("Password is NULL!\n"));
      return len;
   }
   AJ_InfoPrintf(("Retrieved password=%s\n", hexPassword));
   hexPasswordLen = strlen(hexPassword);
   len = hexPasswordLen / 2;
   status = AJ_HexToRaw(hexPassword, hexPasswordLen, buffer, bufLen);
   if (status == AJ_ERR_RESOURCES) {
      len = 0;
   }

   return len;
}
```

The above implementation calls AJSVC_PropertyStore_GetValue (`AJSVC_PROPERTY_STORE_PASSCODE`)
to retrieve the current password. This implementation relies on an
extension in the sample implementation of the PropertyStore which
was extended with the Passcode field defined in the
`AJSVC_PropertyStoreFieldIndices` enumeration. The field is remotely
updateable via a Configuration service framework session using the
dedicated `SetPasscode()` method. The stored Passcode is limited
to the size of 65, allowing for 64 characters long secret:

```c
#define PASSWORD_VALUE_LENGTH 65
```

This is achieved using the field definition that masks the
field as writable yet private, as shown in the `propertyStoreProperties`
initialization in PropertyStore.c:

```c
{"Passcode", 1, 0, 0, 0, 0, 0, 0, 0 }
```

The default value is provisioned in ServerSample.c as follows:

```
// HEX encoded { '0', '0', '0', '0', '0', '0' }
static const char* DEFAULT_PASSCODES[] = { "303030303030" };
```

and added to `propertyStoreDefaultValues`.

```c
DEFAULT_PASSCODES,
/*Passcode*/
```

Since the Passcode enumeration value is less than `AJSVC_PROPERTY_STORE_NUMBER_OF_RUNTIME_KEYS`,
it is also considered part of the `propertyStoreRuntimeValues`;
its modified value is persisted.

Also, when `SetPasscode()` is called remotely, the `SetPasscode()`
callback is invoked with the following example implementation in
ConfigSample.c file as shown below:

```c
static AJ_Status SetPasscode(const char* daemonRealm, const uint8_t* newPasscode, uint8_t newPasscodeLen)
{
   AJ_Status status = AJ_OK;

   char newStringPasscode[PASSWORD_VALUE_LENGTH + 1];
   status = AJ_RawToHex(newPasscode, newPasscodeLen, newStringPasscode, sizeof(newStringPasscode), FALSE);
   if (status != AJ_OK) {
      return status;
   }
   if (AJSVC_PropertyStore_SetValue(AJSVC_PROPERTY_STORE_REALM_NAME, daemonRealm)
&& AJSVC_PropertyStore_SetValue(AJSVC_PROPERTY_STORE_PASSCODE, newStringPasscode))
{

      status = AJSVC_PropertyStore_SaveAll();
      if (status != AJ_OK) {
         return status;
      }
      AJ_ClearCredentials();
      status = AJ_ERR_READ;	//Force disconnect of AJ and services to refresh current sessions
   } else {

      status = AJSVC_PropertyStore_LoadAll();
      if (status != AJ_OK) {
         return status;
      }
   }

   return status;
}
```

The above implementation stores the passcode as part of the
PropertyStore persistence:

1. It calls `AJSVC_PropertyStore_SetValue(Passcode, newStringPasscode)`
to set the value in RAM.
2. If successful, it also calls `AJSVC_PropertyStore_SaveAll()`
to persist to NVRAM.
3. Finally, `AJ_ClearCredentials()` is called to revoke all
current keys based on the old passcode.

**NOTES**
* The stored passcode is HEX and is limited to the size of 32,
allowing for 16 bytes long secret:

  ```c
  #define PASSWORD_VALUE_LENGTH (AJ_ADHOC_LEN * 2)
  ```
* The default value for the Passcode field is provisioned as
'303030303030' (the HEX encoded string value for the byte array
{ '0', '0', '0', '0', '0', '0' }) as per the requirement outlined
in the [Configuration Interface Definition][config-interface-definition].
* The realm name is similarly persisted alongside the passcode
by adding the RealmName field index to the `AJSVC_PropertyStoreFieldIndices`
enumeration and provisioning for it in `propertyStoreDefaultValues`
and `propertyStoreRuntimeValues` initialization.

## Compile the Thin Library Application

This process, including the directory and file layout,
toolchains, and procedures varies depending on the host and
target platforms involved, and which AllJoyn service frameworks are being used.

Refer to the target platform documentation that contains
instructions on how to organize and set up the build process
to incorporate the necessary files to compile your Thin Library application.


[about-api-guide-thin-library]: /develop/api-guide/about/c-thin
[about-api-guides]: /develop/api-guide/about
[connect-alljoyn-bus]: #connect-alljoyn-bus
[set-up-remote-access]: #set-up-remote-access
[continue-main-loop]: #continue-main-loop
[initialize-alljoyn-framework]: #initialize-alljoyn-framework
[connect-alljoyn-bus]: #connect-alljoyn-bus
[common-services-manager-processor]: #common-services-manager-processor
[conneced-handler]: #conneced-handler
[common-service-side-processor]: #common-service-side-processor
[about-interface-definition]: /learn/core/about-announcement/interface
[about-data-fields]: #about-data-fields
[config-data-fields]: #config-data-fields
[config-interface-definition]: /learn/base-services/configuration/interface
[config-api-guide-thin-library]: /develop/api-guide/config/c-thin
[controlpanel-api-guide-thin-library]: /develop/api-guide/controlpanel/c-thin
