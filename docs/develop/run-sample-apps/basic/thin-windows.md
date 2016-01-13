# Running Basic Sample - 精简 Windows

## 前提条件
* [Build the samples][build-thin-windows]
* [Build the AllJoyn&trade; router][build-windows]. 
   AllJoyn 精简应用程序需要一个可以连接到的 AllJoyn 路由来完成正常功能。

## 运行 Basic Client & Service
使用配置文件运行 AllJoyn daemon，使精简应用程序可以连接。 
1. 运行 AllJoyn daemon ，使精简应用程序可以连接。  (在一个命令提示符窗口)。

  ```sh
  # <TARGET CPU> can be either x86_64, x86, or whatever value you set for CPU= when running SCons.
  cd $AJ_ROOT\core\alljoyn\build\win7\<TARGET_CPU>\debug\dist\cpp\bin\samples
  
  SampleDaemon.exe 
   ```
2. 运行 basic_service  (在一个命令提示符窗口)。

  ```sh
  cd $AJ_ROOT\core\ajtcl\samples\basic
  basic_service.exe
  ```

3. 运行 basic_client  (在一个命令提示符窗口)。

  ```sh
  cd $AJ_ROOT\core\ajtcl\samples\basic
  basic_client.exe
  ``` 

 basic_client 的输出应为如下所示：should look like this:

```
basic_client.exe
'org.alljoyn.Bus.sample.cat' (path='/sample') returned 'Hello World!'.
Basic client exiting with status 0.
```

basic_service 的输出应为如下所示：

```
basic_service.exe
000.000 aj_guid.c:76 LookupName(): NULL
Session lost. ID = 3629706635, reason = 2AllJoyn disconnect.
```

[build-thin-windows]: /develop/building/thin-windows
[build-windows]: /develop/building/windows
