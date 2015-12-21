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
The AllJoyn&trade; Notification Service 架构为设备／应用发送的可读文本提供了一套通用的显示或渲染机制。通知被广播在 AllJoyn 网络中，所有设备／应用都能够接收，它的持续时间根据通知的发出者设定的 TTL 决定。除了文本信息，也可以发送其他类型的数据，如音频、图像、控制面板对象或其他自定义属性；由接收者决定处理和渲染自定义属性的最好方式。另外，接受者可以全局拒收通知。

## Concepts and Terminology 概念和术语

### Producer and Consumer 生产者和消费者

Two roles exist: 两个角色：
* Producer. This is who sends the notification. 生产者。它发送通知。
* Consumer. This is who receives the notification.  消费者。它接收通知。

### Message Types 消息类型

Notifications can be one of three types: Info, Warning, and Emergency. Info
should be used most of the time. When appropriate, a Warning can be used to
draw more attention to the notification. Similary, Emergency can be used
prudently in situations when extreme attention is required.
通知可以属于以下三种类型：信息、警告、紧急。通常情况下，使用信息的方式发送。当情况合适时，可以用警告使通知获得更多关注。同样，在紧急情况发生时，可以谨慎地使用紧急方式。
### Time-to-live (TTL) 存活时间（TTL）

Each message is sent with a specific Time-to-live (TTL), in units of
milliseconds. The message will persist on the network until its TTL
expires. If a Consumer joins the network within the TTL, he will
receive the message.
发送的每一条信息都会伴随一个特定的 Time-to-live (TTL)，以毫秒为单位。消息会保持在网络中直到它的 TTL 超时。如果消费者在 TTL 之内加入了网络，它将能够收到消息。

Additionally, messages using the same Message Type overwrite one
another. So, at any given time, no more than 1 message from each of
the 3 Message Types can be valid for a given Producer. For example,
if a Producer sends an Info message 20 seconds after sending the
previous Info message that had a 100-second TTL, the new message will
overwrite the previous message. Consumers from this point forward
would only receive the new message and not the old message, even
though the TTL of the old message did not yet expire.
此外，使用相同类型的消息将会被覆盖。所以，在任意时间，生产者发送的同类型消息至多有一个生效。举例说明，如果生产者发送了一条信息类型的消息，并且在 20 秒之前它发送了一条 100 秒 TTL 的信息类型的程序。那么新的消息将会覆盖之前的消息。消费者只能接收到新的消息，尽管旧消息的 TTl 仍没有过期。
### Multiple Language Support 多语言支持

Like all AllJoyn services, Notification supports multiple languages. The
Producer sends the notification string in all supported lanugages. The
Consumer can use whatever supported language is most appropriate for
its needs.
如所有 AllJoyn 服务一样，通知服务支持多语言。生产者用所有支持的语言发送通知字符串。消费者可以根据需求选择最合适的语言。

### Dismiss 驳回

Dismissing notifications can occur in 3 ways: 有以下三种方式驳回通知：

1. A Consumer can dismiss the notification locally by
   removing the notification from its user interface so that its uses
   no longer see the notifications. This will have no bearing on if the notification is visibile by other Consumers on the network.
1. 消费者可以将通知移除它的用户接口，那么它的用户就不会收到通知，就达到了拒绝通知的目的。当这个通知可以被网络上的其它消费者收到时，那么此方法不适用。

2. Consumers or Producers, can send a signal to all
   Consumers on the network to dimiss. Consumers, upon receiving this
   signal, is expected to remove the notification from view.
2. 消费者或生产者，能够通过向所有网络中的消费者发送一个信息以拒绝通知。在收到此信号后，消费者预计将移除该通知。

3. A Consumer can tell the Producer to stop broadcasting the notification
   Subsequently, new Consumers will no longer receive the notification.
3. 消费者能够通知生产者停止广播通知。随后，新消费者将不会收到这个通知。
### Audio and Image 声音和图像

Notifications allows for attributes to be specified. This gives the
notification an extra dimension beyond just text. Most common attributes
are audio and image. The attribute can either be specified as a URL or as
an AllJoyn object path. If the URL is provided, the consumer can optionally
fetch the audio and/or image via the specified URL and render it locally as
appropriate.
通知允许指定类型。这为通知提供了超越文本的额外维度。最常见的类型是声音和图像。它们可以被指定为特定 URL 或者作为一个 AllJoyn 对象路径。如果提供了 URL，消费者可以选择通过指定的 URL 中提取的音频或图像并酌情在本地渲染。

### Control Panel Object Path 控制面板对象路径

A special attribute is the control panel object path. The producer fills
out this attribute to provide extra direction to the consumer. When the
consumer receives this notificaiton, if it supports the Control Panel service, it
is encouraged to fetch the control panel at the object path and render
it to the user. Typically this is done to allow the consumer to perform
an action associated with a notification.
控制面板对象路径是一个特殊的属性。生产者填写这个属性，为消费者提供了额外的指示。当消费者收到此通知，如果它支持控制面板服务，就可以从对象路径得到控制面板并提供给用户使用。通常这样做是为了使消费者能够执行与通知关联的操作。

An example is if the oven has been left on for some, in addition to
sending a notification, it can include a control panel to be rendered
to provide to the user the option of turning off the oven.
举例说明， 如果一个烤箱被留在某地，并且是打开的状态。它可以发送一个带有控制面板的通知，为用户提供一个可以将它关闭的选项。

### Custom Attributes 定制属性

A notification can contain any number of custom key/value pair attributes.
The Consumer can optionally use this information to display a richer
notification. Custom attributes are application-specific, so
the Consumer needs to have special informationa about the
Producer in order to properly use the custom attributes
通知能够包含任意数量的定制键／值对属性。消费者能够选择性地利用这些信息获得更多的通知。定制属性是针对应用程序的，所以消费者需要有关于生产者的特定信息，以适当地使用定制属性。

As an example, imagine a radio sent a notification every time a
new song was played. This notification contains the artist and
title as the notification text and a custom attribute for the
album art URL. A normal Consumer would receive the notification
and only display the notification text, that is, the artist and
title. But a Consumer that is aware of this Producer, could also
get the album art URL and display that along with the
notification text to provide a richer custom notificaiton.
举例说明，试想一个

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
