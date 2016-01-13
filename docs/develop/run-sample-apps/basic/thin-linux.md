# Running Basic Sample - 精简 Linux

## 前途条件

* [Build the thin Linux samples][build-thin-linux]
* [Build the AllJoyn&trade; router][build-linux]. AllJoyn 精简应用程序需要一个可以连接到的 AllJoyn 路由来完成正常功能。

## 运行 Basic Client 和 Service

1. 使用配置文件运行 AllJoyn daemon，使精简应用程序可以连接。 

  ```sh
  # <TARGET CPU> can be either x86_64, x86, or whatever value you set for CPU= when running SCons.
  export TARGET_CPU=<TARGET CPU>
  cd $AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/release/dist/cpp/bin

  # This sets the library path to load the liballjoyn.so shared library.
  export LD_LIBRARY_PATH=`pwd`/../lib:$LD_LIBRARY_PATH
    
  ./alljoyn-daemon &
  ```

2. 运行 basic_service (在新的命令行中).

  ```sh
  cd $AJ_ROOT/core/ajtcl/samples/basic
  ./basic_service
  ```

3. 运行 basic_client (在新的命令行中).

  ```sh
  cd $AJ_ROOT/core/ajtcl/samples/basic
  ./basic_client
  ``` 

basic_client 的输出应为如下所示：

```
./basic_client
<node name="/sample">
<interface name="org.alljoyn.Bus.sample">
  <method name="Dummy">
    <arg name="foo" type="i" direction="in"/>
  </method>
  <method name="Dummy2">
    <arg name="fee" type="i" direction="in"/>
  </method>
  <method name="cat">
    <arg name="inStr1" type="s" direction="in"/>
    <arg name="inStr2" type="s" direction="in"/>
    <arg name="outStr" type="s" direction="out"/>
  </method>
</interface>
</node>
'org.alljoyn.Bus.sample.cat' (path='/sample') returned 'Hello World!'.
Basic client exiting with status 0.
```
basic_service 的输出应为如下所示：

```
./basic_service
<node name="/sample">
<interface name="org.alljoyn.Bus.sample">
  <method name="Dummy">
    <arg name="foo" type="i" direction="in"/>
  </method>
  <method name="cat">
    <arg name="inStr1" type="s" direction="in"/>
    <arg name="inStr2" type="s" direction="in"/>
    <arg name="outStr" type="s" direction="out"/>
  </method>
</interface>
</node>
000.000 aj_guid.c:76 LookupName(): NULL
Session lost. ID = 681866772, reason = 2AllJoyn disconnect.
```

[build-thin-linux]: /develop/building/thin-linux
[build-linux]: /develop/building/linux
