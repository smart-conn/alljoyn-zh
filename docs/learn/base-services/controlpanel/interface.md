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

**NOTE:** 内省子对象以定位对应给定面板的指定语言代码的根容器应当由控制方完成。

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
| 1 | bgColor | `u` | 由 RGB 值表达的背景颜色。如果尚未指定背景，则使用封闭容器的背景颜色。|
| 2 | layoutHints | `aq` | 布局提醒。 更多信息请参见 [Container widget layout hints][container-widget-layout-hints]  |

#### 容器组件的布局提醒。

| 提醒 ID | 提醒名 | 描述 |
|:---:|---|---|
| 1 | Vertical Linear | 将所有的组件都排成竖直排列 。 |
| 2 | Horizontal Linear | 将所有的组件都排成水平排列。 |

### 方法

没有方法被暴露到此接口

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

### 属性

|属性名 | 签名 | 值类型 | 可读/可写 | 描述 |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | 只读 | 接口版本号 |
| States | `u` | Bit mask | 只读 | 众多组建状态的掩码。状态掩码信息在下面会有详细说明。 |
| OptParams | `a{qv}` | N/A | 只读 | 元数据字典，详细信息请参见 [Property widget metadata][property-widget-metadata]. |
| Values | `v` | N/A | 只写 | 属性的具体值，如果状态是只读的，在状态被修改时设备会报错： `org.alljoyn.Error.MethodNotAllowed`. 被支持的数
剧类型在下表中有列出 [Supported data types][supported-data-types]. |

**状态属性位掩码信息**

| 掩码 | 名字 | 描述 |
|:---:|---|---|
| 0x01 | enabled | 指示部件是否被启用。未启用的部件应被标为灰色或不可见。 |
| 0x02 | writable | 指示部件是否可写。 |

#### 属性组件元数据
| 字典键值 | 字段名 | 签名 | 描述 |
|:---:|---|:---:|---|
| 0 | Label | `s` | 标签 |
| 1 | bgColor | `u` | 由 RGB 值表达的背景颜色。如果尚未指定背景，则使用封闭容器的背景颜色。 |
| 2 | hints | `aq` | 组件绘制提示，详细信息请参阅 [Property widget hints][property-widget-hints]. |
| 3 | unitOfMeasure | `s` | 测量单位 |
| 4 | constrainToValue | `a(vs)` | 受限制的值列表，属性中的任何一个值都必须与此表中的一个值一致。详细信息请参阅 [List of  values][list-of-values]|.
| 5 | range | `vv` | 受限制的值的范围; 属性中的值必须在此限制范围内。详细信息请参阅 [Property widget ranges][property-widget-ranges]|.

#### 属性组建提示

| 提示 ID | 提示名 | 描述 |
|:---:|---|---|
| 1 | Switch | 双态按钮使终端用户可以使用一个设置选项来切换状态。 |
| 2 | CheckBox | 多重选择组件。允许用户从一个列表中选择多个选项。|
| 3 | Spinner | 单选组件。允许用户从一个列表中选择单个选项。|
| 4 | RadioButton | 单选组件。&&允许用户从一个列表中选择单个选项。 |
| 5 | Slider | 允许用户从一个连续或离散的区间内选择一个值。外观应是线性的，水平或者竖直。|
| 6 | TimePicker | 允许终端用户指定一个时间。 |
| 7 | DatePicker | 允许终端用户指定一个日期。 |
| 8 | NumberPicker | 允许终端用户指定一个数字。|
| 9 | NumericKeypad | 为终端用户提供了数字的输入字段和0-9的数字按钮，以便输入一个数字值。开发者必须了解输入字段所支持的的最大/最小限制位数。 |
| 10 | RotaryKnob | 代表滑块的另一种方式 |
| 11 | TextLabel | 只读的文字标签 |
| 12 | NumericView | 提供一个只读的数字字段和一个可选的标签。例如洗衣机显示屏可以显示剩余时间为 35:00 分钟。 |
| 13 | EditText | 为终端用户提供一个输入文本的字段以及键盘。开发者必须了解输入字段所支持的最大/最小字母数。 |

#### 支持的数据类型

| 类别 | 支持的数据类型 |
|---|---|
| 标量类别 | <ul><li>BOOLEAN - b</li><li>BYTE - y</li><li>BYTE ARRAY - ay</li><li>数量类别 (如下所示)</li><li>STRING - s</li></ul> |
| 混合类别 | 所有的混合数据类别必须含有以下签名--q(type)--第一个值是一个 enum 值，指示混合类别。下文会阐述细节。 |
| 记录集 | 只有标量和受支持的混合类别的记录数组。一个数组内的所有的记录必须是同一记录类型的。 |

**数字类型**

* INT16 - n
* UINT16 - q
* INT32 - i
* UNT32 - u
* INT64 - x
* UINT64 - t
* DOUBLE - d

**混合类型信息**

| 混合类型 enum |混合类型名称 | 签名 | 描述 |
|---|---|---|---|
| 0 | 日期 | `q(qqq)` | 根据 RFC3339 标准的日期，有三个字段： date-mday (1-31); date-month (1-12)； 以及 date-fullyear (4-digit year). |
| 1 | 名称 | `q(qqq)` | 根据 RFC3339 标准的时间，有三个字段： time-hour (0-23); time-minute (0-59); 以及 time-second (0-59). |

#### 值列表

一个值列表就是一个结构数组

| 字段名 | 签名 | 描述 |
|---|:---:|---|
| Value | `v` | 与属性相同的数据类型的值 |
| Label | `s` | 显示标签 |

#### 属性组件范围

| 字段名 | 签名 | 描述 |
|---|:---:|---|
| min | `v` | 与属性的数据类型相同的最小值 |
| max | `v` | 与属性的数据类型相同的最大值 |
| increment | `v` | 增加/减少值的量。与属性的数据类型相同。 |

### 方法

此接口不被暴露任何方法

### 信号

#### `MetadataChanged`

MetadataChanged 信号不是非会话信号

**消息参数**

无。

**描述**

元数据已变化，任何属性对象的变化都会引发元数据的变化。


#### `ValueChanged`

ValueChanged 信号不是非会话信号

**消息参数**

无。

**描述**

此属性的值已改变。

### 内省 XML

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

## LabelProperty 接口
 
 此接口为标签属性组件（一个文本标签）提供控制机制。每一个组件都由一个实现这个接口的 AllJoyn 对象所代表。
 
### 接口名
 
| 接口名 | 版本 | 安全性 | 对象路径 |
|---|:---:|:---:|---|
| `org.alljoyn.ControlPanel.LabelProperty` | 1 | no | <p>`/ControlPanel/{unit}/{panel}/{language}/.../ {object name}`</p><p>实例:</p><p>/ControlPanel/airconditioner/consolel/Warning</p> |

### 属性

|属性名 | 签名 | 值列表 | 可读/可写 | 描述 |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | 只读 | 接口版本 |
| States | `u` | Bit mask | 只读 | 众多组建状态的掩码。状态掩码信息在下面会有详细说明。 |
| Label | `s` | N/A | 只读 | 文本标签 |
| OptParams | `a{qv}` | N/A | 只读 | 元数据字典，详细信息请参见  [LabelProperty widget metadata][labelproperty-widget-metadata]  |

**状态属性位掩码信息**

| 掩码 | 名称 | 描述 |
|---|---|---|
| 0x01 | enabled | 指示部件是否被启用。未启用的部件应被标为灰色或不可见。|

#### LabelProperty 组件元数据

| 字典键值 | 字段名 | 签名 | 描述 |
|:---:|---|:---:|---|
| 1 | bgColor | `u` | 由 RGB 值表达的背景颜色。如果尚未指定背景，则使用封闭容器的背景颜色。 |
| 2 | hints | `aq` | 组件绘制提示，详细信息请参阅 [LabelProperty widget hints][labelproperty-widget-hints]. |

#### LabelProperty 组件提示

| 提示 ID | 提示名 | 描述 |
|:---:|---|---|
| 1 | TextLabel | 只读的文字标签 |

### 方法

没有方法被暴露到此接口。

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
   <interface name="org.alljoyn.ControlPanel.LabelProperty">
      <property name="Version" type="q" access="read"/>
      <property name="States" type="u" access="read"/>
      <property name="Label" type="s" access="read"/>
      <property name="OptParams" type="a{qv}" access="read"/>
      <signal name="MetadataChanged" />
   </interface>
</node>
```

## 行为接口

此接口为属性部件提供了控制机制。每一个部件都被实现此接口的一个 AllJoyn 对象所代表。行为组件可以选择在自己的对象子树中提供一个允许在该行为 的 UI 表达被激活的任意时间里弹出对话框的确认对话框组件。在确认对话框中发生的行为将会代替对这个行为组件的 `Exec` 方法调用。

### 接口名
 
| 接口名 | 版本 | 是否安全 | 对象路径 |
|---|:---:|:---:|---|
| `org.alljoyn.ControlPanel.Action` | 1 | no | <p>`/ControlPanel/{unit}//{panel}/{language}/.../{object name}`</p><p>Example:</p><p>/ControlPanel/{unit}/{panel}/{language}/.../{object name}</p>  |
| `org.alljoyn.ControlPanel.SecuredAction` | 1 | yes | `/ControlPanel/{unit}/{panel}/{language}/.../{object name}` |

### 属性

|属性名 | 签名 | 值类型 | 可读/可写 | 描述 |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | 只读 | 接口版本号 |
| States | `u` | Bit mask | 只读 | 众多组建状态的掩码。状态掩码信息在下面会有详细说明。 |
| OptParams | `a{qv}` | N/A | 只读 | 元数据字典，详细信息请参见 [Action widget metadata][action-widget-metadata]. |

**状态属性位掩码信息**

| 掩码 | 名称 | 描述 |
|---|---|---|
| 0x01 | enabled | 指示部件是否被启用。未启用的部件应被标为灰色或不可见。|

#### 行为组件元数据

| 字典键值 | 字段名 | 签名 | 描述 |
|:---:|---|:---:|---|
| 0 | label | `s` | 标签 |
| 1 | bgColor | `u` | 由 RGB 值表达的背景颜色。如果尚未指定背景，则使用封闭容器的背景颜色。 |
| 2 | hints | `aq` | 组件绘制提示，详细信息请参阅 [Action widget hints][action-widget-hints]. |

#### 行为组件提示

| 提示 ID | 提示名 | 描述 |
|:---:|---|---|
| 1 | ActionButton | 与一个行为或者方法调用相关联的按钮，例如“提交” |

### 方法

#### `Exec`

**消息参数**

无。

**回复参数**

无.

**描述**

执行行为命令。

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
   <interface name="org.alljoyn.ControlPanel.Action">
      <property name="Version" type="q" access="read"/>
      <property name="States" type="u" access="read"/>
      <property name="OptParams" type="a{qv}" access="read"/>
      <signal name="MetadataChanged" />
      <method name="Exec"/>
   </interface>
</node>
```

## NotificationAction 接口

此接口指示着该对象是否是一个提醒行为对象。提醒对象一般会在一个提醒消息中被引用。根据收到的提醒，控制方可以根据此类型对象提供的元数据来生成
提醒行为面板。此对象不同于其他的常规控制面板，因为他可以允许被控制方向控制方发送告知解散面板的信号。

此对象支持至少一种语言。内省子对象以定位对应给定面板的指定语言代码的根容器应当由控制方完成。

### 接口名
 
| 接口名 | 版本 | 是否安全 | 对象路径 |
|---|:---:|:---:|---|
| `org.alljoyn.ControlPanel.NotificationAction` | 1 | 否 | <p>`/NotificationPanel/{unit}/{actionPanelName}`</p><p>Example:</p><p>/NotificationPanel/washing/CycleCompleted</p> |

### 属性

|属性名 | 签名 | 值类型 | 可读/可写 | 描述 |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | 只读 | 接口版本号 |


### 信号

#### `Dismiss`

Dismess 信号不是非会话信号。

**消息参数**

无。

**描述**

控制方必须解散此控制面板

### 内省 XML

```xml
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.ControlPanel.NotificationAction">
      <property name="Version" type="q" access="read"/>
      <signal name="Dismiss" />
   </interface>
</node>
```

## 会话接口

此接口对指导控制方为对话部件渲染 UI 提供了所有的元数据。对话部件通常有一个消息和最多三个行为按钮。

### 接口名
 
| 接口名 | 版本 | 是否安全 | 对象路径 |
|---|:---:|:---:|---|
| `org.alljoyn.ControlPanel.Dialog` | 1 | no | <p>`/ControlPanel/{unit)/{panelName}/{language}/.../{dialogName}`</p><p>Example:</p><p>/ControlPanel/washing/mainPanel/en/Confirmation</p> |
| `org.alljoyn.ControlPanel.SecuredDialog` | 1 | 是 | `/ControlPanel/{unit}/{panel}/{language}/.../{dialogName}` |

### 属性


|属性名 | 签名 | 值类型 | 可读/可写 | 描述 |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | 只读 | 接口版本号 |
| States | `u` | Bit mask | 只读 | 众多组建状态的掩码。状态掩码信息在下面会有详细说明。 |
| OptParams | `a{qv}` | N/A | 只读 | 元数据字典，详细信息请参见 [Dialog widget metadata][dialog-widget-metadata]. |
| Message | `q` | N/A | 只读 | 显示消息。 |
| NumActions | `q` | 1-3 | 只读 | 可用行为的数量。 |

**状态属性位掩码信息**

| 掩码 | 名称 | 描述 |
|---|---|---|
| 0x01 | enabled | 指示部件是否被启用。未启用的部件应被标为灰色或不可见。|

#### 对话组件元数据

| 字典键值 | 字段名 | 签名 | 描述 |
|:---:|---|:---:|---|
| 0 | label | `s` | 标签。 |
| 1 | bgColor | `u` | 由 RGB 值表达的背景颜色。如果尚未指定背景，则使用封闭容器的背景颜色。 |
| 2 | hints | `aq` | 组件绘制提示，详细信息请参阅 [Dialog widget layout hints][dialog-widget-layout-hints]. |
| 6 | labelAction1 | `s` | 行为1 组件的标签。 |
| 7 | labelAction2 | `s` | 行为2 组件的标签。 |
| 8 | labelAction3 | `s` | 行为3 组件的标签。 |

#### 对话组件布局提示

| 提示 ID | 提示名 | 描述 |
|:---:|---|---|
| 1 | AlertDialog | 将标签，文本数据以及按钮集成到一个对话框里面的部件。需要至少一个按钮，支持最多三个按钮。 |


### 方法

#### `Action1`

**消息参数**

无。

**回复参数**

无。

**描述**

执行行动1

#### `Action2`

**消息参数**

无。

**回复参数**

无 

**描述**

执行行动2

**错误回复**

| 错误 | 描述 |
|---|---|
| `org.alljoyn.Error.MethodNotAllowed` |  NumActions 属性小于2则返回。|

**消息参数**

无。

**回复参数**

无 

**描述**

执行行动 3. 

**错误回复**

| 错误 | 描述 |
|---|---|
| `org.alljoyn.Error.MethodNotAllowed` | NumActions 属性小于3则返回。 |

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

## ListProperty 接口

此接口为列表属性组件提供控制机制。列表属性组件含有记录列表以及代表记录的显示/输入格式的容器。

### 接口名
 
| 接口名 | 版本 | 是否安全 | 对象路径 |
|---|:---:|:---:|---|
| `org.alljoyn.ControlPanel.ListProperty` | 1 | no | <p>`/ControlPanel/{unit}/{language}/{panel}/{object name}`</p><p>Example:</p><p>/ControlPanel/sprinkler/mainPanel/en/Schedules</p> |
| `org.alljoyn.ControlPanel.SecuredListProperty` | 1 | 是 | `/ControlPanel/{unit}/{language}/{panel}/.../{object name}` |

### 属性

|属性名 | 签名 | 值类型 | 可读/可写 | 描述 |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | 只读 | 接口版本号 |
| States | `u` | Bit mask | 只读 | 众多组建状态的掩码。状态掩码信息在下面会有详细说明。 |
| OptParams | `a{qv}` | N/A | 只读 | 元数据字典，详细信息请参见 [ListProperty widget metadata][listproperty-widget-metadata]. |
| Value | `a{qs}` | N/A | 只读 | <p>记录列表。列表中的每一条记录都有以下字段：</p><ul><li>recordID ('q'): 记录 ID</li><li>label ('s'): 列表上显示的标签</li></ul><p>在此属性中，记录的数据不被暴露。 调用 `View` 方法可以查看每一条记录</p> |

**状态属性位掩码信息**

| 掩码 | 名称 | 描述 |
|---|---|---|
| 0x01 | enabled | 指示部件是否被启用。未启用的部件应被标为灰色或不可见。|

#### ListProperty 组件元数据

| 字典键值 | 字段名 | 签名 | 描述 |
|:---:|---|:---:|---|
| 0 | label | `s` | 标签。 |
| 1 | bgColor | `u` | 由 RGB 值表达的背景颜色。如果尚未指定背景，则使用封闭容器的背景颜色。 |
| 2 | hints | `aq` | 组件绘制提示，详细信息请参阅 [ListProperty widget hints][listproperty-widget-hints]. |

#### ListProperty 组件提示

| 提示 ID | 提示名 | 描述 |
|:---:|---|---|
| 1 | DynamicSpinner | 允许用户从列表中选择一个选项，添加一个新的选项，删除一个选项以及更新一个选项的组件。|

### 方法

#### `Add`

**消息参数**

无。

**返回参数**

无。

**描述**

为向列表加入新的记录做输入准备。UI 要求如下：

* 控制方必须呈现一个 OK 按钮，并将其绑定到调用 `Confirm` 方法。完成输入表格的添加行为将会在列表上添加一个新的记录。 
* 控制方必须呈现一个 OK 按钮，并将其绑定到调用 `Cancel` 方法，使得操作可以被取消。

#### `Delete('q')`

**消息参数**

| 参数 | 参数名 | 返回签名 | 值列表 | 描述 |
|:---:|---|:---:|---|---|
| 0 | recordID | `q` | positive | 记录的 ID. |

**返回参数**

无。

**描述**

在删除前准备用于查阅的表格。UI 要求如下：
* 控制方必须呈现一个 OK 按钮，并将其绑定到调用 `Confirm` 方法。行为确认后将会从列表中删除该记录。
* 控制方必须呈现一个 OK 按钮，并将其绑定到调用 `Cancel` 方法，使得操作可以被取消。


#### `View('q')`

**消息参数**

| 参数 | 参数名 | 签名 | 值列表 | 描述 |
|:---:|---|:---:|---|---|
| 0 | recordID | `q` | positive | 记录的 ID. |

**返回参数**

无。

**描述**

为观看由记录 ID 识别的记录准备需要显示的表格。控制方必须呈现用于结束这次观看。

#### `Update('q')`

**输入**

| 参数 | 参数名 | 签名 | 值列表 | 描述 |
|:---|---|---|---|---|
| recordID | yes | q | positive | 记录的 ID. |

**返回参数**

无。

**描述**

为观看由记录 ID 识别的记录准备输入表格，允许终端用户修改字段。UI 要求如下：

* 控制方必须呈现一个 OK 按钮，并将其绑定到调用 `Confirm` 方法。行为确认后将会更新指定记录。
* 控制方必须呈现一个 OK 按钮，并将其绑定到调用 `Cancel` 方法，使得操作可以被取消。

#### `Confirm`

**消息参数**

无。

**返回参数**

无。

**描述**

确认此次行为并保存所提出的更改。

控制方必须呈现一个 Cancel 按钮，用于结束这次观看。

#### `Cancel`

**消息参数**

无。

**返回参数**

无。

**描述**

取消此次行为。

控制方必须呈现一个 Cancel 按钮，用于结束输入表格。

### 信号

#### `MetadataChanged`

MetadataChanged 信号不是非会话信号。

**消息参数**

无。

**描述**

元数据已经改变。任何属性对象的改变都会引起元数据改变

#### `ValueChanged`

ValueChanged 信号不是非会话信号。

**消息参数**

无。

**描述**

属性值已经改变。由于列表数据可能很大，此信号不会立即发送当前值。


### 内省 XML

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

## 对现存 HTTP 控制页面的支持

如果设备已经有运行在其上的 HTTP 控制页面，他可以通过 HTTPControl 接口将这些页面推广。

该接口提供关于设备上运行的 HTTP 控制页面的所有信息。

### 接口名
 
| 接口名 | 版本 | 是否安全 | 对象路径 |
|---|:---:|:---:|---|
| `org.alljoyn.ControlPanel.HTTPControl` | 1 | no | `/Control/{unit}/HTTPControl` |

### 属性

| 属性名 | 签名 | 值列表 | 可读/可写| 描述 |
|---|:---:|---|---|---|
| Version | `q` | Positive integers | 只读 | 接口版本号 |

### 方法

#### `s GetRootURL`

**消息参数**

无。

**回复参数**

| 参数 | 参数名 | 返回签名 | 值列表 | 描述 |
|:---|---|:---:|---|---|
| 0 | url | `s` | N/A | 控制页面的根 URL |

### 信号

此接口不发出任何信号。

###内省 XML

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
