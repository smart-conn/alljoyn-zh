# Building Thin - Windows 在精简 Windows 中建立

## Setup 安装
1. Install Python v2.6/2.7 for Windows (Python 3.0 will NOT work).安装针对 Windows 的 Python v2.6/2.7（不支持 Python 3.0）
2. Install SCons 2.3 for Windows.安装针对 Windows 的 SCons
3. [Download][download] the Windows Thin Core SDK.[下载][download] Windows 精简内核 SDK。
4. Extract the downloaded package.解压缩下载的包。

## Build the samples 生成样例
Open a Windows command prompt window and run the following:打开 Windows 命令提示符窗口并输入以下指令：

```bat
cd $ALLJOYN_ROOT\core\ajtcl
scons OS=win7 CPU=x86_64 WS=off MSVC_VERSION=11.0
```

Binaries for the samples are located at `$AJ_ROOT\core\alljoyn\samples\basic` 样例的二进制代码存储在 `$AJ_ROOT\core\alljoyn\samples\basic`

[download]: https://allseenalliance.org/framework/download
[build-app-thin-library]:  /develop/tutorial/thin-app
