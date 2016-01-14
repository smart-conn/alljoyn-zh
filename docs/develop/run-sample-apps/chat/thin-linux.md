# 运行聊天样例应用程序 - Thin Linux

### 前提条件
* [Build the thin Linux samples][build-thin-linux]
* [Build the AllJoyn&trade; router][build-linux].  AllJoyn 精简应用程序需要一个可以连接的 AllJoyn 路由来正常工作。

### 运行聊天

1. 使用配置文件运行 AllJoyn daemon， 使精简应用程序可以连接。

  ```
  # <TARGET CPU> can be either x86_64, x86, or whatever value you set for CPU= when running SCons.
  export TARGET_CPU=<TARGET CPU>
  cd $AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/release/dist/cpp/bin
       
  export LD_LIBRARY_PATH=`pwd`/../lib:$LD_LIBRARY_PATH
  # This sets the library path to load the liballjoyn.so shared library.
    
  ./alljoyn-daemon &
  ```

2. 运行聊天 (在新的命令行中).

  ```
  cd $AJ_ROOT/core/ajtcl/samples/basic
  ./chat
  ```

chat_client 的输出应为如下所示：

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
