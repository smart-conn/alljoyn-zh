# Running the Basic Sample

Basic sample 应用程序提供了执行相连方法的功能 - cat.

服务器应用程序可以推广一个 well-known name: "org.alljoyn.Bus.sample". 这将能接受25号会话端口中的会话。

客户端应用程序可以发现一个 well-known name："org.alljoyn.Bus.sample". 他将接入在25号会话端口中的会话。对于不同的平台，体验会有所不同，但是每一个 Client 端实现都会调用 'cat' 总线方法。

基本的应用程序接口如下所示：

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

此实例可以在以下操作系统中运行。
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
