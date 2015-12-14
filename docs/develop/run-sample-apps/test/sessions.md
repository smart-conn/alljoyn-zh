# Running the Sessions Application

The Sessions application is a valuable testing tool. This application allows for command line inputs that can help a developer ensure that they have the basics set up in an AllJoyn&trade; application.

This application is supported on the following platforms:
* Linux
* Windows
* Android
* OS X

The Sessions application is found inside the build dist folder under:

'''sh
<build dist folder>/cpp/bin/<sessions or session.exe>
'''

## Usage
Regardless of the platform, when the application runs, you can use the following commands:
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

##Examples
###Simulate a client
Perform the following steps to verify application is advertising and has bound a session.

Assume that an application has been written that uses the AllJoyn framework but there are problems discovering on other applications. The Sessions application can help isolate where the issue exists.

1. Start the Sessions application.
    **NOTE:** Platform must be connected to the same network as the AllJoyn application you wish to debug.
2. Type 'find <prefix>', where <prefix> is the start of the well-known name that should be advertised.
    Typing 'find org.alljoyn' when running the Basic Service would show the following:
    `FoundAdvertisedName name=org.alljoyn.Bus.sample namePrefix=org.alljoyn`
3. Try and join the session by typing 'join org.alljoyn.Bus.sample 25'.  You should see this:
    `JoinSession(org.alljoyn.Bus.sample, 25, ...) succeeded with id = 186166334`

###Simulate a Service
Perform the following steps to set up an application that binds 
a session and advertises a well-known name.
1. Start the Sessions application.
2. Type 'bind 123'.
3. Type 'requestname org.allseen.test'.
4. Type 'advertise org.allseen.test'.
**NOTE:** Open a new session application in a separate terminal 
and verify per steps in Simulate a client: 'find org.alljoyn.test', 
then 'join org.alljoyn.test 123'
