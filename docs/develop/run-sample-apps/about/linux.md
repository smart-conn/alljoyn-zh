# Linux - Running About Sample Apps

## 运行 Linux AboutClient 和 AboutService 应用程序

### 前提条件

1. 打开两个命令行窗口。
2. 每一个都切换到 AllJoyn&trade; 根目录（root dir）, 然后:

```sh
export AJ_ROOT=`pwd`

# <TARGET CPU> can be either x86_64, x86, or whatever value you set for "CPU=" when running SCons.
export TARGET_CPU=x86

export LD_LIBRARY_PATH=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/lib:$LD_LIBRARY_PATH
```

### 运行 AboutService Sample 应用程序

在其中一个命令行中，运行 `AboutService`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/bin/samples/AboutService
```

**NOTE:** 应用程序已经运行，在有 AboutClient 连接上时将会打印相关信息。

### 运行 AboutClient Sample App

在另一个命令行中，运行 `AboutClient`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/bin/samples/AboutClient
```

**NOTE:** 此应用程序会搜索任何正在宣布 `com.example.about.feature.interface.sample` 接口的 AboutService 实例。他将会连接到该服务，并调用
About Interface 中所定义的所有方法，以及由 `com.example.about.feature.interface.sample` 接口所定义的 Echo 方法。

## 运行 Legacy AboutService 和 Legacy AboutClient 应用程序。

```sh
export AJ_ROOT=`pwd`

# <TARGET CPU> can be either x86_64, x86, or whatever value you set for "CPU=" when running SCons.
export TARGET_CPU=x86

export LD_LIBRARY_PATH=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/lib:$LD_LIBRARY_PATH
```
由于 AllJoyn SDK 的版本差异，存储 Legacy 示例应用程序的地址也会有所不同。如果分发目录包含一个名为 `about` 的子目录，您需要将此 about 文件夹
添加到 LD_LIBRARY_PATH.

```sh
export LD_LIBRARY_PATH=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/about/lib:$LD_LIBRARY_PATH
```

### 运行 AboutService Sample App

在一个命令行窗口中，运行 `AboutService`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/bin/samples/AboutService_legacy
```
由于 AllJoyn SDK 的版本差异，存储 Legacy 示例应用程序的地址可能已经改变。如果分发目录包含一个名为 `about` 的子目录，您需要在另一个位置运行
该示例。

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/about/bin/AboutService
```

**NOTE:** 应用程序已经运行，在有 AboutClient 连接上时将会打印相关信息。

### 运行 AboutClient Sample App

在另一个命令行窗口中运行 `AboutClient`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/bin/samples/AboutClient_legacy
```

由于 AllJoyn SDK 的版本差异，存储 Legacy 示例应用程序的地址可能已经改变。如果分发目录包含一个名为 `about` 的子目录，您需要在另一个位置运行
该示例。

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/about/bin/AboutClient
```
此应用程序会搜索任何正在宣布 `com.example.about.feature.interface.sample` 接口的 AboutService 实例。他将会连接到该服务，并调用
About Interface 中所定义的所有方法，以及由 `com.example.about.feature.interface.sample` 接口所定义的 Echo 方法。

**NOTE:** 此应用程序会搜索任何正在宣布 `org.alljoyn.About` 以及 `org.alljoyn.Icon` 接口的 AboutService 实例。他将会连接到该服务，并调用
About Interface 以及 About Icon interface 中所定义的所有方法。
