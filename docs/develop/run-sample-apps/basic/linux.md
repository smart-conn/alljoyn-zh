# Linux - Basic Sample App

## 运行Linux BasicClient, BasicService 应用程序。

Linux BasicClient 和 BasicService 为解释客户端和服务器端应用程序的实现原理提供了一个简单的例子。BasicService 监听连接并推广一个服务，BasicClient 监听
服务推广并加入 BasicService 发起的会话。在加入会话之后，BasicClient 调用一个在 BasicService 中的 BusObject 上的方法，并打印出返回值。


### 前提条件

1. 打开两个命令行窗口
2. 每一个都切换到 ALlJoyn 根目录，然后：
   
   ```sh
   export AJ_ROOT=`pwd`

   # <TARGET CPU> can be either x86_64, x86, or whatever value you set for "CPU=" when running SCons.
   export TARGET_CPU=x86
            
   export LD_LIBRARY_PATH=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/lib:$LD_LIBRARY_PATH
   ```

### 运行 Linux BasicClient Sample 应用程序

在一个命令行窗口中运行 `basic_client`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/bin/samples/basic_client
```

### 运行 Linux BasicService Sample 应用程序

在另一个命令行窗口中，运行 `basic_service`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/bin/samples/basic_service
```
