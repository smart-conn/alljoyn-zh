# Build From Source - Android

## Prerequisites 必备条件

* The following content uses many terms and concepts that are described in the
[Introduction to the AllJoyn Framework][intro-to-alljoyn-framework].
Therefore, it is strongly recommended that you read the Introduction content first.
以下内容使用了大量 [Introduction to the AllJoyn Framework][intro-to-alljoyn-framework] 中提到的术语和概念。因此，我们强烈建议您首先阅读介绍内容。

* Before proceeding with development, make sure that you have set up the development
environment as described here for [Windows][config-build-environment-windows] or
for [Linux][config-build-environment-linux].
在开始开发之前，请确保按照[Windows][config-build-environment-windows] 或
针对 [Linux][config-build-environment-linux] 建立了开发环境。

## Setting Up the Programming Environment

This section explains how to set up the programming environment
for developing AllJoyn&trade;-enabled Android applications.
It covers the following topics:

* Install the Android SDK and NDK
* Install an IDE

**NOTE:** The procedures described in this section require the
specified tool versions.

### Installing the Android SDK

The Android software development kit (SDK) provides the
tools needed for building Android applications and transferring
applications to or from an Android device. The 'adb' tool is used to:

* Transfer/pull files to/from the phone
* Run the AllJoyn standalone router
* Install/uninstall applications

For AllJoyn v15.04, download Android SDK version r20 or later from the
following location:

http://developer.android.com/sdk/index.html

Earlier versions of AllJoyn can work with older versions of the Android
SDK. Please refer to documentation for your version of AllJoyn if you
require an older Android SDK.

Install the SDK by following the directions given here:

http://developer.android.com/sdk/installing/index.html

The SDK requires certain software packages
to be pre-installed on your system. For more information,
see the following location:

http://developer.android.com/sdk/requirements.html

After installing the SDK, you must install the Android platform
support packages you wish to use. See:

http://developer.android.com/sdk/installing/adding-packages.html

The AllJoyn v15.04 framework uses Android API levels 16 to 22.
Note that installing these packages may take some time.

### Installing the Android NDK

The Android native development kit (NDK) enables developers
to build Java native libraries (JNI libraries) which can be
called from Android (Java) applications. Android NDK is
required only to write Java native libraries. The Android NDK
is not required to use the Android Java bindings, but is
required to build AllJoyn.

The main tool used from the Android NDK is 'ndk-build', which
is used to build the native library of the JNI application.

To run Android JNI applications using AllJoyn 15.04, install any
NDK version 9d or above from http://developer.android.com/tools/sdk/ndk/index.html .

Install the NDK by following the directions given on the download page.

To run, the NDK requires that the following software packages
are pre-installed on your system:

* Latest Android SDK (including all dependencies)
* GNU Make 3.81 or later
* Recent version of awk (GNU awk or nawk)

For more information, see the NDK download page.

### Android IDEs

Instructions and downloads for Android integrated development
environments are available here:

http://developer.android.com/sdk/installing/index.html

### Downloading the OpenSSL header files and library (optional)

The AllJoyn framework optionally uses the OpenSSL crypto library.
AllJoyn 15.04 and later have built-in crypto functions, but
may be built with OpenSSL if needed.

If you build AllJoyn in the OpenSSL configuration, the prebuilt
libcrypto library is needed to link AllJoyn applications.
It can be downloaded directly from the Android device or
emulator into the lib folder of the AllJoyn distribution.
Attach the device (or launch the Android emulator), then
run the following commands:

```sh
cd <alljoyn_dir>/lib
adb pull /system/lib/libcrypto.so libcrypto.so
```

The above command means:

adb pull <location of the file on the phone that you want to pull>
<destination on your machine where you want to store the pulled
file with the name that you want>

The library can also be built from the Android source repository.
For details on building the Android source tree, see the
Android source repository web site:

http://source.android.com/source/building.html

IMPORTANT: Be sure you pull the `libcrypto.so`
library from the version of Android you are building for.

## Building AllJoyn from Source for Android

For most developers, the SDK package available to download
from https://allseenalliance.org/developers/download
is sufficient for developing Android applications using AllJoyn.
However, if you wish to obtain and compile AllJoyn from source,
follow the directions in this section.

To compile AllJoyn from source, the following items are required:

* Android SDK
* Android NDK
* An Android IDE
* Android source

Instructions for obtaining the Android SDK, Android NDK, and IDEs
are in [Setting Up the Programming Environment][set-up-programming-environment].

### The Android source

The Android source (http://source.android.com) is required
for building Android targets using OpenSSL. Google has detailed
instructions for downloading and building Android source.

For a list of system requirements and instructions for obtaining
the required tools, see http://source.android.com/source/initializing.html

For instructions on obtaining the Android Source Tree,
see http://source.android.com/source/downloading.html

When running the repo init command specify the branch name for
the Android release you are targeting. Branch names are listed at
http://source.android.com/source/build-numbers.html#source-code-tags-and-builds

For instructions on building and running the build source, see
http://source.android.com/source/building.html

* Build the "generic" version of Android.
* There is no need to run the code. Only the build libraries
that are not available in the NDK are used.

### Obtaining the AllJoyn source

If you followed the instructions in [The Android source][android-source],
you should have the repo tool and git installed on your system.
Enter the following commands to get the AllJoyn source:

```sh
$ mkdir $HOME/alljoyn # for example
$ cd $HOME/alljoyn
$ repo init -u git://github.com/alljoyn/manifest.git
$ repo sync
$ repo start master --all
```

### Building the AllJoyn framework for Android

At this point. you have all of the files and programs required
to build the AllJoyn framework for Android. The following commands assume
you have installed the Android NDK at `/usr/local/android-ndk-r9d`,
you have downloaded and built the Android source, and it is
located in `$HOME/android-platform`.

Use the following commands to build the AllJoyn framework for Android using
builtin crypto:

```sh
$ export JAVA_HOME="/usr/lib/jvm/java-6-sun" # or java-5-sun
$ export CLASSPATH="/usr/share/java/junit.jar"
$ scons OS=android CPU=arm CRYPTO=builtin ANDROID_NDK=/usr/local/android-ndk-r9b
   ANDROID_SRC=$HOME/android-platform WS=off
```

To build using OpenSSL crypto functions:

```sh
$ export JAVA_HOME="/usr/lib/jvm/java-6-sun" # or java-5-sun
$ export CLASSPATH="/usr/share/java/junit.jar"
$ scons OS=android CPU=arm CRYPTO=openssl ANDROID_NDK=/usr/local/android-ndk-r9b
   ANDROID_SRC=$HOME/android-platform WS=off
```

It is possible to specify that the AllJoyn framework uses
additional tools during the build process. For example, the
AllJoyn framework can use Uncrustify to check white space
compliance and Doxygen for producing API documentation for
the C++ APIs. See [Configuring the Build Environment (Linux Platform)][config-build-environment-linux]
for detailed instructions for installing these two tools.

[intro-to-alljoyn-framework]: /learn/core/standard-core
[config-build-environment-windows]: /develop/building/windows/build-source
[config-build-environment-linux]: /develop/building/linux/build-source

[set-up-programming-environment]: #setting-up-the-programming-environment
[android-source]: #the-android-source
