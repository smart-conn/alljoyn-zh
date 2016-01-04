# Building Thin - Windows 在精简 Windows 中建立

## 安装
1. 安装针对 Windows 的 Python v2.6/2.7（不支持 Python 3.0）
2. 安装针对 Windows 的 SCons
3. [下载][download] Windows 精简内核 SDK。
4. 解压缩下载的包。

## 生成样例
打开 Windows 命令提示符窗口并输入以下指令：

```bat
cd $ALLJOYN_ROOT\core\ajtcl
scons OS=win7 CPU=x86_64 WS=off MSVC_VERSION=11.0
```

样例的二进制代码存储在 `$AJ_ROOT\core\alljoyn\samples\basic`

[download]: https://allseenalliance.org/framework/download
[build-app-thin-library]:  /develop/tutorial/thin-app
