# Running the Observer Sample

The Observer sample illustrates how to use the Observer API (introduced in
AllJoyn R15.04) for easy object discovery and session management.

The sample is a simulation of a rudimentary home security system. Our
hypothetical security system monitors all doors in your house, and lets you
know in real time whether they're open or closed, and who passes through a
door. In addition, it allows for the remote opening and closing of doors.

The Service part of the sample (`door_provider`) is the security system itself
that publishes the state of the doors. It does not make use of the Observer API
because the Observer is a Client-side concept, but it does illustrate how to
expose objects on the AllJoyn bus in such a way that they can easily be
discovered and accessed by an Observer.

The Client part of the sample (`door_consumer`) is a simple monitoring user
interface through which the user can monitor the state of the doors, and
remotely open or close doors. It makes use of the Observer to discover all doors
(i.e., all bus objects implementing the `com.example.Door` interface), and of
the `ProxyBusObject::RegisterPropertiesChangedListener` mechanism to keep track
of the current state of the discovered doors.

The data model for the security system is as follows:

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

The sample can be run on the following platforms/language bindings:

* C++ (Linux/Windows/Mac OS X)
* C (Linux/Windows/Mac OS X)
* Java (Android)
* Objective-C (iOS/Mac OS X)

## C++

For C++, the Service and Client portions of the sample are implemented as
separate applications: `door_provider` and `door_consumer`.

### Prerequisites

The samples are command-line applications. Hence, you'll need to open a command
prompt to start the samples. On Linux, use your favorite terminal emulator. On
Windows, use Command Prompt, on Mac OS X, use Terminal.app.

The sample applications are located in a subdirectory of the path where you
built or installed AllJoyn: `build/<os>/<cpu>/<variant>/dist/cpp/bin/samples/`,
where `<os>` is your operating system (`linux`, `darwin`, `win7`), `<cpu>`
is your processor type (typically `x86` or `x86_64`), and `<variant>` is either
`debug` or `release`.

Specifically for Linux, you need to tell the operating system where to find the
AllJoyn shared libraries:

```sh
AJ_ROOT=~/allseen/core/alljoyn    # the path where you downloaded the
                                  # core/alljoyn git repository
OS=linux                          # your operating system (linux, darwin, win7)
TARGET_CPU=x86                    # your CPU architecture
VARIANT=debug                     # debug or release
export LD_LIBRARY_PATH=$AJ_ROOT/build/$OS/$TARGET_CPU/$VARIANT/dist/cpp/lib:$LD_LIBRARY_PATH
```

This step should not be necessary on Windows or Mac OS X.

### Running `door_provider`

Start the application:

```sh
cd $AJ_ROOT/build/$OS/$TARGET_CPU/$VARIANT/dist/cpp/bin/samples
./door_provider frontdoor backdoor garage cellar
```

This will emulate a security system that monitors four doors (the front door,
the back door, the garage door and the cellar door). You can start multiple
`door_provider` instances concurrently if you wish.

You will be dropped into a primitive command line user interface where you can
issue simulation comands. To keep the interface simple, the application
continuously cycles through all doors it maintains, and you cannot choose which
door will be the subject of your next simulation command.

The following commands are supported:

```
    q         quit
    f         flip (toggle) the open state of the door
    p <who>   signal that <who> passed through the door
    r         remove or reattach the door to the bus
    c         assign a new (random) keycode to the door
    n         move to next door in the list
    h         show this help message
```

The changes to the door state that you trigger from the `door_provider`
application should be reflected in all running `door_consumer` instances.

### Running `door_consumer`
Start the application:

```sh
cd $AJ_ROOT/build/$OS/$TARGET_CPU/$VARIANT/dist/cpp/bin/samples
./door_consumer
```

The application will monitor the state of all doors that are published on the
bus, and will print notifications whenever doors appear, disappear, or change
state. In addition, you can perform the following actions:

```
    q             quit
    l             list all discovered doors
    o <location>  open door at <location>
    c <location>  close door at <location>
    k <location>  knock-and-run at <location>
    h             display this help message
```

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

### Service Functionality

The sample application is also capable of acting as a publisher of doors on the
bus. To create a locally hosted door, select "Create Door" from the application
menu. Once you provide a name, the door will be published on the bus. Once it is
published, the application's Observer will discover it and the door will be
added to the list of discovered doors on the main screen.

From there on out, the locally hosted door is treated exactly the same as a
remote door: all manipulations are performed on the proxy object provided by the
Observer, rather than on the bus object directly. In this way, the Observer
makes it possible for applications to treat locally hosted objects exactly the
same as remote objects. This is a significant simplification of the application
logic for certain classes of applications.

To remove a locally hosted door from the bus, select "Delete Door" from the
application menu.

## Objective-C (iOS)

The Observer sample for iOS incorporates both Service and Client aspects in
a single application. You can use the application to publish virtual doors on
the bus, and you can use it to observe (and manipulate) all doors that are
published on the network (both the ones you are publishing yourself, and those
that are published by other instances of the Observer sample).

### Prerequisites

* [Build the sample][build-ios-osx]
* Install and run the sample on an iOS device
* Make sure the device is connected to the same network as the other devices
on which you are running observer samples

### Running the sample

The main view of the application is a Table View listing all the doors that
have been discovered (both the ones that are published locally, and those that
are published by other observer samples). A check mark next to a door indicates
that it's currently open. If no check mark is shown, the door is closed.

To open or close a door, tap on the door in the list of observed doors. The
actual method that is called on the door depends on its current state: if it
is open, it will be closed and the other way around.

To publish a door, tap the Add button (+) on the bar, type in a location for
the door and tap Save. The door should now appear in the list of observed
doors. The sample application does not allow you to remove, or change the
location, of a door you've published. The door will be removed from the bus when
you close the sample application.

Note that the sample application does not treat the doors it itself publishes on
the bus any different from doors published by remote peers. The door appears in
the Table View because it has been discovered by the sample application's
Observer, and when you tap it, the `Open` and `Close` methods are invoked on a
proxy object, not on the bus object directly. This illustrates that an Observer
allows you to treat locally hosted objects in the exact same way as remote
objects, which reduces application complexity.

[build-ios-osx]: /develop/building/ios-osx
