# Linux - 运行 Config 实例应用程序

##运行 Linux ConfigClient, ConfigService 应用程序 

### 前提条件

打开两个命令行窗口。全部切换至 AllJoyn 根目录，随后：

```sh
export AJ_ROOT=`pwd`

# <TARGET CPU> can be either x86_64, x86, or whatever value you set for "CPU=" when running SCons.
export TARGET_CPU=x86
            
export LD_LIBRARY_PATH=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/about/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/config/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/services_common/lib:$LD_LIBRARY_PATH
```

### 运行 ConfigService 样例应用程序

在一方的命令行窗口中运行  `ConfigService`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/config/bin/ConfigService --config-file=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/config/bin/ConfigService.conf
```

### 运行e ConfigClient 样例应用程序

在另一方的命令行窗口中运行 `ConfigClient`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/config/bin/ConfigClient
```
