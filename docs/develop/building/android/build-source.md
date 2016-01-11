# Build From Source - Android

## 必备条件

* 以下内容使用了大量 [Introduction to the AllJoyn Framework][intro-to-alljoyn-framework] 中提到的术语和概念。因此，我们强烈建议您首先阅读介绍内容。

* 在开始开发之前，请确保按照[Windows][config-build-environment-windows] 或针对 [Linux][config-build-environment-linux] 建立了开发环境。

## 建立编程环境

该章节解释了如何为开发 AllJoyn&trade; Android 应用程序建立编程环境。
包含了以下几点：

* 安装 Android SDK 和 NDK
* 安装一个 IDE

**注意:** 这一节中描述的流程要求使用指定的工具版本。

### 安装 Android SDK

Android 软件开发工具包（SDK）为建立 Android 应用程序提供了工具；也为从某个 Android 设备接收或发出应用程序提供工具。‘adb’ 工具用于：

* 从手机发送／接收文件。
* 运行 AllJoyn 独立路由
* 安装／卸载 应用程序

针对 AllJoyn v15.04，从以下地址下载 Android SDk r20 或其后续版本：

http://developer.android.com/sdk/index.html

更早版本的 AllJoyn 能兼容早期版本的 Android SDK。如果你需要使用早期版本的 Android SDK，请参考对应版本的 AllJoyn 文档。

通过以下链接安装 SDK。

http://developer.android.com/sdk/installing/index.html

SDK 需要在系统中预装特定的软件包。欲知详情，请查看以下地址：

http://developer.android.com/sdk/requirements.html

SDK 安装完毕后，您需要安装想要使用的 Android 平台支持包。查看：

http://developer.android.com/sdk/installing/adding-packages.html

AllJoyn v15.04 架构使用 16 至 22 级的 Android API。注意，安装这些包需要花费一些时间。

### 安装 Android NDK

Android 本地环境包（NDK）使开发者能够建立 JAVA 本地资源库（JNI libraries），可以通过 Android（Java）应用程序调用它们。仅在写入 Java 本地资源库时需要用到 Android NDK。当使用 Android 与 JAVA 绑定时，不需要 Android NDK，但在建立 AllJoyn 时需要使用 Android NDK。

Android NDK 中使用最多的工具是 'ndk-build'。它用于建立 JNI 应用程序的本地资源库。

为了运行使用 AllJoyn 15.04 的 Android JNI 应用程序，需要安装任意高于 9d 版本的 NDK，地址：http://developer.android.com/tools/sdk/ndk/index.html。

按照下载页面的提示安装 NDK。

NDK 需要在系统中预装以下软件包才能运行。

* 最新的Android SDK （包括所有依赖）
* GNU Make 3.81 或更高版本
* 最新版本的 awk （GNU awk 或 nawk）

欲知详情，查看 NDK 下载页面。

### Android IDEs

Android 集成开发环境的指导和下载：

http://developer.android.com/sdk/installing/index.html

### 下载 OpenSSL 头文件和资源库（可选）

AllJoyn 架构可选择性地使用 OpenSSL 加密库。AllJoyn 15.04 和后续版本拥有内建加密库，但也可以根据需要使用 OpenSSL。

如果您在 OpenSSL 配置中建立 AllJoyn，预构建的加密资源库需要连接到 AllJoyn 应用程序。它可以被直接从 Android 设备下载，或者从 AllJoyn 分布的模拟器的 lib 文件夹中获得。连接设备（或者打开 Android 模拟器），执行以下指令：

```sh
cd <alljoyn_dir>/lib
adb pull /system/lib/libcrypto.so libcrypto.so
```

以上命令表示：

adb pull <您想获取的文件在手机中的位置><希望存储所获取的文件的位置和名称>

资源库也可以通过 Android 资源库建立。了解更多关于建立 Android 资源树，查看 Android 资源库网站：

http://source.android.com/source/building.html

重要：务必为您所搭建的 Android 版本从资源库中获取 `libcrypto.so`

## 通过 Android 核心建立 AllJoyn

对于大部分开发者，从 https://allseenalliance.org/developers/download 下载的 SDK 包足够开发使用 AllJoyn 的 Android 应用程序。当然，如果您希望从源代码获取和编译 AllJoyn，请跟随本章节的指导：

为了从源代码编译 AllJoyn，需要以下几个工具：

* Android SDK
* Android NDK
* An Android IDE
* Android source

关于获取 Android SDK、Android NDK 和 IDEs 的指导，请参阅 [Setting Up the Programming Environment][set-up-programming-environment]。
### Android 源代码

需要使用 Android 源代码建立使用 OpenSSL 的 Android target。Google 提供了下载和建立 Android 源代码的详细指导：

系统需求列表和获得相关工具的指导，查看 http://source.android.com/source/initializing.html。

获取 Android Source Tree 的指导，查看 http://source.android.com/source/downloading.html。

http://source.android.com/source/build-numbers.html#source-code-tags-and-builds 获取分支名称。


有关生成和运行生成源的说明，查看 http://source.android.com/source/building.html

* 生成"通用"版本的 Android
* 不需要运行代码。使用仅在 NDK 中不可用的生成库。

### 获取 AllJoyn 源

如果您按照 [The Android source][android-source] 的指导进行操作，您的系统中应装有 repo 工具和 git。
输入以下代码以获取 AllJoyn 源。

```sh
$ mkdir $HOME/alljoyn # for example
$ cd $HOME/alljoyn
$ repo init -u git://github.com/alljoyn/manifest.git
$ repo sync
$ repo start master --all
```

### 为 Android 建立 AllJoyn 架构

此时，您拥有为 Android 建立 AllJoyn 架构所需的全部文件和程序。下述指令建立在您已经在 `/usr/local/android-ndk-r9d` 安装 Android NDK，并下载和在 `$HOME/android-platform` 建立了 Android 源。

对于采用内置加密的 Android，使用下述命令建立 AllJoyn 架构。

```sh
$ export JAVA_HOME="/usr/lib/jvm/java-6-sun" # or java-5-sun
$ export CLASSPATH="/usr/share/java/junit.jar"
$ scons OS=android CPU=arm CRYPTO=builtin ANDROID_NDK=/usr/local/android-ndk-r9b
   ANDROID_SRC=$HOME/android-platform WS=off
```

对于采用 OpenSSL 加密的，使用下述方法：

```sh
$ export JAVA_HOME="/usr/lib/jvm/java-6-sun" # or java-5-sun
$ export CLASSPATH="/usr/share/java/junit.jar"
$ scons OS=android CPU=arm CRYPTO=openssl ANDROID_NDK=/usr/local/android-ndk-r9b
   ANDROID_SRC=$HOME/android-platform WS=off
```

允许指定 AllJoyn 架构在构建过程中使用额外工具。如使用 Uncrustify 对空格进行排版或使用 Doxygen 为 C++ API 生成文档。查看[Configuring the Build Environment (Linux Platform)][config-build-environment-linux] 获取更多关于安装这两个工具的详细指导。

[intro-to-alljoyn-framework]: /learn/core/standard-core
[config-build-environment-windows]: /develop/building/windows/build-source
[config-build-environment-linux]: /develop/building/linux/build-source

[set-up-programming-environment]: #setting-up-the-programming-environment
[android-source]: #the-android-source
