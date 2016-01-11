# Building Thin - Linux

## 设置

**NOTE:** 下列安装命令是针对 Debian/Ubuntu Linux 系统的。 对应其他 Linux 版本的安装命令也有提供。

* 搭建工具和库

```sh
sudo apt-get install build-essential libgtk2.0-dev libssl-dev xsltproc ia32-libs libxml2-dev
```

* 安装 Python v2.6/2.7 (不兼容 Python v3.0, 会引发错误。)

```sh
sudo apt-get install python
```

* 安装 SCons v2.0.

```sh
sudo apt-get install scons
```

* OpenSSL

```sh
sudo apt-get install libssl-dev
```

* 下载并提取 [AllJoyn&trade; source zip][download].

## 搭建样例

#### 搭建核心样例：

```sh
cd $AJ_ROOT/core/ajtcl
scons WS=off
```

核心样例的二进制文件在： `$AJ_ROOT/core/ajtcl/samples/`

#### 搭建服务器样例:

```sh
cd $AJ_ROOT/services/sample_apps
scons WS=off AJ_TCL_ROOT=../../core/ajtcl
```

服务器样例的二进制文件在 `$AJ_ROOT/services/sample_apps/build`

#### 搭建完全的服务器样例 (AC 服务器):

```sh
cd $AJ_ROOT/services/sample_apps/ACServerSample
scons WS=off AJ_TCL_ROOT=../../../core/ajtcl
```

AC 服务器样例的二进制文件在 `$AJ_ROOT/services/sample_apps/ACServerSample/build`

##向应用程序添加一个 AllJoyn™ 框架。

具体指导请参见 [Build an Application using the Thin Library][build-app-thin-library] 章节。

[download]: https://allseenalliance.org/framework/download
[build-app-thin-library]:  /develop/tutorial/thin-app
