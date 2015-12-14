# Architecture

## Network Architecture

The AllJoyn&trade; framework runs on the local network. 
It enables devices and apps to advertise and discover 
each other. This section explains the network architecture 
and the relationship between various AllJoyn components.

### Apps and Routers

The AllJoyn framework comprises AllJoyn Apps and AllJoyn 
Routers, or Apps and Routers for short. Apps communicate 
with Routers and Routers communicate with Apps. Apps can 
only communicate with other Apps by going through a Router.

Apps and Routers can live on the same physical device, or 
on different devices. From an AllJoyn perspective, it doesn't 
matter.  In reality, three common topologies exist:

1. An App uses its own Router. In this case, the Router is
called a "Bundled Router" as it is bundled with the App. AllJoyn
Apps on mobile OSes like Android and iOS and desktop OSes like
Mac OS X and Windows generally fall in this group.

2. Multiple Apps on the same device use one Router.  In this 
case, the Router is called a "Standalone Router" and it 
typically runs in a background/service process.  This is 
common on Linux systems where the AllJoyn Router runs as a 
daemon process and other AllJoyn apps connect to the Standalone 
Router. By having multiple apps on the same device use the 
common AllJoyn Router, the device consumes less overall resources.

3. An App uses a Router on a different device. Embedded 
devices (which use the Thin variant of the AllJoyn framework, 
more on this later) typically fall in this camp as the embedded 
device typically does not have enough CPU and memory to run 
the AllJoyn router.

![apps-and-routers][apps-and-routers]

### Transports

The AllJoyn framework runs on the local network.  It currently 
supports Wi-Fi, Ethernet, serial, and Power Line (PLC), but since
the AllJoyn software was written to be transport-agnostic and
since the AllJoyn system is an evolving open-source project,
support for more transports can be added in the future.

Additionally, bridge software can be created to bridge the 
AllJoyn framework to other systems like Zigbee, Z-wave, or 
the cloud. In fact, a Working Group is working on adding a 
[Gateway Agent][gateway-agent] as a standard AllJoyn service.

## Software Architecture

The AllJoyn network comprises AllJoyn Applications and AllJoyn Routers.

An AllJoyn Application comprises the following components:
* [AllJoyn App Code][app-code]
* [AllJoyn Service Frameworks Libraries][services]
* [AllJoyn Core Library][core]

An [AllJoyn Router][router] can either run as standalone or is 
sometimes bundled with the AllJoyn Core Library.

![alljoyn-software-architecture][alljoyn-software-architecture]

### AllJoyn Router

The AllJoyn router routes AllJoyn messages between AllJoyn Routers 
and Applications, including between different transports.

### AllJoyn Core Library

The AllJoyn Core Library provides the lowest level set of APIs 
to interact with the AllJoyn network.  It provides direct access to:

* Advertisements and discovery
* Session creation
* Interface defintion of methods, properties, and signals
* Object creation and handling

Developers use these APIs to implement AllJoyn service frameworks, 
or to implement private interfaces.

[Learn more about AllJoyn Core Frameworks][learn-core].

### AllJoyn Service Framework Libraries

The AllJoyn Service Frameworks implement a set of common services, 
like onboarding, notification, or control panel. By using the 
common AllJoyn service frameworks, apps and devices can properly 
interoperate with each other to perform a specific functionality.

Service frameworks are broken out into AllSeen Working Groups:

* [Base Services][base-services]
  * [Onboarding][onboarding]. Provide a consistent way to bring a new device onto 
    the Wi-Fi network.

  * [Configuration][configuration]. Allows one to configure certain attributes of 
    an application/device, such as its friendly name.

  * [Notifications][notifications]. Allows text-based notifications to be sent and 
    received by devices on the AllJoyn network. Also supports audio and images
    via URLs.

  * [Control Panel][controlpanel]. Allows devices to advertise a virtual control
    panel to be controlled remotely.

* [More Service Frameworks][wiki]. More service frameworks are actively
  being developed by the AllSeen Working Groups.

Developers are encouraged to use AllJoyn Service Frameworks
where possible. If an existing service is not available,
then the developer is encouraged to work with the AllSeen
Alliance to create a standard service.  In some cases, using
private services and intefaces makes the most sense; howerver,
those services would not be able to interoperate and take
advantage of the larger AllJoyn ecosystem of devices and apps.

### AllJoyn App Code

This is the application logic of the AllJoyn application. 
It can be programmed to either the AllJoyn Service Frameworks 
Libraries, which provide higher level functionality, or the 
AllJoyn Core Library, which provides direct access to the AllJoyn Core APIs.

### Thin and Standard

The AllJoyn framework provides two variants:
* Standard.  For non-embedded devices, like Android, iOS, Linux.
* Thin.  For resource-constrained embedded devices, like Arduino, 
ThreadX, Linux with limited memory.

![alljoyn-standard-and-thin][alljoyn-standard-and-thin]

## Programming Models

Typically, applications will be written using the AllJoyn Service
Framework APIs so that the applications can be compatible with devices
using the same Service Frameworks. Only by using AllJoyn Service
Frameworks developed by AllSeen Working Groups will the application
be compatible with other applications and devices in the AllSeen
ecosystem.

If an application wishes to implement its own service, it can do so
by programming directly to the AllJoyn Core APIs. When doing so, it
is recommended to follow the Events and Actions convention to enable
ad hoc interactions between other AllJoyn devices.

The application can use both the Service Framework and Core APIs
side by side.

[Learn more about Events and Actions][events-and-actions].

[apps-and-routers]: /files/learn/apps-and-routers.png

[learn-core]: /learn/core

[app-code]: #alljoyn-app-code
[services]: #alljoyn-service-frameworks-libraries
[core]: #alljoyn-core-library
[router]: #alljoyn-router

[events-and-actions]: /learn/core/events-and-actions
[alljoyn-software-architecture]: /files/learn/alljoyn-software-architecture.png
[alljoyn-standard-and-thin]: /files/learn/alljoyn-standard-and-thin.png

[base-services]: /learn/base-services
[onboarding]: /learn/base-services/onboarding
[configuration]: /learn/base-services/configuration
[notifications]: /learn/base-services/notification
[controlpanel]: /learn/base-services/controlpanel

[wiki]: https://wiki.allseenalliance.org/
[gateway-agent]: https://wiki.allseenalliance.org/gateway/gatewayagent
