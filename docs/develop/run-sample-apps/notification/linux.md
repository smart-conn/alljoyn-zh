# Linux - 运行提醒应用程序样例

## 运行 ConsumerService 和 ProducerBasic 应用程序样例

### 前提条件

打开两个命令行窗口。每一个都切换到 AllJoyn&trade; 根目录，然后：

```sh
export AJ_ROOT=`pwd`

# <TARGET CPU> can be either x86_64, x86, or whatever value you set for "CPU=" when running SCons.
export TARGET_CPU=x86
            
export LD_LIBRARY_PATH=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/about/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/notification/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/services_common/lib:$LD_LIBRARY_PATH
```

### 运行 ConsumerService 应用程序样例

在一个命令行窗口中运行 `ConsumerService`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/notification/bin/ConsumerService
```

### 运行 ProducerBasic 应用程序样例

在另一个命令行窗口中运行 `ProducerBasic`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/notification/bin/ProducerBasic
```
