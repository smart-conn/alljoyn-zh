# Android - Core Sample Apps

## Running Android SimpleClient, SimpleService Apps

The Android SimpleClient and SimpleService provide a simple 
example of how a client app and a service app can be implemented. 
The SimpleService listens for connections, the SimpleClient joins 
the SimpleService session, and text sent from the SimpleClient to 
the SimpleService via a BusMethod invoked on a SimpleService 
BusObject is displayed in both apps.

1. Connect device A and device B to the same network.
2. Load SimpleClient.apk onto device A, and start app "Simple Client".
  ![][1.SimpleClientWaitingForSimpleService]
3. Load SimpleService.apk onto device B, and start app "Simple Service". 
The "Simple Service" will simply show a blank screen when started.
4. The SimpleClient will join the session of the SimpleService, 
after which the SimpleClient will show the below.
  ![][2.SimpleClientConnected]
5. Enter text in the "Simple Client" and press **Enter** to have the 
text sent and returned by the "Simple Service", and displayed 
on-screen for both apps.
  ![][3.SimpleClientSentAndReceivedMessage]

## Running Android Chat App

The Android Chat app shows how a chat room can be implemented using 
the AllJoyn&trade; framework, where an app first creates and joins 
a session, after which one or more other apps later join the same session.

1. Connect all devices to the same network.
2. Load Chat.apk onto devices, and start app "AllJoyn Chat Sample for Android".
4. Create and start a channel on the first device.
      * Select the right tab (with a "+" on it).
  ![][1.SetUpChannel]
      * Create a channel via the **Set Channel Name** button - enter a channel name when prompted.
  ![][2.SetChannelName]
      * Press the **Start Channel** button.
  ![][3.StartChannel]
5. Join the channel on the first device.
      * Press the left tab.
      * Press the **Join Channel** button, and choose the channel that was created above.
  ![][4.ChooseChannelToJoin]
  ![][5.ChannelJoined]
6. Join the channel on other device(s).
      * Press the left tab.
      * Press the **Join Channel** button, and choose the channel that was created above.
7. Enter text in the "Enter message here" text box, and hit enter to chat between devices. 
In the message history, the Bus Attachment's Unique name will be displayed 
alongside text from the "other" device(s), or "Me" will displayed alongside text from "this" device.
  ![][6.SendMessages]


[1.SimpleClientWaitingForSimpleService]: /files/develop/run-sample-apps/android-simple-sample/1.SimpleClientWaitingForSimpleService.png
[2.SimpleClientConnected]: /files/develop/run-sample-apps/android-simple-sample/2.SimpleClientConnected.png
[3.SimpleClientSentAndReceivedMessage]: /files/develop/run-sample-apps/android-simple-sample/3.SimpleClientSentAndReceivedMessage.png

[1.SetUpChannel]: /files/develop/run-sample-apps/android-chat-sample/1.SetUpChannel.png
[2.SetChannelName]: /files/develop/run-sample-apps/android-chat-sample/2.SetChannelName.png
[3.StartChannel]: /files/develop/run-sample-apps/android-chat-sample/3.StartChannel.png
[4.ChooseChannelToJoin]: /files/develop/run-sample-apps/android-chat-sample/4.ChooseChannelToJoin.png
[5.ChannelJoined]: /files/develop/run-sample-apps/android-chat-sample/5.ChannelJoined.png
[6.SendMessages]: /files/develop/run-sample-apps/android-chat-sample/6.SendMessages.png
