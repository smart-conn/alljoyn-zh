# Building on Windows

## Setup
1. Install Visual Studio 2012, 2013, or 2015.
2. Ensure that the correct version of the SDK was downloaded that matches the Visual Studio and CPU.
3. Set up environment variable, ALLJOYN_SDK_HOME to point to the AllJoyn SDK root folder.
    1. Click on the Start menu.
    2. In the **Search programs and files** field, type: "edit environment".
    3. Select **Edit environment variables for your account**.
    4. Click the **New...** button.
    5. Type "ALLJOYN_SDK_HOME" for the "Variable name" box.
    6. Enter location of the AllJoyn&trade; SDK in the "Variable value" box.
    7. Click **OK**.


## Build the samples
###C++
1. Inside the compiled SDK exists visual studio projects.
2. Navigate to the cpp/sample folder and pick a sample application you wish to run.
3. Open up the Visual Studio project contained.
4. Change the build settings to match the target SDK (Release/Debug) and CPU (Win32/x64).

   **NOTE:** These must match or you will receive build errors.

5. Click the menu option **Build**>**Rebuild**.
When the build is complete, open the (CPU)/(SDK Version) folder to find the .exe files contained.

```
e.g. cpp/samples/basic/VC2008Win7/x64/Release
```

Double-click the applications to open them. A command prompt appears that contains logging information.

##Adding to a new/existing project
###Visual Studio 2012, 2013, or 2015
1. Open **Project**>**Properties**.

2. Click on **C/C++**.

3. Edit *Additional Include Directories* and add $(ALLJOYN_SDK_HOME)\inc.

   **NOTE:** ALLJOYN_SDK_HOME setup in Set up step 3 above.

4. Select **Preprocessor** under C/C++.

5. Edit **Preprocessor Definitions** and add QCC_OS_GROUP_WINDOWS and UNICODE.

6. Click on **Linker**.

7. Edit **Additional Library Directories** and add $(ALLJOYN_SDK_HOME)\lib.

8. Click on **Input** found under the "Linker" section.

9. Enter the following libraries: "alljoyn.lib;ajrouter.lib;ws2_32.lib;Secur32.lib;crypt32.lib;Bcrypt.lib;Ncrypt.lib;iphlpapi.lib".
    
10. Click **OK**.  You are now ready to start using the AllJoyn APIs.


### Makefile

Perform the following steps at a high level. Changes may be needed due to how the existing Makefile is structured.

1. Open your Makefile.
2. Create a new variable named ALLJOYN_DIST to point to the AllJoyn SDK.
    
    `ALLJOYN_DIST := <path_to_dist>`

3. Create a new variable named ALLJOYN_LIB to point to the AllJoyn library.

    `ALLJOYN_LIBS := -l$(ALLJOYN_DIST)/cpp/lib/alljoyn.lib -l$(ALLJOYN_DIST)/cpp/lib/ajrouter.lib -l$(ALLJOYN_DIST)/cpp/lib/BundledRouter.obj`
    `ALLJOYN_REQUIRED_LIBS := -lws2_32.lib -lSecur32.lib -lcrypt32.lib -lBcrypt.lib, -lNcrypt.lib -liphlpapi.lib`

4. Modify CXXFLAGS if present, or add to compile command: `-DQCC_OS_GROUP_WINDOWS`

5. Modify the include section to add: `-I$(ALLJOYN_DIST)/cpp/inc`

6. Add `$(ALLJOYN_LIB) $(ALLJOYN_REQUIRED_LIBS)` to the Linker command:
