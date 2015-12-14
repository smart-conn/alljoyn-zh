# AllJoyn&trade; Standard Core

## Overview

The AllJoyn framework is an open-source software system that
provides an environment for distributed applications running
across different device classes with an emphasis on mobility,
security, and dynamic configuration. The AllJoyn system handles
the hard problems inherent in heterogeneous distributed systems
and addresses the unique issues that arise when mobility enters
the equation. This leaves application developers free to concentrate
on the core problems of the application they are building.

The AllJoyn framework is "platform-neutral", meaning it was designed
to be as independent as possible of the specifics of the operating
system, hardware, and software of the device on which it is running.
fact, the AllJoyn framework was developed to run on Microsoft Windows,
Linux, Android, iOS, OS X, and OpenWRT.

The AllJoyn framework is designed with the concept of proximity and
mobility always in mind. In a mobile environment, devices will constantly
be entering and leaving the proximity of other devices, and underlying
network capacities can be changing as well.

The AllJoyn SDKs are available at (http://www.allseenalliance.org).

The types of applications that will use the AllJoyn framework are limited
only by the imagination of developers. Extending social networking is one
example. A user could define a profile with likes and interests.
Upon entering a location, the AllJoyn-enabled handset would immediately
discover other nearby peers with similar interests, create a communication
network between the peer devices, allow them to communicate, and exchange information.

The majority of handsets today have Wi-Fi integrated, so if two
users walk into a home or office that has a Wi-Fi hotspot, their
devices can connect to the underlying access point and transparently
take advantage of the additional network capacity. Additionally,
their devices can locate other devices in the proximity (defined
by the Wi-Fi coverage footprint), can discover additional services
on the other devices, and use those services, if desired. Further,
it is possible to leverage a mixed topology connection such that a
device taking advantage of the AllJoyn Thin LIbrary can be designated
to use Bluetooth as a transport. As such, once connected to a device
that runs the AllJoyn framework, the device can interact with the
applications on the Wi-Fi devices.

Enabling real-time multi-player gaming is another example of how the
AllJoyn framework might be used. For example, a multi-user game
can be accomplished using different device classes such as laptops,
tablets, and handsets; and different underlying network technologies
such as Wi-Fi. The details of the infrastructure management are all
handled by the AllJoyn framework, allowing the game author to focus
on the design and implementation of the game, rather than dealing
with the complexities of the peer-to-peer networking.

As the AllJoyn ecosystem expands, one can imagine any number of
applications. For example:

* Create a playlist consisting of music, and stream the songs
to an AllJoyn-enabled car stereo system, or store them on a
home stereo (subject to digital rights management)
* Sync recent photos or other media to an AllJoyn-enabled
digital picture frame or television upon returning home from
an event or trip
* Control home appliances such as televisions, DVRs, or game consoles
* Interact and share content with laptops and desktop
computers in the area
* Engage in project collaboration between colleagues and students
in enterprise and educational settings
* Provide proximity-based services like distributing coupons or vcards

## Benefits of the AllJoyn Framework

As mentioned, the AllJoyn framework is a platform-neutral system
that is designed to simplify proximity networking across heterogeneous
distributed mobile systems.

Heterogeneous in this case means not only different devices, but
different kinds of devices (e.g., PCs, handsets, tablets, consumer
electronics devices) running on different operating  systems,
using different communication technologies.

### Open source

The AllJoyn framework is being developed as an open source project.
This means that all of the AllJoyn codebase is available for
inspection, and developers are encouraged to contribute
additions and enhancements. If the AllJoyn framework is
missing a feature, you can contribute. If you run into a snag
using the AllJoyn framework, or have a technical question,
other participants in the open source community are ready
and willing to provide help and guidance. The AllJoyn codebase
is available at (http://www.allseenalliance.org).

### Operating system independence

The AllJoyn framework provides an abstraction layer allowing
AllJoyn framework code and its applications to run on multiple
OS platforms. As of this writing, the AllJoyn framework supports
most standard Linux distributions including Ubuntu, and runs on
Android 2.3 (Gingerbread) and later smartphones and tablets. The
AllJoyn framework code also runs and is tested and validated on
commonly available versions of the Microsoft Windows operating
system including Windows XP, Windows 7, Windows RT, and Windows 8.
Additionally, the AllJoyn framework code runs on Apple operating
systems iOS and OS X, and on embedded operating systems such as OpenWRT.

### Language independence

Currently, developers may create applications using C++,Java, C#,
JavaScript, and Objective-C.

### Physical network and protocol independence

There are many technologies available to networked devices.
The AllJoyn framework provides an abstraction layer that
defines clean interfaces to the underlying network stacks
and makes it relatively easy for a competent software engineer
to add new networking implementations.

For example, as of this writing, the Wi-Fi Alliance has recently
released a specification for Wi-Fi Direct, which will allow
for point-to-point Wi-Fi connectivity. A networking module for
Wi-Fi Direct is actively being developed that will transparently
add Wi-Fi Direct and its pre-association discovery mechanisms
to the available networking options for AllJoyn developers.

### Dynamic configuration

Often, as a mobile device makes its way through the various
locations it encounters during its lifetime, associations with
networks may come and go. This means that IP (Internet Protocol)
addresses may change, network interfaces may become unusable,
and services may be transitory.

The AllJoyn framework notices when old services are lost and
new services appear, and forms new associations when required.
The AllJoyn framework is primed and ready as an application
layer for Wi-Fi Hotspot 2.0 - a technology that aims to bring
the roaming transparency of cell phones and cell towers to Wi-Fi hotspots.

### Service advertisement and discovery

Whenever devices need to communicate, there must be some form
of service advertisement and discovery. In the old days of
static networks, human administrators made explicit arrangements
to enable devices to communicate. More recently, the concepts of
zero configuration networks have been popularized, especially
with Apple Bonjour, and Microsoft Universal Plug and Play.
We also see existing technology-specific discovery mechanisms
available such the Bluetooth Service Discovery Protocol and
emerging mechanisms such as the Wi-Fi Direct P2P Discovery
specification. The AllJoyn framework provides a service
advertisement and discovery abstraction that simplifies the
process of locating and consuming services.

### Security

The natural model for security in distributed applications is
application-to-application. Unfortunately, in many cases, the
network security model does not match this natural arrangement.
For example, the Bluetooth protocol requires pairing between
devices. Using this approach, once devices are paired, all
applications on both devices are authorized. This may not be
desirable when considering something more capable than a Bluetooth
headset. For example, if two laptops are connected over Bluetooth,
a much finer granularity is necessary. The AllJoyn framework is
designed to provide extensive support for complex security models
such as this, with an emphasis on application-to-application communication.

### Object model and remote method invocation

The AllJoyn framework utilizes an easy-to-understand object model
and Remote Method Invocation (RMI) mechanism. The AllJoyn model
re-implements the wire protocol set forth by the D-Bus specification
and extends the D-Bus wire protocol to support distributed devices.

### Software componentry

Along with a standard object model and wire protocol comes the
ability to standardize various interfaces into components.
In much the same way that a Java Interface declaration provides
a specification to interact with a local instantiation of an
implementation, the AllJoyn object model provides a language-independent
specification to interact with a remote implementation.

Using a specification, many interface implementations can
be considered, thereby enabling standard definitions for
application communication. This is the enabling technology
for software componentry. Software components are at the
heart of many modern systems, and are especially visible
in systems such as Android, which defines four primary
component types as the only way to participate in the Android
Application Framework; or in Microsoft systems which use
descendants of the Component Object Model (COM) system.

We expect that a rich "sea" of interface definitions will
emerge in order to enable the scenarios described in [Overview][overview].
The AllJoyn project expects to work with users to define and
publish standard interfaces and support the sharing of implementations.

## Conceptual Overview

The AllJoyn framework contains a number of abstractions
used to help understand and relate the various pieces.
There is only a small number of key abstractions that one
must know in order to understand AllJoyn-based systems.

This section provides a high-level view of the AllJoyn framework
to provide a foundation for follow-on documents such as the
detailed API documentation.

### Remote Method Invocation

Distributed systems are groups of autonomous computers
communicating over some form of network in order to achieve
a common goal. Consider the ability of a program running in
one address space on one machine to call a procedure located
in another address space on a physically separate machine as
if it were local. This is usually accomplished through
Remote Procedure Call (RPC) or, if object-oriented concepts
are in play, RMI or Remote Invocation (RI).

The basic model in an RPC exchange involves a *client*, which
is the caller of the RPC, and a server (called a service in
the AllJoyn model), which actually executes the desired remote
procedure. The caller executes a client stub that looks just
like a local procedure on the local system. The client stub
packages up the parameters of its procedure (called marshaling
or serializing the parameters) into some form of message and
then calls in to the RPC system to arrange delivery of the
message over some standard transport mechanism such as the
Transmission Control Protocol (TCP). At the remote machine,
there is a corresponding RPC system running, which unmarshals
(deserializes) the parameters and delivers the message to a
server stub that arranges to execute the desired procedure.
If the called procedure needs to return any information, a
similar process is used to convey the return values back to
the client stub, which in turn returns them to the original caller.

Note that it is not required that a given process only implement
a client personality or a service personality. If two or more
processes implement the same client and service aspects,
they are considered peers. In many cases, AllJoyn applications
will implement similar functionality and be considered peers.
The AllJoyn framework supports both classic client and service
functions and also peer-to-peer networking.

### AllJoyn bus

The most basic abstraction of the AllJoyn system is the
AllJoyn bus. It provides a fast, lightweight way to move marshaled
messages around the distributed system. One can view the AllJoyn bus
as a kind of "freeway" over which those messages flow.
The following figure shows what an instance of an AllJoyn bus
on a single device might look like, conceptually.

![prototypical-alljoyn-bus][prototypical-alljoyn-bus]

**Figure:** Prototypical AllJoyn bus

Points about the prototypical AllJoyn bus are detailed below.

* The bus itself is shown as the thick horizontal dark line.
The vertical lines can be thought of as "exits" and are the
sources and/or destinations of messages that are flowing over the bus.
* The connections to the bus are depicted as hexagons. Just as
the exits on a freeway are typically assigned numbers, each
connection is assigned a unique connection name. A simplified
form of the connection name is used here for clarity.
* In many cases, the connections to the bus can be thought of
as co-resident with processes. Therefore, the unique connection name
`:1.1` may be assigned to a connection in a process running some
instance of an application, and the unique connection name
`:1.4` may be assigned to a connection in a process running an
instance of some other application. The goal of the AllJoyn
bus is to allow the two applications to communicate without
having to deal with the details of the underlying mechanisms.
One of the connections can be thought of as the client stub,
and the other side can fulfill the duties of the service stub.

The prototypical AllJoyn bus figure shows an instance of an AllJoyn bus and
illustrates how a software bus can provide interprocess communication
between components attached to the bus. The AllJoyn bus is
typically extended across devices as shown in the following figure.
A communication link between the segment of the logical bus
residing on the Smartphone and the components residing on the
Linux host is formed when required by the components.

![device-device-comm][device-device-comm]

**Figure:** Device-to-device communication handled by the AllJoyn framework

The management of this communication link is handled by the
AllJoyn system and may be formed using a number of underlying
technologies such as Wi-Fi or Wi-Fi Direct. There may be multiple
devices involved in hosting the AllJoyn bus, but this is
transparent to the users of the distributed bus. To a component
on the bus, a distributed AllJoyn system looks like a bus
that is local to the device.

The following figure shows how the distributed bus may appear
to a user of the bus. A component (for example, the Smartphone
connection labeled `:1.1`) can make a procedure call to the
component labeled `:1.7` on the Linux host without having to
worry about the location of that component.

![dist-bus-local-bus][dist-bus-local-bus]

**Figure:** A distributed AllJoyn bus appears as a local bus

### Bus router

The device-to-device communication figure illustrates that
the logical distributed bus is actually split up into a number
of segments, each running on a different device. The AllJoyn
functionality that implements these logical bus segments is
called an AllJoyn router.

The term daemon is commonly used in Unix-derived systems to
describe programs that run to provide some needed functionality
to the computer system. On a Linux system instead of saying daemon
we call it the standalone router. In Windows systems, the term
service is more typically used, however we refer to it as the AllJoyn router.

![bubble-diagram-bus][bubble-diagram-bus]

**Figure:** Relating bubble diagrams to the bus

In order to visualize the AllJoyn router, it is useful to create
a bubble diagram. Consider two AllJoyn bus segments, one residing
on a Smartphone and one on a Linux Host, as shown in previous figure.
The connections to the bus are labeled as clients (C) and
services (S) using the sense of clients and services in the RMI model.
The AllJoyn router that implements the core of the distributed
bus is labeled (D). The components of the previous figure are typically
translated into the illustration shown in the folliwing figure.

![alljoyn-bubble-diagram][alljoyn-bubble-diagram]

**Figure:** AllJoyn bubble diagrams

The bubbles can be viewed as computer processes running on a
distributed system. The two client (C) and the service (S)
processes on the left are running on the Smartphone. These three
processes communicate with an AllJoyn router running on the Smartphone
which implements the local segment of the distributed AllJoyn bus.
On the right side, there is a router which implements the local
segment of the AllJoyn bus on the Linux Host.

These two routing nodes coordinate the message flow across the
logical bus, which appears as a single entity to the connections,
as shown in the distributed AllJoyn bus figure. Similar to the configuration on the Smartphone,
there are two service components and a client component on the Linux host.

In this configuration, client component C1 can make remote method
calls to service component S1 as if it were a local object.
Parameters are marshaled at the source and routed off of the
local bus segment by the router residing on the Smartphone.
The marshaled parameters are sent over the network link
(transparently from the perspective of the client) to the
routing node on the Linux host. The AllJoyn router running on
the Linux host determines that the destination is S1 and arranges
to have the parameters unmarshaled and the remote method invoked
on the service. If return values are expected, the process is
reversed to communicate the return values back to the client.

Since the standalone routers are running in a background process
and the clients and services are running in separate processes,
there must be a "representative" of the routers in each of those
separate processes. The AllJoyn framework calls these
representatives bus attachments.

### Bus attachments

Every connection to the AllJoyn bus is mediated by a specific
AllJoyn component called a bus attachment. A bus attachment lives
in each process that has a need to connect to the AllJoyn software bus.

An analogy is often drawn between hardware and software when
discussing software components. One can think of a local segment
of a distributed AllJoyn bus in much the same way as one thinks of
the hardware backplane bus in a desktop computer. The hardware bus
itself moves electronic messages and has attachment points called
connectors into which one plugs cards. The analogous function of
the connector in the AllJoyn framework is the bus attachment.

An AllJoyn bus attachment is a local language-specific object that
represents the distributed AllJoyn bus to a client, service, or peer.
For example, there is an implementation of the bus attachment
functionality provided for users of the C++ language, and there
is an implementation of the same bus attachment functionality
provided for users of the Java language. As the AllJoyn framework
adds language bindings, more of these language-specific implementations
will become available.

### Bus methods bus properties and bus signals

The AllJoyn framework is fundamentally an object-oriented system.
In object-oriented systems, one speaks of invoking methods on objects
(thus the term Remote Method Invocation when speaking of distributed
systems). Objects in the object-oriented programming sense have members.
Classically, these are object methods or properties, which are known
as BusMethods and BusProperties in the AllJoyn framework. The AllJoyn
framework also has the concept of a BusSignal, which is an asynchronous
notification of some event or state change in an object.

In order to transparently arrange for communication between clients,
services, and peers, there must be some specification of the parameter
ordering for bus methods and bus signals, and some form of type information
for bus properties. In computer science, the description or definition of
the types of the inputs and outputs of a method or signal is called the
type signature.

Type signatures are defined by character strings. Type signatures can
describe character strings, all of the basic number types available
in most programming languages, and composite types such as arrays and
structures built up from these basic types. The specific assignment
and use of type signatures is beyond the scope of this introduction,
but the type signature of a bus method, signal, or property conveys
to the underlying AllJoyn system how to convert the passed parameters
and return values to and from the marshaled representation over the bus.

### Bus interfaces

In most object-oriented programming systems, collections of methods
or properties are composed into groups that have some inherent
common relationship. A unified declaration of this collection
of functions is called an interface. The interface serves as a
contract between an entity implementing the interface specification
and the outside world. As such, interfaces are candidates for
standardization by appropriate standards bodies. Specifications
for numerous interfaces for services ranging from telephony to
media player control can be found on various web sites. Interfaces
specified this way are described in XML as per the D-Bus specification.

An interface definition collects a group of bus methods, bus signals,
and bus properties along with their associated type signatures into
a named group. In practice, interfaces are implemented by client,
service, or peer processes. If a given named interface is
implemented, there is an implicit contract between the implementation
and the outside world that the interface supports all of the
bus methods, bus signals, and bus properties of the interface.

Interface names typically take the form of a reversed domain name.
For example, there are a number of standard interfaces that
the AllJoyn framework implements. One of the AllJoyn standard
interfaces is the `org.alljoyn.Bus` interface which routers
implement and which provides some of the basic functionality
for bus attachments.

It is worth noting that the interface name is simply a string
in a relatively free-form namespace and that other namespaces
may have a similar look. The interface name string serves a
specific function that should not be confused with other similar
strings, in particular bus names. For example, `org.alljoyn.sample.chat`
may be a bus name which is the constant, unchanging name that
a client will search for. It may also be the case that
`org.alljoyn.sample.chat` is the interface name that defines
the methods, signals and properties available in a bus object
associated with a bus attachment of the specified bus name.
The existence of an interface with the given interface name
is implied by the existence  of the bus name; however, they
are two completely different things that can sometimes look
exactly the same.

### Bus objects and object paths

The bus interface provides a standard way to declare an
interface that works across the distributed system. The bus
object provides the scaffolding into which an implementation
of a given interface specification may be placed. Bus objects
live in bus attachments and serve as endpoints of communication.

Since there may be multiple implementations of a specific
interface in any particular bus attachment, there must be
additional structure to differentiate these interface implementations.
This is provided by an object path.

Just as an interface name is a string that lives in an interface
namespace, the object path lives in a namespace. The namespace
is structured as a tree, and the model for thinking about
paths is a directory tree in a filesystem. In fact, the path
separator in an object path is the slash character (/), just
as in a Unix filesystem. Since bus objects are implementations
of bus interfaces, object paths might follow the naming
convention of the corresponding interface. In the case of an
interface defining a disk controller interface (for example,
`org.freedesktop.DeviceKit.Disks`), one could imagine a case
where multiple implementations of this interface were described
by the following object paths corresponding to an implementation
of the interface for two separate physical disks in a system:

```sh
/org/freedesktop/DeviceKit/Disks/sda1

/org/freedesktop/DeviceKit/Disks/sda2
```

### Proxy bus object

Bus objects on an AllJoyn bus are accessed through proxies.
A proxy is a local representation of a remote object that is
accessed through the bus. Proxy is a common term that is not
specific to the AllJoyn system, however you will often encounter
the term ProxyBusObject in the context of the AllJoyn framework
to indicate the specific nature of the proxy - that it is a
local proxy for a remotely located bus object.

The ProxyBusObject is the portion of the low-level AllJoyn code
that enables the basic functionality of an object proxy.

Typically, the goal of an RMI system is to provide a proxy that
implements an interface which looks just like that of the remote
object that will be called. The proxy object implements the
same interface as the remote object, but drives the process
of marshaling the parameters and sending the data to the service.

In the AllJoyn framework, the client and service software,
often through specific programming language bindings, provides
the actual user-level proxy object. This user-level proxy object
uses the capabilities of the AllJoyn proxy bus object to
accomplish its goal of local/remote transparency.

### Bus names

A connection on the AllJoyn bus acting as a service provides
implementations of interfaces described by interface names.
The interface implementations are organized into a tree of
bus objects in the service. Clients wishing to consume the
services do so via proxy objects, which use lower-level
AllJoyn proxy bus objects to arrange for delivery of bus method-,
bus signal- and bus property-related information across the
logical AllJoyn bus.

In order to complete the addressing picture of the bus,
connections to the bus must have unique names. The AllJoyn
system assigns a unique temporary bus name to each bus attachment.
However, this unique name is autogenerated each time the service
connects to the bus and is therefore unsuitable for use as
a persistent service identifier. There must be a consistent
and persistent way to refer to services attached to the bus.
These persistent names are referred to as *well-known names*.

Just as one might refer to a host system on the Internet by
a domain name that does not change over time (e.g., quicinc.com),
one refers to a functional unit on the AllJoyn bus by its well-known
bus name. Just as interface names appear to be reversed domain names,
bus names have the same appearance. Note that this is the source of
some confusion, since interface names and well-known bus names
are often chosen for convenience to be the same string.
Remember that they serve distinct purposes: the interface name
identifies a contract between the client and the service that
is implemented by a bus object living in a bus attachment;
and the well-known name identifies the service in a consistent
way to clients wishing to connect to that attachment.

To use a well-known name, an application (by way of a bus
attachment) must make a request to the bus router to use that
name. If the well-known name is not already in use by another
application, exclusive use of the well-known name is granted.
This is how, at any time, well-known names are guaranteed to
represent unique addresses on the bus.

Typically, a well-known name implies a contract that the associated
bus attachment implements a collection of bus objects and therefore
some concept of a usable service. Since bus names provide a unique
address on the distributed bus, they must be unique across the bus.
For example, one could use the bus name, `org.alljoyn.sample.chat`,
which would indicate that a bus attachment of the same name would
be implementing a chat service. By virtue of the fact that it
has taken that name, one could infer that it implements a
corresponding `org.alljoyn.sample.chat` interface in a bus
object located at object path `/org/alljoyn/sample/chat`.

The problem with this is that in order to "chat", one would
expect to see another similar component on the AllJoyn bus
indicating that it also supports the chat service. Since bus
names must uniquely identify a bus attachment, there is a
requirement to append some form of suffix to ensure uniqueness.
This could take the form of a user name, or a unique number.
In the chat example, one could then imagine multiple bus attachments:

```sh
org.alljoyn.sample.chat.bob

org.alljoyn.sample.chat.carol
```

In this case, the well-known name prefix `org.alljoyn.sample.chat.`
acts as the service name, from which one can infer the existence
of the chat interface and object implementations. The suffixes,
`bob` and `carol`, serve to make the instance of the well-known name unique.

This leads to the question of how services are located in the
distributed system. The answer is via service advertisement and discovery by clients.

### Advertisements and discovery

There are two facets to the problem of service advertisement
and discovery. As described above, even if the service resides
on the local segment of the AllJoyn bus, one needs to be able
to see and examine the well-known names of all of the bus attachments
on the bus in order to determine that one of them has a specific
service of interest. A more interesting problem occurs when
one considers how to discover services that are not part of
an existing bus segment.

Consider what might happen when one brings a device running
the AllJoyn framework into the proximity of another. Since the
two devices have been physically separated, there is no way for
the two involved bus routers to have any knowledge of the other.
How do the routing nodes determine that the other exists, and
how do they determine that there is any need to connect to
each other and form a logical distributed AllJoyn bus?

The answer is through the AllJoyn service advertisement and
discovery facility. When a service is started on a local device,
it reserves a given well-known name and then advertises its
existence to other devices in its proximity. The AllJoyn framework
provides an abstraction layer that makes it possible for a
service to do an advertise operation that may be communicated
transparently via underlying technologies, such as Wi-Fi, Wi-Fi
Direct, or other/future wireless transports. Neither the client
nor the service require any knowledge of how these advertisements
are managed by the underlying technology.

For example, in a contacts-exchanging application, one instance
of the application may reserve the well-known name
`org.alljoyn.sample.contacts.bob` and advertise the name.
This might result in one or more of the following: a UDP
multicast over a connected Wi-Fi access point, a pre-association
service advertisement in Wi-Fi Direct, or a Bluetooth Service
Discovery Protocol message. The mechanics of how the advertisement
is communicated do not necessarily concern the advertiser.
Since a contacts-exchange application is conceptually a
peer-to-peer application, one would expect the second phone to
also advertise a similar service, for example, `org.alljoyn.sample.contacts.carol`.

Client applications may declare their interest in receiving
advertisements by initiating a discovery operation. For example,
it may ask to discover instances of the contacts service as
specified by the prefix `org.alljoyn.sample.contacts`. In this case,
both devices would make that request.

As soon as the phones enter the proximity of the other, the
underlying AllJoyn systems transmit and receive the advertisements
over the available transports. Each will automatically receive
an indication that the corresponding service is available.

Since a service advertisement can receive over multiple
transports, and in some cases it requires additional low-level work
to bring up an underlying communication mechanism, there is another
conceptual part to the use of discovered services. This is the communication session.

### Sessions

The concepts of bus names, object paths, and interface names have
been previously discussed. Recall that when an entity connects to
an AllJoyn bus, it is assigned a unique name. Connections
(bus attachments) may request that they be granted a well-known name.
The well-known name is used by clients to locate or discover
services on the bus. For example, a service may connect to an
AllJoyn bus and be assigned the unique name `:1.1` by the bus.
If a service wants other entities on the bus to be able to find it,
the service must request a well-known name from the bus,
for example, `com.companyA.ProductA` (remember that a unique
instance qualifier is usually appended).

This name implies at least one bus object that implements some
well-known interface for it to be meaningful. Usually, the
bus object is identified within the connection instance by a
path with the same components as the well-known name (this is
not a requirement, it is only a convention). In the example,
the path to the bus object corresponding to the bus name
`com.companyA.ProductA` might be `/com/companyA/ProductA`.

In order to understand how a communication session from a client
bus attachment to a similar service attachment is formed and to
provide an end-to-end example, it is useful to compare and contrast
the AllJoyn mechanism to a more familiar mechanism.

#### Postal address analogy

In the AllJoyn framework, a service requests a human-readable name
so it can advertise itself with a well-known and well-understood label.
Well-known names must be translated into unique names for the
underlying network to properly route information, for example:

```
Well-known-name:org.alljoyn.sample.chat

Unique name::1.1
```

This tells us that the well-known name advertised as
`org.alljoyn.sample.chat` corresponds to a bus attachment that
has been assigned the unique name `:1.1`. One can think of this
in the same way as a business has a name and a postal address.
To continue the analogy, a common situation arises when a
business is located in a building along with other businesses.
In such a situation, one might find a business address further
qualified by a suite number. Since AllJoyn bus attachments are
capable of providing more than one service, there must also be
a way to identify more than one destination on a particular attachment.
A "contact port number" corresponds to the suite number destination
in the postal address analogy.

Just as one may send a letter by the national mail system
(U.S. Post Office, La Poste Suisse) or a private company
(Federal Express, United Parcel Service) and by different
urgencies (overnight, two-day, overland delivery), when contacting
a service using the AllJoyn framework, one must specify
certain desired characteristics of the network connection to
provide a complete delivery specification (e.g., reliably
delivered messages, reliably delivered unstructured data,
or unreliably delivered unstructured data).

Notice the separation of the address information and the
delivery information in the example  above. Just as one can
contemplate choosing several ways to get a letter from one place
to another, it will become evident that one can choose from several
ways to get data delivered using the AllJoyn system.

#### The AllJoyn session

Just as a properly labeled postal letter has "from" and "to"
addresses, an AllJoyn session requires equivalent "from" and "to"
information. In the case of an AllJoyn system, the from address
would correspond to the location of the client component and
the to address would relate to the service.

Technically, these from or to addresses, in the context of
computer networking, are called half-associations.
In the AllJoyn framework, this to (service) address has the following form:

```c
{session options, bus name, session port}
```

The first field, session options, relates to how the data is
moved from one side of the connection to the other. In an
IP network, choices might be TCP or UDP. In the AllJoyn framework,
these details are abstracted and so choices might be,
"message-based", "unstructured data", or "unreliable unstructured data".
A service destination is specified by the well-known name the
corresponding bus attachment has requested.

Similar to the suite number in the postal example, the AllJoyn
model has the concept of a point of delivery "inside" the
bus attachment. In the AllJoyn framework, this is called a
session port. Just as a suite number has meaning only within
a given building, the session port has meaning only within
the scope of a given bus attachment. The existence and values
of contact ports are inferred from the bus name in the same
way that underlying collections of objects and interfaces are inferred.

The from address, corresponding to the client information, is
similarly formed. A client must have its own half-association
in order to communicate with the service.

```c
{session options, unique name, session ID}
```

It is not required for clients to request a well-known bus name,
so they provide their unique name (such as `:1.1`). Since clients
do not act as the destination of a session, they do not provide
a session port, but are assigned a session ID when the connection
is established. Also during the session establishment procedure,
a session ID is returned to the service. For those familiar with
TCP networking, this is equivalent to the connection establishment
procedure used in TCP, where the service is contacted over a
well-known port. When the connection is established, the client
uses an ephemeral port to describe a similar half-association.

During the session establishment procedure, the two half-associations
are effectively joined:

```c
{session options, bus name, session port}	Service

{session options, unique name, session ID}	Client
```

Notice that there are two instances of the session options.
When communication establishment begins, these may be viewed
as supported session options provided by the service and
requested session options provided by the client. Part of
the session establishment procedure consists of negotiating
an actual final set of options to be used in the session.
Once a session has been formed, the half-associations of
the client and service side describe a unique AllJoyn
communication path:

```c
{session options, bus name, unique name, session ID}
```

During the session establishment procedure, a logical networking
connection is formed between the communicating routing nodes.
This may result in the creation of a wireless radio topology
management operation. If such a connection already exists,
it is re-used. A newly created underlying router-to-router
connection is used to perform initial security checks, and once
this is complete, the two routers have effectively joined the
two separate AllJoyn software bus segments into the larger virtual bus.

Because issues regarding end-to-end flow control of the underlying
connection must be balanced with topological concerns in some
technologies, the actual connection between the two communicating
endpoints (the "from" client and the "to" service) may or may
not result in a separate communication channel being formed.
In some cases it is better to flow messages over an ad hoc
topology and in some cases it may be better to flow messages
directly over a new connection (TCP/IP). This is another of the
situations that may require deep understanding of the underlying
technology to resolve, and which the AllJoyn framework happily
accomplishes for you. A user need only be aware that messages
are routed correctly over a transport mechanism that meets
the abstract needs of the application.

#### Self-join feature

In AllJoyn releases up to R14.06, it was impossible for applications
to join a session they themselves hosted. For applications that consume
information or services they themselves also provide, this created an
asymmetry: they had to treat the bus objects they hosted themselves
differently from those hosted by other peers. The self-join feature
removes this asymmetry by allowing applications to join the sessions
they themselves host. Consequently, a locally hosted bus object can be
treated in exactly the same way as a remotely hosted bus object.

#### Determining the presence of a peer - pinging and auto-pinging

Sometimes, a application needs to know which peers are present on the communication
channel ("the wire") and which aren't.  For this reason, a PING API was introduced in
version 14.06. This PING API allows to determine whether a peer is up or not.
However, for this API, the responsibility for using the PING API was with the
Application, which periodically needed to ping the peers. From Release 14.12 onwards,
an automatic PING or Auto-Pinger is introduced. This Auto-Pinger performs the
periodic peer detection, relieving  the application of having to do it.

### Bringing it all together

The AllJoyn framework aims to provide a software bus that
manages the implementation of advertising and discovering services,
providing a secure environment, and enabling location-transparent
remote method invocation. A traditional client/service arrangement
is enabled, and peer-to-peer communications follow by combining
the aspects of client and services.

The most basic abstraction in the AllJoyn framework is the
software bus that ties everything together. The virtual distributed
bus is implemented by AllJoyn routing nodes which are background
programs running on each device. Clients and services (and peers)
connect to the bus via bus attachments. The bus attachments
live in the local processes of the clients and services and
provide the interprocess communication that is required to
talk to the local AllJoyn router.

Each bus attachment is assigned a unique name by the system
when it connects. A bus attachment can request to be granted
a unique human-readable bus name that it can use to advertise
itself to the rest of the AllJoyn world. This well-known bus
name lives in a namespace that looks like a reversed domain
name and encourages self-management of the namespace.
The existence of a bus attachment of a specific name implies
the further existence of at least one bus object that implements
at least one interface specified by a name. Interface names are
assigned out of a namespace that is similar, but has a different
meaning than bus names. Each bus object lives in a tree structure
rooted at the bus attachment and described by an object path
that looks like a Unix filesystem path.

The following figure shows a hypothetical arrangement of how
all of these pieces are related.

![hypothetical-alljoyn-bus-instance][hypothetical-alljoyn-bus-instance]

**Figure:** Overview of a hypothetical AllJoyn bus instance

At the center is the dark line representing the AllJoyn bus.
The bus has "exits" which are the BusAttachments assigned
the unique names `:1.1` and `:1.4`. In the figure, the BusAttachment
with the unique name of `:1.1` has requested to be known as
`org.alljoyn.samples.chat.a` and has been assigned the corresponding
well-known bus name. The "a" has been added to ensure that
the bus name is unique.

There are a number of things implied by taking on that bus name.
First, there is a tree structure of bus objects that resides
at different paths. In this hypothetical example, there are
two bus objects. One is at the path `/org/alljoyn/samples/chat/chat`
and which presumably implements an interface suitable for chatting.
The other bus object lives at the path `/org/alljoyn/samples/chat/contacts`
and implements an interface named `org.alljoyn.samples.chat.contacts`.
Since the given bus object implements the interface, it must
provide implementations of the corresponding bus methods,
bus signals, and bus properties.

The number 42 represents a contact session port that clients
must use to initiate a communication session with the service.
Note that the session port is unique only within the context of
a particular bus attachment, so the other bus attachment in the
figure may also use 42 as its contact port as shown.

After requesting and being granted the well-known bus name,
a service will typically advertise the name to allow clients
to discover its service. The following figure shows a service making an
advertise request to its local router. The router, based on
input from the service, decides what network medium-specific
mechanism it should use to advertise the service and begins doing so.

![service-performs-advertise][service-performs-advertise]

**Figure:** Service performs an Advertise

When a prospective client wants to locate a service for consumption,
it issues a find name request. Its local router device, again
based on input from the client, determines the best way to
look for advertisements and probes for advertisements.

![client-requests-find-name][client-requests-find-name]

**Figure:** Client requests to Find Name

Once the devices move into proximity, they begin hearing
each other's advertisements and discovery requests over whichever
media are enabled. The following figure shows how the router hosting the
service hears the discovery requests and responds.

![router-reports-found-name][router-reports-found-name]

**Figure:** Router reports Found Name

Finally, the following figure shows the client receiving an indication
that there is a new router in the area that is hosting the desired service.

![client-discovers-service][client-discovers-service]

**Figure:** Client discovers service

The client and service sides of the developing scenario both
use methods and callbacks on their bus attachment object to
make the requests to orchestrate the advertisement and discovery
process. The service side implements bus objects to provide
its service, and the client will expect to use a proxy object
to provide an easy-to-use interface for communicating with
the service. This proxy object will use an AllJoyn ProxyBusObject
to orchestrate communication with the service and provide
for the marshaling and unmarshaling of method parameters
and return values.

Before remote methods can be called, a communication session
must be formed to effectively join the separate bus segments.
Advertisement and discovery are different from session establishment.
One can receive an advertisement and take no action. It is
only when an advertisement is received, and a client decides
to take action to join a communication session, that the
buses are logically joined into one. To accomplish this,
a service must create a communication session endpoint and
advertise its existence; and a client must receive that
advertisement and request to join the implied session.
The service must define a half-association before it advertises
its service. Abstractly this will look something like the following:

```c
{reliable IP messages, org.alljoyn.samples.chat.a, 42}
```

This indicates that it will talk to clients over a reliable
message-based transport, has taken the well-known bus name
indicated, and expects to be contacted at session port 42.
This is the situation seen in the hypothetical bus instance figure.

Assume that there is a bus attachment with the unique
name `:2.1` wanting to connect from a physically remote
routing node. It will provide its half association to the
system and a new session ID will be assigned and communicated
to both sides of the conversation:

```c
{reliable IP messages, org.alljoyn.samples.chat.a, :2.1, 1025}
```

The new communication session will use a reliable messaging
protocol implemented using the IP protocol stack which will
exist between the bus attachment named `org.alljoyn.samples.chat.a`
(the service) and the bus attachment named :2.1 (the client).
The session ID used to describe the session is assigned by
the system and is 1025 in this case.

As a result of establishing the end-to-end communication
session, the AllJoyn system takes whatever actions are
appropriate to create the virtual software bus shown in
the distributed bus figure. Note that this is a virtual picture, and what
may have actually happened is that a Wi-Fi Direct peer-to-peer
connection was formed to host a TCP connection, or a Wireless
access point was used to host a UDP connection, depending
on the provided session options. Neither the client nor
the service is aware that this possibly very difficult
job was completed for them.

At this point, authentication can be attempted if desired
and then the client and service begin communicating using the RMI model.

Of course, the scenario is not limited to one client on one
device and one service on another device. There may be any number
of clients and any number of services (up to a limit of device or
network capacity) combining to accomplish some form of
cooperative work. Bus attachments may take on both client
and service personalities and implement peer-to-peer services.
AllJoyn routers take on the hard work of forming a manageable
logical unit out of many disparate components and routing messages.
Additionally, the nature of the interface description and
language bindings allow interoperability between components
written in different programming languages.

## High-Level System Architecture

From the perspective of a user of the AllJoyn system, the most
important piece of the architecture to understand is that of
a client, service, or peer. From a system perspective, there
is really no difference between the three basic use cases;
there are simply different usage patterns of the same system-provided functionality.

### Clients, services, and peers

The following figure shows the architecture of the system from a user
(not AllJoyn router) perspective.

![client-service-peer-arch][client-service-peer-arch]

**Figure:** Basic client, service, or peer architecture

At the highest level are the language bindings. The AllJoyn system
is written in C++, so for users of this language, no bindings
are required. However, for users of other languages, such
as Java or JavaScript, a relatively thin translation layer
called a language binding is provided. In some cases, the binding
may be extended to offer system-specific support. For example,
a generic Java binding will allow the AllJoyn system to be
used from a generic Java system that may be running under
Windows or Linux; however, an Android system binding may
also be provided which more closely integrates the AllJoyn system
into Android-specific constructs such as a service component in
the Android application framework.

The system and language bindings are built on a layer of helper
objects which are designed to make common operations in the
AllJoyn system easier. It is possible to use much of the AllJoyn
system without using these helpers; however, their use is
encouraged since it provides another level of abstract interface.
The bus attachment, mentioned in the previous chapters, is a
critical helper without which the system is unusable. In addition
to the several critical functions provided, a bus attachment
also provides convenience functions to make management of
and interaction with the underlying software bus much easier.

Under the helper layer is the messaging and routing layer.
This is the home of the functionality that marshals and
unmarshals parameters and return values into messages that
are sent across the bus. The routing layer arranges for the
delivery of inbound messages to the appropriate bus objects
and proxies, and arranges for messages destined for other
bus attachments to be sent to an AllJoyn router for delivery.

The messaging and routing layer talks to an endpoint layer.
In the lower levels of the AllJoyn system, data is moved
from one endpoint to another. This is an abstract communication
endpoint from the perspective of the networking code.
Networking abstractions are fully complete at the top of the
endpoint's layer, where there is essentially no difference
between a connection over a non Wi-Fi radio (Bluetooth) and
a connection over a wired Ethernet.

Endpoints are specializations of transport mechanism-specific
entities called transports, which provide basic networking
functionality. In the case of a client, service, or peer,
the only network transport used is the local transport.
This is a local interprocess communication link to the
local AllJoyn bus router. In Linux-based systems, this is
a Unix-domain socket connection, and in Windows-based systems
this is a TCP connection to the local router.

The AllJoyn framework provides an OS abstraction layer to
provide a platform on which the rest of the system is built,
and at the lowest level is the native system.

### Routers

AllJoyn routers are the glue that holds the AllJoyn system together.
As previously discussed, routers are programs that run in
the background, waiting for interesting events to happen and
responding to them. Because these events are usually external,
it is better to approach the router architecture from a bottom-up
perspective.

At the lowest level of the router architecture figure below,
resides the native system. We use the same OS abstraction layer
as we do in the client architecture to provide common abstractions
for routers running on Linux, Windows, and Android. Running on
the OS abstraction layer, we have the various low-level networking
components of the router. Recall that clients, services, and
peers only use a local interprocess communication mechanism
to talk to a router, so it is the router that must deal with
the various available transport mechanisms on a given platform.
Note the "Local" transport in the router architecture figure which is the sole
connection to the AllJoyn clients, services, and peers running
on a particular host.

![router-arch][router-arch]

**Figure:** Basic router architecture

For example, a Bluetooth transport would handle the complexities
of creating and managing piconets in the Bluetooth system.
Additionally, a Bluetooth transport provides service advertisement
and discovery functions appropriate to Bluetooth, as well
as providing reliable communications. Bluetooth and other
transports would be added at this transport layer along side
the IP transport.

The wired, Wi-Fi, and Wi-Fi Direct transports are grouped under
an IP umbrella since all of these transports use the underlying
TCP-IP network stack. There are sometimes significant differences
regarding how service advertisement and discovery is accomplished,
since this functionality is outside the scope of the TCP-IP
standard; so there are modules dedicated to this functionality.

The various technology-specific transport implementations are
collected into a Network Transports abstraction. The Sessions module
handles the establishment and maintenance of communication
connections to make a collection of routers and AllJoyn applications
appear as a unified software bus.

AllJoyn routers use the endpoint concept to provide connections
to local clients, services, and peers but extend the use of
these objects to bus-to-bus connections which are the transports
used by routers to send messages from host-to-host.

In addition to the routing functions implied by these connections,
an AllJoyn router provides its own endpoints corresponding
to bus objects used for managing or controlling the software
bus segment implemented by the router. For example, when
a service requests to advertise a well-known bus name, what
actually happens is that the helper on the service translates
this request into a remote method call that is directed to
a bus object implemented on the router. Just as in the case
of a service, the router has a number of bus objects living
at associated object paths which implement specific named interfaces.
The low-level mechanism for controlling an AllJoyn bus is
sending remote method invocations to these router bus objects.

The overall operation of certain aspects of router operation
are controlled by a configuration subsystem. This allows a
system administrator to specify certain permissions for the
system and provides the ability to arrange for on-demand
creation of services. Additionally, resource consumption may
be limited by configuration of the router, allowing a system
administrator to, for example, limit the number of TCP connections
active at any given time. There are options which allow system
administrators to mitigate the effects of certain denial-of-service
attacks, by limiting the number of connections which are
currently authenticating, for example.

## Summary

The AllJoyn framework is a comprehensive system designed to
provide a framework for deploying distributed applications
on heterogeneous systems with mobile elements.

The AllJoyn framework provides solutions, building on proven
technologies and standard security systems, that address the
interaction of various network technologies in a coherent,
systematic way. This allows application developers to focus
on the content of their applications without requiring a large
amount of low-level networking experience.

The AllJoyn system is designed to work together as a whole
and does not suffer from inherent impedance mismatches that
might be seen in ad-hoc systems built from various pieces.
We believe that the AllJoyn system can make development and
deployment of distributed applications significantly simpler
than those developed on other platforms.

[overview]: #overview
[prototypical-alljoyn-bus]: /files/learn/standard-core/prototypical-alljoyn-bus.png
[device-device-comm]: /files/learn/standard-core/device-device-comm.png
[dist-bus-local-bus]: /files/learn/standard-core/dist-bus-local-bus.png
[bubble-diagram-bus]: /files/learn/standard-core/bubble-diagram-bus.png
[alljoyn-bubble-diagram]: /files/learn/standard-core/alljoyn-bubble-diagram.png
[hypothetical-alljoyn-bus-instance]: /files/learn/standard-core/hypothetical-alljoyn-bus-instance.png
[service-performs-advertise]: /files/learn/standard-core/service-performs-advertise.png
[client-requests-find-name]: /files/learn/standard-core/client-requests-find-name.png
[router-reports-found-name]: /files/learn/standard-core/router-reports-found-name.png
[client-discovers-service]: /files/learn/standard-core/client-discovers-service.png
[client-service-peer-arch]: /files/learn/standard-core/client-service-peer-arch.png
[router-arch]: /files/learn/standard-core/router-arch.png
