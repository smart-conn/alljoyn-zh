# Running The About Samples

There are two About sample applications, an About Client and an About Service. 
Because the About feature is required and used by any application using one or 
more of the service frameworks, all of the AllJoyn&trade; service framework, 
example applications also function as either an About client or an About service. 

The About Client is used to list out the services offered up by an 
AllJoyn application using the About Service. It provides [service-level discovery][service_discovery] 
so that an application can be written to interact with devices that speak the same services.

The About Service is used to demonstrate the use of the About Service API.  By itself, the application does nothing but expose a set of values that can be discovered and the About APIs can be executed.

The About interface is defined as follows:

```xml
<node name="/About">
    <interface name="org.alljoyn.About">
        <property name="Version" type="q" access="read"/>
        <method name="GetAboutData">
            <arg name="languageTag" type="s" direction="in"/>
            <arg name="aboutData" type="a{sv}" direction="out"/>
        </method>
        <method name="GetObjectDescription">
            <arg name="objectDescription" type="a(sas)" direction="out"/>
        </method>
        <signal name="Announce">
            <arg name="version" type="q"/>
            <arg name="port" type="q"/>
            <arg name="objectDescription" type="a(sas)"/>
            <arg name="metaData" type="a{sv}"/>
        </signal>
    </interface>
</node>
<node name="/About/DeviceIcon">
    <interface name="org.alljoyn.Icon">
        <property name="Version" type="q" access="read"/>
        <property name="MimeType" type="s" access="read"/>
        <property name="Size" type="u" access="read"/>
        <method name="GetUrl">
            <arg name="url" type="s" direction="out"/>
        </method>
        <method name="GetContent">
            <arg name="bytes" type="ay" direction="out"/>
        </method>
    </interface>
</node>
```

The samples can be run on the following platforms:
* [Windows][windows]
* [Linux][linux]
* [iOS/OSX][ios-osx]

[service_discovery]: /learn/core/about-announcement
[windows]: /develop/run-sample-apps/about/windows
[linux]: /develop/run-sample-apps/about/linux
[ios-osx]: /develop/run-sample-apps/about/ios-osx
