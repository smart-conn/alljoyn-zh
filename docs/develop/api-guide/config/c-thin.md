# Configuration API Guide - C (Thin Core)

## Obtain the Configuration service framework

The source code for this service framework can be found on
the [AllSeen Alliance gerrit page](https://git.allseenalliance.org/cgit/) as a
git project. In addition, the [ajtcl](https://git.allseenalliance.org/cgit/core/ajtcl.git/) project
is needed to compile this service framework.

If the target platform already supports the AllJoyn&trade;
Thin Library framework, follow the target platform documentation
for detailed setup and download instructions.

If the target platform does not support the AllJoyn Thin
Library framework, porting work is required to support this
target. See the [Introduction to AllJoyn Thin Library][intro-thin-library] for
more information about the AllJoyn Thin Library framework.

## Reference code

The reference code consists of a module implementing the
Config Server layer to provide remote access of ConfigData
and device simple control. It also has a ConfigService-specific
sample code for integrating with the ServerSample application code.

### Config Server modules

| Server module | Description |
|---|---|
| ConfigSample | This module is responsible for the general flow of the Config sample application including initialization, shutdown of the ConfigService module, and performing any ConfigService-related business logic when the application's message loop is idling.|
| ConfigService | Config service core code. Implements the BusObjects and exposes the developer's API.|
| PropertyStore | PropertyStore sample implementation code. This supports all core services. This module is part of the AppsCommon. |
| ApplicationProvisioning | Application provisioning code for all services. This module is part of the sample application ServerSample or ACServerSample. |

## Build a Config Server

The following steps provide the high-level process to build a Config Server.

1. Create the base for the AllJoyn application. See the [Build an
Application using the Thin Library section][build-app-thin-library]
for instructions.
2. Implement the PropertyStore and provision its values.
3. Implement the remote callbacks.
4. (Optional) Integrate with the AuthListener's PasswordCallback
to provide a remotely modifiable passcode based ALLJOYN_ECDHE_PSK
secure connection.

## Implementing the Config Server

### Create the base for the AllJoyn application

See the [Build an Application using the Thin Library section][build-app-thin-library]
for instructions.

### Provision the PropertyStore for the Configuration service framework

A PropertyStore structure is required by the ConfigService
to store the provisioned values for the Config interface data
fields listed below. See the [Configuration Interface Definition][config-interface-definition] for more information.

#### Config interface data fields

| Field name | Required | Announced | Type |
|---|---|---|---|
| `DefaultLanguage` | yes | yes | `s` |
| `DeviceName` | yes | yes | `s` |  

#### PropertyStore implementation

The PropertyStore code is an example PropertyStore implementation
that supports the requirements of ConfigService and is included
in the AppsCommon code.

The PropertyStore uses the provisioning structures that are
defined in the PropertyStoreOEMProvisioning.h file in the AppsCommon.
A provisioning example is provided in the ServerSample code and
is explained in the [Build an Application using the Thin Library section][build-app-thin-library].

#### Adding custom field definition and values

Complete the following steps to add your own custom fields.

1. Decide to which subset the field belongs and add it to
the enumeration `AJSVC_PropertyStoreFieldIndices` accordingly.
2. Add a new field entry at the respective index to the
propertyStoreProperties.
3. Decide whether the field is publicly accessible from remote
clients. If the field is public then set the `mode7Public` bit to 1.
4. Decide whether the field is to be allowed to be configured
remotely through the Configuration service framework. If the
field is updateable, then set the `mode0Write` bit to 1.
   **NOTE:** If you set this bit, the field's index must be
   included in the Persisted or Config keys subsets.
5. Decide whether the field is to be included in the Announcement.
If the field is announced then set the `mode1Announce` bit to 1.
   **NOTE:** It is recommended to limit the inclusion of a field
   in the Announcement according to its immediate relevance to
   the relevant service framework's discovery. Only the value
   associated with the currentDefaultLanguage will be sent
   in the Announcement.
6. Decide whether the field is multi-language and add the
relevant values for the provisioned languages. If the field
is multi-language then set the `mode2MultiLng bit` to 1.
7. Decide whether the field is to be provisioned dynamically
in code and persisted during first-time (or post-factory reset)
device startup. If the field is to be initialized once, then
set the `mode3Init` bit to 1 and add the relevant code to initialize it.

   Refer to PropertyStore.c `PropertyStore_Init()` and
   `InitMandatoryPropertiesInRAM()` for an example setup for the
   DeviceId and AppId fields.

   **NOTE:** If you set this bit, the field's index must be included
   in the Persisted keys subsets.

8. Add relevant validation of updated value for your custom key
by modifying the default implementation of `IsValueValid()` in
ConfigSample.c file.

   ```c
   uint8_t IsValueValid(const char* key, const char* value) {return TRUE;}
   ```

9. Add entry in corresponding index of propertyStoreDefaultValues
to provision default value(s).
10. Add entry in corresponding index of propertyStoreRuntimeValues
to provision for runtime value(s) buffer(s).

**NOTE:** The example implementation of PropertyStore supports
properties with value of type String ('s') only. If your property
must be of a different type, you must provision the default value
as a String and perform the relevant de/serialization on the client side.

### Implement remote callbacks

The Configuration service framework has the following callbacks
that allow for the application writer to react to remote initiated
events and updating of configurable values. The prototype of
these are defined in ConfigService.h .

* Restart-Restart the device or at least its Wi-Fi driver.
* FactoryReset-Clear persistent values and restore any factory
defaults. Optionally, the application developer can mandate a
power cycle of the device as well.
* SetPasscode-Persist new device passcode and revoke encryption
keys generated from the previous passcode. Optionally, restart
the device as well to cause current sessions to be re-established.
* IsValueValid-Validate a given value for a key and a specific language.

The ServerSample code provides the following in the ConfigSample module:

* Required callbacks defined in ConfigService.h and provided
to the service framework in the call to `AJCFG_Start()`.
* Example implementation of these callbacks in the ConfigSample.c file.

### Start the Config server

The Config server is required to be passed the provisioning
by the application via a call to `AJCFG_Start()`.

An example is in `Config_Init()` of ConfigSample.c:

```c
/**
* Actions to perform when factory reset is requested.
*/
static AJ_Status FactoryReset() {...}
/**
* Actions to perform when a device restart is requested.
*/
static AJ_Status Restart() {...}
/**
* Actions to perform when a new device passcode is set.
*/
static AJ_Status SetPasscode(const char* daemonRealm, const uint8_t*
newPasscode, uint8_t newPasscodeLen) {...}
/**
* Check whether the given value is valid for the given key.
*/
static uint8_t IsValueValid(const char* key, const char* value) {...}

AJ_Status Config_Init()
{
AJ_Status status = AJCFG_Start(&FactoryReset, &Restart, &SetPasscode,
&IsValueValid);
return status;
}
```

### Integrate the Configuration service framework with an application's AuthListener

The Configuration service framework and other AllJoyn service
framework interface methods and signals require a secure AllJoyn
connection. The application writer may choose to use an ALLJOYN_ECDHE_PSK
authentication mechanism in its AuthListener implementation.
The Configuration service framework enables remote setting
of a password that can be used as the secret for a key exchange
authentication mechanism. An example implementation that uses
this facility is included in the sample server application
in the Services_Handlers.c file as shown below.

```c
uint32_t PasswordCallback(uint8_t* buffer, uint32_t bufLen)
{
   AJ_Status status = AJ_OK;
   const char* hexPassword;
   size_t hexPasswordLen;
   uint32_t len = 0;

   hexPassword = AJSVC_PropertyStore_GetValue(AJSVC_PROPERTY_STORE_PASSCODE);
   if (hexPassword == NULL) { AJ_ErrPrintf(("Password is NULL!\n")); return len;
   }
   AJ_InfoPrintf(("Retrieved password=%s\n", hexPassword));
   hexPasswordLen = strlen(hexPassword);
   len = hexPasswordLen / 2;
   status = AJ_HexToRaw(hexPassword, hexPasswordLen, buffer, bufLen);
   if (status == AJ_ERR_RESOURCES) {
   len = 0;
   }
```

The above implementation calls AJSVC_PropertyStore_GetValue
(`AJSVC_PROPERTY_STORE_PASSCODE`) to retrieve the current password.
This implementation relies on an extension in the sample
implementation of the PropertyStore which was extended with
the Passcode field defined in the `AJSCV_PropertyStoreFieldIndices`
enumeration. The field is remotely updateable via a Configuration
service framework session using the dedicated `SetPasscode()` method.
The stored Passcode is limited to the size of
65 allowing for 64 characters long secret:

```c
#define PASSWORD_VALUE_LENGTH 65
```

This is achieved using the field definition that masks the
field as writable yet private, as shown in the propertyStoreProperties
initialization in PropertyStore.c:

```c
{ "Passcode",	1, 0, 0, 0, 0, 0, 0, 0 }
```

The default value is provisioned in ServerSample.c as follows:

```c
static const char* DEFAULT_PASSCODES[] = { "303030303030" };
// HEX encoded { '0', '0', '0', '0', '0', '0' }
```

and added to propertyStoreDefaultValues.

```c
DEFAULT_PASSCODES,	/*Passcode*/
```

Since the Passcode enumeration value is less than `AJSVC_PROPERTY_STORE_NUMBER_OF_RUNTIME_KEYS`,
it is also considered part of the `propertyStoreRuntimeValues`;
its modified value is persisted.

Also, when `SetPasscode()` is called remotely, the `SetPasscode()`
callback is invoked with the example implementation in ConfigSample.c file shown below:

```c
static AJ_Status SetPasscode(const char* daemonRealm,
   const uint8_t* newPasscode, uint8_t newPasscodeLen)
{
   AJ_Status status = AJ_OK;

   char newStringPasscode[PASSWORD_VALUE_LENGTH + 1];
   status = AJ_RawToHex(newPasscode, newPasscodeLen, newStringPasscode,
      sizeof(newStringPasscode), FALSE);
   if (status != AJ_OK) {
      return status;
   }
   if (AJSVC_PropertyStore_SetValue(AJSVC_PROPERTY_STORE_REALM_NAME,
      daemonRealm) && AJSVC_PropertyStore_SetValue(AJSVC_PROPERTY_STORE_PASSCODE,
      newStringPasscode)) {

      status = AJSVC_PropertyStore_SaveAll();
      if (status != AJ_OK) {
         return status;
      }
      AJ_ClearCredentials();
      status = AJ_ERR_READ;	//Force disconnect of AJ and services
         to refresh current sessions
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

1. It calls `AJSVC_ PropertyStore_SetValue(Passcode,
newStringPasscode)` to set the value in RAM.
2. If successful, it also calls `AJSVC_ PropertyStore_SaveAll()`
to persist to NVRAM.
3. Finally, `AJ_ClearCredentials()` is called to revoke all
current keys based on the old passcode.

**NOTES**

* The stored passcode is HEX and is limited to the size
of 32, allowing for 16 bytes long secret:

```
#define PASSWORD_VALUE_LENGTH (AJ_ADHOC_LEN * 2)
```

* The default value for the Passcode field is provisioned as
'303030303030' (the HEX encoded string value for the byte array
{ '0', '0', '0', '0', '0', '0'}) as per the requirement outlined
in the [Configuration Interface Definition][config-interface-definition.
* The realm name is similarly persisted alongside the passcode
by adding the RealmNamefield index to the `AJSVC_PropertyStoreFieldIndices`
enumeration and provisioning for it in `propertyStoreDefaultValues`
and `propertyStoreRuntimeValues` initialization.

### Compile the code

The process to compile varies depending on the host and
target platform. Each host and platform needs may require
a specific directory and file layout, build toolchains,
procedures, and supported AllJoyn service frameworks. Refer
to the target platform documentation that contains instructions
on how to organize and set up the build process to incorporate
the necessary files to compile your Thin Library application.

For more details on how to combine this AllJoyn service
framework with other AllJoyn service framework software,
see the [Build an Application using the Thin Library section][build-app-thin-library].

[intro-thin-library]: /learn/core/thin-core
[build-app-thin-library]: /develop/tutorial/thin-app
[config-interface-definition]: /learn/base-services/configuration/interface
