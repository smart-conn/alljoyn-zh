# Running The Notification Samples

There are two types of Notification sample applications, 
a Producer and a Consumer. The power of the [Notification service framework][learn_notif] 
is its simplicity and ability to allow devices to "talk" 
to end users to provide meaningful information.

The Notification Producer side of an application is responsible 
for sending a [sessionless signal][sessionless_signal] that contains 
a small amount of text with some optional values.  This text is 
intended to be rendered on any device that contains the Consumer 
side of the Notification service.

The Notification Consumer side of an application is responsible 
for registering to receive the [sessionless signal][sessionless_signal] 
from any application that supports the Producer side of the Notification service.

The Notification interface is defined as follows:

```xml
<node>
    <interface name="org.alljoyn.Notification">
        <property name="Version" type="q" access="read"/>
        <signal name="notify">
            <arg name="version" type="q"/>
            <arg name="msgId" type="i"/>  
            <arg name="msgType" type="q"/>
            <arg name="deviceId" type="s"/>
            <arg name="deviceName" type="s"/>
            <arg name="appId" type="ay"/>
            <arg name="appName" type="s"/>
            <arg name="attributes" type="a{iv}"/>
            <arg name="customAttributes" type="a{ss}"/>
            <arg name="langText" type="a(ss)"/>
        </signal>
    </interface>
</node>
```

The samples can be run on the following platforms:
- [Android][android]
- [Linux][linux]
- [iOS/OSX][ios-osx]
- [Thin - Linux][thin-linux]

[android]: /develop/run-sample-apps/notification/android
[linux]: /develop/run-sample-apps/notification/linux
[ios-osx]: /develop/run-sample-apps/notification/ios-osx
[thin-linux]: /develop/run-sample-apps/notification/thin-linux

[learn_notif]: /learn/base-services/notification
[sessionless_signal]: /learn/core#sessionless-signal
