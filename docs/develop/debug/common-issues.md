# Common Issues

Below is a list of common issues, debugging tricks, and solutions.

## The AllJoyn&trade; discover feature is not working in Android

### Check the setup

* Are the devices connected to the same access point? 

  The devices should be connected to the same access point 
  for the AllJoyn frameowrk to work.

* Is there an AllJoyn router running?

  An AllJoyn router must be running for every app that uses 
  the AllJoyn framework. The router can be in standalone or bundled form.

* Is the access point conducive to a peer-to-peer network?

  For the AllJoyn framework to work on a Wi-Fi network, it should 
  have multi-cast packet routing enabled and wireless isolation turned off. 
  The AllJoyn framework handles the case of wireless isolation if 
  you do not care which transport is used, but if you want strictly 
  Wi-Fi access, wireless isolation should be turned off.

### Check for `AndroidManifest.xml`. 

* The `AndroidManifest.xml` file must be in the app package.

  Developers often look up AllJoyn samples to learn how to 
  use the AllJoyn framework. While getting the source code 
  is usually correct, make sure the `AndroidManifest.xml` file 
  is in the app package. 
  
* Check the app for four essential permissions.	

  ```xml
   <uses-permission android:name= "android.permission.INTERNET">
   </uses-permission>	
  ```

  ```xml
  <uses-permission android:name= "android.permission. 
  CHANGE_WIFI_MULTICAST_STATE">
  </uses-permission>	
  ```

  * You need the first two permissions for AllJoyn discovery to work.
    * The AllJoyn discovery mechanism sends out multicast packets.
    * To send out multicast packets on Android through an app, 
      add these two permissions to the AndroidManifest.xmlfile 
      of the app.

  ```xml
  <uses-permission android:name= "android.permission.ACCESS_WIFI_STATE">
  </uses-permission>	
  ```

  ```xml
  <uses-permission android:name= "android.permission.CHANGE_WIFI_STATE">
  </uses-permission>
  ```

  * You need the second two permissions when using AllJoyn 2.5 
    or above and want to use ICE, which is an alternate transport 
    in the AllJoyn framework.
    * AllJoyn 2.5 has a feature called proximity service that 
    determines when you are near someone, i.e., you are proximal 
    to another AllJoyn service/client.
    * One method for determining proximity is matching the 
    access points that the devices see. If the devices see 
    a common set of access points, it is safe to say that 
    they are near each other.
    * These two permissions allow an app to request and use 
    the access point information provided by Android.

## Peer presence detection

How do I know when a peer is no longer available, or has moved 
out of range when I was talking to, or in a session with, that peer?

### Background

The AllJoyn framework has three kinds of main listeners (excluding `AuthListener`)

* `BusListener`

  Has callbacks for `FoundAdvertisedName`, `NameOwnerChanged`, and `NameLost`.

* `SessionPortListener`

  Typically used by a peer that is hosting a session/service; 
  you can have two callbacks inside your implementation of this listener.

  1. `acceptSessionJoiner` - A service uses this callback to 
  accept or reject peers that have sent it a request to join a session.
  2. `sessionJoined` - The bus calls this callback when a client 
  joins a service. This is called on the service side if it 
  implements the `SessionPortListener`.

* `SessionListener`

  This listener has callbacks that the service and client can 
  implement to get notifications about who joined or left the session.

  1. `sessionLost` - The bus calls this callback when the 
  last member of the session has left.

  **TIP:** Developers might look at the service as one of the 
  members of the session and therefore think that as long 
  as the service is up, the session is up. This seems true 
  logically, but actually, a session must have two or more 
  peers. Thus, having the service up does not necessarily 
  mean there is a session. Further, on Wi-Fi, if the session 
  owner leaves, the session is still up, and communication can 
  flow, but new users can now join.

  2. `sessionMemberAdded` - The bus calls this callback when 
  a member is added to a multipoint session. This more frequently 
  helps the client keep track of who joined the session.
  3. `sessionMemberRemoved` - Useful for tracking the member 
  that left a session and can be used by the service and 
  the client. The service typically has a way (using `sessionJoined` 
  from the `SessionPortListener`) to find out who joined 
  the session without using sessionMemberAdded. Use only 
  `sessionMemberRemoved` to track who left the session.

### Approach

Now that we covered the listeners, you might assume that this 
is easy, and that you just need to track the `sessionMemberRemoved` 
callbacks to know if a peer to whom you were talking has left 
the session. This is correct, but these steps can help considerably.

* Is the link still up, or has it gone down since the peer 
moved out of range?

  * Every time two peers connect, i.e., are in a session, 
  there is a link between them. A link between them implies 
  a link between their respective daemons.
  * We are looking for a way to find out if the link is 
  still up, or has gone down since the peer moved out of range.
  * We can use a timeout for the link, so that if the link has 
  been inactive for a specified period of time, we can conclude 
  that it has gone down.

* Is there a way to set this timeout value manually, so that 
I don't have to wait too long?
 
  * Yes! You can manually set the link timeout using `SetLinkTimeout()`.

  **TIP:** If set to a value < 40 seconds, the default is 40 seconds.

* Why do we do this?	

  * In a TCP or UDP connection, resources are consumed when 
  we have to send out a probe checking the status of the link.
  * If we set a value of < 40 seconds, the battery is consumed 
  at an unsatisfactory rate.
  * A developer might wonder why the battery is draining when 
  no message is being sent. This is not AllJoyn-specific, 
  but the nature of the network transport.

* Are you using Bluetooth®?

  * `SetLinkTimeout` has no apparent effect because for Bluetooth, 
  sending probing signals does not consume measurably more resources 
  than maintaining the link. If the link is up, probing to establish 
  whether the link is still up does not consume as many resources 
  as it does in TCP.

* When to set a link timeout?

  * Setting a link timeout when you establish a session would be ideal.
  * If you are waiting for a `sessionMemberRemoved` to be 
  called for the peer that is no longer in the session because 
  it has moved out of range, you must wait at least 40 seconds 
  (or even longer) if you have specified a longer time. If the 
  peer had not gone out of the coverage area and had closed 
  down cleanly, you would not have to wait 40 seconds and 
  could have received the `sessionMemberRemoved` callback instantly.

## AllJoyn apps not detecting each other 

I have two or more devices/machines on which AllJoyn apps 
are running. I ran everything as instructed in the documentation. 
Why are my devices not seeing each other?

1. Is the AllJoyn daemon running on both devices?
2. Are all the devices connected to the same Wi-Fi network? 
If using Bluetooth, make sure the devices are within range 
of each other.
3. Does your Wi-Fi network block multicast packets? (This is 
false in most cases, but especially true in office environments.)
4. Are you advertising a correctly formed, well-known name? 
Well-known names can contain letters, numbers, underscores 
(_), and a dot (.)
5. Are you discovering a prefix or the correct name on the client side?
6. If steps 1 through 5 check out, and you are still unable 
to discover the service on a device, ping the other device.

## I installed the Java Android samples provided in the 
AllJoyn SDK, but they don't work on my device or emulator.

* The AllJoyn samples included in the SDK are built to 
run on devices or an emulator running Android version Gingerbread 
or above.

* An AllJoyn app running in an emulator cannot communicate 
with any other app outside the emulator. This is the way the 
emulator in Android is designed. It is not a restriction of 
the AllJoyn framework.

## ER_BUS_REPLY_IS_ERROR_MESSAGE and "Invalid busname" errors

I am trying to advertise a name over AllJoyn but it gives 
me ER_BUS_REPLY_IS_ERROR_MESSAGE and an error "Invalid busname."

The AllJoyn framewrok uses the DBus wire protocol and thus 
has predefined rules on how to form names. Follow these rules 
when choosing a name to be advertised:

* Bus names that start with a colon (':') character are unique 
connection names. Other bus names are called well-known bus names.
* Bus names comprise one or more element(s) separated by a 
period ('.') character. All elements must contain at least one character.
* Each element must contain only the ASCII characters "[A-Z][a-z][0-9]_-". 
Only elements that are part of a unique connection name may begin 
with a digit; elements in other bus names must not begin with a digit.
* Bus names must contain at least one '.' (period) character 
(and thus at least two elements).
* Bus names must not begin with a '.' (period) character.
* Bus names must not exceed the maximum name length.

The same rules apply when requesting a well-known name on the bus.

## Efficiently sending large amounts of data

The AllJoyn framework has three ways to send data across to a peer.

* Method calls

  Method calls suit short reply response interactions. 
  However, for something like transferring a file, the overhead 
  is greater for making a call and getting a response 
  than it is for signals.

* Signals

  Signals are unidirectional. A sender just places data in 
  the body of the signal and sends it. This is useful considering 
  the maximum amount of data one can send in an AllJoyn message 
  is 128 Kb. If the file size is smaller, any of the methods 
  to send data are fine. But, if the file size is greater, 
  a good practice is to break the data into chunks and send it using signals.

* Raw sockets
 
  Raw sockets is an evolving concept in the AllJoyn framework. 
  The idea is to obtain a raw socket to which you can write data, 
  and the peer can read it as it would from a regular socket. 
  When using Java bindings for AllJoyn, one thing to note is 
  that the raw Java socket returned by the AllJoyn framework 
  is a non-blocking socket, so one should avoid writing a large 
  amount of data rapidly on this socket. Sending 255 bytes 
  at a time is recommended.

## App hangs when using the AllJoyn framework

A few possibilities:

* The AllJoyn framework has both synchronous and asynchronous 
calls which means it can block on some calls. When we write 
an Android app, we typically have an activity class that 
handled the UI part. Doing an AllJoyn-related task in this 
main UI thread can lead to unpredictable wait periods where 
the app takes time to respond or does not update the UI components as expected.
* A highly recommended way while using the AllJoyn framework 
in your Android app is to do all AllJoyn-related activities 
in a separate thread; in the context of Android, this is 
typically a `BusHandler`. This assures that all of the AllJoyn-related 
activities do not interfere with any other component of the Android app.
 
## Multiple bus attachments in one application 

* A `BusAttachment` is a representation of the AllJoyn bus.
* Creating it is a heavy operation in terms of memory 
and other resources.
* Avoid creating multiple bus attachments unless there is a 
justification for doing so.
* A common guideline to follow is determining whether the 
types of functionalities provided by the AllJoyn piece in 
your app are distinct and unrelated. Suppose you have two 
completely different modules in your app that use the 
AllJoyn framework for totally unrelated things. In this case, 
consider creating a separate `BusAttachment`. It should, 
however, be avoided as much as possible due to the overhead 
in creating and maintaining its lifecycle in an app.

## Android emulator support

If you installed one instance of an AllJoyn app on an 
Android emulator and another instance on a physical 
device/different machine/host machine/any other supported 
platform, your apps will not be able communicate with each 
other.

In terms of networking, the Android emulator acts like a 
closed black box. It does not let you form TCP connections 
outside the emulator. The AllJoyn framework has few networking 
components like using multicast for discovering other devices 
that have the AllJoyn framewrok running on them. This, coupled 
with other restrictions on the emulator, make it impossible 
for an AllJoyn app to talk to anything outside the emulator. 
You can always have multiple instances of AllJoyn apps talking 
to each other inside the emulator, but not across the emulator.

## How to allow/disallow access to my session

The AllJoyn framework provides the ability to allow/disallow 
access to a session in the `AcceptSessionJoiner` callback. 
The only information you have at this time is the `sessionPort` 
and `joinerId`, the user's busId. If you require more checks 
in order to allow access, gather information out-of-band.

Two suggestions follow:

* Build a table based on nameOwnerChanged to correlate `busId` 
with a `wellKnownName`.
* Have a connect and accept on a different session, communicate 
information to determine who the user is, then join the session 
to which you want to allow access.
 
## Single auto-joining session

The AllJoyn framework has a unique guid that is associated 
with a `busAttachment`. A simple algorithm is to append onto 
the advertisements `"_"+ <busAttachment>.getGlobalGUIDString()`. 
Then, when you discover `wellKnownNames`, use a simple algorithm 
of highest (or lowest) GUID value and join that session. 
Now all app instances have a way to use a single multi-point session.

NOTE: If you build this type of system, keep in mind an edge case 
where devices are coming and going very frequently which means 
sessions are being joined/left very frequently. In this scenario, 
a single session that is auto-joined is not ideal. It's worth 
rethinking the application and providing a UI where users can 
select the sessions to join.

## AllJoyn Router Node Service on Windows 10

Windows 10 includes native support for AllJoyn 14.06. In the Windows
10 Technical Preview build, you can use the built-in AllJoyn router 
node service which means that your desktop applications don't need 
to bundle an AllJoyn router node, and you don't need to run a 
stand-alone router node application in order to run AllJoyn desktop 
applications.

In Windows 10 Technical Preview builds, the AllJoyn router node 
service(AJRouter.dll) must be started manually as follows from an 
elevated command prompt:
    net start ajrouter

If you need to stop the router node service, you can either reboot 
your PC, or execute the following command from an elevated command 
prompt:
    net stop ajrouter

More information about AllJoyn integration in Windows will be available 
in future releases of the AllSeen SDK for Windows.
