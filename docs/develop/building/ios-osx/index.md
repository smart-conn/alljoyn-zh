# Building iOS/OS X

请注意，根据您的下载版本，以下路径可能需要调整。

## 设置

1. [下载][downlod] 以下 iOS SDKs:
     * Core SDK (release)
     * Onboarding SDK
     * Configuration SDK
     * Notification SDK
     * Control Panel SDK

2. 提取下载文件并设置目录结构：

```sh
mkdir alljoyn-ios
mkdir alljoyn-ios/core
unzip alljoyn-14.06.00-osx_ios-sdk.zip
mv alljoyn-14.06.00-osx_ios-sdk alljoyn-ios/core/alljoyn
unzip alljoyn-config-service-framework-14.06.00-ios-sdk-rel.zip
unzip alljoyn-controlpanel-service-framework-14.06.00-ios-sdk-rel.zip
unzip alljoyn-notification-service-framework-14.06.00-ios-sdk-rel.zip
unzip alljoyn-onboarding-service-framework-14.06.00-ios-sdk-rel.zip
```

#### 设置 OpenSSL 附件

```sh
cd <parent directory of alljoyn-ios>
pushd alljoyn-ios
git clone git://git.openssl.org/openssl.git
git clone https://github.com/sqlcipher/openssl-xcode.git
cp -r openssl-xcode/openssl.xcodeproj openssl
pushd openssl
git checkout tags/OpenSSL_1_0_1f #replace this with a newer version as available
sed -ie 's/\(ONLY_ACTIVE_ARCH.*\)YES/\1NO/' openssl.xcodeproj/project.pbxproj
xcodebuild -configuration Release -sdk iphonesimulator
xcodebuild -configuration Release -sdk iphoneos
xcodebuild -configuration Release
xcodebuild -configuration Debug -sdk iphonesimulator
xcodebuild -configuration Debug -sdk iphoneos
xcodebuild -configuration Debug
launchctl setenv OPENSSL_ROOT `pwd`
popd
popd
```

#### 定义环境变量

```sh
cd alljoyn-ios
launchctl setenv ALLJOYN_SDK_ROOT `pwd`
cd services
launchctl setenv ALLSEEN_BASE_SERVICES_ROOT `pwd`
```

## 搭建样例
在 Xcode 中打开下列每一个样例 iOS 应用程序，通过在 Xcode 中选择 __Project > Build__  来搭建这些应用程序。

* alljoyn-ios/core/alljoyn/alljoyn_objc/samples/iOS/
* alljoyn-ios/core/alljoyn/services/about/ios/samples/
* alljoyn-ios/services/alljoyn-config-14.06.00-rel/objc/samples/
* alljoyn-ios/services/alljoyn-controlpanel-14.06.00-rel/objc/samples/
* alljoyn-ios/services/alljoyn-notification-14.06.00-rel/objc/samples/
* alljoyn-ios/services/alljoyn-onboarding-14.06.00-rel/objc/samples/

### 在 iOS 设备上安装样例
请先确保您的 iOS 设备已经连接到电脑，然后使用 Xcode __Run__ 所需的样例应用程序。这将会把应用程序安装到您的设备上。

**TIP:** 此命令同样适用于在一个终端上搭建一个样例应用程序。

<!-- QUESTION FOR WAYNE: Need to insert command -->
<!-- TODO - insert scons command here -->

## 向 iOS 应用程序添加 AllJoyn&trade; 框架。 

1. 请确保您知晓 AllJoyn SDK 所在的文件夹位置。AllJoyn SDK 文件夹包含您的搭建，服务以及 alljoyn_objc 文件夹。
2. 打开 XCode, 然后打开您的项目，在项目导航（Project Navigator）中找到树的跟节点，然后在 __Targets__ 下选择目标应用程序。

#### 添加 AllJoyn 核心库和附件。

1. 对应用程序目标选 __Building Settings__ 标签， 点击在列表顶部的 __All__ 选项。 
2. 在 Build Settings 列表的顶部, 点击 __Architectures__ ，然后选择 __Standard architectures (armv7, armv7s)__.
3. 将 __Build Active Architecture only__ 设置为 __Yes__.
4. 下滑到 linking 选项, 将  __Other Linker Flags__ to the fol 按照如下所示调整:

  `-lalljoyn -lajrouter -lBundledRouter.o -lssl -lcrypto`
5. 下滑设置列表，直到看到 __Search Paths__  小组。
6. 双击 __Header Search Paths__ 字段并输入如下命令： 

  `$(ALLJOYN_ROOT)/core/alljoyn/build/darwin/arm/$(PLATFORM_NAME)/$(CONFIGURATION)/dist/cpp/inc`
  `$(ALLJOYN_ROOT)/core/alljoyn/alljoyn_objc/AllJoynFramework/AllJoynFramework/`

7.  双击 __Library Search Paths__ 字段并输入如下命令: 

  `$(ALLJOYN_ROOT)/core/alljoyn/build/darwin/$(CURRENT_ARCH)/$(PLATFORM_NAME)/$(CONFIGURATION)/dist/cpp/lib`
  `$(OPENSSL_ROOT)/build/$(CONFIGURATION)-$(PLATFORM_NAME)`

8.  查阅 Build Settings 表，直到发现 __Apple LLVM 5.0 - Language - C++__ 群组，并按照以下设置：
  * __Enable C++ Exceptions__ to __No__.
  * __Enable C++ Runtime Types__ to __No__.
  *	__C++ Language Dialect__ to __Compiler Default__.

9.  查阅 Build Settings 表，直到发现 __Apple LLVM 5.0 - Custom
编译 Flags__ group 并作出如下设置：
  * Enter the following in the __Other C Flags__ field for Debug field:

      `-DQCC_OS_GROUP_POSIX -DQCC_OS_DARWIN`

  * 在 __Other C Flags__ 字段中输入以下命令:

      `-DNS_BLOCK_ASSERTIONS=1 -DQCC_OS_GROUP_POSIX -DQCC_OS_DARWIN`

10.  查阅 Build Settings 表，直到发现 __Apple LLVM 5.0 - Language__ 群组，设置如下：
  * __C Language Dialect__ to __Compiler Default__.
  * __Compile Sources As__ to __Objective-C++__.
11. 选择 __Build Phases__ 标签。
12.  展开 __Link Binary With Libraries__ 群组，并点击在左下角的 + 符号。将会出现一个对话。 
  1. 选择 SystemConfiguration.framework 文件。
  2. 再一次点击 '+' 按钮，将下列库添加到 link against, 如已被包括则忽略。
    * libstdc++.6.0.9.dylib
    * libstdc++.6.dylib
    * libstdc++.dylib
    * libc++abi.dylib
    * libc++.1.dylib
    * libc++.dylib

#### 添加服务架构
1. 在目标应用程序中选择 __Build Phases__ 标签。点击在列表顶端的 __All__ 选项。
2. 在 __Link Binary with Libraries__ 库中, 点击 '+' 按钮, 选择 __Add Other...__, 并添加以下条目：

  __General libs__ (所有使用一个或多个服务框架的应用程序都要安装):
  * alljoyn-ios/services/<alljoyn-service-framework>/cpp/lib/
    * liballjoyn_services_common_cpp.a
    * liballjoyn_about_cpp.a
  * alljoyn-ios-directory/services/<alljoyn-service-framework>/objc/lib/
    * liballjoyn_services_common_objc.a
    * liballjoyn_about_objc.a
    * libAllJoynFramework_iOS.a

  __Config libs__:
  * alljoyn-ios/services/alljoyn-config-14.06.00-rel/cpp/lib/
    * liballjoyn_config_cpp.a
  * alljoyn-ios-directory/services/alljoyn-config-14.06.00-rel/objc/lib/
    * liballjoyn_config_objc.a

  __Control Panel libs__:
  * alljoyn-ios/services/alljoyn-controlpanel-14.06.00-rel/cpp/lib/
    * liballjoyn_controlpanel_cpp.a
  * alljoyn-ios/services/alljoyn-controlpanel-14.06.00-rel/objc/lib/
    * liballjoyn_controlpanel_objc.a

  __Notification libs__:
  * alljoyn-ios/services/alljoyn-notification-14.06.00-rel/cpp/lib/
    * liballjoyn_notification_cpp.a
  * alljoyn-ios/services/alljoyn-notification-14.06.00-rel/objc/lib/
    * liballjoyn_notification_objc.a

  __Onboarding libs__:
  * alljoyn-ios/services/alljoyn-onboarding-14.06.00-rel/cpp/lib/
    * liballjoyn_onboarding_cpp.a
  * alljoyn-ios/services/alljoyn-onboarding-14.06.00-rel/objc/lib/
    * liballjoyn_onboarding_objc.a

[download]: https://allseenalliance.org/framework/download
