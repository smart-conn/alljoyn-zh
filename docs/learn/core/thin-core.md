# AllJoyn&trade; 精简内核

## 概览

AllJoyn 是一套开源软件系统，它为可以夸不同类型设备运行的分布式应用提供运行平台，并且强调移动、安全和动态可配置的特性。AllJoyn是“平台不依赖”的，这意味着它在设计之时就尽量做到不依赖与特定的操作系统、硬件或硬件上运行的软件。

AllJoyn的标准内核库(AJSCL)中的各子模块设计是考虑了在Microsoft Windows、Linux、Android、iOS、OS X、OpenWRT下以及作为互联网浏览器的整合插件的方式使用的要求。这些软件系统的一个共有的特性是它们都运行于通用计算机之上。通用计算机通常拥有可观数量的存储能力，有充足的电力、计算能力以及由此带来的能支持多进程、多线程和多语言环境的操作系统。

与此不同，嵌入式系统运行于嵌入在一个大型设备上的微处理器当中以提供特定的功能。由于嵌入式系统只需要执行特定的任务或一些有限数量的功能，工程师可以优化这些系统以便能在具有更小的存储空间、更有限的处理器速度、更省电、更少的外设和用户接口等的硬件平台上运行来减小产品的尺寸与价格。AllJoyn Thin Core Library（AJTCL）就是以将AllJoyn分布式编程环境的优势应用于嵌入式系统为目标应运而生的。

Since the operating environment in which an AJTCL will run may
be very constrained, an AllJoyn component running on such systems
must live within those constraints. This means, specifically,
that we do not have the luxury of bundling in an AllJoyn
router (which requires multi-threading), having many network
connections, and using relatively large amounts of RAM and ROM.
We do not have the luxury of running an object-oriented programming
environment that includes alternate language bindings. Because
of this, the AJTCL consists only of what amounts to a bus attachment
(see the [Introduction to the AllJoyn Framework][intro-alljoyn-framework])
written solely in the C language. The data structures corresponding
to interfaces, methods, signals, properties, and bus objects are
highly optimized for space, and the developer APIs are,
therefore, quite different.

Although the APIs may be different, all of the major conceptual
blocks found in AJSCL can be found in AJTCL systems; they just
take on a more compact form or are actually run remotely on another,
more capable machine.

**NOTE:** When we mention the AllJoyn Standard Library (AJSCL), we
explicitly refer to the versions of these components that run on
general purpose computers

## Conceptual Model

As implied in the previous section, most high-level abstractions
used in AJTCL are identical to those in the AJSCL system.
The [Introduction to the AllJoyn Framework][intro-alljoyn-framework-conceptual-overview]
has a section titled Conceptual Overview that walks you through
these abstractions. In the Conceptual Overview section, we assume
that the reader is familiar with the abstractions introduced
in that document, so we will only touch on the differences
that are required to understand the AJTCL architecture.

### AllJoyn Thin Core Library is still AllJoyn

It is important to understand that AJTCL is part of the AllJoyn
framework. A Thin Core Library is completely interoperable with
AJSCL. Since the AllJoyn network wire protocol is completely
implemented on both types of such a system, AJSCL can be completely
unaware of the fact that they are talking to Thin Core Libraries,
and vice versa.

Recall from the [Introduction to the AllJoyn Framework][intro-alljoyn-framework]
that the basic structure of an AllJoyn distributed bus consists of
multiple bus segments residing on physically separate host computers.

![alljoyn-distributed-bus][alljoyn-distributed-bus]

**Figure:** AllJoyn distributed bus

Recall that each bus segment is located on a given host
computer, as illustrated by the dotted squares labeled
Host A and Host B in the figure. Each bus segment is implemented
by an AllJoyn router (shown as the bubbles labeled D in the figure).
There may be several bus attachments on a host, each connected
to the local daemon (illustrated by hexagons). These hexagons
are refined to be services (S) or clients (C).

Since the host computer running AJTCL typically does not have
the resources to run a router, the AllJoyn architecture changes
things such that to connect to the distributed bus the Thin
Core Library borrows an AllJoyn router running on another
host computer.

![alljoyn-distributed-bus-tcl][alljoyn-distributed-bus-tcl]

**Figure:** AllJoyn distributed bus with thin core libraries

Notice that Embedded System A and Embedded System B are not
the same devices as Host B, which is running the router that
manages the distributed bus segment on which the embedded
devices reside. The connection between the embedded systems
running AJTCL and the router hosting the bus segment is made
through Transmission Control Protocol (TCP).

The network traffic flowing between the embedded systems and
the routers are AllJoyn messages implementing bus methods,
bus signals, and properties flowing over their respective
sessions, as described in [Introduction to the AllJoyn Framework][intro-alljoyn-framework].

It is sometimes desirable to allow AJTCL devices to connect
to and borrow any old router found in the proximity. We call
these untrusted relationships (from the router perspective).
It is also sometimes desirable to allow only particular AJTCL
devices to connect to specific routers. We call these trusted
relationships (again, from the router perspective).

These relationships are established using a discovery and
connection process that is conceptually similar to the
discovery and connection process of clients and services.
An AllJoyn router conveys its willingness to host a given
collection of AJTCL devices by advertising a well-known name.
This advertisement may be driven either by router configuration
or by an advertisement specifically made by an AllJoyn component.
When a connection attempt is made to any router as a result
of a discovery event, a router expecting trusted relationships
may choose to challenge a particular Thin Core Library (or
impersonator of a Thin Core Library) to produce a credential.
In the case of an untrusted relationship, the router may choose
to simply allow any connection attempt. In the case of an
untrusted connection, the involved router will not allow
the Thin Library to perform any operations that will cause
sessions to be established with components off the local device
(and which, therefore, correspond to a "service that costs you money").

As implied above, the connection process for an AJTL device
is split into three phases:

* Discovery phase
* Connection phase
* Authentication phase

The discovery phase works just like service advertisement and
discovery as described in [Introduction to the AllJoyn Framework][intro-alljoyn-framework],
with two exceptions. The first exception is that advertisements
for the purpose of AJTL discovery are typically "quiet" advertisements.
This simply means that the advertisements are not sent gratuitously
by the router.

The second exception is that responses to quiet advertisements
are sent quietly - we call these quiet responses. This means
that the responses are unicast back to the requester instead
of being multicast as they are in "active" advertisements.
The primarily reason for this change is to allow embedded
devices that do not fully implement multicast reception to
participate in AllJoyn distributed systems.

### What is an AllJoyn Thin Core Library device?

One typically thinks of an AJTCL device as conceptually similar
to a Sensor Node (SN) in a Wireless Sensor Network (WSN).
Sensor nodes are typically sensors/actuators that are small
in size and constrained in energy, computing power, memory,
or other resources. They are able to sense their surroundings,
communicate events to the outside world, and possibly take
actions based on internal processing or as a result of external
events. This is a very broad definition, and a small sampling
of the sort of devices that might fit into such a definition
could be:

* Light switches
* Thermostats
* Air conditioners
* Vent dampers
* Smoke detectors
* Motion detectors
* Humidity detectors
* Microphones
* Speakers
* Earphones
* Doors
* Doorbells
* Ovens
* Refrigerators
* Toasters

There is a large amount of literature available that discusses
wireless sensor networks (WSNs). AllJoyn systems are distinguished
from such networks in that WSNs typically use self-organizing
multi-hop ad hoc wireless networks where security is not a major
concern; whereas the AllJoyn framework will most likely run on
infrastructure-mode Wi-Fi networks to which a given device
must be associated and authenticated. In order to accomplish
the secure admission to a Wi-Fi network, AJTCL uses a process
called "onboarding". The Onboarding service framework allows a
Thin Core Library device, which presumably has no friendly
user interface, to learn enough information about its destination
network to accomplish the admission and authentication processes
required to join that network. The Onboarding service framework
is defined in detail in a dedicated document.

In its role as a kind of sensor node, an AJTCL device typically
implements a service in the AllJoyn sense. It senses its
surroundings using attached hardware and communicates events
to the outside world through AllJoyn signals. It can take
actions as a result of external events, either by listening
for signals from other devices or by responding to Remote
Method Invocations from AllJoyn clients, as discussed in
[Introduction to the AllJoyn Framework][intro-alljoyn-framework].

## Thin Core Library Architecture

Since the AllJoyn Thin Core Library (AJTCL) must run in devices
that are constrained in energy, processing power, and memory,
such devices do not have the luxury of using the same architecture
as a general-purpose computer system running AllJoyn Standard Core Library (AJSCL).

The layered architecture of an AJSCL or service process is reproduced below.

![ajscl-layering][ajscl-layering]

**Figure:** AJSCL layering

See the [Introduction to the AllJoyn Framework][intro-alljoyn-framework]
for a more detailed discussion of these layers.

The important observation to make at this point is that each
AllJoyn client or service reproduces this layering in every
process representing an AllJoyn application.

Every AJSCL-enabled host needs to have at least one AllJoyn router.
This router may reside in its own process in the standalone router
case, or it may be co-located with an application in the bundled
router case. The layered architecture of an AJSCL router is
reproduced below.

![ajscl-router-layering][ajscl-router-layering]

**Figure:** AJSCL router layering

Notice that the router adds additional support for routing
messages between router, along with the capacity to use a
multiple network transport mechanisms such as Wi-Fi Direct.
This is a significant amount of functionality and comes at
a considerable cost in computing power, energy, and memory.

Clearly, it is not possible to run this significant amount
of code in a constrained embedded system, so AJTCL minimizes
the amount of this code that is required to exist on a given device.
It does this by constraining the basic environment to a minimal
C-only run-time, and by borrowing other devices to perform the
router role for it. In contrast to AJSCL, AJTCL, as shown below,
does away with much of the overhead present in the AJSL system.

![ajtcl-layering][ajtcl-layering]

**Figure:** AJTCL layering

AJTCL exposes only the minimum required API to the bus attachment
and exposes the AllJoyn messaging interface directly instead of
providing helper functions.

Instead of providing an abstract transport mechanism, the
messaging layer uses User Datagram Protocol (UDP) and TCP
directly. There is a very thin porting layer to abstract a few
needed native system functions, and the entire package is
written in C, with an eye toward minimizing code size. Because
of these optimizations, an AJTCL system can run in as little
as 25 Kbytes of memory, whereas a bundled router and C++ client
or service combination may require ten times that amount,
and a Java language version may require as much as 40 times that footprint.

## Tying it All Together

In order to make this discussion somewhat more concrete, two
example distributed systems are presented here.

* A minimal system in which a single AllJoyn application running
on a smartphone talks to a single AJTCL device. This illustrates
the trusted router relationship as described above.
* A more complicated system with a router running on a wireless router.

**NOTE:** Typically, this situation would be a router running
OpenWRT that hosts a preinstalled AllJoyn router. This router
accepts untrusted connections from Thin Core Libraries that
have been onboarded to the Wi-Fi network.

A small number of AJTCL devices connect to the router and act
as the sensor nodes for an AllJoyn-based wireless sensor
network, and a general purpose computer performs the data
fusion function.

**NOTE:** In Wireless Sensor Networks, data fusion is a term that
refers to a process where some distinguished node collects
results from some number of sensor nodes and integrates, or
"fuses", its results with those of the other sensor nodes and
makes some decision on an action to take as a result of this data.

### A minimalist Thin Core Library system

A minimal example of a system using a AJTCL consists of a single
host running AJSCL and a Thin Core Library device. AJSCL provides
the AllJoyn router which the Thin Core Library will attach to,
and also provides a platform for running an application that
uses the Thin Core Library. As mentioned above, the Thin Core
Library typically acts as a kind of sensor node, and sends data
to an application running on the host. The application typically
processes the data in some way and issues commands to the sensor
to manipulate its environment.

For a plausible but simple system, consider a wall thermostat
that controls a furnace, and a control application running on
an Android device. The Android device will run AJSCL, and the
wall thermostat will run the AJTCL.

![minimalist-example-system][minimalist-example-system]

**Figure:** Minimalist example system

In this example, a requirement is that the wall thermostat
only be controllable by a corresponding thermostat controller
application in the Android device.

Since a requirement of the example is that the thermostat be
controllable only by the Android device, it is probably also
a requirement that the thermostat associate itself with only
a router associated with the application. This implies that
the Android application should be bundled with an AllJoyn
router and only this particular combination of bundled router
and application should advertise itself as a router for the
Thin Core Library to use. This kind of arrangement leads to
a trusted relationship between AJTCL and the router/application pair.

The application then asks its bundled router to quietly advertise
a well-known name that is known to AJTCL (for example,
com.company.BusNode<guid>). The router is then primed to respond
to discovery requests for that name in the form of quiet (unicast)
responses. When the Thin Core Library comes up, it will perform
discovery on the associated network prefix (com.company.BusNode).

![ajtcl-router-discovery][ajtcl-router-discovery]

**Figure:** Thin Core Library router discovery

When the router receives the explicit inquiry about a name
it is quietly advertising, it will respond with an indication
that the requested name "is at" the particular router. AJTCL
will then attempt to connect to the responding router.

![ajtcl-connection-attempt][ajtcl-connection-attempt]

**Figure:** Thin Core Library connection attempt

At this point, a logical AllJoyn bus has been formed, in which
both the application and Thin Core Library service are associated
with the bundled router running on the Android device. Representing
the system using the bubble diagrams used in [Introduction to the AllJoyn Framework][intro-alljoyn-framework],
the arrangement appears as if the AllJoyn router has a
connected service and client.

![ajtcl-system-example][ajtcl-system-example]

**Figure:** Thin Core Library system example

At this time, the AJTCL is connected to the router bundled
with the application, but neither the application nor the Thin
Core Library knows of each other's existence. Typically at this time,
AJTCL would request a well-known bus name and instantiate a service
in the AllJoyn sense. The Thin Core Library would create a session
port and advertise a well-known name as described in
[Introduction to the AllJoyn Framework][intro-alljoyn-framework]
using the Thin Core Library APIs. This well-known name would
typically be different than the well-known name that the
bundled router advertises; it corresponds to the client/service
relationship between the Thin Core Library and the application,
rather than the relationship between the router and the Thin Core Library.
The application running on the Android device would then
perform service discovery for that name.

![ajtcl-service-discovery][ajtcl-service-discovery]

**Figure:**: Service discovery with the Thin Core Library

When service running on AJTCL is discovered by the client
running on the Android device, the client may join the session
created by the service.

![ajtcl-android-device-joins-session-service][ajtcl-android-device-joins-session-service]

**Figure:** Android device joins session with service on the Thin Core Library

At this point, the application running on the Android device
may access the AJTCL service, as it would any AllJoyn service.
It may choose to be notified of signals emitted by the service - in this
case, perhaps periodic signals consisting of the
current temperature. The application may choose to present
a user interface that allows a user to enter a desired temperature
and then send that temperature to AJTCL using AllJoyn remote
method invocation as described in Introduction to the AllJoyn
Framework. Upon receiving a Method Call, the service running
in AJTCL could relay the request to the furnace to set the
desired temperature.

The API used on the Thin Core Library side is considerably
different from that used in AJSCL or a service; however,
since the wire protocol is identical in both cases, the flavor
of a component on the other side of the connection (AJSCL or AJTCL)
is not visible. At this point, AllJoyn is AllJoyn and the
bubble diagrams, including AJTCLs, are indistinguishable for
all intents and purposes from those bubble diagrams shown in
the [Introduction to the AllJoyn Framework][intro-alljoyn-framework].

### A Thin Core Library-based wireless sensor network

This example composes a very basic home management system.
The wireless access point is assumed to be an OpenWRT router
that hosts a preinstalled AllJoyn router that allows for untrusted
Thin Core Library connections. This will allow all AJTCLs
participating in the system to connect to the router daemon.
Thin Core Library devices in this network could be temperature
sensors, motion detectors, light switch actuators, water heater
thermostats, furnace or air conditioning system temperature controllers.

As described above, the data fusion function for the example
network is performed by an application running on a general
purpose computer system with an integrated display. It is not
required that there be a dedicated general-purpose computer
in the network - data fusion can be accomplished in a distributed
fashion; however, having this component present in the network
allows us to illustrate how AJSCL and Thin Core Library devices
can interoperate. The "fuser" display could be mounted on a wall
in the home or it could simply be the display of a PC located
somewhere in the home. This display can, for example, provide
user interface elements corresponding to thermometers and
thermostats for individual rooms; or virtual light switches,
or motion detectors. The actual data fusion function algorithms
would determine when to turn lights, home heat, or air conditioner
on or off, or when to turn the water heater temperature up or
down in the most efficient way.

The first component considered is the OpenWRT router and is illustrated below.

![openwrt-router-hosting-standalone-router-daemon][openwrt-router-hosting-standalone-router-daemon]

**Figure:** OpenWRT router hosting a standalone AllJoyn router daemon

The router hosts a standalone AllJoyn router daemon, and is
illustrated as the bold horizontal line that represents a segment
of an AllJoyn distributed software bus.

There may be an AllJoyn service residing on the router's bus
segment that provides a way to configure the router and the
preinstalled router using the AllJoyn framework itself. In
addition, there are a number of empty slots that represent
untrusted connections to AJTCLs. Since this is a generic AllJoyn
router, the corresponding software bus may be extended to other
bus segments to form a distributed bus.

As described in the previous section, AJTCL devices will
perform discovery to search for a router to which they can connect.
Since an untrusted relationship is described here, the AllJoyn
router running on the OpenWRT router will be configured to
quietly advertise a generic name, perhaps org.alljoyn.BusNode,
implicitly indicating that the router is a node on an AllJoyn
distributed bus willing to host Thin Libraries.

AJTCLs representing the sensor nodes in the distributed network
are brought onto the wireless network through the onboarding
process. During this process, they may be assigned so-called
friendly names which give them meaning in the context of the
home. For example, one light bulb actuator (on-off-dim switch)
might be given the name "Kitchen" and another the name
"Living Room". The corresponding Thin Core Library nodes begin
discovery of their assigned router (perhaps org.alljoyn.BusNode)
and will then make connection attempts. Since the slots in the
preinstalled router running in the OpenWRT router are presumably
untrusted, the Thin Core Library connections are accepted on the
network.

![ajtcl-nodes-connected-openwrt-router][ajtcl-nodes-connected-openwrt-router]

**Figure:** AJTCL nodes connected to the OpenWRT AllJoyn router

Once the Thin Core Library Apps are connected to the bus segment
implemented in the OpenWRT router, they begin to advertise
their corresponding services. Presumably, there is also a
home control system onboarded to the wireless network provided
by the router. This device will be doing service discovery and
looking for the service provided by the Thin Core Libraries
in the system.

![openwrt-router-tcls-home-control-system][openwrt-router-tcls-home-control-system]

**Figure:** OpenWRT router, Thin Core Libraries, and home control system

Once the home control system has discovered the service advertisements
of one of AJTCLs, it will attempt to join a session with the
discovered Thin Core Library as discussed in [Introduction to the AllJoyn Framework][intro-alljoyn-framework].
This will result in the bus segments implemented on the router
and the home control system merging into a single virtual distributed bus.

![alljoyn-distributed-software-bus][alljoyn-distributed-software-bus]

**Figure:** AllJoyn distributed software bus

When the merged bus is fully formed, the devices attached to
the bus behave as generic AllJoyn clients or services. The
fact that AllJoyn Thin Core Library sensors and actuators
are actually embedded devices connected to an AllJoyn router
over TCP is not exposed to other components on the distributed
bus. The fact that the home control system is perhaps written
in Java and running on a general purpose computer running
Android is not exposed to other components on the distributed bus.
The clients and services simply make and implement remote method
calls and emit and receive signals.

The algorithms running in the data fusion node can now be
understood clearly. For example, one important AllJoyn signal
sent over the distributed bus might be something corresponding
to `CARBON-MONOXIDE-DETECTED`. This signal would be received
by the home control system (the data fuser) and it might react
by sending a remote method call to one of the actuator nodes
telling it to `TURN-FAN_ON`, it might send a remote method
call to another actuator node telling it to `SOUND-ALARM`,
and it might also send an SMS message to the homeowners letting
them know that excess carbon monoxide has been found in the home.

More mundane functions of the home control system might be
to make a remote method call to the furnace to reduce the
temperature of the home if nobody is present (as reported by
motion detectors and a daily schedule). The home control unit
may send a message to the water heater telling it to reduce
the temperature of the water during the work day or in the
middle of the night, but may make a method call to turn the
water temperature up in the middle of the night so that the
dishwasher can be run at a time corresponding to the least
expensive cost of electricity.

All of the signals that the home control system reacts to and
the method calls made are completely independent of the type
and location of the source and sink devices.

## Summary

AllJoyn is a comprehensive system designed to provide a framework
for deploying distributed applications on heterogeneous systems.
The AJTCL enables embedded devices to participate in an AllJoyn
distributed software bus and present themselves to the rest of
the system in such a way as to abstract out the details that
usually plague developers in such heterogeneous systems.
This approach lets application developers focus on the content
of their applications without requiring a large amount of
low-level embedded system or networking experience.

The AllJoyn system is designed to work together as a whole
and does not suffer from inherent impedance mismatches that
might be seen in ad-hoc systems built from various pieces.
We believe that the AllJoyn system can make development and
deployment of distributed applications that include embedded
system components significantly simpler than those developed
on other platforms.

## Learn More

To learn more about how to integrate the AllJoyn framework in
your development efforts, access the documentation and downloads
available on the [AllSeen Alliance web site](https://allseenalliance.org).

* Introductory guides - Describe AllJoyn technologies and concepts.
* Development guides - Provide guidelines to setting up
the build environment and provide solutions to specific
programming problems, including code snippets and explanations.
* API references - Provide details for working with the
AllJoyn source code and writing applications in each supported
programming language.
* Downloads - Software development kits (SDK) provide resources
to help users build, modify, test, and execute specific tasks.


[intro-alljoyn-framework]: /learn/core/standard-core
[intro-alljoyn-framework-conceptual-overview]: /learn/core/standard-core#conceptual-overview

[alljoyn-distributed-bus]: /files/learn/thin-core/alljoyn-distributed-bus.png
[alljoyn-distributed-bus-tcl]: /files/learn/thin-core/alljoyn-distributed-bus-tcl.png
[ajscl-layering]: /files/learn/thin-core/ajscl-layering.png
[ajscl-router-layering]: /files/learn/thin-core/ajscl-router-layering.png
[ajtcl-layering]: /files/learn/thin-core/ajtcl-layering.png
[minimalist-example-system]: /files/learn/thin-core/minimalist-example-system.png
[ajtcl-router-discovery]: /files/learn/thin-core/ajtcl-router-discovery.png
[ajtcl-connection-attempt]: /files/learn/thin-core/ajtcl-connection-attempt.png
[ajtcl-system-example]: /files/learn/thin-core/ajtcl-system-example.png
[ajtcl-service-discovery]: /files/learn/thin-core/ajtcl-service-discovery.png
[ajtcl-android-device-joins-session-service]: /files/learn/thin-core/ajtcl-android-device-joins-session-service.png
[openwrt-router-hosting-standalone-router-daemon]: /files/learn/thin-core/openwrt-router-hosting-standalone-router-daemon.png
[ajtcl-nodes-connected-openwrt-router]: /files/learn/thin-core/ajtcl-nodes-connected-openwrt-router.png
[openwrt-router-tcls-home-control-system]: /files/learn/thin-core/openwrt-router-tcls-home-control-system.png
[alljoyn-distributed-software-bus]: /files/learn/thin-core/alljoyn-distributed-software-bus.png
