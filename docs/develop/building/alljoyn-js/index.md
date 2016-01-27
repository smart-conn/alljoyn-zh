# AllJoyn.js 入门
AllJoyn.js 的根本目的在于在 JavaScript 中更轻松地开发 AllJoyn 应用程序。JavaScript 是世界上使用最广泛的编程语言。

AllJoyn.js 是 AllJoyn 精简核心库 (AJTCL) 和基本服务与 Duktape [www.duktape.org](http://www.duktape.org) 之间的深层次整合,Duktape 是一种兼容编辑器，专为在小型嵌入式微处理器上运行而设计。尽管它被限制在嵌入式微处理器有限的资源内进行运行，AllJoyn.js 也仅限于这个应用场景，它可以被用于更多高级别的操作系统中，如 Windows，Linux，进行通用 AllJoyn 编程。

AllJoyn.js 运行环境包含一个 “ScriptConsole” 服务，它为安装新脚本和与正在运行的 Javascript 应用程序提供支持。ScriptConsole 服务是一个 AllJoyn 服务，和其它 AllJoyn 服务一样，它可以被其它运行相应客户端应用程序的设备通过网络进行远程访问。目前的代码库包含了一个命令行 ScriptConsole 客户端，支持 Linux，Windows 和 Mac OSX。此命令行工具可以用来将新的脚本安装到一个正在运行的 AllJoyn.js 实例，也允许以交互方式输入的 JavaScript 代码。ScriptConsole 支持远程记录传递给 print() 和 alert()的 JavaScript 函数的字符串数据。


# 从源代码建立 （Windows 和 Linux）
从源代码建立 AllJoyn.js 需要外部依赖项。AllJoyn 功能基于 AllJoyn 精简客户端。在精简客户端之下，是编译并运行脚本的 JavaScript 引擎。这个 JavaScript 称为 Duktape。

## Duktape

AllJoyn.js 依赖与 Duktape ECMASCript 编译器。可从[这里](http://www.duktape.org)找到源码。
AllJoyn.js v15.04 依赖于 Duktape v1.2.1。在下载完成之后，提取存档并记下位置。AllJoyn 精简客户端根据 Duktape 源进行编译和连接，因此环境变量需要设置为 Duktape 的位置。

#### Windows

```
set DUKTAPE_DIST="C:\Path\to\duktape\root"
```

#### Linux

```
export DUKTAPE_DIST=/Path/to/duktape/root
```

## AllJoyn Thin Client

AllJoyn.js 本身建立在 AllJoyn 精简客户端的顶端。控制台应用程序使用 AllJoyn 标准客户端。您需要同时拥有精简和标准版本，来运行 AllJoyn.js 并且使用控制台。

[这里](https://allseenalliance.org/developers/develop/building/thin-linux) 提供了获取 Think Client 源的指导。

注意: 使用 15.04b 或之后版本的 AllJon Thin Client

```
git checkout RB15.04
scons
```

## 基础服务

AllJoyn.js 也依赖于一些基础服务。可以使用 git clone 下载基础服务的 git 存储库。

```
git clone https://git.allseenalliance.org/gerrit/services/base.git
```

必修检查 RB15.04 版本的分支：

```
git checkout RB15.04
```

## AllJoyn.js

在精简客户端建立完毕后，资源库会检查您的文件夹结构是否被正确建立，否则 AllJoyn.js 将不知道您前序步骤建立成果的位置。您的目录结构应该如下：

```
allseen
   | ---- core
   |        | ---- alljoyn-js
   |        | ---- ajtcl    (Thin Client)
   |        | ---- alljoyn  (Standard Client)
   |
   | ---- services
            | ---- base_tcl
            | ---- base
```

如上表所示，AllJoyn.js git 存储库必须与 AllJoyn Thin Client 处在同级目录中。AllJoyn.js 可采用与其它 AllJoyn 存储库相同的方式从 git 中提取出来。

```
git clone https://git.allseenalliance.org/gerrit/core/alljoyn-js.git
git checkout RB15.04
scons
```

## 控制台应用程序

为了建立控制台应用程序，需要设置另一个环境变量，它指向 AllJoyn 资源库 (alljoyn.lib 或 liballjoyn.so)。该位置在 AllJoyn （标准客户端）库中的 build 目录内。完整路径为 “/build/{os}/{architecture}/{debug|release}/dist”。使用您设置 duktape 的相同方法设置环境变量。举例说明，对于一个 x86 debug，路径应为：

#### Windows

```
set ALLJOYN_DIST="<path-to-alljoyn-folder>/build/win7/x86/debug/dist"
```

#### Linux

```
export ALLJOYN_DIST="<path-to-alljoyn-folder>/build/linux/x86/debug/dist"
```
经过以上设置，控制台程序才能够被建立。导航至控制台文件夹并且运行 scons

```
cd console
scons
```

## Python Debugger Console Python 调试器控制台
AllJoyn.js Console 应用程序同样支持调试功能。命令行调试工具内建在上文提到的标准控制台中。此外，Python GUI 可以提供更好的调试体验。为了使用 Python GUI，您必须为 AllJoyn.js 控制台建立一个 Python 扩展，包含了一些额外的依赖项。Python GUI debugger 在 Linux 中支持 Python 2.7 或 3.x，在 Windows 中支持 Python 3.x。在 Windows 中建立 Python 2.7 扩展需要老版本的 Visual Studio 支持，但它与当前版本的 AllJoyn 代码不兼容。Python GUI 目前在 Linux 中最易被建立和使用。

#### Linux

在 Ubuntu Linux 中，使用以下命令安装所需工具：

```
sudo apt-get install build-essential python-dev
```

当这些包被安装后，导航至您 AllJoyn.js 存储库的控制台目录。你需要在这里建立用于 Python 和 Alljoyn.js 连接的资源库。

```
cd <ajs_git_repo>
cd console
python setup.py build
python setup.py install  # <--- May need to run as root user!
```

这些命令将会建立一个资源库，并将其安装至 python 可以发现的位置。如果安装成功，您可以开启 GUI 并且进行调试。下面的例子说明如何连接到一个任意的 AllJoyn.js 设备，或者一个特定的 AllJoyn.js 设备（使用 --name 标志）。

```
python pydebugger.py

python pydebugger.py --name <device>
```

一旦 AllJoyn.js 客户端发现了 GUI，就会打开它，您就可以进行脚本的调试了。


#### Windows

在 Windows 中建立 Python GUI 并不像 Linux 中那样简单，这需要一些变通的办法。问题的关键在于 3.5 版本之前的 Python 3 使用 Visual Studio 2010 建立，然而许多用户已经升级了这个版本。如果您使用 Visual Studio 2010 建立 Python 3 扩展，您想不会遇到问题。但如果不是，您将需要一些额外的步骤。第一步对于所有 Visual Studio 版本通用。

1. 下载 [Python 3.4](https://www.python.org/downloads/release/python-342/) （64位为宜)

2. 下载 [Python extensions for Windows](http://sourceforge.net/projects/pywin32/files/) (与 Python 3.4 相同的结构)

3. 先安装 Python 3.4，再安装针对 Windows 的 Python 扩展。

如果您安装了多个版本的 Python，请确保 Python 3.4 目录的 PATH 环境变量位于其它版本 Python 目录之前。

下面的步骤根据您的 Visual Studio 版本会有所不同。如果您是 Visual Studio 2010，直接跳至 ”Building“ 章节，否则请继续。

如前文所述，Python 3.4 使用 Visual Studio 2010 建立。可以通过改变 Python 的工具链版本检查，使用您的 Visual Studio 版本。导航至 Python 3.4 安装目录并且打开以下文件：

```
<Python34 dir>/Lib/distutils/msvs9compile.py
```

搜索行：

```
VERSION = get_build_version()
```

替换成：

```
VERSION = 12.0
```

实际您使用的数字（本例中的 12.0）根据您安装的 VS 版本填写。

* VS 2011 = 10.0
* VS 2012 = 11.0
* VS 2013 = 12.0

完成上述句改，您就可以使用 Python GUI debugger 了。

#### Building

Building 的步骤与 Linux 的几乎相同。正如前面提到的，保证您的 PATH 环境变量首先列出 Python 3.4 的目录。

```
cd <ajs_git_repo>
cd console
python setup.py build
python setup.py install
```

# 下载预编译的二进制文件

#### Windows, Linux and Mac

Allseen Alliance 主机为 AllJoyn.js 和控制台应用程序预先生成的二进制文件。

* [AllJoyn.js Windows](https://build.allseenalliance.org/ci/job/alljoyn-js-win/)
* [AllJoyn.js Linux](https://build.allseenalliance.org/ci/job/linux-js-nightly/)
* [AllJoyn.js Mac](https://build.allseenalliance.org/ci/job/alljoyn-js-mac/)

控制台应用程序仍需要使用一些标准客户端资源库。通过下载 SDK，可以获得这个库并且预编译。与从源代码编译类似，您需要向控制台指出这些库所在的位置。

#### Windows

```
set ALLJOYN_DIST="<path-to-SDK>"
```

#### Linux

```
export ALLJOYN_DIST="<path-to-SDK>"
```

一旦完成，您可以为您的平台下载预构建的控制台应用程序。

* [Console Windows](https://build.allseenalliance.org/ci/job/alljoyn_js-console-win/)
* [Console Linux](https://build.allseenalliance.org/ci/job/alljoyn_js-console-linux/)
* [Console Mac](https://build.allseenalliance.org/ci/job/alljoyn_js-console-mac/)


#### Arduino Yun

这些说明假定您已更新您的云到 LininoIO 镜像。

安装这些包：duktape, ajtcl, ajtcl-services, alljoyn.js

```
wget http://download.linino.org/linino_distro/lininoIO/latest/packages/duktape_1.1.0-1_ar71xx.ipk && opkg install duktape_1.1.0-1_ar71xx.ipk

wget http://download.linino.org/linino_distro/lininoIO/latest/packages/ajtcl_1.0.1-1_ar71xx.ipk && opkg install ajtcl_1.0.1-1_ar71xx.ipk

wget http://download.linino.org/linino_distro/lininoIO/latest/packages/ajtcl-services_1.0.1-1_ar71xx.ipk && opkg install ajtcl-services_1.0.1-1_ar71xx.ipk

wget http://download.linino.org/linino_distro/lininoIO/latest/packages/ajtcl-alljoynjs_1.0.1-1_ar71xx.ipk && opkg install ajtcl-alljoynjs_1.0.1-1_ar71xx.ipk
```
