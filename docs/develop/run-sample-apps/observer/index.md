# 运行 Observer 样例

Observer 样例说明了用于简易对象发现和会话管理的 Observer API （在 AllJoyn R15.04 中引入）的使用方式。

此样例模拟了一个基本的家用安全系统。我们假想的安全系统会监视家中所有的房门，实时显示门的开关状态，以及谁通过了某扇门。此外，此喜用还支持远程开关门操作。

此样例的服务部分(`door_provider`)就是公开门的状态的安全系统自身。他并不使用 Observer API，因为此 Observer 是一个客户方的概念，因此，他旨在
说明如何在 AllJoyn 总线上暴露对象才能使得他们被 Observer 便利地发现并访问。

此样例的服务部分(`door_consumer`) 是一个简易的监视器用户接口，通过此监视器用户可以查看所有门的状态，并远程进行开关操作。他通过使用 Observer 来发现所有的门（实现了 `com.example.Door` 接口的所有总线对象），同时使用 `ProxyBusObject::RegisterPropertiesChangedListener` 机制来与被发现
的门保持同步。

此安全系统的数据模型如下所示：

```xml
<node>
  <interface name="com.example.Door">
    <property name="IsOpen" type="b" access="read">
        <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="true"/>
    </property>
    <property name="Location" type="s" access="read">
        <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="true"/>
    </property>
    <property name="KeyCode" type="u" access="read">
        <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="invalidates"/>
    </property>

    <method name="Open"/>
    <method name="Close"/>
    <method name="KnockAndRun">
        <!-- to demonstrate the use of fire-and-forget methods -->
        <annotation name="org.freedesktop.DBus.Method.NoReply" value="true"/>
    </method>
    <signal name="PersonPassedThrough">
      <arg name="name" type="s"/>
    </signal>
  </interface>
</node>
```
此样例可以在以下平台/语言联编中使用：

* C++ (Linux/Windows/Mac OS X)
* C (Linux/Windows/Mac OS X)
* Java (Android)
* Objective-C (iOS/Mac OS X)

## C++

在使用 C++ 时,  样例的 Service 部分和 Client 部分分别由 `door_provider` 和 `door_consumer` 两个不同的应用程序实现。

### 前提条件

样例是命令行应用程序。因此，你将要打开命令提示符来运行样例。在 Linux 中，可使用你最喜欢的命令行编译器。在 Windows 中，使用命令提示符，在 Mac OS X中，使用 Terminal.app.

样例应用程序位于你搭建或安装 AllJoyn 地址的子目录中：`build/<os>/<cpu>/<variant>/dist/cpp/bin/samples/`，`<os>` 指示你的操作系统 (`linux`, `darwin`, `win7`), `<cpu>` 指示你的处理器类型( 常见的是 `x86` 或 `x86_64`), `<variant>`不是 `debug` 就是  `release`.

针对 Linux 的特殊性，你需要告诉操作系统在哪里可以找到 AllJoyn的分享库。

```sh
AJ_ROOT=~/allseen/core/alljoyn    # the path where you downloaded the
                                  # core/alljoyn git repository
OS=linux                          # your operating system (linux, darwin, win7)
TARGET_CPU=x86                    # your CPU architecture
VARIANT=debug                     # debug or release
export LD_LIBRARY_PATH=$AJ_ROOT/build/$OS/$TARGET_CPU/$VARIANT/dist/cpp/lib:$LD_LIBRARY_PATH
```

对于 Windows 或者 Mac OS X, 此步骤无关紧要。

### Running `door_provider`

运行应用程序：

```sh
cd $AJ_ROOT/build/$OS/$TARGET_CPU/$VARIANT/dist/cpp/bin/samples
./door_provider frontdoor backdoor garage cellar
```

这里模拟一个监控四扇门（前，后门，车库门和地下室门）的安全系统。如果你愿意，你可以同时运行多个 `door_provider` 实例。

你将会被置入一个原始的命令行用户接口当中，在这里你可以发布模拟命令。为了保持接口的简洁，应用程序在所有被维护的门之间保持循环，所以你将不能选择下一次模拟命令时被控制的门。

下面列出了所支持的命令：

```
    q         quit
    f         flip (toggle) the open state of the door
    p <who>   signal that <who> passed through the door
    r         remove or reattach the door to the bus
    c         assign a new (random) keycode to the door
    n         move to next door in the list
    h         show this help message
```

由你通过 `door_provider` 应用程序触发的门状态改变应被反映到所有正在运行的 `door_consumer` 实例上。

### 运行 `door_consumer`
运行应用程序：

```sh
cd $AJ_ROOT/build/$OS/$TARGET_CPU/$VARIANT/dist/cpp/bin/samples
./door_consumer
```

此应用程序将会监控公开到总线上的所有门的状态，并会打印出不论何时出现的包括门出现，消失，或者状态变化的所有提醒。此外，你还可以执行以下操作：

```
    q             quit
    l             list all discovered doors
    o <location>  open door at <location>
    c <location>  close door at <location>
    k <location>  knock-and-run at <location>
    h             display this help message
```

如果你需要，可以同时开启多个 `door_consumer` 实例。这些实例都需要反映被 `door_provider` 
You can start multiple `door_consumer` instances simultaneously if you wish.
They should all reflect the same state for all doors published by all
`door_provider` instances in your network.

## C

The C Observer sample is very similar to the C++ one. Only the Client side of
the sample is implemented for the C language. Use the C++ `door_provider` to act
as the Service side of this sample.

To start the C Observer sample, do this:

```sh
AJ_ROOT=~/allseen/core/alljoyn    # the path where you downloaded the
                                  # core/alljoyn git repository
OS=linux                          # your operating system (linux, darwin, win7)
TARGET_CPU=x86                    # your CPU architecture
VARIANT=debug                     # debug or release

# the following line is only needed for Linux:
export LD_LIBRARY_PATH=$AJ_ROOT/build/$OS/$TARGET_CPU/$VARIANT/dist/cpp/lib:$LD_LIBRARY_PATH

cd $AJ_ROOT/build/$OS/$TARGET_CPU/$VARIANT/dist/cpp/bin/samples
./door_consumer_c
```

The usage of `door_consumer_c` is exactly the same as that of the C++
`door_consumer` application.

## Java (Android)

The Observer sample for Android incorporates both Service and Client aspects in
a single application. You can use the application to publish virtual doors on
the bus, and you can use it to observe (and manipulate) all doors that are
published on the network (both the ones you are publishing yourself, and those
that are published by other instances of the Observer sample).

### Observer Functionality

The application's main screen is divided in 2 sections. The top section shows a
list of discovered doors. Each line states the door's location, bus name, object
path and a check box indicating whether the door is open (checked) or closed
(unchecked). A short tap on a door will toggle the door's state (i.e., invoke
the `Open` or `Close` method on the corresponding proxy object, as appropriate).
A long press causes the invocation of the door's `KnockAndRun` method, which
will cause a closed door to open briefly.

The bottom section of the main screen displays a log of incoming AllJoyn
messages. Each line in the log represents an event received from a door. Example
log messages are:

  * `Door event: FrontDoor: Method Open is called`
  * `Incoming event: FrontDoor opened`

### 服务功能 

此样例应用程序也可以用作在总线上的门的发布者。为了创建一个本地主机的门，在应用程序菜单中选择 "Create Door" . 一旦提供了名字，此门将会公布在
总线上。一旦公布，此应用程序的 Observer 将会发现他，此门将被添加到主屏幕上的已发现门列表中。


从那时起，对待本地主机的门和对待远端门会变得相同：都由 Observer 提供的代理对象处理，而不是直接在总线对象操作。使用这种方式 Observer 可做到
像控制远程对象一样对待本机对象。对于某类应用程序，这会是一个关于应用程序逻辑的显著优化。

若要从总线上移除一个本地门，在应用程序菜单中选择 "Delete Door".



## Objective-C (iOS)

用于 iOS 的 Observer 样例在一个应用程序中集合了服务端和客户端两个方面。你可以使用应用程序在总线上公布虚拟门，还可以使用应用程序观察（操作）
公布在网络上的所有门（包括你自己公布的，也包括其他 Observer 实例公布的门）。


### 前提条件

* [Build the sample][build-ios-osx]
* 在 iOS 设备上安装并运行应用程序
* 确保此设备和你运行 Observer 样例的设备处于同一网络中。

### 运行样例

此应用程序的主视图是一个列出了所有已被发现的门的图表（包括本地公布的门，也包括其他 Observer 实例公布的门）。门旁边的对勾符号指示此门目前已
打开，如果没有对勾符号则表示门关闭。

若要打开或关闭一扇门，可在已观察的门列表上点击一扇门。具体被调用的函数取决于此门目前所处的状态：如果他目前正开着，他将被关闭，反之亦然。

若要公布一扇门，点击工具条上的 Add 按钮(+)，键入门的位置然后点击 Save. 随后门就会出现在已发现门的列表上。此样例应用程序不允许移除或改变已公
布的门的位置。在样例应用程序关闭之后，门会被移除出总线。

请注意，此样例应用程序在对待自己公布的门上与对待其他远端用户发布的门没有任何区别。出现在列表视图上的门都是已经被样例应用程序的 observer 发现，当你点击门时，`Open` 和 `Close` 方法会在一个代理对象上被调用，而不是在总线对象上直接被调用。这说明了 Observer 允许你使用与对待远程对
象完全相同的方法对待本地对象，这降低了应用程序的复杂度。

[build-ios-osx]: /develop/building/ios-osx
