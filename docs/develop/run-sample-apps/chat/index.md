# Running the Chat Sample

The Chat sample application provides the ability to send AllJoyn&trade; 
Signals on a connected session.

The Chat application runs slightly differently on each platform. 
At a minimum, the application advertises a well-known name with 
the prefix of "org.alljoyn.bus.samples.chat".

It will then append a "." followed by the name of the chat room 
to be parsed off and possibly displayed in the UI. Each room 
will accept sessions on the session port 27.

Depending on the platform, the application must have a role 
of Client or Service and may need to join its own session. 
See each of the platform links below for more details on running the sample. 

The Chat interface is as follows:

```xml
<node name="/chatService">
    <interface name="org.alljoyn.bus.samples.chat">
        <signal name="Chat">
            <arg name="str" type="s"/>
        </signal>
    </interface>
</node>
```

The sample can be run on the following platforms:
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

