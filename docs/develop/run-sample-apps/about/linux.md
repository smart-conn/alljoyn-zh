# Linux - Running About Sample Apps

## Running Linux AboutClient and AboutService Apps

### Prerequisites

1. Open two terminal windows.
2. In each, navigate to the AllJoyn&trade; root dir, then:

```sh
export AJ_ROOT=`pwd`

# <TARGET CPU> can be either x86_64, x86, or whatever value you set for "CPU=" when running SCons.
export TARGET_CPU=x86

export LD_LIBRARY_PATH=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/lib:$LD_LIBRARY_PATH
```

### Run the AboutService Sample App

In one of the terminal windows, run `AboutService`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/bin/samples/AboutService
```

**NOTE:** The application just runs and will print information when an AboutClient connects.

### Run the AboutClient Sample App

In the other terminal window, run `AboutClient`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/bin/samples/AboutClient
```

**NOTE:** The application searches for any instance of AboutService that is announcing
the `com.example.about.feature.interface.sample` it will connect to the service
and call all the methods specified in the About Interface and the Echo method
specified in the `com.example.about.feature.interface.sample` interface.

## Run Legacy AboutService and AboutClient Apps

```sh
export AJ_ROOT=`pwd`

# <TARGET CPU> can be either x86_64, x86, or whatever value you set for "CPU=" when running SCons.
export TARGET_CPU=x86

export LD_LIBRARY_PATH=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/lib:$LD_LIBRARY_PATH
```
Depending on the version of the AllJoyn SDK the location of the Legacy sample
apps may be in a different location. If the dist directory contains a subdirectory
named `about` you may need to add the about folder to the LD_LIBRARY_PATH

```sh
export LD_LIBRARY_PATH=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/about/lib:$LD_LIBRARY_PATH
```

### Run the AboutService Sample App

In one of the terminal windows, run `AboutService`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/bin/samples/AboutService_legacy
```

Depending on the version of the AllJoyn SDK, the location of the Legacy sample
apps may have moved. If the dist directory contains a subdirectory
named `about`, you may need to run the sample for the different location

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/about/bin/AboutService
```

**NOTE:** The application just runs and will print information when an AboutClient connects.

### Run the AboutClient Sample App

In the other terminal window, run `AboutClient`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/bin/samples/AboutClient_legacy
```

Depending on the version of the AllJoyn SDK, the location of the Legacy sample
apps may have moved. If the dist directory contains a subdirectory
named `about`, you may need to run the sample for the different location

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/about/bin/AboutClient
```

**NOTE:** The application searches for any instance of AboutService that is announcing
the `org.alljoyn.About` and `org.alljoyn.Icon` it will connect to the service
and call all the methods specified in the About Interface and the the About Icon
interface.