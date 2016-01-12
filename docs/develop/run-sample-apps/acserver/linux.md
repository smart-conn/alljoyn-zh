# Linux - Running AC Server Sample App

## 运行 ACServerSample

### 前提条件

1. 打开一个命令行。
2.切换到 AllJoyn 根目录 （root dir）, 然后:

```sh
export AJ_ROOT=`pwd`

# Set $TARGET CPU to the "CPU=" value used when running scons, e.g. x86_64, x86.
export TARGET_CPU=x86

export LD_LIBRARY_PATH=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/about/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/controlpanel/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/notification/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/services_common/lib:$LD_LIBRARY_PATH
```
  
### 运行 AC 服务器示例应用程序。

在其中一个命令行窗口中运行 `ACServerSample`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/sample_apps/bin/ACServerSample --config-file=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/sample_apps/bin/ACServerSample.conf
```
