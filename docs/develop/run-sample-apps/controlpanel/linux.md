# Linux - 运行控制面板应用程序样例

## 运行 ControlPanelSample, ControlPanelController 应用程序样例

### 前提条件

打开两个命令行窗口，每一个都切换到 AllJoyn&trade; root dir，然后：

```sh
export AJ_ROOT=`pwd`

# Set $TARGET CPU to the "CPU=" value used when running scons, e.g. x86_64, x86.
export TARGET_CPU=x86

export LD_LIBRARY_PATH=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/about/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/controlpanel/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/notification/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/services_common/lib:$LD_LIBRARY_PATH
```
  
### 运行控制面板应用程序样例

在一方命令行窗口中运行 `ControlPanelSample`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/controlpanel/bin/ControlPanelSample
```

### 运行控制面板控制方应用程序样例

在另一方命令行窗口中运行 `ControlPanelController`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/controlpanel/bin/ControlPanelController
```
