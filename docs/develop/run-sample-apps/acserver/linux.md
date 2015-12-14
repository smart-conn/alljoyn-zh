# Linux - Running AC Server Sample App

## Running ACServerSample

### Prerequisites

1. Open a terminal window.
2. Navigate to the AllJoyn root dir, then:

```sh
export AJ_ROOT=`pwd`

# Set $TARGET CPU to the "CPU=" value used when running scons, e.g. x86_64, x86.
export TARGET_CPU=x86

export LD_LIBRARY_PATH=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/about/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/controlpanel/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/notification/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/services_common/lib:$LD_LIBRARY_PATH
```
  
### Run the AC Server Sample App

In one of the terminal windows, run `ACServerSample`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/sample_apps/bin/ACServerSample --config-file=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/sample_apps/bin/ACServerSample.conf
```
