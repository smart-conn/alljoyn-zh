# Build From Source - iOS and OS X

## Development Environment Requirements

The AllJoyn&trade; build environment requires:

* Apple computer system with OS X 10.9 (Mavericks) or above
* Xcode 6.x or higher

## Installation

Install the following on your OS X 10.9 or above system:

### Xcode

1. Open a browser and navigate to
http://itunes.apple.com/us/app/xcode/id497799835?mt=12.
2. Download and install the free Xcode application.
3. After successful installation, from your Applications folder, select and open Xcode.
4. Select the **Xcode > Preferences** menu item.
5. Select the **Downloads** tab.
6. Select the **Components** tab.
7. Verify that the Command Line Tools have been installed.

   **NOTE:** You may need to run the following command from a
   terminal window to install the Command Line Tools:

   ```sh
   $ xcode-select --install
   ```

### Homebrew

Use Homebrew to deploy SCons, git, and uncrustify to your OS X system.

1. Open a browser and navigate to http://mxcl.github.com/homebrew/.
2. Download Homebrew.
3. Navigate to https://github.com/mxcl/homebrew/wiki/installation,
and follow the directions for installation.

### SCons

Use the SCons build tool to generate the AllJoyn C++ API binaries
for iOS and OS X.

To install SCons, open a terminal window, and type the following command:

```sh
$ brew install scons
```

### Git

Use Git for source control.

To install Git, open a terminal window, and type the following command:

```sh
$ brew install git
```

### Appledoc

**NOTE:** Appledoc is not required if you do not want to generate
the API Reference Manual.

The appledoc tool generates documentation for the AllJoyn
Objective-C language binding. For more information, see http://gentlebytes.com/appledoc/.

1. Open a browser and navigate to https://github.com/tomaz/appledoc.

2. Do one of the folliowing:

   1. Download appledoc.
   2. To install using Homebrew, open a terminal window and type
   the following command:

   ```sh
   $ brew install appledoc
   ```

   Homebrew puts your templates in `~/Library/Application Support/appledoc`.

### Doxygen

**NOTE:** Doxygen is not required if you do not want to generate the
API Reference Manual.

The Doxygen tool generates documentation for the AllJoyn C++
language binding. For more information, see http://www.doxygen.org.

1. Open a browser and navigate to http://www.doxygen.org.
2. Do one of the following:

   1. Download and install doxygen.
   2. To install using Homebrew, open a terminal window and
   type the following command:

   ```sh
   $ brew install doxygen
   ```

### Graphviz

**NOTE:** Graphviz is not required if you do not want to generate
the API Reference Manual.

The Graphviz Dot tool diagrams class hierarchies. For more
information, see http://www.graphviz.org.

1. Open a browser and navigate to http://graphviz.org.

2. Do one of the following:

   1. Download and install graphviz.
   2. To install using Homebrew, open a terminal window and
   type the following command:

   ```sh
   $ brew install graphviz
   ```

### Obtaining the AllJoyn source

To download the AllJoyn source code, including the Objective-C
language binding, which is the AllJoyn framework:

1. Open a terminal window.
2. Type the following commands:

   ```sh
   $ mkdir ~/alljoyn # for example
   $ cd ~/alljoyn
   $ git clone https://git.allseenalliance.org/gerrit/core/alljoyn.git
   ```

### Obtaining OpenSSL

OpenSSL is an open source toolkit for implementing the
Secure Sockets Layer (SSL v2/v3) and Transport Layer Security (TLS v1).
Although the Mac OS X SDK includes OpenSSL, the iOS SDK does not include it.

1. To build the OpenSSL framework for iOS, download the source
code at the following web address:

   http://www.openssl.org/

2. Copy the OpenSSL source into a separate folder on your
development system, not under the AllJoyn framework source
directory tree. For example,

   /Development/openssl/openssl-1.0.1

3. Download the Xcode project that can be used to build
Open SSL for iOS from GitHub at the following web address:

   https://github.com/sqlcipher/openssl-xcode/

4. Navigate to the top level OpenSSL source folder in Finder
(i.e., `/Development/openssl/openssl-1.0.1`), and copy the
openssl.xcodeproj folder you downloaded from GitHub into this folder.
5. Open the openssl.xcodeproj in Xcode.

 Make sure of the following :

  * 'Valid Architectures' field has 'arm64' as one of the values.
  * Under Architectures you have 'Standard architectures (armv7, arm64)' selected
  * 'Build Active Architecture Only = No'


6.  In Xcode, build the crypto target (libssl.a and libcrypto.a)
for each combination of configuration (debug|release) and
platform (iphoneos|iphonesimulator) that you need for your
iOS project by selecting **Product > Build For > (your desired configuration)**.
7. Create a new folder called **build** under the top-level
OpenSSL folder created in step 2 (i.e., `/Development/openssl/openssl-1.0.1/build`).
8. Locate your OpenSSL build products folders (i.e., Debug-iphoneos)
in the /Users/<your username>/Library/Developer/Xcode/DerivedData/XXXXXXXXXXXXX-openssl/Build/Products folder,
and copy all the <configuration>-<platform> folders, like Debug-iphoneos,
to the build folder created in step 7.
   You should now have a folder structure similar to the
   following, containing libssl and libcrypto for each $(CONFIGURATION)-$(PLATFORM_NAME)
   you built in step 6:

   ```sh
   openssl-1.0.1c build
   Debug-iphoneos ibssl.a libcrypto.a
   Debug-iphonesimulator libssl.a libcrypto.a
   ```

9. Define an environment variable OPENSSL_ROOT=<path to the OpenSSL source top folder>
   This environment variable needs to be present whenever you build projects using the
   AllJoyn SDK.

    9a. For Mac OS X 10.7 to 10.9, to set the environment variable, open a Terminal window and type the following:
    ````sh
    launchctl setenv OPENSSL_ROOT <path to top level folder containing openssl>
    ````
    9b. With Mac OS X 10.10, environment variable processing changed. Most importantly, OPENSSL_ROOT
    must be defined before launching Xcode (Xcode will not pick up new or changed variables
    after launching). Therefore, to set the environment variable, open a Terminal window and type
    the following:

    ```sh
    launchctl setenv OPENSSL_ROOT <path to top level folder containing openssl>
    sudo killall Finder
    sudo killall Dock
    ```
## Building the AllJoyn Framework

Using the Xcode Integrated Development Environment (IDE) to
build the AllJoyn SDK is much easier than using the command line.
We therefore recommend using the Xcode IDE to produce the
AllJoyn binaries for OS X or iOS.

### Xcode IDE build

1. Do one of the following:

   1. Navigate in Finder to the `<alljoyn root directory>/alljoyn_objc` directory,
   and double-click the `alljoyn_darwin.xcodeproj` file to launch Xcode.
   OR
   2. Open Xcode, select **File > Open**, and choose the
   `<alljoyn root directory>/alljoyn_objc/alljoyn_darwin.xcodeproj` file.

2. Just as with any Xcode project, select the active Scheme
to control which version of the AllJoyn framework is built.
There are schemes for the AllJoyn framework targeting OS X and iOS.
The active scheme is controlled by a selection box located in the
upper left-hand corner of the Xcode user interface.
3. Click the selection box for the active scheme to see a
menu of all schemes configured for the Xcode project and
allow you to select the platform to build. For instance,
when building the AllJoyn framework on iOS, you might select
iOS Device, iPad Simulator, or iPhone simulator as platforms for the build.
4. Once you select a scheme and a platform to build against, select
**Product > Build** from the Xcode menu to build the AllJoyn framework.
Upon completion of the build, your binaries will be located in the following directory:

   ```sh
   <alljoyn_root_directory>/alljoyn_core/build/darwin/[arm|x86]/[debug|release]/dist
   ```

   **NOTE:** For OS X builds, the binaries will be located under the `.../darwin/x86/...`
   directory. For iOS builds, the binaries will be located under the `.../darwin/arm/   ` directory.

### Command line build

1. Open a terminal window.
2. Change your directory to `<alljoyn root directory>/alljoyn_objc`
by running the following command:

   ```sh
   $ cd <alljoyn root directory>/alljoyn_objc
   ```

3. To build for:

   * 64-bit iOS devices, run the following command:

   ```sh
   $ /Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild
      -project alljoyn_darwin.xcodeproj
      -scheme alljoyn_core_arm64 -sdk iphoneos -configuration Debug
   ```

   * For all other iOS devices, run the following command:

   ```sh
   $ /Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild
      -project alljoyn_darwin.xcodeproj
      -scheme alljoyn_core_ios -sdk iphoneos -configuration Debug
   ```

   * iOS simulator, run the following command:

   ```sh
   $ /Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild
      -project alljoyn_darwin.xcodeproj
      -scheme alljoyn_core_ios -sdk iphonesimulator -configuration Debug
   ```

   * OS X, run the following command:

   ```sh
   $ /Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild
      -project alljoyn_darwin.xcodeproj
      -scheme alljoyn_core_osx
   ```
