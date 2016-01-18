# 运行  Onboarding 样例 

此处有两种 Onboarding 样例应用程序, Onboarder 和 Onboardee.  [Onboarding service framework][learn_onboarding] 定义了 Wi-Fi Radio 在设备上的
运转方式以及使用 AllJoyn&trade; 接口的沟通方式。

Onboardee 应用程序负责开启一个 Access Point(AP),并提供通过 [About Announcements][learn_about] 实现的所支持的 Onboarding 服务框架。一旦提供
了一系列的 AP 证书，此应用程序将停止推广 AP ，并使用给定的证书连接。

提供 Onboarder 服务的一方应用程序应负责使用 Onboarding 接口来传输 Onboardee 应用程序应连接的 AP 设置信息。

Onboarding 接口的定义如下所示:

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

Onboarder 样例已支持 Android 和 iOS.
Onboardee 样例支持 Android.

这些样例可在以下平台运行：
- [Android][android]
- [Linux][linux]
- [iOS/OSX][ios-osx]

[android]: /develop/run-sample-apps/onboarding/android
[linux]: /develop/run-sample-apps/onboarding/linux
[ios-osx]: /develop/run-sample-apps/onboarding/ios-osx

[learn_about]: /learn/core/about-announcement
[learn_onboarding]: /learn/base-services/onboarding
