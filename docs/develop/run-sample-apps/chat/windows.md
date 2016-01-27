# Windows - 聊天样例应用程序

## 运行 basic_client 和 basic_service

### Precompiled .exe

AllJoyn&trade; Standard Library Windows SDK 中包含一个预编译的二进制码集合。

1. 打开一个命令行窗口。
2. 切换到文件系统的 AllJoyn SDK 根目录。
3. 切换到 cpp/bin/samples 文件夹。
4. 使用下列启动参数运行：
   Chat client:
       chat.exe -j training
   Chat host
       chat.exe -s training
5. 一旦你加入聊天，任何键入的文本都会在按下 **Enter** 后被发送到其他应用程序。

###Visual Studio

**NOTE:** 除非你对源代码进行修改，此用例不会使用 play 命令运行。启动参数必须按照上文所述设置。

1. 打开 visual studio 的 Basic project 文件。
2. 右击你想要运行的项目，选择 **Set as StartUpProject**. 
3. 修改在 ParseCommandLine 方法中的 chat.cc 以避免传入命令行启动参数。 
4. 在菜单选项上方，选择 **Debug**>**Start Debugging**.
    1. 如果菜单工具栏可见，你也可以按绿色的 Play 按钮完成上述操作。
    2. 键盘上的 F5 键也可起作用，除非你已经改变了此快捷键。
5. 控制台会出现，并使用步骤3中设置的硬编码值。
6. 根据预编译的 .exeRun 说明来运行聊天应用程序，或者使用其它平台。 
