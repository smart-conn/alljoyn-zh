# Building Linux

## Setup

**NOTE:** The installation commands below refer specifically to
Debian/Ubuntu Linux. Equivalent commands are available for other distributions of Linux.

* Build tools and libs
```sh
sudo apt-get install build-essential libgtk2.0-dev libssl-dev xsltproc ia32-libs libxml2-dev libcap-dev
```
* Install Python v2.6/2.7 (Python v3.0 is not compatible and will cause errors)
```sh
sudo apt-get install python
```
* Install SCons v2.0
```sh
sudo apt-get install scons
```
* OpenSSL
```sh
sudo apt-get install libssl-dev
```
* Download the [AllJoyn Source zip][download] and extract source. The tree
  should look like below. Note, extra directories may exist.
```sh
root-source-dir/
    core/
        alljoyn/
        ajtcl/
    services/
        base/
        base_tcl/
```


## Build Samples

```sh
cd <root dir of source>/core/alljoyn
scons BINDINGS=cpp WS=off BT=off ICE=off SERVICES="about,notification,controlpanel,config,onboarding,sample_apps"
```

## Build AC Server Sample

The AC Server Sample app uses all of the base services to simulate
an AC device.

```sh
# Note, exclude the "base" dir for pre-14.06 source
cd $AJ_ROOT/services/base/sample_apps
scons BINDINGS=cpp WS=off ALL=1
```

## Add the AllJoyn&trade; framework to an existing app

* Setup

```sh
  export AJ_ROOT=~/alljoyn

  # <TARGET CPU> can be either x86_64, x86, or whatever value you set for CPU= when running SCons.
  export AJ_DIST="$AJ_ROOT/core/alljoyn/build/linux/<TARGET CPU>/debug/dist"
```

* Add header include directories

```sh
export CXXFLAGS="$CXXFLAGS \
    -I$AJ_DIST/cpp/inc \
    -I$AJ_DIST/about/inc \
    -I$AJ_DIST/services_common/inc \
    -I$AJ_DIST/notification/inc \
    -I$AJ_DIST/controlpanel/inc \
    -I$AJ_DIST/services_common/inc \
    -I$AJ_DIST/samples_common/inc"
```

* Configure linker to include required libs

```sh
export LDFLAGS="$LDFLAGS \
    -L$AJ_DIST/cpp/lib \
    -L$AJ_DIST/about/lib \
    -L$AJ_DIST/services_common/lib \
    -L$AJ_DIST/notification/lib \
    -L$AJ_DIST/controlpanel/lib"
```

[download]: https://allseenalliance.org/framework/download
