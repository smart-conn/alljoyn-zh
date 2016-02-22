# Onboarding 接口定义

## 发布历史

若要查看此文档的历史版本，请点击下面的链接。

|版本号 | 日期 | 修改 |
|---|---|---|
| [14.02][onboarding-14.02] | 2/28/2014 | 加入了 Onboarding 接口第一版。|
| 14.06 | 6/30/2014 | 无更新 |
|14.06 Update 1 | 9/29/2014 | <ul><li>更新了文档名与概览章节的标题 (将 Specification 改为 Definition)</li><li>向文档标题添加了版本号，以便追踪版本。</li><li>在定义概览（Definition Overview） 章节加入了针对 AllSeen Alliance Compliance and Certification 程序的 note.</li><li>为支持 AllSeen Alliance Compliance and Certification 程序而添加了一个方法与信号的强制列。</li></ul> |
| 14.12 | 12/17/2014 | 作出整理工作，使方法和信号的要求更加清晰。|

## 定义概览

Onboarding 接口是通过一个应用程序在目标设备上实现的，目标设备被称为一个 onboardee. 典型的 onboardee 是 AllJoyn&trade; 精简客户端设
备。此接口允许 onboarder 向 onboardee 发送 Wi-Fi 证书，允许其加入个人接入点。

![onboarding-arch][onboarding-arch]

**Figure:** AllJoyn 框架内的 Onboarding 服务框架结构

**NOTE:** 所有的方法与信号都被认为强制支持 AllSeen Alliance Compliance and Certification 程序。

## Onboarding 呼叫流程

### 使用 Android onboarder 的 Onboarding 呼叫流程

下图展示了一个使用 Android 进行 onboarding 的流程图。

![onboarding-android-onboarder][onboarding-android-onboarder]

**Figure:** 使用 Android 设备进行 onboarding 

### 使用 iOS onboarder 的 Onboarding 呼叫流程

下图展示了一个使用 iOS onboarder 进行 onboarding 的流程图。


![onboarding-ios-onboarder][onboarding-ios-onboarder]

**Figure:** 使用 iOS 设备进行 onboarding 

## 错误处理

在 Onboarding 接口中的方法调用使用了 AllJoyn 错误消息处理功能（ER_BUS_REPLY_IS_ERROR_MESSAGE）来设置错误名与错误消息。

| 错误名 | 错误消息 |
|---|---|
| `org.alljoyn.Error.OutOfRange` | 值超出范围 |
| `org.alljoyn.Error.InvalidValue` | 无效值 |
| `org.alljoyn.Error.FeatureNotAvailable` | 不可用的功能 |

## Onboarding 接口

### 接口名

| 接口名 | 版本 | 安全性 | 对象路径 |
|---|:---:|:---:|---|
| `org.alljoyn.Onboarding` | 1 | 安全 | `/Onboarding` |

### 属性

|属性名 | 签名 | 值列表 | 可读/可写 | 描述 |
|---|:---:|---|---|---|
| 版本 | `q` | 正整数 | 只读 | 接口版本号 |
| 状态 | `n` | <ul><li>0 - 个人 AP 未配置</li><li>1 - 个人 AP 已配置/无效</li><li>2 - 个人 AP 已配置/正在验证</li><li>3 - 个人 AP 已配置/有效</li><li>4 - 个人 AP 已配置/有错误</li><li>5 - 个人 AP 已配置/重试</li><ul> | 只读 | 配置状态 |
|LastError| `ns` | <ul><li>0 - 有效</li><li>1 - 不可达</li><li>2 - Unsupported_protocol</li><li>3 - 未验证</li><li>4 - Error_message</li></ul> | 只读 | 最后一个错误代码和错误消息。 Error_message 是从底层 Wi-Fi 层接收到的错误消息。|

### 方法

下列方法由一个实现 Onboarding 接口的 BusObject 暴露。

#### `n ConfigWifi('ssn')`

**Message arguments**

| 参数 | 参数名| 签名 | 值列表 | 描述 |
|:---:|---|:---:|---|---|---|
| 0 | `SSID` | `s` | N/A | 接入点的 SSID |
| 1 | `passphrase` | `s` | N/A | 十六进制的接入点密码 |
| 2 | `authType` | `n` | <ul><li>-3 - WPA2_AUTO</li><li>-2 - WPA_AUTO</li><li>-1 - Any</li><li>0 - Open</li><li>1 - WEP</li><li>2 - WPA_TKIP</li><li>3 - WPA_CCMP</li><li>4 - WPA2_TKIP</li><li>5 - WPA2_CCMP</li><li>6 - WPS</li></ul> | <p>验证类型</p><ul><li>当设置为 any 时, onboardee 必须尝试使用自己支持的所有验证类型连接到 AP.</li><li>当设置为 -3 或 -2 时 (WPA2_AUTO 或 WPA_AUTO), onboardee 使用 TKIP 暗语，AES-CCMP 暗语连接到 AP.</li><li>WPA_TKIP 指应用 TKIP 暗语的 WPA.</li><li>WPA2_CCMP 指应用 AES-CCMP 暗语的 WPA2.</li><li>如果此值无效，AllJoyn 错误 `org.alljoyn.Error.OutOfRange` 将会被返回。 </li></ul> |

**回复参数**

| 参数 | 参数名 | 返回签名 | 值列表 | 描述 |
|:---:|---|:---:|---|---|
| 0 | `status` | `n` | <p>连接结果状态的可能值为：</p><ul><li>1 - 现存的 SoftAP 模式将在收到 Connect 后被禁用。在这种情况下，Onboarder 应用程序必须等待设备连接到个人 AP，并请求 State and LastError 属性.</li><li>2 - 用于验证个人 AP 连接的并行步骤。 在这种情况下，Onboarder 应用程序必须等待通过 SoftAP 链路建立的 AllJoyn 会话传送来的 ConnectionResult 信号的到来。</li></ul>|

**描述**

向 onboardee 发送个人 AP 的信息。当 authType = -1 (any) 时，onboardee 必须尝试自己支持的所有认证类型，以连接到个人 AP.

**错误回复**

| 错误 | 描述 |
|---|---|
| `org.alljoyn.Error.OutOfRange` | 在 AllJoyn 方法调用中， authType 参数无效时返回。|

#### `Connect`

**消息参数**

无。

**回复参数**

此方法没有任何回复消息。是一个 fire-and-forget 的方法调用。

**描述**

通知 onboardee 连接到个人 AP. 如果可用，推荐 onboardee 使用并发性功能。

#### `Offboard`

**消息参数**

无。

**Reply arguments**

此方法不含任何回复消息。是一个 fire-and-forget 的方法调用。

**描述**

通知 onboardee 断开与从个人 AP 的连接，清除个人 AP 的配置字段，并开启 soft AP 模式。 

#### `qa(sn) GetScanInfo`

**消息参数**

无。

**回复参数**

| 参数 | 参数名 | 返回签名 | 值列表 | 描述 |
|:---:|---|:---:|---|---|
| 0 | `age` | `q` | 正数 | <p>扫描信息的存在时间（以分钟计）。指示设备多久之前执行过扫描操作。</p> |
| 1 | `scanList` | `a(sn)` | <p>SSID 字符串以及下列值中的一个:</p><ul><li>0 - Open</li><li>1 - WEP</li><li>2 - WPA_TKIP</li><li>3 - WPA_CCMP</li><li>4 - WPA2_TKIP</li><li>5 - WPA2_CCMP</li><li>6 - WPS</li></ul> | <p>包含 SSID 和 authType 的数组。</p><ul><li>WPA_TKIP 指使用 TKIP 暗语的 WPA.</li><li>WPA2_CCMP 指使用 AES-CCMP 暗语的 WPA2.</li><li>如果此值无效，AllJoyn 错误 `org.alljoyn.Error.OutOfRange` 将会被返回。</li></ul> |

**描述**

扫描在 onboardee 邻域网络内的所有 Wi-Fi 接入点。

**错误回复**

| 错误 | 描述 |
|---|---|
| `org.alljoyn.Error.FeatureNotAvailable` | 设备不支持此功能时 AllJoyn 回复将返回此消息。|

### 信号

#### `ConnectionResult(ns)`

ConnectionResult 信号不是 Sessionless 信号。

**消息参数**
| 参数 | 参数名| 返回签名 | 值列表 | 描述 |
|:---:|---|:---:|---|---|
| 0 | resultCode | n | <ul><li>0 - 有效</li><li>1 - 不可达</li><li>2 - 不支持的协议</li><li>3 - 未授权</li><li>4 - 错误消息</li</ul> | 连接结果的代码 |
| 1 | resultMessage | s | 字符串 | 描述连接结果的文本。|

**描述**

当到个人 AP 的连接尝试完成时，此信号会被发出。此信号经通过 SoftAP 链路建立的 AllJoyn 会话发送。

仅当 onboardee 支持并发性功能时，此信号才会被接收。

##内省 XML

```xml
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="http://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.Onboarding">
      <property name="Version" type="q" access="read"/>
      <property name="State" type="n" access="read"/>
      <property name="LastError" type="(ns)" access="read"/>
      <method name="ConfigureWifi">
         <arg name="SSID" type="s" direction="in"/>
         <arg name="passphrase" type="s" direction="in"/>
         <arg name="authType" type="n" direction="in"/>
         <arg name="status" type="n" direction="out"/>
      </method>
      <method name="Connect">
<annotation name="org.freedesktop.DBus.Method.NoReply" value="true" />
      </method>
      <method name="Offboard">
         <annotation name="org.freedesktop.DBus.Method.NoReply" value="true" />
      </method>
      <method name="GetScanInfo">
         <arg name="age" type="q" direction="out"/>
         <arg name="scanList" type="a(sn)" direction="out"/>
      </method>
      <signal name="ConnectionResult">
         <arg type="(ns)" />
      </signal>
   </interface>
</node>

```

[onboarding-14.02]: /learn/base-services/onboarding/interface-14-02

[onboarding-arch]: /files/learn/onboarding-arch.png
[onboarding-android-onboarder]: /files/learn/onboarding-android-onboarder.png
[onboarding-ios-onboarder]: /files/learn/onboarding-ios-onboarder.png
