# 数据交换

## 概览

AllJoyn&trade; 提供方应用程序实现一个或多个提供服务功能的服务对象。这些服务对象又会实现一个或多个支持将方法，信号，以及/或者属性作为接口成员的总线接口。AllJoyn 应用程序可以使用这些接口成员来进行数据交换。除非会话信号以外，提供方和使用方应用程序之间的数据交换必须通过建立 AllJoyn 会话来完成。
(参见[Sessionless Signal][sessionless-signal]). 

**NOTE:** AllJoyn 服务对象不被绑定到任何 AllJoyn 会话。任何服务对象都可以通过任意 AllJoyn 会话被访问。

下图展示了提供方应用程序的功能性结构。

![provider-functional-arch][provider-functional-arch]

**Figure:** 提供方功能性结构

结构所遵循的方面：

* 每一个服务对象都有一条相关的对象路径，应用程序可以决定是否将此路径作为 About 功能中的 Announcement 信号的一部分公布。
* 一个提供方设备可以主持一个或多个 AllJoyn 会话。
* 提供方应用程序为每一个自己主持的会话保留一个唯一的会话端口和会话 ID，以及其他参数。
* 连接到 AllJoyn 路由的提供方应用程序的终端有一个相关的唯一标识符，以及一个或多个通过应用程序推广的 well-known names.
* AllJoyn 路由保留与会话相关的状态信息。 

此信息被用于为 AllJoyn 消息提供基于会话 ID 的路由功能。

一旦会话被建立，提供方应用程序可以通过被使用方调用的接口方法和属性与使用方应用程序进行通信。提供方应用程序也可发送在总线接口中声明了的信号，以向使用方应用程序发送数据。

AllJoyn 会话被建立之后，使用方应用程序已经建立了可以与提供方应用程序交换数据的连接。处于一个会话中的使用方应用程序可以调用远端服务对象上的方法和属性，也可选择性地接收提供方应用程序发送的信号。通过方法和属性交换数据需要一个 ProxyBusObject.从提供方应用程序接收信号需要一
个信号处理器。

下图展示了使用方应用程序的功能性结构。


![consumer-functional-arch][consumer-functional-arch]

**Figure:** 使用方功能性结构

结构所遵循的方面：

* 一个使用方应用程序可以加入一个，或由相同或不同的提供方应用程序发起的多个 AllJoyn 会话中。
* 使用方应用程序创建一个或多个代理对象，没一个需要通信的远端服务对象都需要一个代理对象。
* 代理对象是所需远端服务的一个本地代表。
* 创建代理对象需要提供服务的对象路径，提供方应用程序的唯一识别符以及会话 ID 信息。
* 对于一个服务器对象中指定的信号名，使用方应用程序需向 AllJoyn 路由注册指定的信号处理器，以接收提供方的信号。 
* 当一个特定的信号被接收后，指定的信号处理器会被调用。
* 连接到 AllJoyn 路由的使用方应用程序端点有一个相关的唯一名称。
* AllJoyn 路由会保存与参与的会话有关的状态信息。此信息被用来路由基于 sessionID 的消息。

## 通过方法交换数据

下列用例表达了通过方法调用完成的数据交换啊过程。

* 提供方应用程序发送一条回复。
* 提供方应用程序没有发送一条回复。

### 提供方应用程序发送一条回复

下图展示了在一个使用方远程调用提供方应用程序上的方法，实现数据交换的场景中的消息流。一个 METHOD_RETURN 回复消息将发送回使用方应用程序。

![data-exchange-method-calls-reply-sent][data-exchange-method-calls-reply-sent]

**Figure:** 通过方法调用的数据交换 (reply sent)

消息流的描述如下：

1. 提供方和使用方的应用程序都需要连接到 AllJoyn 路由，并且执行推广与发现过程，以便发现所需要的服务。
2. 提供方应用程序向 AllJoyn 核心库注册自己的服务对象，以便向网络上的远程节点暴露服务对象。AllJoyn 核心库对所有与给定服务对象有关的方法添加
一个 MethodHandler.
3. 提供方应用程序将 AllJoyn 路由与一个会话端口通过 AllJoyn 核心库中的 BindSessionPort API 绑定。此调用将会指定一个会话端口，会话选项，以及
一个针对此会话的 SessionPortListner.
4. 提供方与使用方应用程序执行 AllJoyn 服务推广与服务发现，以便发现提供方提供的服务。
5. 使用方应用程序通过绑定的会话端口与提供方应用程序建立一个 AllJoyn 会话。到此为止，在使用方和提供方之间已经有一条建立好的会话。
6. 使用方应用程序通过 AllJoyn 核心库中的 GetProxyBusObject API 创建一个 proxyBusObject. 此应用程序向提供方应用程序指定一个唯一识别符，向服
务对象指定一个对象路径，会话 ID 以及代理对象应当回应的 BusInterfaces 列表。
7. 使用方应用程序由已创建的代理对象获得 BusInterface, 并调用此 BusInterface 上的一个方法。此应用程序向此方法提供输入参数。
8. ProxyBusObject:MethodCall 方法被调用，可以为方法调用生成一个 AllJoyn METHOD_CALL 消息。
9. 代理对象向 AllJoyn 路由发送生成的 METHOD_CALL 消息。
10. AllJoyn 路由收到了消息，并根据消息中的会话 ID/ 目的地信息决定消息应该被路由到哪里。在本例中，消息需要被路由到在提供方上的远端 AllJoyn 路由端点。
11. AllJoyn 路由通过已建立的会话连接向远端的 AllJoyn 路由发送 METHOD_CALL 消息。METHOD_CALL 消息包括一个序列号，在 interfaceName 范围中的
会员名（方法名），以及发送方的唯一识别符，作为消息的头文件。
12. 提供方的 AllJoyn 路由接收到了 METHOD_CALL 消息。这里根据会话 ID 和目的地信息决定了消息将要被路由到的地点，在本例中，消息需要被路由到 AllJoyn 核心库应用程序的端点。
13. AllJoyn 路由向 AllJoyn 核心库端点发送 METHOD_CALL.
14. AllJoyn 核心库对在接收到的消息中被声明的方法调用成员调用已注册的 MethodHandler. MethodHandler 调用存在于这些对象中的 BusInterface 中的 实体方法，并接收方法的回应。随后他生成一个 METHOD_RETURN 消息作为方法的回应，并发送到 AllJoyn 路由。
15. AllJoyn 路由接收到 METHOD_RETURN 消息，并根据消息中包含的会话 ID / 目的地信息决定消息应该被路由到哪里。在此例中，消息需要被路由到使用方
的远端 AllJoyn 路由器端点。
  * 提供方路由器向远端的 AllJoyn 路由器通过已建立的会话连接发送 METHOD_RETURN 消息。此消息包括一个回复的序列号（与 METHOD_CALL 相关联），
   会话 ID 以及发送方的唯一识别符，作为消息头字段的一部分。任何由 METHOD_RETURN 输出的参数都在消息 body 中被声明。  
  * 使用方 AllJoyn 路由接收到 METHOD_RETURN 消息，并根据消息中的会话 ID/ 目的地信息决定消息应该被路由到哪里。在本例中，消息需要被路由到应用 程序的端点。
  * AllJoyn 路由向应用程序的端点发送带有输出参数的 METHOD_RETURN 消息，作为原始 METHOD_CALL 消息的响应。如果 METHOD_CALL 消息是异步发送的，
  在 METHOD_RETURN 消息被接收时被调用的 ReplyHandler 将会被注册。

### 提供方应用程序没有发送回复

在定义接口的定义时，提供方可以对不返回任何输出参数的方法添加 NO_REPLY_EXPECTED 的注释。对于这些方法，提供方应用程序不会向使用方应用程序发送
METHOD_RETURN 消息。在这些方法被调用时，使用方应标明 NO_REPLY_EXPECTED 标识，以便向 AllJoyn 核心库指明不需要计时并等待回复。

下图展示了当一个带有 NO_REPLY_EXPECTED 标识的方法被调用，提供方应用程序不发送回复的场景中的消息流程。


![data-exchange-method-calls-reply-not-sent][data-exchange-method-calls-reply-not-sent]

**Figure:** 方法调用时的数据交换 (无回复)

大多数返回方法回复的消息流都与发送回复的消息流类似。下图描述了两者的区别。

1. 在定义一个服务接口时，提供方应用程序会将一个或多个方法注释为 NO_REPLY_EXPECTED. 实现服务接口的服务对象在 AllJoyn 核心库中被注册。
2. 在使用方一边，当方法通过 ProxyObject 接口被调用，使用方会设置 NO_REPLY_EXPECTED 标识，指示 AllJoyn 核心库无需计时并等待回复。
3. METHOD_CALL 消息到达提供方应用程序，相关方法被调用。由于方法被注释了 NO_REPLY_EXPECTED，提供方应用程序不会生成回复。

## 通过信号的数据交换

下图描述了使用方应用程序注册并从提供方应用程序接收信号以交换数据场景中的消息流。


![data-exchange-signals][data-exchange-signals]

**Figure:** 通过信号的数据交换

只要 sessionID 已被 header（无 destination 字段） 声明，信号会被发送到会话中所有的参与方。

如果 header 字段中已经指明了一个特定的参与者地址，则信号只会被送往该参与者。

消息流如下：
1. 提供方和使用方的应用程序都需要连接到 AllJoyn 路由，并且执行推广与发现过程，以便发现所需要的服务。
2. 提供方应用程序向 AllJoyn 核心库注册自己的服务对象，以便向网络上的远程节点暴露服务对象。AllJoyn 核心库对所有与给定服务对象有关的方法添加
一个 MethodHandler.
3. 提供方应用程序将 AllJoyn 路由与一个会话端口通过 AllJoyn 核心库中的 BindSessionPort API 绑定。此调用将会指定一个会话端口，会话选项，以及
一个针对此会话的 SessionPortListner.
4. 提供方与使用方应用程序执行 AllJoyn 服务推广与服务发现，以便发现提供方提供的服务。
5. 使用方应用程序通过绑定的会话端口与提供方应用程序建立一个 AllJoyn 会话。到此为止，在使用方和提供方之间已经有一条建立好的会话。
6. 使用方应用程序通过调用 AllJoyn 核心库中的 RegisterSignalHandler API 注册一个用于接收提供方服务对象发出的特定信号的信号处理器。应用程序为
接口声明了接口名，包括信号，信号名，接收信号的对象的对象路径，信号处理器方法，以及信号发射源的源对象路径。
7. AllJoyn 核心库调用一个 AllJoyn 路由的 AddMatch 方法，以将接收信号规则注册。此规则声明了 type=signal, 接口名，信号成员名，以及生成信号的
对象的源对象路径。
8. 当提供方应用程序有信号需要发送时，他会调用 BusObject Signal(...)，并声明所有的信号参数。此调用会生成一个 AllJoyn SIGNAL 信号。
9. SIGNAL 信号被发送到 AllJoyn 路由。
10. AllJoyn 路由接收到 SIGNAL 消息，并根据消息中的会话 ID/ 目的地信息决定消息应该被路由到哪里。在本例中，消息需要被路由到在使用方上的远端 AllJoyn 路由端点。
11. 使用方 AllJoyn 路由接收到信号，并根据注册的匹配规则将信号过滤。在本例中，该信号符合匹配规则。AllJoyn 路由将接收到的 SIGNAL 消息发送到
AllJoyn 核心库应用程序端点。
12. 对于传递接受到的消息参数的信号，AllJoyn 核心库调用注册的信号处理器。 

## 通过属性的数据交换

提供方与使用方应用程序可以通过定义在服务对象 BusInterfaces 中的属性成员来实现数据交换。一个属性成员有预先获得并设定好的方法调用，以获取属性
值，为属性设定一个特定的值。使用方应用程序可以调用这些，并设置对于这些属性的方法调用，以便交换数据。

若想调用这些属性方法，关于方法的消息流细节参见 [Data exchange via methods][data-exchange-via-methods].

## 信号与 (无回应的方法调用)

理解信号与无回应的方法调用之间的区别很重要。在两个概念中，信号消息都是由源被发送出去的；但是他们是有很大不同的。最主要的区别之一是：两者是
发送到不同的方向的。SIGNAL 消息由提供方应用程序发出，而 METHOD_CALL 消息由使用方应用程序发出。除此之外，SIGNAL 信号在发送时，可选择发送到一 个或者多个目的地，但是 METHOD_CALL 消息只能发到一个单个的目的地。


## 匹配规则

AllJoyn 框架支持 D-Bus 匹配规则，使用方可以请求并接收特定种类的消息。匹配规则描述了根据消息内容，消息应该被送往哪些使用方应用程序的规则。匹配规则常常被用于接收一个特定的信号消息集。使用方应用程序可以通过定义信号的过滤/匹配规则来向 AllJoyn 路由请求接收特定集合的信号。

送往特定目的地的信号不需要与使用方的匹配规则相匹配。相反的，匹配规则被用于在发送时没有指明目的地的信号；他们有意被多个端点接收。这些信号包括广播信号，非会话信号以及在会话中被送往多个参与方的指定会话信号。这些信号只会被送往有相宜的匹配规则的使用方应用程序。这避免了不必要的唤醒
以及使用方应用程序端处理信号的操作。

使用方应用程序可以通过使用由 AllJoyn 路由暴露的 AddMatch 方法来添加一条匹配规则。匹配规则由一个以逗号分隔的 key/value 对字符串构成。将 key
从规则中去掉将指示着一个万用字符，例如，将成员的 key 从匹配规则中去掉并加入一个发送方，将会使来自此发送方的所有消息通过。

例如：

```c
Match Rule = 
"type='signal',sender='org.freedesktop.DBus',interface='org.freedesktop.DBus',
member='Foo',path='/bar/foo',destination=':452345.34'"
```

AllJoyn 框架支持一个 D-Bus 匹配规则的子集，参见 [Match rule keys supported by the AllJoyn framework][match-rule-keys]. 

**NOTE:** AllJoyn 不支持 D-Bus 匹配规则中定义的 arg[0,1...N], arg[0,1,...N]路径, arg0namespace 以及 eavesdrop='true'.

### AllJoyn 框架中支持的匹配规则中的 keys

| Match key | 值 | 描述 |
|---|---|---|
| type | <ul><li>signal</li><li>method_call</li><li>method_return</li><li>error</li></ul> | 匹配消息类型。例如 type='signal'. |
| sender | 一个 well-known name 或者唯一识别符 | 匹配一个指定的发送方。例如 sender='org.alljoyn.Refrigerator'. |
| interface | 一个接口名 | 匹配一个发送消息经过或到达的指定接口，例如 interface='org.alljoyn.Refrigerator'. 如果一条消息省略了接口 header， 他将不得匹配任何声明了此 key 的规则。 |
| member | 任何有效的方法或信号名 | 匹配有给定方法或信号名的信号。例如 member='NameOwnerChanged'. |
| path | 一条对象路径 | 匹配发送或来自给定对象的消息。例如 path='/org/alljoyn/Refrigerator'. |
| path_namespace | 一条对象路径 | <p>匹配发送或来自一个路径为一个给定值或者一个值伴随一个或多个路径组件的对象路径的消息。例如 path_namespace='/com/example/foo' 将会匹配来自 /com/example/foo 或者 /com/example/foo/bar 的消息, 但不会匹配来自 /com/example/foobar 的消息.</p><p>不允许在一条匹配规则中同时使用路径和路径_命名空间的组合。</p> |
| destination | 一个唯一识别符 | 匹配发送到给定唯一识别符的消息。例如 destination=':100.2'. |

An application can add multiple match rules for signals with the 
AllJoyn router. In this case, the app is essentially requesting 
to get signal messages based on multiple filtering criteria, and 
all match rules are applicable. As a result, the signal messages 
get sent to the app if they matches any of the specified match rules. 

The AllJoyn router sends a union of messages to the app that 
matches with the specified rules. For example, if there is a 
more restrictive rule that matches a small set of signals, 
and there is another less restrictive rule that matches a 
larger superset of signals, the AllJoyn router always sends 
the larger superset of signals to the app.

## Type system 

The AllJoyn framework uses the D-Bus protocol type system 
which allows values of various types to be serialized in a 
standard way into a sequence of bytes referred to as the 
wire format. Converting values from some other representation 
into the wire format is called marshaling, and converting it 
back from the wire format is called unmarshaling. 

The AllJoyn framework uses D-Bus marshaling format.

### Type signatures

The AllJoyn framework uses the same type signatures that 
are used by the D-Bus protocol. The type signature is made 
up of type codes. The type code is an ASCII character that 
represents a standard data type. 

#### Data types supported by the AllJoyn framework

| Conventional name | Code | ASCII | Description |
|---|---|---|---|
| INVALID | 0 | NUL | Not a valid type code, used to terminate signatures. |
| BYTE | 121 | 'y' | 8-bit unsigned integer. |
| BOOLEAN | 98 | 'b' | Boolean value, 0 is FALSE and 1 is TRUE. Everything else is invalid. |
| INT16 | 110 | 'n' | 16-bit signed integer. |
| UINT16 | 113 | 'q' | 16-bit unsigned integer. |
| INT32 | 105 | 'i' | 32-bit signed integer. |
| UINT32 | 117 | 'u' | 32-bit unsigned integer. |
| UINT64 | 120 | 'x' | 64-bit signed integer. |
| DOUBLE | 100 | 'd' | IEEE 754 double. |
| STRING | 115 | 's' | UTF-8 string (must be valid UTF-8). Must be null terminated and contain no other null bytes. |
| OBJECT_PATH | 111 | 'o' | Name of an object instance. |
| SIGNATURE | 103 | 'g' | A type signature. |
| ARRAY	| 97 | 'a' | Array |
| STRUCT | 114, 40, 41 | 'r', '(', ')' | Struct |
| VARIANT | 118 | 'v' | Variant type (the type of the value is part of the value itself). |
| DICT_ENTRY | 101, 123, 125 | 'e','{','}' | Entry in a dict or map (array of key-value pairs). |

Four of the types are container types: STRUCT, ARRAY, VARIANT, 
and DICT_ENTRY. All other types are common basic data types. 
When specifying a STRUCT or DICT_ENTRY, 'r' and 'e' should 
not be used. Instead, ASCII characters '(', ')', '{', and '}' 
should be used to mark the beginning and ending of a container.

## Message format

The AllJoyn framework uses the D-Bus message format and 
extends it with additional header flags and header fields 
for AllJoyn messages. The AllJoyn message format is used 
to send messages between AllJoyn routers as well as between 
the application and the AllJoyn router.

Method calls, method replies and signal messages get encapsulated 
in AllJoyn message format. D-Bus defined METHOD_CALL, METHOD_RETURN 
and SIGNAL messages are used (with AllJoyn enhancements) for 
transporting these messages respectively. In case of error 
scenarios, an ERROR message is returned in reply to a method 
call (instead of METHOD_RETURN). 

An AllJoyn message consists of a header and a body. 
The following figure shows the AllJoyn message format. 
Definitions for each message format field are provided in subsequent tables.

![alljoyn-message-format][alljoyn-message-format]

**Figure:** AllJoyn message format

### Message format fields supported by the AllJoyn framework

| Field name | Description |
|---|---|
| Endianness Flag | Endianness of the message. ASCII 'l' for little-endian or ASCII 'B' for big-endian. Both header and body are in this endianness. |
| Message Type | Type of message. This field is set per the definitions specified in [Message Type definitions][message-type-definitions]. |
| Header Flags | <p>Provides any applicable flags for the message. This field is bitwise OR of flags. Unknown flags must be ignored.</p><p>This is set per the definitions specified in [Header Flag definitions][header-flag-definitions].</p> |
| Major Protocol Version | AllJoyn major protocol version for the sending application of this message. |
| Message Body Length | Length (in bytes) of the message body, starting from the end of the header. |
| Serial Number | Serial number of this message. This is assigned by the sender and used as a cookie by the sender to identify the reply corresponding to this request. This must not be zero. |
| List of Header Fields | <p>This specifies an array of zero or more header fields where each field is a 1-byte field code followed by a field value.  This is represented as ARRAY of STRUCT of (BYTE, VARIANT). A header must contain the required header fields for its message type, and zero or more of any optional header fields. Implementations must ignore fields they do not understand.</p><p>The AllJoyn framework has extended the list of D-Bus defined header fields. [Header Fields definitions][header-fields-definitions] lists all the header fields supported by AllJoyn and mandatory/optional requirement for these fields for different message types.</p> |
| Message Body | Body of the message. The content of message body is interpreted based on SIGNATURE header field. |

### Message Type definitions

| Name | Value | Description |
|---|:---:|---|
| INVALID | 0 | An invalid type |
| METHOD_CALL | 1 | Method call |
| METHOD_RETURN | 2 | Method reply with returned data |
| ERROR | 3 | Error reply |
| SIGNAL | 4 | Signal emission |

### Header Flag definitions

| Name | Value | Description |
|---|:---:|---|
| NO_REPLY_EXPECTED | 0x01 | <p>Indicates that no reply (method_return or error) is expected for the Method Call. The reply can be omitted as an optimization.</p><p>**NOTE:** The provider app can still send back a reply despite this flag.</p> |
| AUTO_START | 0x02 | <p>Indicates a request to start the service if not running. It is up to the AllJoyn core to honor this or not.</p><p>**NOTE:** This flag is currently not supported.</p> |
| ALLOW_REMOTE_MSG | 0x04 | Indicates that messages from remote hosts should be allowed (valid only in Hello message sent from app to the AllJoyn core). If set by the app, the AllJoyn core allows messages from remote apps/hosts to be sent to the application. |
| (Reserved) | 0x08 | Reserved/Unused |
| SESSIONLESS | 0x10 | Indicates a sessionless signal message |
| GLOBAL_BROADCAST | 0x20 | Indicates a global (bus-to-bus) broadcast signal. Applicable for signal only when SESSION_ID=0. If set, the associated signal gets delivered to all the nodes connected over any session in the proximal network. |
| COMPRESSED | 0x40 | Indicates that the AllJoyn message header is compressed. |
| ENCRYPTED | 0x80 | Indicates that the AllJoyn message body is encrypted. |

### Header Fields definitions

| Name | Field code | Type | Required in | Description |
|---|:---:|:---:|---|---|
| INVALID | 0 | N/A | Not allowed | Not a valid field name (error if it appears in a message). |
| PATH | 1 | OBJECT_PATH | <ul><li>METHOD_CALL</li><li>SIGNAL</li></ul> | Path of the object to send a method call to or path of the object a signal is emitted from. |
| INTERFACE | 2 | STRING | <ul><li>METHOD_CALL</li><li>SIGNAL</li></ul> | Interface to invoke a method call on, or the interface that a signal is emitted from. |
| MEMBER | 3 | STRING | <ul><li>METHOD_CALL</li><li>SIGNAL</li></ul> | The member, either the method name or signal name. |
| ERROR_NAME | 4 | STRING | ERROR | Name of the error that occurred, for error messages. |
| REPLY_SERIAL | 5 | UINT32 | <ul><li>ERROR</li><li>METHOD_RETURN</li></ul> | Serial number of the message this message is a reply to. |
| DESTINATION | 6 | STRING | <ul><li>Optional for SIGNAL</li><li>Required for all other messages</li></ul> | The unique name of the connection this message is intended for. |
| SENDER | 7 | STRING | Required in all messages | The unique name of the sending connection. The message bus fills in this field. |
| SIGNATURE | 8 | SIGNATURE | optional | <p>The data type signature of the message body. This is specified using D-Bus data type system.</p><p>If omitted, it is assumed to be the empty signature implying that the body must be of 0-length.</p> |
| N/A | 9 | N/A | N/A | Unused |
| TIMESTAMP | 10 | UINT32 | optional | Timestamp when the message was packaged. |
| TIME_TO_LIVE | 11 | UINT16 | <p>optional</p><p>If not specified, TTL is assumed to be infinite.</p> | <p>TTL associated with the message. A message gets discarded by the AllJoyn router when the TTL expires.</p><ul><li>For sessionless signal, the TTL value is specified in seconds.</li><li>For other messages, the TTL value is specified in msec.</li></ul> |
| COMPRESSION_TOKEN | 12 | UINT32 | optional | Token generated for the messages with header compression on. |
| SESSION_ID | 13 | UINT32 | optional | <p>Session ID for the session over which this message is being sent.</p><p>If missing, it is assumed to be 0.</p> |

## Message routing

The AllJoyn system supports routing logic to route the following 
categories of messages:

* App-specific messages: These are app-generated messages that 
get routed between app endpoints based on the session ID/destination 
based routing logic described in section 6.9.1.
* Control messages: These messages are generated by the AllJoyn 
router (e.g., AttachSession) that get routed to the local endpoint 
of the AllJoyn router.

### Session ID/destination-based routing   

The AllJoyn system supports message routing based on session ID 
and/or destination fields for app-specific messages. A session 
ID-based routing table is formed and maintained at the AllJoyn 
router for routing messages. A single routing table is maintained 
for all the active sessions. 

Conceptually, for every session ID, the routing table maintains 
a list of destination app endpoints for every app participating 
in the session and next hop bus-to-bus endpoint for those app 
endpoints which are remote. A remote endpoint is attached to 
a different AllJoyn router; however, it can be on the same 
device or on a different device. For destination endpoints that 
are local to the AllJoyn router, no bus-to-bus endpoint is 
maintained in the routing table.

```c
AllJoyn routing table = List (session Id, List (destination app endpoint, 
next hop B2B endpoint))
```

**NOTE:** A given destination endpoint can appear multiple times 
as part of different sessionId entries in an AllJoyn routing 
table. In this case, if there are multiple possible paths to a 
remote destination, different bus-to-bus endpoints can be used 
for the same destination as part of different sessionId entries. 

When selecting a route, sessionId is used first to find a 
matching entry in the routing table. Destination field is used 
next to select a bus-to-bus endpoint (for remote destinations). 

The following figure shows a deployment with two devices having 
an AllJoyn session established between them. All four apps 
are part of the session.

![alljoyn-routing-example][alljoyn-routing-example]

**Figure:** AllJoyn routing example

The AllJoyn router on each of the device maintains a routing 
table. [Sample routing table on provider device][sample-routing-table-on-provider-device] and
[Sample routing table on consumer device][sample-routing-table-on-consumer-device] show sample
AllJoyn routing tables maintained on the provider and consumer 
AllJoyn routers, respectively.

#### Sample routing table on provider device

| Session ID | Destination (app endpoint) | Next hop (B2B endpoint) |
|---|---|---|
| 10 | App1 Endpoint (:100.2) | N/A |
| | App 2 Endpoint (:100.3) | N/A |
| | App 3 Endpoint (:200.2) | B2B Endpoint (:100.4) |
| | App 4 Endpoint (:200.3) | B2B Endpoint (:100.4) |

#### Sample routing table on consumer device

| Session ID | Destination (app endpoint) | Next hop (B2B endpoint) |
|---|---|---|
| 10 | App1 Endpoint (:100.2) | B2B Endpoint (:100.4) |
| | App 2 Endpoint (:100.3) | B2B Endpoint (:100.4) |
| | App 3 Endpoint (:200.2) | N/A |
| | App 4 Endpoint (:200.3) | N/A |

#### Routing table formation

Routing tables are formed based on the bus-to-bus endpoint 
information included in the AttachSession method call. When 
an AllJoyn router receives an AttachSession call, it can be 
from an app trying to form a new session or from a new member 
being added to an existing session. 

* AttachSession for a new session: In this case, the AllJoyn 
router sends an Accept session to the app. (Currently, the 
single-hop use case is captured.)  If the session is accepted, 
it creates a new sessionId. It then adds an entry for that 
sessionId in the routing table with the two participants 
as destinations and bus-to-bus endpoint received in the AttachSession 
as next hop for the remote app endpoint.
* AttachSession from an added member: In this case, the session 
is a multi-point session and the AllJoyn router already has an 
entry for the associated sessionId in the routing table. 
The member from where the AttachSession is received gets added 
as a new destination with the bus-to-bus endpoint in the 
AttachSession as next hop.

#### Routing logic

As described above, the sessionId from the message (if present) 
is used first to find a matching sessionId entry in the routing 
table. Next, the destination field (if present) is used to find 
a matching destination entry to perform the routing. 

The following sections capture the routing logic for different use cases.

##### Routing based on sessionId and destination field

If an app-directed message has a non-zero sessionId as well 
as destination fields, the AllJoyn router first finds that 
sessionId entry in the routing table and then finds the 
destination entry within that sessionId for the message destination. 

* If the destination was a remote endpoint, then the message gets 
sent to the bus-to-bus endpoint specified for that destination in 
the routing table. 
* If the destination is locally attached to the AllJoyn router, 
the message gets directly sent over the local bus connection to 
that destination.

##### Routing based on sessionId field only

If an app-directed message only has a sessionId but no destination 
field, the message gets forwarded to all the destination endpoints 
in that session. The AllJoyn router finds the matching sessionId 
entry in the routing table and send the message to all the destinations 
listed for that session, except the one which sent the message. 
* For remote app endpoints in the session, the message gets 
forwarded to associated bus-to-bus endpoint from the routing table. 
* For locally attached app endpoints in the session, the AllJoyn 
router directly forwards message to those app endpoints over 
the local bus connection. 

##### Routing for sessionId=0

An app-directed message can specify a sessionId=0 or, if no 
sessionId field is included, the AllJoyn router assumes sessionId 
to be 0. The sessionId field value can be zero for any message type. 
For METHOD_CALL, METHOD_RETURN and ERROR messages, the only 
requirement is that the destination field must be specified.  

For messages with sessionId=0 (or no specified sessionId), 
if a destination field is specified, the AllJoyn router selects 
any available route from the routing table (from any of the 
session entry containing that destination) and forwards the 
message over the bus-to-bus endpoint for that route.

For SIGNAL messages with sessionId=0 (or no specified sessionId), 
the destination field does not need to be present. In this case, 
the AllJoyn router looks at the GLOBAL_BROADCAST flag in the message 
to determine how that SIGNAL message should be routed per logic below: 

* GLOBAL_BROADCAST Flag set: The SIGNAL message should be globally 
broadcast to all connected endpoints over any session. The Destination 
field is not looked at when routing such a signal message. The AllJoyn 
router sends this message to all destination endpoints from the 
routing table across all sessionIds. 
* For remote destinations, the SIGNAL message gets forwarded to 
the associated bus-to-bus endpoint. 
* For locally connected destination, the message gets forwarded 
directly to the app endpoint over local bus connection.
* GLOBAL_BROADCAST Flag not set: The SIGNAL message should be 
sent over all the locally attached app endpoints. The AllJoyn 
router forwards the message to all of the locally connected 
app endpoint over local bus connection.



[sessionless-signal]: /learn/core/system-description/sessionless-signal
[data-exchange-via-methods]: #data-exchange-via-methods
[match-rule-keys]: #match-rule-keys-supported-by-the-alljoyn-framework
[message-type-definitions]: #message-type-definitions
[header-flag-definitions]: #header-flag-definitions
[header-fields-definitions]: #header-fields-definitions
[sample-routing-table-on-provider-device]: #sample-routing-table-on-provider-device


[provider-functional-arch]: /files/learn/system-desc/provider-functional-arch.png
[consumer-functional-arch]: /files/learn/system-desc/consumer-functional-arch.png
[data-exchange-method-calls-reply-sent]: /files/learn/system-desc/data-exchange-method-calls-reply-sent.png
[data-exchange-method-calls-reply-not-sent]: /files/learn/system-desc/data-exchange-method-calls-reply-not-sent.png
[data-exchange-signals]: /files/learn/system-desc/data-exchange-signals.png
[alljoyn-message-format]: /files/learn/system-desc/alljoyn-message-format.png
[alljoyn-routing-example]: /files/learn/system-desc/alljoyn-routing-example.png

