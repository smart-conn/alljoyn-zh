# 运行提醒实例

此处有两种提醒应用程序用例，Producer 和 Consumer. [Notification service framework][learn_notif] 的强大之处就在于他的简洁性以及允许设备与终
端用户沟通、获取有价值的信息。

Provider 应用程序一方负责发送包含带有可选值的少量文本的 [非会话信号][sessionless_signal]. 此文本将试图被任何带有提醒服务 Consumer 端的设备
渲染。

Consumer 应用程序一方负责注册并接收来此任何支持提醒服务 Producer 端的设备发出的 [非会话信号][sessionless_signal] 。

提醒接口的定义如下所示：

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

此样例可在如下平台上运行：
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
