# Glossary

### About Client

The implementation of the About feature that receives information 
from an About Server.

### About feature

Open implementation built using the AllJoyn&trade; framework that 
allows for a broadcast of AboutData.

Software layer that enables devices to publish AllJoyn service 
frameworks' interfaces and metadata (AboutData) in an Announcement 
and in a session.

[Learn more][about]

### AboutData

A Hash structure (key-value pair) of a String key to an AllJoyn 
Variant value that represents various device details.

### AboutIcon

An image representing the device that can be obtained remotely 
via the About interface.

### AboutService

A class in the About feature that is used by a developer/OEM 
in either client mode or server mode. Server mode is used to 
build an application that advertises AboutData that is read 
from a PropertyStore. Client mode is used to build an application 
that discovers advertised AboutData.

### About Service

The implementation of the About feature that broadcasts About 
details. Traditionally, this is an embedded device, but can 
be a TV, mobile, or any device that supports AllJoyn service frameworks.

### Action

A function performed by an AllJoyn-enabled device. 

[Learn more][events-and-actions].

### Action descriptor

An introspectable human readable description contained in the action. 

### Action-receiving device

The device that performs an action. Related to the 
[Events and Actions feature][events-and-actions].

### Adapter

The Control Panel service framework layer that translates 
the UI elements received to iOS UI elements.

### AJSCL

AllJoyn Standard Core Library. An application or AllJoyn 
daemon process that contains the full implementation 
of the AllJoyn message bus.

### AJTCL

AllJoyn Thin Core Library. The version of the AllJoyn library 
that runs on devices that are memory and processing power-constrained. 
This is intended for devices that are powered by a Micro Controller Unit (MCU).

### AllJoyn App

An application that uses the AllJoyn framework. Apps use either the 
AllJoyn Core APIs or the AllJoyn Service Frameworks API. Apps 
can either use the Standard Core or Thin Core implementations.

[Learn more][apps-and-routers].

### AllJoyn client app

As part of a peer session, this application will take the role 
of requesting information through a peer session on a service 
application. This does not correlate to a web client as the 
client app may also expose service components.

### AllJoyn core package

AllJoyn software package

### AllJoyn-enabled device

An entity which has an AllJoyn application installed to send 
or receive notifications using the Notification service framework interface.

### AllJoyn framework

Open-source, peer-to-peer framework that allows for abstraction 
of low-level network concepts and APIs.

[Learn more][core]

### AllJoyn interface

A collection of methods, signals and properties that make up 
the contract of how applications communicate.

### AllJoyn Router

AllJoyn network components that talk to each other to enable 
apps on different routers to communicate in the AllJoyn network.

[Learn more][apps-and-routers].

### AllJoyn service (frameworks)

A collection of full-feature implementations using the AllJoyn 
framework that provides specific functionality. These are building 
blocks can be combined together to build interoperable devices 
and applications.

### AllJoyn Standard Core Library

See [AJSCL][ajscl]

### AllJoyn Thin Core Library

See [AJTCL][ajtcl]

### Announcement

A sessionless signal whose payload includes published services' 
interfaces and metadata that are used for discovery.

[Learn more][about]

### ARDP

AllJoyn Reliable Datagram Protocol. ARDP is designed to provide,
among other things, reliable delivery and ordering for UDP-based
layer 4 transport mechanisms. In particular, ARDP is used in the
UDP Transport to provide guarantees appropriate to AllJoyn Messaging.
ARDP is modeled after RDP and extended for AllJoyn-specific requirements.

### Audio service framework

Open implementation built using the AllJoyn framework that 
allows for synchronized audio to play back on one or many Sinks.

### Authoring app

Application that carries out the IFTTT rules. Related to the 
[Events and Actions feature][events-and-actions].

### Bandwidth-Delay Product

Refers to the product of a data link�s capacity in bits per second
and its round-trip delay time. This characterizes the amount of data
that can be in transit (sometimes called in-flight) in the network.

### Base services

A set of service frameworks that are common across a range
of applications and product categories.

### Bundled router

AllJoyn router that includes an app on the same device. 
The AllJoyn Standard Library supports bundled routers.

### CNG

Cryptography Next Generation. Windows feature.

### ConfigClient

A class in the AllJoyn Configuration service framework that is 
used by an application developer to remotely configure a peer 
device running an AllJoyn ConfigService.

### ConfigData

A Hash structure (key-value pair) of a String key to an AllJoyn 
Variant value that represents various device details that are 
remotely updateable and are persisted to some permanent 
storage layer, such as NVRAM.

### ConfigService

A module in the AllJoyn Configuration service framework that 
is used by a developer/OEM to build an application that 
exposes the ability to remotely modify ConfigData that is 
read from a PropertyStore and is persisted by it.

### Config Client

The implementation of the Configuration service framework 
that remotely configures a peer device.

### Config Server

The implementation of the Configuration service framework 
that exposes ConfigData and allows a peer device to modify it remotely.

### Configuration service framework

Software layer that enables devices to provide remote 
configuration of AllJoyn service frameworks' metadata 
(ConfigData) in a session.

### Consumer

AllJoyn application consuming services on the AllJoyn network

Device that receives the notification and has a way to notify 
user such as a mobile phone or TV.

[Learn more][notification]

### Control Panel

Collection of Widgets that allow a user to interact with a 
device. A control panel is defined and announced by a 
Controllee; and discovered and displayed by a Controller. 
A device can have more than one, and can be defined on a 
per-language basis.

[Learn more][controlpanel]

### Controllee

An AllJoyn application that advertises its Control Panel 
interfaces, so that other AllJoyn devices may control it.

### Controller

An AllJoyn application that controls another AllJoyn device 
that advertises its Control Panel interfaces.

### ControlPanelEventsListener

An interface to listen for control panel-related events.

### DeviceControlPanel 

A specific control panel of a controllable device. 

### DeviceEventsListener

An interface for listening to session events.

### Device-specific callbacks

Code provided by the OEM specific to the Controllee that 
will handle requests from Controllers to set property values, 
to get property values and/or execute actions. Additionally, 
it can initiate a refresh on the Controller by calling the 
Control Panel service framework's appropriate functions.

### Device passcode

A secure passcode that is stored in the device's configuration 
interface. This passcode ensures that the information being 
passed to the device, like the home Wi-Fi password is encrypted. 
The passcode may be prepopulated by the OEM or by the end user. 
If no value is provided, the field will default to six zeroes.

[Learn more][onboarding]

### Distributed AllJoyn bus

A description of the AllJoyn network topology where AllJoyn 
Applications attach to AllJoyn Routers, and AllJoyn Routers
connect to each other. The entire network can be described
as the Distributed AllJoyn bus.

### Event

(from system description) A message denoting that something has happened.

A signal on an AllJoyn interface that contains a human readable 
description. The arguments may also include description fields.

### Event Consumer

Application that is set up to listen for events.

### Event descriptor

Human-readable string attached to the event.

### Event-emitting device

The device that sends the event.

### Event Picker app

Application that lets end users program actions to take when an event is sent.

### GUID

Globally Unique Identifier. A 128 bit identifier generated 
randomly in a way that the probability of collision is negligible.

### IFTTT

If This Then That. A logical construct that tests for a 
certain condition and then performs an action if it is "true".

### IoE application

See [AllJoyn App][alljoyn-app]

### IoE device

A device that that is connected to Internet directly or via 
Gateway. For the purpose of this document it implies the device 
that has an AllJoyn application running on it.

### Logical distributed software bus

See [Distributed AllJoyn bus][distributed-alljoyn-bus]

### Notification message

A message sent by a producer specifying details of the 
notification including any notification text to be displayed to the user.

### Notification service framework

Software layer that enables devices to send or receive 
human-consumable notifications.

[Learn more][notification]

### Offboarding

The process of removing an AllJoyn device from a personal network. 
It also removes the personal Access Point's (AP) SSID and password 
values from the AllJoyn device memory.

### Onboardee

An application using this side of the service framework is 
known as the Onboardee.

An AllJoyn device that advertises that it implements the 
Onboarding interface.

### Onboarder

An application using this side of the service framework is 
known as the Onboarder.

A device, usually a handset, that is used to interact with 
the onboardee to pass it the Wi-Fi credentials needed for 
onboarding.

### Onboarding Client

The implementation of the Onboarding service framework that 
remotely onboards a peer device.

### OnboardingData

A structure containing the relevant network configuration 
information and state that controls the device's onboarding 
process. The details that are remotely updateable are persisted 
to some permanent storage layer such as NVRAM.

### OnboardingService

A module in the Onboarding service framework that is used by 
the developer/OEM to build an application that exposes the 
ability to remotely modify OnboardingData that is persisted by it.

### Onboarding Server

The implementation of the Onboarding service framework that 
exposes OnboardingData and allows a peer device to modify it 
remotely and control the onboarding process.

### Onboarding service framework

Software layer that enables devices to provide remote 
configuration (OnboardingData) and control (driver mode) 
over a device's onboarding process to a Wi-Fi AP over an 
AllJoyn session.

A set of capabilities that enables an AllJoyn device to 
be brought on or removed from a user's personal network 
(onboarding/offboarding).

### Personal AP

The target network that the end user wants the AllJoyn 
device to join. This is typically an end user's personal 
network (personal, work, office, etc.).

### Producer

AllJoyn application providing services on the AllJoyn network.

Device that generates and sends the notification to a device 
such as a household appliance.

[Learn more][notification]

### PropertyStore

(from a thin app document) A module that maintains the default 
and runtime property values for the service frameworks.

A module that maintains the values returned as AboutData that 
has been merged with the values from ConfigData.

### Proximal network

Refers to a network that does not include a cloud-based service

### Proximal IoE network

Refers to a network that includes a cloud-based service

### RDP

Reliable Data Protocol. An efficient reliable data transport
service for packet-based applications.

### Reliable event

An event this is sent with guaranteed delivery to all interested consumers. 

### Remote application

Typically, AllJoyn applications communicate with one another.
A remote application is the peer that a particular application
is communicating with.

### Rule

The pairing of an event with an action the user wants to have 
occur when a device supporting the Events interface performs 
an action defined by the OEM that warrants monitoring.

### Security

Framework for AllJoyn applications to authenticate each other 
and send encrypted data between them.

### Service_Common

A module that contains code shared by multiple services, 
including the PropertyStore API definition.

### Sessionless signal

A broadcast AllJoyn signal which is received by all devices 
listening on the end user's home network (such as the Wi-Fi network). 
The sessionless signals are broadcast on the network until an 
associated time-to-live (TTL) value expires. The About feature 
sends Announcements as sessionless signals over the Wi-Fi network.

[Learn more][sessionless-signal]

### SoftAP

When the AllJoyn device is not connected to a Wi-Fi Access Point 
(not onboarded) it broadcasts in access point mode.

Software-enabled Access Point that allows the device to work 
as both the AP and the client.

### Standalone router

Contains the main progrem, liballjoyn.so, and librouter.so files.
It is not bundled with an AllJoyn app.

### Standard app

AllJoyn app that uses the AllJoyn Standard Library.

### Standard core

Contains the Standard library and router library

### SYN, SYN+ACK, ACK

The kinds of segments that are involved in a three-way handshake
connection establishment protocol. Used in TCP and ARDP.

### Thin app

An AllJoyn application that incorporates the AllJoyn thin core library.

### Thin core

Contains the Thin library

### Thin Library service app

AllJoyn app that exposes one set of features as part of a 
peer session. It does not correlate to a web service as the 
service may play the role of a client at various times 
(depending on the implementation). The function of the AllJoyn 
service is defined by the set of AllJoyn service frameworks used.

### Translator

Callback method a developer implements in order to provide 
language translations or string manipulations.

[Learn more][events-and-actions]

### User

Has many contexts.

In Events and Actions, the individual using the device that 
has the Event Picker application installed.

### Well-Known Name (WKN)

Well Known names are used as the basis for AllJoyn discovery 
for announcements. Typically applications will use About
announcements and not the lower level Well-Known Names.

### Widget

A UI element in the control panel used to represent an interface. 
It graphically enables a user to perform a function and/or 
access properties.

### WKN

[about]: /learn/core/about-announcement
[apps-and-routers]: /learn/architecture#apps-and-routers
[events-and-actions]: /learn/core/events-and-actions
[core]: /learn/core
[notification]: /learn/base-services/notification
[sessionless-signal]: /learn/core#sessionless-signal
[controlpanel]: /learn/base-services/controlpanel
[onboarding]: /learn/base-services/onboarding
[ajscl]: #ajscl
[ajtcl]: #ajtcl
[alljoyn-app]: #alljoyn-app
[distributed-alljoyn-bus]: #distributed-alljoyn-bus