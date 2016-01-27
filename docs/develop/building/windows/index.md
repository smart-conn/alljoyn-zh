# Building on Windows

## 设置 （Set Up）
1. 安装 Visual Studio 2012, 2013, 或者 2015.
2. 下载确保与 Visual Studio 和 CPU 相匹配的正确版本的 SDK. 
3. 设置环境变量, ALLJOYN_SDK_HOME 指向 AllJoyn SDK 根目录。
    1. 点击开始彩电。
    2. 在 **Search programs and files** 一栏, 输入: "edit environment".
    3. 选择 **Edit environment variables for your account**.
    4. 点击 **New...** 按钮.
    5. 在 "Variable name" 信箱中输入 "ALLJOYN_SDK_HOME". 
    6. 输入 AllJoyn&trade 的位置； SDK 在 "Variable value" 盒子中。
    7. 点击 **OK**.


## 搭建用例
###C++
1. 在编译过的 SDK 中存在着 visual studio 项目。
2. 切换到 cpp/sample 文件夹，选择一个你想运行的应用程序。
3. 打开内含的 Visual Studio 项目。
4. 将搭建选项改变为符合目标 SDK (Release/Debug) 和 CPU (Win32/x64)。

   **NOTE:** 这些必须一致，否则将收到 build errors. 

5. 点击菜单选项 **Build**>**Rebuild**.
搭建完成后，打开 (CPU)/(SDK Version) 文件夹，找到内含的 .exe 文件。

```
e.g. cpp/samples/basic/VC2008Win7/x64/Release
```

双击此应用程序以打开。 会弹出一个带有登入信息的命令行。

##添加一个新的/现存的项目
###Visual Studio 2012, 2013, 或者 2015
1. 打开 **Project**>**Properties**.

2. 点击  **C/C++**.

3. 编辑 *Additional Include Directories* 并添加 $(ALLJOYN_SDK_HOME)\inc.

   **NOTE:** ALLJOYN_SDK_HOME 设置在前面的 Set up 步骤 3 中有描述。

4. 选择 C/C++ 下面的 **Preprocessor** .

5. 编辑 **Preprocessor Definitions** 并添加 QCC_OS_GROUP_WINDOWS and UNICODE.

6. 点击 **Linker**.

7. 编辑 **Additional Library Directories** 并添加 $(ALLJOYN_SDK_HOME)\lib.

8. 点击 **Input** ，在 "Linker" 部分下面。

9. 输入以下库: "alljoyn.lib;ajrouter.lib;ws2_32.lib;Secur32.lib;crypt32.lib;Bcrypt.lib;Ncrypt.lib;iphlpapi.lib".
    
10. 点击 **OK**.  现在您可以开始使用 AllJoyn APIs 了。


### Makefile

执行以下步骤。根据现存 Makefile 的规划方式，下面的操作可能需要一些改变。

1. 打开 Makefile.
2. 创建一个新变量，命名为 ALLJOYN_DIST，指向 AllJoyn SDK.
    
    `ALLJOYN_DIST := <path_to_dist>`

3. 创建一个新变量，命名为 ALLJOYN_LIB，指向 AllJoyn library.

    `ALLJOYN_LIBS := -l$(ALLJOYN_DIST)/cpp/lib/alljoyn.lib -l$(ALLJOYN_DIST)/cpp/lib/ajrouter.lib -l$(ALLJOYN_DIST)/cpp/lib/BundledRouter.obj`
    `ALLJOYN_REQUIRED_LIBS := -lws2_32.lib -lSecur32.lib -lcrypt32.lib -lBcrypt.lib, -lNcrypt.lib -liphlpapi.lib`

4. 如果出现则修改 CXXFLAGS, 或者加入到编译命令: `-DQCC_OS_GROUP_WINDOWS`

5. 修改 include 部分，添加 `-I$(ALLJOYN_DIST)/cpp/inc`

6. 添加 `$(ALLJOYN_LIB) $(ALLJOYN_REQUIRED_LIBS)` 到 Linker 命令:
