# 运行 Config 样例 - Thin Linux

## 前提条件
* [Build the thin Linux samples][build-thin-linux]
* [Build the AllJoyn&trade; router][build-linux].  AllJoyn 精简应用程序需要一个可以连接的 AllJoyn 路由来正常工作。

## 运行 Config Sample

1. 使用配置文件运行 AllJoyn daemon，使精简应用程序可以连接。
  
  ```sh
  # <TARGET CPU> can be either x86_64, x86, or whatever value you set for CPU= when running SCons.
  export TARGET_CPU=<TARGET CPU>
  cd $AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/release/dist/cpp/bin
  
  export LD_LIBRARY_PATH=`pwd`/../lib:$LD_LIBRARY_PATH
  # This sets the library path to load the liballjoyn.so shared library.
    
  ./alljoyn-daemon &
  ```

2. 运行 Config Sample (在新的命令行中)
  
  ```sh
  cd $AJ_ROOT/services/sample_apps/build
  ./ConfigSample
  ```

3. 使用下列中的一个 Config client 应用程序与 Config service 进行交互。

  * [iOS Config Sample][ios_config_sample]
  * [Android Config Sample][android_config_sample]
  * [Linux Config Client Sample][linux_config_sample]

[ios_config_sample]: /develop/run-sample-apps/config/ios-osx
[android_config_sample]: /develop/run-sample-apps/config/android
[linux_config_sample]: /develop/run-sample-apps/config/linux
[build-thin-linux]: /develop/building/thin-linux
[build-linux]: /develop/building/linux

