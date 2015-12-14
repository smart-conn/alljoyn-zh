# Windows - Running About Sample Apps

## Running Windows AboutClient and AboutService Apps
###Precompiled .exe
The AllJoyn&trade; Standard Library Windows SDK includes a precompiled set of binaries.

####Service
Open a Command Terminal window.

```sh
cd <root AllJoyn SDK folder in your file system>
cd cpp\bin\samples
AboutService.exe
```

**NOTE:** The application just runs and will print information when an AboutClient connects.

####Client
Open a Command Terminal window.

```sh
cd <root AllJoyn SDK folder in your file system>
cd cpp\bin\samples
AboutClient.exe
```

**NOTE:** The application searches for any instance of AboutService that is announcing
the `com.example.about.feature.interface.sample` it will connect to the service
and call all the methods specified in the About Interface and the Echo method
specified in the `com.example.about.feature.interface.sample` interface.


## Run Legacy AboutService and AboutClient Apps

####Service
Open a Command Terminal window.

```sh
cd <root AllJoyn SDK folder in your file system>
cd cpp\bin\samples
AboutService_legacy.exe
```

**NOTE:** The application just runs and will print information when an AboutClient connects.

####Client
Open a Command Terminal window.

```sh
cd <root AllJoyn SDK folder in your file system>
cd cpp\bin\samples
AboutClient_legacy.exe
```

**NOTE:** The application searches for any instance of AboutService that is announcing
the `org.alljoyn.About` and `org.alljoyn.Icon` it will connect to the service
and call all the methods specified in the About Interface and the the About Icon
interface.
