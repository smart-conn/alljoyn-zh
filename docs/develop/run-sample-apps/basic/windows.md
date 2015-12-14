# Windows - Basic Sample App

## Running basic_client and basic_service
###Precompiled .exe
The AllJoyn&trade; Standard Library Windows SDK includes a precompiled set of binaries.

####Service
1. Open a Command Terminal window.
2. CD to the root AllJoyn SDK folder in your file system.
3. CD to the cpp/bin/samples folder.
4. Run basic_service:

    basic_service

**NOTE:** The application just runs and will print information when a basic client connects.

####Client
1. Open a Command Terminal window.
2. CD to the root AllJoyn SDK folder in your file system.
3. CD to the cpp/bin/samples folder.
4. Run basic_client:
    basic_client

**NOTE:** The application will exit after finding a service, executing the cat method, then exits.

###Visual Studio
The Basic sample applications are merged into a single Visual Studio project. 
You can either run the counterpart of the .exe files mentioned above, 
or create a new Visual Studio project that includes just the sample you wish to debug.
1. Open the visual studio basic project file.
2. Right click on the project you wish to run and select **Set as StartUpProject**.
3. From the top menu options. select **Debug** > **Start Debugging**.
    1. If the menu toolbar is visible, you can also press the green Play button.
    2. The keyboard F5 key can also work, unless you have changed this shortcut.
4. A command prompt will open and you will see the output.

**NOTE:** The basic_client application will exit after finding a 
service and executing the cat command.  Set breakpoints if you 
wish to follow the application flow.
