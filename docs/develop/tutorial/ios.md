# iOS Tutorial

## Overview

This content looks at the BasicService and BasicClient
sample in the SDK. This is a simple demonstration wherein
the client sends two strings to the service, the service
concatenates the strings sent by the client and returns a single string.

### Components Used to Write a Sample

The AllJoyn&trade; Objective-C bindings are based on the fact that
any AllJoyn Objective C-code that you write will hit the native AllJoyn library.

When you download the AllJoyn SDK for iOS and OS X,
the typical structure of the SDK and its components is followed:

* build
* alljoyn_objc
* services
* LICENSE
* README.txt
* README.md
* ReleaseNotes.txt

The following sections define each one of these directories and their role.

### build directory

If you were to build the AllJoyn source for Darwin (iOS/OS X)
by issuing a SCons command, the build directory is the build
output. The following directories are located under build:

* about-docs
* darwin
* docs

#### about-docs and docs directories

The about-docs and docs directories contain the API documentation
for the native library (C++) of the AllJoyn framework and the About feature.

#### darwin directory

Under the darwin directory you will find four folders: arm, armv7, armv7s and x86.

#### arm armv7 and armv7s directories

The arm folders contain the native libraries and header files
for running the AllJoyn code over the corresponding versions of iOS devices.

### alljoyn_objc directory

The alljoyn_objc directory contains most of the things relevant
to an iOS developer. The following sections define each item.

#### AllJoynCodeGenerator

The code generator tool is the best way to get started generating
the glue code that makes calls inside the native AllJoyn library.

#### AllJoynFramework

AllJoynFramework is the actual binding code that contains the
implementation of the publicly exposed Objective-C bindings.

#### AllJoynFramework_iOS

AllJoynFramework_iOS is the actual binding code like the
AllJoyn framework, but is more specific to iOS devices.

#### samples directory

The samples directory contains both iOS and OS X samples that
give you ideas for using the AllJoyn Objective-C bindings.

#### Test directory

The Test directory contains a few tests that can be used
to test the AllJoyn SDK.

### Overview of files in the samples

The following section is common to both BasicService and BasicClient.

We first need to understand a few of the common files that
are a part of the sample code. Not all files in an AllJoyn
iOS sample need to be written from scratch. We have a code
generator tool, which generates much of the glue code and
you end up writing very little actual AllJoyn code.
To create an AllJoyn Objective-C sample from scratch,
the best place to start is the [AllJoyn Programming Guide for the Objective-C Language][programming-guide-objective-c].
This document shows you how to make use of the code generator
to define the interface and in turn generate glue code that
makes a call in the native AllJoyn library. You do not have
to make calls in the native library yourself.

If we use the code generator for BasicService and BasicClient,
the code generated would be four files:

| File name | Description |
|---|---|
| BasicObject.h | This file shows you the interface implemented by the BusObject that you defined using the xml as input to the code generator. |
| BasicObject.m | This file has the Objective-C implementation of the BasicObject. |
| AJNBasicObject.h | The Objective-C implementation of a bus object needs to map to a C++ implementation that calls in the native AllJoyn library. The code gen tool does this for you and produces the header and source files for this mapping. You need not write the C++ code or bother about how is it done. |
| AJNBasicObject.mm | This file contains the implementation of C++ BusObject. In the sample, the C++ BusObject is called BasicObjectImpl. |

There are other files in the sample as listed below:

* **ViewController.h**: This is the View Controller header file
of this application.
* **ViewController.mm**: This contains the implementation of
the View Controller for this application.

## Walkthrough of BasicService

Developers who are not familiar with app development for the
iOS platform can refer to the Apple developer documentation,
which has a set of rich tutorials to understand how a typical
iOS app is structured. For ease of understanding, if you are new
to iOS development, an iOS app is structured based on MVC architecture,
which means that you will have the following:

* A **View**, which is your UI and since we use Xcode,
this corresponds to Storyboard.
* A **Controller**, which is your `ViewController.h` and `ViewController.mm`
in the case of our BasicService and BasicClient sample
* A **Model**, which are `BasicService.h` and `BasicService.mm`
in the case of BasicService and `BasicClient.h`; and `BasicClient.mm`
in the case of BasicClient

Let us look at it from the perspective of how an app is
loaded and what parts of the source code are called and what do they mean

When the BasicService app loads up, the viewDidLoad function in ViewController.mm
is called:

#### Code 1

```objc
- (void)viewDidLoad
{
   [super viewDidLoad];
self.basicService = [[BasicService alloc] init];
   self.basicService.delegate = self;
   [self.basicService startService];
}
```

Here, we instantiate BasicService which is the model and
then send a message to `startService`.

Before going further, it might be good to look at what is
inside BasicService.h since we are calling a method of `BasicService`.

#### Code 2

```objc
BasicService.h
@protocol BasicServiceDelegate <NSObject>
- (void)didReceiveStatusUpdateMessage:(NSString *)message;
@end
@interface BasicService : NSObject
@property (strong, nonatomic) id<BasicServiceDelegate> delegate;
- (void)startService;
@end
```

The first thing we notice is a `@protocol` called `BasicServiceDelegate`
with a method `didReceiveStatusUpdateMessage`. This is in place
so that the model can send a message to the view controller.
The protocol tells the model that the view controller will
have this method implemented.

The second thing is the interface `BasicService` which has a property
`id<BasicServiceDelegate>` delegate.

The `ViewController` sets itself as the delegate inside
`ViewController.m` so that the model, `BasicService`, can
send a message to the method `didReceiveStatusUpdateMessage`
of `ViewController` using the delegate property.

This is a common way for a model to call a method of a
`ViewController` in iOS. Now we turn back our attention to
`startService` in `BasicService`.

#### Code 3

```objc
- (void)startService
{
   dispatch_queue_t serviceQueue = dispatch_queue_create
("org.alljoyn.basic-service.serviceQueue", NULL);
   dispatch_async( serviceQueue, ^{
      [self run];
   });
}
```

Here we create a dispatch queue called "org.alljoyn.basic-service.serviceQueue"
and call the method `run`. Now let us look at the method `run`.

#### Code 4

```objc
[self.delegate didReceiveStatusUpdateMessage:[NSString
stringWithFormat:@"AllJoyn Library version: %@\n",
[AJNVersion versionInformation]]];

[self.delegate didReceiveStatusUpdateMessage:[NSString
stringWithFormat:@"AllJoyn Library build info: %@\n",
[AJNVersion buildInformation]]];
```

The first few lines of this method print out debugging
information. There are two calls that are interesting.

Notice we call `didReceiveStatusUpdateMessage` using the
delegate that we had declared in [Code 3][code-3].
This updates the text view of the app with the message
parameters that we send it. In the two calls above, we send
the AllJoyn library version and a build info string.

Next, we create a BusAttachment and assign it to the
property named `bus`, which we declared in `BasicService.h file`.
See [Code 5][code-5].

#### Code 5

```objc
self.bus = [[AJNBusAttachment alloc] initWithApplicationName:@"BasicService"
allowRemoteMessages:YES];
```

We then have a condition lock, which is in place so that only
thread executes the code that follows. We do not want to have
multiple threads trying to do AllJoyn things at the same time
for this sample.

#### Code 6

```objc
self.lostSessionCondition = [[NSCondition alloc] init];
[self.lostSessionCondition lock];
```

We then register the bus listener, which essentially has
callbacks that indicate if we found an advertised name,
lost a session, or a name owner changed condition

#### Code 7

```objc
[self.bus registerBusListener:self];
```

The code gen tool produces the implementation stub of
Bus Object which we can now instantiate in our Service code
with the line in [Code 8][code-8]:

#### Code 8

```objc
self.basicObject = [[BasicObject alloc] initWithBusAttachment:self.bus
onPath:kBasicServicePath];
```

After we have instantiated the Bus Object, we start the bus:

#### Code 9

```objc
status = [self.bus start];
if (ER_OK != status) {
      [self.delegate didReceiveStatusUpdateMessage:@"BusAttachment::Start
   failed\n"];
   NSLog(@"Bus start failed.");
}
```

We need to register the bus object that we had instantiated
above. We do so by calling [Code 10][code-10]:

#### Code 10

```objc
status = [self.bus registerBusObject:self.basicObject];
if (ER_OK != status) {
NSLog(@"ERROR: Could not register bus object");
}
```

We started the bus and now need to connect to it, which is done
by calling the `connectWithArguements` method. The arguments passed
to this method is a string "null:" which indicates the we connect
to the "null" transport. In the context of the AllJoyn framework,
this means we are connecting to the AllJoyn router which is a
part of this app. Some operating systems have the ability to
run a separate AllJoyn standalone router process, which the
app can connect to. Running a separate process is not possible
in iOS and not beneficial in many ways. We will leave that
discussion here since we are focusing on the sample.

#### Code 11

```objc
status = [self.bus connectWithArguments:@"null:"];
if (ER_OK != status) {
   NSLog(@"Bus connect failed.");
   [self.delegate didReceiveStatusUpdateMessage:@"Failed to connect to null:
transport"];
}
```

For an AllJoyn service we typically request a well-known name,
bind a session port to that well known name, and then advertise
that name so that others who are interested in talking to the
service find it and join our session.

We do these three things with the lines of code shown in [Code 12][code-12],
[Code 13][code-13], [Code 14][code-14], and [Code 15][code-15].

#### Code 12

```objc
status = [self.bus requestWellKnownName:kBasicServiceName
withFlags:kAJNBusNameFlagReplaceExisting | kAJNBusNameFlagDoNotQueue];
if (ER_OK != status) {
   NSLog(@"ERROR: Request for name failed (%@)", kBasicServiceName);
}
```

The parameter `kBasicServiceName` is the name that we request
from our bus. The name may or may not be available and also
depends on the flags that you pass in to the specifier `withFlags`:

In the case of this sample, we pass `kAJNBusNameFlagReplaceExisting | kAJNBusNameFlagDoNotQueue`
which tells the bus to replace the existing owner of the name
with this service instance and if the name is already taken by
someone do not queue this service waiting for the name to be released.

#### Code 13

```objc
//
// bind a session to a service port
//
   AJNSessionOptions *sessionOptions = [[AJNSessionOptions alloc]
initWithTrafficType:kAJNTrafficMessages supportsMultipoint:YES
proximity:kAJNProximityAny transportMask:kAJNTransportMaskAny];
```

Before calling `bindSessionPort`, we need to specify certain
things about the session, for example:

* What kind of traffic would this session be supporting?
* Would it be a single point or a multipoint session?
* Over which transports would this session be available?

These things are specified by using `AJNSessionOptions` as shown in [Code 13][code-13],
which we pass in to the call to `bindSesssionOnPort: withOptions: withDelegate:`
as shown in [Code 14][code-14].

#### Code 14

```objc
   status = [self.bus bindSessionOnPort:kBasicServicePort
withOptions:sessionOptions withDelegate:self];
   if (ER_OK != status) {
      NSLog(@"ERROR: Could not bind session on port (%d)", kBasicServicePort);
   }
```

Next, once we have bound a session to a port we advertise the
name so that peers, `BasicClient` in our case, can find the well-known
name and join this session. While advertising the name we specify
the well-known name and the transport over which we want this
name to be advertised.

#### Code 15

```objc
// advertise a name
//
status = [self.bus advertiseName:kBasicServiceName withTransportMask:kAJNTransportMaskAny];
if (ER_OK != status) {
NSLog(@"Could not advertise (%@)", kBasicServiceName);
}
```

After we are done advertising the name we wait for the clients
to connect to us. In our sample, we specify the time to wait
before cleaning up as 60 seconds . The `lostSession` condition waits
until it gets a signal, which is sent to it when the session
is lost. You see the signal being sent to this condition inside
of the `sessionWasLost:` callback which is a part of the `AJNSessionListener` interface.

#### Code 16

```objc
// wait until the client leaves before tearing down the service
// [self.lostSessionCondition waitUntilDate:[NSDate
dateWithTimeIntervalSinceNow:60]];
```

In the end, we perform cleanup by unregistering the bus object,
releasing the lock on the condition property and deallocating
the bus property by setting it to `nil`.

#### Code 17

```objc
[self.bus unregisterBusObject:self.basicObject];
[self.lostSessionCondition unlock];
self.bus = nil;
```

We have a several callback methods that are a part of three
different listeners. A brief description of each one grouped
by listener category is mentioned in the sections that follow.

### AJNBusListener methods

#### Code 18

```objc
(void)listenerDidRegisterWithBus:(AJNBusAttachment*)busAttachment
```

This is invoked when `registerBusListener` is completed
successfully and the bus notifies the application about it.

#### Code 19

```objc
(void)listenerDidUnregisterWithBus:(AJNBusAttachment*)busAttachment
```

This is invoked when the `BusListener` unregisters from the bus.

#### Code 20

```objc
(void)nameOwnerChanged:(NSString*)name to:(NSString*)newOwner
from:(NSString*)previousOwner
```

This is called when there is a change in the ownership of a name on the bus.
The name could be a unique name or a well-known name.

#### Code 21

```objc
(void)busWillStop
```

This is called when a `BusAttachment`, with which a listener
is registered, is stopping.

#### Code 22

```objc
(void)busDidDisconnect
```

This is called when a `BusAttachment`, with which this listener
is registered, has become disconnected from the bus.

### AJNSessionPortListener methods

Only the session host uses this category of listener since
it will not have any effect on the client side.

####Code 23

```objc
(BOOL)shouldAcceptSessionJoinerNamed:(NSString*)joiner
onSessionPort:(AJNSessionPort)sessionPort
withSessionOptions:(AJNSessionOptions*)options
```

This is one of the most important callback functions that
almost every service will have. When a peer initiates a
join session for the session hosted by a service this callback
is invoked so that the service may accept or reject the `join`
session request initiated by the client. It gives us the unique
name of the joiner who initiated the `join` session request,
the port of the session used and the session options that
the client wishes to use for the life of this session.

#### Code 24

```objc
(void)didJoin:(NSString*)joiner inSessionWithId:(AJNSessionId)sessionId
onSessionPort:(AJNSessionPort)sessionPort
```

If a service accepts a `join` session request sent by a client,
the client joins the session and the service is notified about
the successful joining of the client through this callback.
This means that the session is fully up and running.
It indicates the unique name of the joiner, the session id
that it is a part of and the session port which was used
for joining the session.

### AJNSessionListener methods

#### Code 25

```objc
- (void)sessionWasLost:(AJNSessionId)sessionId
```

The bus invokes this callback when an existing session
becomes disconnected and is no longer valid.

#### Code 26

```objc
- (void)didAddMemberNamed:(NSString*)memberName
toSession:(AJNSessionId)sessionId
```

This callback indicates that a member with unique name `memberName`
was added to the session with session id of the second argument.

#### Code 27

```objc
- (void)didRemoveMemberNamed:(NSString*)memberName
fromSession:(AJNSessionId)sessionId
```

This callback indicates that a member with unique name
`memberName` is no longer a part of the session with
session id having value `sessionId`.

This ends the description of code found under BasicService.

## Walkthrough of BasicClient

The BasicClient app starts with a button being displayed,
which says "Call Service". When the button is pressed,
the `didTouchCallServiceButton` method is called.

#### Code 28

```objc
- (IBAction)didTouchCallServiceButton:(id)sender
{
   self.basicClient = [[BasicClient alloc] init];
   self.basicClient.delegate = self; [self.basicClient sendHelloMessage];
}
```

Here, we instantiate `BasicClient` and call the `sendHelloMessage` method.

Before looking at the `sendHelloMessage`, it would be useful
to understand what is inside the `BasicClient.h` file

#### Code 29

```objc
@protocol BasicClientDelegate <NSObject>
- (void)didReceiveStatusUpdateMessage:(NSString *)message;
@end
@interface BasicClient : NSObject
@property (nonatomic, weak) NSObject<BasicClientDelegate> *delegate;
- (void)sendHelloMessage;
@end
```

The first thing we notice is a @protocol called `BasicCLientDelegate`
with a method `didReceiveStatusUpdateMessage`. This is in place
so that the model can send a message to the view controller.
The protocol tells the model that the view controller will
have this method implemented.

The second thing is the interface `BasicClient`, which has a
property `id<BasicClientDelegate>` delegate.

The `ViewController` sets itself as the delegate inside
`ViewController.m` so that the model, `BasicClient`, can
send a message to the method `didReceiveStatusUpdateMessage`
of `ViewController` using the delegate property.

This is a common way for a model to call a method of a
`ViewController` in iOS. Now we turn back our attention
to `sendHelloMessage` in `BasicClient`.

#### Code 30

```objc
- (void)sendHelloMessage
{
   dispatch_queue_t clientQueue =
dispatch_queue_create("org.alljoyn.basic-service.clientQueue",NULL);
   dispatch_async( clientQueue, ^{ [self run];
   });
}
```

The `sendHelloMessage` creates a dispatch queue and then
calls the `run` method from here.

Before we head in the `run` method, let's look at a few properties
that are defined inside of `BasicClient`.

* @property (nonatomic, strong ) AJNBusAttachment *bus

  Represents the bus attachment we use in the client code.

* @property ( nonatomic, strong) NSCondition *joinedSessionCondition

  NSCondition used to signal that we have joined a session
  after finding an advertised name.

* @property (nonatomic) AJNSessionId sessionId

  Used to hold the session id of the session that the client
  would become a part of.

* @property ( nonatomic, strong) NSString *foundServiceName

  Used to hold the well-known name of the service it found
  when it was looking for an advertised name.

* @property (nonatomic, strong) BasicObjectProxy *basicObjectProxy

  It is the proxy bus object, which will represent the bus
  object of Basic service.

* @property BOOL wasNameAlreadyFound

  Used to indicate if the name we are looking for was already found.

Now let us look at the run function. The first few lines are
debugging information printing out the AllJoyn library version
the build info string by calling the method `didReceiveStatusUpdateMessage`
that the `ViewController` should have implemented.

#### Code 31

```objc
NSLog(@"AllJoyn Library version: %@", AJNVersion.versionInformation);
   NSLog(@"AllJoyn Library build info: %@\n", AJNVersion.buildInformation);
   [self.delegate didReceiveStatusUpdateMessage:AJNVersion.versionInformation];

   [self.delegate didReceiveStatusUpdateMessage:AJNVersion.buildInformation];
//
// create the message bus
//
   self.bus = [[AJNBusAttachment alloc] initWithApplicationName:@"BasicClient"
allowRemoteMessages:YES]
```

Here, we created the bus attachment that will allow us to talk to the bus.
Next, we start the bus.

#### Code 32

```objc
status = [self.bus start];
```

Once we have started the bus, we connect to it. A short description
on why do we pass "null:" and what does it imply is mentioned
in BasicService section when we explain [Code 11][code-11].

#### Code 33

```objc
status = [self.bus connectWithArguments:@"null:"];
```

Next we use an NSCondition, which will be eventually
used to receive the indication that the session was joined.

#### Code 34

```objc
self.joinedSessionCondition = [[NSCondition alloc] init];
[self.joinedSessionCondition lock];
```

We register the bus listener, which is nothing but this instance of BasicClient.

#### Code 35

```objc
// register a bus listener in order to receive discovery notifications
//
[self.bus registerBusListener:self];
```

Next, we want to find the well-known name advertised by the BasicService.

### Code 36

```objc
// begin discovery of the well known name of the service to be called
// [self.bus findAdvertisedName:kBasicClientServiceName];
```

It is easier to understand the code from here on if we know
what happens when we find the exact name or the names that
have the prefix that we supplied to the method in [Code 36][code-36].
[Code 37][code-37] shows the callback that gets called.

#### Code 37

```objc
- (void)didFindAdvertisedName:(NSString*)name
withTransportMask:(AJNTransportMask)transport namePrefix:(NSString*)namePrefix
{
   NSLog(@"AJNBusListener::didFindAdvertisedName:%@ withTransportMask:%u
namePrefix:%@", name, transport, namePrefix);
      if ([namePrefix compare:kBasicClientServiceName] == NSOrderedSame) {

      BOOL shouldReturn;
      @synchronized(self) {
         shouldReturn = self.wasNameAlreadyFound;
         self.wasNameAlreadyFound = true;
      }

      if (shouldReturn) {
         NSLog(@"Already found an advertised name, ignoring this name
%@...", name);
         return;
      }

      // Since we are in a callback we must enable concurrent callbacks
before calling a synchronous method.
      //
      [self.bus enableConcurrentCallbacks];

      self.sessionId = [self.bus joinSessionWithName:name
onPort:kBasicClientServicePort withDelegate:self
options:[[AJNSessionOptions alloc] initWithTrafficType:kAJNTrafficMessages
supportsMultipoint:YES proximity:kAJNProximityAny transportMask:kAJNTransportMaskAny]];

      if (self.sessionId) {
         self.foundServiceName = name;

         NSLog(@"Client joined session %d", self.sessionId);
         [self.delegate didReceiveStatusUpdateMessage:[NSString
stringWithFormat:@"JoinSession SUCCESS (Session id=%d)\n", self.sessionId]];
      }
      else {
         [self.delegate didReceiveStatusUpdateMessage:@"JoinSession
failed\n"];
      }

      [self.joinedSessionCondition signal];
   }
}
```

Let's see what is happening in here. We first compare if the
name that we found is the same as what we were looking for or
has the name we were looking for as its prefix. If we have already
received the name, we return.

#### Code 38

```objc
   BOOL shouldReturn;
      @synchronized(self) {
         shouldReturn = self.wasNameAlreadyFound;
         self.wasNameAlreadyFound = true;
      }

      if (shouldReturn) {
         NSLog(@"Already found an advertised name, ignoring this name
%@...", name);
         return;
      }
```

Next, let us assume that we saw this name for the first time,
which means that we can join the session.

#### Code 39

```objc
// Since we are in a callback we must enable concurrent
callbacks before calling a synchronous method.
//
   [self.bus enableConcurrentCallbacks];
```

The call to `enableConcurrentCallbacks` is in place so that
we can make a synchronous call inside an asynchronous method.

#### Code 40

```objc
self.sessionId = [self.bus joinSessionWithName:name
onPort:kBasicClientServicePort withDelegate:self options:[[AJNSessionOptions alloc]
initWithTrafficType:kAJNTrafficMessages supportsMultipoint:YES
proximity:kAJNProximityAny transportMask:kAJNTransportMaskAny]];

      if (self.sessionId) {
         self.foundServiceName = name;

         NSLog(@"Client joined session %d", self.sessionId);

         [self.delegate didReceiveStatusUpdateMessage:[NSString
stringWithFormat:@"JoinSession SUCCESS (Session id=%d)\n", self.sessionId]];
      }
      else {
         [self.delegate didReceiveStatusUpdateMessage:@"JoinSession
failed\n"];
      }
```

Next, we called `joinSessionWithName`. The arguments here are:

* Name of the session we want to join
* Port on which the session host is listening
* A delegate class which will handle session related callbacks
* Options to specify session parameters
* Type of traffic that will go over the session
* Boolean indicating if the session we are joining is a
point-to-point or a multipoint session
* Proximity type
* Transport mask specifying the transport over which we want
to join this session

#### Code 41

```objc
[self.joinedSessionCondition signal];
```
And, in the end, we signal the `joinSessionCondition` so that
we can go ahead and make a method call on the service.

Going forward, in order to make a method call on the
`BasicService`, we first need to create a proxy bus object,
which will represent the Basic service object. Calling
introspect makes us aware of the interfaces it implements
so that we can make a correct method call.

The creation of proxy bus object requires the bus attachment,
name of the service for which we are creating the proxy
bus object, the object path of the remote object and the session id.

After creating the proxy bus object we need to know the
interfaces that it contains so that we can call the desired method.
For this purpose, we call the `introspectRemoteObject` method.

Finally, after introspecting the remote object we call the
method `concatenateString:withString:`.

If the method call goes through successfully, we should have
the concatenated value in the string "result".

#### Code 42

```objc
if ([self.joinedSessionCondition waitUntilDate:[NSDate
dateWithTimeIntervalSinceNow:60]]) {

      // once joined to a session, use a proxy object to make
the function call

//
      self.basicObjectProxy = [[BasicObjectProxy alloc]
initWithBusAttachment:self.bus serviceName:self.foundServiceName
objectPath:kBasicClientServicePath sessionId:self.sessionId];

      // get a description of the interfaces implemented by the
remote object before making the call
      //
      [self.basicObjectProxy introspectRemoteObject];

      // now make the function call
      //
      NSString *result = [self.basicObjectProxy concatenateString:@"Code "
withString:@"Monkies!!!!!!!"];

      if (result) {
         NSLog(@"[%@] %@ concatenated string.", result,
[result compare:@"Code Monkies!!!!!!!"] == NSOrderedSame ?
@"Successfully":@"Unsuccessfully");
         [self.delegate didReceiveStatusUpdateMessage:@"Successfully called

method on remote object!!!\n"];
      }

      self.basicObjectProxy = nil;

   }
   else {
      NSLog(@"Timed out while attempting to join a session with
BasicService...");
      [self.delegate didReceiveStatusUpdateMessage:@"Timed out while
attempting to join a session with BasicService..."];
   }
```

We looked at the flow the program when the user presses
the 'Call Service' button on the UI of BasicClient. There is
another button on the UI on BasicClient named 'Check Presence'.
Let us take a look at the flow for that:
objc
#### Code 43

```objc
- (void)sendPing
{
   dispatch_queue_t pingQueue =
dispatch_queue_create("org.alljoyn.basic-service.pingQueue",NULL);
   dispatch_async( pingQueue, ^{ [self ping];
   });
}
```

[Code 43][code-43] is identical to the behavior we saw when
we called the function run. Let us take a look at the function ping below.

#### Code 44

```objc
- (void)ping
{
   if objc(self.bus == NULL) {
      return;
   }
   QStatus status = [self.bus pingPeer:kBasicClientServiceName withTimeout:5];

   if (status == ER_OK) {
      [self.delegate didReceiveStatusUpdateMessage:@"Ping returned
Successfully"];
   } else {
      [self.delegate didReceiveStatusUpdateMessage:@"Ping Failed"];
   }
}
```

The function ping calls the public API pingPeer: withTimeout: inside AJNBusAttachment.
It passes the well-known name of the BasicService and the
timeout value that reflects how much time will the ping call
wait before returning. On successfully ping, the text section
on the UI should indicate that the ping call was successful.

This ends the description of BasicClient.

The two samples are in place to illustrate the most simplistic
manner in which AllJoyn Objective-C bindings can be used.
Using the AllJoyn framework, not only can you write apps
that run on separate devices and talk to each other, but you
can also write apps that communicate with each other on the
same AllJoyn-enabled device. Moreover, the AllJoyn cross-platform
support allows you to easily write your app for Android, Windows,
and other platforms without having to worry about the problems
that the AllJoyn framework solves.

The AllJoyn concepts that we discussed in this document remain
consistent when we move to a different platform like Android
so that the developer spends more time on his actual app rather
than worry about the peer-to-peer piece. This gives you the ability
to quickly write apps that work on different platforms and
talk to each other, which is a very important thing in today's
mobile application development ecosystem.

[programming-guide-objective-c]: /develop/api-guide/core/objc

[code-3]: #code-3
[code-5]: #code-5
[code-8]: #code-8
[code-10]: #code-10
[code-11]: #code-11
[code-12]: #code-12
[code-13]: #code-13
[code-14]: #code-14
[code-15]: #code-15
[code-36]: #code-36
[code-37]: #code-37
[code-43]: #code-43
