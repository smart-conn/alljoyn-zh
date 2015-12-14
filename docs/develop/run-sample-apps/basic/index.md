# Running the Basic Sample

The Basic sample application provides the ability to execute a concatenate method - cat.

The Service application is designed to advertise a well-known name: "org.alljoyn.Bus.sample".
It will accept sessions on the session port 25.

The Client application is designed to discover the well-known name: "org.alljoyn.Bus.sample".
It will then join a session on the session port 25.  Depending on the platform, 
the experience is slightly different, but each Client implementation will call the "cat" Bus Method.

The Basic application interface is as follows:

```xml
<node name="/sample">
    <interface name="org.alljoyn.Bus.sample">
        <method name="cat">
            <arg name="inStr1" type="s" direction="in"/>
            <arg name="inStr2" type="s" direction="in"/>
            <arg name="outStr" type="s" direction="out"/>
        </method>
    </interface>
</node>
```

The sample can be run on the following platforms:
* [Android][android]
* [Linux][linux]
* [iOS/OSX][ios-osx]
* [Windows][windows]
* [Thin - Linux][thin-linux]
* [Thin - Windows][thin-windows]

[android]: /develop/run-sample-apps/basic/android
[linux]: /develop/run-sample-apps/basic/linux
[ios-osx]: /develop/run-sample-apps/basic/ios-osx
[windows]: /develop/run-sample-apps/basic/windows
[thin-linux]: /develop/run-sample-apps/basic/thin-linux
[thin-windows]: /develop/run-sample-apps/basic/thin-windows
