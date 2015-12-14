# Running Basic Sample - Thin Linux

## Prerequisites

* [Build the thin Linux samples][build-thin-linux]
* [Build the AllJoyn&trade; router][build-linux]. AllJoyn thin 
  apps require an AllJoyn router to connect to in order to function properly.

## Run Basic Client and Service

1. Launch the AllJoyn daemon using the config file to allow thin apps to connect.

  ```sh
  # <TARGET CPU> can be either x86_64, x86, or whatever value you set for CPU= when running SCons.
  export TARGET_CPU=<TARGET CPU>
  cd $AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/release/dist/cpp/bin

  # This sets the library path to load the liballjoyn.so shared library.
  export LD_LIBRARY_PATH=`pwd`/../lib:$LD_LIBRARY_PATH
    
  ./alljoyn-daemon &
  ```

2. Launch basic_service (in a new terminal).

  ```sh
  cd $AJ_ROOT/core/ajtcl/samples/basic
  ./basic_service
  ```

3. Launch basic_client (in a new terminal).

  ```sh
  cd $AJ_ROOT/core/ajtcl/samples/basic
  ./basic_client
  ``` 

The output from basic_client should look like this:

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

The output from basic_service should look like this:

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