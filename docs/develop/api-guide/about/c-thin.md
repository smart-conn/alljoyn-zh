# About API Guide - C (Thin Core)

## Obtain the About feature

The source code for this feature can be found on the [AllSeen
Alliance gerrit page](https://git.allseenalliance.org/cgit/)
as a git project. In addition, the [ajtcl](https://git.allseenalliance.org/cgit/core/ajtcl.git/)
project is needed to compile this feature.

If the target platform already supports the AllJoyn&trade;
Thin Library framework, refer to the target platform documentation
for detailed setup and download instructions.

If the target platform does not support the AllJoyn Thin
Library framework, porting work is required to support this
target. See the [Introduction to AllJoyn Thin Library][intro-thin-library]
for more information about the AllJoyn Thin Library framework.

## Reference code

The reference code consists of a module implementing the
About Server layer that allows for Announcements to be
composed and sent, and provides remote access to AboutData.
It also has an AboutService-specific sample code for integrating
with the ServerSample application code.

### About feature modules

| Module | Description |
|---|---|
| AboutIcon | AboutIcon code |
| AboutSample | This module is responsible for the general flow of the About sample application including initialization and shutdown of the AboutService and AboutIcon modules, and performing any AboutService and AboutIcon-related business logic when the application's message loop is idling.|
| AboutService | About feature code |
| ApplicationProvisioning | Application provisioning code for all services. This module is part of the ServerSample. |
| PropertyStore | PropertyStore implementation code. This supports all core services. This module is part of the AppsCommon. |

## Build an About Server

The following steps provide the high-level process to build an
About Server. See the [Build an Application using the
Thin Library section][build-app-thin-library] for instructions.

1. Create the base for the AllJoyn application.
2. Implement the PropertyStore and provision its values.

## Implementing an About Server

### Create the base for the AllJoyn application

See the [Build an Application using the Thin Library section]
[build-app-thin-library] for instructions.

### Provision the PropertyStore for the About feature

A PropertyStore structure is required by the AboutService to
store the provisioned values for the data fields listed in
[AboutData fields][about-data-fields]. See the [About Interface Definition]
[about-interface-definition] for more information.

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

#### PropertyStore implementation

The code in PropertyStore.c file is an example PropertyStore
implementation that supports the requirements of the
AboutService and is included as part of the ServerSample code.
The PropertyStore uses the provisioning structures that are
defined in the PropertyStoreOEMProvisioning.h file in the AppsCommon.
A provisioning example is provided in the ServerSample code and
explained in the [Build an Application using the Thin Library section][build-app-thin-library].

##### Adding custom field definition and values

Complete the following steps to add your own custom fields
to extend AboutData.

1. Decide to which subset the field belongs (persisted keys
or all keys) and add it to the enumeration `AJSVC_PropertyStoreFieldIndices`
accordingly.
2. Add a new field entry at the respective index to the
`propertyStoreProperties`.
3. Decide whether the field is publicly accessible from
remote clients. If the field is public then set the
`mode7Public` bit to 1.
4. Decide whether the field is to be included in the
Announcement. If the field is announced then set the
`mode1Announce` bit to 1.
   **NOTE:** It is recommended to limit the inclusion of a field
   in the Announcement according to its immediate relevance
   to the appropriate service framework's discovery.Only the
   value associated with the current DefaultLanguage will be
   sent in the Announcement.
5. Decide whether the field is multi-language and add the
relevant values for the provisioned languages. If the field
is multi-language then set the `mode2MultiLng` bit to 1.
6. Decide whether the field is to be provisioned dynamically
in code and persisted during first-time (or post-factory reset)
device startup. If the field is to be initialized once, then
set the `mode3Init` bit to 1 and add the relevant code to initialize it.
Refer to `PropertyStore_Init()` and `InitMandatoryPropertiesInRAM()`
in PropertyStore.c file for an example setup for the DeviceId and
AppId fields.
   **NOTE:**  If you set this bit, the field's index must be included
   in the Persisted keys subset.
7. Add an entry in the corresponding index of `propertyStoreDefaultValues`
to provision default value(s).
8. Add an entry in the corresponding index of `propertyStoreRuntimeValues`
to provision for runtime value(s) buffer(s).

**NOTES**

* This is required if the field was defined as runtime initialized,
i.e., the `mode3Init` bit to 1 in the corresponding entry in `propertyStoreProperties`.
* The example implementation of PropertyStore supports properties
with value of type String ('s') only. If your property must be
of a different type, you must provision the default value as a
String and perform the relevant de/serialization on the client side.

### About icon

In addition to AboutData, the About feature supports the
publication of an icon. The icon is published directly as a
byte array or a reference URL. The provisioinbg is done by
the application and passed to `AJ_AboutIcon_Start()` in AboutSample.c.

An example provisioning is provided in the ServerSample's ServerSample.c:

```c
/**
* Mime type of the About Device icon
*/
const char* aboutIconMimetype = { "image/png" };
/**
* Content of the About Device icon
*/
const uint8_t aboutIconContent[] =
{ 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, ... , 0x60, 0x82, 0x82 };
/**
* Size of the About Device icon
*/
const size_t aboutIconContentSize = sizeof(aboutIconContent);
/**
* url of the icon About Device icon
*/
const char* aboutIconUrl = { " https://www.allseemalliance.org/sites/all/themes/at_alljoyn/images/img-alljoyn-logo.png "
};
```

### Start the About Server

For the About Server to be initiated properly, the application
requires to pass it the relevant settings and callbacks.
The application achieves this by calling `AJ_About_Start()`
and optionally `AJ_AboutIcon_Start()`.

An example is in About_Init() of AboutSample.c.

```c
AJ_Status About_Init(AJ_Object* announceObjects, const char* aboutIconMimetype,
   const uint8_t* aboutIconContent, const size_t aboutIconContentSize,
   const char* aboutIconUrl) {
AJ_Status status = AJ_About_Start(AJ_ABOUT_SERVICE_PORT, announceObjects);
if (status == AJ_OK) {
status = AJ_AboutIcon_Start(aboutIconMimetype, aboutIconContent,
   aboutIconContentSize, aboutIconUrl);
}
return status;
}
```

### Compile the code

The process to compile varies depending on the host and target
platform. Each host and platform needs may require a specific
directory and file layout, build toolchains, procedures, and
supported AllJoyn service frameworks. Refer to the target
platform documentation that contains instructions on how to
organize and set up the build process to incorporate the
necessary files to compile your Thin Library application.

For more details on how to combine this AllJoyn feature with
other AllJoyn service framework software, see the
[Build an Application Using Thin Library section][build-app-thin-library].

[build-app-thin-library]: /develop/tutorial/thin-app
[about-interface-definition]: /learn/core/about-announcement/interface
[about-data-fields]: #about-data-fields
[intro-thin-library]: /learn/core/thin-core
