# Running Basic Sample - Thin Windows

## Prerequisites
* [Build the samples][build-thin-windows]
* [Build the AllJoyn&trade; router][build-windows]. 
  AllJoyn&trade; thin apps require an AllJoyn router to 
  connect to in order to function properly.

## Run Basic Client & Service

1. Launch the AllJoyn daemon to allow thin apps to connect (in a command prompt window).

  ```sh
  # <TARGET CPU> can be either x86_64, x86, or whatever value you set for CPU= when running SCons.
  cd $AJ_ROOT\core\alljoyn\build\win7\<TARGET_CPU>\debug\dist\cpp\bin\samples
  
  SampleDaemon.exe 
   ```
2. Launch basic_service (in a command prompt window).

  ```sh
  cd $AJ_ROOT\core\ajtcl\samples\basic
  basic_service.exe
  ```

3. Launch basic_client (in a command prompt window).

  ```sh
  cd $AJ_ROOT\core\ajtcl\samples\basic
  basic_client.exe
  ``` 

The output from basic_client should look like this:

```
basic_client.exe
'org.alljoyn.Bus.sample.cat' (path='/sample') returned 'Hello World!'.
Basic client exiting with status 0.
```

The output from basic_service should look like this:

```
basic_service.exe
000.000 aj_guid.c:76 LookupName(): NULL
Session lost. ID = 3629706635, reason = 2AllJoyn disconnect.
```

[build-thin-windows]: /develop/building/thin-windows
[build-windows]: /develop/building/windows