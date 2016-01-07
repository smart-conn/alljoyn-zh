# Build From Source - Android

## 前提条件

* 以下内容涉及到很多在 [Introduction to the AllJoyn Framework][intro-to-alljoyn-framework] 中所描述的概念和术语，因此我们强烈建议您首先阅读 Introduction 当中的内容。

* 在进行开发之前，请确认您已设置好开发环境。参见[Windows][config-build-environment-windows] 或 [Linux][config-build-environment-linux].

## 设置编译环境

此章节解释了如何设置可用于开发适用于 AllJoyn&trade; 的 Android 应用程序的编译环境。此章节包含以下主题：

* 安装 Android SDK 和 NDK
* 安装一个 IDE

**NOTE:** 此章节描述的设置过程需要指定的工具版本。

### 安装 Android SDK


Android 软件开发包 (SDK) 为开发 Android 应用程序以及 Android 设备发送/接收应用程序提供了必备的工具。'adb'工具被用于：

* 向手机端传输文件及从手机端获取文件。
* 运行 ALlJoyn 独立路由。
* 安装/卸载应用程序。

对于 v15.04版本的 AllJoyn, 可由以下地址下载 r20 或更晚版本的 Android SDK:

http://developer.android.com/sdk/index.html

新版本的 Android SDK 会兼容早起版本的 AllJoyn. 如果您需要新版本的 Android SDK 请参阅对应 AllJoyn 版本的说明文档。

安装 SDK 的步骤如下：

http://developer.android.com/sdk/installing/index.html

安装 SDK 需要在您的系统中预装特定的软件包。详细信息请参见以下链接：

http://developer.android.com/sdk/requirements.html

在 SDK 安装完毕后，您必须安装您希望使用的 Android 平台支持包。参见：

http://developer.android.com/sdk/installing/adding-packages.html

AllJoyn v15.04版本架构使用16到22 levels 的 Android API. 注意，安装这些软件包会花费一些时间。

### 安装 Android NDK

Android 原生开发工具包（NDK）使开发者可以建造可由 Android（Java）应用程序调用的 Jave 原生库（JNI Libraries）. 只有编写 Java 原生库时才会需
要 Android NDK. Android NDK 不要求使用 Android Java 绑定，但搭建 AllJoyn 则要求此绑定。

Android NDK 中的主要工具是'ndk-build',用来搭建 JNI 应用程序的原生库。

如需在15.04版本的 AllJoyn 上运行 Android JNI 应用程序，可以从 http://developer.android.com/tools/sdk/ndk/index.html 安装 9d 以及任意之前版 本的 NDK.

安装 NDK 可参考下载页中的指导。

为了顺利运行，NDK 要求以下软件包已预先安装到您的系统：

* 最新的 Android SDK (包含所有附属)
* GNU Make 3.81版本或更新。
* 近期版本的 awk (GNU awk 或者 nawk)

更多信息请参阅 NDK 的下载页。

### Android IDEs
Android 集成开发环境的指导和下载可由如下链接获得：

http://developer.android.com/sdk/installing/index.html

### 下载 OpenSSL 头文件以及库（可选）

AllJoyn 框架选择性地使用了 OpenSSL crypto 库。AllJoyn 15.04 以及后续的版本内置了 crypto 函数，如果需要也可能会内置 OpenSSL 的功能。

如果您在 OpenSLL 配置下搭建 AllJoyn，则需要预制的 libcrypto 库来将 AllJoyn 应用程序链接起来。该库可在 Android 设备上直接下载，或者在 AllJoyn 发布版中的 lib 文件夹中进行仿真。连接上设备（或者开启 Android 仿真器），然后运行以下命令：

```sh
cd <alljoyn_dir>/lib
adb pull /system/lib/libcrypto.so libcrypto.so
```

上述命令的意思是：

adb 拉去 <你想要在手机上拉去的文件的地址>，<你想要在电脑上存储的文件地址以及给文件的命名>。


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
