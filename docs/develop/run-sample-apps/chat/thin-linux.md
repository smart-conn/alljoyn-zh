# Running Chat Sample - Thin Linux

### Prerequisites
* [Build the thin Linux samples][build-thin-linux]
* [Build the AllJoyn&trade; router][build-linux]. AllJoyn thin 
  apps require an AllJoyn router to connect to in order to function properly.

### Run Chat

1. Launch the AllJoyn daemon using the config file to allow thin apps to connect.

  ```
  # <TARGET CPU> can be either x86_64, x86, or whatever value you set for CPU= when running SCons.
  export TARGET_CPU=<TARGET CPU>
  cd $AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/release/dist/cpp/bin
       
  export LD_LIBRARY_PATH=`pwd`/../lib:$LD_LIBRARY_PATH
  # This sets the library path to load the liballjoyn.so shared library.
    
  ./alljoyn-daemon &
  ```

2. Launch chat (in a new terminal).

  ```
  cd $AJ_ROOT/core/ajtcl/samples/basic
  ./chat
  ```

The output from chat_client should look like this:

```
<node name="/chatService">
<interface name="org.alljoyn.bus.samples.chat">
    <signal name="Chat">
        <arg name="str" type="s"/>
    </signal>
</interface>
</node>
...
...
...
```

[build-thin-linux]: /develop/building/thin-linux
[build-linux]: /develop/building/linux