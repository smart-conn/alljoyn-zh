# 控制面板接口定义

## 版本历史

若想访问历史版本请点击表格中的版本号链接。

|版本号 | 日期 | 变化 |
|---|---|---|
| [14.02][controlpanel-14.02] | 2/28/2014 | <p>加入了下列接口:</p><ul><li>ControlPanel.ControlPanel interface version 1</li><li>ControlPanel.Container interface version 1</li><li>ControlPanel.SecuredContainer interface version 1</li><li>ControlPanel.Property interface version 1</li><li>ControlPanel.SecuredProperty interface version 1</li><li>ControlPanel.LabelProperty interface version 1</li><li>ControlPanel.Action interface version 1</li><li>ControlPanel.SecuredAction interface version 1</li><li>ControlPanel.NotificationAction interface version 1</li><li>ControlPanel.Dialog interface version 1</li><li>ControlPanel.SecuredDialog interface version 1</li><li>ControlPanel.ListProperty interface version 1</li><li>ControlPanel.SecuredListProperty interface version 1</li><li>ControlPanel.HTTPControl interface version 1</li></ul> |
| 14.06 | 6/30/2014 | 没有变化 |
| 14.06 Update 1 | 9/29/2014 | <ul><li>更新了文档标题以及 Overview 的章节标题 (将“规范” (Specification) 改为“定义” (Definition)). </li><li>在文档标题中加入了版本号以便查询</li><li>在概览( Overview ) 章节加入了用来处理 AllSeen Alliance Compliance and Certification 程序的便笺。</li><li>强制加入了支持 AllSeen Alliance Compliance and Certification 程序的方法和信号的参数列。</li></ul> |
| 14.12 | 12/17/2014 |清除了复杂的规范，使对方法和信号的要求更清晰。 |

## 定义概览

控制面板的接口必须由被控制方上的应用程序实现。下图展示了被控制方应用程序和控制方应用程序之间的关系。

![controlpanel-arch][controlpanel-arch]

**Figure:** 在 AllJoyn 框架内的控制面板服务框架的结构。

设备制造商负责撰写控制接口以及控制面板服务框架的元数据。


在 UI Toolkit Adaption 层, 有一个用于将元数据映射到特定平台 UI 元素的库。此库作为控制面板服务框架的一部分被一同发布。

**NOTE:** 所有方法和信号都被认为是强制支持 AllSeen Alliance Compliance and Certification 程序的。

## 发现

被控制方通过 AllJoyn announcement 被发现。每一个 AllJoyn 设备使用 About 功能来宣布关于自己的基本应用程序信息，如应用程序名，设备名，制造商
，型号等等。此 announcement 同时包括对象路径列表以及服务接口列表，控制方可以根据此列表决定哪些受控制方提供的功能是自己感兴趣的。

About announcement 通过非会话信号来传播。

## 呼叫流程

### 静态的控制面板流程

下图展示了一个典型的控制面板呼叫流程，一旦呈现就不会改变。

![controlpanel-static-call-flow][controlpanel-static-call-flow]

**Figure:** 静态控制面板流程

### 动态的控制面板流程

下图展示了一个随着终端用户与小工具交互而发生变化的控制面板呼叫流程。

![controlpanel-dynamic-call-flow][controlpanel-dynamic-call-flow]

**Figure:** 动态控制面板流程

## 错误处理

控制面板接口中的方法调用使用 AllJoyn 错误消息处理功能 (ER_BUS_REPLY_IS_ERROR_MESSAGE) 来设定错误名称和错误消息。

|错误名称 | 错误消息 |
|---|---|
| `org.alljoyn.Error.OutOfRange` | 值超出范围 |
| `org.alljoyn.Error.InvalidState` | 无效的声明 |
| `org.alljoyn.Error.InvalidProperty` | 无效的属性 |
| `org.alljoyn.Error.InvalidValue` | 无效的值 |
| `org.alljoyn.Error.MethodNotAllowed` | 调用方法不被允许 |

## BusObject 映射

### BusObject 结构

下图展示了代表着被用于支持控制面板服务框架的 AllJoyn 对象的基本接口的树形结构图。使用多个 AllJoyn 对象可实现一个控制面板。

![controlpanel-busobject-map][controlpanel-busobject-map]

**Figure:** BusObject 映射

对象们已经被整理好，以实现对多单元和多语种的支持。Announcement 只需要列出顶层的面板。

由于在 IETF 语言标签中被允许的连字符(-)在总线对象路径中不被允许，任何在对象路径中的语言标签都将连字符(-)替换为下划线(_).

不仅是控制面板，控制面板服务框架也支持其他的面板，如通知面板。这些面板不要求被在 announcement 中推广。


内省及遍历控制面板的对象树以取回所有关于此控制面板的元数据应当由控制方完成。

### BusObject 映射实例

#### 洗衣机实例

![controlpanel-washing-machine-example][controlpanel-washing-machine-example]

**Figure:** 洗衣机实例

#### Sprinkler system example

![controlpanel-sprinkler-system-example][controlpanel-sprinkler-system-example]

**Figure:** 洒水器实例

## 控制面板接口

此接口指示了该对象是否是一个控制面板。该对象将会支持至少一种语言。在 About announcement 中该服务仅需要推广这一类型的对象。在控制面板服务框
架树结构中的其他对象则不需要被推广。

**NOTE:** 内省子对象以定位对应给定面板的指定语言代码的容器应当由控制方完成。

### 接口名

| 接口名 | 版本 | 是否安全 | 对象路径 |
|---|:---:|:---:|---|
| `org.alljoyn.ControlPanel.ControlPanel` | 1 | 否 | `/ControlPanel/{unit)/{panelName}` |
|  |  |  | 举例: /ControlPanel/washing/consolePanel |

### 属性

|属性名 | 签名 | 值列表 | 可读/可写 | 描述 |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | 只读 | 接口版本号 |

### 内省 XML

```xml
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.ControlPanel.ControlPanel">
      <property name="Version" type="q" access="read"/>
   </interface>
</node>
```

## 容器接口

此接口对指导控制方为容器部件渲染 UI 提供了所有的元数据。

| 接口名 | 版本 | 是否安全 | 对象路径 |
|---|:---:|:---:|---|
| `org.alljoyn.ControlPanel.Container` | 1 | 否 | <p>`/ControlPanel/{unit)/{panelName}/{language}/.../{containerName}`</p><p>例如：:</p><ul><li>/ControlPanel/washing/consolePanel/en</li><li>/ControlPanel/sprinkler/mainPanel/en/Schedules/InputForm/RunOnDays</li></ul> |
| `org.alljoyn.ControlPanel.SecuredContainer` | 1 | 是 | `/ControlPanel/{unit)/{panelName}/{language}/.../{containerName}` |

### 属性

| 属性名 | 签名 | 值列表 | 可读/可写| 描述 |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | 只读 | 接口版本号 |
| States | `u` | Bit mask | Read-only | Bit mask for various widget states. States bit mask information is detailed below. |
| OptParams | `a{qv}` | N/A | Read-only | Metadata dictionary. See [Container widget metadata][container-widget-metadata] for more information. |

**状态属性位掩码信息**

| 掩码 | 名称 | 描述 |
|:---:|---|---|
| 0x01 | enabled | 指示部件是否被启用。未启用的部件应被标为灰色或不可见。|

#### 容器组件元数据

| 字典键值 | 字段名 | 签名 | 描述 |
|:---:|---|:---:|---|
| 0 | Label | `s` | 标签 |
| 1 | bgColor | `u` | 背景颜色由 RGB 值表达。如果尚未指定背景，则使用封闭容器的背景颜色。|
| 2 | layoutHints | `aq` | 布局提醒。 更多信息请参见 [Container widget layout hints][container-widget-layout-hints]  |

#### 容器组件的布局提醒。

| 提醒 ID | 提醒名 | 描述 |
|:---:|---|---|
| 1 | Vertical Linear | 将所有的组件都排成竖直排列 。 |
| 2 | Horizontal Linear | 将所有的组件都排成水平排列。 |

### 方法

没有方法被暴露到此接口
No methods are exposed by this interface.
。
### 信号

#### `MetadataChanged`

MetadataChanged 信号不是非会话信号。

**消息参数**

无。

**描述**

元数据已经改变。任何属性对象的改变都会引起元数据改变

### 内省 XML

```xml
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.ControlPanel.Container">
      <property name="Version" type="q" access="read"/>
      <property name="States" type="u" access="read"/>
      <property name="OptParams" type="a{qv}" access="read"/>
      <signal name="MetadataChanged" />
   </interface>
</node>
```

## 属性接口

此接口为属性部件提供了控制机制。每一个部件都被实现此接口的一个 AllJoyn 对象所代表。

### 接口名

| 接口名 | 版本 | 是否安全 | 对象路径 |
|---|:---:|:---:|---|
| `org.alljoyn.ControlPanel.Property` | 1 | 否 | <p>`/ControlPanel/{unit)/{panel}/{language}/.../{object name}`</p><p>实例:</p><ul><li>/ControlPanel/washing/consolePanel/en/Mode</li><li>/ControlPanel/sprinkler/mainPanel/en/Schedules/InputForm/ScheduleName</li></ul> |
| `org.alljoyn.ControlPanel.SecuredProperty` | 1 | yes | `/ControlPanel/{unit}/{panel}/.../{object name}` |

### Properties

|Property name | Signature | List of values | Read/Write | Description |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | Read-only | Interface version number |
| States | `u` | Bit mask | Read-only | Bit mask for various widget states. States bit mask information is detailed below. |
| OptParams | `a{qv}` | N/A | Read-only | Metadata dictionary. See [Property widget metadata][property-widget-metadata] for more information. |
| Values | `v` | N/A | Read-write | Actual value of the property. When modifying the property, the device may give the AllJoyn error `org.alljoyn.Error.MethodNotAllowed` if the property is ReadOnly. The supported data types are listed in [Supported data types][supported-data-types]. |

**States property bit mask information**

| Mask | Name | Description |
|:---:|---|---|
| 0x01 | enabled | Indicates whether the widget is enabled. A disabled widget should be grayed out or invisible. |
| 0x02 | writable | Indicates whether the widget is writable. |

#### Property widget metatdata

| Dictionary key | Field name | Signature | Description |
|:---:|---|:---:|---|
| 0 | Label | `s` | Label |
| 1 | bgColor | `u` | Background color expressed as RGB value. If not specified, then the background color of the enclosing container is used. |
| 2 | hints | `aq` | The widget rendering hints. See [Property widget hints][property-widget-hints] for more information. |
| 3 | unitOfMeasure | `s` | Unit of measurement. |
| 4 | constrainToValue | `a(vs)` | Constraint on the value as a list of values. Any value of the property must match one of the values in this list. See [List of values][list-of-values] for more information. |
| 5 | range | `vv` | Constraint on the value as a range; a value of this property  must stay within the range. See [Property widget ranges][property-widget-ranges] for more information. |

#### Property widget hints

| Hint ID | Hint name | Description |
|:---:|---|---|
| 1 | Switch | Two-state buttons allowing the end-user to toggle the state of a single settings option. |
| 2 | CheckBox | Widget for multi-select. It allows the end user to select multiple options from a list. |
| 3 | Spinner | Widget for single-select. It allows the end user to select a single option from a list. |
| 4 | RadioButton | Widget for single-select. It allows the end user to select a single option from a list. |
| 5 | Slider | Allows the end user to select a value from a continuous or discrete range. The appearance is linear, either horizontal or vertical. |
| 6 | TimePicker | Allows the end user to specify a time value. |
| 7 | DatePicker | Allows the end user to specify a date value. |
| 8 | NumberPicker | Allows the end user to specify a numeric value |
| 9 | NumericKeypad | Provides the end user with a numeric entry field and buttons for 0-9 digits, to enter a numeric value. The developer must know the min/max number of digits allowed in the entry field. |
| 10 | RotaryKnob | An alternate way to represent a slider. |
| 11 | TextLabel | Read-only text label. |
| 12 | NumericView | Provides a read-only, numeric field with an optional label and numbers. For example, a washing machine display shows the time remaining for wash is 35:00 minutes. |
| 13 | EditText | Provides the end user with a text entry field and keyboard. The developer must know the min/max number of letters allowed in the entry field. |

#### Supported data types

| Category | Supported data types |
|---|---|
| Scalar types | <ul><li>BOOLEAN - b</li><li>BYTE - y</li><li>BYTE ARRAY - ay</li><li>Numeric types (types listed below)</li><li>STRING - s</li></ul> |
| Composite types | All composite data type must have the following signature--q(type)--where the first value is an enum value indicating the composite type. Details provided below. |
| Collection of records | Array of records of only scalar and supported composite types. All records in the array must be of the same record type. |

**Numeric types**

* INT16 - n
* UINT16 - q
* INT32 - i
* UNT32 - u
* INT64 - x
* UINT64 - t
* DOUBLE - d

**Composite types information**

| Composite type enum | Composite type name | Signature | Description |
|---|---|---|---|
| 0 | Date | `q(qqq)` | Data type per RFC3339. There are three fields: date-mday (1-31); date-month (1-12); and date-fullyear (4-digit year). |
| 1 | Time | `q(qqq)` | Time type per RFC3339. There are three fields: time-hour (0-23); time-minute (0-59); and time-second (0-59). |

#### List of values

A list of values is an array of structs.

| Field name | Signature | Description |
|---|:---:|---|
| Value | `v` | Value with the same data type of the property. |
| Label | `s` | Display label. |

#### Property widget ranges

| Field name | Signature | Description |
|---|:---:|---|
| min | `v` | Minimum value with the same data type as that of the property. |
| max | `v` | Maximum value with the same data type as that of the property. |
| increment | `v` | Value to increment/decrement by. It has the same data type as that of the property. |

### Methods

No methods are exposed by this interface.

### Signals

#### `MetadataChanged`

MetadataChanged signal is not a Sessionless signal.

**Message arguments**

None.

**Description**

The metadata has changed. This can occur due to changes in any of the property objects.

#### `ValueChanged`

ValueChanged signal is not a Sessionless signal.

**Message arguments**

None.

**Description**

The property's value has changed.

### Introspect XML

```xml
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.ControlPanel.Property">
      <property name="Version" type="q" access="read"/>
      <property name="States" type="u" access="read"/>
      <property name="OptParams" type="a{qv}" access="read"/>
      <property name="Value" type="v" access="readwrite"/>
      <signal name="MetadataChanged" />
      <signal name="ValueChanged">
         <arg type="v"/>
      </signal>
   </interface>
</node>
```

## LabelProperty Interface
 
This interface provides the control mechanism for the label 
property widget (a text label). Each widget is represented 
by an AllJoyn object implementing this interface.
 
### Interface name
 
| Interface name | Version | Secured | Object path |
|---|:---:|:---:|---|
| `org.alljoyn.ControlPanel.LabelProperty` | 1 | no | <p>`/ControlPanel/{unit}/{panel}/{language}/.../ {object name}`</p><p>Example:</p><p>/ControlPanel/airconditioner/consolel/Warning</p> |

### Properties

|Property name | Signature | List of values | Read/Write | Description |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | Read-only | Interface version number |
| States | `u` | Bit mask | Read-only | Bit mask for various widget states. States bit mask information is detailed below. |
| Label | `s` | N/A | Read-only | Text label |
| OptParams | `a{qv}` | N/A | Read-only | Metadata dictionary. See [LabelProperty widget metadata][labelproperty-widget-metadata] for more information. |

**States bit mask information**

| Mask | Name | Description |
|---|---|---|
| 0x01 | enabled | Indicates whether the widget is enabled. A disabled widget should be grayed out or invisible. |

#### LabelProperty widget metadata

| Dictionary key | Field name | Signature | Description |
|:---:|---|:---:|---|
| 1 | bgColor | `u` | Background color expressed as RGB value. If not specified, then the background color of the enclosing container is used. |
| 2 | hints | `aq` | The widget rendering hints. See [LabelProperty widget hints][labelproperty-widget-hints] for more information. |

#### LabelProperty widget hints

| Hint ID | Hint name | Description |
|:---:|---|---|
| 1 | TextLabel | Read-only text label. |

### Methods

No methods are exposed by this interface.

### Signals

#### `MetadataChanged`

MetadataChanged signal is not a Sessionless signal.

**Message arguments**

None.

**Description**

The metadata has changed. This can occur due to changes in any of the property objects.

### Introspect XML

```xml
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.ControlPanel.LabelProperty">
      <property name="Version" type="q" access="read"/>
      <property name="States" type="u" access="read"/>
      <property name="Label" type="s" access="read"/>
      <property name="OptParams" type="a{qv}" access="read"/>
      <signal name="MetadataChanged" />
   </interface>
</node>
```

## Action Interface

This interface provides the control mechanism for the Action widget. 
Each Action widget is represented by an AllJoyn object implementing 
this interface. An action widget can optionally provide a confirmation 
dialog widget in its object sub-tree to allow for a pop-up dialog to 
appear whenever the UI presentation of this action is activated. 
The action taken on the confirmation dialog will take place instead 
of the `Exec` method call for this Action widget.

### Interface name
 
| Interface name | Version | Secured | Object path |
|---|:---:|:---:|---|
| `org.alljoyn.ControlPanel.Action` | 1 | no | <p>`/ControlPanel/{unit}//{panel}/{language}/.../{object name}`</p><p>Example:</p><p>/ControlPanel/{unit}/{panel}/{language}/.../{object name}</p>  |
| `org.alljoyn.ControlPanel.SecuredAction` | 1 | yes | `/ControlPanel/{unit}/{panel}/{language}/.../{object name}` |

### Properties

|Property name | Signature | List of values | Read/Write | Description |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | Read-only | Interface version number |
| States | `u` | Bit mask | Read-only | Bit mask for various widget states. States bit mask information is detailed below. |
| OptParams | `a{qv}` | N/A | Read-only | Metadata dictionary. See [Action widget metadata][action-widget-metadata] for more information. |

**States bit mask information**

| Mask | Name | Description |
|---|---|---|
| 0x01 | enabled | Indicates whether the widget is enabled. A disabled widget should be grayed out or invisible. |

#### Action widget metadata

| Dictionary key | Field name | Signature | Description |
|:---:|---|:---:|---|
| 0 | label | `s` | Label |
| 1 | bgColor | `u` | Background color expressed as RGB value. If not specified, then the background color of the enclosing container is used. |
| 2 | hints | `aq` | The widget rendering hints. See [Action widget hints][action-widget-hints] for more information. |

#### Action widget hints

| Hint ID | Hint name | Description |
|:---:|---|---|
| 1 | ActionButton | Button associated with an action or a method call, for example, "submit". |

### Methods

#### `Exec`

**Message arguments** 

None.

**Reply arguments**

None.

**Description**

Executes the action command.

### Signals

#### `MetadataChanged`

MetadataChanged signal is not a Sessionless signal.

**Message arguments**

None.

**Description**

The metadata has changed. This can occur due to changes in any of the property objects.

### Introspect XML

```xml
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.ControlPanel.Action">
      <property name="Version" type="q" access="read"/>
      <property name="States" type="u" access="read"/>
      <property name="OptParams" type="a{qv}" access="read"/>
      <signal name="MetadataChanged" />
      <method name="Exec"/>
   </interface>
</node>
```

## NotificationAction Interface

This interface indicates whether the object is a notification 
action object. A notification object is typically referenced 
in a notification message. Upon receiving such notification, 
the controller can generate the notification action panel 
based on the metadata provided by this type of object. 
This object is different from a regular control panel since 
it allows the controllee to send a signal to tell the controller 
to dismiss the panel.

This object supports at least one language. It's the responsibility 
of the controller to introspect the children objects to locate 
the corresponding root container of the given panel for the 
specific language code.

### Interface name
 
| Interface name | Version | Secured | Object path |
|---|:---:|:---:|---|
| `org.alljoyn.ControlPanel.NotificationAction` | 1 | no | <p>`/NotificationPanel/{unit}/{actionPanelName}`</p><p>Example:</p><p>/NotificationPanel/washing/CycleCompleted</p> |

### Properties

|Property name | Signature | List of values | Read/Write | Description |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | Read-only | Interface version number |

### Signals

#### `Dismiss`

Dismess signal is not a Sessionless signal.

**Message arguments**

None.

**Description**

The controller must dismiss this notification panel.

### Introspection XML

```xml
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.ControlPanel.NotificationAction">
      <property name="Version" type="q" access="read"/>
      <signal name="Dismiss" />
   </interface>
</node>
```

## Dialog Interface

This interface provides all the metadata to guide the controller 
to render the UI for a dialog widget. A dialog widget typically 
has a message and up to three action buttons.

### Interface name
 
| Interface name | Version | Secured | Object path |
|---|:---:|:---:|---|
| `org.alljoyn.ControlPanel.Dialog` | 1 | no | <p>`/ControlPanel/{unit)/{panelName}/{language}/.../{dialogName}`</p><p>Example:</p><p>/ControlPanel/washing/mainPanel/en/Confirmation</p> |
| `org.alljoyn.ControlPanel.SecuredDialog` | 1 | yes | `/ControlPanel/{unit}/{panel}/{language}/.../{dialogName}` |

### Properties

|Property name | Signature | List of values | Read/Write | Description |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | Read-only | Interface version number |
| States | `u` | Bit mask | Read-only | Bit mask for various widget states. States bit mask information is detailed below. |
| OptParams | `a{qv}` | N/A | Read-only | Metadata dictionary. See [Dialog widget metadata][dialog-widget-metadata] for more information. |
| Message | `q` | N/A | Read-only | Display message. |
| NumActions | `q` | 1-3 | Read-only | Number of available actions. |

**States bit mask information**

| Mask | Name | Description |
|---|---|---|
| 0x01 | enabled | Indicates whether the widget is enabled. A disabled widget should be grayed out or invisible. |

#### Dialog widget metadata

| Dictionary key | Field name | Signature | Description |
|:---:|---|:---:|---|
| 0 | label | `s` | Label or title of the dialog. |
| 1 | bgColor | `u` | Background color expressed as RGB value. If not specified, then the background color of the enclosing container is used. |
| 2 | hints | `aq` | Layout hints. See [Dialog widget layout hints][dialog-widget-layout-hints] for more information. |
| 6 | labelAction1 | `s` | Label of the action1 widget. |
| 7 | labelAction2 | `s` | Label of the action2 widget. |
| 8 | labelAction3 | `s` | Label of the action3 widget. |

#### Dialog widget layout hints

| Hint ID | Hint name | Description |
|:---:|---|---|
| 1 | AlertDialog | Widget that combines a label, text data, and buttons in a single dialog box. A minimum of 1 button is required. A maximum of 3 buttons is supported. |

### Methods

#### `Action1`

**Message arguments**

None.

**Reply arguments**

None.

**Description**

Executes the action number 1.

#### `Action2`

**Message arguments**

None.

**Reply arguments**

None.

**Description**

Executes the action number 2. 

**Error reply**

| Error | Description |
|---|---|
| `org.alljoyn.Error.MethodNotAllowed` | Returned if the NumActions property is less than 2. |

#### `Action3`

**Message arguments**

None.

**Reply arguments**

None.

**Description**

Executes the action number 3. 

**Error reply**

| Error | Description |
|---|---|
| `org.alljoyn.Error.MethodNotAllowed` | Returned if the NumActions property is less than 3. |

### Signals

#### `MetadataChanged`

MetadataChanged signal is not a Sessionless signal.

**Message arguments**

None.

**Description**

The metadata has changed. This can occur due to changes in any of the property objects.

### Introspection XML

```xml
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.ControlPanel.Dialog">
      <property name="Version" type="q" access="read"/>
      <property name="States" type="u" access="read"/>
      <property name="OptParams" type="a{qv}" access="read"/>
      <property name="Message" type="s" access="read"/>
      <property name="NumActions" type="q" access="read"/>
      <signal name="MetadataChanged" />
      <method name="Action1"/>
      <method name="Action2"/>
      <method name="Action3"/>
   </interface>
</node>
```

## ListProperty Interface

This interface provides the control mechanism for the list 
property widget. A list property widget holds a list of 
records and a container representing the UI of the record 
display/input form.

### Interface name
 
| Interface name | Version | Secured | Object path |
|---|:---:|:---:|---|
| `org.alljoyn.ControlPanel.ListProperty` | 1 | no | <p>`/ControlPanel/{unit}/{language}/{panel}/{object name}`</p><p>Example:</p><p>/ControlPanel/sprinkler/mainPanel/en/Schedules</p> |
| `org.alljoyn.ControlPanel.SecuredListProperty` | 1 | yes | `/ControlPanel/{unit}/{language}/{panel}/.../{object name}` |

### Properties

|Property name | Signature | List of values | Read/Write | Description |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | Read-only | Interface version number |
| States | `u` | Bit mask | Read-only | Bit mask for various widget states. States bit mask information is detailed below. |
| OptParams | `a{qv}` | N/A | Read-only | Metadata dictionary. See [ListProperty widget metadata][listproperty-widget-metadata] for more information. |
| Value | `a{qs}` | N/A | Read-only | <p>List of records. Each record in the list holds the following fields:</p><ul><li>recordID ('q'): the record ID</li><li>label ('s'): the label to display on the list</li></ul><p>The record data are not exposed in this property. The `View` method call can be used to view each record.</p> |

**States bit mask information**

| Mask | Name | Description |
|---|---|---|
| 0x01 | enabled | Indicates whether the widget is enabled. A disabled widget should be grayed out or invisible. |

#### ListProperty widget metadata

| Dictionary key | Field name | Signature | Description |
|:---:|---|:---:|---|
| 0 | label | `s` | Label |
| 1 | bgColor | `u` | Background color expressed as RGB value. If not specified, then the background color of the enclosing container is used. |
| 2 | hints | `aq` | Widget rendering hints. See [ListProperty widget hints][listproperty-widget-hints] for more information. |

#### ListProperty widget hints

| Hint ID | Hint name | Description |
|:---:|---|---|
| 1 | DynamicSpinner | Widget that allows the end user to select an option from a list, add a new option, delete an option, and update an option. |

### Methods

#### `Add`

**Message arguments**

None.

**Reply arguments**

None.

**Description**

Prepares the input form for adding a new record to the list. 
UI requirements follow:

* The controller must present an OK button and tie it to the 
`Confirm` method call. Completing the add action on the input 
form will add the new record to the list.
* The controller must present a Cancel button and tie to the 
`Cancel` method call to allow for discarding the operation.

#### `Delete('q')`

**Message arguments**

| Argument | Parameter name | Signature | List of values | Description |
|:---:|---|:---:|---|---|
| 0 | recordID | `q` | positive | The record ID. |

**Reply arguments**

None.

**Description**

Prepares the form for view the record prior to the delete action. 
UI requirements follow:
* The controller must present an OK button and tie it to the 
`Confirm` method call. A confirm action deletes the record 
from the list.
* The controller must present a Cancel button and tie to the 
`Cancel` method call to allow for discarding the operation.

#### `View('q')`

**Message arguments**

| Argument | Parameter name | Signature | List of values | Description |
|:---:|---|:---:|---|---|
| 0 | recordID | `q` | positive | The record ID. |

**Reply arguments**

None.

**Description**

Prepares the display form to view the record identified by the recordID. 

The controller must present an OK button to dismiss the view form.

#### `Update('q')`

**Inputs**

| Argument | Parameter name | Signature | List of values | Description |
|:---|---|---|---|---|
| recordID | yes | q | positive | The record ID. |

**Reply arguments**

None.

**Description**

Prepares the input form to view the record identified by the 
recordID and allow the end user to modify the fields. 
UI requirements follow:

* The controller must present an OK button and tie it to the 
`Confirm` method call. A confirm action updates the given 
record with new information.
* The controller must present a Cancel button and tie to the 
`Cancel` method call to allow for discarding the operation.

#### `Confirm`

**Message arguments**

None.

**Reply arguments**

None.

**Description**

Confirms the action and save the change requested.

The controller must present an OK button to dismiss the view form.

#### `Cancel`

**Message arguments**

None.

**Reply arguments**

None.

**Description**

Cancels the current action.

The controller must present a Cancel button to dismiss the input form.

### Signals

#### `MetadataChanged`

MetadataChanged signal is not a Sessionless signal.

**Message arguments**

None.

**Description**

The metadata has changed. This can occur due to changes in any of the property objects.

#### `ValueChanged`

ValueChanged signal is not a Sessionless signal.

**Message arguments**

None.

**Description**

The property's value has changed. Because the list data can 
be large, the signal does not send the current value.

### Introspect XML

```xml
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.ControlPanel.ListProperty">
      <property name="Version" type="q" access="read"/>
      <property name="States" type="u" access="read"/>
      <property name="OptParams" type="a{qv}" access="read"/>
      <property name="Value" type="a(qs)" access="read"/>
      <method name="Add"/>
      <method name="Delete">
         <arg name="recordID" type="q" direction="in"/>
      </method>
      <method name="View">
         <arg name="recordID" type="q" direction="in"/>
      </method>
      <method name="Update">
         <arg name="recordID" type="q" direction="in"/>
      </method>
      <method name="Confirm">
      </method>
      <method name="Cancel">
      </method>

      <signal name="MetadataChanged"/>
      <signal name="ValueChanged"/>
   </interface>
</node>
```

## Support of Existing HTTP Control Pages

Should a device already have HTTP control pages hosted 
on the device itself, it can advertise those pages using 
the HTTPControl interface.

This interface provides all the information about the 
hosted HTTP control pages on the device.

### Interface name
 
| Interface name | Version | Secured | Object path |
|---|:---:|:---:|---|
| `org.alljoyn.ControlPanel.HTTPControl` | 1 | no | `/Control/{unit}/HTTPControl` |

### Properties

|Property name | Signature | List of values | Read/Write | Description |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | Read-only | Interface version number |

### Methods

#### `s GetRootURL`

**Message arguments**

None.

**Reply arguments**

| Argument | Parameter name | Return signature | List of values | Description |
|:---|---|:---:|---|---|
| 0 | url | `s` | N/A | Root URL of the control pages. |

### Signals

No signals are emitted from this interface.

###Introspection XML

```xml
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.Control.HTTPControl">
      <property name="Version" type="q" access="read"/>
      <method name="GetRootURL">
         <arg name="url" type="s" direction="out"/>
      </method>
   </interface>
</node>
```

[controlpanel-14.02]: /learn/base-services/controlpanel/interface-14-02

[controlpanel-arch]: /files/learn/controlpanel-arch.png
[controlpanel-static-call-flow]: /files/learn/controlpanel-static-call-flow.png
[controlpanel-dynamic-call-flow]: /files/learn/controlpanel-dynamic-call-flow.png
[controlpanel-busobject-map]: /files/learn/controlpanel-busobject-map.png
[controlpanel-washing-machine-example]: /files/learn/controlpanel-washing-machine-example.png
[controlpanel-sprinkler-system-example]: /files/learn/controlpanel-sprinkler-system-example.png

[container-widget-metadata]: #container-widget-metadata
[container-widget-layout-hints]: #container-widget-layout-hints

[property-widget-metadata]: #property-widget-metadata
[supported-data-types]: #supported-data-types
[property-widget-hints]: #property-widget-hints
[list-of-values]: #list-of-values
[property-widget-ranges]: #property-widget-ranges

[labelproperty-widget-metadata]: #labelproperty-widget-metadata
[labelproperty-widget-hints]: #labelproperty-widget-hints

[action-widget-metadata]: #action-widget-metadata
[action-widget-hints]: #action-widget-hints

[dialog-widget-metadata]: #dialog-widget-metadata
[dialog-widget-layout-hints]: #dialog-widget-layout-hints

[listproperty-widget-metadata]: #listproperty-widget-metadata
[listproperty-widget-hints]: #listproperty-widget-hints
