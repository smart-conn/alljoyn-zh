# 运行会话应用程序

会话应用程序是一个很有价值的测试工具。此应用程序支持命令行输入，帮助开发者确保某个 AllJoyn&trade; 应用程序的基本启动。


此应用程序支持一下平台：
* Linux
* Windows
* Android
* OS X

会话应用程序位于 build dist 文件夹内部：

'''sh
<build dist folder>/cpp/bin/<sessions or session.exe>
'''

## 用途
不论运行在哪个平台，当应用程序运行时你都可以使用下列命令：
```
debug <module_name> <level>                                   - Set debug level for a module
requestname <name>                                            - Request a well-known name
releasename <name>                                            - Release a well-known name
bind <port> [isMultipoint] [traffic] [proximity] [transports] - Bind a session port
unbind <port>                                                 - Unbind a session port
advertise <name> [transports]                                 - Advertise a name
canceladvertise <name> [transports]                           - Cancel an advertisement
find <name_prefix>                                            - Discover names that begin with prefix
cancelfind <name_prefix>                                      - Cancel discovering names that begins with prefix
list                                                          - List port bindings, discovered names and active sessions
join <name> <port> [isMultipoint] [traffic] [proximity] [transports] - Join a session
asyncjoin <name> <port> [isMultipoint] [traffic] [proximity] [transports] - Join a session asynchronously
removemember <sessionId> <memberName>                         - Remove a session member
leave <sessionId>                                             - Leave a session
chat <sessionId> <msg>                                        - Send a message over a given session
cchat <sessionId> <msg>                                       - Send a message over a given session with compression
schat <msg>                                                   - Send a sessionless message
cancelsessionless <serialNum>                                 - Cancel a sessionless message
autochat <sessionId> [count] [delay] [minSize] [maxSize]      - Send periodic messages of various sizes
timeout <sessionId> <linkTimeout>                             - Set link timeout for a session
asynctimeout <sessionId> <timeout>                            - Set link timeout for a session asynchronously
chatecho [on|off]                                             - Turn on/off chat messages
addmatch <rule>                                               - Add a DBUS rule
removematch <rule>                                            - Remove a DBUS rule
sendttl <ttl>                                                 - Set ttl (in ms) for all chat messages (0 = infinite)
ping <name>                                                   - Ping a name
exit                                                          - Exit this program
```

##示例
###模拟一个客户端
执行下列操作，验证该应用程序正在推广并已经绑定了一个会话。

假设，一个应用程序已经被写入 AllJoyn 框架，但在发现其他应用程序的功能上还有缺陷。会话应用程序可以将存在缺陷的部分隔离。

1. 启动会话应用程序
    **NOTE:** 平台与需要被 debug 的应用程序需在同一网络中。
2. 键入 'find <prefix>',  <prefix> 是本应被推广的 well-known name 的开头。键入 'find org.alljoyn' ，运行时， Basic Service 会有如下显示：
    `FoundAdvertisedName name=org.alljoyn.Bus.sample namePrefix=org.alljoyn`
3. 键入 'join org.alljoyn.Bus.sample 25'，尝试加入会话。  你将看到以下信息：
    `JoinSession(org.alljoyn.Bus.sample, 25, ...) succeeded with id = 186166334`

###模拟一个服务
执行以下操作，建立一个绑定了会话并推广 well-known name 的应用程序。
1. 运行会话应用程序。
2. 键入 'bind 123'.
3. 键入 'requestname org.allseen.test'.
4. 键入 'advertise org.allseen.test'.
**NOTE:** 在模拟一个客户端时，需要在另一个命令行窗口中打开一个新的会话应用程序，并验证模拟一个客户端 'find org.alljoyn.test' 中的每个步骤，
然后执行 'join org.alljoyn.test 123'.
