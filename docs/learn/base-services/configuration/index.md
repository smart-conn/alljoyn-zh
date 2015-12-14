# Configuration Service

The Configuration Service provides an ability to
configure a device, like its device name or passcode.

## Concepts and Terminology

Two roles exist:
* **Config Server**. This runs on the device that is being configured,
  the device that is offering the Configuration service.

* **Config Client**. This runs on the device or app that is used to
  configure a remote device.

The following configurations can be configured:

* **Factory Reset**. Restores the device to its original
  factory settings. All configurable data is restored;
  if the device supports the Onboarding service, then
  the device will enter its original offboarded state.

* **Set Passcode**. Sets the device's passcode, which
  is used when accessing secure interfaces.

* **Default Language**. Sets the default language used
  by the device if a specific language is not requested.

* **Device Name**. Sets the device's name.

The Configuration Service exposes a simple secured
interface to provide this service. See the
[Configuration Interface Definition][config-interface]
for more details.

## Learn More

* [Learn more about the Configuration Interface Definition][config-interface]
* [Download the SDK][download] and [build][build]
* [Learn more about the Configuration APIs][api-guide]

[config-interface]: /learn/base-services/configuration/interface
[download]: https://allseenalliance.org/framework/download
[build]: /develop/building
[api-guide]: /develop/api-guide/config
