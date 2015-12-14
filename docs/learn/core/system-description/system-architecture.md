# System Architecture

## Network architecture

The AllJoyn&trade; network architecture is dependent upon the network 
deployment scenario. This section captures the following deployment scenarios:

* Standalone AllJoyn network: A proximal network with a set 
of peer devices which could be connected over the same or 
different access mediums. 
* Remote accessible AllJoyn network: A proximal network 
where services provided by devices are accessible and controllable 
from outside the proximal network.

### Standalone AllJoyn network

A standalone AllJoyn network architecture is fairly simple 
with two or more peer nodes coming together to dynamically 
form an AllJoyn network.  Peers can be connected over different 
access networks such as Wi-Fi. The AllJoyn advertisement and 
discovery mechanism takes care of seamlessly discovering 
these peers independent of the underlying transport being used. 

The following figure captures the network architecture for a 
typical standalone AllJoyn network.

![standalone-network-arch][standalone-network-arch]

**Figure:** Standalone AllJoyn network architecture

**NOTE:** In a Wi-Fi deployment, the AllJoyn framework requires 
wireless isolation to be turned off at the access points to 
enable peer-to-peer communication.

#### Bridging multiple transports

A standalone AllJoyn network can involve nodes connected 
over both wireless and wired transport, e.g., nodes connected 
over Wi-Fi, PLC, and Ethernet. Nodes in such a network can 
communicate with each other as long as wireless isolation 
is not enabled on the Wi-Fi Access Point (AP).

The following figure captures the high-level network architecture 
for an AllJoyn network with devices connected over Wi-Fi, PLC, 
and Ethernet transports.

![bridging-multiple-transports][bridging-multiple-transports]

**Figure:** Bridging multiple transports

### Remote accessible AllJoyn network

A remote accessible AllJoyn network is a proximal IoE network 
where services provided by devices are accessible and/or controllable 
from outside the proximal IoE network. The remote accessibility is 
achieved by having a Gateway node in the system. The Gateway node 
exposes device functionality and control to an existing cloud-based 
service either via standard Internet style APIs (e.g. REST). A mobile 
device outside the proximal IoE network can communicate with devices 
in the proximal IoE network via the cloud-based service and via the 
Gateway node.  

The following figure captures the high-level network architecture 
for a remote accessible AllJoyn network.

![remote-network-arch][remote-network-arch]

**Figure:** Remote accessible AllJoyn network architecture

## Device architecture

An AllJoyn-enabled device can support one or more AllJoyn 
applications. The AllJoyn router can be bundled with each of 
these applications on devices such as mobile phone and tablets. 
Alternately, the AllJoyn router can be installed separately as 
a standalone router on the device and multiple applications can 
make use of it; examples of devices include TVs and set-top boxes 
(STBs). There can also be hybrid deployment cases where a single 
device has both a bundled AllJoyn router for certain apps and a 
standalone AllJoyn router for other apps on the device.  

**NOTE;** An app always looks for a preinstalled AllJoyn core, so 
this will only happen if the preinstalled AllJoyn core was a 
lower version than the bundled AllJoyn core.

The following deployment scenarios are captured for the AllJoyn device:

* Single app with bundled AllJoyn router
* Multiple apps with bundled AllJoyn router
* Multiple apps with standalone AllJoyn router

#### Single app with bundled AllJoyn router

In this deployment, the AllJoyn application package includes 
an app and an AllJoyn router. The app can support application-specific 
services as well as one or more service frameworks. The application 
connects to the AllJoyn router via the AllJoyn standard core library. 
In case of the bundled AllJoyn router, the communication between 
the app and AllJoyn router is local (within the same process) 
and can be done using function/API calls.

The following figure captures the AllJoyn device architecture 
for a single app with bundled AllJoyn router deployment scenario.

![single-app-bundled-router-device-arch][single-app-bundled-router-device-arch]

**Figure:** AllJoyn device architecture (single app with bundled AllJoyn router)

#### Multiple apps with bundled AllJoyn router

In this deployment, the AllJoyn-enabled device supports multiple 
applications. Each of these applications has a separate instance 
of an AllJoyn router bundled with that application package. 

The following figure captures the AllJoyn device architecture 
for multiple apps with a bundled AllJoyn router deployment scenario.

![multiple-apps-bundled-router-device-arch][multiple-apps-bundled-router-device-arch]

**Figure:** AllJoyn device architecture (multiple apps with bundled AllJoyn router)

#### Multiple apps with standalone AllJoyn router

In this deployment, the AllJoyn-enabled device supports a 
standalone AllJoyn router. The multiple applications on the 
device connect using the same standalone AllJoyn router. 
The communication between an application and the standalone 
AllJoyn router happens across process boundaries and can 
happen over transports like UNIX domains sockets or TCP.

The following figure captures the AllJoyn device architecture 
for multiple apps with a standalone AllJoyn router deployment scenario.

![multiple-apps-standalone-router-device-arch][multiple-apps-standalone-router-device-arch]

**Figure:** AllJoyn device architecture (multiple apps with standalone AllJoyn router)

## AllJoyn router architecture

The AllJoyn router provides a number of functionalities to 
enable key features of the AllJoyn framework. The following 
figure captures the functional architecture for the AllJoyn router.

![alljoyn-router-functional-arch][alljoyn-router-functional-arch]

**Figure:** AllJoyn router functional architecture

The AllJoyn router supports key features over multiple 
underlying transports. The Advertisement and Discovery 
module provides transport agnostic advertisement and discovery 
functionality. Similarly, modules shown for other features 
including Session, Data Exchange, and Sessionless Signal 
modules offer transport-agnostic functionality for those 
features. All these AllJoyn features work over various 
transports including Wi-Fi, wired transports, Bluetooth, 
and any local transport.

The AllJoyn bus management and control functions are provided 
by the Bus Management module. The Security module provides 
AllJoyn security functionality including SASL-based authentication.

The Message and Signal Transport layer provides functionality 
to encapsulate application layer signaling and data into D-Bus 
format message encapsulation. The Transport Abstraction Layer 
provides abstraction for various underlying transports for core 
AllJoyn features. The various transport-related modules provide 
that transport-specific functionality to accomplish core AllJoyn 
functions. The AllJoyn router supports an OS Abstraction Layer 
to interact with different underlying OS platforms.

## Thin app architecture

An AllJoyn thin app is designed for energy-, memory-, and 
CPU-constrained devices. The thin app is designed to have a 
very small memory footprint and is typically single-threaded. 
The thin app includes the application code and AllJoyn thin 
core library (AJTCL); it does not include an AllJoyn router. 

A thin AllJoyn device only has a lightweight thin app running 
on the device that makes use of an AllJoyn router running on a 
standard AllJoyn device to advertise, discover, and connect with 
AllJoyn peers. Communication between the thin app and the AllJoyn 
router occurs across device boundaries over TCP transport.

The following figure captures the AllJoyn thin app architecture.

![alljoyn-thin-app-arch][alljoyn-thin-app-arch]

**Figure:** AllJoyn thin app architecture

## AllJoyn framework protocol stack

The following figure captures the high-level protocol stack 
for the AllJoyn framework.

![alljoyn-protocol-stack][alljoyn-protocol-stack]

**Figure:** AllJoyn protocol stack

At the top level, the AllJoyn framework protocol stack 
consists of an application providing a number of application 
layer services and supporting some service frameworks. These 
app layer services are defined by AllJoyn interfaces supported 
by the app. The app sits on top of the AllJoyn core library, 
which enables an app to invoke core AllJoyn functionality.

Below the AllJoyn core library sits the AllJoyn router that 
implements core AllJoyn features including advertisement/discovery, 
session establishment, sessionless signals, authentication, etc. 
The AllJoyn router supports multiple underlying transports for 
discovery and communication and provides an abstraction layer 
for each of the supported transport. The AllJoyn router belongs 
to the application layer in the standard OSI layering model. 

Under the AllJoyn router reside the standard OSI layers: 
transport, network, layer 2 and physical layer.


[standalone-network-arch]: /files/learn/system-desc/standalone-network-arch.png
[bridging-multiple-transports]: /files/learn/system-desc/bridging-multiple-transports.png
[remote-network-arch]: /files/learn/system-desc/remote-network-arch.png
[single-app-bundled-router-device-arch]: /files/learn/system-desc/single-app-bundled-router-device-arch.png
[multiple-apps-bundled-router-device-arch]: /files/learn/system-desc/multiple-apps-bundled-router-device-arch.png
[multiple-apps-standalone-router-device-arch]: /files/learn/system-desc/multiple-apps-standalone-router-device-arch.png
[alljoyn-router-functional-arch]: /files/learn/system-desc/alljoyn-router-functional-arch.png
[alljoyn-thin-app-arch]: /files/learn/system-desc/alljoyn-thin-app-arch.png
[alljoyn-protocol-stack]: /files/learn/system-desc/alljoyn-protocol-stack.png