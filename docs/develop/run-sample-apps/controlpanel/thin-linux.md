# 运行控制面板样例 - Thin Linux

## 前提条件
* [Build the thin Linux samples][build-thin-linux]
* [Build the AllJoyn&trade; router][build-linux]. AllJoyn 精简应用程序需要一个可以连接的 AllJoyn 路由来正常工作。

## 运行被控制方样例

1. 使用配置文件运行 AllJoyn daemon， 使精简应用程序可以连接。

  ```sh
  # <TARGET CPU> can be either x86_64, x86, or whatever value you set for CPU= when running SCons.
  export TARGET_CPU=<TARGET CPU>
  cd $AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/release/dist/cpp/bin

  export LD_LIBRARY_PATH=`pwd`/../lib:$LD_LIBRARY_PATH
  # This sets the library path to load the liballjoyn.so shared library.
    
  ./alljoyn-daemon &
   ```

2. 运行被控制方应用程序 (在另一个命令行中)。

  ```sh
  cd $AJ_ROOT/services/sample_apps/build
  ./ControlleeSample
  ```
  
3. 使用下列控制方之一与被控制方进行交互：
  * [iOS Controller][ios_controller]
  * [Android Controller][android_controller]

[ios_controller]: /develop/run-sample-apps/controlpanel/ios-osx
[android_controller]: /develop/run-sample-apps/controlpanel/android
[build-thin-linux]: /develop/building/thin-linux
[build-linux]: /develop/building/linux

