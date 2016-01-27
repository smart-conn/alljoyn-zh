# Build From Source - iOS and OS X

## 开发环境要求

AllJoyn&trade; 开发环境的建立要求：

* Apple 桌面操作系统 OS X 10.9 (Mavericks) 或更高版本
* Xcode 6.x 或更高版本

## 安装

在 OS X 10.9 或更高版本的操作系统上安装以下工具：

### Xcode

1. 打开浏览器并导航至 http://itunes.apple.com/us/app/xcode/id497799835?mt=12。
2. 下载并安装免费应用程序 Xcode。
3. 安装成功之后，从 Applications 文件夹选择并打开 Xcode。
4. 选择 **Xcode > Preferences** 菜单项
5. 选择 **Downloads** 标签。
6. 选择 **Components** 标签。
7. 验证 Command Line Tools 已经被安装。

   **注意:** 你可能需要运行以下指令，从一个终端窗口安装 Command Line Tools。

   ```sh
   $ xcode-select --install
   ```

### Homebrew

使用 Homebrew 在您的 OS X 系统中部署 SCons、git 和 uncrustify

1. 打开浏览器并导航至 http://mxcl.github.com/homebrew/。
2. 下载 Homebrew。
3. 导航至 https://github.com/mxcl/homebrew/wiki/installation，参考指导进行安装。

### SCons

使用 SCons 构建工具生成针对 iOS 和 OS X 的 AllJoyn C++ API 二进制代码。
打开一个终端窗口，输入以下命令安装 SCons。

```sh
$ brew install scons
```

### Git

Git 用于源的控制。

打开一个终端窗口，输入以下命令安装 Git。

```sh
$ brew install git
```

### Appledoc

**注意:** 您不需要 Appledoc 如果您不希望生成 API 参考手册。

appledoc 工具为 AllJoyn Objective-C 语言绑定生成文档。欲知详情，查看 http://gentlebytes.com/appledoc/.appledoc。

1. 打开浏览器并导航至 https://github.com/tomaz/appledoc。

2. 执行任一以下操作：

   1. 下载 appledoc。
   2. 打开一个终端窗口，输入以下命令安装 Homebrew。

   ```sh
   $ brew install appledoc
   ```

   Homebrew 把您的模版保存在 `~/Library/Application Support/appledoc`。

### Doxygen

**注意:** 您不需要 Doxygen 如果您不希望生成 API 参考手册。

Doxygen 工具为 AllJoyn Objective-C 语言绑定生成文档。欲知详情，查看 http://www.doxygen.org。

1. 打开浏览器并导航至 http://www.doxygen.org。
2. 执行任一以下操作：

   1. 下载并安装 doxygen。
   2. 打开一个终端窗口，输入以下命令安装 Homebrew。

   ```sh
   $ brew install doxygen
   ```

### Graphviz

**注意:** 您不需要 Graphviz 如果您不希望生成 API 参考手册。

Graphviz Dot 工具使用图示表明类分层结构。欲知详情，查看http://www.graphviz.org。

1. 打开浏览器并导航至 http://graphviz.org。

2. 执行任一以下操作：

   1. 下载并安装 graphviz。
   2. 打开一个终端窗口，输入以下命令安装 Homebrew。

   ```sh
   $ brew install graphviz
   ```

### 获得 AllJoyn 源

下载 AllJoyn 源代码，包括 Objective-C 语言绑定的 AllJoyn 架构。

1. 打开一个终端窗口
2. 输入以下命令：

   ```sh
   $ mkdir ~/alljoyn # for example
   $ cd ~/alljoyn
   $ git clone https://git.allseenalliance.org/gerrit/core/alljoyn.git
   ```

### 获得 OpenSSL

OpenSSL 是一个提供 Secure Sockets Layer (SSL v2/v3) 和 Transport Layer Security (TLS v1) 的开源工具包。尽管 Mac OS X SDK 包含了 OpenSSL，iOS SDK 并不包含它。

1. 在以下网站下载源代码，建立针对 iOS 的 OpenSSL 架构。

   http://www.openssl.org/

2. 将 OpenSSL 源拷贝至您开发系统中一个独立的文件夹，不要在  AllJoyn 架构源目录树下。举例说明，

   /Development/openssl/openssl-1.0.1

3. 从以下网址的 Gitgub 中下载用于建立适用 iOS 的 OpenSSL 的 Xcode 工程。

   https://github.com/sqlcipher/openssl-xcode/

4. 导航至 OpenSSL 源文件的顶级目录（如  `/Development/openssl/openssl-1.0.1`），并把您从 GitHub 下载的 openssl.xcodeproj 文件夹拷贝至此文件夹。
5. 在 Xcode 中打开 openssl.xcodeproj。

 请遵守以下要求：

  * 'Valid Architectures' 字段其中一个值是 'arm64'。
  * 在结构中选择了 'Standard architectures (armv7, arm64)'。
  * 'Build Active Architecture Only = No'


6.  在 Xcode 中，对于每一个您 iOS 工程中需要的配置 (debug|release）和平台 (iphoneos|iphonesimulator) 的组合，建立加密目标。通过选择 **Product > Build For > (您需要的配置)** 实现。
7. 在顶级目录下建立一个名为 **build** 的文件夹。 打开步骤 2 中建立的 OpenSSL 文件夹 （如 `/Development/openssl/openssl-1.0.1/build`）。
8. 找到您 OpenSSl 生成文件夹的位置（以 Debug-iphoneos 为例），是 /Users/<your username>/Library/Developer/Xcode/DerivedData/XXXXXXXXXXXXX-openssl/Build/Products folder。把所有 <configuration>-<platform> 文件夹，如 like Debug-iphoneos，拷贝至步骤 7 中建立的生成文件夹。

   ```sh
   openssl-1.0.1c build
   Debug-iphoneos ibssl.a libcrypto.a
   Debug-iphonesimulator libssl.a libcrypto.a
   ```

9. 设置环境变量 OPENSSL_ROOT=<OpenSSL 源顶级文件夹的路径>。在任何您需要使用 AllJoyn SDK 建立工程时，都需要此环境变量的存在。

    9a. 对于 Mac OS X 10.7 到 10.9，打开终端窗口，输入以下指令设定环境变量：
    ````sh
    launchctl setenv OPENSSL_ROOT <path to top level folder containing openssl>
    ````
    9b. 对于 Mac OS X 10.10，环境变量的处理方法改变了。最重要的是，必须在打开 Xcode 之前（Xcode 在启动之后将不再接收任何变量的加入和更新） 定义 OPENSSL_ROOT。因此，打开终端窗口，输入以下指令设定环境变量：

    ```sh
    launchctl setenv OPENSSL_ROOT <path to top level folder containing openssl>
    sudo killall Finder
    sudo killall Dock
    ```
## 建立 AllJoyn 架构

使用 Xcode 集成的开发环境 （IDE） 建立 AllJoyn SDK 比使用命令行更加容易。因此我们建议使用 Xcode IDE 生成针对 OS X 或 iOS 的 AllJoyn 二进制代码。

### Xcode IDE build

1. 在以下两个方案中挑选一个执行：

   1. Navigate in Finder to the `<alljoyn root directory>/alljoyn_objc` directory,
   and double-click the `alljoyn_darwin.xcodeproj` file to launch Xcode.在 Finder 中导航至 `<alljoyn root directory>/alljoyn_objc` 目录，双击 `alljoyn_darwin.xcodeproj` 文件启动 Xcode。
   或者
   2. 打开 Xcode，选择**File > Open**,选择` <alljoyn root directory>/alljoyn_objc/alljoyn_darwin.xcodeproj` 文件。
2. 如其它 Xcode 工程一样，通过选择 active Scheme 来控制建立哪个版本的 AllJoyn 架构。有针对 OS X 和 iOS AllJoyn 架构的 scheme。Active scheme 由 Xcode 用户界面左上角的选择框进行控制。
3. 点击 active scheme 的选择框，您可以看到位 Xcode 工程配置的不同 scheme 的菜单，您可以通过选择 scheme 决定构建的平台。举例说明，当您再 iOS 上建立 AllJoyn 架构时，您应选择 iOS Device, iPad Simulator, or iPhone simulator 平台进行建设。
4. 当您选定了 scheme 和进行建设的平台后，从 Xcode 菜单中选择 **Product > Build** 建设 AllJoyn 架构。建设完毕后，您的二进制代码将被保存在以下目录：

   ```sh
   <alljoyn_root_directory>/alljoyn_core/build/darwin/[arm|x86]/[debug|release]/dist
   ```

   **注意:** For OS X builds, the binaries will be located under the `.../darwin/x86/...`
   directory. For iOS builds, the binaries will be located under the `.../darwin/arm/   ` directory.
   对于 OS X 的建设，代码将被保存在 `.../darwin/x86/...` 目录。对于 iOS 建设，代码将被保存在  `.../darwin/arm/   ` 目录。

### Command line build 命令行建立

1. 打开一个终端窗口
2. 通过运行以下命令更改您的目录至：`<alljoyn root directory>/alljoyn_objc`

   ```sh
   $ cd <alljoyn root directory>/alljoyn_objc
   ```

3. 不同设备的建立方式：

   * 64 位 iOS 设备，运行以下命令：

   ```sh
   $ /Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild
      -project alljoyn_darwin.xcodeproj
      -scheme alljoyn_core_arm64 -sdk iphoneos -configuration Debug
   ```

   * 其它 iOS 设备，运行以下命令：

   ```sh
   $ /Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild
      -project alljoyn_darwin.xcodeproj
      -scheme alljoyn_core_ios -sdk iphoneos -configuration Debug
   ```

   * iOS 模拟器，运行以下命令：

   ```sh
   $ /Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild
      -project alljoyn_darwin.xcodeproj
      -scheme alljoyn_core_ios -sdk iphonesimulator -configuration Debug
   ```

   * OS X，运行以下命令：

   ```sh
   $ /Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild
      -project alljoyn_darwin.xcodeproj
      -scheme alljoyn_core_osx
   ```
