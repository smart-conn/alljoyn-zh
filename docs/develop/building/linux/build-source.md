# Build From Source - Linux

## Build tools and libs 建立工具和库

1. Open a terminal window and run the following command:打开一个终端窗口并且执行以下命令：

  ```sh
  $ sudo apt-get install build-essential libgtk2.0-dev
     libssl-dev xsltproc ia32-libs libxml2-dev libcap-dev
  ```
2. To create a 32-bit build of the AllJoyn&trade; framework
on a 64-bit operating system, install these required development libraries:如果要在一个 64 为操作系统上建立一个 32 位 AllJoyn&trade;，需要安装这些开发库：
  ```sh
  $ sudo apt-get install gcc-multilib g++-multilib libc6-i386
     libc6-dev-i386 libssl-dev:i386 libxml2-dev:i386
  ```

**注意:** libssl-dev does not have multilib support.libssl-dev 不支持多库并存。
If the 32-bit version of libssl-dev is installed, then the 64-bit version is
replaced with the 32-bit version. You can delete the 32-bit version of the
libraries and reinstall the 64-bit version if you wish to go back to 64-bit.
libssl-dev is not required if building AllJoyn with the CRYPTO=builtin option.
如果安装了 32 位的 libssl-dev，那么 64 位的版本将被 32 位的版本取代。如果您想要回到 64 位，您需要首先删除 32 位的版本，再重新安装 64 位的版本。当建立拥有 CRYPTO=builtin 选项的 AllJoyn 时，不需要 libssl-dev。

## Python v2.6/2.7

**注意:** Python v3.0 is not compatible and will cause errors.Python 3.0 不兼容，将导致错误。

1. Python is a common part of most Linux distributions. You can
determine whether Python is already installed on your system by
opening a terminal window and running the following command:
Python 是大部分 Linux 版本的一个常规部分。您可以通过使用终端窗口运行以下指令了解 Python 是否已经被安装：
  ```sh
  $ which python
  ```

  If a path (e.g., /usr/bin/python) is returned, Python is already installed.
  如果返回了一个路径（如 /usr/bin/python），说明 Python 已经被安装了。

2. Otherwise, open a terminal window and run the following command:
否则，打开一个终端窗口并且执行以下命令：
  ```sh
  $ sudo apt-get install python
  ```

3. If this installation method does not give you the correct
version of Python, install the [required version](http://www.python.org/download/).
如果此安装方法未能给您提供一个正确版本的 Python， 安装 [required version](http://www.python.org/download/).

## SCons

[SCons](http://www.scons.org/) is a software construction tool
used to build the AllJoyn framework. SCons is a default package
on most Linux distributions.
[SCons](http://www.scons.org/) 是一个建立 AllJoyn 架构的软件构建工具。SCons 在大部分 Linux 版本中是一个默认包。

Open a terminal window and run the following command:打开一个终端窗口并执行以下命令：

```sh
$ sudo apt-get install scons
```

AllJoyn's builds are verified with SCons v2.3.SCons v2.3 验证 AllJoyn 的构建。

## OpenSSL (optional) OpenSSL（可选）

OpenSSL is an open-source toolkit for implementing secure network
communication and cryptographic functions. AllJoyn only uses the
cryptographic functions of OpenSSL.
It is recommended that you always use the [newest version of
OpenSSL](http://www.openssl.org/).
OpenSSL 是提供安全网络通信和加密方式的一种开源工具包。AllJoyn 只使用 OpenSSL 的加密方式。
建议您使用[最新版本的 OpenSSL](http://www.openssl.org/).

Open a terminal window and run the following command:打开一个终端窗口并且执行以下命令：

```sh
$ sudo apt-get install libssl-dev
```

## git

[Git](http://git-scm.com/) is a source code repository access tool. The AllJoyn
source code is stored in a set of [git projects](https://git.allseenalliance.org/cgit).
[Git](http://git-scm.com/) 是一个连接源代码文件夹的工具。AllJoyn 源代码存储在一套 [git projects](https://git.allseenalliance.org/cgit)中。

Open a terminal window and run the following command:打开一个终端窗口并执行以下命令：

```sh
$ sudo apt-get install git-core
```

## Repo

Repo is a tool used to manage projects that consist of multiple
git projects. The AllJoyn source code is stored in a set of git
projects that can be cloned individually or as a group using
[Google's repo tool](http://source.android.com/source/version-control.html).
This tool is not required, but is highly recommended.
Repo 是用于管理多个 git 工程的工具。Alljoyn 源代码以一系列 git 工程的形式存储，可以通过使用 [Google's repo tool](http://source.android.com/source/version-control.html) 单独或批量克隆。此工具不是必需的，但强烈建议使用。

1. Open a terminal window and run the following command to install curl:打开一个终端窗口并且执行以下命令安装 curl：

  ```sh
  $ sudo apt-get install curl
  ```

2. Navigate to your home directory and download repo by running
the following command:导航至根目录并且执行以下命令下载 repo。

  ```sh
  $ curl https://storage.googleapis.com/git-repo-downloads/repo >
  ~/bin/repo
  ```

3. Copy repo to /usr/local/bin and make it executable using the following commands:将 repo 拷贝至/usr/local/bin 并执行以下命令使其可执行：

  ```sh
  $ sudo cp repo /usr/local/bin
  $ sudo chmod a+x /usr/local/bin/repo
  ```

### Uncrustify

Uncrustify is a source code formatting tool used to maintain a consistent
coding style in the AllJoyn code base. It is not required to build AllJoyn,
but if you intend to contribute code changes to the AllJoyn project you should
configure and use the tool.
Uncrustify 是一个用于保持 AllJoyn 代码库编程风格一致的代码格式工具。这不是构建 AllJoyn 所必需的，但如果您希望对 AllJoyn 工程的代码进行改动，您应该配置并使用这个工具。

**注意:** Uncrustify v0.61 is required for AllJoyn v15.04 and
later. Earlier AllJoyn versions require uncrustify v0.57. Since the
existing AllJoyn code was formatted with a specific version of
uncrustify, using any other version of uncrustify can cause unexpected
build errors when not building with the WS=off option.
Uncrustify v0.61 支持 AllJoyn v15.05 和更高版本。早起版本的 AllJoyn 需要 uncrustify v0.57。由于使用了特定版本的 uncrustify 规定了现有 AllJoyn 代码的格式，当不使用 WF＝OFF 选项构建程序时，使用其它版本的 uncrustify 可能会遇到不可预料的构建错误。

There are two ways to install Uncrustify.有两种方式安装 Uncrustify。

* Download the source and then build and install Uncrustify:下载源并构建和安装 Uncrustify：

  ```sh
   $ mkdir $HOME/uncrustify # for example
   $ cd $HOME/uncrustify
   $ git clone http://github.com/bengardner/uncrustify.git
   $ # or use
   $ #git clone git://uncrustify.git.sourceforge.net/gitroot/uncrustify/uncrustify
   $ cd uncrustify
   $ git checkout uncrustify-0.61
   $ # or for v0.57:
   $ #git checkout uncrustify-0.57
   $ ./configure
   $ sudo make install
  ```

**注意:** In some cases, Uncrustify has failed to build on more recent
Ubuntu versions. Try making the following change to get
Uncrustify to build:
在某些情况下，Uncrustify 在最新的 Ubuntu 版本中构建不成功。试着进行以下改变以构建 Uncrustify。

  ```sh
   diff --git a/src/uncrustify.cpp b/src/uncrustify.cpp index 2635189..7aba76d 100644
   --- a/src/uncrustify.cpp
   +++ b/src/uncrustify.cpp
   @@ -32,6 +32,7 @@
   #ifdef HAVE_STRINGS_H
   #include <strings.h>	/* strcasecmp() */
   #endif
   +#include <unistd.h>

   /* Global data */
   struct cp_data cpd;
  ```

* Install the Uncrustify v0.57 package on Ubuntu:在 Ubuntu 上安装 Uncrustify v0.57 包。
   1. Go to: http://packages.ubuntu.com/precise/uncrustify.前往 http://packages.ubuntu.com/precise/uncrustify。
   2. From the website, click in the "Download uncrustify" table to select your machine's architecture.在网站中点击 "Download uncrustify" 表选择您设备的架构。
   3. From the page that opens after your selection, choose
   a mirror based on your location, and download the .deb package. 在选择后打开的网页中，选择一个基于您位置的镜像，下载 .deb 包。
   4. Install the package using either of these two commands, as appropriate:根据情况，使用以下任一命令安装此包。

   ```sh
   $ sudo dpkg -i uncrustify_0.57-1_amdd64.deb
   $ sudo dpkg -i uncrustify_0.57-1_i386.deb
   ```
   Uncrustify v0.61 packages are not currently available.目前暂不支持 Uncrustify v0.61。

## Doxygen

The [Doxygen tool](http://www.doxygen.org) builds HTML documentation from
source code. It is not required for building AllJoyn binaries.
 [Doxygen tool](http://www.doxygen.org)从源代码生成 HTML 文档。它不用与建立 AllJoyn 代码。

Open a terminal window and run the following command:打开一个终端窗口并执行以下命令：

```sh
$ sudo apt-get install doxygen
```

### Graphviz

The [Graphviz Dot tool](http://www.graphviz.org/) diagrams class hierarchies
and is used by doxygen.
[Graphviz Dot tool](http://www.graphviz.org/)把类的层级结构通过图标展示。Doxygen 会使用它。

Open a terminal window and run the following command:打开一个终端窗口并执行以下命令：

```sh
$ sudo apt-get install graphviz
```

## TeX Live

[TeX Live](http://www.tug.org/texlive/) provides LaTeX binaries
and style sheets for Linux. This optional tool may be used to
produce AllJoyn's API documentation as a PDF document from
the source. It is possible to compile the AllJoyn framework
without producing the documentation.
[TeX Live](http://www.tug.org/texlive/) 提供 LaTeX 二进制文件和针对Linux的样式表。这个可选工具可用于从源中生成 PDF 格式的 AllJoyn API 的文档。当然不生成文档，也可以编译 AllJoyn 架构。
Install TeX Live if you want to produce PDF documentation.

```sh
$ sudo apt-get install texlive
```

## Gecko SDK

The [Gecko SDK](https://developer.mozilla.org/en/Gecko_SDK) (aka XULRunner SDK)
is only required if you are building the AllJoyn JavaScript
plug-in. Otherwise, this section is optional.
[Gecko SDK](https://developer.mozilla.org/en/Gecko_SDK)（又名 XULRunner SDK）仅在构建 AllJoyn JavaScript 插件时是必须的。对于其他情况，这个部分是可选的。

The plug-in was developed against version 1.9.2 of the SDK,
although it may be possible to use an earlier version.
On 64-bit Linux, download the 32-bit version anyway (only
the headers in the SDK are used).
插件是针对 1.9.2 版本开发的，尽管它也可能适用于更早的版本。在 64 位的 Linux 中，也可以下载 32 位的版本。（因为只是用了 SDK 的标头）

## Install Java 安装 Java

Java 6 or greater may be used to build the AllJoyn framework
on a Linux platform.
使用 Java 6 或更高版本构建基于 Linux 平台的 AllJoyn 架构。

**重要:** Using apt-get install java will download open-jdk not
sun-jdk. The AllJoyn framework requires sun-jdk. 使用 apt-get 安装 java 将下载 open-jdk 而不是 sun-jdk。AllJoyn 架构需要使用 sun-jdk。

Install Java using one of these two mechanisms.使用任一以下两种机制，安装 Java。

#### Installing Java 6 when older than Ubuntu 12.04 在 Ubuntu 12.04 或更早版本上安装 Java 6

1. Install Java 6 安装 Java 6

   ```sh
      $ sudo add-apt-repository "deb http://archive.ubuntu.com/ubuntu lucid partner"
      $ sudo apt-get update
      $ sudo apt-get install sun-java6-jdk
   ```

2. Install junit 3.8 or newer (junit is required when building
the AllJoyn Java bindings).安装 junit 3.8或更新版本（需要使用 junit 构建 AllJoyn Java 绑定）
   1. Navigate to (https://github.com/junit-team/junit/wiki/Download-and-Install).导航至 (https://github.com/junit-team/junit/wiki/Download-and-Install)。
   2. Download the jar file "junit-4.9.jar". 下载 jar 文件 "junit-4.9.jar"。
   3. Copy it to usr/share/java/junit-4.9 from the Downloads folder: 从下载文件夹将其拷贝至 usr/share/java/junit-4.9。

      ```sh
         $ sudo cp junit-4.9.jar /usr/share/java/
      ```

3. If you want to run junit tests, install the Apache Ant build
tool (only required to run junit tests, not required to build the
AllJoyn framework).
如果您想要运行 junit 测试，安装 Apache Ant 构建工具（仅用于运行 junit tests，不能由于构建 Alljoyn架构）

   ```sh
      $ sudo apt-get install ant
   ```

#### Installing Java 6 when using Ubuntu 12.04 or newer 在 Ubuntu 12.04 或更新版本上安装 Java 6

With the Ubuntu 12.04 Precise Pangolin release, partner
repositories are no longer available. You must manually
install Java using the following instructions:
在 Ubuntu 12.04 Precise Pangolin 版本中，不再支持 partner 文件夹。您必须根据以下指导手动安装 Java。

1. Download the JDK bin file corresponding to your cpu type
(x86 or x64) from Java SE 6u32 Downloads.从 Java SE 6u32 Downloads 中，根据相应 cpu 类型，下载 JDK bin 文件。

2. Use chmod to make the file executable: 使用 chmod 让文件可执行：

   ```sh
      $ chmod +x jdk-6u32-linux-x64.bin
   ```

3. Extract the bin file: 解压缩 bin 文件：

   ```sh
      $ ./jdk-6u32-linux-x64.bin
   ```

4. Move extracted folder to /usr/lib/jvm/: 把解压缩的文件夹移动到 /usr/lib/jvm/：

   ```sh
      $ sudo mv jdk1.6.0_32 /usr/lib/jvm/
   ```

5. Add the newly installed Java to the list of alternatives:把新安装的 Java 加入选择列表：

   ```sh
      $ sudo update-alternatives --install /usr/bin/javac javac
      /usr/lib/jvm/jdk1.6.0_32/bin/javac 2
      $ sudo update-alternatives --install /usr/bin/java java
      /usr/lib/jvm/jdk1.6.0_32/bin/java 2
      $ sudo update-alternatives --install /usr/bin/javaws javaws
      /usr/lib/jvm/jdk1.6.0_32/bin/javaws 2
   ```

6. Choose default Java: 选择默认 Java：

   ```sh
      $ sudo update-alternatives --config javac
      $ sudo update-alternatives --config java
      $ sudo update-alternatives --config javaws
   ```

7. Check Java version to verify it is installed correctly: 检查 Java 版本以确认它被正确安装：

   ```sh
      $ java -version
   ```

   It should return something similar to: 会返回类似这样语句：

   ```sh
      java version "1.6.0_26"
      Java(TM) SE Runtime Environment (build 1.6.0_26-b03)
      Java HotSpot(TM) 64-Bit Server VM (build 20.1-b02, mixed mode)
   ```

8. Verify the symlinks all point to the new Java location:验证所有指向新 Java 位置的 symlinks。

   ```sh
      $ ls -la /etc/alternatives/java*
   ```

9. (Optional, but recommended) Enable Java plug-in for Mozilla
Firefox (even for Chrome).（可选，但建议）在 Mozilla Firefox （或是 Chrome）中，开启插件功能。

   * For 64-bit jdk: 为 64 为 jdk：

      ```sh
         $ sudo update-alternatives --install \
         /usr/lib/mozilla/plugins/libjavaplugin.so mozilla-javaplugin.so \
         /usr/lib/jvm/jdk1.6.0_32/jre/lib/amd64/libnpjp2.so 2
         $ sudo update-alternatives --config mozilla-javaplugin.so
      ```

   * For 32-bit jdk： 为 32 为 jdk：

      ```sh
         $ sudo update-alternatives --install \
         /usr/lib/mozilla/plugins/libjavaplugin.so mozilla-javaplugin.so \
         /usr/lib/jvm/jdk1.6.0_32/jre/lib/i386/libnpjp2.so 2
         $ sudo update-alternatives --config mozilla-javaplugin.so
      ```

   Test the Java web plug-in by going to http://www.java.com/en/download/testjava.jsp.通过访问 http://www.java.com/en/download/testjava.jsp 测试 Java web 插件。

10.  Install junit 3.8 or newer (junit is required when building
the AllJoyn Java bindings).安装 junit 3.8 或更高版本（需要 junit 建立 AllJoyn Java 绑定）
   1. Navigate to https://github.com/junit-team/junit/wiki/Download-and-Install.导航至 https://github.com/junit-team/junit/wiki/Download-and-Install。
   2. Download the jar file "junit-4.9.jar" and copy it to
   usr/share/java/junit-4.9 from the Downloads folder:下载 jar 文件 "junit-4.9.jar" 并将其从 Downloads 文件夹拷贝至 usr/share/java/junit-4.9。

   ```sh
      $ sudo cp junit-4.9.jar /usr/share/java/
   ```

11. If you want to run junit tests, install the Apache Ant build
tool (only required to run junit tests, not required to build
the AllJoyn framework).如果您想要运行 junit 测试，安装 Apache Ant 构建工具（仅用于运行 junit tests，不能由于构建 Alljoyn架构）。

   ```sh
      $ sudo apt-get install ant
   ```

## googletest

Google Test is Google's framework for writing C++ tests.
Google Test is an xUnit testing architecture used by the
AllJoyn framework to test its C++ APIs. Google Test is optional,
but is required for building the C++ unit tests.
Google Test 是 Google 用于编写 C++ 测试的架构。Google Test 是 AllJoyn 架构用于测试其 API 的一种 xUnit 测试结构。Google Test 是可选的，但在建立 C++ 单元测试时是必需的。

1. Open a browser and navigate to http://code.google.com/p/googletest/downloads/list.打开浏览器并导航至 http://code.google.com/p/googletest/downloads/list。
2. From the googletest download page, download gtest-1.7.0.zip.从 googletest 下载页面，下载 gtest-1.7.0.zip。
3. Unzip the contents of gtest-1.7.0.zip to a known location
(e.g., $HOME/gtest/gtest-1.7.0).解压缩 gtest-1.7.0.zip 的内容到已知位置（如 $HOME/gtest/gtest-1.7.0）

**重要:** Do not use apt-get install libgtest-dev. Download
the source code from code.google.com.不要使用 apt-install 安装 libgtest-dev。从 code.google.com 下载源代码。

## Obtain the AllJoyn source 获取 AllJoyn 源

```sh
$ cd $HOME
$ export AJ_ROOT = `pwd`/alljoyn # for example
$ git clone https://git.allseenalliance.org/gerrit/core/alljoyn.git

$AJ_ROOT/core/alljoyn
```

## Building the AllJoyn Framework 建立 AllJoyn 架构

Use the following commands to build the AllJoyn framework for Linux.使用以下命令建立针对 Linux 的 AllJoyn 架构。

```sh
$ export JAVA_HOME="/usr/lib/jvm/java-6-sun" # or java-1.5.0-sun
$ export CLASSPATH="/usr/share/java/junit4.9.jar" # for building Java binding
$ export GECKO_BASE=~/xulrunner-sdk # for building Javascript binding
$ cd $AJ ROOT/core/alljoyn
```

For 32-bit:对于 32 位：

```sh
$ scons BINDINGS=<comma separated list(cpp,java,c,js)>

   ex) $ scons BINDINGS="cpp,java"
```

For 64-bit:对于 64 位：

```sh
$ scons CPU=x86_64 BINDINGS=<comma separated list (cpp,java,c,js)>

   ex) $ scons CPU=x86_64 BINDINGS="cpp,java"
```

**注意:** For a full list of SCons command line options to build
the AllJoyn framework, enter `scons -h`.需要使用 SCons 命令的完全列表以建立 AllJoyn 架构，输入 `scons -h`。

**注意:** Use the SCons variable `BINDINGS` to list the language
bindings for which you would like to build. To limit the build
to just C++, for example, use BINDINGS=cpp. Use a comma-separated
list for multiple bindings. For example, to build for Java and
C++, use  BINDINGS=java,cpp.
使用 SCons 变量 `BINDINGS` 列出您想要建立的语言绑定。举例说明，为了限制仅使用 C++ 构建,使用 BINGDINGS=cpp.在绑定多个语言的情况下，使用逗号分隔。举例说明，使用 Java 和 C++，那么 BINGDINGS=java,cpp。

**N注意**

* The path specified for the CLASSPATH environment variable
is the full path name to the junit jar file that was downloaded earlier.CLASSPATH 环境变量指定的路径是之前下载的 junit jar 文件的完整路径名。
* The path specified for the JAVA HOME environment variable
is the path to the jdk directory.JAVA HOME 环境变量指定的路径是 jdk 文件夹的路径。
* For building Javascript on both Linux and Windows, we need
the GECKO_BASE while building the AllJoyn framework. 为了在 Linux 和 Windows 上建立 Javascript，我们在建立 AllJoyn 架构时需要 GECKO_BASE。
* If you are building a version older than AllJoyn framework
2.6, CPU=x86-64 will be required to build a 64-bit version of the AllJoyn framework.如果您使用早于 AllJoyn 架构 2.6 版本来建立，那么您需要 CPU=x86-64 建立一个 64 位版本的 AllJoyn 架构。

### Possible build errors 可能的构建错误

`" ImportError: No module named argparse"` reported when reading
`"File "../build_core/tools/bin/whitespace.py", line 18".`
Python does not have the argparse module installed (versions of
python 2.7.1 or newer have it installed by default).

```sh
$ sudo apt-get install python-setuptools
$ sudo easy_install argparse
```

## Build the API documentation 建立 API 文档

By default, the AllJoyn API documentation is not built during
the build stage (except for Java Docs). To build the API
documentation use the following commands:
默认情况下，AllJoyn API 文档不会在构建过程中建立（除 Java 文档之外）。使用以下命令建立 API 文档：

```sh
$ scons DOCS=html
$ scons DOCS=pdf
```

The documentation will be placed in <workspace>/alljoyn_core/docs/html
or <workspace>/alljoyn_core/docs/latex. 文档将会放置在 <workspace>/alljoyn_core/docs/html
或 <workspace>/alljoyn_core/docs/latex.

* Open <workspace>/alljoyn_core/docs/html/index.html in a web
browser to view the documentation. 查阅文档，请通过浏览器打开 <workspace>/alljoyn_core/docs/html/index.html
* Open <workspace>/alljoyn_core/docs/refman.pdf in a PDF viewer
to view the PDF documentation. 查阅 PDF 文档，请通过 PDF 浏览器打开 <workspace>/alljoyn_core/docs/refman.pdf。

### Whitespace policy checker 空白符规则检查器

By default, the whitespace policy checker does not run. If you are
contributing changes to AllJoyn, you should run your builds with the
whitespace checker enabled:
默认情况下，空白符规则检查器不运行。如果您正在对 AllJoyn 的更改，您应该开启空白符规则检查器运行您修改的程序。

```sh
$ scons WS=check
```

If the whitespace policy checker reports a whitespace policy
violation, it lists which files have the violation. To see the
lines of code that are violating the AllJoyn whitespace policy, run:
如果空白符规则检查器报告了一项违规，它会列出是哪个文件违规了。为了找到违反了 AllJoyn 空白符规则的段落，运行：

```sh
$ scons WS=detail
```

Uncrustify can automatically fix your files to adhere to the whitespace policy.
Uncrustify 能够根据空白符规则自动修复您的文件。

```sh
$ scons WS=fix
```

### Build variant 建立变量

By default, the AllJoyn framework builds the debug variant. To build
the release version of the AllJoyn framework, use this:
默认情况下，AllJoyn 架构建立 debug 变量。建立发行版本的 AllJoyn 架构，使用：

```sh
$ scons VARIANT=release
```

## Bindings option Bindings 选项

The default SCons script tries to build all of the language bindings
by default. If you are only interested in a particular language binding,
the `BINDINGS` option can be used to select the language(s) of interest.
默认 SCons 脚本采用默认方式建立所有的语言绑定。如果您只对某一种语言绑定有意向，`BINDINGS` 选项可供您选择您希望的语言。

The `BINDINGS` option takes a comma-separated list of languages you
wish to build. Current valid languages are cpp, c, java, and js. The language is
always specified in all lower case with no extra spaces between languages. If a
dependency is not listed, the dependency will automatically be built. For
example, java requires that cpp is built. If an empty string is used only the
core files will be built.
`BINDINGS` 选项可以用使用逗号列出您所希望用于构建的多种语言。目前，支持的语言有 cpp,c,java 和 js。语言必须采用小写形式，并且语言之间不能有空格。如果依赖项没有被列出，它们也会自动被建立。举例说明，java 需要以 cpp 的建立为基础。如果使用了空白字段，仅会建立核心文件。

For example:举例：

```sh
$ scons BINDINGS=java #this will build core files and Java language bindings
$ scons BINDINGS=c,java #this will build C language bindings and Java language bindings
$ scons BINDINGS= #only build the core files alljoyn_core and common
```

## Crypto option Crypto 选项：

AllJoyn v15.04 adds a CRYPTO option to the scons command line. To build AllJoyn
without dependencies on OpenSSL libcrypto, use CRYPTO=builtin:
AllJoyn v15.04 在 scons 命令行中加入了 CRYPTO 选项。使用 CRYPTO=builtin，能够除去 OpenSSL 的依赖，进行 AllJoyn 的构建。

```sh
$ scons CRYPTO=builtin
```

To use crypto implementations in OpenSSL:使用 OpenSSl 提供的加密方式：

```sh
$ scons CRYPTO=openssl
```


## PolicyDB option PolicyDB 选项

AllJoyn v14.06 provides functionality that
can be compiled into AllJoyn routers that acts as firewall/filter
for delivering messages. The POLICYDB option controls whether this
functionality is included or not. It can be set to either on or off.

The default policy rules are for the AllJoyn router to behave as
though PolicyDB is excluded. The default is to not include PolicyDB.

Example:

```sh
$ scons POLICYDB=on
```

## Build C++ unit tests 建立 C++ 单元测试

The AllJoyn framework now includes a set of unit tests that
are built using the Google Test C++ framework. To build the
unit test, the location of the Google Test source code must
be specified as explained in googletest. Use the GTEST_DIR
option to specify the location of the Google Test source code.
AllJoyn 架构目前自带了一套使用 Google Test C++ 架构的单元测试。为了建立单元测试，必须如 googletest 中提到指定 Google Test 源代码的位置。使用 GTEST_DIR 选项指定 Google Test 源代码的位置。

Example:示例：

```sh
$ scons GTEST_DIR=$HOME/gtest/gtest-1.7.0
```

## Running the AllJoyn Applications 运行 AllJoyn 应用程序


**注意:** For v2.6 and onward, Bundled Router mode only.对于 v2.6 和更高版本，仅有 Bundled Router 模式。

To ensure that the Linux development platform is set up
correctly, use the instructions in this section to run
the AllJoyn router.
为了保证 Linux 开发平台被正确地建立，使用本章的指导运行 AllJoyn 路由。

With the release of AllJoyn v2.6, running a separate standalone
router (alljoyn-daemon) is no longer required. All of the
functionality of the router can now be built into each individual
application, which means:
随着 AllJoyn v2.6 的发布，不再能够运行分离的独立路由（alljoyn-daemon）。所有的路由程序现在可以被加入任何一个独立的应用程序，这意味着：

* Users of your program no longer need to install and run a
background service (daemon) to run a program that uses the AllJoyn framework.
您的用户不再需要安装和运行后台服务（守护进程）来运行使用 AllJoyn 架构的应用程序。
* Each application that you run will have its own built-in router.
每一个您运行的应用程序将有一个它们自己的内置路由。

1. On the command line, type the following commands to run
the AllJoyn application:在命令行中，输入以下命令以运行 AllJoyn 应用程序：

   ```sh
      $ cd <workspace>/build/{OS}/{CPU}/{VARIANT}/dist/cpp/bin
      {OS} = linux
      {CPU} = x86 or x86-64
      {VARIANT} = debug or release
      $	./bbservice -n com.test
   ```

2. Open another tab and type the following commands to run
another application:打开另一个标签并输入以下命令以运行另一个应用程序。

   ```sh
      $ cd <workspace>/build/{OS}/{CPU}/{VARIANT}/dist/cpp/bin
      $	./bbclient -n com.test -d
   ```

3. Check for the following output on bbclient:在 bbclient 上检查以下输出：

   ```sh
      Sending "Ping String 1" to org.alljoyn.alljoyn_test.my_ping synchronously
         org.alljoyn.alljoyn_test.my_ping ( path=/org/alljoyn/alljoyn_test ) returned
         "Ping String 1"
   ```

## AllJoyn router command line executable AllJoyn 路由命令行可执行

**注意:** Applies only to versions before 2.6.仅对 2.6 之前的版本生效。

The concept of bundling a router with the application was
introduced in v2.6. Prior to this version, to run any AllJoyn
application, you needed to run the alljoyn-daemon first.
v2.6 中引入了路由与应用程序绑定的概念。在此版本之前，在运行 AllJoyn 应用程序时，您需要首先运行 alljoyn-daemon。

As part of the build process, an executable for the alljoyn-daemon is built.作为生成过程的一部分，建立了 alljoyn-daemon 的可执行文件。

1. On the command line, type the following commands to run
the AllJoyn router as a separate process:在命令行中，输入以下命令，以分离进程运行 AllJoyn router。

   ```sh
      $ cd <workspace>/build/{OS}/{CPU}/{VARIANT}/dist/cpp/bin
      $ ./alljoyn-daemon --internal
   ```
   The options for the variables are as follows:变量的可选项如下：

   {OS} = linux
   {CPU} = x86 or x86-64
   {VARIANT} = debug or release

   This starts the AllJoyn router with a built-in default
   configuration. For most users the command listed is sufficient
   to run the AllJoyn framework.
   此方法采用默认配置开启 AllJoyn 路由。对于大部分用户，以上的命令足够运行 AllJoyn 架构。

2. Press **Ctrl-c** at any time to stop the alljoyn-daemon process.任意时刻按下 **Ctrl-c** 停止 alljoyn-daemon 进程。
3. To display other options, type the following:输入以下命令显示其他选项：

   ```sh
      $ ./alljoyn-daemon -h

      alljoyn-daemon [--config-file=FILE] [--print-address]
      [--verbosity=LEVEL] [--no-bt] [--version]

         --config-file=FILE
            Use the specified configuration file.

         --print-address
            Print the socket address to STDOUT.

         --no-bt
            Disable the Bluetooth transport (override config file setting).

         --verbosity=LEVEL
            Set the logging level to LEVEL.

         --version
            Print the version and copyright string, and exit.
   ```

For examples of different configuration files, see examples in:从以下位置获得不同配置文件的示例：

```sh
<workspace>/alljoyn_core/daemon/test/conf.
```

**注意:** Not all configuration files found in the daemon/test/conf
directory are valid for use on a computer running Linux. 不是所有在 daemon/test/conf 文件夹中的配置文件适用于运行 Linux 的电脑。

### Verify that the router is running 验证路由正在工作

Navigate to the projects samples directory and run the service
and the client as follows:导航至工程示例目录并用以下命令运行服务和客户端：

```sh
$ cd <workspace>/build/{OS}/{CPU}/{VARIANT}/dist/cpp/bin/samples
$ ./basic_service & #this will be a background process; it could be run on its own command-line
$ ./basic_client
```

When the client runs, the following will display:当客户端在运行时，会显示下述语句：

```
AllJoyn Library version: v2.6.0
AllJoyn Library build info: Alljoyn Library v2.6.0
   (Built Wed Sep 02 23:30:23 UTC 2012
Interface Created. BusAttachment started.
BusAttachment connected to unix:abstract=alljoyn
BusListener Registered.
FoundAdvertisedName(name=org.alljoyn.Bus.sample,
prefix=org.alljoyn.Bus.sample)
JoinSession SUCCESS (Session id=-1126874739)
org.alljoyn.Bus.sample.cat ( path=/sample) returned "Hello World!"
basic client exiting with status 0 (ER_OK)
```

## Running Unit Tests 运行单元测试

**注意:** The following instructions are valid only for the AllJoyn
framework version 2.6 and newer.以下指导只适用于 v2.6 和更高版本的 AllJoyn 架构。

### Running C++ unit tests 运行 C++ 单元测试

If the `GTEST_DIR` option was specified when building the code,
the C++ unit tests will automatically be built and placed in
the following location:
如果在建立代码时制定了 `GTEST_DIR` 选项，C++ 测试单元会在以下位置被自动建立。

```sh
<workspace>/build/{OS}/{CPU}/{VARIANT}/test/cpp/bin.
```

There will be two executable files there: ajtest and cmtest.将会有两个可执行文件：ajtest 和 cmtest。

#### cmtest

The cmtest executable tests the code from the common project
and does not require the AllJoyn router to be running.
Run cmtest as follows:
cmtest 测试常用工程的代码，不需要 AllJoyn 路由的运行。cmtest 运行如下：

```sh
<workspace>/build/{OS}/{CPU}/{VARIANT}/test/cpp/bin/cmtest
```

#### ajtest

The ajtest executable tests the code found in alljoyn_core.
For the tests to run successfully, an AllJoyn router must
also be running. Currently, ajtest is limited; it cannot test
bus-to-bus (i.e., device-to-device) communication.
Run ajtest as follows:
ajtest 测试 alljoyn_core 中的代码。为了测试的成功运行，必须运行 AllJoyn 路由器。目前，ajtest 是有局限性的。它不能测试总线到总线（如设备到设备）的连接。ajtest 运行如下：

1. Start the alljoyn-daemon (optional-see note below):开启 alljoyn-daemon(可选查看注释)

   ```sh
      <workspace>/build/{OS}/{CPU}/{VARIANT}/dist/cpp/bin/alljoyn-daemon --internal
   ```

2. Run ajtest.运行 ajtest。

   ```sh
      <workspace>/build/{OS}/{CPU}/{VARIANT}/test/cpp/bin/ajtest
   ```

For all paths, replace {OS}, {CPU}, and {VARIANT} with the
actual value used when the code was built (i.e., use the same OS,
CPU, and VARIANT option specified when running SCons).
关于路径，使用运行 SCons 时特定的 OS，CPU 和 VARIANT 替换 {OS}、{CPU} 和 {VARIANT}。

**注意:** If the code was built using the bundled router
(i.e., SCons flag BR=on), then ajtest can be run without
first starting the separate alljoyn-daemon.如果采用绑定路由的方式构建代码（如，SCons flag BR=on），ajtest 不需要启动分离的 alljoyn-daemon。

### Running the Java junit tests 运行 Java junit 测试。

The junit tests are always built at the same time as the Java
bindings. The junit tests are specifically designed to test the
Java bindings.junit 测试总是和 Java 绑定同时存在。junit 测试专为测试 Java 绑定而设计。

1. From the top build folder, use ant to start the test.从顶部建立文件夹，使用 ant 开始测试。

   ```sh
      ant test -DOS={OS} -DCPU={CPU} -DVARIANT={VARIANT}
   ```

2. Find the HTML version of the results in the following location:从以下位置的结果中获得 HTML 版本。

   ```sh
      <workspace>/build/{OS}/{CPU}/{VARIANT}/test/java/reports/junit/
   ```

   For all paths and commands, replace {OS}, {CPU}, and {VARIANT}
   with the actual value used when the code was built (i.e., use
   the same OS, CPU, and VARIANT option specified when running SCons).

## Miscellaneous

### Library liballjoyn.so not found

If the following error is returned:如果返回以下错误：

```
error while loading shared libraries: liballjoyn.so:
cannot open shared object file: No such file or directory
```

The SCons scripts build a shared library and link
against that shared library. Add the library to the link path.
SCons 脚本建立一个共享库并且与之进行连接。把该库加入 link path。

```sh
$ export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:<workspace>/build/{OS}/{CPU}/
   {VARIANT}/dist/cpp/lib
```

After adding the library LD_LIBRARY_PATH re-run the program
that produced the error.
在加入了 library LD_LIBRARY_PATH 后，重新运行报错的程序。

### Additional projects 额外工程

The AllJoyn source code has other projects, such as alljoyn_js
(javascript), and alljoyn_c (C bindings). These bindings are supported from
version 2.6 onward. The build instructions for these projects are outside the
scope of this section. For more information, see https://allseenalliance.org.
AllJoyn 源代码包含其它代码，如 alljoyn-js(javascript) 和 alljoyn_c (C bindings)。自 2.6 版本以来，支持这些 bindings。这些工程的建立指导不在本章内容的范围之内。欲知详情，查看 https://allseenalliance.org。
