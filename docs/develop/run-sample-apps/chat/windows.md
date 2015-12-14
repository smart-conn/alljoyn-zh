# Windows - Chat Sample App

## Running basic_client and basic_service

### Precompiled .exe

Inside the AllJoyn&trade; Standard Library Windows SDK, there exists a precompiled set of binaries.

1. Open a Command Terminal window.
2. CD to the root AllJoyn SDK folder in your file system.
3. CD to the cpp/bin/samples folder.
4. Run chat using the following startup options:
   Chat client:
       chat.exe -j training
   Chat host
       chat.exe -s training
5. Once you are joined, any text entered will be sent to the other 
applications upon pressing **Enter**.

###Visual Studio

**NOTE:** Unless you make a modification to the source code, this 
sample will not run using the play command. It requires startup 
arguments as stated above.

1. Open the Visual Studio Basic project file.
2. Right-click on the project you wish to run and select **Set as StartUpProject**. 
3. Make a modification in chat.cc inside the ParseCommandLine method to avoid supplying a command line startup argument.
4. From the top menu options select **Debug**>**Start Debugging**.
    1. If the menu toolbar is visible, you can also press the green Play button.
    2. The keyboard F5 key can also work, unless you have changed this shortcut.
5. The console will appear using the hard-coded values entered in step 3.
6. Run the chat application per the precompiled .exe instructions, or use another platform.
