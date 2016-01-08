# Running The About Samples

此处有两个 About 用例应用程序，About 用户端以及 About 服务器端。由于任何使用一个或多个服务框架的应用程序都需要使用 About 功能，所有的 AllJoyn&trade; 服务，框架以及示例应用程序同时也提供着 About 用户端或者 About 服务器端的功能。

About 用户端被用于列出被一个 使用 About 服务器端的 AllJoyn 应用程序提供的所有功能。他提供了[service-level discovery][service_discovery] ，
借此，应用程序可以同与自己使用相同服务的设备进行交互。

About 服务器端被用于演示 About 服务器端 API 的使用。单独来看，应用程序只需把一系列可被发现的值和可被执行的 About APIs 暴露。

About 接口有如下定义：

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

此实例可在以下平台运行：
* [Windows][windows]
* [Linux][linux]
* [iOS/OSX][ios-osx]

[service_discovery]: /learn/core/about-announcement
[windows]: /develop/run-sample-apps/about/windows
[linux]: /develop/run-sample-apps/about/linux
[ios-osx]: /develop/run-sample-apps/about/ios-osx
