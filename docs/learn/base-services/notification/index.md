# Notification

The AllJoyn&trade; Notification Service framework provides a common mechanism for
devices/apps to send human-readable text to be displayed or otherwise rendered
(e.g., text to speech can render the text as audio). Notifications are broadcasted
on the AllJoyn network for all devices/apps to receive, and persists for a
specified TTL defined by the producer of the notification. In addition to text,
other metadata like audio, images, control panel objects, or other custom
attributes can be sent; it is up to the receipient to determine the best
way to handle and render custom attributes. Also, Notifications can be
globally dismissed on all consumers.

## Concepts and Terminology

### Producer and Consumer

Two roles exist:
* Producer. This is who sends the notification.
* Consumer. This is who receives the notification.

### Message Types

Notifications can be one of three types: Info, Warning, and Emergency. Info
should be used most of the time. When appropriate, a Warning can be used to
draw more attention to the notification. Similary, Emergency can be used
prudently in situations when extreme attention is required.

### Time-to-live (TTL)

Each message is sent with a specific Time-to-live (TTL), in units of
milliseconds. The message will persist on the network until its TTL
expires. If a Consumer joins the network within the TTL, he will
receive the message.

Additionally, messages using the same Message Type overwrite one
another. So, at any given time, no more than 1 message from each of
the 3 Message Types can be valid for a given Producer. For example,
if a Producer sends an Info message 20 seconds after sending the
previous Info message that had a 100-second TTL, the new message will
overwrite the previous message. Consumers from this point forward
would only receive the new message and not the old message, even
though the TTL of the old message did not yet expire.

### Multiple Language Support

Like all AllJoyn services, Notification supports multiple languages. The
Producer sends the notification string in all supported lanugages. The
Consumer can use whatever supported language is most appropriate for
its needs.

### Dismiss

Dismissing notifications can occur in 3 ways:

1. A Consumer can dismiss the notification locally by
   removing the notification from its user interface so that its uses
   no longer see the notifications. This will have no bearing on if the notification is visibile by other Consumers on the network.

2. Consumers or Producers, can send a signal to all
   Consumers on the network to dimiss. Consumers, upon receiving this
   signal, is expected to remove the notification from view.

3. A Consumer can tell the Producer to stop broadcasting the notification
   Subsequently, new Consumers will no longer receive the notification.

### Audio and Image

Notifications allows for attributes to be specified. This gives the
notification an extra dimension beyond just text. Most common attributes
are audio and image. The attribute can either be specified as a URL or as
an AllJoyn object path. If the URL is provided, the consumer can optionally
fetch the audio and/or image via the specified URL and render it locally as
appropriate.

### Control Panel Object Path

A special attribute is the control panel object path. The producer fills
out this attribute to provide extra direction to the consumer. When the
consumer receives this notificaiton, if it supports the Control Panel service, it
is encouraged to fetch the control panel at the object path and render
it to the user. Typically this is done to allow the consumer to perform
an action associated with a notification.

An example is if the oven has been left on for some, in addition to
sending a notification, it can include a control panel to be rendered
to provide to the user the option of turning off the oven.

### Custom Attributes

A notification can contain any number of custom key/value pair attributes.
The Consumer can optionally use this information to display a richer
notification. Custom attributes are application-specific, so
the Consumer needs to have special informationa about the
Producer in order to properly use the custom attributes

As an example, imagine a radio sent a notification every time a
new song was played. This notification contains the artist and
title as the notification text and a custom attribute for the
album art URL. A normal Consumer would receive the notification
and only display the notification text, that is, the artist and
title. But a Consumer that is aware of this Producer, could also
get the album art URL and display that along with the
notification text to provide a richer custom notificaiton.

## How It Works

Under the hood, notifications are sent using AllJoyn Sessionless Signals.
Sessionless Signals provide everything that is needed to send and receive
the notification:

* A mechanism for a Producer to broadcast information to AllJoyn
  apps/devices on the AllJoyn network.

* A concept of a TTL.

* A mechanism for new Consumers to join the network to be informed
  of previously broadcasted notifications whose TTL had not expired.

The sessionless signal contains the full notification, including
all supported languages, and full metadata. Refer to the [Notification
Interface Definition][notif-interface] for more details on the specific
contents of the signal.

Dismissing notifications are also handled by sessionless signals.

In summary, this is how things work:

* A Producer sends a sessionless signal containing the notification.

* Consumers will receive this signal and display the notification.

* Consumers joining the network later will also receive this signal
  and display the information.

* When the TTL expires, the Procuder will stop broadcasting this
  sessionless signal. Consumers will stop displaying the notification

* At any time, a Producer or Consumer can send a sessionless signal
  to dismiss the notificaiton. Consumers, upon receiving this, will
  stop displaying the notification.

* A Consumer can connect to the Producer to request that the
  notification stop being broadcasted.

## Learn More

* [Learn more about the Notification Interface Definition][notif-interface]
* [Download the SDK][download], [build][build] and
  [run the sample apps][sample-apps]
* [Learn more about the APIs][api-guide]

[notif-interface]: /learn/base-services/notification/interface
[download]: https://allseenalliance.org/framework/download
[build]: /develop/building
[sample-apps]: /develop/run-sample-apps/notification
[api-guide]: /develop/api-guide/notification
