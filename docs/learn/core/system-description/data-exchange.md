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
* AllJoyn 路由会保存与参与的会话有关的状态信息。此信息被用于传送基于 sessionID 的消息。

## 通过方法交换数据

下列用例表达了通过方法调用完成的数据交换的过程。

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

应用程序可以对 AllJoyn 路由的信号添加多个匹配规则。在此例中，应用程序正在请求根据多个过滤条件获取信号，并且所有的匹配规则都使用。这样的结果是，符合指定的匹配规则的消息都会被发送到应用程序。例如，如果存在一个只能匹配一小部分信号的更加限定性的

AllJoyn 路由发送一个与指定规则相匹配的消息集合到应用程序。例如，如果存在一个只能匹配一小部分信号的更加限定性的规则，同时又存在一个可以匹配多一些消息的相对小限定性的规则，AllJoyn 路由总是会向应用程序发送大一些的扩展集信号。


## 类型系统

AllJoyn 框架使用了 D-Bus 协议的类型系统，允许将多种类型通过一种标准的方法连载成一个字节的序列，称作 wire fomat（有线格式）. 将其他表达方式
的值转换成 wire fomat 的过程被称为 marshaling（编组），而反向的转换被称为 unmarshaling（反编组）。

AllJoyn 框架使用 D-Bus 的编组格式。

### 类型签名

AllJoyn 框架使用了与 D-Bus 协议相同的类型签名。这种类型签名由类型代码构成。类型代码是一个代表着一种标准数据类型的 ASCII 字符、

#### AllJoyn 框架支持的数据类型：

| 通用名  | 代码 | ASCII | 描述 |
|---|---|---|---|
| INVALID | 0 | NUL | 不是一个有效的编码，将会使用终止签名。 |
| BYTE | 121 | 'y' | 8-bit 无符号整形数。|
| BOOLEAN | 98 | 'b' | 布尔值, 0 代表 FALSE, 1 代表 TRUE. 其他值被视为无效。|
| INT16 | 110 | 'n' | 16-bit 有符号整形数。|
| UINT16 | 113 | 'q' | 16-bit 无符号整形数。 |
| INT32 | 105 | 'i' | 32-bit 有符号整形数。 |
| UINT32 | 117 | 'u' | 32-bit 无符号的整形数。 |
| UINT64 | 120 | 'x' | 64-bit 有符号的整形数。 |
| DOUBLE | 100 | 'd' | IEEE 754 双精度浮点。 |
| STRING | 115 | 's' | UTF-8 字符串 (必须是合法的 UTF-8). 必须是空值终止的，并且不含其它的空字节。 |
| OBJECT_PATH | 111 | 'o' | 对象实例的名称 |
| SIGNATURE | 103 | 'g' | 一个类型签名 |
| ARRAY	| 97 | 'a' | 数组 |
| STRUCT | 114, 40, 41 | 'r', '(', ')' | 结构体 |
| VARIANT | 118 | 'v' | 可变类型 (值的类型是值本身的一部分)。 |
| DICT_ENTRY | 101, 123, 125 | 'e','{','}' | 进入一个 dict 或者 map ( key-value 对组成的数组)。 |

四种类型是容器类型:STRUCT, ARRAY, VARIANT, 和 DICT_ENTRY. 其它的所有类型都是常见的基础数据类型。当声明一个 STRUCT 或者 DICT_ENTRY 时，不可
使用 'r' 和 'e'. 应该使用 ASCII 字符 '(', ')', '{', 以及 '}' 标记容器的开始和结束。

## 消息格式

AllJoyn 框架使用 D-Bus 消息格式，并对其做出了扩展，加入了头文件标识以及 AllJoyn 消息的头文件字段。AllJoyn 消息格式被用于在 AllJoyn 路由之间
以及应用程序和 AllJoyn 路由之间发送消息。

方法调用，方法回复以及信号消息都使用 AllJoyn 消息格式封装。D-Bus 定义的METHOD_CALL, METHOD_RETURN 以及 SIGNAL 信号分别被用于（针对 AllJoyn 增强）传输这些消息。如果发生了错误，ERROR 消息将被返回，作为方法调用的回复（代替 METHOD_RETURN）.

一条 AllJoyn 消息由头文件和正文组成。下图展示了 AllJoyn 消息格式。下列图表中有对每一个消息格式字段的定义。

![alljoyn-message-format][alljoyn-message-format]

**Figure:** AllJoyn 消息格式

### AllJoyn 框架支持的消息格式字段

| 字段名 | 描述 |
|---|---|
| 字节序标识 | 消息的字节序。 ASCII 'l' 代表小尾数， ASCII 'B' 代表大尾数。头与正文都依照此字节序。 |
| 消息类型 | 消息的类型。此字段根据 [Message Type definitions][message-type-definitions] 中的说明设置。 |
| 头文件标识 | <p>提供任何消息可用的标识。此字段由标识的按位或组成。位置的标识会被忽略。</p><p>此字段根据 [Header Flag definitions][header-flag-definitions] 中的说明设置。</p> |
| 主要协议版本 | 向应用程序发送消息的 AllJoyn 主要协议版本。 |
| 消息正文长度 | 消息正文的长度 (按 bytes 计算), 从 header 的最后一位开始计算。|
| 序列号 | 此消息的序列号。由发送方分配并缓存，用于识别对应该请求的回应。不可以是 0. |
| 头文件字段的列表 | <p>此处指定了0个或多个头文件字段的数组，每一个字段是一个 1-byte 字段代码以及一个字段值。 由(BYTE, VARIANT) 组成 的结构数组表示。 A header must contain the required header fields for its message type, and zero or more of any optional header fields. Implementations must ignore fields they do not understand.</p><p>The AllJoyn framework has extended the list of D-Bus defined header fields. [Header Fields definitions][header-fields-definitions] lists all the header fields supported by AllJoyn and mandatory/optional requirement for these fields for different message types.</p> |
| Message Body | Body of the message. The content of message body is interpreted based on SIGNATURE header field. |

### 消息类型的定义

| Name | 值 | 描述 |
|---|:---:|---|
| INVALID | 0 | 无效类型 |
| METHOD_CALL | 1 | 方法调用 |
| METHOD_RETURN | 2 | 有返回数据的方法回复 |
| ERROR | 3 | 错误回复 |
| SIGNAL | 4 | 发出信号 |

### 头文件标识的定义

| Name | 值 | 描述 |
|---|:---:|---|
| NO_REPLY_EXPECTED | 0x01 | <p>指示方法调用不期望任何回复 (method_return 或 error). 此回复可作为优化被发出。</p><p>**NOTE:** 即便此标识存在，提供方应用程序仍然可以返回一个回应。</p> |
| AUTO_START | 0x02 | <p>指示一个开始服务的请求，如果该服务还未运行。是否兑现由 AllJoyn 核心决定。</p><p>**NOTE:** 暂不支持此标识。</p> |
| ALLOW_REMOTE_MSG | 0x04 | 指示来自远端主机的消息应被允许 (只针对应用程序向 AllJoyn 核心发送的 Hello message 有效)。如果由应用程序设置，AllJoyn 核心将允许来自远端应用程序/主机的消息被发送到应用程序。|
| (Reserved) | 0x08 | 保留/未使用 |
| SESSIONLESS | 0x10 | 指示一个非会话信号消息。 |
| GLOBAL_BROADCAST | 0x20 | 指示一个全局的 (总线到总线的) 广播消息。仅对 SESSION_ID=0 的信号适用。如果设置了此标识，相关的信号将会通过近端网络中的任何会话发送到所有连接的节点。|
| COMPRESSED | 0x40 | 指示着 AllJoyn 消息头被压缩。|
| ENCRYPTED | 0x80 | 指示着 AllJoyn 消息正文被加密。|

### 头文件字段定义
‘
| Name | 字段代码 | 类型 | 需要出现的位置 | 描述 |
|---|:---:|:---:|---|---|
| INVALID | 0 | N/A | 不允许 | 无效的名称 (如果出现在消息中，会引发错误)。 |
| PATH | 1 | OBJECT_PATH | <ul><li>METHOD_CALL</li><li>SIGNAL</li></ul> | 发送方法调用或发出信号的对象路径。|
| INTERFACE | 2 | STRING | <ul><li>METHOD_CALL</li><li>SIGNAL</li></ul> | 调用方法的接口，或者发出信号的接口。|
| MEMBER | 3 | STRING | <ul><li>METHOD_CALL</li><li>SIGNAL</li></ul> | 成员，方法名或信号名。 |
| ERROR_NAME | 4 | STRING | ERROR | 发生的错误的名称，用于错误消息。 |
| REPLY_SERIAL | 5 | UINT32 | <ul><li>ERROR</li><li>METHOD_RETURN</li></ul> | 该消息所回复的消息的序列号。 |
| DESTINATION | 6 | STRING | <ul><li>Optional for SIGNAL</li><li>用于所有其他的消息</li></ul> | 此消息准备发送到的连接的唯一识别符。 |
| SENDER | 7 | STRING | 所有消息使用 | 发送连接的唯一识别符，消息总线填充在此字段。  |
| SIGNATURE | 8 | SIGNATURE | 可选 | <p>消息正文的数据类型签名。使用 D-Bus 数据类型系统声明。</p><p>如果发出，则假设此处是一个空的签名，也 就是说正文的长度为0. |
| N/A | 9 | N/A | N/A | 未使用 |
| TIMESTAMP | 10 | UINT32 | 可选 | 消息封装时的时间戳。 |
| TIME_TO_LIVE | 11 | UINT16 | <p>可选</p><p>如果未声明，TTL 被假设为无限。</p> | <p>TTL 与消息相关，当 TTL 过期时消息会被丢弃。 </p><ul><li>对于非会话信号，TTL 值以秒声明。</li><li>对于其他消息，TTL 值以毫秒声明。</li></ul> |
| COMPRESSION_TOKEN | 12 | UINT32 | 可选 | 消息头压缩时生成的 token. |
| SESSION_ID | 13 | UINT32 | 可选 | <p>此消息被发送的会话的会话 ID.</p><p>如果丢失，则被假设为 0.|

## 消息路由

AllJoyn 系统支持根据路由逻辑路由以下种类的消息：


* 指定应用程序的消息：这些是由应用程序生成的消息，根据 6.9.1 部分所描述的会话 ID/destination 的路由模式，这些消息在应用程序端点之间被传送。
* 控制消息: 这些是由 AllJoyn 路由（例如，AttachSession）生成的消息，这些消息会被转发到 AllJoyn 。

### 基于会话 ID/destination 的路由

AllJoyn 系统支持针对指定应用程序的消息的基于会话 ID 以及/或者目的地字段的消息路由功能。基于会话 ID 的路由表由 AllJoyn 路由生成并维护，以便
转发消息。所有的动态会话都会维护一个单个路由表。

概念上，对于每一个会话 ID，路由表会为每一个参与会话的应用程序维护一张目的地应用程序端点的列表，并且为那些远端的应用程序端点提供下一跳的总线
对总线端点。远程端点被附在另一个 AllJoyn 路由上；但是此路由可以在同一设备上，或者不同设备上。对于在 AllJoyn 路由本地上的远程端点，不提供总
线对总线的端点。


```c
AllJoyn routing table = List (session Id, List (destination app endpoint, 
next hop B2B endpoint))
```

**NOTE:** 一个指定目的地的端点可以使用不同的 sessionID 进入一个 AllJoyn 路由多次。在这里，如果有多条到远程目的地的可行路径，则可以对同一个
目的地使用不同的总线到总线的端点，作为不同的 sessionID 进入的一部分。

当选择路由时，sessionID 会被首先用于在路由表中寻找进入。目的地字段随后被用于选择一个总线对总线的端点（用于远端目的地）。

下图展示了一个两个设备之间建立一个 AllJoyn 会话的部署方式。所有的四个应用程序都是会话的一部分。


![alljoyn-routing-example][alljoyn-routing-example]

**Figure:** AllJoyn 路由实例

每一个设备上的 AllJoyn 路由都维护一张路由表。[Sample routing table on provider device][sample-routing-table-on-provider-device] 和
[Sample routing table on consumer device][sample-routing-table-on-consumer-device] 分别对应着提供方和使用方 AllJoyn 路由上维护的路由表。


#### 提供方设备上的路由表样例

| 会话 ID | 目的地 (应用程序端点) | 下一跳 (B2B 端点) |
|---|---|---|
| 10 | App1 端点 (:100.2) | N/A |
| | App 2 端点 (:100.3) | N/A |
| | App 3 端点 (:200.2) | B2B 端点 (:100.4) |
| | App 4 端点 (:200.3) | B2B 端点 (:100.4) |

#### Sample routing table on consumer device

| 会话 ID | 目的地 (应用程序端点) | 下一跳 (B2B 端点) |
|---|---|---|
| 10 | App1 端点 (:100.2) | B2B 端点 (:100.4) |
| | App 2 端点 (:100.3) | B2B 端点 (:100.4) |
| | App 3 端点 (:200.2) | N/A |
| | App 4 端点 (:200.3) | N/A |

#### 路由表信息

路由表是根据包括在 AtttachSession 方法调用中的总线对总线端点信息建立的。当一个 AllJoyn 路由收到 AttachSession 调用时，他可以在应用程序方试
图建立一个新回话，或者在一个新成员方被加入到一个现有的会话。


* AttachSession 用于新回话: 本案例中，AllJoyn 路由向应用程序发送一个 Accept 会话。（目前，single-hop 用例被捕捉。）如果会话被接受，他将创建
一个新的 sessionID. 随后在路由表中添加一个针对此 sessionID 的进入，将两个参与方作为目的地，将从 AttachSession 收到的总线对总线端点作为远端
应用程序的下一跳。

* 来此被添加成员的 AttachSession: 本案例中，会话是一个多方会话，AllJoyn 路由在路由表中以及有了针对相关 sessionID 的进入。接收 AttachSession
的成员作为一个新的目的地被添加，总线对总线端点作为远端应用程序的下一跳。


#### 路由逻辑

按照上文描述，消息中的 sessionID（如果存在）被首先用于在路由表中寻找一个匹配的 sessionID 进入。随后，目的地字段（如果存在）被用于寻找一个
可以执行转发的匹配的目的地进入。

以下部分描述了不同用例中的转发逻辑。

##### 根据 sessionId 和目的地字段的路由逻辑

如果一条应用导向的消息有一个不为零的会话 ID 以及目的地字段，AllJoyn 路由首先在路由表中找到会话 ID 进入，随后在此消息目的地的会话 ID 之内找
到目的地进入。

* 如果目的地是一个远程端点，消息会被发送到路由表中针对此目的地指定的总线对总线端点。
* 如果目的地是本地依附在 AllJoyn 路由上的，此消息通过本地总线连接被直接发送到该目的地。

##### 仅根据会话 ID 字段的路由逻辑

如果一条应用导向的消息只有一个会话 ID 而没有目的地字段，此消息会被发送到会话中的所有目的地端点。AllJoyn 路由在路由表中找出与会话 ID 匹配的
进入并将消息发送到针对此会话列出的除消息发送方的所有目的地。

* 对于会话中的远端应用程序端点，此消息会根据路由表被发送到相关的总线对总线端点。
* 对于本地依附在 AllJoyn 路由上的应用程序，此消息通过本地总线连接被直接发送到该目的地。

##### sessionId=0 时的路由逻辑

一条应用导向的消息可以声明 sessionID=0，并且当 sessionID 字段没有被包括时，AllJoyn 路由也假设 sessionID 为0. 对于任何种类的消息 sessionID 
字段都可以为0. 对于 METHOD_CALL, METHOD_RETURN 和 ERROR 消息，仅要求目的地字段被声明。

对于 sessionID=0 （或为声明） 的消息，如果目的地字段被声明，AllJoyn 路由则会从路由表中（从任何包含此目的地的会话进入中）选择任何可用的转发
并将消息通过针对此转发的总线对总线端点发送。

对于 sessionID=0 的 SIGNAL 消息（或未声明 sessionID），目的地字段不需要被呈现。在这种情况下，AllJoyn 路由会查看消息中的 GLOBAL_BROADCAST 标
识，根据下面的逻辑决定如何转发此 SIGNAL 消息：

* 已设置 GLOBAL_BROADCAST 标识: 此 SIGNAL 信号应被全局广播到通过任何会话连接的任何已连接的端点。在转发此类消息时，目的地字段将被忽略。AllJoyn 
路由将通过路由表中所有会话 ID 发送此消息到所有目的地的端点。

* 对于远端目的地，SIGNAL 信号将被发送到相关的总线对总线端点。
* 对于本地连接的目的地，此消息通过本地总线连接被直接发送到应用程序端点。
* GLOBAL_BROADCAST 标识 未设置: 此 SIGNAL 信号应发送到所有本地附属的应用程序端点上。AllJoyn 路由将此消息通过本地总线连接发送到所有本地连接
的应用程序端点。 


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
