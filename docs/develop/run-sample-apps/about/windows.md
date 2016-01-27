# Windows - 运行 About Sample 应用程序

## 运行 Windows AboutClient 以及 AboutService 应用程序
###Precompiled .exe
AllJoyn&trade; 标准库 Windows SDK 包含一系列预编译的二进制码。

####Service
打开一个命令行窗口

```sh
cd <root AllJoyn SDK folder in your file system>
cd cpp\bin\samples
AboutService.exe
```

**NOTE:** 应用程序运行。在有 AboutClient 连接时，将会打印相关信息。

####Client
打开一个命令行窗口

```sh
cd <root AllJoyn SDK folder in your file system>
cd cpp\bin\samples
AboutClient.exe
```

**NOTE:** 此应用程序会搜索任何宣布了 `com.example.about.feature.interface.sample` 接口的 AboutService 实例。他将会连接到该服务，并调用由 About  接口指定的所有方法以及由 `com.example.about.feature.interface.sample` 接口指定的 Echo 方法。


## 运行早期版本的 AboutService 和 AboutClient 应用程序

####Service
打开一个命令行窗口。

```sh
cd <root AllJoyn SDK folder in your file system>
cd cpp\bin\samples
AboutService_legacy.exe
```

**NOTE:** 应用程序运行。在有 AboutClient 连接时，将会打印相关信息。

####Client
打开一个命令行窗口。

```sh
cd <root AllJoyn SDK folder in your file system>
cd cpp\bin\samples
AboutClient_legacy.exe
```

**NOTE:** 此应用程序会搜索任何宣布了 `org.alljoyn.About` 和 `org.alljoyn.Icon` 接口的 AboutService 实例。他将会连接到该服务，并调用由 About Interface 和 About Icon 接口所定义的所有方法。
