# Linux - Running Config Sample Apps

##Running Linux ConfigClient, ConfigService Apps 

### Prerequisites

Open two terminal windows. In each, navigate to the AllJoyn root dir, then:

```sh
export AJ_ROOT=`pwd`

# <TARGET CPU> can be either x86_64, x86, or whatever value you set for "CPU=" when running SCons.
export TARGET_CPU=x86
            
export LD_LIBRARY_PATH=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/about/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/config/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/services_common/lib:$LD_LIBRARY_PATH
```

### Run the ConfigService Sample App

In one of the terminal windows, run `ConfigService`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/config/bin/ConfigService --config-file=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/config/bin/ConfigService.conf
```

### Run the ConfigClient Sample App

In the other terminal window, run `ConfigClient`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/config/bin/ConfigClient
```