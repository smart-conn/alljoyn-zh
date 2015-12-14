# Notification API Guide

* [Java][notif-java]
* [C++][notif-cpp]
* [Objective-C][notif-objc]
* [C (Thin Core)][notif-c-thin]


## Best Practices

### Provide correct values when sending a notification

The Notification object that will be sent using the Notification
service framework allows for multiple values to be entered.
Specifically, the notification text can be provided in various
languages and string lengths.

#### Well-formed text string

It is *very* important that this string be a complete and
correct message that will be displayed on any Notification
Consumer application. The notification will support multiple
languages so that the correct language of the platform can
be used; this avoids translating strings to be displayed.
As such, it is important for the manufacturer of the software
running on the Notification Producer side to send the correct
translations for the languages that are supported.

#### Machine-to-machine use case

The notification text entries should never be used for any
other purpose than providing a human-readable message.
A notification message, by design, will be received and
shown by any application to convey a meaning relevant to the
sending device.

An application making use of the Notification service framework
should never assume that a specific application designed to be
the Notification Consumer side is the only instance in the
proximal network. Again, every message will travel to all
Nofication Consumer applications to be displayed.

### When to send an Emergency notification

A notification supports the following message types:

* Information
* Warning
* Emergency

Use the Emergency message type only when something very important
must be relayed to the consumer. For example, a notification
about a social media-related update should have a message type
of Information, while a notification about an appliance malfunction
or a security system being triggered warrants the message type of Emergency.

Since a notification trigger uses UDP multicast, resulting in
unreliable delivery, an Emergency notification should send
multiple times, possibly until it can be verified that a user
has received it and taken action.

**NOTE:** Use common sense when setting the message type. Consumers
should not receive numerous messages other than those specified
as an emergency notification. This is to avoid a person seeing
a message like "The sky is blue" 8 times when it does not
require an immediate action or response.

### What is the purpose of rich notification media?

Besides the text payload, a notification can contain an icon
and audio data. A television or other device with audio output
capabilities can leverage the Notification service framework
as a consumer. Audio content can contain a text-to-speech
version of the notification message text, thereby allowing
the end user to both view and hear the notification contents.
Another use case involves a consumer that does not have visual
display capabilities, such as a wireless speaker. In that case,
a notification can be audibly conveyed to the user. An icon
can be used to show some aspect of the notification, such as
the producer it was sent from, or the content it contains.
As an example, consider a coffee maker that sends a notification
when it is done brewing. An icon can be used to represent
the type of coffee that was selected, such as regular, strong, or decaf.

**NOTE:** The icon and audio data are not contained within the
actual notification. Instead, an AllJoyn&trade; object path is used
to obtain the icon or audio content that is sent as part of
the notification. See the Notification API Guide listed at
the top of this page for the platform you are targeting for
details on using this capability.

### Can I have more than 1 response action?

The current Notification service framework release supports
only one response action; however, this may change in future
updates. Notifications are informative and designed to be
nonintrusive to a user. If more actions are needed, the
response action should be to launch a separate application
that provides the user with more options and greater ability
to interact with the Producer application/device.

### How to use the TTL on a producer

The time to live (TTL) of a notification message defines the
validity period of the message. A notification message can
be received by a consumer that connects to the same network
as the producer that sent the message during the defined TTL
period. See the [Notification Interface Definition][notification-interface-definition]
for more information on this behavior and timelines of specific use cases.

As a general rule, the TTL for a notification should be set to correspond
with the type of information included in the notification. For example,
if the notification contains information that is no longer valid or
useful after 5 minutes, the TTL should be set to 5 minutes.

**NOTE:** The TTL is not sent as part of the actual notification
payload, and is instead used by the Notification service internally

### UI considerations

### How long to show the notification

The length of time to show a notification should be consistent
with the following criteria:

* Behavior of the platform/application the notification is
being displayed on
* Message type (Information, Warning, Emergency)
* Any preferences the user has set to view notifications.

For example, on an Android platform application, an Information
notification can be shown with a short Toast (overlay message
that is temporarily displayed), while a Warning notification
can be shown with a long Toast. Additionally, the display of
notifications can be integrated into the existing Android
Notification system to provide for a consistent user experience.
Refer to the NotificationServiceUISample application for example code.

#### How to handle a notification with response

A notification includes an optional field where the path of
an AllJoyn BusObject can be specified. This feature is used
with notifications where a response, such as a yes or no confirmation,
is associated with the notification and used to interact with the
producer that sent the notification. From a UI standpoint, the
notification should include a button whose onclick action will
invoke the method on the supplied BusObject path.

For example, the user can receive a notification from a smart
coffee maker that has been on for an hour and not used. The
notification can include text that gives the user the option
to turn off the coffee maker, and response options of yes
or no are presented to the user accompanying the notification
text. Clicking on "yes" would invoke an AllJoyn BusMethod on
the coffee machine to turn off the appliance; "no" would dismiss
the notification.

#### Handling first time notification from a new appliance

By definition, a notification is sent to all Consumer applications
connected to a network. Because the Consumer application is running
on a TV or other device that a user is constantly viewing, it is
important to filter the notifications on the appliance/device (consumer).

It is recommended that when the first notification is received
by a consumer from an appliance/device, a UI is presented to
the user prompting the user to configure the consumer application:

* How to receive notifications
* What priority of notifications should be shown

The UI should follow the example that is shown in the sample
applications contained with the Notification service framework.



[notif-java]: /develop/api-guide/notification/java
[notif-cpp]: /develop/api-guide/notification/cpp
[notif-objc]: /develop/api-guide/notification/objc
[notif-c-thin]: /develop/api-guide/notification/c-thin
[notification-interface-definition]: /learn/base-services/notification/interface
