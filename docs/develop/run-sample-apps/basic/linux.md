# Linux - Basic Sample App

## Running Linux BasicClient, BasicService Apps

The Linux BasicClient and BasicService provide a simple example 
of how a basic client and service app could be implemented. 
The BasicService listens for connections and advertises a service, 
the BasicClient listens for a service advertisement and joins the 
BasicService session. After joining the session, the BasicClient 
makes a method call on a BusObject of the BasicService, and 
prints out the string return value.

### Prerequisites

1. Open two terminal windows.
2. In each, navigate to the AllJoyn root dir, then:
   
   ```sh
   export AJ_ROOT=`pwd`

   # <TARGET CPU> can be either x86_64, x86, or whatever value you set for "CPU=" when running SCons.
   export TARGET_CPU=x86
            
   export LD_LIBRARY_PATH=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/lib:$LD_LIBRARY_PATH
   ```

### Run the Linux BasicClient Sample App

In one of the terminal windows, run `basic_client`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/bin/samples/basic_client
```

### Run the Linux BasicService Sample App

In the other terminal window, run `basic_service`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/bin/samples/basic_service
```
