# About Feature Interface Definitions About功能接口定于

## Release History 发布历史

To access a previous version of this document, click the release version link below.
点击下方发行版本连接来获取该文档的历史版本。

|Release version | Date | What changed |
|---|---|---|
|[14.02][about-14.02] | 2/28/2014 | 首个 About 接口被加入|
|14.06 | 6/30/2014 | 无更新。 |
|14.06 Update 1 | 9/29/2014 | <ul><li>更新了文档标题和 Overview 的章节标题。(从规范改成定义)</li><li为了方便版本追踪，在文档标题中加入版本号。</li><li>Added a note in the Definition Overview chapter to address the AllSeen Alliance Compliance and Certification program.在Definition Overview中加入一个说明来提出 AllSeen Alliance Compliance Certification。</li><li>Added a Mandatory column for method and signal parameters to support the AllSeen Alliance Compliance and Certification program.添加一个强制列，用来存放支持AllSeen Alliance Compliance and Certification 程序的方法和信号参数</li></ul> |
|14.12 | 12/17/2014 | <ul><li>把 DeviceName 从要求改成了不要求</li><li>加入了一个指定 AppID 必须为 RFC 4122 中指定的 128－bit UUID 的验证</li><li>使对于方法和信号的要求更加明确</li><li>Icon interface was added. The icon interface has been part of AllJoyn&trade; and the About Feature since 14.02; however, the interface definition documentation was not added until 14.12.引入图标接口。图标接口已经是 AllJoyn&trade; 和 14.02 版本之后的 About 功能的一部分。然而，直到 14.12版本，它的接口定义文档才被加入。</li></ul> |

## Definition Overview

The About interface is to be implemented by an application 
on a target device. This interface allows the app to advertise 
itself so other apps can discover it. The following figure 
illustrates the relationship between a client app and a service app.
About 接口是由应用在目标设备上执行。此接口允许应用程序发出广播，使其他应用程序可以发现它。下图说明了客户端应用和服务应用之间的关系。

![about-arch][about-arch]

**Figure:** 在AllJoyn&trade; 架构内的 About 功能结构。

**NOTE:** All methods and signals are considered mandatory to 
support the AllSeen Alliance Compliance and Certification program. 
**注意:** 所有方法和信号都被认为强制支持AllSeen Alliance Compliance and Certification program. 
## Discovery 发现

A client can discover the app via an announcement which is a 
sessionless signal containing the basic app information like 
app name, device name, manufacturer, and model number. The 
announcement also contains the list of object paths and service 
framework interfaces to allow the client to determine whether 
the app provides functionality of interest.

In addition to the sessionless announcement, the About interface 
also provides the
on-demand method calls to retrieve all the available metadata 
about the app that are not published in the announcement.

## Discovery Call Flows

### Typical discovery flow

The following figure illustrates a typical call flow for a client 
to discover a service app. The client merely relies on the 
sessionless announcement to decide whether to connect to the 
service app to use its service framework offering.

![about-typical-discovery][about-typical-discovery]

**Figure:** Typical discovery flow (client discovers a service app)

### Nontypical discovery flow

The following figure illustrates a call flow for a client to 
discover a service app and make a request for more detailed information.

![about-nontypical-discovery][about-nontypical-discovery]

**Figure:** Nontypical discovery call flow

## Error Handling

The method calls in the About interface will use the AllJoyn 
error message handling feature (ER_BUS_REPLY_IS_ERROR_MESSAGE) 
to set the error name and error message.

| Error name | Error message |
|---|---|
| org.alljoyn.Error.LanguageNotSupported | The language specified is not supported |

## About Interface

| Interface name | Version | Secured | Object path |
|---|:---:|:---:|---|
| `org.alljoyn.About` | 1 | no | `/About` |

### Properties

|Property name | Signature | List of values | Read/Write | Description |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | Read Only | Interface version number |

### Methods

The following methods are exposed by a BusObject that implements 
the `org.alljoyn.About` interface.

#### `a{sv} GetAboutData('s')`

**Message arguments**

|Argument | Parameter name| Signature | List of values | Description |
|:---:|---|:---:|---|---|
| 0 | `languageTag` | `s` | IETF language tags specified by [RFC 5646](http://tools.ietf.org/html/rfc5646). | The desired language. |

**Reply arguments**

|Argument | Parameter name | Return signature | Description |
|:---:|---|:---:|---|
| 0 | `AboutData` | `a{sv}` | A dictionary of the available metadata fields. If language tag is not specified (i.e., ""), metadata fields based on default language are returned. |

**Error reply**

|Error | Description |
|---|---|
| `org.alljoyn.Error.LanguageNotSupported` | Returned if a language tag is not supported |

**Description**

Retrieve the list of available AboutData fields based on the language tag. see [About data interface fields][about-data-interface-fields]

##### About data interface fields

The following table lists the names of the metadata fields. 
The fields with a yes value in the Announced column will also 
be published via the Announce signal. See [Signals][signals] 
for more information.

| Field name| Mandatory | Announced | Localized | Signature | Description |
|---|:---:|:---:|:---:|:---:|---|
| `AppId` | yes | yes | no | `ay` | A 128-bit globally unique identifier for the application. The AppId shall be a universally unique identifier as specified in [RFC 4122](http://tools.ietf.org/html/rfc4122).|
| `DefaultLanguage` | yes | yes | no | `s` | The default language supported by the device. Specified as an IETF language tag listed in [RFC 5646](http://tools.ietf.org/html/rfc5646). |
| `DeviceName` | no | yes | yes | `s` | Name of the device set by platform-specific means (such as Linux and Android). |
| `DeviceId` | yes | yes | no | `s` | Device identifier set by platform-specific means. |
| `AppName` | yes | yes | yes | `s` | Application name assigned by the app manufacturer (developer or the OEM). |
| `Manufacturer` | yes | yes | yes | `s` | The manufacturer's name of the app. |
| `ModelNumber` | yes | yes | no | `s` | The app model number. |
| `SupportedLanguages` | yes | no | no | `as` | List of supported languages. |
| `Description` | yes | no | yes | `s` | Detailed description expressed in language tags as in [RFC 5646](http://tools.ietf.org/html/rfc5646). |
| `DateOfManufacture` | no | no | no | `s` | Date of manufacture using format YYYY-MM-DD (known as XML DateTime format). |
| `SoftwareVersion` | yes | no | no | `s` | Software version of the app. |
| `AJSoftwareVersion` | yes | no | no | `s` | Current version of the AllJoyn SDK used by the application. |
| `HardwareVersion` | no | no | no | `s` | Hardware version of the device on which the app is running. |
| `SupportUrl` | no | no | no | `s` | Support URL (populated by the manufacturer). |

#### `a(oas) GetObjectDescription()`

**Message arguments**

None.

**Reply arguments**

|Argument | Parameter name | Return signature | Description |
|:---:|---|:---:|---|
| 0 | `objectDescription` | `a(oas)` | Return the array of object paths and the list of supported interfaces provided by each object. |

**Description**

Retrieve the object paths and the list of all interfaces 
implemented by each of objects.

### Signals

The following signals are emitted by a BusObject that implements the
`org.alljoyn.About` interface.

#### `Announce('qqa(oas)a{sv}')`

Announce signal is a Sessionless signal

**Message arguments**

|Argument | Parameter name| Signature | List of values | Description |
|:---:|---|:---:|---|---|
| 0 | `version` | `q` | positive | Version number of the About interface. | 
| 1 | `port`    | `q` | positive | Session port the app will listen on incoming sessions. |
| 2 | `objectDescription` | `a(oas)` | Populated based on announced interfaces | Array of object paths and the list of supported interfaces provided by each object. |
| 3 | `aboutData` | `a{sv}` | array of key/value pairs | All the fields listed in [About data interface fields][about-data-interface-fields] with a yes value in the Announced column are provided in this signal. |

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

## Icon Interface

| Interface name | Version | Secured | Object path |
|---|:---:|:---:|---|
| `org.alljoyn.Icon` | 1 | no | `/About/DeviceIcon` |

### Properties

|Property name | Signature | List of values | Read/Write | Description |
|---|:---:|---|---|---|
| `Version` | `q` | Positive integers | Read Only | Interface version number |
| `MimeType` | `s` | The Mime type corresponding to the icon's binary content | Read Only | Mime type for the icon |
| `Size` | `u` | The size in bytes of the icons binary content | Read Only | Size of the Icon |


### Methods

The following methods are exposed by a BusObject that implements
the `org.alljoyn.Icon` interface.

#### `s GetUrl()`

**Message arguments**

None.

**Reply arguments**

|Argument | Parameter name | Return signature | Description |
|:---:|---|:---:|---|
| 0 | `url` | `s` | The URL if the icon is hosted on the cloud |

**Description**

Retrieve the URL of the icon if the icon is hosted on the cloud.

#### `ay GetContent()`

|Argument | Parameter name | Return signature | Description |
|:---:|---|:---:|---|
| 0 | `content` | `ay` | The binary content for the icon |

### Signals

None.

## AllJoyn Introspection XML

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
