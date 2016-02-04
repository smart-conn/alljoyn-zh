# 配置接口定义

## 版本历史

若要查看此文档的历史版本，请点击下面的链接。

|版本号 | 日期 | 修改 |
|---|---|---|
| [14.02][config-14.02] | 2/28/2014 | 加入了 Config 接口第一版。|
| 14.06 | 6/30/2014 | 无更新 |
| 14.06 Update 1 | 9/29/2014 | <ul><li>更新了文档名与概览章节的标题 (将 Specification 改为 Definition)。</li><li>向文档标题添加了版本号，以便追踪版本。</li><li>在定义概览（Definition Overview）章节加入了针对 AllSeen Alliance Compliance and Certification 程序的 note.</li><li>为支持 AllSeen Alliance Compliance and Certification 程序而添加了一个方法与信号的强制列。</li><li>在 GetConfigurations 方法中添加了 configData 输出参数信息。</li></ul> |
| 14.12 | 12/17/2014 |作出整理工作，使方法和信号的要求更加清晰。 |

## 定义概览

此配置服务框架暴露指定设备的方法，例如重启和恢复出厂设置，设备密码，指定设备的可固化的属性，例如友好名称和默认语言。推荐的做法是 设备的 OEM 接管这项服务框架，并绑定到一个单独的应用程序（系统应用程序）。配置服务框架的单例实例的执行必须根据对配置服务框架的具体 使用，根据向 OEM 以及 应用程序开发者提供的明确指导来操作。

下图展示了设备主办的 AllJoyn&trade; 服务框架以及设备主办的 AllJoyn 客户端应用程序之间软件堆栈的关系。

![config-arch][config-arch]

**Figure:** AllJoyn 框架内的配置服务框架结构。

下图描述了配置服务框架以及在一设备包含多应用程序的场景中的 About 功能的功能范围。需要强调下列系统属性：

* 系统应用程序将配置服务框架绑定，并提供一个调用指定设备配置的远端机制。
* 一种可能的情况是，OEM 通过本地用户接口提供相同的（与配置服务框架暴露的功能相同的）功能。

**NOTE:** 所有的方法与信号都被认为强制支持 AllSeen Alliance Compliance and Certification 程序。

## 典型的呼叫流程

此章节着重描述了包含配置服务框架的呼叫流程。这些流程涉及了 AllJoyn 服务框架设备上的系统应用程序。

### 设备配置的改变

下图描述了一个呼叫流程的例子，在这里一个执行在 AllJoyn 客户端设备上的 AllJoyn 应用程序通过 announcement 发现配置服务框架，并进一步
执行了 Config 接口中声明的方法，以接收并更新配置数据。详细信息参见 [Config Interface][config-interface].

![config-device-config][config-device-config]

**Figure:** 设备配置改变的呼叫流程

### 恢复出厂设置

下图描述了一个呼叫流程的例子，在这里一个执行在 AllJoyn 客户端设备上的 AllJoyn 应用程序通过 announcement 发现配置服务框架，并
![config-device-factory-reset][config-device-factory-reset]

**Figure:** 设备恢复出厂设置的呼叫流程

### 错误处理

Config 接口中的方法调用使用 AllJoyn 错误消息处理功能 (ER_BUS_REPLY_IS_ERROR_MESSAGE) 设置错误名和错误消息。

| 错误名 | 错误消息 |
|---|---|
| `org.alljoyn.Error.InvalidValue` | 无效值 |
| `org.alljoyn.Error.FeatureNotAvailable` | 不可用的功能 |
| `org.alljoyn.Error.LanguageNotSupported` | 不支持指定的语言 |

## Config 接口

### 接口名

| 接口名| 版本 | 安全性 | 对象路径 |
|---|:---:|:---:|---|
| `org.alljoyn.Config` | 1 | yes | `/Config` |

### 属性

|属性名 | 签名 | 值列表 | 可读/可写 | 描述 |
|---|:---:|---|---|---|
| Version | `q` | 正整数 | 只读 | 接口的版本号 |

### 方法

以下方法由实现了`org.alljoyn.Config`接口的对象暴露。

#### `FactoryReset`

**消息参数**

无。

**回复参数**

无。

**描述**

知道设备与个人 AP 断开连接，清除之前的所有配置数据，并开启 softAP 模式。 
Directs the device to disconnect from the personal AP, clear all 
previously configured data, and start the softAP mode.

**错误回复**

| 错误 | 描述 |
|---|---|
| `org.alljoyn.Error.FeatureNotAvailable` | 设备不支持此功能时 AllJoyn 回复将返回此消息。 |

#### `SetPasscode('say')`

**Message arguments**

| 参数 | 参数名| 签名 | 值列表 | 描述 |
|:---:|---|:---:|---|---|
| 0 | `daemonRealm` | `s` | N/A | 用于安全访问，标识着守护进程 daemon 的身份，目前的配置服务框架忽略此参数。|
| 1 | `newPasscode` | `ay` | N/A | 安全的 Config 接口将要使用的密码。|

**回复参数**

无。

**描述**

更新被用于安全的 `org.alljoyn.Config` 接口的密码。在被 `SetPasscode` 重写前，默认密码是000000.

#### `a{sv} GetConfigurations('s')`

**消息参数**

| 参数 | 参数名| 签名 | 值列表 | 描述 |
|:---:|---|:---:|---|---|
| 0 | `languageTag` | `s` | 由 RFC 5646 指定的 IETF 语言标签。| 用于接收 Config 字段的语言标签。|

**回复参数**

| 参数 | 参数名| 签名 | 值列表 | 描述 |
|:---:|---|:---:|---|---|
| 0 | `configData` | `a{sv}` | N/A | 以字典的形式返回配置字段。关于默认的配置地图字段的细节，参阅 [Configuration map fields][config-map-fields] |

**描述**

返回所有在 Config 接口范围内声明的可配置的字段。如果未声明语言标签 (例如, ""), 则将会根据设备的默认语言返回配置字段。

##错误回复**

| 错误 | 描述 |
|---|---|
| `org.alljoyn.Error.LanguageNotSupported` | 在语言标签不被设备支持时返回。 |

#### `UpdateConfigurations('sa{sv}')`

**消息参数**

| 参数 | 参数名| 签名 | 值列表 | 描述 |
|:---:|---|:---:|---|---|
| 0 | `languageTag` | `s` | 由 RFC 5646 声明的 IETF 语言标签。 | 指示语言标签。 |
| 1 | `configMap` | `a{sv}` | 参见 [Configuration map fields][config-map-fields] | 被更新的配置集。|

**回复参数**

无。

**描述**

提供一个用于更新配置字段的机制。

**错误回复**

| 错误 | 描述 |
|---|---|
| `org.alljoyn.Error.InvalidValue` | 任意时间，在更新 configMap 中指定字段的值发生错误时返回。错误消息包含无效字段的字段名称。|
| `org.alljoyn.Error.LanguageNotSupported` | 设备不支持语言标签时返回。 |

#### `ResetConfigurations('sas')`

**消息参数s**

| 参数 | 参数名| 签名 | 值列表 | 描述 |
|:---:|---|:---:|---|---|
| 0 | `languageTag` | `s` | 由 RFC 5646 声明的 IETF 语言标签。 | 指示语言标签。|
| 1 | `fieldList` | `as` | N/A | 被重新发送的字段或者配置项目的列表。 |

**回复参数**

无。

**描述**

提供用于重置配置字段的值的机制（例如，值将被恢复为出厂默认值，但字段本身会被保留）。

**错误回复**

| 错误 | 描述 |
|---|---|
| `org.alljoyn.Error.InvalidValue` | 任何时间，当有与 fieldList相关的错误时返回此消息。包含无效字段的字段名。 |
| `org.alljoyn.Error.LanguageNotSupported` | 设备不支持语言标签时返回。 |

#### 配置 map 字段

下表列出了作为 configMap 参数字段一部分的已知的配置字段。OEN 或应用程序开发者可以添加额外字段。

| 字段名| 是否强制 | 是否本地化 | 签名 | 描述 |
|---|:---:|:---:|:---:|---|
| DefaultLanguage | yes | no | `s` | <p>设备支持的默认语言。由 RFC 5646 声明的 IETF 语言标签。</p><ul><li>如该参数未按照 RFC 设置，则会返回 `org.alljoyn.Error.InvalidValue` 错误。</li><li>如果设备不支持一个语言标签，则会返回 `org.alljoyn.Error.LanguageNotSupported` 错误。</li></ul><p>在此情景中，设备的默认语言不会改变流。</p> |
| DeviceName | no | yes | `s` | 用户分配的设备名。设备名会作为设备的友好名称出现在 UI 上。|

## 内省 XML

```xml
<node name="/Config" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xsi:noNamespaceSchemaLocation="http://www.allseenalliance.org/schemas/introspect.xsd">

   <interface name="org.alljoyn.Config">
      <property name="Version" type="q" access="read"/>
      <method name="FactoryReset">
         <annotation name="org.freedesktop.DBus.Method.NoReply" value="true"/>
      </method>
      <method name="Restart">
         <annotation name="org.freedesktop.DBus.Method.NoReply" value="true"/>
      </method>
      <method name="SetPasscode">
         <arg name="daemonRealm" type="s" direction="in"/>
         <arg name="newPasscode" type="ay" direction="in"/>
      </method>
      <method name="GetConfigurations">
         <arg name="languageTag" type="s" direction="in"/>
         <arg name="configData" type="a{sv}" direction="out"/>
      </method>
      <method name="UpdateConfigurations">
         <arg name="languageTag" type="s" direction="in"/>
         <arg name="configMap" type="a{sv}" direction="in"/>
      </method>
      <method name="ResetConfigurations">
         <arg name="languageTag" type="s" direction="in"/>
         <arg name="fieldList" type="as" direction="in"/>
      </method>
   </interface>
</node>
```


[config-14.02]: /learn/base-services/configuration/interface-14-02

[config-arch]: /files/learn/config-arch.png
[config-device-config]: /files/learn/config-device-config.png
[config-device-factory-reset]: /files/learn/config-device-factory-reset.png

[config-interface]: #config-interface
[config-map-fields]: #configuration-map-fields
