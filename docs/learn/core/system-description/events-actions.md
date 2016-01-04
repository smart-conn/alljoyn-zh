# Events and Actions

## 概览

事件和行为功能是 AllJoyn&trade Core 的一部分，他被设计用于在 AllJoyn 网络中创建基于 If-This-Then-That (IFTTT) 的逻辑规则。

*  AllJoyn 设备/应用程序在网络有重要事件发生时使用事件来提醒其他设备，应用程序。
*  行为使在 AllJoyn 网络中的事件被检测到时，系统可以做出特定的回应。这样一来，二者可以协同作用，行为是使应用程序或设备做具体工作的一个方法。

例如，AllJoyn 应用程序可以广播发送指示着有情况已发生的事件，例如动作传感器检测到移动。AllJoyn 应用程序就可以收到此事件，并通过采取特定的行
为来作出回应，例如打开安全照相机。

事件由 AllJoyn 中的 AllJoyn 非会话信号实现，而行为由 AllJoyn 的方法实现。在 AllJoyn 内省 XML 格式中添加了一个描述元素，用于对事件和行为的功
能提供可读的文本。

下图展示了事件和行为功能的脉络架构。

![events-actions-arch][events-actions-arch]

**Figure:** 事件和行为
事件和行为是通过使用 org.allseen.Inrospectable 接口在 Annoucement 信号中被广播的。任何支持事件发出接口或者行为接收接口的被
广播设备会将此次的新接口加入到 Announcement 信号当中呢。正在验证的应用程序是一个支持 AllJoyn 的应用程序，他为创建用于 IoE 网络自动化的基于 IFTTT 的规则提供了图形界面。正在验证的应用程序通过发出事件和（或者）可以接收行为的 AllJoyn 设备来接收 Announcement 消息。

应用程序将那些设备进行内省，以检索对事件和行为的人类可读的描述，作为增强的 XML 内省数据的一部分。

这些人类可读的文本描述细节可以被呈现给用户，从而使用户可以创建用于 IoE 网络自动化的基于 IFTTT 的规则。这些 IFTTT 规则通过一个 Rule Engine 进行配置，此 Rule Engine 可以与该 Authoring 应用程序在同一个设备上，也可在不同的设备上。


**NOTE:** Rule Engine 不在目前的设计范围内，他的实现留给生态系统来完成。Rules Engine 应用程序会探测到被发出的应用程序。根据配置好的 IFTTT 规则，此引擎在 action-receiving 设备上执行行为（方法调用）。

## 加强版内省 XML

AllJoyn 系统通过 org.freedesktop.DBus.Introspectable 接口支持由 D-Bus 规范定义的内省 XML 格式。为了使事件和行为可被发现，此处提供了可以提供 人类可读描述的加强版 AllJoyn 内省 XML. 此 XML 提供了可以适用于对象，接口，方法（包括参数），信号（包括参数）以及属性的描述元素。

此描述元素可能出现在加强版内省 XML 的内部，在被捕获的 [Elements carrying description element][elements-carrying-description-element] 元素下。

#### 携带描述元素的元素

| XML 元素 | 描述 |
|---|---|
| node | Objects and sub-objects within the tree of objects.在对象树之内的对象和子对象 |
| interface | 接口元素 |
| method | 方法元素 |
| property | 属性元素 |
| signal | 信号元素 |
| arg | 信号及方法的 arguments |

此外，加强版内省 XML 也包含 sessionless="true|false" 的属性，信号元素可借此指示是否为非会话信号。

以下是加强版内省 XML 格式的一个例子：

```xml
<node name="/com/example/LightBulb">
    <description>Your lightbulb</description>
    <interface name="com.example.LightBulb">
        <description>Provides basic lighting functionality</description>
        <method name="ToggleSwitch">
            <description>Invoke this to toggle whether the light is on or off</description>
            <arg name="brightness" type="i" direction="in">
                <description>A value to specify how bright the bulb should shine</description>
            </arg>
        </method>
        <signal name="LightOn" sessless="true">
            <description>Emitted when the light turns on</description>
        </signal>
        <property name="LightState" type="y" access="read">
            <description>The current state of this light bulb</description>
        </property>
    </interface>
    <node name="child">
        <description>Some relevant description</description>
    </node>
</node>
```

## 内省的接口

org.allseen.introspectable 接口用于提供到包含描述元素的加强版内省 XML 的访问。 下表提供了由所有 AllJoyn 对象所实现的 org.allseen.introspectable 接口的定义：

### 内省接口的方法

| 方法 | 描述 |
|---|---|
| AttachSession | 返回此对象所包含描述的语言类别总集。例如，如果一个对象实现两个接口，X 和 Y - X 的所有成员均用英语（en）和法语（fr）描
述，Y 有一些英语（en）的描述，也有一些中文（cn）的描述，此方法将会返回["en","fr","cn"].语言标签将会依照 IETF 的语言标签标准。|
| IntrospectWithDescription | 返回之前定义的 XML 以及由特定语言表达的描述(准确匹配，非最佳)。如果一个元素，例如，一个方法，没有用此语言生成 的描述，则此元素内不会被放置任何描述。|

### Introspectable.AttachSession 方法参数

| 参数名 | 方向 | 描述 |
|---|---|---|
| languageTags | out | 对象所拥有的所有语言描述的语种列表 |

### Introspectable.IntrospectWithDescription 方法参数

| 参数名 | 方向 | 描述 |
|---|---|---|
| languageTag | in | 被请求的语言种类 |
| data | out | 返回的 XML 内省 |



[elements-carrying-description-element]: #elements-carrying-description-element

[events-actions-arch]: /files/learn/system-desc/events-actions-arch.png
