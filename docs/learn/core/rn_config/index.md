# Routing Node Configuration File
The routing node (RN) configuration file is an XML file that controls the
behavior of the RN and sets certain variables, such as timers, connection
limits, and use case characteristics.

An example config file may be found in the AllJoyn source distribution in
`../alljoyn_core/router/test/conf/sample.conf`

Note that this sample configuration file would not be useful in practice.  It is
merely intended to provide an example of how various elements and attributes
are formatted.

## XML Schema
An XML schema, which may be used to validate config files, may be found on the
AllSeen Alliance website:

https://allseenalliance.org/schemas/busconfig.xsd

The schema is also available in the source code distribution at:
`../alljoyn_core/docs/busconfig.xsd`

The schema may be referenced in config files by including the following
attributes in the `busconfig` (i.e., root) element:
```xml
<busconfig
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:noNamespaceSchemaLocation="https://allseenalliance.org/schemas/busconfig.xsd">
```

## Default Configuration

### Bundled Routing Node
The bundled routing node consists of a routing node and a Standard Client
application that run in a single process.

As of v15.09, a user may compile AllJoyn with the scons variable `TEST_CONFIG`
set to an absolute or relative path to a config file.  However, as suggested by
the scons variable name, this method is intended for debug and test purposes.

If the user does not provide a config file, then the bundled RN relies on a
hardcoded configuration contained in the file `BundledRouter.cc`.

Note that all config settings that apply to the standalone RN also apply to the
bundled RN.

 **Bundled RN hardcoded configuration:**
 ```xml
<busconfig>
    <type>alljoyn_bundled</type>
    <listen>tcp:iface=*,port=0</listen>
    <listen>udp:iface=*,port=0</listen>
    <limit name="auth_timeout">20000</limit>
    <limit name="max_incomplete_connections">4</limit>
    <limit name="max_completed_connections">16</limit>
    <limit name="max_remote_clients_tcp">8</limit>
    <limit name="max_remote_clients_udp">8</limit>
    <property name="router_power_source">Battery powered and chargeable</property>
    <property name="router_mobility">Intermediate mobility</property>
    <property name="router_availability">3-6 hr</property>
    <property name="router_node_connection">Wireless</property>
</busconfig>
```
### Standalone Routing Node
The standalone RN runs as a compiled application named `alljoyn-daemon` on Linux.
If the user does not specify a separate configuration file when alljoyn-daemon
is started, or the `--internal` switch is used, then the RN will use a
configuration that is hardcoded in the source.

Note that the standalone RN is also available as a service on Windows 10.  The
Windows 10 service uses a hard-coded configuration and does not accept any
parameters or switches.  The examples in this document that describe passing
parameters or options to `alljoyn-daemon` are referring to the Linux
implementation.

**Example (Linux):** start routing node using internal config

    ./alljoyn-daemon

        --OR--

    ./alljoyn-daemon --internal

**Standalone RN hardcoded configuration (Linux):**
```xml
<busconfig>
    <type>alljoyn</type>
    <listen>unix:abstract=alljoyn</listen>
    <listen>tcp:iface=*,port=9955</listen>
    <listen>udp:iface=*,port=9955</listen>
    <limit name="auth_timeout">20000</limit>
    <limit name="max_incomplete_connections">16</limit>
    <limit name="max_completed_connections">32</limit>
    <limit name="max_remote_clients_tcp">0</limit>
    <limit name="max_remote_clients_udp">0</limit>
</busconfig>

```

## Using an External Config File
As previously mentioned, a user-defined, external configuration file may be
passed to a standalone RN.  In order to start the standalone RN with an
external configuration file, enter the following command (Linux):

```
./alljoyn-daemon --config-file=./my_rn_config.xml
```

## Minimal Config File
A minimal config file requires the root element (`<busconfig>`) and a single
`<listen>` element.

For example:
```xml
<busconfig>
    <listen>tcp:iface=*,port=9955</listen>
</busconfig>

```
This will result in a valid config file, but with very rudimentary
functionality.  In fact, this configuration file would prevent the connection
of any leaf nodes, since it does not override the default values of 0 for
`max_remote_clients_tcp` and `max_remote_clients_udp` (i.e., `<limit>` attributes).
Therefore, it would only be able to connect to other routing nodes.

## Review of Config File Elements and Attributes
The default configuration settings should be suitable for most use cases.
However, some applications may benefit from using different settings.  Therefore,
the information below is intended to provide some guidance in using
these settings.

The following is an alphabetical list of top-level XML
elements (i.e., immediate child elements of the root element ``<busconfig>``)
available for use in the config file, along with a description of their meaning
and application.  Any child elements will be described below their parent
element.  Likewise for attributes.

### ``<auth>``
Not used by AllJoyn.  Included for backward compatibility.  Including this
element in the config file will have no effect.

### ``<flag>``
**Note:**
The content of the flag element may be either 'true' or 'false'.  All flags
default to 'false'

#### name attribute (required)

|name              |description|default|Notes|
|------------------|-----------|-----------------------|--------|
|ns_enable_v1      |enable legacy name service if true|true|Used for debugging.  Do not use in deployed production applications.|
|ns_disable_ipv4   |disable IPv4 multicast if true|false|Used for debugging.  Do not use in deployed production applications.|
|ns_disable_ipv6   |disable IPv6 multicast if true|false|Used for debugging.  Do not use in deployed production applications.|
|ns_disable_directed_broadcast   |disable subnet broadcast if true|false|Used for debugging.  Do not use in deployed production applications.|

#### Examples
1. ``<flag name="ns_enable_v1">false</flag>``
1. ``<flag name="ns_disable_ipv6">true</flag>``

### ``<fork>``
The fork element is empty.  It does not contain any content, child elements, or
attributes.

If present in the config file, the routing node (daemon) will run in the
background.

Note that `<fork>` must be enabled in order for `<pidfile>` to be effective.

On Linux, the config file setting for `<fork>` may be overridden from the
command line, by using the `--fork` or `--no-fork` options.

#### Examples
1. ``<fork/>``

### ``<include>``
Specify the path to another configuration file, whose contents will be
included at the point where the ``<include>`` element is inserted.

The specified path may be absolute or relative.  If the path is relative, then
it is relative to the configuration file using the
``<include>``.

In addition, the path must be to a file with the file
extension ``.conf``.

#### ignore_missing attribute (optional)
May be set to "yes" or "no".  The default is "no".

|ignore_missing|description|
|--------------|-----------|
|no (default)  |a fatal error will occur if the file doesn't exist|
|yes           |silently ignore if the file doesn't exist|

#### Examples
1. ``<include>../configs/my_config.conf</include>``
1. ``<include ignore_missing="yes">my_config.conf</include>``
1. ``<include ignore_missing="no">/home/bob/configs/my_config.conf</include>``

### ``<includedir>``
Similar to ``<include>``, except that, instead of specifying the path to a
file, specify the path to a directory containing configuration files.
All files with the ``.conf`` file extension will be included.

Note that the order in which the files in the directory are included is
undefined and, therefore, users should avoid any config file include-order
dependency when using this element.

The specified path may be absolute or relative.  If the path is relative, then
it is relative to the configuration file using the
``<includedir>``

#### ignore_missing attribute (optional)
May be set to "yes" or "no".  The default is "no".

|ignore_missing|description|
|--------------|-----------|
|no (default)  |a fatal error will occur if the directory doesn't exist|
|yes           |silently ignore if the directory doesn't exist|

#### Examples
1. ``<includedir>../configs</includedir>``
1. ``<includedir ignore_missing="yes">configs</includedir>``
1. ``<includedir ignore_missing="no">/home/bob/configs</includedir>``

### ``<limit>``
Sets variables for various timeouts and connection limits to an unsigned,
32-bit integer.

#### name attribute (required)
|name|description|default|
|----|-----------|
|auth_timeout|The maximum amount of time that incoming connections are allowed to complete authentication.  Beyond this limit, incoming connections may be aborted.|20000 (ms)|
|session_setup_timeout|The maximum amount of time that incoming connections are allowed to set up session routes. Beyond this limit, incoming connections may be disconnected.|30000 (ms)|
|max_incomplete_connections|The maximum number of incoming connections that can be in the process of authenticating.  If starting to authenticate a new connection would mean exceeding this number, then the new connection will be dropped.|10 (connections)|
|max_completed_connections|The maximum number of connections (inbound and outbound) allowed for each tranport.  This means that the total number of completed connections allowed for TCP and UDP is twice this value.<br><br>If starting to process a new connection would mean exceeding this number, then the new connection will be dropped.|50 (connections) |
|max_remote_clients_tcp|The maximum number of remote clients using TCP.<br><br>Note:  this value _must_ be overridden when using an external configuration file in order to enable TCP connections to leaf nodes.  The default internal configuration file already overrides this value.<br><br>Note that this setting may be useful for applications that have a specific requirement to prevent leaf nodes from connecting; however, for generic RNs, this value should not be zero.|0 (connections)|
|max_remote_clients_udp|The maximum number of remote clients using UDP.<br><br>Note:  this value _must_ be overridden when using an external configuration file in order to enable UDP connections to leaf nodes.  The default internal configuration file already overrides this value.<br><br>Note that this setting may be useful for applications that have a specific requirement to prevent leaf nodes from connecting; however, for generic RNs, this value should not be zero.|0 (connections)|

##### Test hooks _only_
Many of the limits found in the source code are hooks for
testing AllJoyn and are not useful for application development or end-products.
For informational purposes, these are listed below, however, please do not
use them for production code, as they may have undesirable or unpredictable
behavior.

|**DO NOT USE**| |
|----------------------------------|-|
|slap_min_idle_timeout|udp_timewait|
|slap_max_idle_timeout|udp_segbmax|
|slap_default_idle_timeout|udp_segmax|
|slap_max_probe_timeout|udp_fast_retransmit_ack_counter|
|slap_default_probe_timeout|sls_backoff|
|udp_connect_timeout|sls_backoff_linear|
|udp_connect_retries|sls_backoff_exponential|
|udp_initial_data_timeout|sls_backoff_max|
|udp_total_data_retry_timeout|sls_preferred_transports|
|udp_min_data_retries|tcp_default_probe_timeout|
|udp_persist_interval|tcp_min_idle_timeout|
|udp_total_app_timeout|tcp_max_idle_timeout|
|udp_link_timeout|tcp_default_idle_timeout|
|udp_keepalive_retries|tcp_max_probe_timeout|
|udp_delayed_ack_timeout|dt_min_idle_timeout|
|dt_max_idle_timeout|dt_default_idle_timeout|
|dt_max_probe_timeout|dt_default_probe_timeout|

#### Examples
1. ``<limit name="auth_timeout">20000</limit>``
1. ``<limit name="max_incomplete_connections">16</limit>``

### ``<listen>``
Identifies an address on which the bus attachment should listen for incoming
connections. This address must be a valid URI that begins with an AllJoyn
transport name, followed by appropriate parameters and options.

A configuration file must contain at least one
`<listen>` element.  In addition, a configuration file may contain multiple
`<listen>` elements, including for the same transport, as long as the specified
transport and other parameters are valid and supported by the host platform.

Duplicate `<listen>` elements will be ignored (with a
warning message).  Invalid `<listen>` elements
will result in a fatal error, unless there is a valid `<listen>` element
available, in which case the invalid `<listen>` element will be ignored (with a
warning message).

#### Descripton and Format

|Protocol or Transport Name|Description|Format|Example|
|--------------------------------------------------------|
|tcp|AllJoyn over TCP|`tcp:(iface=<interface>` &#124; `addr=<IPv4 address),port=<port number>`|`tcp:iface=lo,port=9955`|
|udp|AllJoyn over UDP|`udp:(iface=<interface>` &#124; `addr=<IPv4 address),port=<port number>`|`udp:iface=*,port=9955`|
|unix|Unix domain socket.  Applicable only for standalone routing nodes on POSIX platforms.|`unix:(abstract` &#124 `path)=<named socket>`|`unix:abstract=alljoyn`|
|slap|Serial Line over AllJoyn Protocol. Used to provide an interface between an AllJoyn embedded platform and a POSIX-based routing node.|`slap:type=<com interface type>,dev=<serial port>,baud=<baud rate>`|`slap:type=uart,dev=/dev/ttyUSB0,baud=115200`|
|npipe|Windows 10 named pipe protocol|`npipe:`<br>(Note: no options or other parameters available)|`npipe:`|

#### Format options

|Option Name|Content|Use Wildcard?|Notes|
|--------------------------------|
|iface|Valid network interface name (see definition of `ifName` in RFC 2863) on the device that is hosting the RN.  For example, `eth0` on Linux, or `Ethernet_32803` on Windows. |Yes|`iface` and `addr` are mutually exclusive<br>`iface` is preferred over `addr`|
|addr|Valid IPv4 address|Yes|`iface` and `addr` are mutually exclusive<br>`addr` primarily exists for backward compatibility.  Prefer `iface`, instead.|
|port|Valid TCP or UDP port number|No|`port=0` indicates that the transport will use an ephemeral port.|
|abstract|Named socket|No|Linux only.<br>`unix:abstract=alljoyn` is the default because applications look for the "alljoyn" socket name by default|
|path|POSIX named socket|No|The specified path must refer to an existing named socket.|
|type|Communications interface type.|No|At this time, only `uart` is supported. |
|dev|Serial port|No|POSIX platform specific.<br>Only tested on Linux.|
|baud|Baud rate of the specified serial port.|No| |

### ``<pidfile>``
Records the routing node process ID (PID) to the specified file.  If the file
does not exist, it will be created.  If the file does exist, it will be
over-written.

**IMPORTANT NOTE:** `<pidfile>` is ONLY effective if `<fork>` is also
specified.  Alternatively, the routing node may be started with the `--fork`
option (Linux).

### ``<policy>``
Defines a security policy to be applied to a particular
set of connections to the bus. A policy is made up of ``<allow>`` and ``<deny>``
elements. Policies are analogous to a firewall in that they allow expected
traffic and prevent unexpected traffic.

Policies applied later will override those applied earlier, when the policies
overlap.

#### Attributes
The `<policy>` element must include one of the following attributes, which are
mutually exclusive.  A fatal error will be generated if more than one attribute
is present.

|Attribute|Contents|Priority|
|---------------------|---------------|
|context  |"default" OR "mandatory"|`context="default"` is the lowest priority. Policy rules in this category apply if none of the rules match from the other categories.<br><br>`context="mandatory"` is the highest priority. Policy rules in this category override rules on all other categories.|
|user     |username or userid|`user="uid"` is higher priority than context="default" and group="gid", but lower priority than context="mandatory". Policy rules in this category override those in context="default" and group="gid".|
|group    |group name or gid|`group="gid"` is higher priority than context="default" and lower priority than user="uid". Policy rules in this category override those in context="default".|


#### `<allow>` and `<deny>`
A `<policy>` must contain at least one `<allow>` or `<deny>` element.  However,
a single `<policy>` with only an `<allow>` element is not meaningful for AllJoyn,
since all traffic is allowed by default.  Instead, an `<allow>` element
primarily functions as an exception to previous `<deny>` elements.

##### Attributes for `<allow>` and `<deny>` elements

|Attribute        |Contents|Example|Notes|
|--------------------------|
|user|username or userid|`user="joes"`|On POSIX devices, allow or disallow applications on the same device to connect to the bus.<br><br>May use wildcard, e.g. `user="*"`|
|group|group name or gid|`group="enemies"`|On POSIX devices, allow or disallow applications on the same device to connect to the bus.<br><br>May use wildcard, e.g. `group="*"`|
|own|bus name|`own="com.companyA.ProductA"`|Allows or disallows leaf nodes to request ownership of a bus name.<br><br>Uses reverse domain name notation. May use wildcard, e.g. `own="*"`|
|own_prefix|bus name prefix|`own_prefix="com.companyA"` would match `com.companyA.productA` and `com.companyA.productB`|Allows or disallows leaf nodes to request ownership of a bus name.<br><br>Uses reverse domain name notation.|
|send_error / receive_error|Enable or disable specific error messages for sending or receiving|`receive_error="org.alljoyn.Error.Foo"`|Uses reverse domain name notation. May use standalone wildcard, e.g. `send_error="*"`|
|send_interface / receive_interface|Enable or disable specific interfaces for sending or receiving|`receive_interface="com.companyA.InterfaceB"`|Uses reverse domain name notation. May use standalone wildcard, e.g. `send_interface="*"`|
|send_member / receive_member|Enable or disable signals or methods for sending or receiving|`receive_member="some_signal_name"`| |
|send_path / receive_path|Enable or disable specific object paths for sending or receiving|`send_path="/org/alljoyn/lighting"`| |
|send_path_prefix / receive_path_prefix|Enable or disable all object paths that match a particular prefix|For example `send_path_prefix="/org"` would match `/org/alljoyn`, `/org/CompanyA`, etc.||
|send_group / receive_group|Group name or GID. Rule will match if the sending or receiving group matches the specified group.|`send_group="mycompany"` | |
|send_user|Username or uderid. Rule will match if the receiving endpoint matches the specified user.|`send_user="joes"`| |
|receive_user|Username or uderid. Rule will match if the sending endpoint matches the specified user.|`receive_user="beth"`| |
|send_same_user / receive_same_user|Specify whether the same user credentials are associated with each connected application, or not.  Must be "true" or "false".|For example `send_same_user="false"`||
|receive_sender / send_destination|Enable or disable sending to, or receiving from, specific bus names|`receive_sender="com.companyA.productB"`|Will match any associated alias, or the unique name|
|send_type / receive_type|Enable or disable message types.  Must be "method_call", "method_return", "signal", or "error"|`send_type="method_call"`| | |

#### Example
```xml
<policy context="default">
  <deny user="*"/>
  <deny own="*"/>

  <deny send_type="method_call"/>
  <allow send_type="signal"/>
  <allow send_type="method_return"/>
  <allow send_type="error"/>

  <allow send_destination="org.freedesktop.DBus"/>
  <allow receive_sender="org.freedesktop.DBus"/>

  <allow send_interface="org.alljoyn.Bus.Peer.Session"/>

  <allow user="jethro"/>

</policy>

<policy user="jethro">
  <allow send_type="method_call"/>
  <allow send_type="signal"/>
  <allow send_type="method_return"/>
  <allow send_type="error"/>

  <allow own_prefix="test"/>
</policy>

<policy user="joe">
   <deny send_type="method_call" send_user="beth"/>
   <deny receive_type="signal" receive_user="bob"/>
</policy>
```

### ``<property>``
Define characteristics related to router node selection and nameservice.

#### name attribute (required)
|Name|Description|Default|Notes|
|----|-----------|:-----:|-----|
|router_node_connection|Used for routing node selection.<br><br>One of the following:<br>"access point", "wired", "wireless"|"wireless"|If one of the enumerated values is not used, then the value will be ignored, a warning message will be logged, and the default value will be used|
|router_availability|Used for routing node selection.<br><br>One of the following:<br>"0-3 hr", "3-6 hr", "6-9 hr", "9-12 hr", "12-15 hr", "15-18 hr", "18-21 hr", "21-24 hr" |"3-6 hr"|If one of the enumerated values is not used, then the value will be ignored, a warning message will be logged, and the default value will be used|
|router_mobility|Used for routing node selection.<br><br>One of the following:<br>"always stationary", "low mobility", "intermediate mobility", "high mobility"|"intermediate mobility"|If one of the enumerated values is not used, then the value will be ignored, a warning message will be logged, and the default value will be used|
|router_power_source|Used for routing node selection.<br><br>One of the following:<br>"always ac powered", "battery powered and chargeable", "battery powered and not chargeable"|"Battery powered and chargeable"|If one of the enumerated values is not used, then the value will be ignored, a warning message will be logged, and the default value will be used|
|router_advertisement_prefix|Used by thin core applications (TCA) to discover routing nodes.|``"org.alljoyn.BusNode."``|In order to maximize availability to TCA, generic routing nodes should not modify this value. However, it may be useful when deploying custom systems that need to limit the TCA connecting to the routing node due to specific performance constraints.|

#### Example
```xml
<property name="router_power_source">Battery powered and chargeable</property>
<property name="router_mobility">Intermediate mobility</property>
<property name="router_availability">3-6 hr</property>
<property name="router_node_connection">Wireless</property>
```

### ``<syslog>``
Has no value or attributes.  If present, indicates that AllJoyn Daemon should
send log messages to `syslog`.

#### Example
``<syslog/>``

### ``<type>``
Not used by AllJoyn.  Included for backward compatibility.  Including this
element in the config file will have no effect.

### ``<user>``
Indicates that AllJoyn daemon should run as the indicated user instead of root.
Note that the indicated user must be known to the system.

#### Example
`<user>barts</user>`
