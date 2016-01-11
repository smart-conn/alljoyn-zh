# Events and Actions

应用和设备之间互操作的一种通用机制。它使得应用和设备能够发送易被其他应用和设备发现并接受的事件。相似地，应用和设备能够为其它应用和设备提供发现和调用它们的功能。举例说明，一种接近传感器当有人路过时会发送一个事件，接收到信号的能够路灯会做出开灯的动作。当发现类似的事件时，可以建立一个应用，使得每当传感器有反应时，打开路灯。

接口和其相关可读描述（解释事件）的信号。相似地，动作只是 AllJoyn 接口中的一个方法。使用标准 AllJoyn 内核 API 发送和接收事件，并且调用和处理动作。

这是一个有 `description` 接口的样形式：

```xml
<interface name="com.example.LightBulb">
  <method name="ToggleSwitch">
     <description>Toggle light switch</description>
  </method>
  <signal name="LightOn" sessionless="true">
     <description>The light has been turned on</description>
  </signal>
</interface>
```

因为所有 AllJoyn 接口都是可互操作的，事件和动作也是如此。支持多种语言的 `description` 标签告知用户事件和动作的内容。

当事件被连接到一个动作时，就形成一条语句。使用上述例子中连接为例，“灯已经被打开了，调整灯光开关”

如所有的 AllJoyn 接口一样，事件和动作有安全功能，可以限制能收到事件并调用动作的对象。

## 了解跟多

查看 [Events and Actions API Guide][events-actions] 获取更多关于如何在您的应用中加入 Events and Actions 的指导。

[events-actions]: /develop/api-guide/events-and-actions
