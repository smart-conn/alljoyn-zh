# 运行聊天样例

聊天样例应用程序提供了在已连接的会话中发送 AllJoyn&trade; 信号的功能。

各个平台上的聊天应用程序在运行时都有些许不同。但至少，聊天应用程序会推广一个带有 "org.alljoyn.bus.samples.chat" 前缀的 well-known name. 

随后，应用程序会再附上一个 "." 和聊天室名的组合，从而达到解析关闭，并显示到 UI 上。每一个聊天室都将接收在27号会话端口上的会话。

根据所使用的平台，此应用程序一定在扮演一个客户端 (Client) 或者一个服务器端 (Service) 的角色，同时他还有可能需要加入自己发起的会话。具体细节
请参考下放各个平台的链接。


聊天接口如下定义：

```xml
<node name="/chatService">
    <interface name="org.alljoyn.bus.samples.chat">
        <signal name="Chat">
            <arg name="str" type="s"/>
        </signal>
    </interface>
</node>
```

此样例可以在以下平台中使用：
* [Android][android]
* [Linux][linux]
* [iOS/OSX][ios-osx]
* [Windows][windows]
* [Thin - Linux][thin-linux]

[android]: /develop/run-sample-apps/chat/android
[linux]: /develop/run-sample-apps/chat/linux
[ios-osx]: /develop/run-sample-apps/chat/ios-osx
[windows]: /develop/run-sample-apps/chat/windows
[thin-linux]: /develop/run-sample-apps/chat/thin-linux

