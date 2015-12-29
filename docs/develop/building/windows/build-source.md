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

#### JDK SE6

1. Open a browser and navigate to
http://www.oracle.com/technetwork/java/javase/downloads/jdk6downloads-1902814.html.
2. Download JDK 6u43 for your version of Windows.

#### JDK SE5

1. Open a browser and navigate to
http://www.oracle.com/technetwork/java/javase/downloads/index-jdk5-jsp-142662.html.
2. Find **JDK5.0 update 22** and click **Download**.
3. Download the JDK installer for your version of Windows.

#### junit

Required to build Java bindings.

1. Open a browser and navigate to
https://github.com/junit-team/junit/wiki/Download-and-Install.
2. Download the Plain-old JAR (`junit.jar`) v4.11.
3. Place the jar file in a known location (e.g., `C:\junit\junit-4.11.jar`).

### googletest

Google Test is Google's framework for writing C++ tests. 
Google Test is an xUnit testing architecture used to test 
the native AllJoyn framework C++ APIs. Google Test is optional, 
but is required for building the C++ unit tests.

1. Open a browser and navigate to http://code.google.com/p/googletest/downloads/list.
2. From the googletest download page download `gtest-1.7.0.zip`.
3. Unzip the contents of `gtest-1.7.0.zip` to a known location 
(e.g., `C:\gtest\gtest-1.7.0`).

### Apache Ant

Apache Ant is a Java library and command line tool for 
building software. This tool is optional, but is required 
for running junit tests.

1. Open a browser and navigate to http://ant.apache.org/bindownload.cgi.
2. From the Apache Ant web page, download `apache-ant-1.9.0-bin.zip`.
3. Unzip the contents of `apache-ant-1.9.0-bin.zip` to a 
known location (e.g., `C:\apache-ant-1.9.0`).

### Adding environment variables

1. Click **Start**.
2. Right-click **Computer**.
3. Select **Properties**.
4. Select **Advanced system settings** from the left pane (Windows 7).
5. Select the **Advanced** tab.
6. Click **Environment Variables**.
7. Under the User variables, search for 'PATH'.

   **NOTE:** There is a 'Path' variable under System variables, 
   which you could add to; however, it is considered good 
   practice to add new variables to User variables.

   1. If there is no 'PATH' under User variables, click **New**. 
      1. Enter PATH as the variable name.
      2.  Append the following to the %PATH% variable, separated 
      by a semicolon (adjust the path of each item, as necessary, 
      to account for the install location):
      
      ```bat
      C:\Python27;C:\Python27\Scripts;C:\Program Files\doxygen\bin;
      C:\Program Files\Git\cmd;C:\uncrustify-0.61-win32
      ```

   2. If there is a 'PATH' under User variables, select it, and click **Edit**.

      Append the following to the %PATH% variable, separated by a 
      semicolon (adjust the path of each item, as necessary, 
      to account for the install location):

      ```bat
      C:\Python27;C:\Python27\Scripts;C:\Program Files\doxygen\bin;
      C:\Program Files\Git\cmd;C:\uncrustify-0.61-win32
      ```

8. If you are generating the API documentation using Doxygen:
   1. Add a 'New...' User variable DOXYGEN_HOME. 
   2. Set `DOXYGEN_HOME=C:\PROGRA~1\doxygen`.
   3. Add a 'New...' User variable GRAPHVIZ_HOME.
   4. Set `GRAPHVIZ_HOME=C:\PROGRA~1\Graphviz 2.30.1`.
9. If you are building the AllJoyn Java bindings:
   1. Add a 'New...' User variable JAVA_HOME.
   2. Set `JAVA_HOME=C:\PROGRA~1\Java\jdk1.6.0_43`. 
   3. Add a 'New...' User Variable CLASSPATH.
   4. Set `CLASSPATH=C:\junit\junit-4.11.jar`.
10. If you are using Apache Ant, use your personal install 
directories:
   1. Add a 'New' User variable ANT_HOME.
   2. Set `ANT_HOME=C:\apache-ant-1.9.0`.
   3. Add the following to the %PATH% variable:

      ```bat
      %ANT_HOME%\bin
      ```

### Verify installation

Open the command window, and check that you can run the 
following commands:

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

### Obtaining AllJoyn source code from the Git repository

Obtain a copy of each repository using the `git clone` command.

1. Create a workspace for the AllJoyn project.

   ```bat
   C:\>mkdir allseen
   C:\>cd allseen

   C:\>mkdir core
   C:\>cd core

   C:\>mkdir alljoyn
   C:\>cd alljoyn
   ```

2. Make a clone of the Git repository associated with the AllJoyn project.

   ```bat
   c:\allseen\core\alljoyn> git clone 
   https://git.allseenalliance.org/gerrit/core/alljoyn.git
   ```

### CRLF issues when using msysgit

If you have just checked out the repository, msysgit sees issues 
that deal with the end-of-line symbol. This is an issue from going 
back and forth between Linux and Windows, where the expected 
line-feed in Windows is CRLF, and in Linux it is simply CR. 
msysgit reports that a freshly checked out file has been 
modified and does not let you pull from the repository, 
check the files, or even merge changes. The current solution 
is to tell git to ignore the CRLF issues using the following command:

```bat
git config core.autocrlf false
``` 

## Build the AllJoyn Framework

Use the following instructions to build the AllJoyn project.

1. From the command line, go to the AllJoyn allseen folder. 
The path used here is just an example.

   ```bat
   cd c:\allseen\core\alljoyn
   ```

2. Run the appropriate command from the list below to build 
the AllJoyn framework for Windows. Use 'scons -h' for some 
basic settings. In the examples below, any of the scons 
variables default values can be set as environment variables.

#### Building for Windows 7

For 32-bit x86 target using Visual Studio 2013:

```bat
C:\>cd allseen\core\alljoyn
C:\allseen\core\alljoyn>scons OS=win7 CPU=x86 MSVC_VERSION=12.0 BINDINGS=cpp
```

For 64-bit x86-64 target: using Visual Studio 2013

```bat
C:\>cd allseen\core\alljoyn
C:\allseen\core\alljoyn>scons OS=win7 CPU=x86_64 MSVC_VERSION=12.0 BINDINGS=cpp
```

**NOTE:** If you are using Windows 7, you may need to run SCons as administrator.

### Build variants

Building in "release mode" removes all symbol information 
and enables code optimization. To build in release mode, 
add the VARIANT build option to your scons command line. 
The values are:

* debug - (default value) Build the debug variant with all 
symbol information and improved logging features for the 
AllJoyn framework.
* release - Build the release variant of the code. This will 
be optimized for code size. It will not include symbol 
information and will only log critical errors associated 
with the AllJoyn framework.

Example:

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

Set an environment variable to tell scons the location of the build tools:

```bat
set JAVA_HOME="C:\Program Files\Java\jdk1.6.0_43"
```

Here is the path used on a development setup:

```bat
set CLASSPATH="C:\junit\junit-4.11.jar"
```

**NOTE:** These environment variables are already set if you 
followed the instructions in [Adding environment variables][adding-environment-variables].

As noted, to build Java code, use the same commands as were 
used to make AllJoyn core for Windows; e.g., a Java for Windows 
release variant. For example:

```bat
scons OS=win7 CPU=x86_64 VARIANT=release MSVC_VERSION=12.0 BINDINGS=core,java
``` 

### Whitespace options

The AllJoyn build environment uses uncrustify and a python 
script that are automatically run each time the AllJoyn 
framework is built.

If source code is found that does not match the AllJoyn coding
guidelines and whitespace checking is enabled, the build will fail
when it runs the whitespace script. The WS option controls the
behavior of the whitespace checker.

The values of the WS option are:

* off - (Default) Don't check the code for adherence to the 
AllJoyn whitespace policy. Example:
* check - This option will check the code 
to see if it adheres to the AllJoyn white space policy.
* detail - Display what changes are needed to make the 
code adhere to the AllJoyn white space policy.
* fix - Modify the code to use the AllJoyn white space 
policy. This will automatically apply the changes that 
are shown when using the detail option.

Example:
  ```bat
  scons OS=win7 CPU=x86_64 MSVC_VERSION=12.0 WS=off BINDINGS=cpp,java
  ```

### Generating API documentation

By default the Java API documentation will always build 
when building the Java bindings; this is not the default 
behavior for the C++ API documentation. Since the documentation 
for the C++ API requires Doxygen and Graphviz to be installed 
on your system, it is not built by default. Use the DOCS option 
to generate the C++ API documentation.

The values are:

* none - (default option) Do not generate the API documentation.
* html - (recommended option if documentation is desired ) 
Produce an HTML version of the API documentation. This is what 
is published to www.allseenalliance.org. The output can be 
found in `<allseen\core\alljoyn>\alljoyn_core\docs\html\index.html`.
* pdf - Produce a PDF form of the document. If you are unable 
to build the HTML form of the documentation the PDF form will 
not build. The resulting document can be found in 
`<allseen\core\alljoyn>\alljoyn_core\docs\html\refman.pdf`.
* dev - Produce HTML documentation for the entire AllJoyn 
codebase, not just the public APIs. When Doxygen runs using 
this command, it produces a lot of warnings and will generate 
documentation for methods and functions that should only be 
used inside AllJoyn code and not in any other projects. 
This option is for people developing AllJoyn code, not for 
people using the AllJoyn framework to develop other applications. 
The output will override the output from the HTML option.
 
Example:

```bat
scons OS=win7 CPU=x86_64 MSVC_VERSION=12.0 DOCS=html BINDINGS=cpp,java
```

### Specifying the Microsoft Visual C++ version

To build in Windows, you are required to have at least one 
version of Microsoft Visual C++ installed on your system. 
At this time, only Microsoft compilers can be used to build 
AllJoyn applications. Use the MSVC_VERSION to specify what 
version of Microsoft Visual C++ you are using.

The values are:

* 11.0 - Use Microsoft Visual C++ 2012
* 11.0Exp - Use Microsoft Visual C++ 2012 Express Edition
* 12.0 - (Default) Use Microsoft Visual C++ 2013
* 12.0Exp - Use Microsoft Visual C++ 2013 Express Edition
* 14.0 - Use Microsoft Visual C++ 2015
* 14.0Exp - Use Microsoft Visual C++ 2015 Express Edition

### Build C++ unit tests

The AllJoyn framework now includes a basic set of unit tests 
that are built using the Google Test code. To build the unit 
test, you must specify the location of the Google Test 
source code that was obtained in googletest. Use the `GTEST_DIR` 
option to specify the location of Google Test source code.
 
Example:

```bat
scons OS=win7 CPU=x86_64 MSVC_VERSION=12.0 GTEST_DIR=c:\gtest\gtest-1.7.0
BINDINGS=cpp
``` 

### Verify that the AllJoyn project is built properly

1. From the command line, navigate to:

   ```bat
   <allseen\core\alljoyn>\build{OS}{CPU}{VARIANT}\dist\cpp\bin\samples
   ```

2. Run `basic_service.exe` on one command line.
3. Run `basic_client.exe` on another command line.

   When the client runs, the following will display: 
   (Output may vary slightly from what is shown)

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

## Running Unit Tests

### Running C++ unit tests

If the `GTEST_DIR` option was specified when building the code, 
the C++ unit test will automatically be built and placed in 
the following location: `build\{OS}\{CPU}\{VARIANT}\test\cpp\bin`. 
There will be two executable files there: `cmtest` and `ajtest`.

For all paths, replace `{OS}`, `{CPU}`, and `{VARIANT}` with the 
actual value used when the code was built (i.e., use the 
same `OS`, `CPU`, and `VARIANT` option specified when running SCons).

### cmtest

The cmtest executable, tests the code from the common project 
and does not require the AllJoyn router to be running. 
Run cmtest as follows: 

```bat
build\{OS}\{CPU}\{VARIANT}\test\cpp\bin\cmtest.exe
```

### ajtest

The ajtest executable tests the code found in alljoyn_core. 
For the tests to run successfully, an AllJoyn router must 
also be running. Currently `ajtest` is limited, it cannot 
test bus-to-bus (i.e., device-to-device) communication. 

Run ajtest as follows:

```bat
build\{OS}\{CPU}\{VARIANT}\test\cpp\bin\ajtest.exe
```

### Running the Java junit tests

The junit tests are always built the same time as the Java bindings. 
The junit tests are specifically designed to test the Java bindings.

1. Copy and rename from `alljoyn_java\ build.xml.top` to the 
top `build.xml` folder.

   ```bat
   copy alljoyn_java\build.xml.top build.xml
   ```

2. From the top build folder use ant to start the test.

   ```bat
   ant test -DOS={OS} -DCPU={CPU} -DVARIANT={VARIANT}
   ```

3. html version of the results can be found in this location:

   ```bat
   build\{OS}\{CPU}\{VARIANT}\test\java\reports\junit\
   ```

For all paths and commands, replace {OS}, {CPU}, and {VARIANT} 
with the actual value used when the code was built 
(i.e., use the same OS, CPU, and VARIANT option specified 
when running SCons).
