# Linux - 聊天应用程序样例

## 运行 Linux 聊天应用程序

Linux 聊天应用程序解释了如何用  AllJoyn&trade; 框架实现的实现一个聊天室，在这里第一个应用程序创建并加入一个会话（带有 `-s` 标识），之后可以
有更多的应用程序加入此会话（带有`-s` 标识）。

### 前提条件

打开两个命令行窗口。全部切换到 AllJoyn 根目录，随后:

```sh
export AJ_ROOT=`pwd`

# &lt;TARGET CPU&gt; can be either x86_64, x86, or whatever value you set for "CPU=" when running SCons.
export TARGET_CPU=x86
            
export LD_LIBRARY_PATH=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/lib:$LD_LIBRARY_PATH
```

### 运行 Linux 聊天样例应用程序

1. 在一方命令行窗口中运行聊天应用程序，并传入一个带有 `-s` 标识的聊天室名，以建立并加入一个聊天室。

   ```sh
   $AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/bin/samples/chat -s mychannel
   ```

2. 在另一方命令行窗口中运行聊天应用程序，并传入带有 `-j` 标签的与前一应用程序使用的相同的聊天室名，以加入该聊天室。

   ```sh
   $AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/bin/samples/chat -j mychannel
   ```

3.  在一方聊天窗口键入的文本会出现在另一方聊天窗口中，并伴随着 BusAttachment 的唯一识别符。
