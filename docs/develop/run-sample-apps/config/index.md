# Running The Configuration Samples

There are two Configuration sample applications, a Config Client and a Config Service.

The [Configuration service][learn_config] provides a means to 
expose and configure device-specific values such as a device 
passcode and a device name, in addition to device-specific 
methods such as restarting the device or performing a factory 
reset of the device. 

The role of an application that uses the Config service is 
to accept the incoming requests to provide configuration 
information or make changes to the configuration values.

The role of an applicaton that uses the Config client allows 
an end user to control values that an OEM has offered up for changes.

The Config interface is defined as follows: 

```xml
<node name="/Config">
    <interface name="org.alljoyn.Config">
        <property name="Version" type="q" access="read"/> 
        <method name="FactoryReset">
            <annotation name="org.freedesktop.DBus.Method.NoReply" value="true"/>
        </method>
        <method name="Restart">
            <annotation name="org.freedesktop.DBus.Method.NoReply" value="true"/>
        </method>
        <method name="SetPasscode">
            <arg name="daemonRealm" type="s" direction="in"/>
            <arg name="newPasscode" type="ay" direction="in"/>
        </method>
        <method name="GetConfigurations">
            <arg name="languageTag" type="s" direction="in"/>
            <arg name="configData" type="a{sv}" direction="out"/>
        </method>
        <method name="UpdateConfigurations">
            <arg name="languageTag" type="s" direction="in"/>
            <arg name="configMap" type="a{sv}" direction="in"/>
        </method>
        <method name="ResetConfigurations">
            <arg name="languageTag" type="s" direction="in"/>
            <arg name="fieldList" type="as" direction="in"/>
        </method>
    </interface>
</node>
```

The samples can be run on the following platforms:
- [Android][android]
- [Linux][linux]
- [iOS/OSX][ios-osx]
- [Thin - Linux][thin-linux]

[android]: /develop/run-sample-apps/config/android
[linux]: /develop/run-sample-apps/config/linux
[ios-osx]: /develop/run-sample-apps/config/ios-osx
[thin-linux]: /develop/run-sample-apps/config/thin-linux

[learn_config]: /learn/base-services/configuration
