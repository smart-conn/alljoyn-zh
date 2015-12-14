# Introduction

The property cache is a feature that was introduced in release 15.04. It is
available in the C++, C, Java and Objective-C language bindings of AllJoyn Core.

The purpose of the property cache is to reduce network traffic and to improve
application response times by avoiding unnecessary round trips on
`ProxyBusObject::GetProperty` and `ProxyBusObject::GetAllProperties` calls for
_cacheable_ properties.

## Optional Feature

The property caching feature is optional, and not enabled by default. You have
to enable it on a per-`ProxyBusObject` basis. Once enabled, it applies to all
interfaces that `ProxyBusObject` instance supports.

## Cacheable Properties

Cacheable properties are those that leverage the
`org.freedesktop.DBus.Properties.PropertiesChanged` signal mechanism. Such
properties are annotated with the
`org.freedesktop.DBus.Property.EmitsChangedSignal` annotation:

  * if the annotation value is `true`, clients will be informed of the new value
    of the property as soon as the value changes.
  * if the annotation value is `invalidates`, clients will be informed that any
    value they may have cached for that property is now invalid, but the new
    value is not sent along with the notification. Clients must perform a
    GetProperty call to retrieve the new value.
  * if the annotation value is `false` (the default, if the annotation is not
    present), the property is not cacheable, and no notifications will be
    emitted upon changes in the property value.

**Note:** recent DBus specifications allow a fourth value for the annotation
(`const`), but this is currently not supported by AllJoyn.

## Lazy Caching

The property caching mechanism is lazy: it does not actively try to acquire
values for all properties in the proxy object. Rather, it snoops incoming
PropertiesChanged signals and GetProperty replies to fill the cache.
Applications that want to have a pre-filled cache have to perform a
`ProxyBusObject::GetAllProperties` call immediately following the enabling of
the property cache for a proxy object.

# Usage

The property cache is completely transparent for applications. The only code
change you need to take advantage of the functionality is the addition of a
single `ProxyBusObject::EnablePropertyCaching` call.

```cpp
ProxyBusObject pbo(bus, unique_name, path);
pbo.EnablePropertyCaching();
```

Subsequent calls to `ProxyBusObject::GetProperty`,
`ProxyBusObject::GetPropertyAsync`, `ProxyBusObject::GetAllProperties` or
`ProxyBusObject::GetAllPropertiesAsync` will opportunistically return values
from the cache if applicable.

# Service-side Requirements

The property caching mechanism is extremely simple, but it assumes that the
service side (i.e. the peer that exposes objects on the bus) behaves correctly.
If you cannot be certain that the peers you will interact with comply with the
requirements listed below, your best bet is to not enable property caching.

## Respect Property Annotations

If the interface definition states that certain properties are cacheable, i.e.
the appropriate annotations are present in the interface definition, the service
must emit the PropertiesChanged signal at the appropriate times. Failure to do
so will result in inconsistent caches at client side, and undefined behavior.

## Emit PropertiesChanged Signals as Sessioncast Signals

The PropertiesChanged signal (which is emitted via the
`BusObject::EmitPropChanged` method) must not be emitted as a broadcast signal
(i.e. with session id 0). It should be emitted as a sessioncast signal on all
sessions that have potentially interested listeners.

The most convenient method for emission is to use the sentinel
`SESSION_ID_ALL_HOSTED` value for the session id. The framework will then emit
the signal on all sessions hosted by the application.

```cpp
busobj.EmitPropChanged("org.alljoyn.example.Foo", {"Bar"}, 1, SESSION_ID_ALL_HOSTED);
```
