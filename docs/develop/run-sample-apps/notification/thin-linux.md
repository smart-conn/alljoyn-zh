# 运行提醒样例 - Thin Linux

## 前提条件
* [Build the thin Linux samples][build-thin-linux] 
* [Build the AllJoyn&trade; router][build-linux]. AllJoyn 精简应用程序需要一个可以连接的 AllJoyn 路由来正常工作。

## 运行 Notification Producer 和 Consumer

1. 使用配置文件运行 AllJoyn daemon， 使精简应用程序可以连接。

   ```sh
   # <TARGET CPU> can be either x86_64, x86, or whatever value you set for CPU= when running SCons.
   export TARGET_CPU=<TARGET CPU>
   cd $AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/release/dist/cpp/bin

   export LD_LIBRARY_PATH=`pwd`/../lib:$LD_LIBRARY_PATH
   # This sets the library path to load the liballjoyn.so shared library.

    ./alljoyn-daemon &
    ```

3. 运行 NotificationConsumerSample (在新的命令行中)。

   ```sh
   cd $AJ_ROOT/services/sample_apps/build/
   ./NotificationConsumerSample
   ```

4. 运行 NotificationProducerSample (在新的命令行中)。

   ```sh
   cd $AJ_ROOT/services/sample_apps/build/
   ./NotificationProducerSample
   ``` 

NotificationProducerSample 的输出应为如下所示：

```
./NotificationProducerSample 
000.000 PropertyStore.c:201 Set key [DeviceId] defaultValue [e7471a6ad4761b17ad169a3146fe6d1a]
000.000 PropertyStore.c:148 Has key [DeviceName] default Value []
000.000 PropertyStore.c:201 Set key [DeviceName] defaultValue [COMPANY GENERIC BOARD 6fe6d1a]
000.000 PropertyStore.c:144 Has key [DeviceName] runtime Value [COMPANY GENERIC BOARD 6fe6d1a]
Attempting to connect to bus 'org.alljoyn.BusNode'
Connected to Routing Node with BusUniqueName=:yEmGBABV.3
001.084 NotificationProducer.c:512 In SendNotification
001.084 PropertyStore.c:144 Has key [DeviceId] runtime Value [e7471a6ad4761b17ad169a3146fe6d1a]
001.084 PropertyStore.c:148 Has key [DefaultLanguage] default Value [en]
001.084 PropertyStore.c:144 Has key [DeviceName] runtime Value [COMPANY GENERIC BOARD 6fe6d1a]
001.084 PropertyStore.c:144 Has key [AppId] runtime Value [e7471a6ad4761b17ad169a3146fe6d1a]
001.084 PropertyStore.c:148 Has key [AppName] default Value [Notifier]
001.084 NotificationProducer.c:560 Generating random number for notification id
001.084 NotificationProducer.c:481 In SendNotifySignal
001.084 NotificationProducer.c:493 ***************** Notification id 860073951 delivered successfully with serial number 5 *****************
AllJoyn disconnect
```

NotificationConsumerSample 的输出应为如下所示：

```
./NotificationConsumerSample 
Attempting to connect to bus 'org.alljoyn.BusNode'
Connected to Routing Node with BusUniqueName=:yEmGBABV.2
000.000 NotificationConsumer.c:167 In SetSignalRules()
000.000 NotificationConsumer.c:168 Adding Dismisser interface match.
000.000 NotificationConsumer.c:176 Adding Notification interface match.
000.000 NotificationConsumer.c:208 Adding Superagent interface match.
000.099 aj_msg.c:1087 Discarding bad message AJ_ERR_NO_MATCH
000.136 aj_msg.c:1087 Discarding bad message AJ_ERR_NO_MATCH
000.136 aj_msg.c:1087 Discarding bad message AJ_ERR_NO_MATCH
024.480 NotificationConsumer.c:749 Received Producer signal.
024.480 NotificationConsumer.c:287 Received notification signal from sender :yEmGBABV.3
024.480 aj_msg.c:1195 AJ_UnmarshalMsg(): AJ_ERR_NO_MORE
024.480 aj_msg.c:1195 AJ_UnmarshalMsg(): AJ_ERR_NO_MORE
024.480 aj_msg.c:1195 AJ_UnmarshalMsg(): AJ_ERR_NO_MORE
024.480 aj_msg.c:1195 AJ_UnmarshalMsg(): AJ_ERR_NO_MORE
******************** Begin New Message Received ********************
Message Id: 860073951
Version: 2
Device Id: e7471a6ad4761b17ad169a3146fe6d1a
Device Name: COMPANY GENERIC BOARD 6fe6d1a
App Id: BC096200000000001F01000003000000
App Name: Notifier
Message Type: 2
OriginalSender bus unique name: :yEmGBABV.3
Language: en  Message: Hello AJ World.
Language: de-AT  Message: Hallo AJ Welt.
Other parameters included:
Custom Attribute Key: On  Custom Attribute Value: Hello
Custom Attribute Key: Off  Custom Attribute Value: Goodbye
Rich Content Icon Url: http://www.getIcon1.org
******************** Begin Rich Audio Content ********************
Language: en  Audio URL http://www.getAudio1.org
Language: de-AT  Audio URL http://www.getAudio2.org
******************** End Rich Audio Content ********************
Rich Content Icon Object Path: /icon/MyDevice
Rich Content Audio Object Path: /audio/MyDevice
******************** End New Message Received ********************
036.490 aj_guid.c:76 LookupName(): NULL
036.491 aj_guid.c:76 LookupName(): NULL
```

[build-thin-linux]: /develop/building/thin-linux
[build-linux]: /develop/building/linux
