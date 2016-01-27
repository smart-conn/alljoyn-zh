# 运行 Configuration 样例

此处有两个 Configuration 样例应用程序,  Config Client 和 Config Service.

[Configuration service][learn_config] 为暴露和配置指定设备的值（例如设备密码和设备名）提供了一种方法，同时还有一系列的指定设备的方法，例如
重新启动设备或者回复出厂设置。

使用 Config Service 的应用程序的功能是，接收发进来的请求并提供配置信息，或者对配置值做出修改。

使用 Config Client 的应用程序的功能是，使用户可以修改 OEM 允许修改的控制值。


Config 接口的定义如下所示：

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

此样例可在以下平台上运行：
- [Android][android]
- [Linux][linux]
- [iOS/OSX][ios-osx]
- [Thin - Linux][thin-linux]

[android]: /develop/run-sample-apps/config/android
[linux]: /develop/run-sample-apps/config/linux
[ios-osx]: /develop/run-sample-apps/config/ios-osx
[thin-linux]: /develop/run-sample-apps/config/thin-linux

[learn_config]: /learn/base-services/configuration
