# Running The Control Panel Samples

There are two Control Panel sample applications, a ‘Controller’ 
and a ‘Controllable’.  The [Control Panel service framework][learn_control] 
is a collection of many interfaces and a definition of object path 
where the interfaces are placed.

When an application uses the [Control Panel service][learn_control] 
to be a Controllable device, it uses the service APIs which wrap up 
an AllJoyn&trade; feature called [Introspection][learn_introspect].  
The service provides an [Adaptive UI Layer][learn_control] that 
is responsible for creating platform widgets that are rendered on a screen.

When an application uses the Controller side of the 
[Control Panel service framework][learn_control], it offers 
up capabilities such that any application can control some 
set of functionality. It allows for an OEM to leverage the 
developer's ecosystem and build applications that interact with a product.

The ControlPanel interfaces are defined as follows:

```xml
**NOTE:** The interfaces below are also available as secure interfaces

<interface name="org.alljoyn.ControlPanel.ControlPanel">
    <property name="Version" type="q" access="read"/>
</interface>
<interface name="org.alljoyn.ControlPanel.Container">
    <property name="Version" type="q" access="read"/>
    <property name="States" type="u" access="read"/> 
    <property name="OptParams" type="a{qv}" access="read"/>  
    <signal name="MetadataChanged" />
</interface>
<interface name="org.alljoyn.ControlPanel.Property">
    <property name="Version" type="q" access="read"/>
    <property name="States" type="u" access="read"/> 
    <property name="OptParams" type="a{qv}" access="read"/>  
    <property name="Value" type="v" access="readwrite"/>
    <signal name="MetadataChanged" />
    <signal name="ValueChanged">
        <arg type="v"/>
    </signal>
</interface>
<interface name="org.alljoyn.ControlPanel.LabelProperty">
    <property name="Version" type="q" access="read"/>
    <property name="States" type="u" access="read"/> 
    <property name="Label" type="s" access="read"/>
    <property name="OptParams" type="a{qv}" access="read"/>  
    <signal name="MetadataChanged" />
</interface>
<interface name="org.alljoyn.ControlPanel.Action">
    <property name="Version" type="q" access="read"/>
    <property name="States" type="u" access="read"/> 
    <property name="OptParams" type="a{qv}" access="read"/>  
    <signal name="MetadataChanged" />
    <method name="Exec"/>
</interface>
<interface name="org.alljoyn.ControlPanel.NotificationAction">
    <property name="Version" type="q" access="read"/>
    <signal name="Dismiss" />
</interface>
<interface name="org.alljoyn.ControlPanel.Dialog">
    <property name="Version" type="q" access="read"/>
    <property name="States" type="u" access="read"/> 
    <property name="OptParams" type="a{qv}" access="read"/>  
    <property name="Message" type="s" access="read"/>
    <property name="NumActions" type="q" access="read"/>
    <signal name="MetadataChanged" />
    <method name="Action1"/>
    <method name="Action2"/>
    <method name="Action3"/>
</interface>
<interface name="org.alljoyn.ControlPanel.ListProperty">
    <property name="Version" type="q" access="read"/>
    <property name="States" type="u" access="read"/> 
    <property name="OptParams" type="a{qv}" access="read"/>  
    <property name="Value" type="a(qs)" access="read"/> 
    <method name="Add"/>
    <method name="Delete">
        <arg name="recordID" type="q" direction="in"/>
    </method>
    <method name="View">
        <arg name="recordID" type="q" direction="in"/>
    </method>
    <method name="Update">
        <arg name="recordID" type="q" direction="in"/>
    </method>
    <method name="Confirm">
    </method>
    <method name="Cancel">
    </method>
    <signal name="MetadataChanged"/>
    <signal name="ValueChanged"/>
</interface>
<interface name="org.alljoyn.Control.HTTPControl">
    <property name="Version" type="q" access="read"/>
    <method name="GetRootURL">
        <arg name="url" type="s" direction="out"/>
    </method>
</interface>
```

Controller samples are available for Android, iOS, and Linux.

Controllable samples are available for Linux and Thin Linux.

The samples can be run on the following platforms:
- [Android][android]
- [Linux][linux]
- [iOS/OS X][ios-osx]
- [Thin - Linux][thin-linux]

[android]: /develop/run-sample-apps/controlpanel/android
[linux]: /develop/run-sample-apps/controlpanel/linux
[ios-osx]: /develop/run-sample-apps/controlpanel/ios-osx
[thin-linux]: /develop/run-sample-apps/controlpanel/thin-linux

[learn_control]: /learn/base-services/controlpanel
[learn_introspect]: /learn/core#introspection
