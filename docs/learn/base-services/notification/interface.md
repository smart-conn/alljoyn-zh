# 提醒接口定义

## 发布版本

如需访问此文档的历史版本，请点击下面的链接。

|版本号| 日期 | 修改 |
|---|---|---|
| Pre-14.02 | N/A | 提醒接口版本第一版被加入 |
| [14.02][notification-14.02] | 2/28/2014 | <p>添加了如下接口</p><ul><li>Dismisser 接口第一版</li><li>Producer 接口第一版</li></ul> |
| 14.06 | 6/30/2014 | 无 |
| 14.06 更新1 | 9/29/2014 | <ul><li>更新了文档标题 (由“规范” (Specification) 变为“定义” (Definition)</li><li>在文档标题中加入了版本号以便查询</li><li>在 Definition 的 Overview 章节加入了用来处理 AllSeen Alliance Compliance and Certification 项目的便笺</li><li>Added 强制加入了支持 AllSeen Alliance Compliance and Certification 项目的方法和信号的参数列</li></ul> |
| 14.12 | 12/17/2014 | 清除了复杂的规范，使对方法和信号的要求更清晰。 |

## Definition Overview

The AllJoyn&trade; Notification service framework is a software layer that 
enables AllJoyn devices to send notifications to other 
AllJoyn devices. These devices are categorized as producers 
and consumers. Producers produce and send notifications, while 
consumers consume and display these notifications. An end user's 
home (Wi-Fi) network can have multiple producers connected and 
generating notification messages, as well as multiple consumers 
connected and consuming these messages.

The Notification service framework design supports text 
notification payload as well as rich notification media 
(icon and audio). For rich media, the notification message 
payload can include URL links or AllJoyn object path references 
to rich notification media. The consumer app receiving the 
notification message will fetch the rich notification media 
from the object path or the producer device.

The Notification service framework uses the AllJoyn framework 
sessionless signal to deliver notification messages. The 
Notification service framework exposes the Notification Service 
API for application developers to deliver and receive notification 
messages. The device OEM uses the Notification service framework 
Producer API to send notification messages. The Notification 
service framework sends these notification messages over the 
AllJoyn sessionless signal transport mechanism and makes them 
available to consumer devices listening for sessionless signals. 
The consumer running the Notification service framework registers 
with the AllJoyn framework to receive notification messages. 
The application developer for the consumer device uses the 
Notification service framework Consumer API to register and 
receive notifications from any producer that is sending 
notification on the Wi-Fi network.

**NOTE:** All methods and signals are considered mandatory to 
support the AllSeen Alliance Compliance and Certification program. 

### Architecture

The Notification service framework implements the Notification 
interface which is the over-the-wire interface to deliver messages 
from producers to consumers. Application developers making use of 
the Notification service framework implement against the
Notification service framework APIs (producer and consumer side). 
They do not implement the Notification interface.

The following figure illustrates the Notification service 
framework API and Notification interface on producers and consumers.

![notification-arch][notification-arch]

**Figure:** Notification service framework architecture within the AllJoyn framework

## Typical call flow

The following figure illustrates a typical Notification service 
framework call flow with a single producer app generating a notification 
message. The message is then acquired by two consumer apps on the 
AllJoyn network.

![notification-typical-call-flow][notification-typical-call-flow]

**Figure:** Typical Notification service framework call flow

The AllJoyn framework on the producer device does a sessionless 
signal broadcast for the notification message. This is received 
by the AllJoyn framework on the consumer devices. The AllJoyn 
framework then fetches the notification message over unicast 
session from the producer AllJoyn core and delivers to the 
consumer application.

## Specification

### Notification messages

The notification message comprises a set of fields including 
message type and message TTL. These notification fields are 
specified by the producer app when sending notification message 
as part of Notification service framework Producer API.

#### Message type and TTL fields

The message type defines the type of notification messages 
(emergency, warning and information). Multiple types of 
notification messages can be sent at the same time by a producer. 
The message TTL defines the validity period of the notification message.
Notification messages can be received by consumers that connect 
during the defined message TTL value.

Messages with the same message type will overwrite each other 
on the producer, so a consumer that connects to the network 
after the notification was sent will receive only the last 
of each message type.

#### Notification message behavior

The following behavior is supported using the Notification 
service framework.

* If another notification message of the same message type 
is sent by a producer app within the TTL period, the new message 
overwrites the existing message.
* If a consumer connects to the network after the TTL period 
expires, that consumer will not receive the message. For example, 
when a consumer such as a mobile phone is on the home network 
and the end user leaves the home; the consumer is no longer on 
the home network. The mobile phone will not receive notification 
messages when it reacquires the home network and the TTL of 
those notifications have expired.

**NOTE:** The value is only used for message validity on the producer 
device. The TTL field is not sent as part of the notification 
message payload data over the end user's home network.

See [Notification Service Framework Use Cases][notification-use-cases] 
for use case scenarios related to notification message behavior.

#### Dismissing a notification

The dismiss notification is an option for consumers that have 
received the notification to let the producer know that this 
notification has been seen and there is no need to continue 
sending. It also lets other consumers know that the notification 
can be removed from the user display.

When a consumer attempts to dismiss a notification, the service 
framework creates a session with the producer using the original 
sender field sent in the notification.

Using the original sender field confirms that the notification 
is received by the actual producer and not the super agent in 
case the consumer received the notification from the super agent.

The producer will then send out a dismiss sessionless signal 
to notify the rest of the consumers in the network that this 
notification has been dismissed.

If the producer is not reachable, the consumer will send out 
the dismiss sessionless signal on its own.

## Notification Interface

The Notification interface is announced such that when a 
device scans the network, it can find all producer devices.

### Interface name

| Interface name | Version | Secured | Object path |
|---|:---:|:---:|---|
| `org.alljoyn.Notification` | 1 | yes | <ul><li>`/emergency`</li><li>`/warning`</li><li>`/info`</li></ul> |

### Properties

|Property name | Signature | List of values | Read/Write | Description |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | Read-only | Interface version number |

### Methods

No methods are exposed by this interface.

### Signals

#### `notify('qiqssaysa{ss}a{iv}a(ss)')`

Notify signal is a Sessionless signal.

**Message arguments**

|Argument | Parameter name | Signature | List of values | Description |
|:---|---|:---:|---|---|
| 0 | `version` | `q` | positive | Version of the Notification protocol. |
| 1 | `msgId` | `i` | positive | Unique identification assigned to the notification message by the Notification service framework. |
| 2 | `msgType` | `q` | integer | <p>Type of notification message.</p><ul><li>0 - Emergency</li><li>1 - Warning</li><li>2 - Information</li></ul> |
| 3 | `deviceId` | `s` | positive | Globally unique identifier for a given AllJoyn-enabled device. |
| 4 | `deviceName` | `s` | positive | Name for a given AllJoyn-enabled device. |
| 5 | `AppId` | `ay` | positive | Globally unique identifier (GUID) for a given AllJoyn application. |
| 6 | `appName` | `s` | string | Name for a given AllJoyn-enabled device. |
| 7 | `attributes` | `a{iv}` | positive | Set of attribute and value pair. This is used to hold optional fields in the notification message payload. See [Attributes][attributes]. |
| 8 | `customAttributes` | `a{ss}` | positive | Set of attribute and value pair. This can be used by the OEMs to add OEM-specific fields to the notification message. |
| 9 | `langText` | `a{ss}` | string | Language-specific notification text. |

** Description**

AllJoyn signal-carrying notification message.

### Data types

| Name | Definition | Signature | Description |
|---|---|---|---|
| notificationMsg | version | short | Version of the Notification protocol. |
| | msgId | integer | Unique identification assigned to the notification message by the Notification service framework. |
| | msgType | short | <p>Type of notification message.</p><ul><li>0 - Emergency</li><li>1 - Warning</li><li>2 - Information</li></ul> |
| | deviceId | string | Globally unique identifier for a given AllJoyn-enabled device. |
| | deviceName | string | Name for a given AllJoyn-enabled device. |
| | appId | array of bytes | Globally unique identifier for a given AllJoyn application. |
| | appName | string | Name for a given AllJoyn-enabled device. |
| | List<langText> | attributes | Set of attribute and value pair. This is used to hold optional fields in the notification message payload. See [Attributes][attributes]. |
| | List<customAttributes> | customAttributes | Set of attribute and value pair. This can be used by the OEMs to add OEM-specific fields to the notification message. |
| langText | langTag | string | Language associated with the notification text. This is set as per RFC 5646. |
| | text | string | Notification message text in UTF-8 character encoding. |
| attributes | attrName | string | Name of the attribute. |
| | attrValue | variant | Value of the attribute. |
| customAttributes | attrName | string | Name of the attribute. |
| | attrValue | variant | Value of the attribute. |

**NOTE:** If the richIconUrl, richAudioUrl, richIconObjectPath, 
richAudioObjectPath, or respObjectPath fields were specified 
by the producer app for a notification message, the Notification 
service framework sends this information as attributes in the 
attributes field, as per [Attributes][attributes].

### Attributes

| Attribute| Values | 
|---|---|
| Rich Notification Url | <ul><li>attrName=0</li><li>attrValue= </li><li>variant signature=s</li><li>value=&lt;Icon URL&gt;</li></ul> |
| Rich Notification Audio Url | <ul><li>attrName=1</li><li>attrValue= </li><li>variant signature=a{ss}</li><li>value=List&lt;langTag, Audio URL&gt;</li></ul> |
| Rich Notification Icon Object Path | <ul><li>attrName=2 </li><li>attrValue= (values detailed below)</li></ul> |
| Rich Notification Audio Object Path | <ul><li>attrName=3</li><li>attrValue= (values detailed below)</li></ul> |
| Response Object Path | <ul><li>attrName=4</li><li>attrValue= (values detailed below) </li></ul>|
| Original Sender | <ul><li>attrName=5</li><li>attrValue= (values detailed below) </li></ul> |

**attrValue information**

| Attribute name | Values |
|---|---|
| Rich Notification Icon Object Path | <ul><li>variant signature=o</li><li>value=&lt;Rich notification icon object path&gt;</li></ul> |
| Rich Notification Audio Object Path | <ul><li>variant signature=o</li><li>value=&lt;Rich notification audio object path&gt;</li></ul> |
| Response Object Path | <ul><li>variant signature=o</li><li>value=&lt;Response object path>&gt;</li></ul> |
| Original Sender | <ul><li>variant signature=s</li><li>value=&lt;Producer bus name&gt;</li></ul> |

### Introspection XML

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<node xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <interface name="org.alljoyn.Notification">
      <property name="Version" type="q" access="read"/>
      <signal name="notify">
         <arg name="version" type="q"/>
         <arg name="msgId" type="i"/>
         <arg name="msgType" type="q"/>
         <arg name="deviceId" type="s"/>
         <arg name="deviceName" type="s"/>
         <arg name="appId" type="ay"/>
         <arg name="appName" type="s"/>
         <arg name="attributes" type="a{iv}"/>
         <arg name="customAttributes" type="a{ss}"/>
         <arg name="langText" type="a(ss)"/>
      </signal>
   </interface>
</node>
```

## Producer Interface

The Notification Producer interface is announced such that, 
when a device scans the network, it can find all producer devices.

### Interface name

| Interface name | Version | Secured | Object path |
|---|:---:|:---:|---|
| `org.alljoyn.Notification.Producer` | 1 | no | `/notificationProducer` |

### Properties

|Property name | Signature | List of values | Read/Write | Description |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | Read-only | Interface version number |

### Methods

The following methods are exposed by the object that implements 
the `org.alljoyn.Notification.Producer` interface.

#### `Dismiss('i')`

**Message arguments**

| Argument | Parameter name| Signature | List of values | Description |
|:---:|---|---|---|---|
| 0 | `msgId` | integer | N/A | A way to notify the producer that a notification was dismissed. |

**Reply arguments**

None.

**Description**

The consumer asks the producer to send a dismiss signal and 
stop advertising a given notification.

### Introspection XML

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<node xsi:noNamespaceSchemaLocation="https://www.alljoyn.org/schemas/introspect.xsd"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <interface name="org.alljoyn.Notification.Producer">
      <method name="Dismiss">
         <arg name="msgId" type="i" direction="in"/>
      </method>
      <property name="Version" type="q" access="read"/>
   </interface>
</node>
```

## Dismisser Interface

The Dismiss sessionless signals are sent to notify other 
consumers on the proximal network that a notification has 
been dismissed.

### Interface name

| Interface name | Version | Secured | Object path |
|---|:---:|:---:|---|
| `org.alljoyn.Notification.Dismisser` | 1 | no | `/notification/Dismisser` |

### Properties

|Property name | Signature | List of values | Read/Write | Description |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | Read-only | Interface version number |

### Signals

#### `Dismiss('iay')`

Dismiss signal is a Sessionless signal.

**Message arguments**

| Argument | Parameter name | Signature | List of values | Description |
|:---:|---|:---:|---|---|
| 0 | `msgId` | `i` | positive | |
| 1 | `appId` | `ay`| positive | |

**Description**

Notifies consumers that the notification has been dismissed.

### Introspect XML

```
<?xml version="1.0" encoding="UTF-8" ?>
<node xsi:noNamespaceSchemaLocation="https://www.alljoyn.org/schemas/introspect.xsd"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <interface name="org.alljoyn.Notification.Dismisser">
      <signal name="Dismiss">
         <arg name="msgId" type="i" direction="in"/>
         <arg name="appId" type="ay" direction="in"/>
      </signal>
      <property name="Version" type="q" access="read"/>
   </interface>
</node>
```

## Notification Service Framework Use Cases

### Device connecting within and outside the TTL period

The following figure illustrates two consumers (television and 
tablet) connecting within the notification message TTL period 
and a third consumer (smartphone) connecting after the TTL period. 
The first two consumers receive the notification message, the 
third consumer does not.

**NOTE:** The AllJoyn core block represents the collective AllJoyn 
framework functionality on various producers and consumers.

![notification-use-case-ttl-period][notification-use-case-ttl-period]

**Figure:** Notification message behavior within and outside the TTL period

### Notification message handling based on message types

The following figure illustrates how a notification message 
overwrites a notification message of the same type, and how 
notification messages of different types can coexist using 
the AllJoyn framework.

**NOTE:** The AllJoyn core block represents the collective AllJoyn 
framework functionality on various producers and consumers.

![notification-use-case-msg_handling][notification-use-case-msg_handling]

**Figure:** Notification message handling based on message type

### Notifications dismissed when producer is on network

The following figure illustrates the flow of dismissing a 
notification from the consumer until it is received by other 
consumers on the network.

![notification-use-case-dismissed-notification-producer][notification-use-case-dismissed-notification-producer]

**Figure:** Notifications that are dismissed when the producer is on the network


[notification-14.02]: /learn/base-services/notification/interface-14-02
[notificationt-latest]: /learn/base-services/notification/interface

[notification-arch]: /files/learn/notification-arch.png
[notification-typical-call-flow]: /files/learn/notification-typical-call-flow.png
[notification-use-case-ttl-period]: /files/learn/notification-use-case-ttl-period.png
[notification-use-case-msg_handling]: /files/learn/notification-use-case-msg-handling.png
[notification-use-case-dismissed-notification-producer]: /files/learn/notification-use-case-dismissed-notification-producer.png

[attributes]: #attributes
[notification-use-cases]: #notification-service-framework-use-cases


