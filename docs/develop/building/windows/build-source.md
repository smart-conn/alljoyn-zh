# Building from Source on Windows

## Configuring a Windows-Specific Environment 配置 Windows 指定环境

It is recommended to note the install location of each tool 
discussed in this section to complete the system configuration.
建议您注意本章完成系统配置过程中提及的每一个工具的安装位置。

### Microsoft Visual Studio 2012, 2013, or 2015 Microsoft Visual Studio 2012、2013 或 2015

You should have at least one version of Microsoft Visual Studio 
installed on your system. Visual Studio 2010 is no longer officially
supported.
您的系统中应至少安装一个版本的 Microsoft Visual Studio。官方已不支持 Visual Studio 2010。

### Python 2.7.10 for Windows

**注意:** Python 2.7.9 may also be used. Use the 32-bit version of 
Python even if you are building the AllJoyn&trade; framework for a 64-bit architecture.
也可以使用 Python 2.7.9。即使在一个 64 位结构中建立 AllJoyn&trade; 架构，也应当使用 32 位版本的 Python。

1. Open a browser and navigate to http://www.python.org/download/.打开浏览器并导航至 http://www.python.org/download/。
2. From the Python web page, select **Python 2.7.10 Windows Installer (32-bit)**.在 Python 网页中，选择 **Python 2.7.10 Windows Installer (32-bit)**。
3. Click **Run** and **Run** again. 点击 **Run** 两次。显示 Python 安装向导。
4. Click **Finish**, **Yes**, and **Finish** again.依次点击 **Finish**、**Yes** 和 **Finish** 。

### SCons 2.3.4 for Windows

**注意:** SCons 1.3.0 may also be used.也可以使用 SCons 1.3.0。

1. Open a browser and navigate to http://www.scons.org.打开浏览器并导航至 http://www.scons.org。
2. From the SCons web page, under 'Scons 2.3.4 is available', click the **download page** link.在 SCons 网页中，在 'Scons 2.3.4 is available' 字样下，点击 **download page** 链接。
3. Select "Download scons-2.3.4-setup.exe", and click **Run** and **Run** again. The setup wizard appears.选择 "Download scons-2.3.4-setup.exe"，并点击两次 **Run**。
4. Proceed through the wizard steps to complete the SCons installation.按照安装向导的流程完成 SCons 的安装。

### Msysgit version 1.9.5 for Windows

1. Open a browser and navigate to http://code.google.com/p/msysgit/downloads/list.打开浏览器并导航至 http://code.google.com/p/msysgit/downloads/list。
2. From the msysgit web page, click the most recent version of git Installer for Windows.在 msygit 网页中，点击针对 Windows 的最新版本 git Installer。
3. Download the file, click Run and Run again. The setup wizard appears.下载文件，点击两次 Run。出现安装向导
4. Proceed through the wizard steps to complete the git installation.按照安装向导的流程完成 git 的安装。

### Uncrustify version 0.61 for Windows

Uncrustify is a formatting tool for source code.Uncrustify 是一种针对源代码的格式工具。

1. Open a browser and navigate to 
http://sourceforge.net/projects/uncrustify/files/uncrustify/uncrustify-0.61/.打开浏览器并导航至 http://sourceforge.net/projects/uncrustify/files/uncrustify/uncrustify-0.61/。
2. From the Uncrustify Code Beautifier web page, click **uncrustify-0.61.3-gf65394e-win32.zip**.在 Uncrustify Code Beautifier 页面中，点击 **uncrustify-0.61.3-gf65394e-win32.zip**。
3. Download `uncrustify-0.61.3-gf6594e-win32.zip` and unzip.下载 `uncrustify-0.61.3-gf6594e-win32.zip` 并解压缩。
4. Move the contents to `C:\uncrustify-0.61-win32`.把内容移动至 `C:\uncrustify-0.61-win32`。

### Doxygen for Windows

Doxygen generates documentation from source code. This tool is 
optional, but is required for creating documentation.Doxygen 为源代码生成文档。此工具是可选工具，但需要使用它建立文档。

1. Open a browser and navigate to
http://www.stack.nl/~dimitri/doxygen/download.html#latestsrc.打开浏览器并导航至 http://www.stack.nl/~dimitri/doxygen/download.html#latestsrc。
2. From the Doxygen web page, under **Doxygen source and binary releases** 
and **Windows XP/Vista/7**, select **http**, click **Run**, 
then **Yes**. The setup wizard appears.在 Doxygen 页面中，在 **Doxygen source and binary releases** 和 **Windows XP/Vista/7** 字样下方，选择 **http**，点击 **Run**,再点击**Yes**。出现安装向导。
3. Proceed through the wizard steps to complete the Doxygen installation.按照安装向导的流程完成 Doxygen 的安装。

### Graphviz 2.30.1 for Windows

Graph visualization is a way of representing structural 
information as diagrams of abstract graphs and networks. 
This tool is optional, but is required for creating documentation.
Graph 视图化是一种以抽象的图像和网络形成的图示表示结构信息的方式。

1. Open a browser and navigate to http://www.graphviz.org/Download_windows.php 打开浏览器并导航至 http://www.graphviz.org/Download_windows.php
2. From the download to Windows, click **graphviz-2.30.1.msi** and then **Run**.选择针对 Windows 的下载，点击 **graphviz-2.30.1.msi**，随后点击**Run**。
3. Click **Run** again. The setup wizard appears.再次点击 **Run**。显示安装向导。
4. Proceed through the wizard steps to complete the Graphviz installation.按照安装向导的流程完成 Graphviz 的安装。

### MiKTeX

MiKTeX is used to create LaTeX binaries and Windows style sheets. MiKTeX 用于创建 LaTeX 二进制代码和 Windows 风格的表格。

**重要:** Install MiKTeX ONLY if you need to produce a PDF version of an API document.仅在您需要生成 PDF 版本的 API 文档时需要安装 MiKTeX。

1. Open a browser and navigate to http://www.miktex.org/2.8/setup.打开浏览器并导航至 http://www.miktex.org/2.8/setup。
2. From the MiKTeX web page, under **Installing a basic MiKTeX system**, click **Download**.在 MiKTeX 网页中，**Installing a basic MiKTeX system** 字样下方，点击 **Download**。
3. Click **Run**. The Copying Conditions appear.点击 **Run**。出现复制条款。
4. Click **I accept the MiKTeX copying conditions** and click **Next**.点击 **I accept the MiKTeX copying conditions** 并且点击 **Next**。
5. Proceed through the install steps to complete the MiKTeX installation.按照安装向导的流程完成 MiKTeX 的安装。

### Java Development Kit (JDK)

The JDK is required to build Java bindings. Building the Java 
bindings is optional, but if you want to build them, you need the JDK.
需要使用 JDK 建立 Java 绑定。建立 Java 绑定是可选的，但如果您想要建立，您需要 JDK。

#### JDK SE6

1. Open a browser and navigate to
http://www.oracle.com/technetwork/java/javase/downloads/jdk6downloads-1902814.html.打开浏览器并导航至 http://www.oracle.com/technetwork/java/javase/downloads/jdk6downloads-1902814.html。
2. Download JDK 6u43 for your version of Windows.下载针对您 Windows 版本的 JDK 6u43。

#### JDK SE5

1. Open a browser and navigate to
http://www.oracle.com/technetwork/java/javase/downloads/index-jdk5-jsp-142662.html.打开浏览器并导航至 http://www.oracle.com/technetwork/java/javase/downloads/index-jdk5-jsp-142662.html。
2. Find **JDK5.0 update 22** and click **Download**.找到 **JDK5.0 update 22** 并且点击 **Download**。
3. Download the JDK installer for your version of Windows.下载针对您 Windows 版本的 JDK 安装程序。

#### junit

Required to build Java bindings.需要它建立 Java 绑定。

1. Open a browser and navigate to
https://github.com/junit-team/junit/wiki/Download-and-Install.打开浏览器并导航至 https://github.com/junit-team/junit/wiki/Download-and-Install。
2. Download the Plain-old JAR (`junit.jar`) v4.11.下载 Plain-old JAR (`junit.jar`)。
3. Place the jar file in a known location (e.g., `C:\junit\junit-4.11.jar`).在已知位置存储此 jar 文件。(如 `C:\junit\junit-4.11.jar`)

### googletest

Google Test is Google's framework for writing C++ tests. Google Test 是 Google 编写 C++ 测试的一种架构。
Google Test is an xUnit testing architecture used to test 
the native AllJoyn framework C++ APIs. Google Test is optional, 
but is required for building the C++ unit tests.
Google Test 是一种用于测试本地 AllJoyn 架构 C++ API 的一种 xUnit 测试结构。Google Test 是可选的，但它是建立 C++ 单元测试所必需的。

1. Open a browser and navigate to http://code.google.com/p/googletest/downloads/list.打开浏览器并导航至 http://code.google.com/p/googletest/downloads/list。
2. From the googletest download page download `gtest-1.7.0.zip`.在 googletest 下载页面中下载 `gtest-1.7.0.zip`。
3. Unzip the contents of `gtest-1.7.0.zip` to a known location 
(e.g., `C:\gtest\gtest-1.7.0`).解压缩 `gtest-1.7.0.zip` 的内容到已知位置（如 `C:\gtest\gtest-1.7.0`）

### Apache Ant

Apache Ant is a Java library and command line tool for 
building software. This tool is optional, but is required 
for running junit tests.Apache Ant 是一个 Java 库，也是一个用于构建软件的命令行工具。这个工具是可选的，但它是运行 junit 测试所必需的。

1. Open a browser and navigate to http://ant.apache.org/bindownload.cgi.打开浏览器并导航至 http://ant.apache.org/bindownload.cgi。
2. From the Apache Ant web page, download `apache-ant-1.9.0-bin.zip`.在 Apache Ant 页面中，下载 `apache-ant-1.9.0-bin.zip`。
3. Unzip the contents of `apache-ant-1.9.0-bin.zip` to a 
known location (e.g., `C:\apache-ant-1.9.0`).解压缩 `apache-ant-1.9.0-bin.zip` 的内容到已知位置（如 `C:\apache-ant-1.9.0`）

### Adding environment variables 加入环境变量

1. Click **Start**.点击 **Start**。
2. Right-click **Computer**.右击 **Computer**。
3. Select **Properties**.选择  **Properties**。
4. Select **Advanced system settings** from the left pane (Windows 7).从左窗格中选择 **Advanced system settings** （Windows 7）
5. Select the **Advanced** tab.选择 **Advanced** 标签
6. Click **Environment Variables**.点击 **Environment Variables**
7. Under the User variables, search for 'PATH'.在 User 变量中，搜索 'PATH'。

   **注意:** There is a 'Path' variable under System variables, 
   which you could add to; however, it is considered good 
   practice to add new variables to User variables.您可以向 System 变量 'Path' 中加入变量，但我们还是建议您向 User 变量中加入新变量。

   1. If there is no 'PATH' under User variables, click **New**. 如果在 User 变量下没有 'PATH'，点击 **New**。
      1. Enter PATH as the variable name.键入 PATH 作为变量名。
      2.  Append the following to the %PATH% variable, separated 
      by a semicolon (adjust the path of each item, as necessary, 
      to account for the install location):将下列路径加入 %PATH% 变量，使用分号隔开（根据需求，加入每一个项目的路径，以交代安装位置）
      
      ```bat
      C:\Python27;C:\Python27\Scripts;C:\Program Files\doxygen\bin;
      C:\Program Files\Git\cmd;C:\uncrustify-0.61-win32
      ```

   2. If there is a 'PATH' under User variables, select it, and click **Edit**.如果在 User 变量下有一个 'PATH'，选择它，并点击 **Edit**。

      Append the following to the %PATH% variable, separated by a 
      semicolon (adjust the path of each item, as necessary, 
      to account for the install location):将下列路径加入 %PATH% 变量，使用分号隔开（根据需求，加入每一个项目的路径，以交代安装位置）

      ```bat
      C:\Python27;C:\Python27\Scripts;C:\Program Files\doxygen\bin;
      C:\Program Files\Git\cmd;C:\uncrustify-0.61-win32
      ```

8. If you are generating the API documentation using Doxygen:如果您使用 Doxygen 生成 API 文档。
   1. Add a 'New...' User variable DOXYGEN_HOME.加入一个 'New...' User 变量 DOXYGEN_HOME。
   2. Set `DOXYGEN_HOME=C:\PROGRA~1\doxygen`.设置 `DOXYGEN_HOME=C:\PROGRA~1\doxygen`
   3. Add a 'New...' User variable GRAPHVIZ_HOME.加入一个 'New...' User 变量 GRAPHVIZ_HOME。
   4. Set `GRAPHVIZ_HOME=C:\PROGRA~1\Graphviz 2.30.1`.设置 `GRAPHVIZ_HOME=C:\PROGRA~1\Graphviz 2.30.1`。
9. If you are building the AllJoyn Java bindings:如果您建立 AllJoyn Java 绑定。
   1. Add a 'New...' User variable JAVA_HOME.加入一个 'New...' User 变量 JAVA_HOME。
   2. Set `JAVA_HOME=C:\PROGRA~1\Java\jdk1.6.0_43`. 设置 `JAVA_HOME=C:\PROGRA~1\Java\jdk1.6.0_43`。
   3. Add a 'New...' User Variable CLASSPATH.加入一个 'New...' User 变量 CLASSPATH。
   4. Set `CLASSPATH=C:\junit\junit-4.11.jar`.设置 `CLASSPATH=C:\junit\junit-4.11.jar`。
10. If you are using Apache Ant, use your personal install 
directories:如果您使用 Apache Ant，使用您的个人安装目录：
   1. Add a 'New' User variable ANT_HOME.加入一个 'New' 变量 ANT_HOME。
   2. Set `ANT_HOME=C:\apache-ant-1.9.0`.设置 `ANT_HOME=C:\apache-ant-1.9.0`。
   3. Add the following to the %PATH% variable:将下列代码加入 %PATH% 变量。

      ```bat
      %ANT_HOME%\bin
      ```

### Verify installation 验证安装

Open the command window, and check that you can run the 
following commands:打开一个命令窗口，运行以下命令检查：

```bat
C:\>python --version
Python 2.7.10

C:\>scons --version
SCons by Steven Knight et al.: engine: v2.3.4, 2014/09/27 12:51:43, by garyo on lubuntu
Copyright (c) 2001 - 2014 The SCons Foundation

C:\>git --version
git version 1.9.5.msysgit.0

C:\>doxygen --version
1.7.4

C:\>dot -V
dot - graphviz version 2.26.3 (20100126.1600)

C:\>uncrustify -v
uncrustify 0.61
```

### Obtaining AllJoyn source code from the Git repository 从 Git 库中获得 AllJoyn 源代码。

Obtain a copy of each repository using the `git clone` command.使用 `git clone` 命令获得每个库的拷贝。

1. Create a workspace for the AllJoyn project.为 AllJoyn 工程建立一个 workspace。

   ```bat
   C:\>mkdir allseen
   C:\>cd allseen

   C:\>mkdir core
   C:\>cd core

   C:\>mkdir alljoyn
   C:\>cd alljoyn
   ```

2. Make a clone of the Git repository associated with the AllJoyn project.做一个与 AllJoyn 工程相关的 Git 库的克隆。

   ```bat
   c:\allseen\core\alljoyn> git clone 
   https://git.allseenalliance.org/gerrit/core/alljoyn.git
   ```

### CRLF issues when using msysgit 使用 msysgit 时遇到的 CRLF 问题。

If you have just checked out the repository, msysgit sees issues 
that deal with the end-of-line symbol. This is an issue from going 
back and forth between Linux and Windows, where the expected 
line-feed in Windows is CRLF, and in Linux it is simply CR. 
msysgit reports that a freshly checked out file has been 
modified and does not let you pull from the repository, 
check the files, or even merge changes. The current solution 
is to tell git to ignore the CRLF issues using the following command:
如果您检查了库，mysysgit 会发现关于行尾标志的问题。这个从 Linux 和 Windows 之间不断反复造成的问题，因为 Windows 中的换行符 是 CRSL，而 Linux 中的仅仅是 CR。Mysysgit 回报告一个刚被检查完成的文件再次被修改，并不允许您从库中提取，检查甚至融合文件。目前的解决办法是让 git 忽略 CRLF 问题，使用以下命令：

```bat
git config core.autocrlf false
``` 

## Build the AllJoyn Framework 建立 AllJoyn 架构

Use the following instructions to build the AllJoyn project.遵循以下指导建立 AllJoyn 工程。

1. From the command line, go to the AllJoyn allseen folder. 
The path used here is just an example.在命令行中，进入 AllJoyn allseen 文件夹。示例如下：

   ```bat
   cd c:\allseen\core\alljoyn
   ```

2. Run the appropriate command from the list below to build 
the AllJoyn framework for Windows. Use 'scons -h' for some 
basic settings. In the examples below, any of the scons 
variables default values can be set as environment variables.从以下列表选择合适的命令，建立 Windows 平台的 AllJoyn 架构。使用 'scons -h' 命令进行一些基础设置。在以下示例中，任何 scons 变量的默认值都能被设定为环境变量。

#### Building for Windows 7 Windows 7 的建立方式

For 32-bit x86 target using Visual Studio 2013:在 32 位 x86 系统上使用 Visual Studio 2013:

```bat
C:\>cd allseen\core\alljoyn
C:\allseen\core\alljoyn>scons OS=win7 CPU=x86 MSVC_VERSION=12.0 BINDINGS=cpp
```

For 64-bit x86-64 target: using Visual Studio 2013 在 64 位 x86-64 系统上使用 Visual Studio 2013:

```bat
C:\>cd allseen\core\alljoyn
C:\allseen\core\alljoyn>scons OS=win7 CPU=x86_64 MSVC_VERSION=12.0 BINDINGS=cpp
```

**注意:** If you are using Windows 7, you may need to run SCons as administrator.如果您使用 Windows 7，可能需要以管理员身份运行 SCons。

### Build variants 建立变量

Building in "release mode" removes all symbol information 
and enables code optimization. To build in release mode, 
add the VARIANT build option to your scons command line. 
The values are:
使用 "release mode" 建立，移除了所有标志信息并且支持代码优化。把 VARIANT 建设选项加入您的 scons 命令行以使用 release mode。

* debug - (default value) Build the debug variant with all 
symbol information and improved logging features for the 
AllJoyn framework.debug -（默认值）针对 AllJoyn 架构，使用所有标志信息和改进的日志功能建立 debug 变量。
* release - Build the release variant of the code. This will 
be optimized for code size. It will not include symbol 
information and will only log critical errors associated 
with the AllJoyn framework. release - 生成 release 变量的代码。这将优化代码的大小。它将不会包含标志信息，并且只包含关于 AllJoyn 架构的关键性错误日志。

Example:示例：

```bat
scons OS=win7 CPU=x86 VARIANT=release MSVC_VERSION=12.0 BINDINGS=cpp
```

### alljoyn_java

When building the Java code for the AllJoyn framework, use 
the same command as building the AllJoyn core for Windows. 
The only difference is it must be done from the root `allseen\core\alljoyn` 
folder or the `alljoyn_java` folder, not the `alljoyn_core` folder. 
To build the Java code, SCons needs to know where the Java 
tools and junit are located.
当使用 Java 代码建立 AllJoyn 架构时，使用在 Windows 上建立 AllJoyn 核心的相同命令。唯一的区别在于必须，根目录为 `allseen\core\alljoyn` 或 `alljoyn_java` 文件夹，不是 `alljoyn_core` 文件夹。建立 Java 代码之前，需要知道 Java 工具和 junit 所在的位置。

Set an environment variable to tell scons the location of the build tools:设定一个环境变量，告诉 scons 生成工具的位置。

```bat
set JAVA_HOME="C:\Program Files\Java\jdk1.6.0_43"
```

Here is the path used on a development setup:这是用于开发安装的路径：

```bat
set CLASSPATH="C:\junit\junit-4.11.jar"
```

**注意:** These environment variables are already set if you 
followed the instructions in [Adding environment variables][adding-environment-variables].如果您遵循 [Adding environment variables][adding-environment-variables] 的指导，这些环境变量已经被设定完毕。

As noted, to build Java code, use the same commands as were 
used to make AllJoyn core for Windows; e.g., a Java for Windows 
release variant. For example:如上文所述，使用 Windows 平台上建立 AllJoyn 核心相同的代码建立 Java 代码。举一个 Windows release 变量的 Java版本：

```bat
scons OS=win7 CPU=x86_64 VARIANT=release MSVC_VERSION=12.0 BINDINGS=core,java
``` 

### Whitespace options 空白选项

The AllJoyn build environment uses uncrustify and a python 
script that are automatically run each time the AllJoyn 
framework is built.AllJoyn 生成环境使用 uncrustify 和 python 脚本。它们会在 AllJoyn 架构建设完毕后自动运行。

If source code is found that does not match the AllJoyn coding
guidelines and whitespace checking is enabled, the build will fail
when it runs the whitespace script. The WS option controls the
behavior of the whitespace checker.
如果发现源代码没有匹配 AllJoyn 编程规则，并且空白检查已开启，当它运行空白脚本时，生成将失败。WS 选项控制着空白检查器的行为。

The values of the WS option are:Ws 选项的值为：

* off - (Default) Don't check the code for adherence to the 
AllJoyn whitespace policy. Example:off - （默认）不检查代码是否符合 AllJoyn 空白规则。
* check - This option will check the code 
to see if it adheres to the AllJoyn white space policy.check - 该选项将检查代码是否符合 AllJoyn 空白规则。
* detail - Display what changes are needed to make the 
code adhere to the AllJoyn white space policy.detail - 列出如何使代码符合 AllJoyn 空白规则的修改意见。
* fix - Modify the code to use the AllJoyn white space fix - 
policy. This will automatically apply the changes that 
are shown when using the detail option.使用 AllJoyn 空白修改规则修改代码。它会将 detail 选项中列出的修改意见自动执行。

Example:示例：
  ```bat
  scons OS=win7 CPU=x86_64 MSVC_VERSION=12.0 WS=off BINDINGS=cpp,java
  ```

### Generating API documentation 生成 API 文档

By default the Java API documentation will always build 
when building the Java bindings; this is not the default 
behavior for the C++ API documentation. Since the documentation 
for the C++ API requires Doxygen and Graphviz to be installed 
on your system, it is not built by default. Use the DOCS option 
to generate the C++ API documentation.
默认情况下，Java API 文档会随着 Java 绑定的生成而生成；但这样的情况不适用于 C++ API 文档。由于 C++ API 文档的生成需要系统中 Doxygen 和 Graphviz 的支持，所以它不会被默认建立。使用 DOCS 选项生成 C++ API 文档。

The values are:值如下：

* none - (default option) Do not generate the API documentation.none - （默认值）不生成 API 文档。
* html - (recommended option if documentation is desired ) 
Produce an HTML version of the API documentation. This is what 
is published to www.allseenalliance.org. The output can be 
found in `<allseen\core\alljoyn>\alljoyn_core\docs\html\index.html`. - (建议选项，如果需要文档)
生成 HTML 版本的 API 文档。这是 www.allseenalliance.org 采用的方式。可以在 `<allseen\core\alljoyn>\alljoyn_core\docs\html\index.html` 找到生成文档。
* pdf - Produce a PDF form of the document. If you are unable 
to build the HTML form of the documentation the PDF form will 
not build. The resulting document can be found in 
`<allseen\core\alljoyn>\alljoyn_core\docs\html\refman.pdf`.pdf- 生成 PDF 格式的文档。如果您未能生成 HTML 格式的文档，PDF 格式也不能生成。可以在 `<allseen\core\alljoyn>\alljoyn_core\docs\html\refman.pdf` 找到生成文档。
* dev - Produce HTML documentation for the entire AllJoyn 
codebase, not just the public APIs. When Doxygen runs using 
this command, it produces a lot of warnings and will generate 
documentation for methods and functions that should only be 
used inside AllJoyn code and not in any other projects. 
This option is for people developing AllJoyn code, not for 
people using the AllJoyn framework to develop other applications. 
The output will override the output from the HTML option.
dev - 为这个那个 AllJoyn 代码库生成 HTMl 代码，不仅仅是 public APIs。当 Doxygen 运行该命令，它将生成许多警告，并且会生成仅能在 AllJoyn 代码内部生成（不在任何其它工程中）的方法和功能。此选项针对开发 AllJoyn 代码的人，并不适用于基于 AllJoyn 架构开发应用的人。生成文档将会覆盖 HTML 选项生成的文档。
 
Example: 示例：

```bat
scons OS=win7 CPU=x86_64 MSVC_VERSION=12.0 DOCS=html BINDINGS=cpp,java
```

### Specifying the Microsoft Visual C++ version 指定 Microsoft Visual C++ 的版本

To build in Windows, you are required to have at least one 
version of Microsoft Visual C++ installed on your system. 
At this time, only Microsoft compilers can be used to build 
AllJoyn applications. Use the MSVC_VERSION to specify what 
version of Microsoft Visual C++ you are using.
在 Windows 中搭建，您至少需要其中安装至少一个本的 Microsoft Visual C++。此时，只有 Microsoft 编译器能用来构建 AllJoyn 应用程序。使用 MSVC_VERSION 指定您使用的 Microsoft Visual C++ 的版本。

The values are:值如下：

* 11.0 - 使用 Microsoft Visual C++ 2012
* 11.0Exp - 使用 Microsoft Visual C++ 2012 Express Edition
* 12.0 - (默认) 使用 Microsoft Visual C++ 2013
* 12.0Exp - 使用 Microsoft Visual C++ 2013 Express Edition
* 14.0 - 使用 Microsoft Visual C++ 2015
* 14.0Exp - 使用 Microsoft Visual C++ 2015 Express Edition

### Build C++ unit tests 建立 C++ 单元测试

The AllJoyn framework now includes a basic set of unit tests 
that are built using the Google Test code. To build the unit 
test, you must specify the location of the Google Test 
source code that was obtained in googletest. Use the `GTEST_DIR` 
option to specify the location of Google Test source code.
AllJoyn 架构内建了一套使用 Google test 代码构建的基本的单元测试。为了构建测试单元，您必须指定 googletest 中 Google Test 源代码的位置。使用 `GTEST_DIR` 选项指定 Google Test 源代码的位置。
 
Example:示例：

```bat
scons OS=win7 CPU=x86_64 MSVC_VERSION=12.0 GTEST_DIR=c:\gtest\gtest-1.7.0
BINDINGS=cpp
``` 

### Verify that the AllJoyn project is built properly 验证 AllJoyn 工程被正确建立

1. From the command line, navigate to:在命令行中，导航至：

   ```bat
   <allseen\core\alljoyn>\build{OS}{CPU}{VARIANT}\dist\cpp\bin\samples
   ```

2. Run `basic_service.exe` on one command line.在一个命令行中运行 `basic_service.exe`。
3. Run `basic_client.exe` on another command line.在另一个命令行中运行 `basic_client.exe`。

   When the client runs, the following will display: 
   (Output may vary slightly from what is shown)
   当客户端运行时，会出现以下提示（可能会略有不同）：

   ```
   AllJoyn Library version: v3.2.0
   AllJoyn Library build info: Alljoyn Library v3.2.0 (Built Fri Jan 18 16:50:19 UTC
   2013)
   Interface Created. BusAttachment started. 
   Initialized winsock 
   Using BundledRouter
   AllJoyn Daemon GUID = e467f6278e751dda9ebe877c612e66a0 (adsdErTQ) 
   BusAttchement connected to tcp:addr=127.0.0.1,port=9956
   BusListener Registered.
   FoundAdvertisedName(name=org.alljoyn.Bus.sample, prefix=org.alljoyn.Bus.sample) 
   NameOwnerChanged: name=org.alljoyn.Bus.sample, oldOwner=<none>, 
   newOwner=:5xRgxpvD.2
   JoinSession SUCCESS (Session id=500568462)
   org.alljoyn.Bus.sample.cat ( path=/sample) returned "Hello World!"
   ```

## Running Unit Tests 运行单元测试

### Running C++ unit tests 运行 C++ 单元测试

If the `GTEST_DIR` option was specified when building the code, 
the C++ unit test will automatically be built and placed in 
the following location: `build\{OS}\{CPU}\{VARIANT}\test\cpp\bin`. 
There will be two executable files there: `cmtest` and `ajtest`.
如果在生成代码时指定了 `GTEST_DIR` 选项，C++ 单元测试将被自动建立并存放在以下位置：`build\{OS}\{CPU}\{VARIANT}\test\cpp\bin`。其中有两个可执行文件 `cmtest` 和 `ajtest`。

For all paths, replace `{OS}`, `{CPU}`, and `{VARIANT}` with the 
actual value used when the code was built (i.e., use the 
same `OS`, `CPU`, and `VARIANT` option specified when running SCons).
对于所有路径，根据代码生成的环境更改 `{OS}`、`{CPU}` 和 `{VARIANT}` 的值。（如，使用与运行 SCons 时相同的`{OS}`、`{CPU}` 和 `{VARIANT}`）

### cmtest

The cmtest executable, tests the code from the common project 
and does not require the AllJoyn router to be running. 
Run cmtest as follows: 
可执行文件 cmtest, 测试通用工程代码，不需要运行 AllJoyn 路由。
执行以下代码运行 cmtest：

```bat
build\{OS}\{CPU}\{VARIANT}\test\cpp\bin\cmtest.exe
```

### ajtest

The ajtest executable tests the code found in alljoyn_core. 
For the tests to run successfully, an AllJoyn router must 
also be running. Currently `ajtest` is limited, it cannot 
test bus-to-bus (i.e., device-to-device) communication. 
Ajtest 可执行文件测试 alljoyn_core 中的代码。为了测试的顺利运行，必须运行 AllJoyn 路由。目前，`ajtest` 功能有限。它不能测试总线与总线之间的通信（如 设备到设备）


Run ajtest as follows:
执行以下代码运行 ajtest：

```bat
build\{OS}\{CPU}\{VARIANT}\test\cpp\bin\ajtest.exe
```

### Running the Java junit tests 运行 Java junit 测试

The junit tests are always built the same time as the Java bindings. junit test 总是和 Java 绑定同时建立。
The junit tests are specifically designed to test the Java bindings. junit test 专为测试 Java 绑定而设计。

1. Copy and rename from `alljoyn_java\ build.xml.top` to the 
top `build.xml` folder.
把 `alljoyn_java\ build.xml.top` 拷贝至顶部文件夹，并重命名为 `build.xml`。

   ```bat
   copy alljoyn_java\build.xml.top build.xml
   ```

2. From the top build folder use ant to start the test.在顶部文件夹中使用 ant 开启测试。

   ```bat
   ant test -DOS={OS} -DCPU={CPU} -DVARIANT={VARIANT}
   ```

3. html version of the results can be found in this location:html 版本的结果存储在以下路径：

   ```bat
   build\{OS}\{CPU}\{VARIANT}\test\java\reports\junit\
   ```

For all paths and commands, replace {OS}, {CPU}, and {VARIANT} 
with the actual value used when the code was built 
(i.e., use the same OS, CPU, and VARIANT option specified 
when running SCons).

对于所有路径和命令，根据代码生成的环境更改 `{OS}`、`{CPU}` 和 `{VARIANT}` 的值。（如，使用与运行 SCons 时相同的`{OS}`、`{CPU}` 和 `{VARIANT}`）
