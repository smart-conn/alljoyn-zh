# Building Thin - Windows

## Setup
1. Install Python v2.6/2.7 for Windows (Python 3.0 will NOT work).
2. Install SCons 2.3 for Windows.
3. [Download][download] the Windows Thin Core SDK.
4. Extract the downloaded package.

## Build the samples
Open a Windows command prompt window and run the following:

```bat
cd $ALLJOYN_ROOT\core\ajtcl
scons OS=win7 CPU=x86_64 WS=off MSVC_VERSION=11.0
```

Binaries for the samples are located at `$AJ_ROOT\core\alljoyn\samples\basic`

[download]: https://allseenalliance.org/framework/download
[build-app-thin-library]:  /develop/tutorial/thin-app
