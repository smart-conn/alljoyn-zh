# Learn

AllJoyn&trade; is a collaborative open-source software framework that makes 
it easy for developers to write applications that can discover nearby 
devices, and communicate with each other directly regardless of brands, 
categories, transports, and OSes without the need of the cloud. The AllJoyn 
framework is extremely flexible with many features to help  make the 
vision of the Internet of Things come to life.

## Proximal Network

The AllJoyn framework handles the complexities of discovering nearby devices, 
creating sessions between devices, and communicating securely between those 
devices.  It abstracts out the details of the physical transports and provides 
a simple-to-use API. Multiple connection session topologies are supported, 
including point-to-point and group sessions. The security framework is flexible, 
supporting many mechanisms and trust models. And the types of data transferred 
are also flexible, supporting raw sockets or abstracted objects with well-defined 
interfaces, methods, properties, and signals.

## Flexible

One of the defining traits of the AllJoyn framework is its inherent flexibility.  
It was designed to run on multiple platforms, ranging from small embedded RTOS 
platforms to full-featured OSes. It supports multiple language bindings and
transports. And since the AllJoyn framework is open-source, this flexibility
can be extended further in the future to support even more transports, bindings,
and features.

* Transports: Wi-Fi, Ethernet, Serial, Power Line (PLC)
* Bindings: C, C++, Obj-C, Java
* Platforms: RTOS, Arduino, Linux, Android, iOS, Windows, Mac
* Security: peer-to-peer encryption (AES128) and authentication (PSK, ECDSA)

## Common language for Internet of Things

In order to fully realize the vision of the Internet of Things, devices and apps
need a common way to interact and speak to each other.  We believe that common
language is the AllJoyn framework: it serves as the glue to allow devices from
different companies, running on different operating systems, written with different
language bindings to all speak together, and just work.

The AllSeen Alliance, working with the open-source community, is defining and 
implementing common services and [interfaces][interfaces] that solves a specific
use case, such as [onboarding a new device for the first time][onboarding], 
[sending notifications][notifs], and [controlling a device][controlpanel]. 
Developers can then take these services, integrate them into their products, 
and know that they are compatible with other devices and apps in the AllJoyn 
ecosystem.

Beyond common services and interfaces, an app or device can also implement 
private interfaces. So, the app can both use common services and interfaces
to participate in the larger AllJoyn ecosystem, while at the same time, use
the AllJoyn framework to communicate with apps and devices in a private fashion. 
The AllJoyn framework enables this flexibility.

## Optional Cloud

The AllJoyn framework runs on the local network and does not require the cloud 
to function. Apps and devices talk to each other directly -- fast, efficient, and
secure. No need to go out and wait for the cloud when the device is right
next to you. And in cases where the cloud is needed, the AllJoyn framework 
supports that as well through a [Gateway Agent][gateway-agent]. One main
advantage of this architecture is security: only the Gateway Agent is
directly connected to the Internet, reducing the number of devices
connected to the Internet, and thus reducing the attack surface.

## Momentum

As a collaborative open source project, the AllSeen ecosystem continues
to grow and evolve. More common services are being added with each release,
including implementation for multiple platforms. There is strong momentum,
and with your help, the AllJoyn framework can very well be the common
language for the Internet of Things.

## Next steps

Learn more about [use cases][use-cases]. Then head over to learn about the
overall [Architecture][arch], [Core Framework][core], and [Base Services][services].

[interfaces]: /learn/core#busobject
[onboarding]: /learn/base-services/onboarding
[notifs]: /learn/base-services/notification
[controlpanel]: /learn/base-services/controlpanel
[gateway-agent]: https://wiki.allseenalliance.org/gateway/gatewayagent

[use-cases]: /learn/use-cases
[arch]: /learn/architecture
[core]: /learn/core
[services]: /learn/base-services
