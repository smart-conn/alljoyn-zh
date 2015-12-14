# Linux - Chat Sample App

## Running Linux Chat App
The Linux Chat App shows how a chat room can be implemented 
using the AllJoyn&trade; framework, where an app first creates 
and joins a session (with the `-s` flag), after which one or 
more apps later join the same session (with the `-j` flag).

### Prerequisites

Open two terminal windows. In each, navigate to the AllJoyn root dir, then:

```sh
export AJ_ROOT=`pwd`

# &lt;TARGET CPU&gt; can be either x86_64, x86, or whatever value you set for "CPU=" when running SCons.
export TARGET_CPU=x86
            
export LD_LIBRARY_PATH=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/lib:$LD_LIBRARY_PATH
```

### Run the Linux Chat Sample App

1. In one of the terminal windows, run the chat app passing it a 
chat room name with the `-s` flag to set up and join a chat room:

   ```sh
   $AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/bin/samples/chat -s mychannel
   ```

2. In the other terminal window, run the chat app using the `-j` 
flag with the same chat room name to join the same chat room:

   ```sh
   $AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/bin/samples/chat -j mychannel
   ```

3.  Text typed into one chat window will appear in the other 
chat window, accompanied by the BusAttachment's Unique Name.
