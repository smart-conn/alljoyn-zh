# Running The Onboarding Samples 

There are two types of Onboarding sample applications, an 
Onboarder and an Onboardee. The [Onboarding service framework][learn_onboarding] 
is both a definition of how a Wi-Fi Radio will function on a 
device and the AllJoyn&trade; interface used to communicate.

An Onboardee application is responsible for starting up 
as an Access Point (AP) and offering up that it supports 
the Onboarding service framework via [About Announcements][learn_about]. 
Once provided a set of user-provided AP credentials, the application 
will stop advertising an AP and connect using the provided credentials.

An application that provides the Onboarder side of the service 
is responsible for using the Onboarding interface to transmit 
AP credentials that the Onboardee application should connect to.

The Onboarding interface is defined as follows:

```xml
<node>
    <interface name="org.alljoyn.Onboarding">
        <property name="Version" type="q" access="read"/> 
        <property name="State" type="n" access="read"/> 
        <property name="LastError" type="(ns)" access="read"/> 
        <method name="ConfigureWifi">
            <arg name="SSID" type="s" direction="in"/>
            <arg name="passphrase" type="s" direction="in"/>
            <arg name="authType" type="n" direction="in"/>
            <arg name="status" type="n" direction="out"/>
        </method>
        <method name="Connect">
            <annotation name="org.freedesktop.DBus.Method.NoReply" value="true" />
        </method>
        <method name="Offboard">
            <annotation name="org.freedesktop.DBus.Method.NoReply" value="true" />
        </method>
        <method name="GetScanInfo">
            <arg name="age" type="q" direction="out"/>
            <arg name="scanList" type="a(sn)" direction="out"/>        
        </method>
        <signal name="ConnectionResult">
            <arg type="(ns)" />
        </signal>
    </interface>
</node>
```

Onboarder samples are available for Android and iOS.
Onboardee samples are available for Android.

The samples can be run on the following platforms:
- [Android][android]
- [Linux][linux]
- [iOS/OSX][ios-osx]

[android]: /develop/run-sample-apps/onboarding/android
[linux]: /develop/run-sample-apps/onboarding/linux
[ios-osx]: /develop/run-sample-apps/onboarding/ios-osx

[learn_about]: /learn/core/about-announcement
[learn_onboarding]: /learn/base-services/onboarding
