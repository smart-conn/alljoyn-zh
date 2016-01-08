# Building Linux

## 设置

**NOTE:** 下列安装命令是针对 Debian/Ubuntu Linux 系统的。 对应其他 Linux 版本的安装命令也有提供。

* 搭建工具和库
```sh
sudo apt-get install build-essential libgtk2.0-dev libssl-dev xsltproc ia32-libs libxml2-dev libcap-dev
```
* 安装 Python v2.6/2.7 (不兼容 Python v3.0, 会引发错误。)
```sh
sudo apt-get install python
```
* 安装 SCons v2.0
```sh
sudo apt-get install scons
```
* OpenSSL
```sh
sudo apt-get install libssl-dev
```
* 下载 [AllJoyn Source zip][download] 并提取源代码。此树应为如下所示。可能会存在更多的目录。
```sh
root-source-dir/
    core/
        alljoyn/
        ajtcl/
    services/
        base/
        base_tcl/
```


## 搭建样例

```sh
cd <root dir of source>/core/alljoyn
scons BINDINGS=cpp WS=off BT=off ICE=off SERVICES="about,notification,controlpanel,config,onboarding,sample_apps"
```

## 搭建 AC 服务器 样例

AC 服务器样例应用程序使用全部的基础服务来模拟一个 AC 设备。

```sh
# Note, exclude the "base" dir for pre-14.06 source
cd $AJ_ROOT/services/base/sample_apps
scons BINDINGS=cpp WS=off ALL=1
```

## 向现存的应用程序添加一个 AllJoyn&trade; 框架。

* 设置

```sh
  export AJ_ROOT=~/alljoyn

  # <TARGET CPU> can be either x86_64, x86, or whatever value you set for CPU= when running SCons.
  export AJ_DIST="$AJ_ROOT/core/alljoyn/build/linux/<TARGET CPU>/debug/dist"
```

* 添加 header （包括目录）

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

* 配置连接器，以纳入所需要的库

```sh
export LDFLAGS="$LDFLAGS \
    -L$AJ_DIST/cpp/lib \
    -L$AJ_DIST/about/lib \
    -L$AJ_DIST/services_common/lib \
    -L$AJ_DIST/notification/lib \
    -L$AJ_DIST/controlpanel/lib"
```

[download]: https://allseenalliance.org/framework/download
