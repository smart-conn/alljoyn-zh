# AllJoyn&trade; 安全

## 概览

AllJoyn 系统为应用程序提供一个安全架构，以实现互相认证并发送加密数据。AllJoyn 框架提供应用程序端到端级别的安全保障。认证和数据加密在应用程
序中被完成。这些应用程序可以是位于同一设备上，也可以是在不同设备上的，可以附属在同一个 AllJoyn 路由上，也可附属在不同的 AllJoyn 路由上。

**NOTE:** AllJoyn 路由层不完成任何种类的认证工作。

AllJoyn 框架支持接口级别的安全。一个应用程序可以将一接口标记为 'secure'，启用认证和加密。安全接口中所有的方法，信号和属性都被认为安全。当应
用程序在安全接口上调用方法，或者明确调用一个 API，试图安全化与远端同级应用程序的连接时，与认证和加密相关的密钥一经请求就被初始化。

下图展示了 AllJoyn 的高层级安全架构。

![alljoyn-security-arch][alljoyn-security-arch]

**Figure:** AllJoyn 安全架构

认证和加密在应用层完成。AllJoyn 核心库实现除 Auth Listener 以外的所有认证和加密逻辑。Auth Listener 是一个由应用程序实现的回调函数，旨在提供
身份验证凭据（例如 PIN 或密码），或验证身份验证凭据（例如，在 ALLJOYN_ECDHE_ECDSA 的情况下验证证书链）。认证和加密的密钥被储存在一个由 Security 模块管理的 key store 中。

**NOTE:** AllJoyn 路由仅参与应用程序端点之间与安全相关的消息传送。他不实现任何安全逻辑。

AllJoyn 框架的安全认证使用 Simple Authentication 以及 Security Layer (SASL) 安全框架。他使用了由 D-Bus 定义的 SASL 协议 [D-Bus Specification](http://dbus.freedesktop.org/doc/dbus-specification.html)，用于交换认证相关的数据。

AllJoyn 框架支持下列用于应用程序对应用程序层级认证的认证机制：

* ALLJOYN_SRP_KEYX - Secure Remote Password (SRP) 密钥交换
* ALLJOYN_SRP_LOGON - Secure Remote Password (SRP) 使用用户名和密码登陆
* ALLJOYN_ECDHE_NULL - Elliptic Curve Diffie-Hellman (ephemeral) 无认证的密钥交换
* ALLJOYN_ECDHE_PSK -  Elliptic Curve Diffie-Hellman (ephemeral) 通过一个认证的预共享密钥（PSK）的密钥交换
* ALLJOYN_ECDHE_ECDSA - Elliptic Curve Diffie-Hellman (ephemeral) 通过一个 X.509 ECDSA 认证的密钥交换

AllJoyn 框架也支持根据 D-Bus 规范定义的 ANONYMOUS 和 EXTERNAL 认证机制。

* ANONYMOUS 认证机制在两个 AllJoyn 路由之间被用于空验证。同时也被用于在一个精简应用程序和一个 AllJoyn 路由之间的验证。

* EXTERNAL 认证机制被用于 linux 平台上应用程序与 AllJoyn 路由（独立的 AllJoyn 路由）之间的安全操作。

### 14.06 版本中 Security 框架的变化

14.06 版本中，ALLJOYN_PIN_KEYX 认证机制被从 AllJoyn 精简库中移除。 AllJoyn 标准库继续提供对此认证机制的支持。


添加了下列基于 Elliptic Curve Diffie-Hellman Ephemeral (ECDHE) 的认证机制：
* ECDHE_NULL 是一个无需验证的密钥协议
* ECDHE_PSK 是一个带有预共享密钥的密钥协议
* ECDHE_ECDSA 是一个通过 ECDSA 签名验证的带有非对称密钥的密钥协议

精简应用程序与标准应用程序都可以使用这些新的认证机制。14.06版本中的精简应用程序只支持基于 ECDHE 的认证机制。

使用 SASL 协议的认证在14.06版本的 AllJoyn 精简库中被移除，AllJoyn 标准库继续提供对此认证机制的支持。


关于这些改变的详细信息请参见最新版本的 [Security HLD](https://wiki.allseenalliance.org/core/security_enhancements).

### 15.04 版本中 Security 框架的变化
15.04 版本中，标准客户端移除了 ALLJOYN_PIN_KEYX 和 ALLJOYN_RSA_KEYX 认证机制。添加了对于 ECDSA X.509 的支持。

## 安全概念

此章节定义了 AllJoyn 安全相关的概念。

### Authentication (Auth) GUID

Authentication GUID 是分配给一个应用程序的用于认证目的的 GUID. 此 GUID 永久存在于 key store 中，作为应用程序长期的身份识别。 一般情况下，此
GUID 与一个单一的应用程序相关联。在一组相关的应用程序共享一个给定 key store 的场景中，这些应用程序同时也共享同样的 auth GUID.

GUID 作为一个映射键被用于认证以及对相关应用程序加密秘钥的储存和获取。

### 主密钥

主密钥由认证的对等应用程序共享。两个对等应用程序各自生成相同的主密钥，并一直储存在 key store 中。

主密钥根据对等应用程序的 auth GUID 被储存，应用程序可设置相关的 TTL. 只要主密钥还有效，对等应用程序在交换加密数据时就无需进行再次认证。


主密钥的长度是 48 字节，定义规范参见 [RFC 5246](http://www.rfc-base.org/txt/rfc-5246.txt).

### 会话密钥

在两个对等应用程序之间的点对点数据传输加密使用了一个加密的密钥。每一个已连接的对等应用程序都会对应一个独立的会话密钥。只要对等应用程序还处于连接状态（通过任何 AllJoyn 会话），会话密钥就保持有效。这是一个在加密环境中的会话，与 AllJoyn 会话没有关联。在通过所有 AllJoyn 会话连接的
两个对等应用程序之间都使用同样的会话密钥。

会话密钥储存在内存中，他们不是永久的。在完成对等应用程序的认证后，就会生成一个会话密钥，此对等应用程序的连接被终止时密钥将会过期。会话密钥由主密钥推断而来，用于对方法调用，方法回复以及单播信号的加密。

会话密钥的长度是 128 bits.

**NOTE:** 目前使用的实现中的 会话密钥 TTL 默认为2天，如果应用程序的连接状态持续的更久，相关的会话密钥将过期，并需要生成新的密钥。

### 组密钥

组密钥是用于加密由提供方应用程序发送的一点对多点的数据传输（广播信号）。应用程序维护一个单独的组密钥，用来加密发送到每一个连接的对等应用程序的广播信号。

在应用程序生成第一个针对任意连接的对等应用程序的会话密钥时，组密钥将被生成。此组密钥的生成与应用程序是提供方或使用方无关。只有提供方应用程序使用组密钥发送加密的广播信号。应用程序通过使用一个加密的包含会话密钥的方法调用互相交换他们的组密钥。

组密钥的长度是128 bits，随机生成。组密钥有定向的性质。每一个应用程序都有用于加密广播信号的自己的组密钥。另外还会为每一个连接的对等应用程序保留一个独立的对等组密钥，用来解密由这些应用程序接收到的广播信号。

组密钥储存在内存中，他们不是永久有效的。对等应用程序的连接结束时组密钥将会过期。在一个应用程序没有任何与对等应用程序的连接时，此应用程序的组密钥将过期。针对远端对等应用程序的组密钥在应用程序不再有到此远端对等应用程序的连接时将会过期。

**NOTE:** 在未来版本中，组密钥可能会永久有效，以支持对非会话信号的加密。

### Key store

Key store 是一个用于永久储存认证相关密钥的本地存储，同时也存储主密钥和相关的 TTL. 应用程序可以提供自己的 key store 实现方式，或者使用默认的 由 AllJoyn 系统提供的 key store.

在一台设备上的多个应用程序都可以共享一个给定的 key store. 在此案例中，这些应用程序分享同一组认证密钥。在现有的实现中，在 key store 内部的内
容由通过 key store 路径推断而来的密钥加密。

对于每一个认证的应用程序，key store 根据此应用程序的 Auth GUID 保留主密钥以及相关的 TTL. 同时也保留分配给本地应用程序的使用 key store 的 auth GUID.

下表展示了含有两个对等应用程序主密钥的 key store 示例。

#### 含有两个对等应用程序主密钥的 key store 示例

**Local Auth GUID - GUIDx**

| Peer Auth GUID | 主密钥 | TTL |
|---|---|---|
| GUID1 | MS1 | T1 |
| GUID2 | MS2 | T2 |

## 点对点安全数据流

下图展示了用于 AllJoyn 安全的终端到终端的高层消息流，运行场景是在两个还未互相认证的两个应用程序之间。此安全消息流根据以下触发器被初始化：

* 使用方应用程序调用在一个远端服务对象上的安全方法调用。
* 使用方应用程序明确调用一个用于加密到远端对等应用程序的 API.

![e2e-security-flow-two-unauth-apps][e2e-security-flow-two-unauth-apps]

**Figure:** 点对点安全流程（两个之前未认证过的应用程序。）对于一个应用程序来说，总能明确加密到远端对等应用程序的连接是很理想的。在当一个应用程序只对接收安全信号有兴趣的情况下，为了接收用于解密信号的密钥，这将是加密到远端对等应用程序的连接的唯一方法。

AllJoyn 核心库与应用程序一起，实现了所有的 AllJoyn 安全逻辑。AllJoyn 路由仅仅作为一个用于安全相关的消息的 pass-through. 每一个应用程序都需
   调用 AllJoyn 核心库中的 EnablePeerSecurity API，以实现 AllJoyn 安全功能。应用程序声明了要使用的认证机制，用于 callback 的 Auth Listener 以及 key store 文件，作为此 API 调用的一部分。同时他也只是了 key store 是否可以被分享。AllJoyn 核心库为应用程序生成 auth GUID，作为 key store 第一次初始化实现的一部分。

在与提供方应用程序建立了会话以后，使用方应用程序将初始化一个之前提及的安全触发器。AllJoyn 核心库检查认证是否正在进行。

* 如果是，则停止运行。
* 如果不是，则按照安全流程图继续运行。

他将会为远端对等应用程序查找密钥材料。在此案例中，由于这是第一个与远端应用程序的安全交互，不会找到任何密钥材料。这将会触发与远端对等应用程序的安全机制流程。

消息流由下列四个独立的步骤组成：

1. 交换 Auth GUIDs: 此步骤包括对等应用程序之间交换 Auth GUIDs. 一旦交换完成，远端应用程序的 auth GUID 就被用来查看针对此 GUID 的主密钥是否 在 key store 中存在。在此例中，由于两应用程序还未互相认证，不会发现主密钥。
2. 应用程序对应用程序的认证：此步骤包含两个对等应用程序使用一种支持的认证机制互相认证。在此步骤的最后，两个对等应用程序已经完成了互相认证，并且已经可以分享同一个主密钥。
3. 生成一个会话密钥：此步骤包括两个对等应用程序生成一个用于加密安全点对点消息的会话密钥。会话密钥由两个应用程序独立生成，基于主密钥。在第一个会话密钥被生成时，会创建一个组密钥。
4. 交换组密钥：此步骤包含两个对等应用程序通过一个加密的 AllJoyn 消息，交换组密钥。AllJoyn 消息通过使用已经建立的会话密钥来完成加密。组密钥
被用于加密会话多方传播以及广播信号。在此步骤的最后一步，两个对等应用程序有可以解密接收到的广播信号的组密钥。

对于每一个上述步骤的细节描述请参见后续的部分。在完成这些步骤后，对等应用程序已经建立了加密/解密密钥，用来交换加密的方法和信号。

这些密钥作为 peer 状态表中的一部分被管理，包含对一个远端应用程序的唯一识别符，同时还有针对目前应用程序的本地 GUID 和组密钥。

下表提供了一个 peer 状态表的样例，并带有存储了两个验证了的对等应用程序的 key stores.

#### 两个验证了的对等应用程序的 peer 状态表

**Local Auth GUID - GUIDx**
**App Group Key - GKx**

| Peer Auth GUID | 唯一识别符 | 会话密钥 | Peer 组密钥 |
|---|---|---|---|
| GUID1 | :100.2 | SK1 | GK1 |
| GUID2 | :200.2 | SK2 | GK2 |

## 已经被验证的应用程序

当应用程序在第一次连接之后再次互相连接的时候，如果主密钥尚未过期，则无需再次进行验证。下图展示了此用例的消息流。

![authenticated-apps-reconnecting][authenticated-apps-reconnecting]

**Figure:** 已认证的应用程序再次连接

在此用例中，由于应用程序没有连接，不会找到远程 peer 的密钥材料。所以使用方应用程序需要与远程 peer 执行 Exchange Auth GUID. 这将追踪到可以用
来在 key store 中查找文件的远端 peer 的 Auth GUID.

由于应用程序已经被认证，可在 key store 中找到一个此提供方应用程序的 auth GUID 对应的主密钥，无需再次进行应用程序对应用程序的认证过程。使用
方应用程序直接进行下一步，生成会话密钥以及/或者组密钥。

**NOTE:** 如果在生成会话密钥期间，验证步骤失败了，即便此时主密钥仍未过期，使用方应用程序必须进行重新验证。

## Auth GUIDs 的交换

下图展示了对等应用程序之间交换 Auth GUIDs 的消息流。

![exchange-auth-guids][exchange-auth-guids]

**Figure:** 交换 Auth GUIDs

消息流的步骤描述如下：

1. 使用方应用程序生成一个 ExchangeGuids METHOD_CALL 消息，并通过 AllJoyn 路由发送到提供方应用程序。此消息包含使用方应用程序的 Auth GUID 以及使用方应用程序所支持的最高 Auth 版本。
2. 如果提供方应用程序不支持从使用方应用程序发出的 auth 版本，他会建议使用自己所支持的最高 auth 版本。
3. 提供方应用程序生成一个 ExchangeGuids METHOD_RETURN 消息，并通过 AllJoyn 路由发送到使用方应用程序上。此消息包含提供方应用程序的 Auth GUID
以及最高 auth 版本。
4. 使用方应用程序验证是否支持收到的 auth 版本。以此完成交换 GUID 步骤。
5. 
## 应用程序到应用程序的验证

AllJoyn 对等应用程序使用此章节中描述的验证机制中的一种来完成互相验证。这些验证机制都是根据 [RFC5246](http://www.rfc-base.org/txt/rfc-5246.txt) 以及 [RFC 5054](http://www.rfc-editor.org/rfc/rfc5054.txt) 中的规范设计的。可用的 RFC 部分在描述这些验证机制的细节部分被列出。

**NOTE:** 在此部分中描述的验证消息流，使用方和提供方应用程序会被分别称为客户端和服务器端，这是为了与
[RFC 5246](http://www.rfc-base.org/txt/rfc-5246.txt) 和 [RFC 5054](http://www.rfc-editor.org/rfc/rfc5054.txt) 中的术语相契合。


### D-Bus SASL 协议的使用

AllJoyn 框架实现了 D-Bus SASL 交换协议 [D-Bus Specification](http://dbus.freedesktop.org/doc/dbus-specification.html)，以交换与认证相关的数
据。所有与认证相关的交换都使用作为 org.alljoyn.Bus.Peer.Authentication 接口一部分被定义的由 AllJoyn 核心库实现的 AuthChallenge 方法调用/回 复来完成。

需要交换的 Auth 数据根据 D-Bus SASL 交换协议被当作一个 SASL 字符串生成。在 SASL 字符串内部的 Auth 数据以十六进制的形式被发送。生成的字符串
随后会作为 AuthChallenge 方法调用或回复的一个参数被传递。

例如，若要初始化 ALLJOYN_SRP_KEYX 的验证，生成的字符串将会是：

```
"AUTH ALLJOYN_SRP_KEYX <c_rand in hex>"
```

这其中包括 SASL AUTH 命令，auth 机制以及十六进制的 auth 数据。

下表描述了 AllJoyn 框架所支持的 D-Bus SASL 命令。

#### AllJoyn 框架所支持的 D-Bus SASL 命令

| 命令 | 方向 | 描述 |
|---|---|---|
| AUTH [机制] [初始化-响应] | 使用方->提供方 |开始验证。 |
| CANCEL | 使用方->提供方 | 取消验证。 |
| BEGIN | <ul><li>使用方->提供方</li><li>提供方->使用方</li></ul> | <ul><li>在使用方一边，确认使用方已经收到一个来自提供方的 OK 命令, 并且
消息流即将开始。</li><li>在提供方一边，由提供方作为对使用方 BEGIN 命令的回应被发送出。</li></ul> |
| DATA | <ul><li>使用方->提供方</li><li>提供方->使用方</li></ul> | 在使用方一边，包含一个等待被根据使用的 auth 机制翻译的十六进制编码的数据 块。 |
| OK | 使用方->提供方  | 客户端已被认证。 |
| REJECTED | 使用方->提供方 | 在使用方一边，指出目前的认证交换已失败，DATA 的进一步交换是不当的。使用方尝试另一种机制，或者尝试提供另一种对 challenges 的响应。 |
| ERROR | <ul><li>使用方->提供方</li><li>Provider->Consumer</li></ul> | 在使用方一边，提供方或使用方不知道一个命令，没有接收到目前环境中的 给定命令，或者没有明白命令中的参数。
### ALLJOYN_SRP_KEYX

下图展示了 ALLJOYN_SRP_KEYX auth 机制的消息流。此 auth 机制主要被设计用于两方生成一次性使用的密码的场景中。

![alljoyn-srp-keyx-auth-mechanism][alljoyn-srp-keyx-auth-mechanism]

**Figure:** ALLJOYN_SRP_KEYX auth 机制

下面描述了消息流的步骤。

1. 使用方应用程序生成一个 28 bytes 的客户端随机字符创 c_rand.
2. 使用方（客户端）应用程序生成一个 AuthChallenge METHOD_CALL 并使用 "AUTH ALLJOYN_SRP_KEYX &lt;c_rand&gt;" 作为参数将其发送。使用方应用程
序通过 AllJoyn 路由向提供方发送消息调用请求。
3. 提供方应用程序调用由应用程序注册的 AuthListener 回应来申请一个密码。此 AuthListener 将返回密码。此用例中使用 “anonymous” 作用户名。
4. 提供方应用程序根据 [RFC 5054](http://www.rfc-editor.org/rfc/rfc5054.txt) 2.5.3 部分描述的算法计算服务器的公共值 B.
5. 提供方应用程序生成一个 AuthChallenge METHOD_RETURN 消息，以向客户端发送服务器密钥交换消息。提供方应用程序将 "DATA &lt;N:g:s:B&gt;" 置入
此消息。具体参见 [RFC 5054](http://www.rfc-editor.org/rfc/rfc5054.txt) 2.5.3 部分。这是一个40字节场的随机盐值。提供方应用程序通过 AllJoyn 
路由向使用方应用程序发送方法回复。
6. 使用方应用程序根据 [RFC 5054](http://www.rfc-editor.org/rfc/rfc5054.txt) 2.5.3部分,验证 N, g, s 与 B 的值。
7. 使用方应用程序根据 [RFC 5054](http://www.rfc-editor.org/rfc/rfc5054.txt) 2.5.3部分,计算客户端的公共值 A.
8. 使用方（客户端）应用程序生成一个 AuthChallenge METHOD_CALL 消息，并将"DATA &lt;A&gt;"作为参数传入。使用方应用程序通过 AllJoyn 路由向提供方应用程序发送方法调用。
9. 提供方应用程序生成一个28字节的服务器随机字符串 s_rand.
10. 提供方应用程序使用 [RFC 5054](http://www.rfc-editor.org/rfc/rfc5054.txt) 2.6部分的算法计算一个 premaster secret.
11. 提供方应用程序根据 premaster secret, c_rand, 以及 s_rand 等参数，和  [RFC 5246](http://www.rfc-base.org/txt/rfc-5246.txt) 8.1 部分的算
法，计算出主密钥。
12. 提供方应用程序根据 [RFC 5246](http://www.rfc-base.org/txt/rfc-5246.txt). 7.4.9 部分的算法计算出一个 "服务器结束" s_verifier. s_verifier 根据主密钥，握手消息的 hash 值以及 ‘server finish’ 标签生成。
13. 提供方应用程序生成一个 AuthChallenge METHOD_RETURN 消息，并将 "DATA &lt;s_rand:s_verfier&gt;" 作为参数传入。提供方应用程序通过 AllJoyn 路由向使用方发送方法回复。
14. 使用方应用程序调用又应用程序注册的 AuthListener callback 请求密码。AuthListener 返回密码。在此例中，用户名使用了 "anonymous".
15. 使用方应用程序根据 [RFC 5054](http://www.rfc-editor.org/rfc/rfc5054.txt) 2.6 部分的算法计算一个 premaster secret. 此 premaster secret 根据客户端的公共值（A），服务端的公共值（B）以及密码和其他参数得出。
16. 使用方应用程序根据 premaster secret, c_rand, s_rand 等参数以及 [RFC 5246](http://www.rfc-base.org/txt/rfc-5246.txt) 8.1 部分的算法计算 出。
17. 使用方应用程序使用与提供方应用程序使用的相同算法生成 "服务器结束" verifier，验证此计算值是否与收到的 s_verifier 相同。
18. 使用方应用程序根据 [RFC 5246](http://www.rfc-base.org/txt/rfc-5246.txt) 7.4.9 部分的算法计算一个 "客户端结束" c_verifier. c_verifier 根据 主密钥，握手消息的hash 值以及 "client finish" 标签生成。
19. 使用方应用程序生成一个用来向服务方发送 c_verifier 的 AuthChallenge METHOD_CALL. 使用方应用程序将 "DATA &lt;c_verifier&gt;"  作为参数传入方法调用。使用方应用程序将方法调用通过 AllJoyn 路由发送到提供方（服务方）应用程序。
20. 提供方应用程序使用与使用方应用程序同样的算法生成 "客户端结束" verifier，计算出的值应与接收到的 c_verifier 相同。
此时，客户端与服务端已经完成互相认证。
21. 提供方应用程序生成一个指示着认证已经完成的 AuthChallenge METHOD_RETURN
消息。提供方将"OK &lt;s_GUID&gt;" 作为消息的参数传入，s_GUID 代表提供方的 GUID。提供方通过 AllJoyn 路由向使用方应用程序发送消息回复。
22. 使用方应用程序向提供方应用程序发送一个 AuthChallenge METHOD_CALL，并将 "BEGIN &lt;c_GUID&gt;" 声明为参数。这指示着客户端已经收到 OK 消息，数据流即将开始。
23. 提供方应用程序发送一个 AuthChallenge METHOD_RETURN 消息，将 "BEGIN"  声明为参数。

### ALLJOYN_SRP_LOGON

下图展示了 ALLJOYN_SRP_LOGON auth 机制的消息流。此 auth 机制被设计用于 client-server 用例中：服务器端维护用户名与密码，客户端使用这些信息来
验证。此机制与 AllJoyn_SRP_KEYX auth 机制十分类似，下面列出了他们的区别：

* 在应用程序请求用户名和密码之前，使用方应用程序调用 AuthListener callback. 使用方应用程序随后在发送给提供方应用程序的第一条 AuthChallenge 消息中将用户名传输过去。
* 提供方应用程序使用收到的用户名从 AuthListener 处申请密码。

![alljoyn-srp-logon-auth-mechanism][alljoyn-srp-logon-auth-mechanism]

**Figure:** ALLJOYN_SRP_LOGON auth 机制

### ECDHE 密钥交换

在14.06版本中加入了新的基于 Elliptic Curve Diffie-Hellman Ephemeral (ECDHE) 的认证机制。关于基于 ECDHE 认证机制的细节请参见 [Security HLD](https://wiki.allseenalliance.org/core/security_enhancements#high-level-design-documents) 的最新版本。


## 会话密钥的生成
下图展示了两个对等应用程序之间生成会话密钥的消息流。

![session-key-generation-between-peer-apps][session-key-generation-between-peer-apps]

**Figure:** 两个对等应用程序之间生成会话密钥

消息流的描述如下：
1. 使用方生成一个28字节长的 c_nonce 字符串。
2. 使用方应用程序生成一个 GenSessionKey METHOD_CALL 消息，并通过 AllJoyn 路由发送到提供方应用程序上。此消息包括对应使用方应用程序的本地 auth GUID，一个对应提供方应用程序的远程 auth GUID 以及 c_nonce.
3. 提供方生成一个28字节长的 s_nonce 字符串。
4. 提供方根据主密钥， c_nonce, 和 s_nonce，以及 [RFC 5246](http://www.rfc-base.org/txt/rfc-5246.txt) 6.3部分的算法生成一个会话密钥和一个 verifier. "session key" 标签用于生成密钥。
5. 提供方应用程序为使用方应用程序以及相关的 auth GUID 将会话密钥储存在对等状态表中。
6. 如果提供方应用程序不存在组密钥，提供方应用程序生成一个128比特的组密钥，并将其储存在对等状态表中。
7. 提供方应用程序生成一个 GenSessionKey METHOD_RETURN 消息，并通过 AllJoyn 路由发送到使用方应用程序中。此消息包含 s_nonce 以及 verifier.
8. 使用方应用程序根据主密钥，c_nonce，s_nonce 以及与提供方应用程序同样的生成算法（[RFC 5246](http://www.rfc-base.org/txt/rfc-5246.txt) 6.3部分）生成一个会话密钥和 verifier.  "session key" 标签被用于生成密钥。
9. 使用方应用程序验证计算出的 verifier 是否与收到的 verifier 相同。
10. 使用方应用程序为提供方应用程序以及相关的 auth GUID 将会话密钥储存在对等状态表中。
11. 如果没有组密钥存在，使用方应用程序会生成一个128比特的组密钥，并储存在对等状态表中。

对等应用程序现在有了可用于交换加密消息的一种通用的会话密钥。

## 组密钥交换

下图展示了对等应用程序之间交换组密钥时的消息流。此交换是通过调用 ExchangeGroupKeys 方法实现的，ExchangeGroupKeys 方法是对等应用程序建立会话密钥之后发送的第一个加密消息。

![group-keys-exchange][group-keys-exchange]

**Figure:** 交换组密钥

消息流的步骤如下所述：

1. 使用方应用程序生成一个 ExchangeGroupKeys METHOD_CALL 消息。此消息包含使用方应用程序的组密钥。使用方应用程序将此消息的加密标识设置为 true.
2. 使用方应用程序将消息加密并使用远端对等应用程序的会话密钥生成一个8字节的 MAC MAC (Message Authentication Code,消息认证码)。消息加密使用 AES CCM  算法完成。
3. 使用方应用程序将 MAC 附在加密的消息正文中，并更新消息长度。
4. 使用方应用程序将加密的 ExchangeGroupKeys METHOD_CALL 消息通过 AllJoyn 路由发送到提供方应用程序上。
5. 提供方应用程序验证 MAC 并使用为使用方应用程序存储的会话密钥解密消息。
6. 提供方应用程序将收到的组密钥为远端对等应用程序（使用方应用程序）存储在对等状态表中。
7. 提供方应用程序生成一个 ExchangeGroupKeys METHOD_RETURN  消息。此消息包含提供方应用程序的组密钥。提供方应用程序将此消息的加密标识设置为 true.
8. 提供方应用程序将消息加密并使用为远端对等应用程序的会话密钥生成一个8字节的 MAC. 消息的加密使用了 AES CCM 算法。
9. 提供方应用程序将 MAC 附在加密的消息正文中，并更新消息长度。
10. 提供方应用程序通过 AllJoyn 路由发送向提供方应用程序发送 ExchangeGroupKeys
METHOD_RETURN 消息。
11. 使用方应用程序验证 MAC 并使用为提供方应用程序存储的会话密钥解密消息。
12. 使用方应用程序将收到的组密钥为远端对等应用程序（提供方应用程序）存储到对等状态表中。

应用程序现在有了可用于解密从对等应用程序接收到的广播信号的组密钥。


## 加密消息的交换

一旦应用程序之间建立了加密凭证，他们就可以互相传输加密方法和信号。下面描述了这两种情景：

### 加密地方法调用

下图展示了使用方与提供方应用程序之间交换加密的方法调用/回复的消息流。对加密方法调用的回复消息也是加密发送的。

![encrypted-method-call-reply][encrypted-method-call-reply]

**Figure:** 加密的方法调用/回复

消息流的步骤如下所述：

1. 使用方应用程序为安全方法生成一个 METHOD_CALL 消息，并将加密标识设置为 true.
2. 使用方应用程序将消息加密，并使用会话密钥为目的地应用程序生成一个8字节的 MAC. 消息加密使用了 AES CCM 算法。
3. 使用方应用程序将 MAC 附在加密消息体上，并将消息长度更新。
4. 使用方应用程序将加密的 METHOD_CALL 消息通过 AllJoyn 路由发送到提供方应用程序。
5. 提供方应用程序验证此 MAC，并使用为使用方应用程序存储的会话密钥解密该消息。
6. 提供方应用程序的 AllJoyn 核心库调用 MethodCall 处理器，这将会在服务对象接口上调用方法并接收一个回复。
7. 提供方应用程序为回复生成一个 METHOD_RETURN 消息，并将此消息的加密标识设置为 true.
8. 提供方应用程序将消息加密并使用为使用方应用程序提供的会话密钥生成一个8字节的 MAC. 消息加密使用了 AES CCM 算法。
9. 提供方应用程序将 MAC 附在加密消息正文上，并更新消息长度。
10. 提供方应用程序通过 AllJoyn 路由将加密的 METHOD_RETURN 消息发送到使用方应用程序上。
11. 使用方应用程序验证 MAC，并使用为提供方应用程序储存的会话密钥。
12. 使用方应用程序的 AllJoyn 核心库向应用程序发送纯文本的回复消息。

### 加密的信号

下图展示了从提供方向使用方应用程序发送一个基于会话的加密信号的流程图。信号可以被发送到一个目的地（单播信号），或使用多播/广播信号
发送到多个端点。

**NOTE:** 在目前的 AllJoyn 系统中，非会话信号不会被加密发送。后续版本中会增加对加密非会话信号的支持。

![encrypted-signal][encrypted-signal]

**Figure:** 加密的方法调用/回复

消息流如下所示。

1. 使用方与提供方应用程序已完成验证，互相建立了加密的密钥。
2. 提供方应用程序有一些信号数据需要发送。他调用可生成一个 SIGNAL 消息的 BusObject Signal().
3. 如果此 SIGNAL 被定义为安全接口的一部分，提供方应用程序将此 SIGNAL 消息的加密标识设为 true.
4. 提供方应用程序将 SIGNAL 信号加密，并根据提供方应用程序的密钥选择逻辑使用组密钥或者会话密钥生成一个8字节的 MAC. 消息加密使用了 AES CCM 算法。
5. 提供方应用程序将 MAC 附在加密的 SIGNAL 消息正文中，并将消息长度更新。
6. 提供方应用程序通过 AllJoyn 路由将加密的 SIGNAL 消息发送到使用方应用程序。
7. 使用方应用程序验证 MAC， 并根据使用方应用程序的密钥选择逻辑使用组密钥或者会话密钥解密此 SIGNAL 消息。
8. 使用方应用程序的 AllJoyn 核心库向应用程序发送纯文本的信号消息。
9. 
#### 密钥选择逻辑

在提供方应用程序一方，单播信号使用会话密钥加密，多播/广播信号使用组密钥加密。下图展示了加密信号时的密钥选择逻辑。


![key-selection-signal-encryption-provider-app][key-selection-signal-encryption-provider-app]

**Figure:** 信号加密时的密钥选择 (在提供方应用程序上)

在使用方一边，选择解密接收到的消息所使用的密钥遵循相反的逻辑，如下所示：

![key-selection-signal-decryption-consumer-app][key-selection-signal-decryption-consumer-app]

**Figure:** 信号解密时的密钥选择 (在使用方应用程序上)

## org.alljoyn.Bus.Peer.Authentication interface

org.alljoyn.Bus.Peer.Authentication 接口是位于支持 AllJoyn 内应用层安全机制的两个 AllJoyn 核心库之间的一个 AllJoyn 接口。 

下表总结了 org.alljoyn.Bus.Peer.Authentication 接口中的所有成员。

#### org.alljoyn.Bus.Peer.Authentication 接口方法

| 方法 | 描述 |
|---|---|
| ExchangeGuids | 应用程序与远端对等应用程序交换 auth GUID 以及认证协议版本的方法。|
| AuthChallenge | 应用程序初始化认证并与远端对等应用程序交换认证数据的方法。|
| GenSessionKey | 应用程序生成一个与远端对等应用程序的会话密钥的方法。|
| ExchangeGroupKeys | 应用程序与远端对等应用程序交换组密钥的方法。|

#### org.alljoyn.Bus.Peer.Authentication.ExchangeGuids 参数

| 参数名 | 方向 | 描述 |
|---|---|---|
| localGuid | in | 初始化一方应用程序的 auth GUID. |
| localVersion | in | 初始化应用程序一方的 auth 版本。|
| remoteGuid | out | 远端对等应用程序的 auth GUID. |
| remoteVersion | out | 远端对等应用程序的 auth 版本。|

#### org.alljoyn.Bus.Peer.Authentication.AuthChallenge 参数

| 参数名 | 方向 | 描述 |
|---|---|---|
| challenge | in | 初始化一方应用程序提供的 auth 数据。|
| response | out | 提供方应用程序返回的 auth 数据。|

#### org.alljoyn.Bus.Peer.Authentication.GenSessionKey 参数

| 参数名 | 方向 | 描述 |
|---|---|---|
| localGuid | in | 初始化一方应用程序的 auth GUID. |
| remoteGuid | out | 远端对等应用程序的 auth GUID. |
| localNonce | in | 初始化一方应用程序生成的 nonce. |
| remoteNonce | out | 远端对等应用程序生成的 nonce. |
| verifier | out | 远端对等应用程序生成的 verifier. |

#### org.alljoyn.Bus.Peer.Authentication.ExchangeGroupKeys 参数

| 参数名 | 方向 | 描述 |
|---|---|---|
| localKeyMatter | in | 初始化一方应用程序的组密钥。|
| remoteKeyMatter | out | 远端对等应用程序的组密钥。 |



[list-of-subjects]: /learn/core/system-description/

[alljoyn-security-arch]: /files/learn/system-desc/alljoyn-security-arch.png
[e2e-security-flow-two-unauth-apps]: /files/learn/system-desc/e2e-security-flow-two-unauth-apps.png
[authenticated-apps-reconnecting]: /files/learn/system-desc/authenticated-apps-reconnecting.png
[exchange-auth-guids]: /files/learn/system-desc/exchange-auth-guids.png
[alljoyn-rsa-keyx-auth-mechanism]: /files/learn/system-desc/alljoyn-rsa-keyx-auth-mechanism.png
[alljoyn-srp-keyx-auth-mechanism]: /files/learn/system-desc/alljoyn-srp-keyx-auth-mechanism.png
[alljoyn-srp-logon-auth-mechanism]: /files/learn/system-desc/alljoyn-srp-logon-auth-mechanism.png
[alljoyn-pin-keyx-auth-mechanism]: /files/learn/system-desc/alljoyn-pin-keyx-auth-mechanism.png
[session-key-generation-between-peer-apps]: /files/learn/system-desc/session-key-generation-between-peer-apps.png
[group-keys-exchange]: /files/learn/system-desc/group-keys-exchange.png
[encrypted-method-call-reply]: /files/learn/system-desc/encrypted-method-call-reply.png
[encrypted-signal]: /files/learn/system-desc/encrypted-signal.png
[key-selection-signal-encryption-provider-app]: /files/learn/system-desc/key-selection-signal-encryption-provider-app.png
[key-selection-signal-decryption-consumer-app]: /files/learn/system-desc/key-selection-signal-decryption-consumer-app.png
   
