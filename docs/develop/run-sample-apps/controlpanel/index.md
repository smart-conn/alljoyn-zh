# 运行控制面板样例

此处有两个控制面板样例， ‘Controller’ 和 ‘Controllable’. [Control Panel service framework][learn_control] 是一个众多接口和存放接口的对象路
径定义的集合。

当某一应用程序使用 [Control Panel service][learn_control] 作为一个可控设备时，他会使用包含了 AllJoyn&trade; 被称作  [Introspection][learn_introspect] 功能的服务 API. 此服务提供负责创建被渲染到屏幕上的平台组件的 [Adaptive UI Layer][learn_control] 功能。

当某一应用程序使用 [Control Panel service framework][learn_control] 作为一个控制方设备时, 他会提供可以使任何应用程序都能控制一些功能集合的
功能。OEM 可以利用此功能影响开发者的生态系统，并搭建可以与产品交互的应用程序。



ControlPanel 接口的定义如下所示：

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

Controllable 样例支持在 Android, iOS, 和 Linux 上可用。

Controllable 样例已经在 Linux 和 Thin Linux 上可用。

这些样例可以在以下应用程序中运行。
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
