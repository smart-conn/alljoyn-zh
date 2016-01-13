# Windows - Basic Sample App

## 运行 basic_client 和 basic_service
###Precompiled .exe
AllJoyn&trade; Standard Library Windows SDK 包含一个预编译的二进制码集合。 

####Service
1. 打开一个命令行窗口。
2. 切换到你的文件系统的 AllJoyn SDK 根目录。
3. 切换到 cpp/bin/samples 文件夹。.
4. 运行 basic_service:


    basic_service

**NOTE:** 应用程序正在运行，将会在有 basic client 连接的时候打印信息。

####Client
1. 打开一个命令行窗口。
2. 切换到你的文件系统的 AllJoyn SDK 根目录。
3. 切换到 cpp/bin/samples 文件夹。.
4. 运行 basic_client:


     basic_client

**NOTE:** 应用程序会在找到服务并执行 cat 方法后自动退出。

###Visual Studio
Basic sample 应用程序们被合并到一个 Visual Studio 项目里。你可以运行上面提及的对应的 .exe 文件，也可以创建一个新的包含所需要 debug 的samples
的 Visual Studio 项目。
1. 打开 visual studio 的 basic project 文件.
2. 右击你想要运行的项目，选择 **Set as StartUpProject**.
3. 在菜单选项上方，选择 **Debug** > **Start Debugging**.
    1. 如果菜单工具栏可见，你也可以按绿色的 Play 按钮。
    2. 键盘上的 F5 键也可起作用，除非你已经改变了此快捷键。 
4. 会有一个命令提示符出现，你将会看到结果。

**NOTE:** Basic_client 应用程序会在找到服务并执行 cat 命令后自动退出。如果你希望追踪此应用程序的flow，则需要设置 breakpoints. 
