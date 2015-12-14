# Introduction

The Observer feature is a new API concept that was introduced in release 15.04.
The Observer is a convenience API that aims to simplify the task of discovering
all objects on the bus that implement a given set of interfaces, and interacting
with those objects.

In a nutshell, it handles:

  * About notifications (calling `BusAttachment::WhoImplements`, installing
    `AboutListener`s, interpreting `AboutListener::Announced` messages, ...)
  * session and presence management (setting up sessions with peers hosting bus
    objects of interest, periodic ping requests to check whether the peer is
    still present on the bus, ...)
  * ProxyBusObject creation and bookkeeping

on behalf of the application.

As is evident from the above summary, the Observer is a consumer-side
(client-side) API for AllJoyn: it is designed to facilitate the consumption of
information or services offered by peers on the AllJoyn bus, not to aid your
application in exposing functionality of its own.

## When to Use an Observer

The Observer API is most useful if you're interested in _all_ bus objects that
implement a given set of interfaces. The Observer will automatically maintain a
session with each peer that hosts at least one bus object implementing the set
of interfaces.

The Observer lends itself well to a publish-subscribe-like approach to AllJoyn
interaction. The set of interfaces the Observer looks for can be considered the
"topic" the application is subscribed to. The Observer offers notifications to
inform the application that "instances" (bus objects implementing the set of
interfaces) have appeared on the topic, or have disappeared from the topic. The
`ProxyBusObject::PropertiesChangedListener` mechanism can be used to subscribe
to notifications of state updates for the topic instances (i.e., property value
updates for the discovered bus objects).

If the interaction model of your application is more service-oriented, i.e. the
application enumerates all peers that offer a given service, selects one, and
then interacts exclusively with the selected peer, the Observer API is probably
not for you. Manual About discovery and session management will be more
efficient, albeit less convenient, in this case.

# Usage

The Observer API is currently available in four language bindings:

  * C++
  * C
  * Java
  * Objective-C (iOS &amp; Mac OS X)

The API is very similar in all language bindings. Please refer to the respective
[API references][api-ref] for the language bindings for details on Observer
usage in the various supported programming languages. In this guide, we'll limit
ourselves mainly to the C++ language binding.

## Creating an Observer

To create an Observer, you need to supply a BusAttachment and the minimal set of
interfaces bus objects must implement to be considered eligible for discovery by
the Observer.

**Note:** the interface names passed to the Observer must correspond with
interfaces that have previously been registered with the BusAttachment (via
`BusAttachment::CreateInterface` and `InterfaceDescription::Activate`). If this
is not the case, the Observer creation will fail silently, and the Observer will
not discover any objects on the bus.

```cpp
BusAttachment bus;
const char* mandatory[] = { "org.alljoyn.example.Foo", "org.alljoyn.example.Bar" };

Observer obs(bus, mandatory, sizeof(mandatory)/sizeof(mandatory[0]));
```

It is possible to create different Observers side-by-side, even Observers that
have the same set of mandatory interfaces pose no problem.

Once created, the Observer will monitor the About announcements emitted by the
peers on the bus for objects that implement at least the set of mandatory
interfaces. The Observer will set up a session with peers that host at least one
such bus object, and create `ProxyBusObject`s for each of the discovered
objects. These `ProxyBusObject` instances have support for _all_ discovered
interfaces in the remote object, not just the mandatory interfaces.

**Note:** due to the design of the Java language binding, it is not possible to
make the Java `ProxyBusObject`s support all interfaces in the discovered object.
Therefore, the Java Observer constructor allows you to pass in a second set of
interfaces, the so-called _optional_ interfaces. The `ProxyBusObject`s created
by the Java Observer will support all mandatory interfaces, and those optional
interfaces that are implemented by the corresponding remote object.

## Getting Notifications for Discovered and Lost Objects

The Observer supports asynchronous notification of applications via the
`Observer::Listener` class. The listener defines two callbacks:

  * `ObjectDiscovered(ProxyBusObject& proxy)` is invoked whenever a new remote
    object is discovered. The proxy object that is passed along into this
    callback can be used for the registration of PropertiesChanged listeners.
    The Observer will keep this proxy object around until the corresponding
    remote object is removed from the bus.
  * `ObjectLost(ProxyBusObject& proxy)` is invoked whenever a previously
    discovered object is lost. Objects are considered lost if
    the peer that hosts them issues an About announcement that no longer
    includes that object, if the session to the hosting peer is
    lost, or if that peer becomes unresponsive to ping requests.

It is possible to register multiple listeners to a single Observer. To register
a listener, call `Observer::RegisterListener`. This method takes two parameters:
a reference to the listener object, and an optional boolean parameter (true by
default) that states whether the application wants to receive notifications for
already-discovered objects.

The latter parameter is necessary because it is possible that the Observer has
already discovered various remote objects in the time window between its
construction and the registration of the first listener.

```cpp
class MyListener : public Observer::Listener {
  public:
    virtual void ObjectDiscovered(ProxyBusObject& proxy) {
        std::cout << "Discovered object with path " << proxy.GetPath();
        std::cout << " from peer " << proxy.GetUniqueName() << std::endl;
    }
    virtual void ObjectLost(ProxyBusObject& proxy) {
        std::cout << "Lost object with path " << proxy.GetPath();
        std::cout << " from peer " << proxy.GetUniqueName() << std::endl;
    }
};

MyListener listener;
obs.RegisterListener(listener, true);

/* ... */

/* when you're done, there are two ways to unregister a listener */
obs.UnregisterListener(listener);
/* or, alternatively */
obs.UnregisterAllListeners();
```

## Retrieving a Specific Proxy Object

Between the invocation of `Observer::Listener::ObjectDiscovered` and
`Observer::Listener::ObjectLost` for the same `ProxyBusObject`, the Observer
keeps a reference to that proxy object around internally. You can iterate over
all proxies in the Observer (discussed later), or retrieve a specific proxy
object.

A remote object is uniquely identified by the pair (unique bus name, object
path). In the C++ language binding, the `ajn::ObjectId` type encapsulates this
pair in a convenient class.

To retrieve a specific proxy object from the Observer, call
`Observer::Get(ObjectId id)`.

```cpp
ProxyBusObject proxy = obs.Get(ObjectId(unique_name, "/some/path"));
if (proxy.IsValid()) {
    // OK, the Observer knows about an object with this identity
} else {
    // ouch, the Observer does not know an object with this identity
}
```

## Iterating Over All Discovered Objects

To iterate over all discovered objects, use the `Observer::GetFirst()` and
`Observer::GetNext()` methods.

```cpp
for (ProxyBusObject iter = obs.GetFirst(); iter.IsValid(); iter = obs.GetNext(iter)) {
    // do something fun with the proxy
}
```
# Best Practices

## Threading Model

All `Observer::Listener` callbacks are invoked from the BusAttachment's
dispatcher threads, as is the case for all other application-facing callbacks in
the AllJoyn framework (asynchronous method replies, session listener callbacks,
etc.). If you want to perform a blocking or long-running operation in a
callback, you should first call `BusAttachment::EnableConcurrentCallbacks`.

The Observer has been designed in such a way that it is never possible to have
two ObserverListener callbacks in flight at the same time, not even callbacks
from different listeners associated with different Observer instances.

## Service-side Requirements

The Observer functionality only works well if the service side (i.e. the peer
that provides the bus object) plays along nicely. The requirements on the
service side are simple:

  * announce bus objects and their interfaces through About
  * keep your application's About announcements up to date: if bus objects are
    registered or unregistered, be sure to do the appropriate re-announcement
  * accept sessions on the session port your application announces in About. The
    Observer will attempt to establish a point-to-point session on that port. If
    that fails, the Observer will ignore the bus objects your application
    announces.

[api-ref]: /develop/api-reference
