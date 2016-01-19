# About功能接口定义

## 发布历史

点击下方发行版本连接来获取该文档的历史版本。

|版本号 | 日期 | What changed |
|---|---|---|
|[14.02][about-14.02] | 2/28/2014 | 首个 About 接口被加入|
|14.06 | 6/30/2014 | 无更新。 |
|14.06 Update 1 | 9/29/2014 | <ul><li>更新了文档标题和 Overview 的章节标题。(从规范改成定义)</li><li为了方便版本追踪，在文档标题中加入版本号。</li><li>在Definition Overview中加入一个说明来提出 AllSeen Alliance Compliance Certification。</li><li>添加一个强制列，用来存放支持AllSeen Alliance Compliance and Certification 程序的方法和信号参数</li></ul> |
|14.12 | 12/17/2014 | <ul><li>把 DeviceName 从要求改成了不要求</li><li>加入了一个指定 AppID 必须为 RFC 4122 中指定的 128－bit UUID 的验证</li><li>使对于方法和信号的要求更加明确</li><li>引入图标接口。图标接口已经是 AllJoyn&trade; 和 14.02 版本之后的 About 功能的一部分。然而，直到 14.12版本，它的接口定义文档才被加入。</li></ul> |

## Definition Overview

About 接口是由应用在目标设备上执行。此接口允许应用程序发出广播，使其他应用程序可以发现它。下图说明了客户端应用和服务应用之间的关系。

![about-arch][about-arch]

**Figure:** 在AllJoyn&trade; 架构内的 About 功能结构。

**NOTE:**  所有方法和信号都被认为强制支持AllSeen Alliance Compliance and Certification program. 

## 发现

客户端可以通过 annoucement 发现应用程序。annoucement 是一种包含了如应用名称，设备名称，制造商和型号的一种 sessionless signal。annoucement 也包含了对象路径和服务架构接口的列表，这些内容使得客户端能够确定应用程序是否提供了感兴趣的功能。


除了 sessionless announcement 之外，About 接口也提供了基于需求的方法调用，以检索程序的可用元数据。这些元数据不是在 annoucement 中公开发布的 sessionless annoucement。

## 发现流程

###  典型的发现流程

下图展示了客户端发现服务应用程序的典型 call flow。客户端仅仅依靠 sessionless announcemnt 就可以判断出是否连接某一服务应用程序并使用它所以提供的服务架构。

![about-typical-discovery][about-typical-discovery]

**图:** 典型发现流程 (客户端发现服务应用程序)

### 非典型发现流程

下图展示了客户端发现一个服务应用程序并且要求更多详细信息的流程。

![about-nontypical-discovery][about-nontypical-discovery]

**图:** 非典型流程

## 错误处理

About 接口中的方法调用需要用到 AllJoyn 错误处理功能 (ER_BUS_REPLY_IS_ERROR_MESSAGE) 来设置错误名称和错误信息。

| 错误名称 | 错误信息 |
|---|---|
| org.alljoyn.Error.LanguageNotSupported | 指定的语言不受支持 |

## About Interface About 接口

| 接口名称 | 版本 | 是否受保护 | 对象路径 |
|---|:---:|:---:|---|
| `org.alljoyn.About` | 1 | no | `/About` |

### Properties 属性

|属性名称 | 签名 | 有效值 | 读写权限 | 描述 |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | Read Only | 接口版本号 |

### Methods 方法

以下 methods 由提供 `org.alljoyn.About` 接口的 BusObject 发布。


#### `a{sv} GetAboutData('s')`

**Message 参数** 

|Argument | 参数名称 | 签名 | 有效值 | 描述 |
|:---:|---|:---:|---|---|
| 0 | `languageTag` | `s` | IETF language tags specified by [RFC 5646](http://tools.ietf.org/html/rfc5646). | 所需语言 |

**Reply 参数**

|Argument | Parameter name | Return signature | Description |
|:---:|---|:---:|---|
| 0 | `AboutData` | `a{sv}` | 可用的元数据字段的字典。如果不指定语言标签， (如, ""), 将返回基于默认语言的元数据字段。|

**Error 回复**

|Error | 描述 |
|---|---|
| `org.alljoyn.Error.LanguageNotSupported` | 在语言标签不被支持时返回 |

**Description** **描述**

基于语言标签检索 AboutData 可用的字段列表。参见 [About data interface fields][about-data-interface-fields]

##### 数据接口字段

下表列出了元数据字段的名称。在 Annouced 栏值为 yes 的字段，也会被 Announce 信号公开发布。具体信息参见 [信号][signals].

| 字段名称| 是否强制 | 是否本地化 | 签名 | 描述 |
|---|:---:|:---:|:---:|:---:|---|
| `AppId` | yes | yes | no | `ay` |应用程序的一种 128 位全局唯一标识符。AppId 是一个符合[RFC 4122](http://tools.ietf.org/html/rfc4122)规范的通用唯一标识符。|
| `DefaultLanguage` | yes | yes | no | `s` | 设备支持的默认语言。 指定为[RFC 5646](http://tools.ietf.org/html/rfc5646)列出的一种 IETF 语言标签|
| `DeviceName` | no | yes | yes | `s` | 特定平台设置的设备名称(例如 Linux 和 Android). |
| `DeviceId` | yes | yes | no | `s` | 特定平台设置的设备标识符|
| `AppName` | yes | yes | yes | `s` | 由应用程序制造商(开发者或 OEM)指定的应用程序名称|
| `Manufacturer` | yes | yes | yes | `s` | 应用制造商的名称|
| `ModelNumber` | yes | yes | no | `s` | 应用程序型号代码 |
| `SupportedLanguages` | yes | no | no | `as` | 支持的语言列表|
| `Description` | yes | no | yes | `s` | [RFC 5646](http://tools.ietf.org/html/rfc5646)中语言标签的详细描述。 |
| `DateOfManufacture` | no | no | no | `s` | 使用 YYYY-MM-DD（称为 XML 日期时间格式）格式的生产日期。|
| `SoftwareVersion` | yes | no | no | `s` | 应用程序的软件版本。|
| `AJSoftwareVersion` | yes | no | no | `s` | 目前应用程序使用的 AllJoyn SDK 版本。 |
| `HardwareVersion` | no | no | no | `s` | 运行应用程序的硬件设备版本。|
| `SupportUrl` | no | no | no | `s` | 支持 URL （由制造商填充）|

#### `a(oas) GetObjectDescription()`

**Message 参数**
None.

**Reply 参数**

|argument | 参数名 | 返回签名 | 描述 |
|:---:|---|:---:|---|
| 0 | `objectDescription` | `a(oas)` |  返回对象路径的列表和每个对象提供的支持接口列表。|

**描述**

检索对象路径和每个对象提供的接口列表。

### Signals 信号

The following signals are emitted by a BusObject that implements the
`org.alljoyn.About` interface.
以下 Signal 由提供 `org.alljoyn.About` 接口的 BusObject 发送。

#### `Announce('qqa(oas)a{sv}')`

Announce signal is a Sessionless signal
Announce signal 是 Sessionless signal。

**Message 参数** 

|Argument | 参数名| 签名 | 有效值 | 描述 |
|:---:|---|:---:|---|---|
| 0 | `version` | `q` | 正数 | About 接口的版本号。 | 
| 1 | `port`    | `q` | 正数 | 应用程序用来监听接入会话的会话端口|
| 2 | `objectDescription` | `a(oas)` | 基于 announced interfaces 填写 | 对象路径的列表和每个对象提供的支持接口的列表。 |
| 3 | `aboutData` | `a{sv}` | 键／值对的列表 | 在这个 signal 中提供所有[About data 接口数组][about-data-interface-fields]中 Announce 栏为 yes 的数组。|

## AllJoyn Introspection XML

```xml
<node name="/About" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="http://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.About">
      <property name="Version" type="q" access="read"/>
      <method name="GetAboutData">
         <arg name="languageTag" type="s" direction="in"/>
         <arg name="aboutData" type="a{sv}" direction="out"/>
      </method>
      <method name="GetObjectDescription">
         <arg name="objectDescription" type="a(oas)" direction="out"/>
      </method>
      <signal name="Announce">
         <arg name="version" type="q"/>
         <arg name="port" type="q"/>
         <arg name="objectDescription" type="a(oas)"/>
         <arg name="metaData" type="a{sv}"/>
      </signal>
   </interface>
</node>
```

## Icon 接口

| 接口名称 |版本 | 是否受保护 | 对象路径|
|---|:---:|:---:|---|
| `org.alljoyn.Icon` | 1 | no | `/About/DeviceIcon` |

### Properties

| 属性名称 |签名|值 | 描述 |
|---|:---:|---|---|---|
| `Version` | `q` | 正整数 | 只读 | 端口版本号 |
| `MimeType` | `s` | 对应图标的二进制内容的 Mime 类型 | 只读 | 图标的 Mime 类型 |
| `Size` | `u` | 图标二进制内容的大小（字节表示） | 只读 | 图标的大小｜


### Methods

以下 methods 由提供 `org.alljoyn.About` 接口的 BusObject 发布。

#### `s GetUrl()`

**Message 参数**

无。

**Reply 参数**

|Argument | 参数名称 | 返回签名| 描述 |
|:---:|---|:---:|---|
| 0 | `url` | `s` | 当图标保存在云上时的 URl。 |

**描述** 

检索当图标保存在云上时的 URL。

#### `ay GetContent()`

|Argument | 参数名| 返回签名 |描述|
|:---:|---|:---:|---|
| 0 | `content` | `ay` | 图标的二进制内容 |

### Signals

无。

## AllJoyn 内省 XML

```xml
<node name="/About/DeviceIcon"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="http://www.alljoyn.org/schemas/introspect.xsd">
    <interface name="org.alljoyn.Icon">
        <property name="Version" type="q" access="read"/>
        <property name="MimeType" type="s" access="read"/>
        <property name="Size" type="u" access="read"/>
        <method name="GetUrl">
            <arg type="s" direction="out"/>
        </method>
        <method name="GetContent">
            <arg type="ay" direction="out"/>
        </method>
    </interface>
</node>
```

[about-14.02]: /learn/core/about-announcement/interface-14-02

[about-arch]: /files/learn/about-arch.png
[about-typical-discovery]: /files/learn/about-typical-discovery.png
[about-nontypical-discovery]: /files/learn/about-nontypical-discovery.png

[about-data-interface-fields]: #about-data-interface-fields
[signals]: #signals
