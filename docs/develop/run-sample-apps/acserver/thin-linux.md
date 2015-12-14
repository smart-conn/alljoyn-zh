# Running AC Server Sample - Thin Linux

## Prerequisites
* [Build the thin Linux samples][build-thin-linux]
* [Build the AllJoyn&trade; router][build-linux]. AllJoyn thin 
  apps require an AllJoyn router to connect to in order to function properly.

### Run AC Server Sample

1. Launch the AllJoyn router to allow thin apps to connect.

  ```sh
  # <TARGET CPU> can be either x86_64, x86, or whatever value you set for CPU= when running SCons.
  export TARGET_CPU=<TARGET CPU>
  cd $AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/release/dist/cpp/bin
     
   export LD_LIBRARY_PATH=`pwd`/../lib:$LD_LIBRARY_PATH
   # This sets the library path to load the liballjoyn.so shared library.
    
   ./alljoyn-daemon &
  ```

2. Launch the AC Server Sample (in a new terminal).

  ```sh
  cd $AJ_ROOT/services/sample_apps/ACServerSample/build
  ./ACServerSample
  ```

3. Use the following apps to interact with the different services 
provided by the AC Server Sample:
   * About
     * [iOS About Sample][about_ios]
     * [Linux About Client Sample][about_linux]
   * Config
     * [iOS Config Sample][config_ios]
     * [Android Config Sample][config_android]
     * [Linux Config Client Sample][config_linux]
   * Control Panel
   * Notification

[build-thin-linux]: /develop/building/thin-linux
[build-linux]: /develop/building/linux
[about_ios]: /develop/run-sample-apps/about/ios-osx
[about_linux]: /develop/run-sample-apps/about/linux
[config_ios]: /develop/run-sample-apps/config/ios-osx
[config_android]: /develop/run-sample-apps/config/android
[config_linux]: /develop/run-sample-apps/config/linux
