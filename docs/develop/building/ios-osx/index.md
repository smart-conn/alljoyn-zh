# Building iOS/OS X

Note, some of the paths below will need to be adjusted based on the version downloaded

## Setup

1. [Download][downlod] the following iOS SDKs:
     * Core SDK (release)
     * Onboarding SDK
     * Configuration SDK
     * Notification SDK
     * Control Panel SDK

2. Extract the downloaded packages and setup the directory structure:

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

#### Set up OpenSSL dependencies

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

#### Define environment variables

```sh
cd alljoyn-ios
launchctl setenv ALLJOYN_SDK_ROOT `pwd`
cd services
launchctl setenv ALLSEEN_BASE_SERVICES_ROOT `pwd`
```

## Build the samples
Open each of the following sample iOS applications in Xcode and build
them by selecting __Project > Build__ from the Xcode menu.

* alljoyn-ios/core/alljoyn/alljoyn_objc/samples/iOS/
* alljoyn-ios/core/alljoyn/services/about/ios/samples/
* alljoyn-ios/services/alljoyn-config-14.06.00-rel/objc/samples/
* alljoyn-ios/services/alljoyn-controlpanel-14.06.00-rel/objc/samples/
* alljoyn-ios/services/alljoyn-notification-14.06.00-rel/objc/samples/
* alljoyn-ios/services/alljoyn-onboarding-14.06.00-rel/objc/samples/

### Install samples on an iOS device
Make sure you have an iOS device connected to your computer, then use
Xcode to __Run__ the desired sample application. This will install
the application onto your device.

**TIP:** This command can also be used to build a sample application from a terminal

<!-- QUESTION FOR WAYNE: Need to insert command -->
<!-- TODO - insert scons command here -->

## Add the AllJoyn&trade; framework to an iOS application

1. Make sure you know the location of the AllJoyn SDK folder.
The AllJoyn SDK folder contains your build, services, and alljoyn_objc folders.
2. Open Xcode, open your project, and select the root of the tree in
Project Navigator. Then select the app's target under __Targets__.

#### Add the AllJoyn Core library and dependencies:

1. Select the __Building Settings__ tab for the app target. Click the __All__ option at the top of the list.
2. At the top of the Build Settings list, click __Architectures__ and then select __Standard architectures (armv7, armv7s)__.
3. Set __Build Active Architecture only__ to __Yes__.
4. Scroll down to the Linking section, and set __Other Linker Flags__ to the following:

  `-lalljoyn -lajrouter -lBundledRouter.o -lssl -lcrypto`
5. Scroll down to the list of settings until see the __Search Paths__ group.
6. Double-click the __Header Search Paths__ field and enter the following:

  `$(ALLJOYN_ROOT)/core/alljoyn/build/darwin/arm/$(PLATFORM_NAME)/$(CONFIGURATION)/dist/cpp/inc`
  `$(ALLJOYN_ROOT)/core/alljoyn/alljoyn_objc/AllJoynFramework/AllJoynFramework/`

7.  Double-click the __Library Search Paths__ field and enter the following:

  `$(ALLJOYN_ROOT)/core/alljoyn/build/darwin/$(CURRENT_ARCH)/$(PLATFORM_NAME)/$(CONFIGURATION)/dist/cpp/lib`
  `$(OPENSSL_ROOT)/build/$(CONFIGURATION)-$(PLATFORM_NAME)`

8.  Look through the Build Settings table until you see the __Apple LLVM 5.0 - Language - C++__ group and set the following:
  * __Enable C++ Exceptions__ to __No__.
  * __Enable C++ Runtime Types__ to __No__.
  *	__C++ Language Dialect__ to __Compiler Default__.

9.  Look through the Build Settings table until you see the __Apple LLVM 5.0 - Custom
Compiler Flags__ group and set the following:
  * Enter the following in the __Other C Flags__ field for Debug field:

      `-DQCC_OS_GROUP_POSIX -DQCC_OS_DARWIN`

  * Enter the following in the __Other C Flags__ field for Release field:

      `-DNS_BLOCK_ASSERTIONS=1 -DQCC_OS_GROUP_POSIX -DQCC_OS_DARWIN`

10.  Look through the Build Settings table until you see the __Apple LLVM 5.0 - Language__ group and set the following:
  * __C Language Dialect__ to __Compiler Default__.
  * __Compile Sources As__ to __Objective-C++__.
11.  Select the __Build Phases__ tab.
12.  Expand the __Link Binary With Libraries__ group and click the + sign at the lower left corner. A dialog will appear.
  1. Select the SystemConfiguration.framework file.
  2.  Click the + button again and add the following libraries to link against, if not already included:
    * libstdc++.6.0.9.dylib
    * libstdc++.6.dylib
    * libstdc++.dylib
    * libc++abi.dylib
    * libc++.1.dylib
    * libc++.dylib

#### Add the service frameworks
1. Select the __Build Phases__ tab for the app target. Click the __All__ option at the top of the list.
2. Under __Link Binary with Libraries__, click on the '+' button, choose __Add Other...__, and add the following:

  __General libs__ (needed by all apps using one or more service frameworks):
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
