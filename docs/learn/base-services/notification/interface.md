# 提醒接口定义

## 发布版本

如需访问此文档的历史版本，请点击表格中的链接。

|版本号| 日期 | 修改 |
|---|---|---|
| Pre-14.02 | N/A | 提醒接口版本第一版被加入 |
| [14.02][notification-14.02] | 2/28/2014 | <p>添加了如下接口</p><ul><li>Dismisser 接口第一版</li><li>Producer 接口第一版</li></ul> |
| 14.06 | 6/30/2014 | 无 |
| 14.06 更新1 | 9/29/2014 | <ul><li>更新了文档标题 (由“规范” (Specification) 变为“定义” (Definition))</li><li>在文档标题中加入了版本号以便查询</li><li>在概览( Overview ) 章节加入了用来处理 AllSeen Alliance Compliance and Certification 程序的便笺</li><li> 强制加入了支持 AllSeen Alliance Compliance and Certification 程序的方法和信号的参数列</li></ul> |
| 14.12 | 12/17/2014 | 清除了复杂的规范，使对方法和信号的要求更清晰。 |

## 定义概览

AllJoyn&trade; 提醒服务的框架是一个使得 AllJoyn 设备可以向其他 AllJoyn 设备发送通知的软件层发送。这些设备被分为两类：提供方和使用方。提供方
生产并发送提醒，但使用方只使用和显示这些提醒。终端用户的家庭网络（例如　Wi-Fi）可以连接到多个提供方，同时有多个使用者可以连接并使用这些消息。

提醒服务框架的设计支持文字提醒载荷，同时也有富提醒（图标及音频）。对于富媒体，提醒消息的载荷可以包括 URL 链接，或者是 AllJoyn 对象路径
引用到的富媒体。使用方应用程序收到提醒消息后将会根据对象路径或者提供方的设备来取出消息里的富媒体。

提醒服务框架使用了 AllJoyn 框架的非会话信号来传送提醒消息。提醒服务框架将 Notification Service API 暴露给应用程序开发者，以达到传送和接收提
醒消息的目的。设备制造商使用提醒服务框架的 Producer API 来发送提醒消息。提醒服务框架通过 AllJoyn 非会话信号传输机制来发送这些提醒消息，并使
这些消息对正在监听非会话信号的使用方设备有效。使用方在 AllJoyn 框架上运行提醒服务框架记录器，以接收提醒消息。针对使用方设备的应用程序开发者
则使用提醒服务框架上的 Consumer API 来注册并接收从任意通过 Wi-Fi 网络发送提醒的提供方发送的提醒。

**NOTE:** 所有方法和信号都被认为是强制支持 AllSeen Alliance Compliance and Certification 程序的。

### 结构

提醒服务框架实现了 Notification 接口，这是一个 over-the wire 的，将消息从提供方传送到使用方的接口。应用程序开发者通过提醒服务框架 API ( 提
供方和使用方) 来使用提醒服务框架。开发者不实现提醒接口。

下图展示了提醒服务框架 API 以及在提供方和使用方上的提醒接口。


![notification-arch][notification-arch]

**Figure:** 在 AllJoyn 框架内的提醒服务框架结构。

## 典型的消息流程

下图展示了一个典型的单个提供方应用程序生成一个提醒消息的提醒服务框架消息流程。此消息随后被两个在 AllJoyn 网络上的使用方应用程序所获取。


![notification-typical-call-flow][notification-typical-call-flow]

**Figure:** 典型的提醒消息服务框架消息流程

在提供方设备上的 AllJoyn 框架为提醒消息做一个非会话的信号广播。这将被使用方设备上的 AllJoyn 框架所接收到。AllJoyn 框架随后通过与提供方 AllJoyn 内核的单播会话提取该消息，并将其传送到使用方应用程序上。


## 

### 提醒消息

提醒消息包括消息类型和消息 TTL 在内的一系列字段。在发送提醒消息时，这些消息字段作为提醒服务框架提供方 API 的一部分，又提供方的应用程序指定
。

#### 消息类型和 TTL 字段

消息类型定义了提醒消息的类型（紧急，警告和消息）。提供方也可以同时发送多种类型的通知消息。消息 TTL 定理了提醒消息的有效期。在已定义的消息 TTL 时间内，提醒消息可以被使用方接收。

在提供方，有着同样消息类型的消息会彼此覆盖，因此在提醒被发送后连接到网络的使用方将仅会接收到每一个消息类型的最后一条消息。


#### 提醒消息行为

使用提醒服务框架可支持下列行为：

* 如果在 TTL 周期内有另一个同样消息类型的消息被提供方应用程序发送，新消息会覆盖现存消息。
* 如果使用方在 TTL 过期后连接到网络，他将不会收到消息。例如，一个作为使用方的手机正处于家庭网络上，这时终端使用者离开了家；使用方不再在家庭网络上。在该手机重新回到家庭网络，并且之前提醒的 TTL 已经过期的情况，手机将不会接收到任何提醒消息。

**NOTE:** 此值仅用于在提供方设备上指示消息有效性。TTL 字段不属于通过用户家庭网络发送的提醒消息正文数据。

有关提醒消息行为的具体用例和场景请参阅 [Notification Service Framework Use Cases][notification-use-cases].

#### 驳回提醒

提醒的驳回是已经接收到提醒的使用方的一种处理选项，目的是让提供方知晓此提醒已经被发送，并且没有必要继续发送。同时也会让其他使用方知道此消息可以从用户显示中移除。

当使用方试图驳回一个提醒时，服务框架使用在提醒中被发送的原有发送者字段来与提供方建立会话。

使用原有的发送者字段确保提醒会被实际提供方接收，而不是超级代理,这防止了使用方从超级代理接收提醒。

提供方随后会发出一个驳回非会话信号，通知在网络中的其他使用方此提醒已经被驳回。

如果无法到达生产方，使用方则会自己发出驳回非会话信号。

## 提醒接口

提醒接口设定后，当一个设备扫描网络时，他可以发现所有的提供方设备。

### 接口名

| 接口名 | 版本 | 是否安全 | 对象路径 |
|---|:---:|:---:|---|
| `org.alljoyn.Notification` | 1 | 是 | <ul><li>`/emergency`</li><li>`/warning`</li><li>`/info`</li></ul> |

### 属性

|属性名 | 签名 | 值类型 | 可读/可写 | 描述 |
|---|:---:|---|---|---|
| version | `q` | positive integer | 只读 | 接口版本号 |

### 方法

没有任何方法被暴露于此接口

### 信号

#### `notify('qiqssaysa{ss}a{iv}a(ss)')`

Notify 信号是非会话信号

**消息参数s**

|参数 | 参数名 | 签名 | 值类型 | 描述 |
|:---|---|:---:|---|---|
| 0 | `version` | `q` | positive | 提醒协议的版本 |
| 1 | `msgId` | `i` | positive | 由 Notification 服务框架分配给提醒消息的唯一标识 |
| 2 | `msgType` | `q` | integer | <p>提醒消息类型</p><ul><li>0 - 紧急</li><li>1 - 警告</li><li>2 - 通知</li></ul> |
| 3 | `deviceId` | `s` | positive | 给定支持 AllJoyn 设备的全局唯一识别码 |
| 4 | `deviceName` | `s` | positive | 给定支持 AllJoyn 设备的名字 |
| 5 | `AppId` | `ay` | positive | AllJoyn 应用程序的全局唯一标识 (GUID)  |
| 6 | `appName` | `s` | string | 给定支持 AllJoyn 的应用程序的名字 |
| 7 | `attributes` | `a{iv}` | positive | 配对的属性和值的集合。用于填充提醒消息正文中的选项字段。参见 [Attributes][attributes]. |
| 8 | `customAttributes` | `a{ss}` | positive | 配对的属性和值的集合。 设备制造商可用此向提醒消息添加设备制造商指定的字段。 |
| 9 | `langText` | `a{ss}` | string | 指定语言的提醒文字 |

** 描述**

AllJoyn 携带信号的提醒消息。

### 数据类型

| 名字 | 定义 | 签名 | 描述 |
|---|---|---|---|
| notificationMsg | version | short | 提醒协议版本|
| | msgId | integer | 由提醒服务框架发送给提醒消息的唯一识别符 |
| | msgType | short | <p>提醒消息的类型</p><ul><li>0 - 紧急</li><li>1 - 警告</li><li>2 - 通知</li></ul> |
| | deviceId | string | 给定支持 AllJoyn 设备的全局唯一识别码  |
| | deviceName | string | 给定支持 AllJoyn 设备的名字 |
| | appId | array of bytes | 给定支持 AllJoyn 的应用程序的全局唯一识别码 |
| | appName | string | 给定支持 AllJoyn 的应用程序名 |
| | List<langText> | attributes |配对的属性和值的集合。用于填充提醒消息正文中的选项字段。参见 [Attributes][attributes]. |
| | List<customAttributes> | customAttributes | 配对的属性和值的集合。设备制造商可用此向提醒消息添加设备制造商指定的字段。 |
| langText | langTag | string | 提醒消息文字的相关语言，根据 RFC 5646 设置。 |
| | text | string | 使用 UTF-8 编码的提醒消息文字 |
| attributes | attrName | string | 属性名 |
| | attrValue | variant | 属性值|
| customAttributes | attrName | string | 属性名 |
| | attrValue | variant | 属性值 |

**NOTE:** 如果 richIconUrl, richAudioUrl, richIconObjectPath, richAudioObjectPath, 或者 respObjectPath 字段已经被提供方应用程序声明，提醒
服务框架则根据属性字段中的属性来发送这些信息，参见 [Attributes][attributes].

### 属性

| 属性 | 值 | 
|---|---|
| Rich Notification Url | <ul><li>attrName=0</li><li>attrValue= </li><li>variant signature=s</li><li>value=&lt;Icon URL&gt;</li></ul> |
| Rich Notification Audio Url | <ul><li>attrName=1</li><li>attrValue= </li><li>variant signature=a{ss}</li><li>value=List&lt;langTag, Audio URL&gt;</li></ul> |
| Rich Notification Icon Object Path | <ul><li>attrName=2 </li><li>attrValue= (values detailed below)</li></ul> |
| Rich Notification Audio Object Path | <ul><li>attrName=3</li><li>attrValue= (values detailed below)</li></ul> |
| Response Object Path | <ul><li>attrName=4</li><li>attrValue= (values detailed below) </li></ul>|
| Original Sender | <ul><li>attrName=5</li><li>attrValue= (values detailed below) </li></ul> |

**attrValue 信息**

| 属性名 | 值 |
|---|---|
| Rich Notification Icon Object Path | <ul><li>variant signature=o</li><li>value=&lt;Rich notification icon object path&gt;</li></ul> |
| Rich Notification Audio Object Path | <ul><li>variant signature=o</li><li>value=&lt;Rich notification audio object path&gt;</li></ul> |
| Response Object Path | <ul><li>variant signature=o</li><li>value=&lt;Response object path>&gt;</li></ul> |
| Original Sender | <ul><li>variant signature=s</li><li>value=&lt;Producer bus name&gt;</li></ul> |

### 内省 XML

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

## 提供方接口

提供方提醒接口设定后，当一个设备扫描网络时，他可以发现所有的提供方设备。

### 接口名
| 接口名 | 版本 | 是否安全 | 对象路径 |
|---|:---:|:---:|---|
| `org.alljoyn.Notification.Producer` | 1 | 否 | `/notificationProducer` |

### 属性
|属性名 | 签名 | 值类型 | 可读/可写 | 描述 |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | 只读 | 接口版本号 |

### 方法

下列方法被暴露于实现 `org.alljoyn.Notification.Producer` 接口的对象

#### `Dismiss('i')`

**消息参数**

| 参数 | 参数名 | 类型 | 值列表 | 描述 |
|:---:|---|---|---|---|
| 0 | `msgId` | integer | N/A | 通知提供方一个提醒被驳回的一种方式。 |

**回复参数**

无。

**描述**

使用方请求提供方发送一个驳回信号，并停止推广指定的提醒。

### 内省 XML

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

## 驳回接口

Dismiss 非会话信号被发送到邻近域网络的使用方上，指示着一个提醒已经被驳回。

### 接口名
| 接口名 | 版本 | 是否安全 | 对象路径 |
|---|:---:|:---:|---|
| `org.alljoyn.Notification.Dismisser` | 1 | 否 | `/notification/Dismisser` |


### 属性

|属性名 | 签名 | 值类型 | 可读/可写 | 描述 |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | 只读 | 接口版本号 |

### 信号

#### `Dismiss('iay')`

Dismiss 信号是非会话信号。


**消息参数**

| 参数 | 参数名 | 类型 | 值列表 | 描述 |
|:---:|---|:---:|---|---|
| 0 | `msgId` | `i` | positive | |
| 1 | `appId` | `ay`| positive | |

**描述**

提醒使用方一个提醒已经被驳回

### 内省 XML

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

## 提醒服务框架用例

### 在 TTL 周期内和周期外连接上的设备

下图展示了两个使用方（电视和平板电脑）在 提醒消息 TTL 周期内完成连接，以及第三个使用方（智能手机）在 TTL 周期过后完成连接的场景。前两个使用
方可以收到提醒消息，而第三个使用方不能收到。

**NOTE:** AllJoyn 核心区指的是在各个提供方和使用方上的 AllJoyn 框架和功能的集合。

![notification-use-case-ttl-period][notification-use-case-ttl-period]

**Figure:** 在 TTL 周期内和周期外提醒消息的行为

### 根据消息类型不同对提醒消息的不同处理方式

下图展示了同类型的提醒消息如何相互覆盖，以及不同类型的提醒消息如何在 AllJoyn 框架上共同存在。

**NOTE:** AllJoyn 核心区指的是在各个提供方和使用方上的 AllJoyn 框架和功能的集合。

![notification-use-case-msg_handling][notification-use-case-msg_handling]

**Figure:** 根据不同的消息类型处理消息

### 在提供方在网络上时驳回提醒消息。

下图展示了使用方驳回一个提醒的流程，一直到此提醒被网络上的其他使用方接收。

![notification-use-case-dismissed-notification-producer][notification-use-case-dismissed-notification-producer]

**Figure:** 在提供方在网络上时驳回提醒消息


[notification-14.02]: /learn/base-services/notification/interface-14-02
[notificationt-latest]: /learn/base-services/notification/interface

[notification-arch]: /files/learn/notification-arch.png
[notification-typical-call-flow]: /files/learn/notification-typical-call-flow.png
[notification-use-case-ttl-period]: /files/learn/notification-use-case-ttl-period.png
[notification-use-case-msg_handling]: /files/learn/notification-use-case-msg-handling.png
[notification-use-case-dismissed-notification-producer]: /files/learn/notification-use-case-dismissed-notification-producer.png

[attributes]: #attributes
[notification-use-cases]: #notification-service-framework-use-cases


