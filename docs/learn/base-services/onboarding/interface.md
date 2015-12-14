# Onboarding Interface Definition

## Release History

To access a previous version of this document, click the release version link below.

|Release version | Date | What changed |
|---|---|---|
| [14.02][onboarding-14.02] | 2/28/2014 | Onboarding interface version 1 was added. |
| 14.06 | 6/30/2014 | No updates |
|14.06 Update 1 | 9/29/2014 | <ul><li>Updated the document title and Overview chapter title (changed from Specification to Definition)</li><li>Added the release version number to the document title for version tracking.</li><li>Added a note in the Definition Overview chapter to address the AllSeen Alliance Compliance and Certification program.</li><li>Added a Mandatory column for method and signal parameters to support the AllSeen Alliance Compliance and Certification program.</li></ul> |
| 14.12 | 12/17/2014 | Cleanup to make requirements for methods and signals more clear. |

## Definition Overview

The Onboarding interface is implemented by an application on
a target device, referred to as an onboardee. A typical
onboardee is an AllJoyn&trade; thin client device. This
interface allows the onboarder to send the Wi-Fi credentials
to the onboardee to allow it to join the personal access point.

![onboarding-arch][onboarding-arch]

**Figure:** Onboarding service framework architecture within the AllJoyn framework

**NOTE:** All methods and signals are considered mandatory to
support the AllSeen Alliance Compliance and Certification program.

## Onboarding Call Flows

### Onboarding call flow using an Android onboarder

The following figure illustrates a call flow for onboarding
an onboardee using an Android onboarder.

![onboarding-android-onboarder][onboarding-android-onboarder]

**Figure:** Onboarding a device using an Android onboarder

### Onboarding call flow using an iOS onboarder

The following figure illustrates a call flow for onboarding
an onboardee using an iOS onboarder.

![onboarding-ios-onboarder][onboarding-ios-onboarder]

**Figure:** Onboarding a device using an iOS onboarder

## Error Handling

The method calls in the Onboarding interface use the AllJoyn
error message handling feature (ER_BUS_REPLY_IS_ERROR_MESSAGE)
to set the error name and error message.

| Error name | Error message |
|---|---|
| `org.alljoyn.Error.OutOfRange` | Value out of range |
| `org.alljoyn.Error.InvalidValue` | Invalid value |
| `org.alljoyn.Error.FeatureNotAvailable` | Feature not available |

## Onboarding Interface

### Interface name

| Interface name | Version | Secured | Object path |
|---|:---:|:---:|---|
| `org.alljoyn.Onboarding` | 1 | yes | `/Onboarding` |

### Properties

|Property name | Signature | List of values | Read/Write | Description |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | Read-only | Interface version number |
| State | `n` | <ul><li>0 - Personal AP Not Configured</li><li>1 - Personal AP Configured/Not Validated</li><li>2 - Personal AP Configured/Validating</li><li>3 - Personal AP Configured/Validated</li><li>4 - Personal AP Configured/Error</li><li>5 - Personal AP Configured/Retry</li><ul> | Read-only | The configuration state |
|LastError| `ns` | <ul><li>0 - Validated</li><li>1 - Unreachable</li><li>2 - Unsupported_protocol</li><li>3 - Unauthorized</li><li>4 - Error_message</li></ul> | Read-only | The last error code and error message. Error_message is the error message received from the underlying Wi-Fi layer. |

### Methods

The following methods are exposed by a BusObject that
implements the Onboarding interface.

#### `n ConfigWifi('ssn')`

**Message arguments**

| Argument | Parameter name| Signature | List of values | Description |
|:---:|---|:---:|---|---|---|
| 0 | `SSID` | `s` | N/A | Access point SSID |
| 1 | `passphrase` | `s` | N/A | Access point passphrase  in hex format |
| 2 | `authType` | `n` | <ul><li>-3 - WPA2_AUTO</li><li>-2 - WPA_AUTO</li><li>-1 - Any</li><li>0 - Open</li><li>1 - WEP</li><li>2 - WPA_TKIP</li><li>3 - WPA_CCMP</li><li>4 - WPA2_TKIP</li><li>5 - WPA2_CCMP</li><li>6 - WPS</li></ul> | <p>Authentication type.</p><ul><li>When it is equal to any, the onboardee must attempt all possible authentication types it supports to connect to the AP.</li><li>When it is equal to -3 or -2 (WPA2_AUTO or WPA_AUTO), the onboardee attempts to connect to the AP with TKIP cipher and then AES-CCMP cipher.</li><li>WPA_TKIP indicates WPA with TKIP cipher.</li><li>WPA2_CCMP indicates WPA2 with AES-CCMP cipher.</li><li>If the value is invalid, the AllJoyn error `org.alljoyn.Error.OutOfRange` will be returned.</li></ul> |

**Reply arguments**

| Argument | Parameter name| Return signature | List of values | Description |
|:---:|---|:---:|---|---|
| 0 | `status` | `n` | <p>The possible values for the connection result status are:</p><ul><li>1 - Current SoftAP mode will be disabled upon receipt of Connect. In this case, the Onboarder application must wait for the device to connect on the personal AP and query the State and LastError properties.</li><li>2 - Concurrent step used to validate the personal AP connection. In this case, the Onboarder application must wait for the ConnectionResult signal to arrive over the AllJoyn session established over the SoftAP link.</li></ul>|

**Description**

Sends the personal AP information to the onboardee. When the
authType is equal to -1 (any), the onboardee must try out
all the possible authentication types it supports to connect to the personal AP.

**Error reply**

| Error | Description |
|---|---|
| `org.alljoyn.Error.OutOfRange` | Returned in the AllJoyn method call reply if authType parameter is invalid. |

#### `Connect`

**Message arguments**

None.

**Reply arguments**

This method does not have any reply message. It's a fire-and-forget
method call.

**Description**

Tells the onboardee to connect to the personal AP. It is
recommended that the onboardee use the concurrency feature,
if it is available.

#### `Offboard`

**Message arguments**

None.

**Reply arguments**

This method does not have any reply message. It's a fire-and-forget
method call.

**Description**

Tells the onboardee to disconnect from the personal AP, clear
the personal AP configuration fields, and start the soft AP mode.

#### `qa(sn) GetScanInfo`

**Message arguments**

None.

**Reply arguments**

| Argument | Parameter name | Return signature | List of values | Description |
|:---:|---|:---:|---|---|
| 0 | `age` | `q` | positive number | <p>Age of the scan information in minutes. Reflects how long ago the scan procedure was performed by the device.</p> |
| 1 | `scanList` | `a(sn)` | <p>The SSID string and one of the following values:</p><ul><li>0 - Open</li><li>1 - WEP</li><li>2 - WPA_TKIP</li><li>3 - WPA_CCMP</li><li>4 - WPA2_TKIP</li><li>5 - WPA2_CCMP</li><li>6 - WPS</li></ul> | <p>Array of records containing the SSID and authType.</p><ul><li>WPA_TKIP indicates WPA with TKIP cipher.</li><li>WPA2_CCMP indicates WPA2 with AES-CCMP cipher.</li><li>If the value is invalid, the AllJoyn error `org.alljoyn.Error.OutOfRange` will be returned.</li></ul> |

**Description**

Scans all the Wi-Fi access points in the onboardee's proximity.

**Error reply**

| Error | Description |
|---|---|
| `org.alljoyn.Error.FeatureNotAvailable` | Returned in the AllJoyn response if the device does not support this feature. |

### Signals

#### `ConnectionResult(ns)`

ConnectionResult signal is not a Sessionless signal.

**Message arguments**

| Argument | Parameter name | Return signature | List of values | Description |
|:---:|---|:---:|---|---|
| 0 | resultCode | n | <ul><li>0 - Validated</li><li>1 - Unreachable</li><li>2 - Unsupported_protocol</li><li>3 - Unauthorized</li><li>4 - Error_message</li</ul> | Connection result code. |
| 1 | resultMessage | s | string | Text that describes the connection result. |

**Description**

This signal is emitted when the connection attempt against
the personal AP is completed. The signal is sent over the
AllJoyn session established over the SoftAP link.

This signal will be received only if the concurrency feature
is supported by the onboardee.

##Introspect XML

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
